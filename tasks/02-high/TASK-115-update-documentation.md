# TASK-115: Update Documentation

## Priority: Critical

## Status: Not Started

## Estimated Effort: 1 hour

## Dependencies: TASK-114 (Update Source Imports)

## Parent Task: TASK-110

---

## Description

Update all documentation files that reference `@dsai/*` packages to use the new `@dsai-io/*` scope. This includes README files, markdown documentation, code examples, and any user-facing guides.

---

## Scope Summary

| Category              | Estimated Files | Estimated Changes |
| --------------------- | --------------- | ----------------- |
| README files          | 10+             | 30+ references    |
| Markdown docs         | 100+            | 150+ references   |
| Code examples in docs | 50+             | 100+ code blocks  |
| Task files            | 20+             | 30+ references    |
| Build/CI docs         | 5+              | 10+ references    |
| **Total**             | **185+ files**  | **320+ changes**  |

---

## Files to Modify

### Root Documentation

| #   | File Path    | Changes                              |
| --- | ------------ | ------------------------------------ |
| 1   | `README.md`  | Package references, install commands |
| 2   | `BUILD.md`   | Build commands, package references   |
| 3   | `TESTING.md` | Test commands, package references    |
| 4   | `CI-CD.md`   | CI configuration references          |
| 5   | `AGENTS.md`  | AI agent instructions                |

### Package Documentation

| #   | Directory                         | Files                       |
| --- | --------------------------------- | --------------------------- |
| 1   | `packages/@dsai-io/react/`        | README.md, guidelines/\*.md |
| 2   | `packages/@dsai-io/tools/`        | README.md                   |
| 3   | `packages/@dsai-io/tokens/`       | README.md                   |
| 4   | `packages/@dsai-io/figma-tokens/` | README.md                   |
| 5   | `packages/@dsai-io/storybook/`    | README.md                   |
| 6   | `packages/@dsai-io/docs/`         | README.md, all docs         |

### Guidelines Documentation

Files in `packages/@dsai-io/react/guidelines/`:

- `Guidelines.md`
- `design-tokens/*.md`
- Component documentation files

### Task Documentation

Files in `tasks/`:

- Task files referencing @dsai packages
- Template files

### Tools Documentation

Files in `tools/`:

- README.md
- Script documentation

---

## Documentation Patterns to Update

### Package Installation Commands

```markdown
<!-- Before -->

npm install @dsai/react
pnpm add @dsai/react
yarn add @dsai/react

<!-- After -->

npm install @dsai-io/react
pnpm add @dsai-io/react
yarn add @dsai-io/react
```

### Import Examples in Markdown

```markdown
<!-- Before -->

\`\`\`typescript
import { Button } from '@dsai/react';
\`\`\`

<!-- After -->

\`\`\`typescript
import { Button } from '@dsai-io/react';
\`\`\`
```

### Package References in Prose

```markdown
<!-- Before -->

The `@dsai/react` package provides React components.

<!-- After -->

The `@dsai-io/react` package provides React components.
```

### Nx Commands

```markdown
<!-- Before -->

nx build @dsai/react
nx test @dsai/tools

<!-- After -->

nx build @dsai-io/react
nx test @dsai-io/tools
```

### pnpm Filter Commands

```markdown
<!-- Before -->

pnpm --filter @dsai/react build
pnpm --filter @dsai/\* test

<!-- After -->

pnpm --filter @dsai-io/react build
pnpm --filter @dsai-io/\* test
```

---

## Implementation Steps

### Step 1: Find all documentation files with @dsai references

```bash
# Count files
grep -rl "@dsai" . --include="*.md" | grep -v node_modules | grep -v ".git" | wc -l

# List files
grep -rl "@dsai" . --include="*.md" | grep -v node_modules | grep -v ".git"
```

### Step 2: Batch update markdown files

```bash
# Using sed (macOS)
find . -type f -name "*.md" ! -path "./node_modules/*" ! -path "./.git/*" -exec sed -i '' 's/@dsai\//@dsai-io\//g' {} +
```

### Step 3: Manual review of key files

Review these files manually for context:

- `README.md` (root)
- `packages/@dsai-io/react/README.md`
- `packages/@dsai-io/react/guidelines/Guidelines.md`

### Step 4: Update code examples formatting

