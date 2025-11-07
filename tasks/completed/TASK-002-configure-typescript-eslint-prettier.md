# Task Template

**Task ID:** TASK-002
**Title:** Configure TypeScript, ESLint, and Prettier
**Priority:** Critical
**Status:** ✅ Completed
**Assigned To:** Developer
**Estimated Time:** 6 hours
**Actual Time:** 5 hours
**Phase:** Phase 0 - Foundation (Week 1-4)
**Created:** 2025-11-07
**Updated:** 2025-11-07
**Completed:** 2025-11-07

---

## 📋 Task Description

### Goal

Configure enterprise-grade code quality tooling including TypeScript strict mode, ESLint with React best practices, and Prettier for consistent code formatting across the monorepo.

### Problem/Issue

Without standardized tooling and configuration:

- Code quality will vary across components
- Type safety cannot be guaranteed
- Collaboration becomes difficult with inconsistent formatting
- Enterprise requirements for strict typing won't be met

### Expected Outcome

All packages use TypeScript strict mode, ESLint catches common errors, Prettier ensures consistent formatting, and IDE integration works seamlessly.

---

## 🎯 Acceptance Criteria

- [x] TypeScript configured in strict mode
- [x] Shared tsconfig.json base configuration
- [x] ESLint configured with React, TypeScript, and accessibility rules
- [x] Prettier configured with consistent formatting rules
- [x] ESLint and Prettier integrate without conflicts
- [x] VS Code settings.json for automatic formatting
- [x] Pre-commit hooks configured (husky + lint-staged)
- [x] All packages inherit base configurations
- [x] No TypeScript errors in codebase
- [x] ESLint rules documented with reasoning

---

## 📂 Files to Create

- `tsconfig.base.json` - Base TypeScript configuration
- `packages/@yourorg/react/tsconfig.json` - React package config
- `packages/@yourorg/tokens/tsconfig.json` - Tokens package config
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Prettier ignore patterns
- `.vscode/settings.json` - VS Code workspace settings
- `.husky/pre-commit` - Git pre-commit hook
- `.lintstagedrc` - Lint-staged configuration

---

## 🔗 Dependencies

### Prerequisites

- [x] TASK-001: Nx monorepo structure created

### Blocks

- TASK-003: Build pipeline (needs TypeScript config)
- TASK-011: Token system (needs TypeScript for types)
- All component tasks (need TypeScript and linting)

---

## 🧪 Testing Requirements

- [x] `tsc --noEmit` passes across all packages
- [x] `nx run-many --target=lint --all` passes
- [x] Prettier check passes: `prettier --check "."`
- [x] Pre-commit hooks work correctly
- [x] VS Code shows no TypeScript errors
- [x] Import paths resolve correctly

---

## 📖 Documentation Requirements

- [x] Document TypeScript compiler options choices
- [x] Explain ESLint rules and why they're enabled
- [x] Create troubleshooting guide for common type errors
- [x] Document import path aliases
- [x] Add IDE setup instructions (VS Code, WebStorm)

---

## 🔄 Implementation Steps

1. [x] Install TypeScript and related dependencies

   ```bash
   pnpm add -D -w typescript @types/react @types/react-dom @types/node
   ```

2. [x] Create tsconfig.base.json with strict settings:

   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "target": "ES2020",
       "module": "ESNext",
       "moduleResolution": "node",
       "jsx": "react-jsx"
     }
   }
   ```

3. [x] Install ESLint and plugins

   ```bash
   pnpm add -D -w eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
   pnpm add -D -w eslint-plugin-react eslint-plugin-react-hooks
   pnpm add -D -w eslint-plugin-jsx-a11y eslint-plugin-import
   ```

4. [x] Configure ESLint with React and accessibility rules

5. [x] Install Prettier and integration

   ```bash
   pnpm add -D -w prettier eslint-config-prettier eslint-plugin-prettier
   ```

6. [x] Configure Prettier with team preferences

7. [x] Set up VS Code workspace settings for format on save

8. [x] Install and configure husky + lint-staged

   ```bash
   pnpm add -D -w husky lint-staged
   npx husky init
   ```

9. [x] Configure pre-commit hook to run lint-staged

10. [x] Create package-specific tsconfig files extending base

11. [x] Test all configurations work together

12. [x] Document setup and common issues

---

## 📝 Notes

**TypeScript Strict Mode Rationale:**

- Catches bugs at compile time
- Required for enterprise code quality
- Self-documenting code through types
- Better IDE autocomplete

**Key ESLint Rules:**

- `react-hooks/rules-of-hooks`: Enforce hook rules
- `react-hooks/exhaustive-deps`: Catch missing dependencies
- `jsx-a11y/*`: Accessibility compliance
- `@typescript-eslint/no-explicit-any`: Prevent `any` type
- `@typescript-eslint/explicit-function-return-type`: Document return types

**Prettier Configuration:**

- 2 spaces for indentation
- Single quotes for strings
- No trailing commas in ES5
- Semicolons required
- Print width: 100 characters

**Performance Consideration:**

- Use `.eslintignore` to skip node_modules, dist, build
- Use `skipLibCheck: true` in TypeScript for faster builds
- Cache ESLint results with `--cache` flag

**Estimated Effort:** 6 hours

- TypeScript configuration: 2 hours
- ESLint setup and testing: 2 hours
- Prettier and integration: 1 hour
- Git hooks and documentation: 1 hour

---

## ✅ Definition of Done

- [x] All acceptance criteria met
- [x] TypeScript strict mode enabled, no errors
- [x] ESLint runs successfully on all packages
- [x] Prettier formats code consistently
- [x] Pre-commit hooks prevent bad commits
- [x] VS Code integration working
- [x] Documentation complete
- [x] Team onboarded to tooling
