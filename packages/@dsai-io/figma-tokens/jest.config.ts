export default {
  displayName: '@dsai/figma-tokens',
  preset: './jest.preset.cjs',
  rootDir: '../../../',
  roots: ['<rootDir>/packages/@dsai/figma-tokens'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  coverageDirectory: '<rootDir>/coverage/packages/@dsai/figma-tokens',
  testMatch: ['<rootDir>/packages/@dsai/figma-tokens/**/*.(test|spec).(ts|tsx)'],
};
