/**
 * Mock utilities for tests
 */

import type { DsaiConfig } from '../../src/config/types.js';

/**
 * Create a mock token object
 *
 * @param overrides - Properties to override
 * @returns Mock token
 */
export function createMockToken(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    name: 'color-blue-500',
    path: ['color', 'blue', '500'],
    value: '#3b82f6',
    original: { value: '#3b82f6' },
    $value: '#3b82f6',
    $type: 'color',
    ...overrides,
  };
}

/**
 * Create a minimal DsaiConfig object
 *
 * @param overrides - Properties to override
 * @returns Mock config
 */
export function createMockConfig(overrides: Partial<DsaiConfig> = {}): DsaiConfig {
  return {
    global: {
      debug: false,
      ...overrides.global,
    },
    tokens: {
      sourceDir: './figma-exports',
      outputDir: './dist',
      prefix: '--dsai-',
      baseFontSize: 16,
      outputReferences: true,
      formats: ['css', 'js'],
      ...overrides.tokens,
    },
    icons: {
      sourceDir: './icons',
      outputDir: './dist/icons',
      framework: 'react',
      optimize: true,
      ...overrides.icons,
    },
  };
}

/**
 * Create a mock resolved config (simplified version)
 *
 * @param overrides - Properties to override
 * @returns Mock resolved config object
 */
export function createMockResolvedConfig(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    configDir: process.cwd(),
    global: {
      cwd: process.cwd(),
      debug: false,
      logLevel: 'info',
      ...(overrides.global as Record<string, unknown>),
    },
    tokens: {
      source: 'theme',
      sourceDir: './figma-exports',
      collectionsDir: './collections',
      outputDir: './dist',
      prefix: '--dsai-',
      baseFontSize: 16,
      outputReferences: true,
      formats: ['css', 'js'],
      transforms: [],
      customFormats: [],
      preprocessors: [],
      filters: [],
      ...(overrides.tokens as Record<string, unknown>),
    },
    icons: {
      sourceDir: './icons',
      outputDir: './dist/icons',
      framework: 'react',
      typescript: true,
      optimize: true,
      prefix: 'Icon',
      ...(overrides.icons as Record<string, unknown>),
    },
    ...overrides,
  };
}

/**
 * Create a mock logger with jest functions
 *
 * @returns Mock logger object
 */
export function createMockLogger() {
  return {
    log: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };
}

/**
 * Create a mock spinner with jest functions
 *
 * @returns Mock spinner object
 */
export function createMockSpinner() {
  return {
    start: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
    warn: jest.fn().mockReturnThis(),
    info: jest.fn().mockReturnThis(),
    text: '',
  };
}

/**
 * Create a mock token collection
 *
 * @returns Mock token collection
 */
export function createMockTokenCollection() {
  return {
    color: {
      blue: {
        50: { $value: '#eff6ff', $type: 'color' },
        100: { $value: '#dbeafe', $type: 'color' },
        500: { $value: '#3b82f6', $type: 'color' },
        900: { $value: '#1e3a8a', $type: 'color' },
      },
      primary: { $value: '{color.blue.500}', $type: 'color' },
    },
    spacing: {
      1: { $value: '4px', $type: 'dimension' },
      2: { $value: '8px', $type: 'dimension' },
      4: { $value: '16px', $type: 'dimension' },
    },
    fontWeight: {
      normal: { $value: 400, $type: 'fontWeight' },
      bold: { $value: 700, $type: 'fontWeight' },
    },
  };
}
