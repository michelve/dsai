export default {
  displayName: '@dsai-io/storybook',
  preset: './jest.preset.cjs',
  rootDir: '../../../',
  roots: ['<rootDir>/packages/@dsai-io/storybook'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  coverageDirectory: '<rootDir>/coverage/packages/@dsai-io/storybook',
  testMatch: ['<rootDir>/packages/@dsai-io/storybook/**/*.(test|spec).(ts|tsx|js|jsx)'],
};
