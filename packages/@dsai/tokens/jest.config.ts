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
};
