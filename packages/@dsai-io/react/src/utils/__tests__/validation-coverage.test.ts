/**
 * Validation Coverage Tests
 *
 * Tests isValidEmail and isValidUrl edge cases for branch coverage.
 */

import { isValidEmail } from '../validation/isValidEmail';
import { isValidUrl } from '../validation/isValidUrl';

// -- Named constants for magic numbers (SonarQube S109) --
const EMAIL_MAX_LENGTH = 250;
const LOCAL_PART_MAX_LENGTH = 65;
const DOMAIN_LABEL_MAX_LENGTH = 64;
const TEST_NON_STRING_VALUE = 123;

describe('isValidEmail', () => {
  describe('Falsy/Invalid inputs', () => {
    it('returns false for null', () => {
      expect(isValidEmail(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isValidEmail(undefined)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('returns false for whitespace-only string', () => {
      expect(isValidEmail('   ')).toBe(false);
    });
  });

  describe('Length limits', () => {
    it('returns false for email exceeding 254 characters', () => {
      const longEmail = 'a'.repeat(EMAIL_MAX_LENGTH) + '@b.c';
      expect(isValidEmail(longEmail)).toBe(false);
    });

    it('returns false for local part exceeding 64 characters', () => {
      const longLocal = 'a'.repeat(LOCAL_PART_MAX_LENGTH) + '@example.com';
      expect(isValidEmail(longLocal)).toBe(false);
    });
  });

  describe('Missing parts', () => {
    it('returns false for no @ sign', () => {
      expect(isValidEmail('userexample.com')).toBe(false);
    });

    it('returns false for no domain', () => {
      expect(isValidEmail('user@')).toBe(false);
    });

    it('returns false for no local part', () => {
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('Invalid characters', () => {
    it('returns false for spaces in local part', () => {
      expect(isValidEmail('user name@example.com')).toBe(false);
    });

    it('returns false for angle brackets in local part', () => {
      expect(isValidEmail('user<name>@example.com')).toBe(false);
    });

    it('returns false for spaces in domain', () => {
      expect(isValidEmail('user@exam ple.com')).toBe(false);
    });

    it('returns false for angle brackets in domain', () => {
      expect(isValidEmail('user@<example>.com')).toBe(false);
    });
  });

  describe('Domain validation', () => {
    it('returns false for single-label domain (no dots)', () => {
      expect(isValidEmail('user@localhost')).toBe(false);
    });

    it('returns false for domain label starting with hyphen', () => {
      expect(isValidEmail('user@-example.com')).toBe(false);
    });

    it('returns false for domain label ending with hyphen', () => {
      expect(isValidEmail('user@example-.com')).toBe(false);
    });

    it('returns false for empty domain label', () => {
      expect(isValidEmail('user@.example.com')).toBe(false);
    });

    it('returns false for domain label exceeding 63 characters', () => {
      const longLabel = 'a'.repeat(DOMAIN_LABEL_MAX_LENGTH);
      expect(isValidEmail(`user@${longLabel}.com`)).toBe(false);
    });
  });

  describe('Valid emails', () => {
    it('accepts standard email', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
    });

    it('accepts email with subdomain', () => {
      expect(isValidEmail('user@sub.example.com')).toBe(true);
    });

    it('accepts email with hyphens in domain', () => {
      expect(isValidEmail('user@my-domain.com')).toBe(true);
    });

    it('accepts email with numbers', () => {
      expect(isValidEmail('user123@example456.com')).toBe(true);
    });

    it('trims whitespace', () => {
      expect(isValidEmail('  user@example.com  ')).toBe(true);
    });
  });
});

describe('isValidUrl', () => {
  describe('Falsy/Invalid inputs', () => {
    it('returns false for null', () => {
      expect(isValidUrl(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isValidUrl(undefined)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidUrl('')).toBe(false);
    });

    it('returns false for non-string', () => {
      expect(isValidUrl(TEST_NON_STRING_VALUE as unknown as string)).toBe(false);
    });
  });

  describe('Protocol handling', () => {
    it('accepts http URLs by default', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
    });

    it('accepts https URLs by default', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
    });

    it('rejects ftp URLs by default', () => {
      expect(isValidUrl('ftp://example.com')).toBe(false);
    });

    it('accepts custom protocols when specified', () => {
      expect(isValidUrl('ftp://files.example.com', { allowedSchemes: ['ftp'] })).toBe(true);
    });

    it('rejects http when only ftp is allowed', () => {
      expect(isValidUrl('http://example.com', { allowedSchemes: ['ftp'] })).toBe(false);
    });
  });

  describe('Hostname filtering', () => {
    it('accepts any hostname when allowHostnames is not set', () => {
      expect(isValidUrl('https://anything.com')).toBe(true);
    });

    it('accepts URL when hostname is in allowHostnames', () => {
      expect(
        isValidUrl('https://example.com/path', { allowHostnames: ['example.com'] })
      ).toBe(true);
    });

    it('rejects URL when hostname is not in allowHostnames', () => {
      expect(
        isValidUrl('https://evil.com/path', { allowHostnames: ['example.com'] })
      ).toBe(false);
    });

    it('accepts URL when allowHostnames is empty array', () => {
      expect(isValidUrl('https://example.com', { allowHostnames: [] })).toBe(true);
    });

    it('rejects URL when hostname is in blockHostnames', () => {
      expect(
        isValidUrl('https://evil.com', { blockHostnames: ['evil.com'] })
      ).toBe(false);
    });

    it('accepts URL when hostname is not in blockHostnames', () => {
      expect(
        isValidUrl('https://good.com', { blockHostnames: ['evil.com'] })
      ).toBe(true);
    });

    it('accepts URL when blockHostnames is empty array', () => {
      expect(isValidUrl('https://example.com', { blockHostnames: [] })).toBe(true);
    });
  });

  describe('Malformed URLs', () => {
    it('returns false for invalid URL string', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
    });

    it('returns false for javascript: protocol', () => {
      expect(isValidUrl('javascript:alert(1)')).toBe(false);
    });

    it('trims whitespace before parsing', () => {
      expect(isValidUrl('  https://example.com  ')).toBe(true);
    });
  });
});
