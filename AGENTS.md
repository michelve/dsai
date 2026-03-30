# DSAi Design System — Agent Guidelines

This file provides guidance to AI coding agents (GitHub Copilot, Cursor, Claude Code, etc.) working in this repository.

## Project Overview

DSAi is a production-ready React 19 component library (33 components, 23 hooks, 23 utility modules) built as an Nx monorepo. Key requirements: TypeScript strict mode, Bootstrap 5-compatible styling, WCAG 2.1 AA accessibility, 90%+ test coverage.

**Runtime requirements:** Node.js ≥ 22, pnpm ≥ 10.

## Common Commands

```bash
# Build
pnpm build                         # Build all packages
nx run @dsai-io/react:build         # Build single package

# Test
pnpm test                          # Run all tests (Jest 30)
pnpm test:coverage                 # With coverage report
jest --testPathPattern=Button       # Run tests matching a pattern

# Lint
pnpm lint                          # Lint all packages
nx run @dsai-io/react:lint          # Lint single package

# Affected only (preferred in CI and for large changes)
pnpm affected:build
pnpm affected:test

# Design Tokens
pnpm tokens:build                  # Build + validate tokens

# Add Components (via @dsai-io/tools CLI)
dsai add button modal tabs          # Add specific components
dsai add use-focus-trap cn          # Add hooks and utilities
dsai add --list                     # Browse all available items
dsai add --all --type hook          # Add all hooks
dsai add modal --dry-run            # Preview without writing files

# Figma
pnpm figma:connect                 # Set up Figma Code Connect
pnpm figma:publish:dry             # Dry-run publish
```

## Architecture

**Packages:**
- `packages/@dsai-io/react/` — Component library (33 components in `src/components/`, 23 hooks in `src/hooks/`, 23 utility modules in `src/utils/`)
- `packages/@dsai-io/tools/` — CLI tooling, token pipeline, build utilities (CLI: `dsai`)
- `packages/@dsai-io/figma-tokens/` — Figma Variables API integration
- `packages/@dsai-io/storybook/` — Storybook 10 documentation
- `packages/@dsai-io/docs/` — Documentation package
- `apps/playground/` — Development playground

**Build:** tsup (ESM + CJS + declarations). Each package has `tsconfig.build.json` that removes path mappings to avoid declaration errors.

**Path aliases** (tsconfig.base.json): `@dsai-io/react`, `@dsai-io/tools`, `@dsai-io/figma-tokens` map to their respective `packages/*/src`.

## Component Patterns

- **Compound components:** `Card.Header`, `Card.Body`, `Card.Title`
- **Ref pattern:** `memo(forwardRef(function ComponentName(...)))` — always set `displayName`
- **Props:** Defined in separate `*.types.ts` files
- **Class composition:** Use `cn()` utility (not CSS modules)
- **Controlled/uncontrolled:** Via `useControllableState` hook
- **Focus management:** `useFocusTrap` hook for modals

## Code Quality

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

**Coverage:** 80% minimum threshold (all metrics), 90%+ target.

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

Before any PR:
1. `nx run <project>:lint` — 0 errors/warnings
2. `nx run <project>:test --coverage` — 90%+ coverage
3. `nx run <project>:build` — builds successfully
4. jest-axe passes, keyboard navigation works
5. No hard-coded colors/spacing — use CSS custom properties (design tokens)

---

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->
