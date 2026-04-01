export default {
  preset: './jest.preset.cjs',
  displayName: '@dsai-io/storybook',
  rootDir: '../../../',
  roots: ['<rootDir>/packages/@dsai-io/storybook'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  coverageDirectory: '<rootDir>/coverage/packages/@dsai-io/storybook',
  testMatch: ['<rootDir>/packages/@dsai-io/storybook/**/*.(test|spec).(ts|tsx|js|jsx)'],
};
