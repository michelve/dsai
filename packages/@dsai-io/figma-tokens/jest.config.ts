/** @type {import('jest').Config} */
export default {
  preset: '../../../jest.preset.cjs',
  displayName: '@dsai-io/figma-tokens',
  rootDir: '../../../',
  roots: ['<rootDir>/packages/@dsai-io/figma-tokens'],
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
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
