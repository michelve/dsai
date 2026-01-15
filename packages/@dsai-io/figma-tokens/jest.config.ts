export default {
  displayName: '@dsai-io/figma-tokens',
  preset: './jest.preset.cjs',
  rootDir: '../../../',
  roots: ['<rootDir>/packages/@dsai-io/figma-tokens'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  coverageDirectory: '<rootDir>/coverage/packages/@dsai-io/figma-tokens',
  testMatch: ['<rootDir>/packages/@dsai-io/figma-tokens/**/*.(test|spec).(ts|tsx)'],
};
