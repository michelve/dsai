/**
 * Jest test setup for @dsai-io/tools
 *
 * Configures global test environment, custom matchers, and cleanup.
 */

export {};

// ============================================================================
// Custom Matchers - Type Declarations
// ============================================================================

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // Extend Jest matchers with custom matchers
    interface Matchers<R> {
      toBeValidCSSVariable(): R;
      toContainValidCSS(): R;
      toBeValidHexColor(): R;
      toBeValidTokenName(): R;
    }
  }
}

// ============================================================================
// Custom Matcher Implementations
// ============================================================================

expect.extend({
  /**
   * Check if a string is a valid CSS variable name
   */
  toBeValidCSSVariable(received: string) {
    const pattern = /^--[\w-]+$/;
    const pass = pattern.test(received);
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid CSS variable`
          : `expected ${received} to be a valid CSS variable (format: --variable-name)`,
    };
  },

  /**
   * Check if a string contains valid CSS with :root and variables
   */
  toContainValidCSS(received: string) {
    const hasRoot = received.includes(':root');
    const variablePattern = /--[\w-]+:\s*[^;]+;/;
    const hasVariables = variablePattern.test(received);
    const pass = hasRoot && hasVariables;
    return {
      pass,
      message: () =>
        pass
          ? `expected CSS not to be valid`
          : `expected CSS to contain :root selector and CSS custom properties`,
    };
  },

  /**
   * Check if a string is a valid hex color
   */
  toBeValidHexColor(received: string) {
    const hexPattern = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
    const pass = hexPattern.test(received);
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid hex color`
          : `expected ${received} to be a valid hex color (format: #RGB, #RRGGBB, or #RRGGBBAA)`,
    };
  },

  /**
   * Check if a string is a valid token name (kebab-case)
   */
  toBeValidTokenName(received: string) {
    // Simple validation: starts with letter, contains only lowercase, numbers, hyphens
    const isValid =
      received.length > 0 &&
      received[0] >= 'a' &&
      received[0] <= 'z' &&
      !received.includes('--') &&
      /^[a-z0-9-]+$/.test(received);
    return {
      pass: isValid,
      message: () =>
        isValid
          ? `expected ${received} not to be a valid token name`
          : `expected ${received} to be a valid token name (kebab-case)`,
    };
  },
});

// ============================================================================
// Global Configuration
// ============================================================================

// Default test timeout (30 seconds for async operations)
jest.setTimeout(30000);

// Suppress console output during tests unless DEBUG is set
if (!process.env.DEBUG && !process.env.VERBOSE) {
  const originalConsole = { ...console };

  beforeAll(() => {
    global.console = {
      ...originalConsole,
      log: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      // Keep warn and error visible for debugging
      warn: originalConsole.warn,
      error: originalConsole.error,
    } as unknown as Console;
  });

  afterAll(() => {
    global.console = originalConsole;
  });
}

// ============================================================================
// Global Cleanup
// ============================================================================

afterAll(async () => {
  // Clean up any lingering async operations
  await new Promise((resolve) => setTimeout(resolve, 100));
});
