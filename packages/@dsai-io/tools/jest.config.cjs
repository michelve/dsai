/** @type {import('jest').Config} */
module.exports = {
  preset: '../../../jest.preset.cjs',
  displayName: 'tools',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        diagnostics: false,
        useESM: true,
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          isolatedModules: true,
        },
      },
    ],
  },
  coverageDirectory: '../../../coverage/packages/@dsai-io/tools',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
    // TODO: Add test coverage for these modules
    '!src/cli/**',
    '!src/registry/**',
    '!src/tokens/build.ts',
    '!src/tokens/mode-extractor.ts',
    '!src/tokens/mode-preprocessor.ts',
    '!src/tokens/snapshot.ts',
    '!src/tokens/theme-builder.ts',
    '!src/tokens/theme-discovery.ts',
    '!src/tokens/style-dictionary/types.ts',
    '!src/tokens/style-dictionary/formats/**',
    '!src/tokens/style-dictionary/transforms/**',
    '!src/tokens/framework-mappers/**',
    '!src/utils/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  extensionsToTreatAsEsm: ['.ts'],
};
