#!/usr/bin/env node

/**
 * generate-utils-from-analysis.mjs
 *
 * Generates unified TypeScript utility files from the scanner's unification analysis.
 * Reads .temp/utils-inventory.json and creates utility files at the suggested paths.
 *
 * Enterprise-grade generator with explicit templates for each utility.
 * No placeholders, TODOs, or fallback implementations.
 *
 * Usage:
 *   node tools/scripts/react-utils/generate-utils-from-analysis.mjs [options]
 *
 * Options:
 *   --dry-run       Preview changes without writing files
 *   --only=<name>   Generate only the specified utility
 *   --category=<c>  Generate only utilities in the specified category
 *   --verbose       Show detailed generation information
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../..');

// CLI argument parsing
const args = process.argv.slice(2);
const flags = {
  dryRun: args.includes('--dry-run'),
  verbose: args.includes('--verbose'),
  force: args.includes('--force'),
  only: args.find((a) => a.startsWith('--only='))?.split('=')[1],
  category: args.find((a) => a.startsWith('--category='))?.split('=')[1],
  help: args.includes('--help') || args.includes('-h'),
};

if (flags.help) {
  console.log(`
generate-utils-from-analysis.mjs

Generates unified TypeScript utility files from the scanner's unification analysis.

Usage:
  node tools/scripts/react-utils/generate-utils-from-analysis.mjs [options]

Options:
  --dry-run       Preview changes without writing files
  --only=<name>   Generate only the specified utility (e.g., --only=isSafeHref)
  --category=<c>  Generate only utilities in the specified category
  --verbose       Show detailed generation information
  --force         Overwrite existing generated files if the template changed
  --help, -h      Show this help message

Examples:
  node tools/scripts/react-utils/generate-utils-from-analysis.mjs --dry-run
  node tools/scripts/react-utils/generate-utils-from-analysis.mjs --only=isSafeHref
  node tools/scripts/react-utils/generate-utils-from-analysis.mjs --category=validation
`);
  process.exit(0);
}

// Load inventory
const inventoryPath = path.join(REPO_ROOT, '.temp', 'utils-inventory.json');

if (!fs.existsSync(inventoryPath)) {
  console.error(`❌ Inventory not found at ${inventoryPath}`);
  console.error('   Run the scanner first: node tools/scripts/react-utils/scan-utils-usage.mjs');
  process.exit(1);
}

const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));

/**
 * Enterprise-grade utility templates.
 * Each utility has an explicit, fully-implemented template.
 */
