const { pathsToModuleNameMapper } = require('ts-jest');

// Manual path mapping from tsconfig.base.json
const pathMapping = {
  '@dsai-io/tokens': ['packages/@dsai-io/tokens/src'],
  '@dsai-io/tokens/(.*)': ['packages/@dsai-io/tokens/src/$1'],
  '@dsai-io/react': ['packages/@dsai-io/react/src'],
  '@dsai-io/react/(.*)': ['packages/@dsai-io/react/src/$1'],
  '@dsai-io/figma-tokens': ['packages/@dsai-io/figma-tokens/src'],
  '@dsai-io/figma-tokens/(.*)': ['packages/@dsai-io/figma-tokens/src/$1'],
  '@dsai-io/tools': ['packages/@dsai-io/tools/src'],
  '@dsai-io/tools/(.*)': ['packages/@dsai-io/tools/src/$1'],
};

/** @type {import('jest').Config} */
module.exports = {
  // Use custom jsdom environment with matchMedia polyfill
  testEnvironment: '<rootDir>/test/jsdom-environment.ts',

  // TypeScript transformation
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          isolatedModules: true,
        },
      },
    ],
  },

  // Module resolution
  moduleNameMapper: {
    // Handle .js extensions in TypeScript imports (ESM style imports)
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // Mock test utilities path
    '^@/test/(.*)$': '<rootDir>/test/$1',
    // Map TypeScript path aliases
    ...pathsToModuleNameMapper(pathMapping, {
      prefix: '<rootDir>/',
    }),
    // Mock CSS Modules
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Mock static assets
    '\\.(jpg|jpeg|png|gif|svg|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/mocks/fileMock.js',
  },

  // File extensions to consider
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Setup files after env - runs AFTER test environment for Jest matchers etc.
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],

  // Coverage configuration
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}',
    '!packages/**/src/**/*.d.ts',
    '!packages/**/src/**/*.stories.{ts,tsx}',
    '!packages/**/src/**/*.figma.{ts,tsx}', // Figma Code Connect files (design-to-code mapping)
    '!packages/**/src/**/__tests__/**',
    '!packages/**/src/**/index.ts', // Barrel exports
    '!packages/**/src/**/Icon/**', // Icon component (auto-generated)
    '!packages/@dsai-io/tokens/src/**', // Token files (auto-generated from Style Dictionary)
  ],

  // Coverage thresholds (80% minimum as per roadmap)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  // Test match patterns
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)', '**/*.(test|spec).(ts|tsx|js|jsx)'],

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/.nx/'],

  // Watch plugins for better DX
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],

  // Performance
  maxWorkers: '50%', // Use half of available CPU cores

  // === Quality & Isolation Settings ===

  // Better test isolation - reset state between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Catch deprecated Jest APIs early
  errorOnDeprecated: true,

  // Reasonable timeout (10s) - fails slow tests early
  testTimeout: 10000,

  // Verbose output shows each test name
  verbose: true,

  // Don't stop on first failure - see all issues at once
  bail: false,

  // Randomize test order to catch hidden dependencies (optional)
  // randomize: true,

  // Detect open handles in CI (slower, but catches leaks)
  // detectOpenHandles: true,
};
