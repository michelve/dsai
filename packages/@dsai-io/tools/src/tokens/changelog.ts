/**
 * Token Changelog Generator
 *
 * Generates human-readable changelogs from token diffs in Markdown format.
 *
 * @packageDocumentation
 */

import { existsSync } from 'node:fs';
import { writeFile, readFile } from 'node:fs/promises';

import type { TokenDiff, TokenChange } from './diff.js';
import type { TokenCollection } from './types.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Options for changelog generation
 */
export interface ChangelogOptions {
  /** Version number (e.g., '1.2.0') */
  version?: string;
  /** Release date (defaults to today) */
  date?: Date;
  /** Custom header for the changelog entry */
  header?: string;
  /** Whether to include descriptions */
  includeDescriptions?: boolean;
  /** Whether to include value changes (before/after) */
  includeValues?: boolean;
  /** Maximum value length to display (truncates longer values) */
  maxValueLength?: number;
  /** Whether to group by change type */
  groupByType?: boolean;
}

/**
 * Result of changelog generation
 */
export interface ChangelogResult {
  /** Generated Markdown content */
  content: string;
  /** Number of entries in the changelog */
  entryCount: number;
  /** Whether there are breaking changes */
  hasBreaking: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format a date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a value for display (truncate if too long)
 */
function formatValue(value: unknown, maxLength = 100): string {
  const str = typeof value === 'string' ? value : JSON.stringify(value);

  if (str.length <= maxLength) {
    return str;
  }

  return `${str.slice(0, maxLength)}...`;
}

/**
 * Escape Markdown special characters
 */
function escapeMarkdown(text: string): string {
  return text.replaceAll(/[*_`[\]]/g, String.raw`\$&`);
}

/**
 * Generate Markdown for a single token change
 */
function formatChange(change: TokenChange, options: ChangelogOptions): string {
  const lines: string[] = [];

  // Token path with breaking indicator
  const breaking = change.breaking ? ' ⚠️ **BREAKING**' : '';
  lines.push(`- \`${escapeMarkdown(change.path)}\`${breaking}`);

  // Description
  if (options.includeDescriptions && change.description) {
    lines.push(`  - ${change.description}`);
  }

  // Value change details
  if (options.includeValues && change.valueChange) {
    const { oldValue, newValue, oldType, newType } = change.valueChange;

    if (change.type === 'type-changed') {
      lines.push(`  - Type: \`${oldType}\` → \`${newType}\``);
    }

    const oldFormatted = formatValue(oldValue, options.maxValueLength);
    const newFormatted = formatValue(newValue, options.maxValueLength);

    if (change.type === 'modified' || change.type === 'type-changed') {
      lines.push(
        `  - Before: \`${escapeMarkdown(oldFormatted)}\``,
        `  - After: \`${escapeMarkdown(newFormatted)}\``
      );
    }
  }

  return lines.join('\n');
}

/**
 * Generate a section for a specific change type
 */
function formatSection(title: string, changes: TokenChange[], options: ChangelogOptions): string {
  if (changes.length === 0) {
    return '';
  }

  const lines: string[] = [];
  lines.push(`### ${title}`, '');

  for (const change of changes) {
    lines.push(formatChange(change, options));
  }

  lines.push('');
  return lines.join('\n');
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Generate a changelog entry from a token diff
 *
 * @param diff - Token diff to generate changelog from
 * @param options - Changelog options
 * @returns Generated changelog content
 */
export function generateChangelog(
  diff: TokenDiff,
  options: ChangelogOptions = {}
): ChangelogResult {
  const {
    version = 'Unreleased',
    date = new Date(),
    header,
    includeDescriptions = true,
    includeValues = true,
    maxValueLength = 100,
    groupByType = true,
  } = options;

  const lines: string[] = [];

  // Header
  if (header) {
    lines.push(header);
  } else {
    const dateStr = formatDate(date);
    lines.push(`## [${version}] - ${dateStr}`);
  }

  lines.push('');

  // Summary
  if (diff.totalChanges === 0) {
    lines.push('No changes.', '');
    return {
      content: lines.join('\n'),
      entryCount: 0,
      hasBreaking: false,
    };
  }

  if (diff.hasBreaking) {
    lines.push('⚠️  **This release contains breaking changes**', '');
  }

  lines.push(`**Total changes:** ${diff.totalChanges}`, '');

  const sectionOpts = { ...options, includeDescriptions, includeValues, maxValueLength };

  if (groupByType) {
    const sections: Array<[string, TokenChange[], Partial<ChangelogOptions>]> = [
      ['Breaking Changes', [...diff.removed, ...diff.typeChanged], sectionOpts],
      ['Added', diff.added, { ...sectionOpts, includeValues: false }],
      ['Changed', diff.modified, sectionOpts],
      ['Deprecated', diff.deprecated, { ...sectionOpts, includeValues: false }],
    ];
    for (const [title, changes, opts] of sections) {
      if (changes.length > 0) {
        lines.push(formatSection(title, changes, opts));
      }
    }
  } else {
    const allChanges = [
      ...diff.removed, ...diff.typeChanged, ...diff.added,
      ...diff.modified, ...diff.deprecated,
    ];
    for (const change of allChanges) {
      lines.push(formatChange(change, sectionOpts));
    }
    lines.push('');
  }

  return {
    content: lines.join('\n'),
    entryCount: diff.totalChanges,
    hasBreaking: diff.hasBreaking,
  };
}

/**
 * Write changelog to file (append mode)
 *
 * @param content - Changelog content to write
 * @param filePath - Path to changelog file
 * @returns Whether the write was successful
 */
export async function writeChangelog(content: string, filePath: string): Promise<boolean> {
  try {
    let finalContent: string;

    // If file exists, prepend new content
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(filePath)) {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const existingContent = await readFile(filePath, 'utf-8');

      // Check if there's a header (# Changelog)
      const hasHeader = existingContent.trim().startsWith('#');

      if (hasHeader) {
        // Insert after first line
        const lines = existingContent.split('\n');
        const header = lines[0];
        const rest = lines.slice(1).join('\n');
        finalContent = `${header}\n\n${content}${rest}`;
      } else {
        // Prepend
        finalContent = `${content}\n${existingContent}`;
      }
    } else {
      // Create new file with header
      finalContent = `# Changelog\n\nAll notable changes to design tokens will be documented in this file.\n\n${content}`;
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await writeFile(filePath, finalContent, 'utf-8');
    return true;
  } catch (error) {
    console.error('Failed to write changelog:', error);
    return false;
  }
}

/**
 * Generate and write changelog in one step
 *
 * @param diff - Token diff to generate changelog from
 * @param filePath - Path to changelog file
 * @param options - Changelog options
 * @returns Result of changelog generation
 */
export async function generateAndWriteChangelog(
  diff: TokenDiff,
  filePath: string,
  options: ChangelogOptions = {}
): Promise<ChangelogResult & { written: boolean }> {
  const result = generateChangelog(diff, options);
  const written = await writeChangelog(result.content, filePath);

  return {
    ...result,
    written,
  };
}

/**
 * CLI entry point for generating changelog from two token files
 *
 * @param oldTokensPath - Path to old/previous tokens file
 * @param newTokensPath - Path to new/current tokens file
 * @param outputPath - Path to changelog file (default: 'TOKENS-CHANGELOG.md')
 * @param version - Version number for the changelog entry
 * @returns Whether the operation was successful
 */
export async function generateChangelogCLI(
  oldTokensPath: string,
  newTokensPath: string,
  outputPath = 'TOKENS-CHANGELOG.md',
  version?: string
): Promise<boolean> {
  /* eslint-disable no-console */
  try {
    console.log('📝 Generating token changelog...\n');

    // Import required modules dynamically
    const { readFile: fsReadFile } = await import('node:fs/promises');
    const { diffTokens: diffFn } = await import('./diff.js');

    // Load token files
    console.log(`📖 Reading old tokens: ${oldTokensPath}`);
    const oldContent = await fsReadFile(oldTokensPath, 'utf-8');
    const oldTokens = JSON.parse(oldContent) as TokenCollection;

    console.log(`📖 Reading new tokens: ${newTokensPath}`);
    const newContent = await fsReadFile(newTokensPath, 'utf-8');
    const newTokens = JSON.parse(newContent) as TokenCollection;

    // Compute diff
    console.log('🔍 Computing differences...');
    const diff = diffFn(oldTokens, newTokens);

    if (diff.totalChanges === 0) {
      console.log('✨ No changes detected.');
      return true;
    }

    console.log(`\n📊 Summary:`);
    console.log(`  • Total changes: ${diff.totalChanges}`);
    if (diff.added.length > 0) {
      console.log(`  • Added: ${diff.added.length}`);
    }
    if (diff.removed.length > 0) {
      console.log(`  • Removed: ${diff.removed.length} ⚠️`);
    }
    if (diff.modified.length > 0) {
      console.log(`  • Modified: ${diff.modified.length}`);
    }
    if (diff.typeChanged.length > 0) {
      console.log(`  • Type changed: ${diff.typeChanged.length} ⚠️`);
    }
    if (diff.deprecated.length > 0) {
      console.log(`  • Deprecated: ${diff.deprecated.length}`);
    }

    if (diff.hasBreaking) {
      console.log('\n⚠️  Warning: This release contains breaking changes!');
    }

    // Generate and write changelog
    console.log(`\n📄 Writing changelog to: ${outputPath}`);
    const result = await generateAndWriteChangelog(diff, outputPath, {
      version,
      includeDescriptions: true,
      includeValues: true,
    });

    if (result.written) {
      console.log('✅ Changelog generated successfully!');
      return true;
    } else {
      console.error('❌ Failed to write changelog file');
      return false;
    }
  } catch (error) {
    console.error('❌ Error generating changelog:', error);
    return false;
  }
  /* eslint-enable no-console */
}
