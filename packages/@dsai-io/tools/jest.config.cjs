/** @type {import('jest').Config} */
module.exports = {
  preset: '../../../jest.preset.cjs',
  displayName: 'tools',
  testEnvironment: 'node',
  coverageDirectory: '../../../coverage/packages/@dsai-io/tools',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 33,
      statements: 33,
    },
  },
  extensionsToTreatAsEsm: ['.ts'],
};
