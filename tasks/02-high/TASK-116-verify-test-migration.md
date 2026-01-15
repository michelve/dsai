# TASK-116: Verify and Test Migration

## Priority: Critical

## Status: Not Started

## Estimated Effort: 1 hour

## Dependencies: TASK-115 (Update Documentation)

## Parent Task: TASK-110

---

## Description

Final verification and testing of the complete `@dsai` to `@dsai-io` migration. This task ensures all changes work correctly together, no old references remain, and the entire build/test/lint pipeline passes.

---

## Pre-Verification Checklist

Before starting verification, confirm all previous tasks are complete:

- [ ] TASK-111: Package folders renamed
- [ ] TASK-112: package.json files updated
- [ ] TASK-113: Config files updated
- [ ] TASK-114: Source imports updated
- [ ] TASK-115: Documentation updated

---

## Verification Steps

### Step 1: Clean Environment Setup

```bash
# Clean all caches and temporary files
rm -rf node_modules
rm -rf .nx
rm -rf dist
rm -rf coverage
rm pnpm-lock.yaml

# Fresh install
pnpm install

# Reset Nx
nx reset
```

### Step 2: Verify No Old References Remain

```bash
# Search for ANY remaining @dsai-io/ references (excluding @dsai-io)
echo "=== Checking TypeScript/JavaScript files ==="
grep -r "@dsai-io/" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.mjs" --include="*.cjs" | grep -v "@dsai-io" | grep -v node_modules | grep -v ".git"

echo "=== Checking JSON files ==="
grep -r "@dsai-io/" . --include="*.json" | grep -v "@dsai-io" | grep -v node_modules | grep -v ".git"

echo "=== Checking YAML files ==="
grep -r "@dsai-io/" . --include="*.yaml" --include="*.yml" | grep -v "@dsai-io" | grep -v node_modules | grep -v ".git"

echo "=== Checking Markdown files ==="
grep -r "@dsai-io/" . --include="*.md" | grep -v "@dsai-io" | grep -v node_modules | grep -v ".git"

echo "=== Checking all other files ==="
grep -r "@dsai-io/" . --include="*" | grep -v "@dsai-io" | grep -v node_modules | grep -v ".git" | grep -v ".pnpm"
```

Expected output for all: **No matches found**

### Step 3: Verify Package Structure

```bash
# List all packages
echo "=== Package folders ==="
ls -la packages/@dsai-io/

# Verify old folder doesn't exist
echo "=== Verify old folder removed ==="
ls packages/@dsai-io/ 2>&1 && echo "ERROR: Old folder still exists!" || echo "OK: Old folder removed"

# Show package names from package.json
echo "=== Package names ==="
for pkg in packages/@dsai-io/*/; do
  echo "$(basename $pkg): $(jq -r '.name' $pkg/package.json)"
done

# Show private flag
echo "=== Private flags ==="
for pkg in packages/@dsai-io/*/; do
  echo "$(basename $pkg): private=$(jq -r '.private' $pkg/package.json)"
done
```

### Step 4: Verify Nx Configuration

```bash
# Show all Nx projects
echo "=== Nx Projects ==="
nx show projects

# Verify project details for each package
echo "=== @dsai-io/react project ==="
nx show project @dsai-io/react --json | jq '.name, .sourceRoot'

echo "=== @dsai-io/tools project ==="
nx show project @dsai-io/tools --json | jq '.name, .sourceRoot'

echo "=== @dsai-io/tokens project ==="
nx show project @dsai-io/tokens --json | jq '.name, .sourceRoot'
```

### Step 5: Build All Packages

```bash
# Build all packages
echo "=== Building all packages ==="
pnpm build

# Verify build artifacts exist
echo "=== Checking build artifacts ==="
ls -la packages/@dsai-io/react/dist/ 2>/dev/null || echo "No dist for react"
ls -la packages/@dsai-io/tools/dist/ 2>/dev/null || echo "No dist for tools"
ls -la packages/@dsai-io/tokens/dist/ 2>/dev/null || echo "No dist for tokens"
```

### Step 6: Run All Tests

```bash
# Run all tests
echo "=== Running all tests ==="
pnpm test

# Run tests with coverage
echo "=== Running tests with coverage ==="
pnpm test --coverage
```

### Step 7: Run Linting

```bash
# Run ESLint
echo "=== Running linter ==="
pnpm lint

# Fix any auto-fixable issues
echo "=== Running linter with auto-fix ==="
pnpm lint --fix
```

### Step 8: Type Check

```bash
# Run TypeScript type checking
echo "=== TypeScript type check ==="
pnpm exec tsc --noEmit
```

### Step 9: Storybook Verification

```bash
# Build Storybook
echo "=== Building Storybook ==="
pnpm --filter @dsai-io/storybook build-storybook

# Start Storybook (manual verification)
echo "=== Starting Storybook for manual verification ==="
pnpm --filter @dsai-io/storybook storybook
```

Manual checks:

- [ ] Storybook loads without errors
- [ ] Components render correctly
- [ ] No console errors in browser

