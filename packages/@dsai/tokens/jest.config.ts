export default {
  displayName: '@dsai/tokens',
  preset: './jest.preset.cjs',
  rootDir: '../../../',
  roots: ['<rootDir>/packages/@dsai/tokens'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  coverageDirectory: '<rootDir>/coverage/packages/@dsai/tokens',
  testMatch: ['<rootDir>/packages/@dsai/tokens/**/*.(test|spec).(ts|tsx)'],
  // Exclude auto-generated token files from coverage
  collectCoverageFrom: [
    'packages/@dsai/tokens/**/*.{ts,tsx}',
    '!packages/@dsai/tokens/src/**', // Auto-generated from Style Dictionary
    '!packages/@dsai/tokens/**/*.d.ts',
    '!packages/@dsai/tokens/**/index.ts',
  ],
};
