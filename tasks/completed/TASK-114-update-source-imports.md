# TASK-114: Update Source Code Imports

## Priority: Critical

## Status: ✅ Completed

## Completed Date: 2025-01-15

## Estimated Effort: 1.5 hours

## Dependencies: TASK-113 (Update Config Files)

## Parent Task: TASK-110

---

## Description

Update all source code imports that reference `@dsai/*` packages to use the new `@dsai-io/*` scope. This includes TypeScript/JavaScript imports in components, utilities, tests, stories, and application code.

---

## Scope Summary

| Category           | Estimated Files | Estimated Import Changes |
| ------------------ | --------------- | ------------------------ |
| React components   | 50+             | 150+                     |
| Utility functions  | 20+             | 40+                      |
| Test files         | 60+             | 120+                     |
| Storybook stories  | 40+             | 80+                      |
| Application code   | 20+             | 50+                      |
| Figma Code Connect | 10+             | 20+                      |
| **Total**          | **200+ files**  | **460+ changes**         |

---

## Files to Modify

### Package: @dsai-io/react

Source files in `packages/@dsai-io/react/src/`:

- All component files importing from `@dsai/tokens`
- All component files importing from `@dsai/tools`
- All test files (`.test.ts`, `.test.tsx`)
- All story files (`.stories.tsx`)

### Package: @dsai-io/tools

Source files in `packages/@dsai-io/tools/src/`:

- Any files importing from other @dsai packages
- All test files

### Package: @dsai-io/tokens

Source files in `packages/@dsai-io/tokens/src/`:

- Any files importing from other @dsai packages
- All test files

### Package: @dsai-io/figma-tokens

Source files in `packages/@dsai-io/figma-tokens/src/`:

- Files importing from `@dsai/tools`
- Files importing from `@dsai/tokens`
- Figma Code Connect files (`.figma.tsx`)

### Package: @dsai-io/storybook

Source files in `packages/@dsai-io/storybook/`:

- All story files importing from `@dsai/react`
- Configuration files importing @dsai packages
- `.storybook/` configuration files

### Package: @dsai-io/docs

Source files in `packages/@dsai-io/docs/`:

- Any documentation importing examples from @dsai packages

### Apps

Application files in `apps/`:

- `apps/playground/src/` - All imports from @dsai packages
- `apps/demo85/src/` - All imports from @dsai packages

---

## Import Patterns to Update

### Standard Named Import

```typescript
// Before
import { Button, Card } from '@dsai/react';

// After
import { Button, Card } from '@dsai-io/react';
```

### Default Import

```typescript
// Before
import tokens from '@dsai/tokens';

// After
import tokens from '@dsai-io/tokens';
```

### Deep Path Import

```typescript
// Before
import { validateToken } from '@dsai/tools/validators';

// After
import { validateToken } from '@dsai-io/tools/validators';
```

### Type Import

```typescript
// Before
import type { ButtonProps } from '@dsai/react';

// After
import type { ButtonProps } from '@dsai-io/react';
```

### Dynamic Import

```typescript
// Before
const module = await import('@dsai/react');

// After
const module = await import('@dsai-io/react');
```

### Re-export

```typescript
// Before
export * from '@dsai/react';
export { Button } from '@dsai/react';

// After
export * from '@dsai-io/react';
export { Button } from '@dsai-io/react';
```

---

## Implementation Steps

### Step 1: Find all files with @dsai imports

```bash
# List all files with @dsai imports
grep -rl "@dsai/" packages/@dsai-io apps --include="*.ts" --include="*.tsx" --include="*.js" --include="*.mjs" | wc -l

# Show actual files
grep -rl "@dsai/" packages/@dsai-io apps --include="*.ts" --include="*.tsx" --include="*.js" --include="*.mjs"
```

### Step 2: Use sed for batch replacement (macOS)

```bash
# Dry run - preview changes
grep -rl "@dsai/" packages/@dsai-io apps --include="*.ts" --include="*.tsx" --include="*.js" --include="*.mjs" | xargs grep "@dsai/" | head -20

# Execute replacement
find packages/@dsai-io apps -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.mjs" \) -exec sed -i '' 's/@dsai\//@dsai-io\//g' {} +
```

### Step 3: Verify no @dsai/ imports remain

```bash
grep -r "@dsai/" packages/@dsai-io apps --include="*.ts" --include="*.tsx" --include="*.js" --include="*.mjs" | grep -v "@dsai-io"
# Should return no results
```

