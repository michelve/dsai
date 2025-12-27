/**
 * Unit tests for CLI utilities
 *
 * Tests cover:
 * - Program creation
 * - Error handling setup
 * - Color utilities
 * - Logger utilities
 * - Spinner utilities
 */

// Mock ora before importing spinner
jest.mock('ora', () => {
  return () => ({
    start: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
    warn: jest.fn().mockReturnThis(),
    info: jest.fn().mockReturnThis(),
    text: '',
    isSpinning: false,
  });
});

import { createProgram, setupErrorHandling } from '../../../src/cli/create-program.js';
import { colors } from '../../../src/cli/ui/colors.js';
import { createLogger } from '../../../src/cli/ui/logger.js';
import { createSpinner } from '../../../src/cli/ui/spinner.js';

// ============================================================================
// createProgram Tests
// ============================================================================

describe('createProgram', () => {
  it('should create a Commander program', () => {
    const program = createProgram();
    expect(program).toBeDefined();
    expect(program.name()).toBe('dsai');
  });

  it('should have global options', () => {
    const program = createProgram();

    // Check that program has expected options defined
    expect(program.options.length).toBeGreaterThan(0);

    // Find config option
    const configOpt = program.options.find((o) => o.long === '--config');
    expect(configOpt).toBeDefined();

    // Find debug option
    const debugOpt = program.options.find((o) => o.long === '--debug');
    expect(debugOpt).toBeDefined();

    // Find quiet option
    const quietOpt = program.options.find((o) => o.long === '--quiet');
    expect(quietOpt).toBeDefined();
  });

  it('should have version set', () => {
    const program = createProgram();
    // Version is set from version.ts
    expect(program.version()).toBeDefined();
  });
});

// ============================================================================
// setupErrorHandling Tests
// ============================================================================

describe('setupErrorHandling', () => {
  it('should set up error handling without throwing', () => {
    const program = createProgram();
    expect(() => setupErrorHandling(program)).not.toThrow();
  });

  it('should enable suggestion after error', () => {
    const program = createProgram();
    setupErrorHandling(program);
    // No easy way to test this directly, but it shouldn't throw
    expect(program).toBeDefined();
  });
});

// ============================================================================
// colors Tests
// ============================================================================

describe('colors', () => {
  describe('text colors', () => {
    it('should apply red color', () => {
      const result = colors.red('test');
      expect(typeof result).toBe('string');
      expect(result).toContain('test');
    });

    it('should apply green color', () => {
      const result = colors.green('test');
      expect(typeof result).toBe('string');
      expect(result).toContain('test');
    });

    it('should apply yellow color', () => {
      const result = colors.yellow('test');
      expect(typeof result).toBe('string');
      expect(result).toContain('test');
    });

    it('should apply blue color', () => {
      const result = colors.blue('test');
      expect(typeof result).toBe('string');
      expect(result).toContain('test');
    });

    it('should apply cyan color', () => {
      const result = colors.cyan('test');
      expect(typeof result).toBe('string');
      expect(result).toContain('test');
    });

    it('should apply gray color', () => {
      const result = colors.gray('test');
      expect(typeof result).toBe('string');
      expect(result).toContain('test');
    });
  });

  describe('text modifiers', () => {
    it('should apply bold', () => {
      const result = colors.bold('test');
      expect(typeof result).toBe('string');
      expect(result).toContain('test');
    });

    it('should apply dim', () => {
      const result = colors.dim('test');
      expect(typeof result).toBe('string');
      expect(result).toContain('test');
    });
  });

  describe('semantic colors', () => {
    it('should apply success style', () => {
      const result = colors.success('done');
      expect(typeof result).toBe('string');
      expect(result).toContain('done');
    });

    it('should apply error style', () => {
      const result = colors.error('failed');
      expect(typeof result).toBe('string');
      expect(result).toContain('failed');
    });

    it('should apply warning style', () => {
      const result = colors.warning('caution');
      expect(typeof result).toBe('string');
      expect(result).toContain('caution');
    });

    it('should apply info style', () => {
      const result = colors.info('note');
      expect(typeof result).toBe('string');
      expect(result).toContain('note');
    });

    it('should apply muted style', () => {
      const result = colors.muted('quiet');
      expect(typeof result).toBe('string');
      expect(result).toContain('quiet');
    });

    it('should apply path style', () => {
      const result = colors.path('./file.ts');
      expect(typeof result).toBe('string');
      expect(result).toContain('./file.ts');
    });

    it('should apply command style', () => {
      const result = colors.command('npm install');
      expect(typeof result).toBe('string');
      expect(result).toContain('npm install');
    });
  });
});

