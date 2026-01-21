/**
 * Token Diff Utility
 *
 * Compares token collections to detect changes for changelog generation.
 * Identifies added, removed, modified, and type-changed tokens.
 *
 * @packageDocumentation
 */

import type { TokenCollection } from './types.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Types of changes that can occur to tokens
 */
export type TokenChangeType = 'added' | 'removed' | 'modified' | 'type-changed' | 'deprecated';

/**
 * Details about a token value change
 */
export interface TokenValueChange {
  /** Previous value */
  oldValue: unknown;
  /** New value */
  newValue: unknown;
  /** Previous type */
  oldType?: string;
  /** New type */
  newType?: string;
}

/**
 * Information about a single token change
 */
export interface TokenChange {
  /** Full token path (e.g., 'color.brand.primary') */
  path: string;
  /** Type of change */
  type: TokenChangeType;
  /** Value change details (for modified/type-changed) */
  valueChange?: TokenValueChange;
  /** Token description */
  description?: string;
  /** Whether this is a breaking change */
  breaking: boolean;
}

/**
 * Result of comparing two token collections
 */
export interface TokenDiff {
  /** Tokens that were added */
  added: TokenChange[];
  /** Tokens that were removed */
  removed: TokenChange[];
  /** Tokens whose values changed */
  modified: TokenChange[];
  /** Tokens whose types changed (breaking) */
  typeChanged: TokenChange[];
  /** Tokens marked as deprecated */
  deprecated: TokenChange[];
  /** Total number of changes */
  totalChanges: number;
  /** Whether there are breaking changes */
  hasBreaking: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a value is a token (has $value or value property)
 */
function isToken(
  obj: unknown
): obj is { $value?: unknown; value?: unknown; $type?: string; type?: string } {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const token = obj as Record<string, unknown>;
  return '$value' in token || 'value' in token;
}

/**
 * Get token value (supports both DTCG and legacy formats)
 */
function getTokenValue(token: unknown): unknown {
  if (!isToken(token)) {
    return undefined;
  }

  return token.$value ?? token.value;
}

/**
 * Get token type (supports both DTCG and legacy formats)
 */
function getTokenType(token: unknown): string | undefined {
  if (!isToken(token)) {
    return undefined;
  }

  return token.$type ?? token.type;
}

/**
 * Get token description
 */
function getTokenDescription(token: unknown): string | undefined {
  if (!isToken(token)) {
    return undefined;
  }

  const t = token as { $description?: string; description?: string; comment?: string };
  return t.$description ?? t.description ?? t.comment;
}

/**
 * Flatten nested token collection into path-value pairs
 */
function flattenTokens(
  collection: TokenCollection,
  prefix = ''
): Map<string, { value: unknown; type?: string; description?: string; token: unknown }> {
  const result = new Map<
    string,
    { value: unknown; type?: string; description?: string; token: unknown }
  >();

  for (const [key, value] of Object.entries(collection)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (isToken(value)) {
      result.set(path, {
        value: getTokenValue(value),
        type: getTokenType(value),
        description: getTokenDescription(value),
        token: value,
      });
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recurse into nested objects
      const nested = flattenTokens(value as TokenCollection, path);
      for (const [nestedPath, nestedValue] of nested) {
        result.set(nestedPath, nestedValue);
      }
    }
  }

  return result;
}

/**
 * Check if a token is deprecated
 */
function isDeprecated(token: unknown): boolean {
  if (!isToken(token)) {
    return false;
  }

  const t = token as {
    $deprecated?: boolean;
    deprecated?: boolean;
    $extensions?: { deprecated?: boolean };
  };
  return t.$deprecated === true || t.deprecated === true || t.$extensions?.deprecated === true;
}

/**
 * Deep equality check for values
 */
function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'object' && a !== null && b !== null) {
    const aKeys = Object.keys(a as object);
    const bKeys = Object.keys(b as object);

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    return aKeys.every((key) => {
      const aObj = a as Record<string, unknown>;
      const bObj = b as Record<string, unknown>;
      // eslint-disable-next-line security/detect-object-injection
      const aValue = aObj[key];
      // eslint-disable-next-line security/detect-object-injection
      const bValue = bObj[key];
      return isEqual(aValue, bValue);
    });
  }

  return false;
}

