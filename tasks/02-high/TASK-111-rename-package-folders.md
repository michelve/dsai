# TASK-111: Rename Package Folders from @dsai to @dsai-io

## Priority: Critical

## Status: Not Started

## Estimated Effort: 30 minutes

## Dependencies: TASK-110 (Master Plan)

## Parent Task: TASK-110

---

## Description

Rename all package folders from `packages/@dsai/*` to `packages/@dsai-io/*` using `git mv` to preserve git history. This is the first step of the migration and must be completed before any other changes.

---

## Why This Matters

- Using `git mv` instead of regular `mv` preserves file history in git
- The folder structure must match the npm scope exactly
- This change must happen FIRST before updating any configuration files

---

## Pre-Requisites

- [ ] Create migration branch: `git checkout -b feature/migrate-dsai-io`
- [ ] Ensure working directory is clean: `git status` shows no uncommitted changes
- [ ] Verify current folder structure exists

---

## Files to Modify

### Folders to Rename

| Current Path      | New Path             |
| ----------------- | -------------------- |
| `packages/@dsai/` | `packages/@dsai-io/` |

### Specific Folders (6 total)

| #   | Current Folder                | New Folder                       |
| --- | ----------------------------- | -------------------------------- |
| 1   | `packages/@dsai/react`        | `packages/@dsai-io/react`        |
| 2   | `packages/@dsai/tools`        | `packages/@dsai-io/tools`        |
| 3   | `packages/@dsai/tokens`       | `packages/@dsai-io/tokens`       |
| 4   | `packages/@dsai/figma-tokens` | `packages/@dsai-io/figma-tokens` |
| 5   | `packages/@dsai/storybook`    | `packages/@dsai-io/storybook`    |
| 6   | `packages/@dsai/docs`         | `packages/@dsai-io/docs`         |

---

## Implementation Steps

### Step 1: Create the new parent directory

```bash
mkdir -p packages/@dsai-io
```

### Step 2: Move each package folder using git mv

```bash
# Move react package
git mv packages/@dsai/react packages/@dsai-io/react

# Move tools package
git mv packages/@dsai/tools packages/@dsai-io/tools

# Move tokens package
git mv packages/@dsai/tokens packages/@dsai-io/tokens

# Move figma-tokens package
git mv packages/@dsai/figma-tokens packages/@dsai-io/figma-tokens

# Move storybook package
git mv packages/@dsai/storybook packages/@dsai-io/storybook

# Move docs package
git mv packages/@dsai/docs packages/@dsai-io/docs
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

- [ ] All 6 package folders moved to `packages/@dsai-io/`
- [ ] Old `packages/@dsai/` directory no longer exists
- [ ] Git history preserved for all files (verify with `git log --follow <file>`)
- [ ] `git status` shows renames, not deletions + additions
- [ ] Changes committed with descriptive message

---

## Verification Commands

```bash
# Verify new folders exist
ls packages/@dsai-io/
# Expected: docs  figma-tokens  react  storybook  tokens  tools

# Verify old folder gone
ls packages/@dsai/ 2>&1
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
