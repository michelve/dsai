/** @type {import('jest').Config} */
export default {
  preset: './jest.preset.cjs',
  displayName: '@dsai-io/figma-tokens',
  rootDir: '../../../',
  roots: ['<rootDir>/packages/@dsai-io/figma-tokens'],
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
  extensionsToTreatAsEsm: ['.ts'],
  coverageDirectory: '<rootDir>/coverage/packages/@dsai-io/figma-tokens',
  collectCoverageFrom: [
    'packages/@dsai-io/figma-tokens/src/**/*.{ts,tsx}',
    '!packages/@dsai-io/figma-tokens/src/**/*.d.ts',
    '!packages/@dsai-io/figma-tokens/src/**/__tests__/**',
    '!packages/@dsai-io/figma-tokens/src/types.ts',
    '!packages/@dsai-io/figma-tokens/src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testMatch: ['<rootDir>/packages/@dsai-io/figma-tokens/**/*.(test|spec).(ts|tsx)'],
};