// ============================================================================
// Main Diff Function
// ============================================================================

/**
 * Compare two token collections and return the differences
 *
 * @param oldTokens - Previous version of tokens
 * @param newTokens - New version of tokens
 * @returns Detailed diff of all changes
 */
export function diffTokens(oldTokens: TokenCollection, newTokens: TokenCollection): TokenDiff {
  const oldFlat = flattenTokens(oldTokens);
  const newFlat = flattenTokens(newTokens);

  const added: TokenChange[] = [];
  const removed: TokenChange[] = [];
  const modified: TokenChange[] = [];
  const typeChanged: TokenChange[] = [];
  const deprecated: TokenChange[] = [];

  // Find added and modified tokens
  for (const [path, newData] of newFlat) {
    const oldData = oldFlat.get(path);

    if (!oldData) {
      // Token was added
      added.push({
        path,
        type: 'added',
        description: newData.description,
        breaking: false,
      });
    } else {
      // Check for type change (breaking)
      if (oldData.type && newData.type && oldData.type !== newData.type) {
        typeChanged.push({
          path,
          type: 'type-changed',
          valueChange: {
            oldValue: oldData.value,
            newValue: newData.value,
            oldType: oldData.type,
            newType: newData.type,
          },
          description: newData.description,
          breaking: true,
        });
      }
      // Check for value change
      else if (!isEqual(oldData.value, newData.value)) {
        modified.push({
          path,
          type: 'modified',
          valueChange: {
            oldValue: oldData.value,
            newValue: newData.value,
            oldType: oldData.type,
            newType: newData.type,
          },
          description: newData.description,
          breaking: false,
        });
      }
      // Check for deprecation
      else if (isDeprecated(newData.token) && !isDeprecated(oldData.token)) {
        deprecated.push({
          path,
          type: 'deprecated',
          description: newData.description,
          breaking: false,
        });
      }
    }
  }

  // Find removed tokens (breaking)
  for (const [path, oldData] of oldFlat) {
    if (!newFlat.has(path)) {
      removed.push({
        path,
        type: 'removed',
        description: oldData.description,
        breaking: true,
      });
    }
  }

  const totalChanges =
    added.length + removed.length + modified.length + typeChanged.length + deprecated.length;
  const hasBreaking = removed.length > 0 || typeChanged.length > 0;

  return {
    added,
    removed,
    modified,
    typeChanged,
    deprecated,
    totalChanges,
    hasBreaking,
  };
}

/**
 * Get a summary of changes as a plain text description
 */
export function summarizeDiff(diff: TokenDiff): string {
  const lines: string[] = [];

  lines.push(`Total changes: ${diff.totalChanges}`);

  if (diff.hasBreaking) {
    lines.push('⚠️  Contains breaking changes');
  }

  if (diff.added.length > 0) {
    lines.push(`Added: ${diff.added.length}`);
  }

  if (diff.removed.length > 0) {
    lines.push(`Removed: ${diff.removed.length} (breaking)`);
  }

  if (diff.modified.length > 0) {
    lines.push(`Modified: ${diff.modified.length}`);
  }

  if (diff.typeChanged.length > 0) {
    lines.push(`Type changed: ${diff.typeChanged.length} (breaking)`);
  }

  if (diff.deprecated.length > 0) {
    lines.push(`Deprecated: ${diff.deprecated.length}`);
  }

  return lines.join('\n');
}

/**
 * Filter diff by change type
 */
export function filterDiff(diff: TokenDiff, types: TokenChangeType[]): TokenChange[] {
  const changes: TokenChange[] = [];

  if (types.includes('added')) {
    changes.push(...diff.added);
  }
  if (types.includes('removed')) {
    changes.push(...diff.removed);
  }
  if (types.includes('modified')) {
    changes.push(...diff.modified);
  }
  if (types.includes('type-changed')) {
    changes.push(...diff.typeChanged);
  }
  if (types.includes('deprecated')) {
    changes.push(...diff.deprecated);
  }

  return changes;
}

/**
 * Get only breaking changes
 */
export function getBreakingChanges(diff: TokenDiff): TokenChange[] {
  return [...diff.removed, ...diff.typeChanged];
}
