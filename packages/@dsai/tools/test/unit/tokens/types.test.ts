/**
 * Unit tests for token types and utility functions
 *
 * Tests cover:
 * - isDTCGToken
 * - isLegacyToken
 * - isTokenReference
 * - isValidTokenType
 * - getTokenValue
 * - getTokenType
 * - getTokenDescription
 * - toDTCGToken
 * - parseTokenReference
 */

import {
  isDTCGToken,
  isLegacyToken,
  isTokenReference,
  isValidTokenType,
  getTokenValue,
  getTokenType,
  getTokenDescription,
  toDTCGToken,
  parseTokenReference,
  VALID_TOKEN_TYPES,
} from '../../../src/tokens/types.js';

import type { DTCGToken, LegacyToken } from '../../../src/tokens/types.js';

// ============================================================================
// isDTCGToken Tests
// ============================================================================

describe('isDTCGToken', () => {
  it('should return true for token with $value', () => {
    const token = { $value: '#fff' };
    expect(isDTCGToken(token)).toBe(true);
  });

  it('should return true for token with $value and $type', () => {
    const token: DTCGToken = { $value: '#fff', $type: 'color' };
    expect(isDTCGToken(token)).toBe(true);
  });

  it('should return false for legacy token', () => {
    const token = { value: '#fff' };
    expect(isDTCGToken(token)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isDTCGToken(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isDTCGToken(undefined)).toBe(false);
  });

  it('should return false for non-object', () => {
    expect(isDTCGToken('string')).toBe(false);
    expect(isDTCGToken(123)).toBe(false);
    expect(isDTCGToken(true)).toBe(false);
  });
});

// ============================================================================
// isLegacyToken Tests
// ============================================================================

describe('isLegacyToken', () => {
  it('should return true for token with value', () => {
    const token = { value: '#fff' };
    expect(isLegacyToken(token)).toBe(true);
  });

  it('should return true for token with value and type', () => {
    const token: LegacyToken = { value: '#fff', type: 'color' };
    expect(isLegacyToken(token)).toBe(true);
  });

  it('should return false for DTCG token', () => {
    const token = { $value: '#fff' };
    expect(isLegacyToken(token)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isLegacyToken(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isLegacyToken(undefined)).toBe(false);
  });

  it('should return false for non-object', () => {
    expect(isLegacyToken('string')).toBe(false);
    expect(isLegacyToken(123)).toBe(false);
  });
});

// ============================================================================
// isTokenReference Tests
// ============================================================================

describe('isTokenReference', () => {
  it('should return true for valid reference', () => {
    expect(isTokenReference('{color.primary}')).toBe(true);
  });

  it('should return true for nested reference', () => {
    expect(isTokenReference('{colors.brand.primary.500}')).toBe(true);
  });

  it('should return false for non-reference strings', () => {
    expect(isTokenReference('#fff')).toBe(false);
    expect(isTokenReference('16px')).toBe(false);
    expect(isTokenReference('color.primary')).toBe(false);
  });

  it('should return false for malformed references', () => {
    expect(isTokenReference('{color.primary')).toBe(false);
    expect(isTokenReference('color.primary}')).toBe(false);
  });

  it('should return true for empty reference (just braces)', () => {
    // The function only checks for { and } wrapping, not content
    expect(isTokenReference('{}')).toBe(true);
  });

  it('should return false for non-strings', () => {
    expect(isTokenReference(null)).toBe(false);
    expect(isTokenReference(undefined)).toBe(false);
    expect(isTokenReference(123)).toBe(false);
    expect(isTokenReference({})).toBe(false);
  });
});

// ============================================================================
// isValidTokenType Tests
// ============================================================================

describe('isValidTokenType', () => {
  it('should return true for all valid token types', () => {
    for (const type of VALID_TOKEN_TYPES) {
      expect(isValidTokenType(type)).toBe(true);
    }
  });

  it('should return true for color type', () => {
    expect(isValidTokenType('color')).toBe(true);
  });

  it('should return true for dimension type', () => {
    expect(isValidTokenType('dimension')).toBe(true);
  });

  it('should return true for fontFamily type', () => {
    expect(isValidTokenType('fontFamily')).toBe(true);
  });

  it('should return false for invalid types', () => {
    expect(isValidTokenType('invalid')).toBe(false);
    expect(isValidTokenType('COLOR')).toBe(false);
    expect(isValidTokenType('')).toBe(false);
  });

  it('should return false for non-strings', () => {
    expect(isValidTokenType(null as unknown as string)).toBe(false);
    expect(isValidTokenType(undefined as unknown as string)).toBe(false);
    expect(isValidTokenType(123 as unknown as string)).toBe(false);
  });
});

// ============================================================================
// getTokenValue Tests
// ============================================================================

describe('getTokenValue', () => {
  it('should get value from DTCG token', () => {
    const token: DTCGToken = { $value: '#fff', $type: 'color' };
    expect(getTokenValue(token)).toBe('#fff');
  });

  it('should get value from legacy token', () => {
    const token: LegacyToken = { value: '#fff', type: 'color' };
    expect(getTokenValue(token)).toBe('#fff');
  });

  it('should handle complex values', () => {
    const token: DTCGToken = {
      $value: { fontFamily: 'Inter', fontSize: '16px' },
      $type: 'typography',
    };
    expect(getTokenValue(token)).toEqual({ fontFamily: 'Inter', fontSize: '16px' });
  });

  it('should handle numeric values', () => {
    const token: DTCGToken = { $value: 16, $type: 'dimension' };
    expect(getTokenValue(token)).toBe(16);
  });

  it('should handle reference values', () => {
    const token: DTCGToken = { $value: '{color.primary}', $type: 'color' };
    expect(getTokenValue(token)).toBe('{color.primary}');
  });
});

// ============================================================================
// getTokenType Tests
// ============================================================================

describe('getTokenType', () => {
  it('should get type from DTCG token', () => {
    const token: DTCGToken = { $value: '#fff', $type: 'color' };
    expect(getTokenType(token)).toBe('color');
  });

  it('should get type from legacy token', () => {
    const token: LegacyToken = { value: '#fff', type: 'color' };
    expect(getTokenType(token)).toBe('color');
  });

  it('should return undefined for token without type', () => {
    const token: DTCGToken = { $value: '#fff' };
    expect(getTokenType(token)).toBeUndefined();
  });

  it('should handle dimension type', () => {
    const token: DTCGToken = { $value: '16px', $type: 'dimension' };
    expect(getTokenType(token)).toBe('dimension');
  });
});

// ============================================================================
// getTokenDescription Tests
// ============================================================================

describe('getTokenDescription', () => {
  it('should get description from DTCG token', () => {
    const token: DTCGToken = {
      $value: '#fff',
      $type: 'color',
      $description: 'Primary color',
    };
    expect(getTokenDescription(token)).toBe('Primary color');
  });

  it('should get description from legacy token', () => {
    const token: LegacyToken = {
      value: '#fff',
      type: 'color',
      description: 'Primary color',
    };
    expect(getTokenDescription(token)).toBe('Primary color');
  });

  it('should get comment from legacy token', () => {
    const token = {
      value: '#fff',
      type: 'color',
      comment: 'Legacy comment',
    } as LegacyToken;
    expect(getTokenDescription(token)).toBe('Legacy comment');
  });

  it('should prefer description over comment in legacy token', () => {
    const token = {
      value: '#fff',
      description: 'Description',
      comment: 'Comment',
    } as LegacyToken;
    expect(getTokenDescription(token)).toBe('Description');
  });

  it('should return undefined when no description', () => {
    const token: DTCGToken = { $value: '#fff', $type: 'color' };
    expect(getTokenDescription(token)).toBeUndefined();
  });
});

// ============================================================================
// toDTCGToken Tests
// ============================================================================

describe('toDTCGToken', () => {
  it('should convert legacy token to DTCG format', () => {
    const legacy: LegacyToken = { value: '#fff', type: 'color' };
    const dtcg = toDTCGToken(legacy);

    expect(dtcg.$value).toBe('#fff');
    expect(dtcg.$type).toBe('color');
  });

  it('should convert description', () => {
    const legacy: LegacyToken = {
      value: '#fff',
      type: 'color',
      description: 'Primary color',
    };
    const dtcg = toDTCGToken(legacy);

    expect(dtcg.$description).toBe('Primary color');
  });

  it('should convert comment to description', () => {
    const legacy = {
      value: '#fff',
      comment: 'A comment',
    } as LegacyToken;
    const dtcg = toDTCGToken(legacy);

    expect(dtcg.$description).toBe('A comment');
  });

  it('should prefer description over comment', () => {
    const legacy = {
      value: '#fff',
      description: 'Description',
      comment: 'Comment',
    } as LegacyToken;
    const dtcg = toDTCGToken(legacy);

    expect(dtcg.$description).toBe('Description');
  });

  it('should handle token without type', () => {
    const legacy: LegacyToken = { value: '#fff' };
    const dtcg = toDTCGToken(legacy);

    expect(dtcg.$value).toBe('#fff');
    expect(dtcg.$type).toBeUndefined();
  });

  it('should skip invalid type', () => {
    const legacy = { value: '#fff', type: 'invalid-type' } as LegacyToken;
    const result = toDTCGToken(legacy);

    expect(result.$type).toBeUndefined();
  });

  it('should handle complex values', () => {
    const legacy: LegacyToken = {
      value: { fontFamily: 'Inter', fontSize: '16px' },
      type: 'typography',
    };
    const dtcg = toDTCGToken(legacy);

    expect(dtcg.$value).toEqual({ fontFamily: 'Inter', fontSize: '16px' });
    expect(dtcg.$type).toBe('typography');
  });
});

// ============================================================================
// parseTokenReference Tests
// ============================================================================

describe('parseTokenReference', () => {
  it('should parse valid reference', () => {
    const result = parseTokenReference('{color.primary}');
    expect(result).toEqual(['color', 'primary']);
  });

  it('should parse nested reference', () => {
    const result = parseTokenReference('{colors.brand.primary.500}');
    expect(result).toEqual(['colors', 'brand', 'primary', '500']);
  });

  it('should parse single-segment reference', () => {
    const result = parseTokenReference('{primary}');
    expect(result).toEqual(['primary']);
  });

  it('should return null for non-reference', () => {
    expect(parseTokenReference('#fff')).toBeNull();
    expect(parseTokenReference('16px')).toBeNull();
  });

  it('should return null for malformed reference', () => {
    expect(parseTokenReference('{color.primary')).toBeNull();
    expect(parseTokenReference('color.primary}')).toBeNull();
  });

  it('should return array with empty string for empty braces', () => {
    // The function splits by '.', so '{}' becomes ['']
    expect(parseTokenReference('{}')).toEqual(['']);
  });
});

// ============================================================================
// VALID_TOKEN_TYPES constant Tests
// ============================================================================

describe('VALID_TOKEN_TYPES', () => {
  it('should include color', () => {
    expect(VALID_TOKEN_TYPES).toContain('color');
  });

  it('should include dimension', () => {
    expect(VALID_TOKEN_TYPES).toContain('dimension');
  });

  it('should include fontFamily', () => {
    expect(VALID_TOKEN_TYPES).toContain('fontFamily');
  });

  it('should include fontWeight', () => {
    expect(VALID_TOKEN_TYPES).toContain('fontWeight');
  });

  it('should include duration', () => {
    expect(VALID_TOKEN_TYPES).toContain('duration');
  });

  it('should include shadow', () => {
    expect(VALID_TOKEN_TYPES).toContain('shadow');
  });

  it('should include typography', () => {
    expect(VALID_TOKEN_TYPES).toContain('typography');
  });

  it('should be a readonly array', () => {
    expect(Array.isArray(VALID_TOKEN_TYPES)).toBe(true);
  });
});
