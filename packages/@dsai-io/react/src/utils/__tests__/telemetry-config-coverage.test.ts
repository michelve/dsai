/**
 * Telemetry Config Coverage Tests
 *
 * Tests setTelemetryConfig, getTelemetryConfig, resetTelemetryConfig,
 * shouldSample, getMergedRedactKeys, setTelemetryClient, getTelemetryClient.
 */

import {
  getMergedRedactKeys,
  getTelemetryClient,
  getTelemetryConfig,
  resetTelemetryConfig,
  setTelemetryClient,
  setTelemetryConfig,
  shouldSample,
} from '../telemetry/config';

import type { TelemetryClient } from '../telemetry/config';

describe('Telemetry Config', () => {
  afterEach(() => {
    resetTelemetryConfig();
    setTelemetryClient(null);
  });

  describe('setTelemetryConfig / getTelemetryConfig', () => {
    it('returns default config initially', () => {
      const config = getTelemetryConfig();
      expect(config.defaultRedactKeys).toEqual([
        'password',
        'token',
        'secret',
        'apiKey',
        'accessToken',
        'auth',
      ]);
      expect(config.allowAdditionalRedactKeys).toBe(true);
      expect(config.defaultSampleRate).toBe(1.0);
    });

    it('merges partial config', () => {
      setTelemetryConfig({ defaultSampleRate: 0.5 });
      const config = getTelemetryConfig();
      expect(config.defaultSampleRate).toBe(0.5);
      // Other fields unchanged
      expect(config.allowAdditionalRedactKeys).toBe(true);
    });

    it('overwrites defaultRedactKeys', () => {
      setTelemetryConfig({ defaultRedactKeys: ['ssn', 'dob'] });
      const config = getTelemetryConfig();
      expect(config.defaultRedactKeys).toEqual(['ssn', 'dob']);
    });

    it('returns a copy (not the internal object)', () => {
      const config1 = getTelemetryConfig();
      const config2 = getTelemetryConfig();
      expect(config1).not.toBe(config2);
      expect(config1).toEqual(config2);
    });
  });

  describe('resetTelemetryConfig', () => {
    it('resets to defaults after modification', () => {
      setTelemetryConfig({ defaultSampleRate: 0.1, allowAdditionalRedactKeys: false });
      resetTelemetryConfig();
      const config = getTelemetryConfig();
      expect(config.defaultSampleRate).toBe(1.0);
      expect(config.allowAdditionalRedactKeys).toBe(true);
    });
  });

  describe('shouldSample', () => {
    it('returns true when sample rate is 1 (default)', () => {
      expect(shouldSample()).toBe(true);
      expect(shouldSample(1)).toBe(true);
    });

    it('returns false when sample rate is 0', () => {
      expect(shouldSample(0)).toBe(false);
    });

    it('clamps rate above 1 to always sample', () => {
      expect(shouldSample(1.5)).toBe(true);
    });

    it('clamps rate below 0 to never sample', () => {
      expect(shouldSample(-0.5)).toBe(false);
    });

    it('uses global default sample rate when undefined', () => {
      setTelemetryConfig({ defaultSampleRate: 0 });
      expect(shouldSample()).toBe(false);
    });

    it('handles probabilistic sampling for rates between 0 and 1', () => {
      // Run multiple times to exercise the probabilistic branch
      const results = Array.from({ length: 100 }, () => shouldSample(0.5));
      // Should have at least some true and some false (probabilistic)
      const trueCount = results.filter(Boolean).length;
      // With 100 samples at 0.5, it's extremely unlikely to get 0 or 100
      expect(trueCount).toBeGreaterThan(0);
      expect(trueCount).toBeLessThan(100);
    });
  });

  describe('getMergedRedactKeys', () => {
    it('returns default keys when no additional keys provided', () => {
      const keys = getMergedRedactKeys();
      expect(keys).toEqual([
        'password',
        'token',
        'secret',
        'apiKey',
        'accessToken',
        'auth',
      ]);
    });

    it('merges additional keys with default keys', () => {
      const keys = getMergedRedactKeys(['ssn', 'dob']);
      expect(keys).toContain('password');
      expect(keys).toContain('ssn');
      expect(keys).toContain('dob');
    });

    it('deduplicates merged keys', () => {
      const keys = getMergedRedactKeys(['password', 'token', 'custom']);
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    });

    it('returns only default keys in strict mode', () => {
      setTelemetryConfig({ allowAdditionalRedactKeys: false });
      const keys = getMergedRedactKeys(['ssn', 'dob']);
      // Additional keys should be ignored
      expect(keys).not.toContain('ssn');
      expect(keys).not.toContain('dob');
      expect(keys).toContain('password');
    });
  });

  describe('setTelemetryClient / getTelemetryClient', () => {
    it('returns null when no client is set', () => {
      expect(getTelemetryClient()).toBeNull();
    });

    it('sets and retrieves a telemetry client', () => {
      const mockClient: TelemetryClient = {
        trackPerformance: jest.fn(),
        trackError: jest.fn(),
      };

      setTelemetryClient(mockClient);
      expect(getTelemetryClient()).toBe(mockClient);
    });

    it('clears client when set to null', () => {
      const mockClient: TelemetryClient = {
        trackPerformance: jest.fn(),
        trackError: jest.fn(),
      };

      setTelemetryClient(mockClient);
      expect(getTelemetryClient()).toBe(mockClient);

      setTelemetryClient(null);
      expect(getTelemetryClient()).toBeNull();
    });
  });
});
