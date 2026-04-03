/**
 * Custom JSDOM test environment with matchMedia polyfill
 * This ensures matchMedia is available before any test code runs
 */
import { TestEnvironment } from 'jest-environment-jsdom';

import type { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';

export default class JsdomWithMatchMediaEnvironment extends TestEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);

    // Create a mock function that works without jest.fn()
    const createMockFn = (): (() => void) => (): void => {};

    // Add matchMedia mock to the jsdom window
    // This runs before any test code is executed
    Object.defineProperty(this.global.window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: createMockFn(), // Deprecated
        removeListener: createMockFn(), // Deprecated
        addEventListener: createMockFn(),
        removeEventListener: createMockFn(),
        dispatchEvent: createMockFn(),
      }),
    });

    // Add scrollTo mock
    Object.defineProperty(this.global.window, 'scrollTo', {
      writable: true,
      value: createMockFn(),
    });
  }
}
