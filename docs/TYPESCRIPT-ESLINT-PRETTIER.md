# TypeScript, ESLint, and Prettier Configuration Guide

## Overview

This document explains the code quality tooling configuration for the DSAi design system monorepo.

## TypeScript Configuration

### Strict Mode Settings

We use TypeScript in strict mode to catch errors at compile time and ensure type safety across the codebase.

**Key Settings:**

- `strict: true` - Enables all strict type checking options
- `noImplicitAny: true` - Disallows implicit `any` types
- `strictNullChecks: true` - Enforces null safety
- `noUnusedLocals/Parameters: true` - Catches unused variables
- `noUncheckedIndexedAccess: true` - Requires checking array/object access

### Path Mappings

Monorepo packages can be imported using the `@dsai/*` scope:

```typescript
import { tokens } from '@dsai/tokens';
import { Button } from '@dsai/react';
```

### Project References

Each package has its own `tsconfig.json` that extends the base configuration and can reference other packages as dependencies.

## ESLint Configuration

### Enabled Rule Sets

1. **TypeScript** - `@typescript-eslint/recommended`
   - Enforces TypeScript best practices
   - Prevents common type errors
   - Encourages explicit typing

2. **React** - `plugin:react/recommended`
   - React-specific linting rules
   - JSX best practices
   - Component structure validation

3. **React Hooks** - `plugin:react-hooks/recommended`
   - `rules-of-hooks`: Enforces hooks rules
   - `exhaustive-deps`: Catches missing dependencies

4. **Accessibility** - `plugin:jsx-a11y/recommended`
   - WCAG 2.1 AA compliance checks
   - Semantic HTML enforcement
   - ARIA attributes validation

5. **Import** - `plugin:import/recommended`
   - Import statement organization
   - Prevents circular dependencies
   - Validates module resolution

### Custom Rules

#### TypeScript Rules

- `@typescript-eslint/explicit-function-return-type`: Warn level - encourages but doesn't block
- `@typescript-eslint/no-explicit-any`: Error - prevents use of `any` type
- `@typescript-eslint/consistent-type-imports`: Error - uses `import type` for types only
- `@typescript-eslint/no-unused-vars`: Error - with `_` prefix exception for intentionally unused

#### React Rules

- `react/prop-types`: Off - using TypeScript for type checking
- `react/react-in-jsx-scope`: Off - not needed with new JSX transform
- `react/self-closing-comp`: Error - enforces self-closing tags
- `react/jsx-boolean-value`: Error - enforces explicit boolean values

#### Import Rules

- `import/order`: Error - enforces consistent import order (builtin → external → internal)
- `import/no-cycle`: Error - prevents circular dependencies
- `import/no-duplicates`: Error - consolidates duplicate imports

### Overrides

Test files (`*.test.ts`, `*.spec.ts`) have relaxed rules:

- `@typescript-eslint/no-explicit-any`: Off
- `@typescript-eslint/no-non-null-assertion`: Off

## Prettier Configuration

### Code Style

- **Print Width**: 100 characters
- **Tab Width**: 2 spaces
- **Quotes**: Single quotes for strings, double for JSX
- **Semicolons**: Always required
- **Trailing Commas**: ES5-compatible (objects/arrays)
- **Bracket Spacing**: Enabled
- **Arrow Parens**: Always

### Integration

Prettier is integrated with ESLint via `eslint-plugin-prettier`. This ensures:

- Formatting errors appear as lint errors
- No conflicts between ESLint and Prettier rules
- Single command to fix both (`eslint --fix`)

## VS Code Integration

### Required Extensions

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **Nx Console** (optional but recommended)

### Workspace Settings

The `.vscode/settings.json` file configures:

- Format on save with Prettier
- Auto-fix ESLint errors on save
- Organize imports on save
- TypeScript SDK from workspace

### Recommended Workflow

1. Write code
2. Save file → Auto-format with Prettier
3. Save file → Auto-fix lint errors
4. Commit → Pre-commit hook validates

## Git Hooks (Husky + lint-staged)

### Pre-commit Hook

Automatically runs before each commit:

**For all staged files:**

1. Prettier formatting

**Note:** ESLint linting should be run separately via `pnpm lint` or in your IDE. The pre-commit hook focuses on formatting to avoid compatibility issues with ESLint v9's new configuration format.

### Bypassing Hooks

If absolutely necessary (not recommended):

```bash
git commit --no-verify
```

## Common Commands

### Build

```bash
# Build all packages
pnpm build

# Build specific package
pnpm nx build @dsai/tokens

# Build only changed packages
pnpm affected:build
```

### Linting

