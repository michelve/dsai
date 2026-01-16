// eslint.config.mjs - Flat config format (ESM)
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import securityPlugin from 'eslint-plugin-security';
import storybookPlugin from 'eslint-plugin-storybook';
import globals from 'globals';

// Stub "dsai" plugin for custom rules (placeholder for future implementation)
const dsaiPlugin = {
  rules: {
    'prefer-use-id': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Prefer useId() hook for generating unique IDs in components',
        },
        schema: [],
      },
      create() {
        return {};
      },
    },
  },
};

export default [
  // =========================
  // Global ignores
  // =========================
  {
    ignores: [
      // Dependencies
      '**/node_modules/**',

      // Build and cache outputs
      '**/dist/**',
      '**/build/**',
      '**/.nx/**',
      '**/.turbo/**',
      '**/.cache/**',
      '**/.temp/**',
      '**/coverage/**',

      // Generated docs/assets
      '**/storybook-static/**',
      '**/static/**',
      'workspace-graph.html',

      // Markdown and task docs
      '**/*.md',
      '**/tasks/**',

      // Test snapshots
      '**/*.snap',

      // CLI executables (have different requirements)
      '**/bin/**',

      // Editor/OS
      '.DS_Store',
    ],
  },

  // =========================
  // Base JS recommended
  // =========================
  js.configs.recommended,

  // =========================
  // Main config – TS + React + A11y + Import + Security + Storybook
  // =========================
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],

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
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'],
        },
      },
    },

    rules: {
      // Bring in recommended rules from each plugin
      ...tsPlugin.configs.recommended?.rules,
      ...reactPlugin.configs.recommended?.rules,
      ...reactHooksPlugin.configs.recommended?.rules,
      ...jsxA11yPlugin.configs.recommended?.rules,
      ...importPlugin.configs.recommended?.rules,
      ...securityPlugin.configs.recommended?.rules,
      ...storybookPlugin.configs.recommended?.rules,

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
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ JSX transform
      'react/jsx-uses-react': 'off',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/no-array-index-key': 'warn',

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
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',

      // ======================
      // Imports (handled by biome, but keep for editor integration)
      // ======================
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-cycle': 'error',
      'import/no-duplicates': 'error',
      'import/no-self-import': 'error',

      // ======================
      // General code quality
      // ======================
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // ======================
      // Security
      // ======================
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-object-injection': 'warn',
    },
  },

  // =========================
  // TS-only override – avoid false "no-undef" on types
  // =========================
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-undef': 'off',
    },
  },

  // =========================
  // Tests – Jest globals and relaxed rules
  // =========================
  {
    files: [
      '**/*.test.{ts,tsx,js,jsx}',
      '**/*.spec.{ts,tsx,js,jsx}',
      '**/test/**/*',
      '**/__tests__/**/*',
      '**/__mocks__/**/*',
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
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react/jsx-boolean-value': 'off',
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'off',
    },
  },

  // =========================
  // Storybook stories
  // =========================
  {
    files: ['**/*.stories.{ts,tsx,js,jsx}'],
    rules: {
      // Storybook often uses demo anchors - warn but don't block
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      // Return types in stories add noise without value
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Static demo lists often use index keys safely
      'react/no-array-index-key': 'warn',
      // Quotes in demo text are common and low-risk
      'react/no-unescaped-entities': 'warn',
      // Keep hooks rule ON - stories should use proper component patterns
    },
  },

  // =========================
  // Icon components – dynamic prop filtering
  // =========================
  {
    files: ['packages/@dsai-io/react/src/components/Icon/components/**/*.tsx'],
    rules: {
      'security/detect-object-injection': 'off',
    },
  },

  // =========================
  // Node-only scripts (tools, scripts)
  // =========================
  // Build scripts in tools, scripts, and apps
  // =========================
  {
    files: [
      'tools/**/*.{js,ts,mjs,cjs}',
      'scripts/**/*.{js,ts,mjs,cjs}',
      'apps/**/build-*.{js,mjs}',
      'packages/**/build-*.{js,mjs}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-console': 'off',
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-object-injection': 'off',
      // Disable import resolution for build scripts (pnpm workspace handles this)
      'import/no-unresolved': 'off',
    },
  },

  // =========================
  // CommonJS config files at root
  // =========================
  {
    files: ['*.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // =========================
  // Figma code connect files
  // =========================
  {
    files: ['**/*.figma.{ts,tsx}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react/jsx-key': 'off',
    },
  },

  // =========================
  // Figma plugin files (run inside Figma)
  // =========================
  {
    files: ['tools/icons/figma-plugin-icons-tsx/**/*.js', 'tools/component-metadata/**/*.js'],
    languageOptions: {
      globals: {
        figma: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // =========================
  // Dev resources with JSON import
  // =========================
  {
    files: ['tools/dev-resources/**/*.mjs'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },

  // =========================
  // CLI config files (JavaScript, not TypeScript)
  // These are executed with Node.js and don't need TypeScript rules
  // =========================
  {
    files: [
      '**/figma.config.mjs',
      '**/dsai.config.mjs',
      '**/build-tokens.mjs',
      '**/style-dictionary.config.mjs',
    ],
    rules: {
      // TypeScript rules don't apply to JavaScript files
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // CLI scripts use console for output
      'no-console': 'off',
      // forEach with print function is idiomatic in scripts
      'array-callback-return': 'off',
      // Security rules for dynamic key access - keys are controlled in these configs
      'security/detect-object-injection': 'off',
    },
  },
];
