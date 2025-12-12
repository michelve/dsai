/**
 * @file Types utilities test suite
 */

import { isExternalUrl } from '../types/isExternalUrl';

describe('Types utilities', () => {
  describe('isExternalUrl', () => {
    it('detects external protocols including uppercase', () => {
      expect(isExternalUrl('HTTPS://example.com')).toBe(true);
      expect(isExternalUrl('FtP://server.com')).toBe(true);
      expect(isExternalUrl('mailto:foo@example.com')).toBe(true);
      expect(isExternalUrl('tel:+123')).toBe(true);
    });

    it('returns false for relative/hash and invalid inputs', () => {
      expect(isExternalUrl('/about')).toBe(false);
      expect(isExternalUrl('#section')).toBe(false);
      expect(isExternalUrl(undefined)).toBe(false);
      expect(isExternalUrl(null)).toBe(false);
      expect(isExternalUrl(123 as any)).toBe(false);
    });

    it('handles URL objects by stringifying', () => {
      const url = new URL('https://example.com');
      expect(isExternalUrl(url.toString())).toBe(true);
    });
  });
});
