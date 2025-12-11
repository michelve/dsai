export default {
  displayName: '@dsai/storybook',
  preset: './jest.preset.cjs',
  rootDir: '../../../',
  roots: ['<rootDir>/packages/@dsai/storybook'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  coverageDirectory: '<rootDir>/coverage/packages/@dsai/storybook',
  testMatch: ['<rootDir>/packages/@dsai/storybook/**/*.(test|spec).(ts|tsx|js|jsx)'],
};
