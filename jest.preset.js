const { pathsToModuleNameMapper } = require('ts-jest');

// Manual path mapping from tsconfig.base.json
const pathMapping = {
  '@dsai/tokens': ['packages/@dsai/tokens/src'],
  '@dsai/tokens/(.*)': ['packages/@dsai/tokens/src/$1'],
  '@dsai/react': ['packages/@dsai/react/src'],
  '@dsai/react/(.*)': ['packages/@dsai/react/src/$1'],
  '@dsai/figma-tokens': ['packages/@dsai/figma-tokens/src'],
  '@dsai/figma-tokens/(.*)': ['packages/@dsai/figma-tokens/src/$1'],
};

/** @type {import('jest').Config} */
module.exports = {
  // Use jsdom for React component testing
  testEnvironment: 'jsdom',

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

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],

  // Coverage configuration
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}',
    '!packages/**/src/**/*.d.ts',
    '!packages/**/src/**/*.stories.{ts,tsx}',
    '!packages/**/src/**/__tests__/**',
    '!packages/**/src/**/index.ts', // Barrel exports
  ],

  // Coverage thresholds (80% minimum as per roadmap)
  coverageThresholds: {
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
  bail: false, // Don't stop on first test failure
};
