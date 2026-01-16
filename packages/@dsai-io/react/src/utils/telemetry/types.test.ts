/**
 * @jest-environment jsdom
 */

import {
  type FlexibleContext,
  isTelemetryContext,
  normalizeTelemetryContext,
  type TelemetryContext,
} from './types';

describe('TelemetryContext Types', () => {
  describe('isTelemetryContext', () => {
    it('returns true for structured context with tags only', () => {
      const context: TelemetryContext = {
        tags: { env: 'production', version: '1.0.0' },
      };

      expect(isTelemetryContext(context)).toBe(true);
    });

    it('returns true for structured context with data only', () => {
      const context: TelemetryContext = {
        data: { count: 123, enabled: true },
      };

      expect(isTelemetryContext(context)).toBe(true);
    });

    it('returns true for structured context with both tags and data', () => {
      const context: TelemetryContext = {
        tags: { env: 'production' },
        data: { count: 123 },
      };

      expect(isTelemetryContext(context)).toBe(true);
    });

    it('returns false for loose Record<string, unknown>', () => {
      const context: Record<string, unknown> = {
        foo: 'bar',
        count: 123,
        enabled: true,
      };

      expect(isTelemetryContext(context)).toBe(false);
    });

    it('returns false for Record with mixed keys (tags/data + other)', () => {
      const context = {
        tags: { env: 'production' },
        data: { count: 123 },
        extra: 'field', // Not allowed in TelemetryContext
      };

      expect(isTelemetryContext(context)).toBe(false);
    });

    it('returns false for array', () => {
      const context = ['item1', 'item2'];
      expect(isTelemetryContext(context as unknown as TelemetryContext)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isTelemetryContext(null as unknown as TelemetryContext)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isTelemetryContext(undefined as unknown as TelemetryContext)).toBe(false);
    });

    it('returns false for primitive values', () => {
      expect(isTelemetryContext('string' as unknown as TelemetryContext)).toBe(false);
      expect(isTelemetryContext(123 as unknown as TelemetryContext)).toBe(false);
      expect(isTelemetryContext(true as unknown as TelemetryContext)).toBe(false);
    });
  });

  describe('normalizeTelemetryContext', () => {
    it('returns empty tags/data for undefined', () => {
      const result = normalizeTelemetryContext(undefined);

      expect(result).toEqual({ tags: {}, data: {} });
    });

    it('passes through structured context with tags and data', () => {
      const context: TelemetryContext = {
        tags: { env: 'production', version: '1.0.0' },
        data: { count: 123, enabled: true },
      };

      const result = normalizeTelemetryContext(context);

      expect(result).toEqual({
        tags: { env: 'production', version: '1.0.0' },
        data: { count: 123, enabled: true },
      });
    });

    it('fills missing tags with empty object', () => {
      const context: TelemetryContext = {
        data: { count: 123 },
      };

      const result = normalizeTelemetryContext(context);

      expect(result).toEqual({
        tags: {},
        data: { count: 123 },
      });
    });

    it('fills missing data with empty object', () => {
      const context: TelemetryContext = {
        tags: { env: 'production' },
      };

      const result = normalizeTelemetryContext(context);

      expect(result).toEqual({
        tags: { env: 'production' },
        data: {},
      });
    });

    it('converts loose Record to data field', () => {
      const context: Record<string, unknown> = {
        foo: 'bar',
        count: 123,
        enabled: true,
        nested: { a: 1, b: 2 },
      };

      const result = normalizeTelemetryContext(context);

      expect(result).toEqual({
        tags: {},
        data: {
          foo: 'bar',
          count: 123,
          enabled: true,
          nested: { a: 1, b: 2 },
        },
      });
    });

    it('handles empty object', () => {
      const context: Record<string, unknown> = {};

      const result = normalizeTelemetryContext(context);

      expect(result).toEqual({
        tags: {},
        data: {},
      });
    });
  });

  describe('FlexibleContext type', () => {
    it('accepts TelemetryContext', () => {
      const context: FlexibleContext = {
        tags: { env: 'production' },
        data: { count: 123 },
      };

      expect(context).toBeDefined();
    });

    it('accepts Record<string, unknown>', () => {
      const context: FlexibleContext = {
        foo: 'bar',
        count: 123,
      };

      expect(context).toBeDefined();
    });
  });

  describe('Integration with normalization', () => {
    it('handles round-trip through normalization', () => {
      const original: TelemetryContext = {
        tags: { env: 'staging', userId: 'user-123' },
        data: { requestId: 'req-456', duration: 234 },
      };

      const normalized = normalizeTelemetryContext(original);
      const reNormalized = normalizeTelemetryContext(normalized);

      expect(normalized).toEqual(original);
      expect(reNormalized).toEqual(original);
    });

    it('converts loose context consistently', () => {
      const loose: Record<string, unknown> = {
        apiKey: '[REDACTED]',
        userId: 'user-123',
      };

      const normalized1 = normalizeTelemetryContext(loose);
      const normalized2 = normalizeTelemetryContext(normalized1);

      expect(normalized1).toEqual({
        tags: {},
        data: { apiKey: '[REDACTED]', userId: 'user-123' },
      });
      expect(normalized2).toEqual(normalized1);
    });
  });

  describe('Type safety examples', () => {
    it('demonstrates structured approach for PII safety', () => {
      // Recommended: Separate tags (indexed) from data (may contain PII)
      const structured: TelemetryContext = {
        tags: {
          environment: 'production',
          version: '2.1.0',
          feature: 'checkout',
        },
        data: {
          // This should be redacted before sending to telemetry
          userEmail: 'user@example.com',
          requestBody: { items: [1, 2, 3] },
        },
      };

      const normalized = normalizeTelemetryContext(structured);

      expect(normalized.tags).toEqual({
        environment: 'production',
        version: '2.1.0',
        feature: 'checkout',
      });
      expect(normalized.data).toHaveProperty('userEmail');
    });

    it('demonstrates backward-compatible loose approach', () => {
      // Still works: Loose context for simplicity
      const loose: Record<string, unknown> = {
        environment: 'production',
        userEmail: 'user@example.com',
        count: 42,
      };

      const normalized = normalizeTelemetryContext(loose);

      // Everything goes to data
      expect(normalized.tags).toEqual({});
      expect(normalized.data).toEqual({
        environment: 'production',
        userEmail: 'user@example.com',
        count: 42,
      });
    });
  });
});
