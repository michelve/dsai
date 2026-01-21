/**
 * Tests for Token Diff Utility
 */

import { diffTokens, getBreakingChanges, filterDiff, summarizeDiff } from '../diff.js';

import type { TokenCollection } from '../types.js';

describe('diffTokens', () => {
  describe('added tokens', () => {
    it('should detect newly added tokens', () => {
      const oldTokens: TokenCollection = {
        color: {
          primary: { $value: '#0000ff', $type: 'color' },
        },
      };

      const newTokens: TokenCollection = {
        color: {
          primary: { $value: '#0000ff', $type: 'color' },
          secondary: { $value: '#ff0000', $type: 'color' },
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.added).toHaveLength(1);
      expect(diff.added[0]).toMatchObject({
        path: 'color.secondary',
        type: 'added',
        breaking: false,
      });
      expect(diff.totalChanges).toBe(1);
      expect(diff.hasBreaking).toBe(false);
    });

    it('should detect multiple added tokens', () => {
      const oldTokens: TokenCollection = {};

      const newTokens: TokenCollection = {
        color: {
          primary: { $value: '#0000ff', $type: 'color' },
          secondary: { $value: '#ff0000', $type: 'color' },
        },
        spacing: {
          small: { $value: '8px', $type: 'dimension' },
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.added).toHaveLength(3);
      expect(diff.totalChanges).toBe(3);
    });

    it('should handle nested added tokens', () => {
      const oldTokens: TokenCollection = {
        color: {
          brand: {
            primary: { $value: '#0000ff', $type: 'color' },
          },
        },
      };

      const newTokens: TokenCollection = {
        color: {
          brand: {
            primary: { $value: '#0000ff', $type: 'color' },
            secondary: { $value: '#ff0000', $type: 'color' },
          },
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.added).toHaveLength(1);
      expect(diff.added[0].path).toBe('color.brand.secondary');
    });
  });

  describe('removed tokens', () => {
    it('should detect removed tokens as breaking', () => {
      const oldTokens: TokenCollection = {
        color: {
          primary: { $value: '#0000ff', $type: 'color' },
          secondary: { $value: '#ff0000', $type: 'color' },
        },
      };

      const newTokens: TokenCollection = {
        color: {
          primary: { $value: '#0000ff', $type: 'color' },
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.removed).toHaveLength(1);
      expect(diff.removed[0]).toMatchObject({
        path: 'color.secondary',
        type: 'removed',
        breaking: true,
      });
      expect(diff.totalChanges).toBe(1);
      expect(diff.hasBreaking).toBe(true);
    });

    it('should detect multiple removed tokens', () => {
      const oldTokens: TokenCollection = {
        color: {
          primary: { $value: '#0000ff', $type: 'color' },
          secondary: { $value: '#ff0000', $type: 'color' },
        },
        spacing: {
          small: { $value: '8px', $type: 'dimension' },
        },
      };

      const newTokens: TokenCollection = {};

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.removed).toHaveLength(3);
      expect(diff.totalChanges).toBe(3);
      expect(diff.hasBreaking).toBe(true);
    });
  });

  describe('modified tokens', () => {
    it('should detect value changes', () => {
      const oldTokens: TokenCollection = {
        color: {
          primary: { $value: '#0000ff', $type: 'color' },
        },
      };

      const newTokens: TokenCollection = {
        color: {
          primary: { $value: '#0000cc', $type: 'color' },
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.modified).toHaveLength(1);
      expect(diff.modified[0]).toMatchObject({
        path: 'color.primary',
        type: 'modified',
        breaking: false,
      });
      expect(diff.modified[0].valueChange).toMatchObject({
        oldValue: '#0000ff',
        newValue: '#0000cc',
      });
      expect(diff.hasBreaking).toBe(false);
    });

    it('should detect complex value changes', () => {
      const oldTokens: TokenCollection = {
        shadow: {
          card: {
            $value: { x: 0, y: 2, blur: 4, color: '#000' },
            $type: 'shadow',
          },
        },
      };

      const newTokens: TokenCollection = {
        shadow: {
          card: {
            $value: { x: 0, y: 4, blur: 8, color: '#000' },
            $type: 'shadow',
          },
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.modified).toHaveLength(1);
      expect(diff.modified[0].valueChange?.oldValue).toEqual({
        x: 0,
        y: 2,
        blur: 4,
        color: '#000',
      });
      expect(diff.modified[0].valueChange?.newValue).toEqual({
        x: 0,
        y: 4,
        blur: 8,
        color: '#000',
      });
    });

    it('should not detect changes when values are identical', () => {
      const oldTokens: TokenCollection = {
        color: {
          primary: { $value: '#0000ff', $type: 'color' },
        },
      };

      const newTokens: TokenCollection = {
        color: {
          primary: { $value: '#0000ff', $type: 'color' },
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.totalChanges).toBe(0);
      expect(diff.modified).toHaveLength(0);
    });
  });

  describe('type-changed tokens', () => {
    it('should detect type changes as breaking', () => {
      const oldTokens: TokenCollection = {
        size: {
          large: { $value: '16px', $type: 'dimension' },
        },
      };

      const newTokens: TokenCollection = {
        size: {
          large: { $value: '16', $type: 'number' },
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.typeChanged).toHaveLength(1);
      expect(diff.typeChanged[0]).toMatchObject({
        path: 'size.large',
        type: 'type-changed',
        breaking: true,
      });
      expect(diff.typeChanged[0].valueChange).toMatchObject({
        oldType: 'dimension',
        newType: 'number',
      });
      expect(diff.hasBreaking).toBe(true);
    });

    it('should include value changes with type changes', () => {
      const oldTokens: TokenCollection = {
        value: { $value: 100, $type: 'number' },
      };

      const newTokens: TokenCollection = {
        value: { $value: '100px', $type: 'dimension' },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.typeChanged[0].valueChange).toMatchObject({
        oldValue: 100,
        newValue: '100px',
        oldType: 'number',
        newType: 'dimension',
      });
    });

    it('should not flag type change if type is missing in one version', () => {
      const oldTokens: TokenCollection = {
        value: { $value: 100 }, // No type
      };

      const newTokens: TokenCollection = {
        value: { $value: 200 },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.typeChanged).toHaveLength(0);
      expect(diff.modified).toHaveLength(1);
    });
  });

  describe('deprecated tokens', () => {
    it('should detect newly deprecated tokens', () => {
      const oldTokens: TokenCollection = {
        color: {
          old: { $value: '#0000ff', $type: 'color' },
        },
      };

      const newTokens: TokenCollection = {
        color: {
          old: { $value: '#0000ff', $type: 'color', $deprecated: true },
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.deprecated).toHaveLength(1);
      expect(diff.deprecated[0]).toMatchObject({
        path: 'color.old',
        type: 'deprecated',
        breaking: false,
      });
    });

    it('should detect deprecation in extensions', () => {
      const oldTokens: TokenCollection = {
        value: { $value: 100, $type: 'number' },
      };

      const newTokens: TokenCollection = {
        value: { $value: 100, $type: 'number', $extensions: { deprecated: true } },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.deprecated).toHaveLength(1);
    });
  });

  describe('legacy token format', () => {
    it('should handle legacy format (value/type instead of $value/$type)', () => {
      const oldTokens: TokenCollection = {
        color: {
          primary: { value: '#0000ff', type: 'color' },
        },
      };

      const newTokens: TokenCollection = {
        color: {
          primary: { value: '#0000cc', type: 'color' },
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.modified).toHaveLength(1);
      expect(diff.modified[0].valueChange).toMatchObject({
        oldValue: '#0000ff',
        newValue: '#0000cc',
      });
    });

    it('should handle mixed formats', () => {
      const oldTokens: TokenCollection = {
        color: {
          primary: { value: '#0000ff', type: 'color' },
          secondary: { $value: '#ff0000', $type: 'color' },
        },
      };

      const newTokens: TokenCollection = {
        color: {
          primary: { value: '#0000cc', type: 'color' },
          secondary: { $value: '#cc0000', $type: 'color' },
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.modified).toHaveLength(2);
    });
  });

  describe('descriptions', () => {
    it('should capture token descriptions', () => {
      const oldTokens: TokenCollection = {};

      const newTokens: TokenCollection = {
        color: {
          primary: {
            $value: '#0000ff',
            $type: 'color',
            $description: 'Primary brand color',
          },
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.added[0].description).toBe('Primary brand color');
    });

    it('should handle legacy description formats', () => {
      const oldTokens: TokenCollection = {};

      const newTokens: TokenCollection = {
        value: {
          value: 100,
          description: 'Legacy description',
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.added[0].description).toBe('Legacy description');
    });

    it('should handle comment field as description', () => {
      const oldTokens: TokenCollection = {};

      const newTokens: TokenCollection = {
        value: {
          value: 100,
          comment: 'This is a comment',
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.added[0].description).toBe('This is a comment');
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple change types at once', () => {
      const oldTokens: TokenCollection = {
        color: {
          primary: { $value: '#0000ff', $type: 'color' },
          secondary: { $value: '#ff0000', $type: 'color' },
          tertiary: { $value: '#00ff00', $type: 'color' },
        },
      };

      const newTokens: TokenCollection = {
        color: {
          primary: { $value: '#0000cc', $type: 'color' }, // Modified
          secondary: { $value: '#ff0000', $type: 'dimension' }, // Type changed
          quaternary: { $value: '#ffff00', $type: 'color' }, // Added
        },
        // tertiary removed
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.added).toHaveLength(1);
      expect(diff.removed).toHaveLength(1);
      expect(diff.modified).toHaveLength(1);
      expect(diff.typeChanged).toHaveLength(1);
      expect(diff.totalChanges).toBe(4);
      expect(diff.hasBreaking).toBe(true);
    });

    it('should handle deeply nested structures', () => {
      const oldTokens: TokenCollection = {
        theme: {
          light: {
            color: {
              background: {
                primary: { $value: '#ffffff', $type: 'color' },
              },
            },
          },
        },
      };

      const newTokens: TokenCollection = {
        theme: {
          light: {
            color: {
              background: {
                primary: { $value: '#fafafa', $type: 'color' },
              },
            },
          },
        },
      };

      const diff = diffTokens(oldTokens, newTokens);

      expect(diff.modified[0].path).toBe('theme.light.color.background.primary');
    });
  });
});

describe('summarizeDiff', () => {
  it('should create a text summary of changes', () => {
    const diff = {
      added: [{ path: 'color.new', type: 'added' as const, breaking: false }],
      removed: [{ path: 'color.old', type: 'removed' as const, breaking: true }],
      modified: [],
      typeChanged: [],
      deprecated: [],
      totalChanges: 2,
      hasBreaking: true,
    };

    const summary = summarizeDiff(diff);

    expect(summary).toContain('Total changes: 2');
    expect(summary).toContain('breaking');
    expect(summary).toContain('Added: 1');
    expect(summary).toContain('Removed: 1');
  });
});

describe('filterDiff', () => {
  const diff = {
    added: [{ path: 'added', type: 'added' as const, breaking: false }],
    removed: [{ path: 'removed', type: 'removed' as const, breaking: true }],
    modified: [{ path: 'modified', type: 'modified' as const, breaking: false }],
    typeChanged: [{ path: 'type', type: 'type-changed' as const, breaking: true }],
    deprecated: [{ path: 'deprecated', type: 'deprecated' as const, breaking: false }],
    totalChanges: 5,
    hasBreaking: true,
  };

  it('should filter by added type', () => {
    const filtered = filterDiff(diff, ['added']);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].path).toBe('added');
  });

  it('should filter by multiple types', () => {
    const filtered = filterDiff(diff, ['added', 'removed']);
    expect(filtered).toHaveLength(2);
  });

  it('should return empty array for unmatched types', () => {
    const emptyDiff = {
      ...diff,
      added: [],
      removed: [],
      modified: [],
      typeChanged: [],
      deprecated: [],
    };
    const filtered = filterDiff(emptyDiff, ['added']);
    expect(filtered).toHaveLength(0);
  });
});

describe('getBreakingChanges', () => {
  it('should return only breaking changes', () => {
    const diff = {
      added: [{ path: 'added', type: 'added' as const, breaking: false }],
      removed: [{ path: 'removed', type: 'removed' as const, breaking: true }],
      modified: [{ path: 'modified', type: 'modified' as const, breaking: false }],
      typeChanged: [{ path: 'type', type: 'type-changed' as const, breaking: true }],
      deprecated: [{ path: 'deprecated', type: 'deprecated' as const, breaking: false }],
      totalChanges: 5,
      hasBreaking: true,
    };

    const breaking = getBreakingChanges(diff);
    expect(breaking).toHaveLength(2);
    expect(breaking.every((c) => c.breaking)).toBe(true);
  });

  it('should return empty array when no breaking changes', () => {
    const diff = {
      added: [{ path: 'added', type: 'added' as const, breaking: false }],
      removed: [],
      modified: [],
      typeChanged: [],
      deprecated: [],
      totalChanges: 1,
      hasBreaking: false,
    };

    const breaking = getBreakingChanges(diff);
    expect(breaking).toHaveLength(0);
  });
});
