// eslint.config.cjs
const js = require('@eslint/js');
const globals = require('globals');

const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const importPlugin = require('eslint-plugin-import');
const securityPlugin = require('eslint-plugin-security');
const storybookPlugin = require('eslint-plugin-storybook');

// Recommended configs (we'll reuse just their rules)
const tsRecommended = tsPlugin.configs.recommended;
const reactRecommended = reactPlugin.configs.recommended;
const reactHooksRecommended = reactHooksPlugin.configs.recommended;
const jsxA11yRecommended = jsxA11yPlugin.configs.recommended;
const importRecommended = importPlugin.configs.recommended;
const securityRecommended = securityPlugin.configs.recommended;
const storybookRecommended = storybookPlugin.configs.recommended;

// Stub "dsai" plugin so dsai/prefer-use-id doesn't blow up
const dsaiPlugin = {
  rules: {
    'prefer-use-id': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Temporary no-op rule for dsai/prefer-use-id until a real implementation exists.',
        },
        schema: [],
      },
      create() {
        return {};
      },
    },
  },
};

module.exports = [
  // =========================
  // Global ignores
  // =========================
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.nx/**',
      '**/coverage/**',
      '**/storybook-static/**',
    ],
  },

  // =========================
  // Base JS recommended (eslint:recommended)
  // =========================
  js.configs.recommended,

  // =========================
  // Main config – TS + React + A11y + Import + Security + Storybook
  // =========================
  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
      security: securityPlugin,
      storybook: storybookPlugin,
      dsai: dsaiPlugin,
    },

    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.base.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    rules: {
      // Bring in recommended rules from each plugin
      ...(tsRecommended?.rules ?? {}),
      ...(reactRecommended?.rules ?? {}),
      ...(reactHooksRecommended?.rules ?? {}),
      ...(jsxA11yRecommended?.rules ?? {}),
      ...(importRecommended?.rules ?? {}),
      ...(securityRecommended?.rules ?? {}),
      ...(storybookRecommended?.rules ?? {}),

      // ======================
      // TypeScript
      // ======================
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // ======================
      // React
      // ======================
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
        },
      ],
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],

      // ======================
      // React Hooks
      // ======================
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ======================
      // Accessibility (JSX a11y)
      // ======================
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',

      // ======================
      // Imports
      // ======================
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-cycle': 'error',
      'import/no-duplicates': 'error',

      // ======================
      // General code quality
      // ======================
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // ======================
      // Security – strict for Codacy-style checks
      // ======================
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-object-injection': 'warn',
    },
  },

  // =========================
  // TS-only override – avoid false "no-undef" on types / React namespace
  // =========================
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-undef': 'off',
    },
  },

  // =========================
  // Tests – add Jest globals and relax some rules
  // =========================
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.test.js',
      '**/*.test.jsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.spec.js',
      '**/*.spec.jsx',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off', // ← add this
      // Don't enforce JSX boolean style inside tests
      'react/jsx-boolean-value': 'off',
    },
  },

  // =========================
  // Icon components – safe dynamic prop filtering
  // =========================
  {
    files: ['packages/@dsai/react/src/components/Icon/components/**/*.tsx'],
    rules: {
      // Icon components use a controlled allow-list (ALLOWED_PROPS) to filter
      // SVG props, so this rule is too noisy here.
      'security/detect-object-injection': 'off',
    },
  },

  // =========================
  // Node-only scripts (tools, scripts)
  // =========================
  {
    files: [
      'tools/**/*.js',
      'tools/**/*.ts',
      'tools/**/*.mjs',
      'tools/**/*.cjs',
      'scripts/**/*.js',
      'scripts/**/*.ts',
      'scripts/**/*.mjs',
      'scripts/**/*.cjs',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Allow require() in Node.js scripts
      '@typescript-eslint/no-require-imports': 'off',
      // Relax return type requirements for scripts
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Allow console.log in scripts
      'no-console': 'off',
      // Security: These scripts are build tools, not user-facing code
      // They operate on known, trusted file paths
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-object-injection': 'off',
    },
  },
];
