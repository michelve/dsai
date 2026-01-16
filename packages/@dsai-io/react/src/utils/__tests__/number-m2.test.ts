/**
 * @file Number utilities targeted tests
 */

import { formatCurrency } from '../number/formatCurrency';
import { formatNumber } from '../number/formatNumber';

describe('Number utilities', () => {
  describe('formatNumber', () => {
    it('falls back and warns when Intl formatter throws', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const originalNumberFormat = Intl.NumberFormat;
      // Force Intl.NumberFormat to throw
      // @ts-expect-error - override for test
      Intl.NumberFormat = jest.fn(() => {
        throw new Error('boom');
      }) as unknown as typeof Intl.NumberFormat;

      const result = formatNumber(1234.56, { locale: 'en-US' });
      expect(result).toBeTruthy();
      expect(warnSpy).toHaveBeenCalled();

      Intl.NumberFormat = originalNumberFormat;
      warnSpy.mockRestore();
    });
  });

  describe('formatCurrency', () => {
    it('formats with currency code and handles invalid currency gracefully', () => {
      const usd = formatCurrency(10, { currency: 'USD', locale: 'en-US' });
      expect(usd).toContain('$');

      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const fallback = formatCurrency(10, {
        // @ts-expect-error - invalid currency code
        currency: 'BAD',
        locale: 'en-US',
      });
      expect(fallback).toContain('BAD');
      spy.mockRestore();
    });
  });
});