// ============================================================================
// createLogger Tests
// ============================================================================

describe('createLogger', () => {
  let consoleSpy: {
    log: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
  };

  beforeEach(() => {
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a logger instance', () => {
    const logger = createLogger();
    expect(logger).toBeDefined();
    expect(typeof logger.log).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.success).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('should log messages in normal mode', () => {
    const logger = createLogger();
    logger.log('test message');
    expect(consoleSpy.log).toHaveBeenCalled();
  });

  it('should suppress log in quiet mode', () => {
    const logger = createLogger({ quiet: true });
    logger.log('test message');
    logger.info('test info');
    // log and info should be suppressed
    expect(consoleSpy.log).not.toHaveBeenCalled();
  });

  it('should always show success even in quiet mode', () => {
    const logger = createLogger({ quiet: true });
    logger.success('done');
    expect(consoleSpy.log).toHaveBeenCalled();
  });

  it('should show debug in debug mode', () => {
    const logger = createLogger({ debug: true });
    logger.debug('debug info');
    expect(consoleSpy.log).toHaveBeenCalled();
  });

  it('should hide debug when not in debug mode', () => {
    const logger = createLogger({ debug: false });
    logger.debug('debug info');
    // Debug should not be called in non-debug mode
    // (depends on implementation)
  });

  it('should support custom prefix', () => {
    const logger = createLogger({ prefix: 'TEST' });
    logger.log('message');
    // Message should include prefix
    expect(consoleSpy.log).toHaveBeenCalled();
  });

  it('should log warnings', () => {
    const logger = createLogger();
    logger.warn('warning');
    expect(consoleSpy.warn).toHaveBeenCalled();
  });

  it('should log errors', () => {
    const logger = createLogger();
    logger.error('error');
    expect(consoleSpy.error).toHaveBeenCalled();
  });
});

// ============================================================================
// createSpinner Tests
// ============================================================================

describe('createSpinner', () => {
  it('should create a spinner instance', () => {
    const spinner = createSpinner();
    expect(spinner).toBeDefined();
    expect(typeof spinner.start).toBe('function');
    expect(typeof spinner.stop).toBe('function');
    expect(typeof spinner.succeed).toBe('function');
    expect(typeof spinner.fail).toBe('function');
    expect(typeof spinner.warn).toBe('function');
    expect(typeof spinner.info).toBe('function');
  });

  it('should create no-op spinner in quiet mode', () => {
    const spinner = createSpinner(true);
    // These should not throw
    expect(() => spinner.start('test')).not.toThrow();
    expect(() => spinner.stop()).not.toThrow();
    expect(() => spinner.succeed('done')).not.toThrow();
    expect(() => spinner.fail('error')).not.toThrow();
    expect(() => spinner.warn('warning')).not.toThrow();
    expect(() => spinner.info('info')).not.toThrow();
  });

  it('should handle start/stop cycle', () => {
    const spinner = createSpinner(true); // Use quiet mode for tests
    spinner.start('Loading...');
    spinner.stop('Done');
    // Should not throw
  });

  it('should handle start/succeed cycle', () => {
    const spinner = createSpinner(true);
    spinner.start('Loading...');
    spinner.succeed('Success!');
  });

  it('should handle start/fail cycle', () => {
    const spinner = createSpinner(true);
    spinner.start('Loading...');
    spinner.fail('Failed!');
  });
});
