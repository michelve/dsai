import { pathsToModuleNameMapper } from 'ts-jest';

// Manual path mapping from tsconfig.base.json
const pathMapping = {
  '@dsai-io/react': ['packages/@dsai-io/react/src'],
  '@dsai-io/react/(.*)': ['packages/@dsai-io/react/src/$1'],
  '@dsai-io/figma-tokens': ['packages/@dsai-io/figma-tokens/src'],
  '@dsai-io/figma-tokens/(.*)': ['packages/@dsai-io/figma-tokens/src/$1'],
};

export default {
  displayName: '@dsai-io/react',
  testEnvironment: 'jsdom',
  rootDir: '../../../',
  roots: ['<rootDir>/packages/@dsai-io/react'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          isolatedModules: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/test/(.*)$': '<rootDir>/test/$1',
    ...pathsToModuleNameMapper(pathMapping, {
      prefix: '<rootDir>/',
    }),
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: [
    '<rootDir>/test/setup.ts',
    '<rootDir>/packages/@dsai-io/react/src/hooks/__tests__/setup.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/packages/@dsai-io/react',
  coverageThreshold: {
    'packages/@dsai-io/react/src/hooks/**/*.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testMatch: ['<rootDir>/packages/@dsai-io/react/**/*.(test|spec).(ts|tsx)'],
};