Ensure code examples in markdown still render correctly after changes.

### Step 5: Update any badges or shields

If README has npm badges, update package names:

```markdown
<!-- Before -->

[![npm](https://img.shields.io/npm/v/@dsai/react)](...)

<!-- After -->

[![npm](https://img.shields.io/npm/v/@dsai-io/react)](...)
```

### Step 6: Verify no broken internal links

Check that any relative links to package folders still work.

### Step 7: Commit changes

```bash
git add -A
git commit -m "docs: update documentation to @dsai-io package names

- Updated all README files with new package names
- Updated installation commands
- Updated import examples in documentation
- Updated nx/pnpm commands
- Updated code examples

Part of TASK-115 migration plan."
```

---

## Acceptance Criteria

- [ ] All README.md files use `@dsai-io/*` package names
- [ ] All markdown code examples use new imports
- [ ] All installation commands use new package names
- [ ] All nx/pnpm commands use new package names
- [ ] No references to `@dsai/` remain in documentation
- [ ] All internal documentation links still work
- [ ] Code examples in docs are syntactically correct

---

## Verification Commands

```bash
# Check no old references in markdown files
grep -r "@dsai/" . --include="*.md" | grep -v "@dsai-io" | grep -v node_modules | grep -v ".git"
# Expected: no output

# Verify new references exist
grep -r "@dsai-io/" . --include="*.md" | grep -v node_modules | head -10

# Check specific important files
grep "@dsai" README.md | grep -v "@dsai-io"
# Expected: no output

# Verify README has correct install commands
grep "install @dsai-io" README.md
```

---

## Key Files Checklist

### Root Files

- [ ] `README.md` - Main project readme
- [ ] `BUILD.md` - Build instructions
- [ ] `TESTING.md` - Testing guide
- [ ] `CI-CD.md` - CI/CD documentation
- [ ] `AGENTS.md` - AI agent instructions

### Package READMEs

- [ ] `packages/@dsai-io/react/README.md`
- [ ] `packages/@dsai-io/tools/README.md`
- [ ] `packages/@dsai-io/tokens/README.md`
- [ ] `packages/@dsai-io/figma-tokens/README.md`
- [ ] `packages/@dsai-io/storybook/README.md`
- [ ] `packages/@dsai-io/docs/README.md`

### Guidelines

- [ ] `packages/@dsai-io/react/guidelines/Guidelines.md`
- [ ] `packages/@dsai-io/react/guidelines/design-tokens/*.md`

### Task Files

- [ ] `tasks/README.md`
- [ ] `tasks/task-templates/*.md`
- [ ] `tasks/02-high/*.md`
- [ ] `tasks/03-medium/*.md`
- [ ] `tasks/04-low/*.md`

---

## Common Issues

### Issue: Markdown code block rendering broken

**Cause**: Accidental modification of code fence markers.

**Solution**: Review changed files for proper markdown syntax.

### Issue: Relative links broken

**Cause**: Links to old package folders.

**Solution**: Update relative paths from `@dsai/` to `@dsai-io/`.

### Issue: npm badge showing wrong package

**Cause**: Badge URL still references old package.

**Solution**: Update the package name in the badge URL.

---

## Rollback Commands

```bash
# Restore all markdown files
git checkout HEAD -- "*.md"
git checkout HEAD -- packages/@dsai-io/*/*.md
git checkout HEAD -- packages/@dsai-io/*/guidelines/*.md
```

---

## Special Considerations

### GitHub Links

If documentation contains GitHub links to files in the old path:

```markdown
<!-- Before -->

[Source](https://github.com/michelve/dsai/tree/main/packages/@dsai/react)

<!-- After -->

[Source](https://github.com/michelve/dsai/tree/main/packages/@dsai-io/react)
```

### npm Links

Update any links to npmjs.com:

```markdown
<!-- Before -->

[npm](https://www.npmjs.com/package/@dsai/react)

<!-- After -->

[npm](https://www.npmjs.com/package/@dsai-io/react)
```

Note: Since packages are private, npm links may not be applicable.

---

## Next Task

After completing this task, proceed to TASK-116 (Verify and Test Migration)

---

## Task Created

- Date: 2026-01-14
- Created By: AI Assistant
- Reviewed By: Pending

---
