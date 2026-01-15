/**
 * Unit tests for icon naming utilities
 *
 * Tests cover:
 * - toComponentName function
 * - toIconName function
 * - isValidIconName function
 * - normalizeIconName function
 */

import {
  toComponentName,
  toIconName,
  isValidIconName,
  normalizeIconName,
} from '../../../../src/icons/utils/naming.js';

// ============================================================================
// toComponentName
// ============================================================================

describe('toComponentName', () => {
  it('should convert kebab-case to PascalCase', () => {
    expect(toComponentName('arrow-left')).toBe('ArrowLeft');
  });

  it('should convert snake_case to PascalCase', () => {
    expect(toComponentName('my_icon')).toBe('MyIcon');
  });

  it('should handle multi-word names', () => {
    expect(toComponentName('chevron-down-small')).toBe('ChevronDownSmall');
  });

  it('should prefix with Icon when starting with number', () => {
    expect(toComponentName('24px-icon')).toBe('Icon24pxIcon');
  });

  it('should handle single word', () => {
    expect(toComponentName('home')).toBe('Home');
  });

  it('should handle already PascalCase', () => {
    expect(toComponentName('ArrowLeft')).toBe('Arrowleft');
  });

  it('should handle mixed separators', () => {
    expect(toComponentName('my-icon_name')).toBe('MyIconName');
  });

  it('should filter empty parts', () => {
    expect(toComponentName('arrow--left')).toBe('ArrowLeft');
  });

  it('should handle leading separators', () => {
    expect(toComponentName('-arrow-left')).toBe('ArrowLeft');
  });

  it('should handle trailing separators', () => {
    expect(toComponentName('arrow-left-')).toBe('ArrowLeft');
  });
});

// ============================================================================
// toIconName
// ============================================================================

describe('toIconName', () => {
  it('should convert PascalCase to kebab-case', () => {
    expect(toIconName('ArrowLeft')).toBe('arrow-left');
  });

  it('should handle multi-word names', () => {
    expect(toIconName('ChevronDownSmall')).toBe('chevron-down-small');
  });

  it('should insert hyphens before numbers', () => {
    expect(toIconName('Icon24px')).toBe('icon-24px');
  });

  it('should handle already lowercase', () => {
    expect(toIconName('home')).toBe('home');
  });

  it('should handle consecutive uppercase', () => {
    expect(toIconName('XMLParser')).toBe('x-m-l-parser');
  });

  it('should handle underscores', () => {
    const result = toIconName('My__Icon');
    expect(result.toLowerCase()).toBe(result); // Should be lowercase
  });
});

// ============================================================================
// isValidIconName
// ============================================================================

describe('isValidIconName', () => {
  it('should return true for valid kebab-case names', () => {
    expect(isValidIconName('arrow-left')).toBe(true);
  });

  it('should return true for valid snake_case names', () => {
    expect(isValidIconName('arrow_left')).toBe(true);
  });

  it('should return true for alphanumeric names', () => {
    expect(isValidIconName('icon24')).toBe(true);
  });

  it('should return true for simple names', () => {
    expect(isValidIconName('home')).toBe(true);
  });

  it('should return false for empty string', () => {
    expect(isValidIconName('')).toBe(false);
  });

  it('should return false for names with spaces', () => {
    expect(isValidIconName('arrow left')).toBe(false);
  });

  it('should return false for names with special characters', () => {
    expect(isValidIconName('arrow@left')).toBe(false);
    expect(isValidIconName('arrow.left')).toBe(false);
    expect(isValidIconName('arrow/left')).toBe(false);
  });
});

// ============================================================================
// normalizeIconName
// ============================================================================

describe('normalizeIconName', () => {
  it('should convert to lowercase kebab-case', () => {
    expect(normalizeIconName('ArrowLeft')).toBe('arrowleft');
  });

  it('should replace special characters with hyphens', () => {
    expect(normalizeIconName('arrow@left')).toBe('arrow-left');
  });

  it('should remove leading and trailing hyphens', () => {
    expect(normalizeIconName('-arrow-left-')).toBe('arrow-left');
  });

  it('should handle multiple consecutive special characters', () => {
    expect(normalizeIconName('arrow---left')).toBe('arrow-left');
  });

  it('should handle file name with extension', () => {
    // Assumes extension is already stripped
    expect(normalizeIconName('icon.svg')).toBe('icon-svg');
  });

  it('should lowercase the result', () => {
    expect(normalizeIconName('ICON')).toBe('icon');
  });
});