const UTILITY_TEMPLATES = {
  /**
   * isSafeHref - Validates URL safety against XSS attacks
   */
  isSafeHref: (analysis) => {
    const { files } = analysis;
    return `/**
 * isSafeHref - Validates that a URL href is safe to use
 *
 * Blocks dangerous protocols like javascript:, data:, vbscript:, and file:
 * to prevent XSS attacks through malicious URLs.
 *
 * @module utils/validation/isSafeHref
 *
 * Consolidated from:
 * ${files.map((f) => `- ${f}`).join('\n * ')}
 */

/** Dangerous URL protocols that should be blocked */
const BLOCKED_PROTOCOLS = [
  'javascript:',
  'data:',
  'vbscript:',
  'file:',
  'about:blank',
  'text/html',
];

/** Normalizes href for protocol checks and detects encoded payloads */
function normalizeHrefForCheck(href: string): string {
  const trimmed = href.trim().toLowerCase().replace(/\\s+/g, '');
  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

export interface IsSafeHrefOptions {
  /**
   * How to treat undefined/empty href values.
   * - 'safe': Returns true for undefined/empty (default for most components)
   * - 'unsafe': Returns false for undefined/empty (stricter validation)
   *
   * @default 'safe'
   */
  undefinedBehavior?: 'safe' | 'unsafe';
}

/**
 * Checks if a URL href is safe to use in href attributes.
 *
 * @param href - The URL to validate
 * @param options - Configuration options
 * @returns true if the URL is safe, false if it contains a blocked protocol
 *
 * @example
 * // Basic usage - undefined is safe by default
 * isSafeHref(undefined);                    // true
 * isSafeHref('https://example.com');        // true
 * isSafeHref('javascript:alert(1)');        // false
 *
 * @example
 * // Strict mode - undefined is unsafe
 * isSafeHref(undefined, { undefinedBehavior: 'unsafe' }); // false
 * isSafeHref('', { undefinedBehavior: 'unsafe' });        // false
 *
 * @example
 * // All blocked protocols
 * isSafeHref('javascript:void(0)');  // false
 * isSafeHref('data:text/html,...');  // false
 * isSafeHref('vbscript:msgbox(1)');  // false
 * isSafeHref('file:///etc/passwd');  // false
 */
export function isSafeHref(
  href: string | undefined,
  options: IsSafeHrefOptions = {}
): boolean {
  const { undefinedBehavior = 'safe' } = options;

  if (!href || typeof href !== 'string') {
    return undefinedBehavior === 'safe';
  }

  const normalized = normalizeHrefForCheck(href);
  return !BLOCKED_PROTOCOLS.some((protocol) => normalized.startsWith(protocol));
}

export default isSafeHref;
`;
  },

  /**
   * isExternalUrl - Checks if URL points to external domain
   */
  isExternalUrl: (analysis) => {
    const { files } = analysis;
    return `/**
 * isExternalUrl - Checks if a URL is an external link
 *
 * Determines if a URL points to an external domain by checking
 * for http:// or https:// protocol prefixes.
 *
 * @module utils/types/isExternalUrl
 *
 * Consolidated from:
 * ${files.map((f) => `- ${f}`).join('\n * ')}
 */

/**
 * Checks if a URL is an external link (starts with http:// or https://).
 *
 * @param href - The URL to check
 * @returns true if the URL is external, false otherwise
 *
 * @example
 * isExternalUrl('https://google.com');     // true
 * isExternalUrl('http://example.com');     // true
 * isExternalUrl('/about');                 // false
 * isExternalUrl('#section');               // false
 * isExternalUrl(undefined);                // false
 */
export function isExternalUrl(href?: string): boolean {
  if (!href || typeof href !== 'string') {
    return false;
  }
  return href.startsWith('http://') || href.startsWith('https://');
}

export default isExternalUrl;
`;
  },

  /**
   * isValidHref - Validates href is safe to render
   */
  isValidHref: (analysis) => {
    const { files } = analysis;
    return `/**
 * isValidHref - Validates that a href is safe to use
 *
 * Blocks dangerous protocols to mitigate XSS vectors in href attributes while
 * allowing components to opt into strict undefined handling when required.
 *
 * @module utils/validation/isValidHref
 *
 * Consolidated from:
 * ${files.map((f) => `- ${f}`).join('\n * ')}
 */

/** Dangerous URL protocols that should be blocked */
const BLOCKED_PROTOCOLS = [
  'javascript:',
  'data:',
  'vbscript:',
  'file:',
  'about:blank',
  'text/html',
];

/** Normalizes href for protocol checks and detects encoded payloads */
function normalizeHrefForCheck(href: string): string {
  const trimmed = href.trim().toLowerCase().replace(/\\s+/g, '');
  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

export interface IsValidHrefOptions {
  /**
   * How to treat undefined/empty href values.
   * - 'safe': Returns true for undefined/empty (default for most components)
   * - 'unsafe': Returns false for undefined/empty (stricter validation)
   *
   * @default 'safe'
   */
  undefinedBehavior?: 'safe' | 'unsafe';
}

/**
 * Checks if an href is safe to use on anchor elements.
 *
 * @param href - The href value to validate
 * @param options - Configuration options
 * @returns true if href is safe, false otherwise
 *
 * @example
 * isValidHref('/about');                      // true
 * isValidHref('javascript:alert(1)');         // false
 * isValidHref(undefined);                     // true (default safe mode)
 * isValidHref(undefined, { undefinedBehavior: 'unsafe' }); // false
 */
export function isValidHref(
  href: string | undefined,
  options: IsValidHrefOptions = {}
): boolean {
  const { undefinedBehavior = 'safe' } = options;

  if (!href || typeof href !== 'string') {
    return undefinedBehavior === 'safe';
  }

  const normalized = normalizeHrefForCheck(href);
  return !BLOCKED_PROTOCOLS.some((protocol) => normalized.startsWith(protocol));
}

export default isValidHref;
`;
  },

  /**
   * getSafeInputProps - Filters props to whitelist-only safe attributes
   */
  getSafeInputProps: (analysis) => {
    const { files } = analysis;
    return `/**
 * getSafeInputProps - Filters props to only include safe HTML attributes
 *
 * Provides a whitelist-based approach to filtering HTML attributes,
 * blocking dangerous event handlers and attributes for security.
 *
 * @module utils/misc/getSafeInputProps
 *
 * Consolidated from:
 * ${files.map((f) => `- ${f}`).join('\n * ')}
 */

/**
 * Safe whitelist of HTML attributes allowed on input elements.
 * Blocks all event handlers (onClick, onLoad, onError, etc.) and dangerous attributes.
 */
export const SAFE_INPUT_ATTRIBUTES = {
  accept: true,
  acceptCharset: true,
  alt: true,
  autoComplete: true,
  autoFocus: true,
  capture: true,
  className: true,
  contentEditable: true,
  crossOrigin: true,
  data: true,
  datatype: true,
  defaultChecked: true,
  defaultValue: true,
  dir: true,
  disabled: true,
  draggable: true,
  form: true,
  formEncType: true,
  formMethod: true,
  formNoValidate: true,
  formTarget: true,
  height: true,
  hidden: true,
  id: true,
  lang: true,
  list: true,
  max: true,
  maxLength: true,
  min: true,
  minLength: true,
  multiple: true,
  name: true,
  pattern: true,
  placeholder: true,
  prefix: true,
  property: true,
  readOnly: true,
  required: true,
  resource: true,
  rev: true,
  role: true,
  spellCheck: true,
  step: true,
  style: true,
  tabIndex: true,
  title: true,
  translate: true,
  typeof: true,
  value: true,
  vocab: true,
  width: true,
  'aria-activedescendant': true,
  'aria-atomic': true,
  'aria-autocomplete': true,
  'aria-busy': true,
  'aria-checked': true,
  'aria-colcount': true,
  'aria-colindex': true,
  'aria-colspan': true,
  'aria-controls': true,
  'aria-current': true,
  'aria-describedby': true,
  'aria-description': true,
  'aria-details': true,
  'aria-disabled': true,
  'aria-errormessage': true,
  'aria-expanded': true,
  'aria-flowto': true,
  'aria-haspopup': true,
  'aria-hidden': true,
  'aria-invalid': true,
  'aria-keyshortcuts': true,
  'aria-label': true,
  'aria-labelledby': true,
  'aria-level': true,
  'aria-live': true,
  'aria-modal': true,
  'aria-multiline': true,
  'aria-multiselectable': true,
  'aria-orientation': true,
  'aria-owns': true,
  'aria-placeholder': true,
  'aria-posinset': true,
  'aria-pressed': true,
  'aria-readonly': true,
  'aria-relevant': true,
  'aria-required': true,
  'aria-roledescription': true,
  'aria-rowcount': true,
  'aria-rowindex': true,
  'aria-rowspan': true,
  'aria-selected': true,
  'aria-setsize': true,
  'aria-sort': true,
  'aria-valuemax': true,
  'aria-valuemin': true,
  'aria-valuenow': true,
  'aria-valuetext': true,
} as const;

/** Type representing a safe input attribute key */
export type SafeInputAttribute = keyof typeof SAFE_INPUT_ATTRIBUTES;

/** Array of safe input attribute keys for iteration */
const SAFE_INPUT_ATTRIBUTE_KEYS = Object.keys(SAFE_INPUT_ATTRIBUTES) as SafeInputAttribute[];

/**
 * Filters props to only include safe HTML attributes.
 * Blocks dangerous event handlers (onClick, onLoad, onError, etc.) and other
 * potentially unsafe attributes.
 *
 * @param props - The props object to filter
 * @returns A new object containing only safe attributes
 *
 * @example
 * const inputProps = getSafeInputProps({
 *   id: 'email',
 *   name: 'email',
 *   onClick: handleClick,     // blocked - event handler
 *   onError: handleError,     // blocked - event handler
 *   'aria-label': 'Email',
 * });
 * // Result: { id: 'email', name: 'email', 'aria-label': 'Email' }
 */
export function getSafeInputProps(
  props: Record<string, unknown>
): Partial<Record<SafeInputAttribute, unknown>> {
  const safeEntries: Array<[SafeInputAttribute, unknown]> = [];
  for (const safeKey of SAFE_INPUT_ATTRIBUTE_KEYS) {
    const descriptor = Object.getOwnPropertyDescriptor(props, safeKey);
    if (descriptor) {
      safeEntries.push([safeKey, descriptor.value]);
    }
  }
  return Object.fromEntries(safeEntries) as Partial<Record<SafeInputAttribute, unknown>>;
}

export default getSafeInputProps;
`;
  },

  /**
   * mapPlacement - Maps component placement to Floating UI placement
   */
  mapPlacement: (analysis) => {
    const { files } = analysis;
    return `/**
 * mapPlacement - Maps component placement to Floating UI placement
 *
 * Converts DSAi component placement values to Floating UI compatible placements.
 * Currently a pass-through as our placements are already Floating UI compatible.
 *
 * @module utils/misc/mapPlacement
 *
 * Consolidated from:
 * ${files.map((f) => `- ${f}`).join('\n * ')}
 */

import type { Placement } from '@floating-ui/react';

/** Valid placement values for floating UI components */
export type ComponentPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/**
 * Maps component placement to Floating UI placement.
 *
 * @param placement - The component placement value
 * @returns The Floating UI compatible placement
 *
 * @example
 * mapPlacement('bottom-start');  // 'bottom-start'
 * mapPlacement('top');           // 'top'
 * mapPlacement('right-end');     // 'right-end'
 */
export function mapPlacement(placement: ComponentPlacement): Placement {
  return placement;
}

export default mapPlacement;
`;
  },

  /**
   * normalizeTriggers - Normalizes trigger prop to array format
   */
  normalizeTriggers: (analysis) => {
    const { files } = analysis;
    return `/**
 * normalizeTriggers - Normalizes trigger prop to array format
 *
 * Converts a single trigger or array of triggers into a consistent array format
 * for use in floating UI components like Tooltip and Popover.
 *
 * @module utils/misc/normalizeTriggers
 *
 * Consolidated from:
 * ${files.map((f) => `- ${f}`).join('\n * ')}
 */

/** Valid trigger types for floating components */
export type FloatingTrigger = 'hover' | 'focus' | 'click';

/**
 * Normalizes a trigger or array of triggers into a consistent array format.
 *
 * @param trigger - Single trigger or array of triggers
 * @returns Array of triggers
 *
 * @example
 * normalizeTriggers('hover');           // ['hover']
 * normalizeTriggers(['hover', 'focus']); // ['hover', 'focus']
 * normalizeTriggers('click');           // ['click']
 */
export function normalizeTriggers(
  trigger: FloatingTrigger | FloatingTrigger[]
): FloatingTrigger[] {
  if (Array.isArray(trigger)) {
    return trigger;
  }
  return [trigger];
}

export default normalizeTriggers;
`;
  },

  /**
   * getVariantClass - Generates CSS class for component variant
   */
  getVariantClass: (analysis) => {
    const { files } = analysis;
    return `/**
 * getVariantClass - Generates CSS class for component variant
 *
 * Creates a Bootstrap-style CSS class string based on component variant.
 *
 * @module utils/string/getVariantClass
 *
 * Consolidated from:
 * ${files.map((f) => `- ${f}`).join('\n * ')}
 */

/** Standard Bootstrap variant types plus common aliases */
export type BootstrapVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'error'
  | 'default';

export interface VariantClassOptions {
  /**
   * Optional prefix to apply (e.g., 'card', 'text-bg', 'btn')
   * Defaults to 'text-bg' when no prefix is provided.
   */
  prefix?: string;
  /**
   * Optional mapping to normalize variants (e.g., error -> danger)
   */
  map?: Record<string, string>;
}

/**
 * Generates a CSS class string for a component variant.
 *
 * @param variant - The variant key
 * @param options - Optional prefix and variant mapping
 * @returns The CSS class string
 *
 * @example
 * getVariantClass('success');                           // 'text-bg-success'
 * getVariantClass('error', { map: { error: 'danger' } }); // 'text-bg-danger'
 * getVariantClass('primary', { prefix: 'btn' });         // 'btn-primary'
 * getVariantClass('ghost', { prefix: 'card' });          // 'card-ghost'
 */
export function getVariantClass(
  variant: BootstrapVariant | string,
  options: VariantClassOptions = {}
): string {
  const { prefix = 'text-bg', map } = options;
  const normalizedVariant = map?.[variant] ?? variant;

  if (!normalizedVariant) {
    return '';
  }

  return \`\${prefix}-\${normalizedVariant}\`;
}

export default getVariantClass;
`;
  },

  /**
   * ClearIcon - SVG icon component for clear/close actions
   */
  ClearIcon: (analysis) => {
    const { files } = analysis;
    return `/**
 * ClearIcon - SVG icon component for clear/close actions
 *
 * Renders an accessible X icon used for clearing inputs, closing dialogs,
 * or removing items. Uses Bootstrap Icons design language.
 *
 * @module utils/misc/ClearIcon
 *
 * Consolidated from:
 * ${files.map((f) => `- ${f}`).join('\n * ')}
 */

import React from 'react';
import { XIcon } from '../../components/Icon';

/**
 * Renders a clear/close X icon as an SVG.
 *
 * The icon is marked with aria-hidden="true" as it's typically
 * used alongside accessible text or within a button with an aria-label.
 *
 * @returns React SVG element
 *
 * @example
 * // In a clear button
 * <button aria-label="Clear input">
 *   <ClearIcon />
 * </button>
 *
 * @example
 * // With visible text
 * <button>
 *   <ClearIcon />
 *   <span>Clear</span>
 * </button>
 */
export function ClearIcon(): React.JSX.Element {
  return <XIcon aria-hidden size={16} />;
}

export default ClearIcon;
`;
  },

  /**
   * toggleItemEvent - Creates FSM event for toggling single item selection
   */
  toggleItemEvent: (analysis) => {
    const { files } = analysis;
    return `/**
 * toggleItemEvent - Creates FSM event for toggling single item selection
 *
 * Factory function that creates a TOGGLE_ITEM event for finite state machines
 * managing selection state in components like CardList and CheckboxGroup.
 *
 * @module utils/misc/toggleItemEvent
 *
 * Consolidated from:
 * ${files.map((f) => `- ${f}`).join('\n * ')}
 */

/** Event type for toggling a single item's selection state */
export interface ToggleItemEvent {
  readonly type: 'TOGGLE_ITEM';
  readonly value: string;
  readonly totalEnabled: number;
}

/**
 * Creates a TOGGLE_ITEM event for FSM-based selection management.
 *
 * @param value - The identifier of the item to toggle
 * @param totalEnabled - Total number of enabled/selectable items
 * @returns The TOGGLE_ITEM event object
 *
 * @example
 * const event = toggleItemEvent('item-1', 5);
 * // { type: 'TOGGLE_ITEM', value: 'item-1', totalEnabled: 5 }
 *
 * dispatch(toggleItemEvent(cardId, enabledCards.length));
 */
export function toggleItemEvent(value: string, totalEnabled: number): ToggleItemEvent {
  return { type: 'TOGGLE_ITEM', value, totalEnabled };
}

export default toggleItemEvent;
`;
  },

  /**
   * clearAllEvent - Creates FSM event for clearing all selections
   */
  clearAllEvent: (analysis) => {
    const { files } = analysis;
    return `/**
 * clearAllEvent - Creates FSM event for clearing all selections
 *
 * Factory function that creates a CLEAR_ALL event for finite state machines
 * managing selection state. Used to deselect all currently selected items.
 *
 * @module utils/misc/clearAllEvent
 *
 * Consolidated from:
 * ${files.map((f) => `- ${f}`).join('\n * ')}
 */

/** Event type for clearing all selections */
export interface ClearAllEvent {
  readonly type: 'CLEAR_ALL';
}

/**
 * Creates a CLEAR_ALL event for FSM-based selection management.
 *
 * @returns The CLEAR_ALL event object
 *
 * @example
 * const event = clearAllEvent();
 * // { type: 'CLEAR_ALL' }
 *
 * dispatch(clearAllEvent());
 */
export function clearAllEvent(): ClearAllEvent {
  return { type: 'CLEAR_ALL' };
}

export default clearAllEvent;
`;
  },

  /**
   * selectAllEvent - Creates FSM event for selecting all enabled items
   */
  selectAllEvent: (analysis) => {
    const { files } = analysis;
    return `/**
 * selectAllEvent - Creates FSM event for selecting all enabled items
 *
 * Supports both value-based (CardList/CheckboxGroup) and row-based (Table) selections
 * by including both enabledValues and enabledRowIds on the event payload.
 *
 * @module utils/misc/selectAllEvent
 *
 * Consolidated from:
 * ${files.map((f) => `- ${f}`).join('\n * ')}
 */

/** Row identifier type used by table selection */
export type RowId = string | number;

/** Event type for selecting all enabled items */
export interface SelectAllEvent {
  readonly type: 'SELECT_ALL';
  /** All enabled option values (for value-based selections) */
  readonly enabledValues?: string[];
  /** All enabled row identifiers (for row-based selections) */
  readonly enabledRowIds?: RowId[];
  /** Total count of enabled items */
  readonly totalEnabled: number;
}

/**
 * Creates a SELECT_ALL event for FSM-based selection management.
 *
 * The payload includes both enabledValues and enabledRowIds so reducers that
 * expect either shape remain compatible.
 *
 * @param enabled - Array of enabled values or row IDs
 * @param totalEnabled - Total number of enabled items
 * @returns The SELECT_ALL event object
 */
export function selectAllEvent(
  enabled: Array<string | number>,
  totalEnabled: number
): SelectAllEvent {
  const enabledValues = enabled.map((v) => String(v));
  const enabledRowIds = enabled.map((v) => v as RowId);
  return { type: 'SELECT_ALL', enabledValues, enabledRowIds, totalEnabled };
}

export default selectAllEvent;
`;
  },

  /**
   * toggleAllEvent - Creates FSM event for toggling all enabled items
   */
  toggleAllEvent: (analysis) => {
    const { files } = analysis;
    return `/**
 * toggleAllEvent - Creates FSM event for toggling all enabled items
 *
 * Supports both value-based (CheckboxGroup) and row-based (Table) selections
 * by including both enabledValues and enabledRowIds on the event payload.
 *
 * @module utils/misc/toggleAllEvent
 *
 * Consolidated from:
 * ${files.map((f) => `- ${f}`).join('\n * ')}
 */

/** Row identifier type used by table selection */
export type RowId = string | number;

/** Event type for toggling all enabled items */
export interface ToggleAllEvent {
  readonly type: 'TOGGLE_ALL';
  /** Total count of enabled items */
  readonly totalEnabled: number;
  /** All enabled option values (for value-based selections) */
  readonly enabledValues?: string[];
  /** All enabled row identifiers (for row-based selections) */
  readonly enabledRowIds?: RowId[];
}

/**
 * Creates a TOGGLE_ALL event for FSM-based selection management.
 *
 * The payload includes both enabledValues and enabledRowIds so reducers that
 * expect either shape remain compatible.
 *
 * @param enabled - Array of enabled values or row IDs
 * @param totalEnabled - Total number of enabled items
 * @returns The TOGGLE_ALL event object
 */
export function toggleAllEvent(
  enabled: Array<string | number>,
  totalEnabled: number
): ToggleAllEvent {
  const enabledValues = enabled.map((v) => String(v));
  const enabledRowIds = enabled.map((v) => v as RowId);
  return { type: 'TOGGLE_ALL', enabledValues, enabledRowIds, totalEnabled };
}

export default toggleAllEvent;
`;
  },
};

