/**
 * Tests for Token Changelog Generator
 */

import { mkdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

import { generateChangelog, generateAndWriteChangelog, writeChangelog } from '../changelog.js';

import type { TokenDiff } from '../diff.js';

const TEST_OUTPUT_DIR = join(process.cwd(), '.test-output');

describe('generateChangelog', () => {
  describe('basic generation', () => {
    it('should generate changelog for added tokens', () => {
      const diff: TokenDiff = {
        added: [
          { path: 'color.primary', type: 'added', breaking: false },
          { path: 'color.secondary', type: 'added', breaking: false },
        ],
        removed: [],
        modified: [],
        typeChanged: [],
        deprecated: [],
        totalChanges: 2,
        hasBreaking: false,
      };

      const result = generateChangelog(diff);

      expect(result.content).toContain('## [Unreleased]');
      expect(result.content).toContain('Total changes:** 2');
      expect(result.content).toContain('### Added');
      expect(result.content).toContain('`color.primary`');
      expect(result.content).toContain('`color.secondary`');
      expect(result.entryCount).toBe(2);
      expect(result.hasBreaking).toBe(false);
    });

    it('should generate changelog for removed tokens', () => {
      const diff: TokenDiff = {
        added: [],
        removed: [{ path: 'color.old', type: 'removed', breaking: true }],
        modified: [],
        typeChanged: [],
        deprecated: [],
        totalChanges: 1,
        hasBreaking: true,
      };

      const result = generateChangelog(diff);

      expect(result.content).toContain('### Breaking Changes');
      expect(result.content).toContain('`color.old`');
      expect(result.content).toContain('⚠️ **BREAKING**');
      expect(result.hasBreaking).toBe(true);
    });

    it('should generate changelog for modified tokens', () => {
      const diff: TokenDiff = {
        added: [],
        removed: [],
        modified: [
          {
            path: 'color.primary',
            type: 'modified',
            breaking: false,
            valueChange: {
              oldValue: '#0000ff',
              newValue: '#0000cc',
            },
          },
        ],
        typeChanged: [],
        deprecated: [],
        totalChanges: 1,
        hasBreaking: false,
      };

      const result = generateChangelog(diff);

      expect(result.content).toContain('### Changed');
      expect(result.content).toContain('`color.primary`');
      expect(result.content).toContain('Before: `#0000ff`');
      expect(result.content).toContain('After: `#0000cc`');
    });

    it('should generate changelog for type-changed tokens', () => {
      const diff: TokenDiff = {
        added: [],
        removed: [],
        modified: [],
        typeChanged: [
          {
            path: 'size.large',
            type: 'type-changed',
            breaking: true,
            valueChange: {
              oldValue: '16px',
              newValue: '16',
              oldType: 'dimension',
              newType: 'number',
            },
          },
        ],
        deprecated: [],
        totalChanges: 1,
        hasBreaking: true,
      };

      const result = generateChangelog(diff);

      expect(result.content).toContain('### Breaking Changes');
      expect(result.content).toContain('`size.large`');
      expect(result.content).toContain('Type: `dimension` → `number`');
      expect(result.content).toContain('⚠️ **BREAKING**');
    });

    it('should generate changelog for deprecated tokens', () => {
      const diff: TokenDiff = {
        added: [],
        removed: [],
        modified: [],
        typeChanged: [],
        deprecated: [{ path: 'color.old', type: 'deprecated', breaking: false }],
        totalChanges: 1,
        hasBreaking: false,
      };

      const result = generateChangelog(diff);

      expect(result.content).toContain('### Deprecated');
      expect(result.content).toContain('`color.old`');
    });
  });

  describe('options', () => {
    const diff: TokenDiff = {
      added: [
        {
          path: 'color.primary',
          type: 'added',
          breaking: false,
          description: 'Primary brand color',
        },
      ],
      removed: [],
      modified: [],
      typeChanged: [],
      deprecated: [],
      totalChanges: 1,
      hasBreaking: false,
    };

    it('should include custom version', () => {
      const result = generateChangelog(diff, { version: '1.2.3' });
      expect(result.content).toContain('## [1.2.3]');
    });

    it('should include custom date', () => {
      const date = new Date(Date.UTC(2024, 0, 15)); // Use UTC to avoid timezone issues
      const result = generateChangelog(diff, { date });
      expect(result.content).toContain('2024-01-15');
    });

    it('should include custom header', () => {
      const result = generateChangelog(diff, { header: '## My Custom Header' });
      expect(result.content).toContain('## My Custom Header');
      expect(result.content).not.toContain('## [Unreleased]');
    });

    it('should include descriptions when enabled', () => {
      const result = generateChangelog(diff, { includeDescriptions: true });
      expect(result.content).toContain('Primary brand color');
    });

    it('should exclude descriptions when disabled', () => {
      const result = generateChangelog(diff, { includeDescriptions: false });
      expect(result.content).not.toContain('Primary brand color');
    });

    it('should exclude values when disabled', () => {
      const modifiedDiff: TokenDiff = {
        added: [],
        removed: [],
        modified: [
          {
            path: 'color.primary',
            type: 'modified',
            breaking: false,
            valueChange: {
              oldValue: '#0000ff',
              newValue: '#0000cc',
            },
          },
        ],
        typeChanged: [],
        deprecated: [],
        totalChanges: 1,
        hasBreaking: false,
      };

      const result = generateChangelog(modifiedDiff, { includeValues: false });
      expect(result.content).not.toContain('Before:');
      expect(result.content).not.toContain('After:');
    });

    it('should truncate long values', () => {
      const modifiedDiff: TokenDiff = {
        added: [],
        removed: [],
        modified: [
          {
            path: 'token',
            type: 'modified',
            breaking: false,
            valueChange: {
              oldValue: 'x'.repeat(200),
              newValue: 'y'.repeat(200),
            },
          },
        ],
        typeChanged: [],
        deprecated: [],
        totalChanges: 1,
        hasBreaking: false,
      };

      const result = generateChangelog(modifiedDiff, { maxValueLength: 50 });
      expect(result.content).toContain('...');
    });
  });

  describe('no changes', () => {
    it('should handle empty diff', () => {
      const diff: TokenDiff = {
        added: [],
        removed: [],
        modified: [],
        typeChanged: [],
        deprecated: [],
        totalChanges: 0,
        hasBreaking: false,
      };

      const result = generateChangelog(diff);
      expect(result.content).toContain('No changes.');
      expect(result.entryCount).toBe(0);
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple change types', () => {
      const diff: TokenDiff = {
        added: [{ path: 'token.new', type: 'added', breaking: false }],
        removed: [{ path: 'token.old', type: 'removed', breaking: true }],
        modified: [
          {
            path: 'token.changed',
            type: 'modified',
            breaking: false,
            valueChange: { oldValue: 'old', newValue: 'new' },
          },
        ],
        typeChanged: [
          {
            path: 'token.typechange',
            type: 'type-changed',
            breaking: true,
            valueChange: { oldValue: 'val', newValue: 'val', oldType: 'old', newType: 'new' },
          },
        ],
        deprecated: [{ path: 'token.deprecated', type: 'deprecated', breaking: false }],
        totalChanges: 5,
        hasBreaking: true,
      };

      const result = generateChangelog(diff);

      expect(result.content).toContain('### Breaking Changes');
      expect(result.content).toContain('### Added');
      expect(result.content).toContain('### Changed');
      expect(result.content).toContain('### Deprecated');
      expect(result.entryCount).toBe(5);
      expect(result.hasBreaking).toBe(true);
    });

    it('should escape Markdown special characters', () => {
      const diff: TokenDiff = {
        added: [{ path: 'token*with[special]_chars', type: 'added', breaking: false }],
        removed: [],
        modified: [],
        typeChanged: [],
        deprecated: [],
        totalChanges: 1,
        hasBreaking: false,
      };

      const result = generateChangelog(diff);
      expect(result.content).toContain('token\\*with\\[special\\]\\_chars');
    });
  });
});

describe('writeChangelog', () => {
  beforeEach(async () => {
    await mkdir(TEST_OUTPUT_DIR, { recursive: true });
  });

  afterEach(async () => {
    await rm(TEST_OUTPUT_DIR, { recursive: true, force: true });
  });

  it('should create new file with header', async () => {
    const filePath = join(TEST_OUTPUT_DIR, 'NEW-CHANGELOG.md');
    const content = '## [1.0.0] - 2024-01-01\n\nSome changes.\n';

    const success = await writeChangelog(content, filePath);
    expect(success).toBe(true);

    const written = await readFile(filePath, 'utf-8');
    expect(written).toContain('# Changelog');
    expect(written).toContain('## [1.0.0]');
  });

  it('should prepend to existing file', async () => {
    const filePath = join(TEST_OUTPUT_DIR, 'EXISTING-CHANGELOG.md');

    // Create initial file
    const initial = '## [1.0.0] - 2024-01-01\n\nInitial release.\n';
    await writeChangelog(initial, filePath);

    // Prepend new content
    const newContent = '## [1.1.0] - 2024-02-01\n\nNew features.\n';
    await writeChangelog(newContent, filePath);

    const written = await readFile(filePath, 'utf-8');
    const lines = written.split('\n');

    // Find positions of version headers
    const v110Index = lines.findIndex((line) => line.includes('[1.1.0]'));
    const v100Index = lines.findIndex((line) => line.includes('[1.0.0]'));

    expect(v110Index).toBeGreaterThan(-1);
    expect(v100Index).toBeGreaterThan(-1);
    expect(v110Index).toBeLessThan(v100Index);
  });

  it('should handle file without header', async () => {
    const filePath = join(TEST_OUTPUT_DIR, 'NO-HEADER-CHANGELOG.md');

    // Create file without header
    const initial = '## [1.0.0] - 2024-01-01\n\nInitial.\n';
    // Manually write without header
    const { writeFile: fsWriteFile } = await import('node:fs/promises');
    await fsWriteFile(filePath, initial, 'utf-8');

    // Prepend new content
    const newContent = '## [1.1.0] - 2024-02-01\n\nNew.\n';
    await writeChangelog(newContent, filePath);

    const written = await readFile(filePath, 'utf-8');
    expect(written).toContain('[1.1.0]');
    expect(written).toContain('[1.0.0]');
  });
});

describe('generateAndWriteChangelog', () => {
  beforeEach(async () => {
    await mkdir(TEST_OUTPUT_DIR, { recursive: true });
  });

  afterEach(async () => {
    await rm(TEST_OUTPUT_DIR, { recursive: true, force: true });
  });

  it('should generate and write in one step', async () => {
    const filePath = join(TEST_OUTPUT_DIR, 'COMBINED-CHANGELOG.md');

    const diff: TokenDiff = {
      added: [{ path: 'token.new', type: 'added', breaking: false }],
      removed: [],
      modified: [],
      typeChanged: [],
      deprecated: [],
      totalChanges: 1,
      hasBreaking: false,
    };

    const result = await generateAndWriteChangelog(diff, filePath, { version: '2.0.0' });

    expect(result.entryCount).toBe(1);
    expect(result.written).toBe(true);

    const written = await readFile(filePath, 'utf-8');
    expect(written).toContain('## [2.0.0]');
    expect(written).toContain('token.new');
  });

  it('should return written: false on error', async () => {
    const diff: TokenDiff = {
      added: [],
      removed: [],
      modified: [],
      typeChanged: [],
      deprecated: [],
      totalChanges: 0,
      hasBreaking: false,
    };

    // Use invalid path to trigger error
    const result = await generateAndWriteChangelog(diff, '/invalid/path/CHANGELOG.md');

    expect(result.written).toBe(false);
  });
});
