# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DSAi is a production-ready React 19 component library (33 components, 23 hooks, 23 utility modules) built as an Nx monorepo with TypeScript strict mode, Bootstrap 5-compatible styling, WCAG 2.1 AA accessibility, and design token integration.

**Runtime requirements:** Node.js ≥ 22, pnpm ≥ 10.

## Common Commands

```bash
# Build & Dev
pnpm build                        # Build all packages
pnpm dev                          # Dev mode for all packages
nx run @dsai-io/react:build       # Build single package

# Testing
pnpm test                         # Run all tests (Jest)
pnpm test:watch                   # Watch mode
pnpm test:coverage                # With coverage report
pnpm test:ci                      # CI mode (--ci --coverage --maxWorkers=2)
jest --testPathPattern=Button      # Run tests matching a pattern

# Linting
pnpm lint                         # Lint all packages
nx run @dsai-io/react:lint        # Lint single package

# Affected (only changed packages)
pnpm affected:build
pnpm affected:test

# Design Tokens
pnpm tokens:build                 # Build + validate tokens
pnpm tokens:transform             # Transform only
pnpm tokens:validate              # Validate only

# Add Components (via @dsai-io/tools CLI)
dsai add button modal tabs          # Add specific components
dsai add use-focus-trap cn          # Add hooks and utilities
dsai add --list                     # Browse all available items
dsai add --all --type hook          # Add all hooks
dsai add modal --dry-run            # Preview without writing files

# Figma
pnpm figma:connect                # Set up Figma Code Connect
pnpm figma:publish:dry            # Dry-run publish
```

Always prefer running tasks through `nx` rather than underlying tooling directly.

## Architecture

**Monorepo layout (Nx):**
- `packages/@dsai-io/react/` — Component library (33 components in `src/components/`, 23 hooks in `src/hooks/`, 23 utility modules in `src/utils/`)
- `packages/@dsai-io/tools/` — CLI tooling, token pipeline, build utilities (CLI: `dsai`)
- `packages/@dsai-io/figma-tokens/` — Figma Variables API integration
- `packages/@dsai-io/storybook/` — Storybook 10 documentation
- `packages/@dsai-io/docs/` — Documentation package
- `apps/playground/` — Development playground

**Build system:** tsup (ESM + CJS + declarations). Each package has `tsconfig.build.json` that removes path mappings to avoid declaration errors.

**Path aliases** (tsconfig.base.json):
- `@dsai-io/react` → `packages/@dsai-io/react/src`
- `@dsai-io/tools` → `packages/@dsai-io/tools/src`
- `@dsai-io/figma-tokens` → `packages/@dsai-io/figma-tokens/src`

## Component Patterns

- **Compound components:** `Card.Header`, `Card.Body`, `Card.Title`
- **Ref pattern:** `memo(forwardRef(function ComponentName(...)))` — always set `displayName`
- **Props:** Defined in separate `*.types.ts` files
- **Class composition:** Use `cn()` utility (not CSS modules)
- **Controlled/uncontrolled:** Via `useControllableState` hook
- **Focus management:** `useFocusTrap` hook for modals

## Code Quality Standards

**Formatting:** Biome + Prettier — single quotes, trailing commas (ES5), 100 char line width, 2-space indent.

**TypeScript:** Strict mode enforced. No `any` without justification. Explicit return types on public exports.

**Security (critical):**
- No bracket notation for dynamic property access — use `Reflect.get()` for safe dynamic reads
- Block prototype pollution keys: `__proto__`, `constructor`, `prototype`
- No nested quantifiers in regex (ReDoS prevention)
- Input validation with allowlists, not blocklists

**Accessibility (mandatory):**
- All components must have jest-axe tests
- Keyboard navigation: Tab, Enter/Space, Escape, Arrow keys
- ARIA roles and labels required
- Color contrast: 4.5:1 normal text, 3:1 large text/UI

## Testing

**Stack:** Jest 30 + React Testing Library 16 + jest-axe + @testing-library/user-event

**Test location:** `ComponentName.test.tsx` colocated with component, or `__tests__/ComponentName.test.tsx`

**Coverage:** 80% minimum threshold (all metrics), 90%+ target. Coverage excludes `*.d.ts`, `*.stories.tsx`, `*.figma.tsx`, `index.ts`, `Icon/**`.

**Test structure:**
```typescript
describe('ComponentName', () => {
  describe('Rendering', () => { /* ... */ });
  describe('User Interactions', () => { /* ... */ });
  describe('Keyboard Navigation', () => { /* ... */ });
  describe('Accessibility', () => { /* ... */ });
});
```

Prefer accessible queries: `getByRole`, `getByLabelText`. Test behavior, not implementation.

## Pre-flight Checklist

Before any PR, verify:
1. `nx run <project>:lint` — 0 errors/warnings
2. `nx run <project>:test --coverage` — 90%+ coverage
3. `nx run <project>:build` — builds successfully
4. jest-axe passes, keyboard navigation works
5. No hard-coded colors/spacing — use CSS custom properties (design tokens)

## CI/CD

GitHub Actions runs on push to `main`/`develop` and PRs targeting `main`/`develop`:
- Lint (all packages)
- Build @dsai-io/tools, then test with coverage (all packages)
- Build all packages
- Node.js 22, pnpm 10