### Step 10: Nx Graph Verification

```bash
# Generate and view dependency graph
echo "=== Nx Dependency Graph ==="
nx graph
```

Manual checks:

- [ ] All packages appear with correct names (@dsai-io/\*)
- [ ] Dependencies are correctly linked
- [ ] No orphaned packages

---

## Acceptance Criteria

### No Old References

- [ ] Zero `@dsai-io/` references found (excluding `@dsai-io`)
- [ ] Old `packages/@dsai-io/` folder does not exist
- [ ] No old paths in any configuration files

### Build Success

- [ ] `pnpm install` completes without errors
- [ ] `pnpm build` completes without errors
- [ ] All packages produce expected build artifacts

### Tests Pass

- [ ] `pnpm test` passes all tests
- [ ] No test failures due to import issues
- [ ] Test coverage maintained

### Lint Success

- [ ] `pnpm lint` passes without errors
- [ ] No ESLint import errors

### Type Check Success

- [ ] `tsc --noEmit` completes without errors
- [ ] All TypeScript paths resolve correctly

### Storybook Works

- [ ] Storybook builds successfully
- [ ] Storybook runs without errors
- [ ] All stories load and render

### Nx Integration

- [ ] `nx show projects` lists all packages with new names
- [ ] `nx graph` shows correct dependency structure
- [ ] `nx affected` works correctly

---

## Final Verification Summary

Create a verification report:

```markdown
# Migration Verification Report

**Date**: [DATE]
**Migration**: @dsai-io/_ → @dsai-io/_

## Summary

| Check             | Status | Notes            |
| ----------------- | ------ | ---------------- |
| No old references | ✅/❌  |                  |
| pnpm install      | ✅/❌  |                  |
| pnpm build        | ✅/❌  |                  |
| pnpm test         | ✅/❌  | X/Y tests passed |
| pnpm lint         | ✅/❌  |                  |
| tsc --noEmit      | ✅/❌  |                  |
| Storybook build   | ✅/❌  |                  |
| nx graph          | ✅/❌  |                  |

## Issues Found

[List any issues and how they were resolved]

## Sign-off

- [ ] Verified by: [NAME]
- [ ] Date: [DATE]
```

---

## Commit and Push

After all verifications pass:

```bash
# Final commit if any fixes were needed
git add -A
git commit -m "chore: complete @dsai to @dsai-io migration verification

All verification checks passed:
- No old @dsai-io/ references remain
- Build successful
- All tests pass
- Lint passes
- TypeScript compiles
- Storybook works
- Nx graph correct

Closes TASK-110, TASK-111, TASK-112, TASK-113, TASK-114, TASK-115, TASK-116"

# Push changes
git push origin feature/migrate-dsai-io
```

---

## Create Pull Request

```bash
# Create PR via GitHub CLI
gh pr create \
  --title "chore: migrate package scope from @dsai to @dsai-io" \
  --body "## Summary

This PR migrates all packages from the \`@dsai-io/*\` scope to \`@dsai-io/*\`.

## Changes

- Renamed all package folders from \`packages/@dsai-io/*\` to \`packages/@dsai-io/*\`
- Updated all package.json files with new names and \`private: true\`
- Updated all configuration files (tsconfig, nx, jest, etc.)
- Updated all source code imports
- Updated all documentation

## Verification

All checks passed:
- ✅ No old references remain
- ✅ Build successful
- ✅ All tests pass
- ✅ Lint passes
- ✅ Storybook works

## Related Tasks

- TASK-110: Master migration plan
- TASK-111: Rename folders
- TASK-112: Update package.json
- TASK-113: Update config files
- TASK-114: Update source imports
- TASK-115: Update documentation
- TASK-116: Verification (this task)"
```

---

## Post-Migration Checklist

After PR is merged:

- [ ] Delete migration branch
- [ ] Update any external documentation
- [ ] Notify team members
- [ ] Update CI/CD if needed
- [ ] Close all related task files
- [ ] Archive completed tasks

---

## Rollback Plan

If critical issues are found after merge:

```bash
# Revert the merge commit
git revert -m 1 <merge-commit-hash>

# Or restore from backup branch
git checkout main
git reset --hard <pre-migration-commit>
git push --force origin main
```

---

## Common Issues During Verification

### Issue: pnpm install fails

**Cause**: Package name mismatch between package.json and folder structure.

**Solution**: Verify all package.json `name` fields match folder names.

### Issue: Tests fail with "Cannot find module"

**Cause**: Jest module mapper not updated or cache stale.

**Solution**: Run `nx reset`, clear jest cache, and reinstall.

### Issue: Storybook shows import errors

**Cause**: Storybook configuration still references old paths.

**Solution**: Check `.storybook/main.ts` and update any @dsai references.

### Issue: Nx graph shows wrong project names

**Cause**: project.json files have incorrect `name` field.

**Solution**: Update all project.json `name` fields to match package.json.

---

## Task Created

- Date: 2026-01-14
- Created By: AI Assistant
- Reviewed By: Pending

---
