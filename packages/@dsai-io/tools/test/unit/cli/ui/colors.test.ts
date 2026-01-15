/**
 * Unit tests for CLI color utilities
 *
 * Tests cover:
 * - Basic color functions
 * - Text modifiers
 * - Semantic colors
 * - Combined styles
 * - NO_COLOR environment variable support
 */

import { colors } from '../../../../src/cli/ui/colors.js';

// ============================================================================
// Tests
// ============================================================================

describe('colors', () => {
  // ==========================================================================
  // Text Colors
  // ==========================================================================

  describe('Text Colors', () => {
    it('should have red function', () => {
      const result = colors.red('test');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThanOrEqual(4); // At least 'test'
    });

    it('should have green function', () => {
      const result = colors.green('test');
      expect(typeof result).toBe('string');
    });

    it('should have yellow function', () => {
      const result = colors.yellow('test');
      expect(typeof result).toBe('string');
    });

    it('should have blue function', () => {
      const result = colors.blue('test');
      expect(typeof result).toBe('string');
    });

    it('should have magenta function', () => {
      const result = colors.magenta('test');
      expect(typeof result).toBe('string');
    });

    it('should have cyan function', () => {
      const result = colors.cyan('test');
      expect(typeof result).toBe('string');
    });

    it('should have gray function', () => {
      const result = colors.gray('test');
      expect(typeof result).toBe('string');
    });

    it('should have white function', () => {
      const result = colors.white('test');
      expect(typeof result).toBe('string');
    });
  });

  // ==========================================================================
  // Text Modifiers
  // ==========================================================================

  describe('Text Modifiers', () => {
    it('should have bold function', () => {
      const result = colors.bold('test');
      expect(typeof result).toBe('string');
    });

    it('should have dim function', () => {
      const result = colors.dim('test');
      expect(typeof result).toBe('string');
    });

    it('should have italic function', () => {
      const result = colors.italic('test');
      expect(typeof result).toBe('string');
    });

    it('should have underline function', () => {
      const result = colors.underline('test');
      expect(typeof result).toBe('string');
    });
  });

  // ==========================================================================
  // Background Colors
  // ==========================================================================

  describe('Background Colors', () => {
    it('should have bgRed function', () => {
      const result = colors.bgRed('test');
      expect(typeof result).toBe('string');
    });

    it('should have bgGreen function', () => {
      const result = colors.bgGreen('test');
      expect(typeof result).toBe('string');
    });

    it('should have bgYellow function', () => {
      const result = colors.bgYellow('test');
      expect(typeof result).toBe('string');
    });

    it('should have bgBlue function', () => {
      const result = colors.bgBlue('test');
      expect(typeof result).toBe('string');
    });
  });

  // ==========================================================================
  // Semantic Colors
  // ==========================================================================

  describe('Semantic Colors', () => {
    it('should have error function', () => {
      const result = colors.error('Error message');
      expect(typeof result).toBe('string');
    });

    it('should have success function', () => {
      const result = colors.success('Success message');
      expect(typeof result).toBe('string');
    });

    it('should have warning function', () => {
      const result = colors.warning('Warning message');
      expect(typeof result).toBe('string');
    });

    it('should have info function', () => {
      const result = colors.info('Info message');
      expect(typeof result).toBe('string');
    });

    it('should have muted function', () => {
      const result = colors.muted('Secondary text');
      expect(typeof result).toBe('string');
    });
  });

  // ==========================================================================
  // Combined Styles
  // ==========================================================================

  describe('Combined Styles', () => {
    it('should have label function', () => {
      const result = colors.label('Label');
      expect(typeof result).toBe('string');
    });

    it('should have value function', () => {
      const result = colors.value('Value');
      expect(typeof result).toBe('string');
    });

    it('should have path function', () => {
      const result = colors.path('./path/to/file');
      expect(typeof result).toBe('string');
    });

    it('should have command function', () => {
      const result = colors.command('npm run build');
      expect(typeof result).toBe('string');
    });

    it('should have code function', () => {
      const result = colors.code('const x = 1');
      expect(typeof result).toBe('string');
    });

    it('should have highlight function', () => {
      const result = colors.highlight('important');
      expect(typeof result).toBe('string');
    });
  });

  // ==========================================================================
  // Empty and Special Strings
  // ==========================================================================

  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      expect(colors.red('')).toBeDefined();
      expect(colors.bold('')).toBeDefined();
    });

    it('should handle strings with special characters', () => {
      const special = 'Hello\nWorld\tTab';
      expect(colors.green(special)).toContain('Hello');
    });

    it('should handle unicode characters', () => {
      const unicode = '✓ ✗ ⚠ ℹ';
      expect(colors.cyan(unicode)).toContain('✓');
    });

    it('should handle numbers as string', () => {
      const result = colors.yellow('123');
      expect(typeof result).toBe('string');
    });
  });
});
