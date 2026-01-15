# TASK-112: Update package.json Files

## Priority: Critical

## Status: Not Started

## Estimated Effort: 45 minutes

## Dependencies: TASK-111 (Rename Package Folders)

## Parent Task: TASK-110

---

## Description

Update all `package.json` files to change package names from `@dsai/*` to `@dsai-io/*`, add `"private": true` to all packages, and update all internal workspace dependencies to use the new package names.

---

## Files to Modify

### Root package.json

| File           | Changes Required                     |
| -------------- | ------------------------------------ |
| `package.json` | Update workspace references, scripts |

### Package package.json Files (6 files)

| #   | File Path                                     | Changes                     |
| --- | --------------------------------------------- | --------------------------- |
| 1   | `packages/@dsai-io/react/package.json`        | name, private, dependencies |
| 2   | `packages/@dsai-io/tools/package.json`        | name, private, dependencies |
| 3   | `packages/@dsai-io/tokens/package.json`       | name, private, dependencies |
| 4   | `packages/@dsai-io/figma-tokens/package.json` | name, private, dependencies |
| 5   | `packages/@dsai-io/storybook/package.json`    | name, private, dependencies |
| 6   | `packages/@dsai-io/docs/package.json`         | name, private, dependencies |

---

## Changes Per File

### For Each Package package.json

#### 1. Update the `name` field

```json
// Before
"name": "@dsai/react"

// After
"name": "@dsai-io/react"
```

#### 2. Add `private` field (if not present) or set to true

```json
// Add this field at top level
"private": true
```

#### 3. Update dependencies referencing @dsai packages

```json
// Before
"dependencies": {
  "@dsai/tokens": "workspace:*",
  "@dsai/tools": "workspace:*"
}

// After
"dependencies": {
  "@dsai-io/tokens": "workspace:*",
  "@dsai-io/tools": "workspace:*"
}
```

#### 4. Update devDependencies referencing @dsai packages

```json
// Before
"devDependencies": {
  "@dsai/tools": "workspace:*"
}

// After
"devDependencies": {
  "@dsai-io/tools": "workspace:*"
}
```

#### 5. Update peerDependencies referencing @dsai packages

```json
// Before
"peerDependencies": {
  "@dsai/react": "workspace:*"
}

// After
"peerDependencies": {
  "@dsai-io/react": "workspace:*"
}
```

---

## Detailed Changes by Package

### packages/@dsai-io/react/package.json

- [ ] Change `"name": "@dsai/react"` to `"name": "@dsai-io/react"`
- [ ] Add `"private": true`
- [ ] Update dependency `@dsai/tokens` to `@dsai-io/tokens`
- [ ] Update dependency `@dsai/tools` to `@dsai-io/tools` (if present)

### packages/@dsai-io/tools/package.json

- [ ] Change `"name": "@dsai/tools"` to `"name": "@dsai-io/tools"`
- [ ] Add `"private": true`
- [ ] Update any @dsai dependencies to @dsai-io

### packages/@dsai-io/tokens/package.json

- [ ] Change `"name": "@dsai/tokens"` to `"name": "@dsai-io/tokens"`
- [ ] Add `"private": true`
- [ ] Update any @dsai dependencies to @dsai-io

### packages/@dsai-io/figma-tokens/package.json

- [ ] Change `"name": "@dsai/figma-tokens"` to `"name": "@dsai-io/figma-tokens"`
- [ ] Add `"private": true`
- [ ] Update dependency `@dsai/tools` to `@dsai-io/tools`
- [ ] Update dependency `@dsai/tokens` to `@dsai-io/tokens`

### packages/@dsai-io/storybook/package.json

- [ ] Change `"name": "@dsai/storybook"` to `"name": "@dsai-io/storybook"`
- [ ] Add `"private": true`
- [ ] Update dependency `@dsai/react` to `@dsai-io/react`
- [ ] Update dependency `@dsai/tokens` to `@dsai-io/tokens`

### packages/@dsai-io/docs/package.json

- [ ] Change `"name": "@dsai/docs"` to `"name": "@dsai-io/docs"`
- [ ] Add `"private": true`
- [ ] Update any @dsai dependencies to @dsai-io

---

## Implementation Steps

### Step 1: Update each package.json file

Use search and replace within each file:

- Find: `@dsai/`
- Replace with: `@dsai-io/`

Then ensure `"private": true` is present.

### Step 2: Update root package.json

Check if root package.json has any workspace scripts or references to @dsai packages.

### Step 3: Regenerate lockfile

```bash
# Remove old lockfile
rm pnpm-lock.yaml

# Reinstall dependencies
pnpm install
```

### Step 4: Clear Nx cache

```bash
nx reset
```

### Step 5: Verify installation

```bash
# Check pnpm recognizes all packages
pnpm list --recursive --depth 0

# Verify workspace links
pnpm why @dsai-io/react
```

### Step 6: Commit changes

```bash
git add -A
git commit -m "chore: update package.json files to @dsai-io scope

- Renamed all packages from @dsai/* to @dsai-io/*
- Added private: true to all packages
- Updated internal workspace dependencies
- Regenerated pnpm lockfile

Part of TASK-112 migration plan."
```

---

## Acceptance Criteria

- [ ] All 6 packages have `name` updated to `@dsai-io/*`
- [ ] All 6 packages have `"private": true`
- [ ] All internal dependencies use `@dsai-io/*`
- [ ] `pnpm install` completes successfully
- [ ] `pnpm list --recursive` shows correct package names
- [ ] No references to `@dsai/` in any package.json file

---

## Verification Commands

```bash
# Check all package names
cat packages/@dsai-io/*/package.json | jq -r '.name'

# Expected output:
# @dsai-io/docs
# @dsai-io/figma-tokens
# @dsai-io/react
# @dsai-io/storybook
# @dsai-io/tokens
# @dsai-io/tools

# Check private flag is set
cat packages/@dsai-io/*/package.json | jq -r '.private'
# Expected: all true

# Check no old references remain
grep -r '"@dsai/' packages/@dsai-io/*/package.json
# Expected: no output

# Check new references exist
grep -r '"@dsai-io/' packages/@dsai-io/*/package.json | head -10
```

---

## Common Issues

### Issue: pnpm install fails with "workspace package not found"

**Cause**: A package references another package that hasn't been renamed yet.

**Solution**: Ensure ALL package.json files are updated before running pnpm install.

### Issue: Circular dependency error

**Cause**: Package dependencies are misconfigured.

**Solution**: Check dependency graph with `pnpm why <package>`.

---

## Rollback Commands

```bash
# Restore from git
git checkout HEAD -- packages/@dsai-io/*/package.json
git checkout HEAD -- package.json
git checkout HEAD -- pnpm-lock.yaml
pnpm install
```

---

## Next Task

After completing this task, proceed to TASK-113 (Update Config Files)

---

## Task Created

- Date: 2026-01-14
- Created By: AI Assistant
- Reviewed By: Pending

---