/**
 * Check if we should generate this utility
 */
function shouldGenerate(analysis) {
  const { name, differences, unsupportedReason } = analysis;

  if (unsupportedReason) {
    return false;
  }

  if (flags.only && name !== flags.only) {
    return false;
  }

  if (flags.category && analysis.category !== flags.category) {
    return false;
  }

  // Only generate utilities that have explicit templates
  if (!UTILITY_TEMPLATES[name]) {
    return false;
  }

  // Skip FSM-specific helpers with incompatible signatures
  const fsmSpecificHelpers = [
    'resetFromPropsEvent',
    'deriveVisualState',
    'isNoneSelected',
    'isSomeSelected',
    'isAllSelected',
    'isOneSelected',
    'isValueSelected',
    'getSelectedCount',
  ];

  if (fsmSpecificHelpers.includes(name)) {
    if (differences.parameterVariations && differences.parameterVariations.length > 1) {
      return false;
    }
    if (differences.returnTypeVariations && differences.returnTypeVariations.length > 1) {
      return false;
    }
  }

  return true;
}

/**
 * Generate a utility file
 */
function generateUtility(analysis) {
  const { name, unifiedProposal } = analysis;
  let { suggestedPath } = unifiedProposal;
  if (name === 'ClearIcon') {
    suggestedPath = suggestedPath.replace(/\.ts$/, '.tsx');
  }

  const template = UTILITY_TEMPLATES[name];
  if (!template) {
    throw new Error(`No template defined for utility: ${name}`);
  }

  const content = template(analysis);
  const fullPath = path.join(REPO_ROOT, suggestedPath);
  const dir = path.dirname(fullPath);

  return {
    name,
    path: fullPath,
    relativePath: suggestedPath,
    dir,
    content,
    analysis,
  };
}

