/**
 * Global test setup file
 * Runs once before all tests
 */

import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers with jest-axe
expect.extend(toHaveNoViolations);

// Mock window.matchMedia (not implemented in jsdom)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver (not implemented in jsdom)
(global as typeof globalThis & { IntersectionObserver: unknown }).IntersectionObserver =
  class IntersectionObserver {
    root = null;
    rootMargin = '';
    scrollMargin = '';
    thresholds = [];

    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  };

// Mock ResizeObserver (not implemented in jsdom)
(global as typeof globalThis & { ResizeObserver: unknown }).ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Suppress console errors/warnings in tests (optional - remove if you want to see them)
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Suppress React error boundary errors in tests
    if (typeof args[0] === 'string' && args[0].includes('Error: Uncaught [Error:')) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: unknown[]) => {
    // Suppress specific warnings if needed
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
