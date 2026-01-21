/** @type {import('jest').Config} */
export default {
  displayName: '@dsai-io/figma-tokens',
  rootDir: '../../../',
  roots: ['<rootDir>/packages/@dsai-io/figma-tokens'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/packages/@dsai-io/figma-tokens/tsconfig.json',
        useESM: true,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  coverageDirectory: '<rootDir>/coverage/packages/@dsai-io/figma-tokens',
  collectCoverageFrom: [
    'packages/@dsai-io/figma-tokens/src/**/*.{ts,tsx}',
    '!packages/@dsai-io/figma-tokens/src/**/*.d.ts',
    '!packages/@dsai-io/figma-tokens/src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 60,
      lines: 55,
      statements: 55,
    },
  },
  testMatch: ['<rootDir>/packages/@dsai-io/figma-tokens/**/*.(test|spec).(ts|tsx)'],
};
