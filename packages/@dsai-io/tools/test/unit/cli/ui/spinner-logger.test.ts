/**
 * Unit tests for CLI logger
 *
 * Tests cover:
 * - createLogger function
 * - formatDuration function
 * - formatBytes function
 * - formatCount function
 *
 * Note: Spinner tests are skipped due to ora ESM mocking complexity
 */

import {
  createLogger,
  formatDuration,
  formatBytes,
  formatCount,
} from '../../../../src/cli/ui/logger.js';

// ============================================================================
// createLogger
// ============================================================================

describe('createLogger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('default options', () => {
    it('should log messages with log()', () => {
      const logger = createLogger();
      logger.log('Test message');

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log info messages', () => {
      const logger = createLogger();
      logger.info('Info message');

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log success messages', () => {
      const logger = createLogger();
      logger.success('Success message');

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log warning messages', () => {
      const logger = createLogger();
      logger.warn('Warning message');

      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should log error messages', () => {
      const logger = createLogger();
      logger.error('Error message');

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should not log debug messages by default', () => {
      const logger = createLogger();
      logger.debug('Debug message');

      // debug only logs when debug mode is enabled
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('quiet mode', () => {
    it('should suppress log messages in quiet mode', () => {
      const logger = createLogger({ quiet: true });
      logger.log('Test message');

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should suppress info messages in quiet mode', () => {
      const logger = createLogger({ quiet: true });
      logger.info('Info message');

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should still show success messages in quiet mode', () => {
      const logger = createLogger({ quiet: true });
      logger.success('Success message');

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should still show warning messages in quiet mode', () => {
      const logger = createLogger({ quiet: true });
      logger.warn('Warning message');

      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should still show error messages in quiet mode', () => {
      const logger = createLogger({ quiet: true });
      logger.error('Error message');

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('debug mode', () => {
    it('should show debug messages in debug mode', () => {
      const logger = createLogger({ debug: true });
      logger.debug('Debug message');

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should still show regular messages in debug mode', () => {
      const logger = createLogger({ debug: true });
      logger.info('Info message');

      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('prefix option', () => {
    it('should include prefix in messages', () => {
      const logger = createLogger({ prefix: 'MyApp' });
      logger.log('Test message');

      expect(consoleLogSpy).toHaveBeenCalled();
      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('MyApp');
    });
  });
});

// ============================================================================
// formatDuration
// ============================================================================

describe('formatDuration', () => {
  it('should format milliseconds for short durations', () => {
    expect(formatDuration(500)).toBe('500ms');
  });

  it('should format seconds for medium durations', () => {
    expect(formatDuration(2500)).toBe('2.50s');
  });

  it('should format minutes and seconds for long durations', () => {
    expect(formatDuration(65000)).toBe('1m 5s');
  });

  it('should handle zero', () => {
    expect(formatDuration(0)).toBe('0ms');
  });

  it('should handle exact second boundaries', () => {
    expect(formatDuration(1000)).toBe('1.00s');
  });

  it('should handle exact minute boundaries', () => {
    expect(formatDuration(60000)).toBe('1m 0s');
  });

  it('should handle multiple minutes', () => {
    expect(formatDuration(125000)).toBe('2m 5s');
  });
});

// ============================================================================
// formatBytes
// ============================================================================

describe('formatBytes', () => {
  it('should format zero bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('should format bytes under 1KB', () => {
    expect(formatBytes(500)).toBe('500 B');
  });

  it('should format kilobytes', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('should format fractional kilobytes', () => {
    expect(formatBytes(1536)).toContain('KB');
  });

  it('should format megabytes', () => {
    expect(formatBytes(1536000)).toContain('MB');
  });

  it('should format gigabytes', () => {
    expect(formatBytes(1073741824)).toBe('1 GB');
  });

  it('should handle large values', () => {
    const result = formatBytes(10737418240);
    expect(result).toContain('GB');
  });
});

// ============================================================================
// formatCount
// ============================================================================

describe('formatCount', () => {
  it('should use singular form for count of 1', () => {
    expect(formatCount(1, 'file')).toBe('1 file');
  });

  it('should use plural form for count > 1', () => {
    expect(formatCount(5, 'file')).toBe('5 files');
  });

  it('should use plural form for count of 0', () => {
    expect(formatCount(0, 'file')).toBe('0 files');
  });

  it('should use custom plural form', () => {
    expect(formatCount(1, 'entry', 'entries')).toBe('1 entry');
    expect(formatCount(2, 'entry', 'entries')).toBe('2 entries');
  });

  it('should handle irregular plurals', () => {
    expect(formatCount(1, 'child', 'children')).toBe('1 child');
    expect(formatCount(3, 'child', 'children')).toBe('3 children');
  });
});
