/**
 * Hooks Test Setup
 *
 * This file is automatically loaded before hook tests run.
 * It sets up global mocks and utilities needed for testing hooks.
 */

import { installMatchMediaMock, resetMatchMediaMock } from './mocks/matchMedia';
import { installResizeObserverMock, resetResizeObserverMock } from './mocks/resizeObserver';

/**
 * Install global mocks before all tests
 */
beforeAll(() => {
  installMatchMediaMock();
  installResizeObserverMock();
});

/**
 * Reset mocks between tests to prevent test pollution
 */
beforeEach(() => {
  resetMatchMediaMock();
  resetResizeObserverMock();
});

/**
 * Cleanup after all tests
 */
afterAll(() => {
  jest.restoreAllMocks();
});
