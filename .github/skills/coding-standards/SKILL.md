---
name: coding-standards
description: Enforces enterprise-level coding standards for the DSAi Nx monorepo including security patterns (Object Injection prevention, prototype pollution, ReDoS), TypeScript strict mode, React component patterns, WCAG 2.1 AA accessibility, and 90%+ test coverage. Use when starting any coding task, writing new components, refactoring code, reviewing PRs, or ensuring code quality compliance.
license: Complete terms in LICENSE.txt
metadata:
  author: dsai
  version: '2.0'
  updated: '2026-01-20'
---

# DSAi Coding Standards

Enterprise-level guardrails for secure, robust, and production-ready code.

## When to Use

- **ALWAYS** before any coding, refactoring, or review task
- Before writing components, utilities, or token pipeline changes
- When ensuring outputs follow security, accessibility, and testing standards
- As a pre-flight checklist before merging

---

## 🔐 Security Standards (CRITICAL)

### Safe Dynamic Property Access

- **NEVER** use bracket notation with dynamic keys (`obj[key]`) - causes Object Injection Sink vulnerability
- Use `Reflect.get(obj, key)` for safe dynamic property reads
- Use `Object.defineProperty(obj, key, { value, writable: true, enumerable: true, configurable: true })` for safe writes
- Use `Map` with `.get()/.set()` for dynamic key-value storage
- Use `.at(index)` for safe array access instead of `array[index]`
- Use `for...of` loops instead of indexed `for` loops with dynamic access

### Prototype Pollution Prevention

- Always validate keys before property operations
- Block forbidden keys: `__proto__`, `constructor`, `prototype`
- Create a `isSafeKey()` guard function for all dynamic key operations
- Avoid modifying object prototypes directly, especially within loops. Use safer alternatives such as freezing the object prototype, creating objects without prototypes using Object.create(null), blocking modifications to prototype attributes, or using Map objects instead of plain objects.

### Regex Safety (ReDoS Prevention)

- Avoid nested quantifiers and alternation that can cause exponential backtracking
- Break complex patterns into multiple simple steps
- Split strings first, then apply simple regex to each part
- Prefer character classes over alternation when possible

### Input Validation

- Use type guards for runtime validation of unknown data
- Sanitize file paths (remove `..`, invalid characters, normalize unicode)
- Validate against allowlists, never blocklists
- Use `unknown` type for untrusted input, validate before casting

### Environment Variables

- Access env vars safely with `Reflect.get(process.env, 'VAR_NAME')`
- Never log secrets or sensitive configuration
- Validate required vars exist in production environments

### Dependency Security

- Run `pnpm nx lint <project>` after dependency changes
- Run `pnpm audit` before adding new packages
- Trivy scans run automatically via Codacy

See [examples/security-patterns.ts](./examples/security-patterns.ts) for code examples.

---

## 📁 Repository Structure

- **Monorepo**: Nx-managed, always use Nx targets over raw CLI commands
- **Runtime**: Node.js ≥ 22, pnpm ≥ 10
- **Packages**: `packages/@dsai-io/*` for libraries, `apps/*` for applications
- **Core packages**: `@dsai-io/react` (components), `@dsai-io/tools` (CLI), `@dsai-io/figma-tokens` (sync)

---

## 🔧 Workflow Commands

- `pnpm nx lint <project>` - Lint with Biome/ESLint
- `pnpm nx test <project>` - Run tests
- `pnpm nx test <project> --coverage` - Tests with coverage
- `pnpm nx build <project>` - Build package
- `pnpm nx run-many --target=test` - Run across all projects
- `pnpm nx affected --target=lint` - Run on changed projects only
- `pnpm nx graph` - Visualize dependencies

---

## 📝 TypeScript Standards

### Strict Mode Requirements

- Never use `any` - always provide explicit types
- Add explicit return types for all public exports
- Use `const` over `let`, never use `var`
- Enable all strict mode checks

### Type Definitions

- Use `interface` for objects (extensible via declaration merging)
- Use `type` for unions, intersections, and mapped types
- Use type-only imports: `import type { X } from './types'`

### Null Safety

- Use nullish coalescing (`??`) and optional chaining (`?.`)
- Use `.at()` for array access (returns `undefined` for out-of-bounds)
- Create assertion functions for critical runtime checks
- Prefer explicit null checks over truthy checks for boolean values