/**
 * Generate barrel/index files for a category
 */
function generateCategoryIndex(category, utilities) {
  const exports = utilities.map((u) => `export { ${u.name} } from './${u.name}';`).join('\n');

  return `/**
 * ${category} utilities
 *
 * @module utils/${category}
 */

${exports}
`;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔧 Utility Generator');
  console.log('====================\n');

  if (flags.dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be written\n');
  }

  const { unificationAnalysis } = inventory;

  if (!unificationAnalysis || unificationAnalysis.length === 0) {
    console.log('❌ No unification analysis found in inventory.');
    console.log('   Run the scanner with inline helper detection first.');
    process.exit(1);
  }

  // Filter analyses based on flags and available templates
  const unsupported = [];
  const toGenerate = unificationAnalysis.filter((analysis) => {
    const eligible = shouldGenerate(analysis);
    if (!eligible) {
      unsupported.push(analysis);
    }
    return eligible;
  });

  if (toGenerate.length === 0) {
    console.log('❌ No utilities match the specified filters.');
    process.exit(1);
  }

  console.log(`📦 Found ${toGenerate.length} utilities to generate:\n`);

  const generated = [];
  const overwritten = [];
  const skipped = [];
  const unchanged = [];
  const byCategory = {};
  const unsupportedSummaries = unsupported.map((analysis) => {
    const reasons = [];
    if (!UTILITY_TEMPLATES[analysis.name]) {
      reasons.push('no template');
    }
    if (
      analysis.differences?.parameterVariations &&
      analysis.differences.parameterVariations.length > 1
    ) {
      reasons.push('incompatible parameter variations');
    }
    if (
      analysis.differences?.returnTypeVariations &&
      analysis.differences.returnTypeVariations.length > 1
    ) {
      reasons.push('incompatible return type variations');
    }
    return { name: analysis.name, category: analysis.category, reasons };
  });

  for (const analysis of toGenerate) {
    const result = generateUtility(analysis);

    // Group by category
    const cat = analysis.category;
    if (!byCategory[cat]) {
      byCategory[cat] = [];
    }
    byCategory[cat].push(result);

    // Check if file already exists
    if (fs.existsSync(result.path)) {
      if (!flags.force) {
        console.log(`⏭️  ${result.name} - already exists at ${result.relativePath}`);
        skipped.push(result);
        continue;
      }

      const currentContent = fs.readFileSync(result.path, 'utf-8');
      if (currentContent === result.content) {
        console.log(`⏭️  ${result.name} - up to date at ${result.relativePath}`);
        unchanged.push(result);
        continue;
      }

      if (flags.verbose) {
        console.log(`\n♻️  ${result.name}`);
        console.log(`   Category: ${analysis.category}`);
        console.log(`   Path: ${result.relativePath}`);
        console.log(`   From: ${analysis.files.length} files`);
        console.log('   Action: overwrite (template updated)');
      } else {
        console.log(`♻️  ${result.name} → ${result.relativePath} (overwriting)`);
      }

      if (!flags.dryRun) {
        fs.writeFileSync(result.path, result.content, 'utf-8');
      }

      overwritten.push(result);
      continue;
    }

    if (flags.verbose) {
      console.log(`\n📄 ${result.name}`);
      console.log(`   Category: ${analysis.category}`);
      console.log(`   Path: ${result.relativePath}`);
      console.log(`   From: ${analysis.files.length} files`);
    } else {
      console.log(`✅ ${result.name} → ${result.relativePath}`);
    }

    if (!flags.dryRun) {
      if (!fs.existsSync(result.dir)) {
        fs.mkdirSync(result.dir, { recursive: true });
      }
      fs.writeFileSync(result.path, result.content, 'utf-8');
    }

    generated.push(result);
  }

  // Generate category index files
  console.log('\n📁 Category index files:');
  for (const [category, utilities] of Object.entries(byCategory)) {
    const indexPath = path.join(REPO_ROOT, 'packages/@dsai/react/src/utils', category, 'index.ts');
    const indexContent = generateCategoryIndex(category, utilities);

    if (flags.verbose) {
      console.log(`\n📄 ${category}/index.ts`);
      console.log(`   Exports: ${utilities.map((u) => u.name).join(', ')}`);
    } else {
      console.log(`   ${category}/index.ts (${utilities.length} exports)`);
    }

    if (!flags.dryRun && (generated.length > 0 || overwritten.length > 0 || flags.force)) {
      const dir = path.dirname(indexPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(indexPath, indexContent, 'utf-8');
    }
  }

  // Summary
  console.log('\n📊 Summary');
  console.log('==========');
  console.log(`Generated: ${generated.length}`);
  console.log(`Overwritten: ${overwritten.length}`);
  console.log(`Skipped (already exist): ${skipped.length}`);
  console.log(`Unchanged (up to date): ${unchanged.length}`);
  console.log(`Total: ${toGenerate.length}`);
  console.log(`Unsupported (no template or incompatible signature): ${unsupported.length}`);

  if (unsupportedSummaries.length > 0) {
    console.log('\n🚧 Unsupported utilities (template needed or signatures differ):');
    for (const item of unsupportedSummaries) {
      console.log(` - ${item.name} [${item.category}]: ${item.reasons.join(', ') || 'unknown'}`);
    }
  }

  if (flags.dryRun) {
    console.log('\n💡 Run without --dry-run to create the files.');
  }

  if (generated.length > 0 && !flags.dryRun) {
    console.log('\n📋 Next Steps');
    console.log('=============');
    console.log('1. Review the generated files');
    console.log('2. Run the migration script to update component imports:');
    console.log('   node tools/scripts/react-utils/migrate-inline-utils.mjs');
    console.log('3. Run tests to verify: pnpm test');

    const migrationData = {
      generated: generated.map((g) => ({
        name: g.name,
        path: g.relativePath,
        migrationSteps: g.analysis.unifiedProposal.migrationSteps,
      })),
      timestamp: new Date().toISOString(),
    };

    const migrationPath = path.join(REPO_ROOT, '.temp', 'generated-utils.json');
    fs.writeFileSync(migrationPath, JSON.stringify(migrationData, null, 2));
    console.log(`\n📝 Migration data written to: .temp/generated-utils.json`);
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  if (flags.verbose) {
    console.error(err.stack);
  }
  process.exit(1);
});