### Step 4: Update CSS @import statements (if any)

```bash
grep -r "@dsai/" packages/@dsai-io apps --include="*.css" --include="*.scss"
# Update any found references
```

### Step 5: Verify TypeScript compilation

```bash
pnpm exec tsc --noEmit
```

### Step 6: Run tests to verify imports work

```bash
pnpm test
```

### Step 7: Commit changes

```bash
git add -A
git commit -m "chore: update all source imports to @dsai-io

- Updated ~460+ import statements across 200+ files
- Changed @dsai/react to @dsai-io/react
- Changed @dsai/tools to @dsai-io/tools
- Changed @dsai/tokens to @dsai-io/tokens
- Changed @dsai/figma-tokens to @dsai-io/figma-tokens
- Updated re-exports and type imports

Part of TASK-114 migration plan."
```

---

## Acceptance Criteria

- [x] All imports from `@dsai/*` changed to `@dsai-io/*`
- [x] All re-exports updated to new package names
- [x] All type imports updated to new package names
- [x] All dynamic imports updated to new package names
- [ ] TypeScript compilation passes (`tsc --noEmit`) - deferred to TASK-116
- [ ] All tests pass (`pnpm test`) - deferred to TASK-116
- [ ] ESLint passes (`pnpm lint`) - deferred to TASK-116
- [x] No references to `@dsai/` remain in source files

### Actual Results

- 223 files changed with 374 import replacements
- All @dsai/ references converted to @dsai-io/

---

## Verification Commands

```bash
# Check no old imports remain in TypeScript files
grep -r "from '@dsai/" packages/@dsai-io apps --include="*.ts" --include="*.tsx" | grep -v "@dsai-io"
# Expected: no output

# Check no old imports remain in JavaScript files
grep -r "from '@dsai/" packages/@dsai-io apps --include="*.js" --include="*.mjs" | grep -v "@dsai-io"
# Expected: no output

# Verify new imports exist
grep -r "from '@dsai-io/" packages/@dsai-io apps --include="*.ts" --include="*.tsx" | head -10

# Run TypeScript check
pnpm exec tsc --noEmit

# Run tests
pnpm test

# Run lint
pnpm lint
```

---

## Files by Package (Detailed)

### packages/@dsai-io/react/src/

Common patterns in this directory:

```typescript
// Components importing tokens
import { spacing, colors } from '@dsai/tokens';

// Components importing utilities
import { classNames } from '@dsai/tools';
```

### packages/@dsai-io/storybook/

Common patterns:

```typescript
// Stories importing components
import { Button, Card, Modal } from '@dsai/react';
```

### apps/playground/src/

Common patterns:

```typescript
// App importing design system
import { ThemeProvider, Button } from '@dsai/react';
import '@dsai/tokens/css/variables.css';
```

---

## Common Issues

### Issue: Import not found after update

**Cause**: Package not properly linked after rename.

**Solution**: Run `pnpm install` and `nx reset`.

### Issue: Circular import detected

**Cause**: Import order issue exposed by the change.

**Solution**: Restructure imports or add index barrel exports.

### Issue: ESLint import order errors

**Cause**: Import sorting rules may flag new package names.

**Solution**: Run `pnpm lint --fix` to auto-sort imports.

---

## Rollback Commands

```bash
# Revert all source file changes
git checkout HEAD -- packages/@dsai-io/*/src/
git checkout HEAD -- apps/*/src/
```

---

## Special Considerations

### Figma Code Connect Files

Files matching `*.figma.tsx` have special imports:

```typescript
// Before
import { Button } from '@dsai/react';
import figma from '@figma/code-connect';

// After
import { Button } from '@dsai-io/react';
import figma from '@figma/code-connect';
```

### Storybook Configuration

`.storybook/main.ts` may have special imports:

```typescript
// Before
import { StorybookConfig } from '@dsai/storybook';

// After
import { StorybookConfig } from '@dsai-io/storybook';
```

### Index Barrel Exports

`index.ts` files re-exporting from packages:

```typescript
// Before
export * from '@dsai/react';

// After
export * from '@dsai-io/react';
```

---

## Next Task

After completing this task, proceed to TASK-115 (Update Documentation)

---

## Task Created

- Date: 2026-01-14
- Created By: AI Assistant
- Reviewed By: Pending

---