---

## ⚛️ React Standards

### Component Pattern

- Use `memo(forwardRef(function ComponentName(...)))` pattern
- Always set `displayName` on components
- Use `cn()` utility for class composition
- Keep props in separate `*.types.ts` files
- Avoid `React.FC` - use explicit function declarations

### Hooks Rules

- Use `useId()` for generating unique IDs (never manual ID strings)
- Memoize expensive computations with `useMemo`
- Stabilize callbacks with `useCallback`
- Extract reusable logic into custom hooks

### Props Pattern

- Reuse shared types: `SafeHTMLAttributes`, `ComponentSize`, `SemanticColorVariant`
- Make variant and size props optional with sensible defaults
- Spread remaining props to root element for flexibility

See [examples/react-patterns.tsx](./examples/react-patterns.tsx) for code examples.

---

## ♿ Accessibility (WCAG 2.1 AA)

### Required Standards

- **Keyboard navigation**: Tab, Enter/Space, Escape, Arrow keys
- **Focus management**: Visible indicators (3:1 contrast), trap/restore for modals
- **ARIA**: Proper roles, labels, live regions for dynamic content
- **Color contrast**: 4.5:1 for normal text, 3:1 for large text and UI components

### Implementation Rules

- Use semantic HTML elements first, add ARIA only when necessary
- Never add redundant `role` if it's implicit (button has implicit `role="button"`)
- Provide `aria-label` for icon-only interactive elements
- Use `aria-pressed` for toggle buttons, `aria-expanded` for expandables
- Support both mouse and keyboard for all interactions

---

## 🧪 Testing Standards

### Coverage Requirements

- **Minimum**: 80% (statements, branches, functions, lines)
- **Target**: 90%+ on all touched modules
- Co-locate tests: `ComponentName.test.tsx` next to component

### Test Structure

- Group tests: `rendering`, `props`, `interactions`, `accessibility`, `edge cases`
- Test behavior, not implementation details
- Use Testing Library queries: prefer `getByRole`, `getByText` over `getByTestId`
- Use `userEvent.setup()` for user interactions

### Required Test Types

- Render tests (component mounts without crashing)
- Prop tests (variants, sizes, disabled states)
- Interaction tests (clicks, keyboard, focus)
- Accessibility tests (jest-axe, ARIA attributes)
- Edge case tests (empty content, undefined props)

See [examples/testing-patterns.test.tsx](./examples/testing-patterns.test.tsx) for code examples.

---

## ⚠️ Error Handling

- Use typed error interfaces with `code`, `message`, `details`
- Distinguish network errors from HTTP errors
- Wrap async operations in try/catch with specific error handling
- Use React Error Boundaries around feature components

---

## 🎨 Design Tokens & CSS

- **Never** hard-code color, spacing, or shadow values
- Use token-driven CSS variables: `var(--dsai-color-primary-500)`
- Bootstrap 5 utility classes first, custom CSS only when necessary
- No CSS modules - use `cn()` for conditional class composition
- Extend via `dsai-theme-bs.css` token overrides

---

## 📦 Build & Packaging

- Named exports only (tree-shakeable), no default exports
- No wildcard re-exports (`export * from`)
- Mark packages `sideEffects: false` in package.json
- Use tsup via Nx targets for builds
- Export via `index.ts` barrels

---

## ✅ Pre-flight Checklist

Before any PR/merge:

- [ ] **Lint**: `pnpm nx lint <project>` - 0 errors, 0 warnings
- [ ] **Types**: `pnpm nx typecheck <project>` - No type errors
- [ ] **Tests**: `pnpm nx test <project> --coverage` - 90%+ coverage
- [ ] **Build**: `pnpm nx build <project>` - Successful
- [ ] **Security**: No ESLint security warnings
- [ ] **A11y**: Components pass jest-axe, keyboard accessible
- [ ] **Codacy**: Run `codacy_cli_analyze` on modified files

---

## 📚 References

- **Agent guidelines**: `AGENTS.md`
- **Testing patterns**: `.github/skills/testing-patterns`
- **Component development**: `.github/skills/component-development`
- **Accessibility**: `.github/skills/accessibility`
- **Design tokens**: `.github/skills/design-tokens`
- **Codacy integration**: `.github/instructions/codacy.instructions.md`
- **Code examples**: `./examples/`
