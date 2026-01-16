# TASK-111: Rename Package Folders from @dsai to @dsai-io

## Priority: Critical

## Status: ✅ Completed

## Completed Date: 2026-01-15

## Estimated Effort: 30 minutes

## Dependencies: TASK-110 (Master Plan)

## Parent Task: TASK-110

---

## Description

Rename all package folders from `packages/@dsai-io/*` to `packages/@dsai-io/*` using `git mv` to preserve git history. This is the first step of the migration and must be completed before any other changes.

---

## Why This Matters

- Using `git mv` instead of regular `mv` preserves file history in git
- The folder structure must match the npm scope exactly
- This change must happen FIRST before updating any configuration files

---

## Pre-Requisites

- [x] Create migration branch: `git checkout -b feature/migrate-dsai-io`
- [x] Ensure working directory is clean: `git status` shows no uncommitted changes
- [x] Verify current folder structure exists

---

## Files to Modify

### Folders to Rename

| Current Path      | New Path             |
| ----------------- | -------------------- |
| `packages/@dsai-io/` | `packages/@dsai-io/` |

### Specific Folders (5 total - tokens package doesn't exist)

| #   | Current Folder                | New Folder                       | Status  |
| --- | ----------------------------- | -------------------------------- | ------- |
| 1   | `packages/@dsai-io/react`        | `packages/@dsai-io/react`        | ✅ Done |
| 2   | `packages/@dsai-io/tools`        | `packages/@dsai-io/tools`        | ✅ Done |
| 3   | `packages/@dsai-io/figma-tokens` | `packages/@dsai-io/figma-tokens` | ✅ Done |
| 4   | `packages/@dsai-io/storybook`    | `packages/@dsai-io/storybook`    | ✅ Done |
| 5   | `packages/@dsai-io/docs`         | `packages/@dsai-io/docs`         | ✅ Done |

> Note: The `@dsai-io/tokens` package listed in the original plan does not exist in the repository.

---

## Implementation Steps

### Step 1: Create the new parent directory

```bash
mkdir -p packages/@dsai-io
```

### Step 2: Move each package folder using git mv

```bash
# Move react package
git mv packages/@dsai-io/react packages/@dsai-io/react

# Move tools package
git mv packages/@dsai-io/tools packages/@dsai-io/tools

# Move tokens package
git mv packages/@dsai-io/tokens packages/@dsai-io/tokens

# Move figma-tokens package
git mv packages/@dsai-io/figma-tokens packages/@dsai-io/figma-tokens

# Move storybook package
git mv packages/@dsai-io/storybook packages/@dsai-io/storybook

# Move docs package
git mv packages/@dsai-io/docs packages/@dsai-io/docs
```

### Step 3: Remove the old empty directory

```bash
rmdir packages/@dsai
```

### Step 4: Verify the move

```bash
# List new structure
ls -la packages/@dsai-io/

# Check git status
git status

# Verify git tracked the moves correctly
git diff --cached --name-status | head -20
```

### Step 5: Commit the changes

```bash
git add -A
git commit -m "chore: rename packages/@dsai to packages/@dsai-io

BREAKING CHANGE: Package folder structure changed for npm scope migration.
Part of TASK-111 migration plan."
```

---

## Acceptance Criteria

- [x] All 5 package folders moved to `packages/@dsai-io/`
- [x] Old `packages/@dsai-io/` directory no longer exists
- [x] Git history preserved for all files (verify with `git log --follow <file>`)
- [x] `git status` shows renames, not deletions + additions
- [x] Changes committed with descriptive message

---

## Verification Commands

```bash
# Verify new folders exist
ls packages/@dsai-io/
# Expected: docs  figma-tokens  react  storybook  tokens  tools

# Verify old folder gone
ls packages/@dsai-io/ 2>&1
# Expected: No such file or directory

# Verify git history preserved (example for one file)
git log --follow --oneline packages/@dsai-io/react/package.json | head -5

# Check for any broken symlinks
find packages/@dsai-io -type l -xtype l
```

---

## Rollback Commands

If something goes wrong:

```bash
# Reset to previous state (before commit)
git reset --hard HEAD

# Or if already committed, revert
git revert HEAD
```

---

## Next Task

After completing this task, proceed to TASK-112 (Update package.json files)

---

## Notes

- Do NOT run `pnpm install` until TASK-112 is complete (package.json files need updating first)
- Do NOT run `nx build` until TASK-113 is complete (config files need updating)
- Temporary build failures are expected until all config updates are done

---

## Task Created

- Date: 2026-01-14
- Created By: AI Assistant
- Reviewed By: Pending

---
