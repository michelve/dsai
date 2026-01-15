# TASK-110: Migrate @dsai/_ to @dsai-io/_ - Master Plan

## Priority: Critical

## Status: Not Started

## Estimated Effort: 4-6 hours

## Dependencies: None (blocking all sub-tasks)

---

## Description

Migrate all npm package scopes from `@dsai/*` to `@dsai-io/*` across the entire monorepo. The `@dsai` npm organization is unavailable, so we've created `@dsai-io` as our official npm org. All packages should be marked as **private** (not published to npm).

This is a **master task** that coordinates 6 sub-tasks for a safe, incremental migration.

---

## Scope Overview

| Category           | Files Affected  | Estimated Changes       |
| ------------------ | --------------- | ----------------------- |
| Package folders    | 6 directories   | 6 folder renames        |
| package.json files | 7 files         | ~15 changes each        |
| Config files       | 15+ files       | ~50 changes             |
| Source imports     | 100+ files      | ~500+ import statements |
| Storybook stories  | 40+ files       | ~80 imports             |
| Documentation      | 150+ files      | ~200 references         |
| Tools/Scripts      | 15+ files       | ~40 references          |
| Figma configs      | 3 files         | ~10 references          |
| **Total**          | **~350+ files** | **~1000+ changes**      |

---

## Sub-Tasks

| Task ID  | Title                     | Status      | Depends On |
| -------- | ------------------------- | ----------- | ---------- |
| TASK-111 | Rename package folders    | Not Started | TASK-110   |
| TASK-112 | Update package.json files | Not Started | TASK-111   |
| TASK-113 | Update config files       | Not Started | TASK-112   |
| TASK-114 | Update source imports     | Not Started | TASK-113   |
| TASK-115 | Update documentation      | Not Started | TASK-114   |
| TASK-116 | Verify and test migration | Not Started | TASK-115   |

---

## Pre-Migration Checklist

- [ ] Ensure all work is committed to version control
- [ ] Create a dedicated migration branch: `git checkout -b feature/migrate-dsai-io`
- [ ] Verify npm org `@dsai-io` is accessible: `npm whoami --registry https://registry.npmjs.org/`
- [ ] Backup current state: `git stash` any uncommitted work
- [ ] Document current working state: `pnpm build && pnpm test`

---

## Migration Order (Critical)

The migration MUST be executed in this exact order:

1. **TASK-111**: Rename folders first (preserves git history)
2. **TASK-112**: Update package.json (defines the new package names)
3. **TASK-113**: Update config files (nx, tsconfig, jest, etc.)
4. **TASK-114**: Update source imports (actual code references)
5. **TASK-115**: Update documentation (README, guides, etc.)
6. **TASK-116**: Verify everything works

---

## Risk Mitigation

### Git History Preservation

- Use `git mv` for folder renames to preserve history
- Commit after each sub-task
- Use descriptive commit messages

### Rollback Strategy

```bash
# If migration fails, reset to pre-migration state:
git checkout main
git branch -D feature/migrate-dsai-io
git checkout -b feature/migrate-dsai-io
```

### Validation Checkpoints

After each sub-task:

1. Run `pnpm install` to validate dependencies
2. Run `nx reset` to clear Nx cache
3. Run `pnpm build` to verify compilation
4. Run `pnpm test` to verify tests pass

---

## Key Mappings

### Package Names

| Old Package          | New Package             |
| -------------------- | ----------------------- |
| `@dsai/react`        | `@dsai-io/react`        |
| `@dsai/tools`        | `@dsai-io/tools`        |
| `@dsai/tokens`       | `@dsai-io/tokens`       |
| `@dsai/figma-tokens` | `@dsai-io/figma-tokens` |
| `@dsai/storybook`    | `@dsai-io/storybook`    |
| `@dsai/docs`         | `@dsai-io/docs`         |

### Folder Paths

| Old Path                      | New Path                         |
| ----------------------------- | -------------------------------- |
| `packages/@dsai/react`        | `packages/@dsai-io/react`        |
| `packages/@dsai/tools`        | `packages/@dsai-io/tools`        |
| `packages/@dsai/tokens`       | `packages/@dsai-io/tokens`       |
| `packages/@dsai/figma-tokens` | `packages/@dsai-io/figma-tokens` |
| `packages/@dsai/storybook`    | `packages/@dsai-io/storybook`    |
| `packages/@dsai/docs`         | `packages/@dsai-io/docs`         |

---

## Acceptance Criteria

- [ ] All packages renamed from `@dsai/*` to `@dsai-io/*`
- [ ] All package.json files have `"private": true`
- [ ] All imports updated to use new package names
- [ ] All config files reference new paths
- [ ] All documentation updated with new names
- [ ] `pnpm install` completes without errors
- [ ] `pnpm build` completes without errors
- [ ] `pnpm test` passes all tests
- [ ] `pnpm lint` passes without errors
- [ ] Storybook builds and runs correctly
- [ ] No references to `@dsai/` remain (verified by grep)
- [ ] Git history preserved for all moved files

---

## Verification Commands

```bash
# Check for any remaining @dsai/ references (should return empty)
grep -r "@dsai/" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.md" --include="*.mjs" --include="*.cjs" . | grep -v "@dsai-io" | grep -v node_modules | grep -v ".git"

# Verify package names
cat packages/@dsai-io/*/package.json | jq '.name'

# Verify private flag
cat packages/@dsai-io/*/package.json | jq '.private'

# Full build test
pnpm install && nx reset && pnpm build && pnpm test && pnpm lint
```

---

## Files to Modify

See individual sub-tasks for detailed file lists:

- TASK-111: Folder structure
- TASK-112: package.json files
- TASK-113: Config files
- TASK-114: Source files
- TASK-115: Documentation files

---

## Implementation Notes

- This migration changes package SCOPE only, not package functionality
- CSS variable prefix `--dsai-*` remains unchanged
- Figma token names remain unchanged
- Internal component names remain unchanged
- Only npm package identifiers change

---

## Post-Migration Steps

1. Update any CI/CD configurations if they reference old paths
2. Update any external documentation or wikis
3. Notify team members of the new package names
4. Consider adding npm package aliases for transition period
5. Update GitHub repository description if needed

---

## Related Documentation

- [npm Scopes Documentation](https://docs.npmjs.com/about-scopes)
- [Nx Workspace Migration](https://nx.dev/recipes/tips-n-tricks/moving-projects)
- [pnpm Workspace Protocol](https://pnpm.io/workspaces)

---

## Task Created

- Date: 2026-01-14
- Created By: AI Assistant
- Reviewed By: Pending

---