```bash
# Lint all packages
pnpm lint

# Lint specific package
pnpm nx lint @dsai/react

# Lint with auto-fix
pnpm nx lint @dsai/react --fix
```

### Formatting

```bash
# Check formatting
pnpm prettier --check "."

# Fix formatting
pnpm prettier --write "."

# Format specific path
pnpm prettier --write "packages/@dsai/react/**/*.ts"
```

### Type Checking

```bash
# Check all TypeScript without emitting
pnpm tsc --noEmit

# Check specific package
cd packages/@dsai/react && pnpm tsc --noEmit
```

## Troubleshooting

### Issue: "Cannot find module '@dsai/tokens'"

**Cause:** TypeScript path mappings not resolving or package not built yet.

**Solution:**

1. Build the dependency first: `pnpm nx build @dsai/tokens`
2. Check `tsconfig.base.json` paths configuration
3. Restart TypeScript server in VS Code (Cmd/Ctrl + Shift + P → "Restart TS Server")

### Issue: ESLint "Unable to resolve path to module"

**Cause:** Import resolver not finding the module.

**Solution:**

1. Ensure `eslint-import-resolver-typescript` is installed
2. Check `.eslintrc.json` settings → import/resolver → typescript
3. Verify the module exists and is exported

### Issue: Prettier and ESLint conflicts

**Cause:** Conflicting rules between Prettier and ESLint.

**Solution:**

- `eslint-config-prettier` should be last in extends array
- Run `pnpm prettier --write` first, then `pnpm lint --fix`
- Check that both tools are reading correct configs

### Issue: Pre-commit hook fails but code looks fine

**Cause:** Staged files have issues, working directory is clean.

**Solution:**

```bash
# See what's staged
git diff --staged

# Fix staged files
pnpm lint --fix
git add -u

# Try commit again
git commit
```

### Issue: TypeScript "Cannot write file... it would overwrite input file"

**Cause:** TypeScript trying to emit in source directory.

**Solution:**

- Check `outDir` in tsconfig.json points to `./dist`
- Ensure `rootDir` is set to `./src`
- Clear `.nx/cache` and rebuild

### Issue: VS Code not showing errors

**Cause:** TypeScript or ESLint server issues.

**Solution:**

1. Restart VS Code
2. Check "Output" panel → "TypeScript" or "ESLint" channel for errors
3. Ensure workspace TypeScript version is being used (bottom right of VS Code)
4. Run "Developer: Reload Window" (Cmd/Ctrl + R)

## Best Practices

### Type Safety

✅ **DO:**

- Use explicit return types for exported functions
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, intersections, and primitives
- Add JSDoc comments for complex types

❌ **DON'T:**

- Use `any` type (use `unknown` if truly dynamic)
- Use `@ts-ignore` (use `@ts-expect-error` with explanation)
- Leave function return types implicit for public APIs

### React Components

✅ **DO:**

- Use functional components with hooks
- Type component props as `interface`
- Use React.FC sparingly (prefer explicit typing)
- Extract complex logic to custom hooks

❌ **DON'T:**

- Use class components unless necessary
- Inline complex JSX expressions
- Forget dependency arrays in hooks
- Mutate props or state

### Imports

✅ **DO:**

- Use path aliases (`@dsai/tokens`)
- Group imports logically (external → internal)
- Use `import type` for type-only imports
- Sort imports alphabetically

❌ **DON'T:**

- Use relative paths for cross-package imports
- Mix named and default imports inconsistently
- Create circular dependencies

### Accessibility

✅ **DO:**

- Use semantic HTML elements
- Add ARIA labels for interactive elements
- Ensure keyboard navigation works
- Test with screen readers

❌ **DON'T:**

- Use `div` with `onClick` without role/keyboard handling
- Skip alt text on images
- Use color alone to convey information
- Ignore ESLint accessibility warnings

## Configuration Files Reference

### `tsconfig.base.json`

Base TypeScript configuration for the entire monorepo.

### `packages/@dsai/*/tsconfig.json`

Per-package TypeScript configuration extending base.

### `.eslintrc.json`

ESLint rules and plugin configuration.

### `.prettierrc`

Prettier formatting rules.

### `.prettierignore`

Files/directories excluded from Prettier formatting.

### `.lintstagedrc`

Defines what commands run on staged files during pre-commit.

### `.husky/pre-commit`

Git pre-commit hook script.

### `.vscode/settings.json`

VS Code workspace settings for editor integration.

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
- [jsx-a11y Plugin](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [TypeScript ESLint](https://typescript-eslint.io/)

---

**Maintained by:** DSAi Team
**Last Updated:** 2025-11-07
**Version:** 1.0.0
