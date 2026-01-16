# TASK-113: Update Configuration Files

## Priority: Critical

## Status: ✅ Completed

## Completed Date: 2025-01-15

## Estimated Effort: 1 hour

## Dependencies: TASK-112 (Update package.json Files)

## Parent Task: TASK-110

---

## Description

Update all configuration files that reference `@dsai-io/*` packages or paths to use the new `@dsai-io/*` scope and paths. This includes TypeScript configs, Jest configs, Nx configs, ESLint configs, and build configurations.

---

## Files to Modify

### TypeScript Configuration Files

| #   | File Path                                      | Changes               |
| --- | ---------------------------------------------- | --------------------- |
| 1   | `tsconfig.base.json`                           | Update paths mappings |
| 2   | `packages/@dsai-io/react/tsconfig.json`        | Update references     |
| 3   | `packages/@dsai-io/react/tsconfig.lib.json`    | Update references     |
| 4   | `packages/@dsai-io/tools/tsconfig.json`        | Update references     |
| 5   | `packages/@dsai-io/tools/tsconfig.lib.json`    | Update references     |
| 6   | `packages/@dsai-io/tokens/tsconfig.json`       | Update references     |
| 7   | `packages/@dsai-io/figma-tokens/tsconfig.json` | Update references     |
| 8   | `packages/@dsai-io/storybook/tsconfig.json`    | Update references     |
| 9   | `packages/@dsai-io/docs/tsconfig.json`         | Update references     |

### Nx Configuration Files

| #   | File Path                                     | Changes                            |
| --- | --------------------------------------------- | ---------------------------------- |
| 1   | `nx.json`                                     | Update targetDefaults, namedInputs |
| 2   | `packages/@dsai-io/react/project.json`        | Update project name                |
| 3   | `packages/@dsai-io/tools/project.json`        | Update project name                |
| 4   | `packages/@dsai-io/tokens/project.json`       | Update project name                |
| 5   | `packages/@dsai-io/figma-tokens/project.json` | Update project name                |
| 6   | `packages/@dsai-io/storybook/project.json`    | Update project name                |
| 7   | `packages/@dsai-io/docs/project.json`         | Update project name                |

### Jest Configuration Files

| #   | File Path                                | Changes                   |
| --- | ---------------------------------------- | ------------------------- |
| 1   | `jest.config.cjs`                        | Update module name mapper |
| 2   | `jest.preset.cjs`                        | Update paths              |
| 3   | `packages/@dsai-io/react/jest.config.ts` | Update paths              |
| 4   | `packages/@dsai-io/tools/jest.config.ts` | Update paths              |

### ESLint Configuration

| #   | File Path           | Changes             |
| --- | ------------------- | ------------------- |
| 1   | `eslint.config.mjs` | Update import paths |

### Build Configuration Files

| #   | File Path                        | Changes                    |
| --- | -------------------------------- | -------------------------- |
| 1   | `config/vite.shared.ts`          | Update paths if applicable |
| 2   | `apps/playground/vite.config.ts` | Update @dsai imports       |
| 3   | `apps/demo85/vite.config.ts`     | Update @dsai imports       |

### pnpm Workspace Configuration

| #   | File Path             | Changes                      |
| --- | --------------------- | ---------------------------- |
| 1   | `pnpm-workspace.yaml` | Update packages glob pattern |

---

## Detailed Changes

### tsconfig.base.json

The paths mapping needs to be updated:

```json
// Before
"paths": {
  "@dsai-io/react": ["packages/@dsai-io/react/src/index.ts"],
  "@dsai-io/react/*": ["packages/@dsai-io/react/src/*"],
  "@dsai-io/tools": ["packages/@dsai-io/tools/src/index.ts"],
  "@dsai-io/tools/*": ["packages/@dsai-io/tools/src/*"],
  "@dsai-io/tokens": ["packages/@dsai-io/tokens/src/index.ts"],
  "@dsai-io/tokens/*": ["packages/@dsai-io/tokens/src/*"],
  "@dsai-io/figma-tokens": ["packages/@dsai-io/figma-tokens/src/index.ts"],
  "@dsai-io/figma-tokens/*": ["packages/@dsai-io/figma-tokens/src/*"]
}

// After
"paths": {
  "@dsai-io/react": ["packages/@dsai-io/react/src/index.ts"],
  "@dsai-io/react/*": ["packages/@dsai-io/react/src/*"],
  "@dsai-io/tools": ["packages/@dsai-io/tools/src/index.ts"],
  "@dsai-io/tools/*": ["packages/@dsai-io/tools/src/*"],
  "@dsai-io/tokens": ["packages/@dsai-io/tokens/src/index.ts"],
  "@dsai-io/tokens/*": ["packages/@dsai-io/tokens/src/*"],
  "@dsai-io/figma-tokens": ["packages/@dsai-io/figma-tokens/src/index.ts"],
  "@dsai-io/figma-tokens/*": ["packages/@dsai-io/figma-tokens/src/*"]
}
```

### project.json Files

Each project.json needs the name field updated:

```json
// Before
{
  "name": "@dsai-io/react",
  "sourceRoot": "packages/@dsai-io/react/src",
  "projectType": "library"
}

// After
{
  "name": "@dsai-io/react",
  "sourceRoot": "packages/@dsai-io/react/src",
  "projectType": "library"
}
```

### jest.config.cjs

Update module name mapper:

```javascript
// Before
moduleNameMapper: {
  '^@dsai-io/(.*)$': '<rootDir>/packages/@dsai-io/$1/src'
}

// After
moduleNameMapper: {
  '^@dsai-io/(.*)$': '<rootDir>/packages/@dsai-io/$1/src'
}
```

### pnpm-workspace.yaml

Update packages glob:

```yaml
# Before
packages:
  - 'packages/@dsai-io/*'
  - 'apps/*'

# After
packages:
  - 'packages/@dsai-io/*'
  - 'apps/*'
```

---

## Implementation Steps

### Step 1: Update tsconfig.base.json

Replace all `@dsai-io/` with `@dsai-io/` in paths section.

### Step 2: Update all project.json files

For each package, update:

- `name` field
- `sourceRoot` path
- Any `implicitDependencies` references

### Step 3: Update pnpm-workspace.yaml

Change packages glob from `@dsai-io/*` to `@dsai-io/*`.

### Step 4: Update jest configuration

Update moduleNameMapper patterns.

### Step 5: Update ESLint configuration

Update any import patterns or paths.

### Step 6: Clear caches and rebuild

```bash
# Clear Nx cache
nx reset

# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Attempt build
pnpm build
```

### Step 7: Verify TypeScript compilation

```bash
# Check TypeScript can resolve all imports
pnpm exec tsc --noEmit
```

### Step 8: Commit changes

```bash
git add -A
git commit -m "chore: update config files to @dsai-io paths

- Updated tsconfig.base.json paths mappings
- Updated all project.json files with new package names
- Updated pnpm-workspace.yaml packages glob
- Updated jest module name mapper
- Updated ESLint configuration

Part of TASK-113 migration plan."
```

---

## Acceptance Criteria

- [x] tsconfig.base.json uses `@dsai-io/*` paths
- [x] All project.json files have updated names and paths
- [x] pnpm-workspace.yaml points to new package folder
- [x] jest.config.cjs module mapper uses new paths
- [x] `pnpm install` completes without errors
- [x] `nx reset` runs without errors
- [ ] TypeScript compilation succeeds (`tsc --noEmit`) - deferred to TASK-114
- [x] `nx graph` shows correct project names (verified with `nx show projects`)

---

## Verification Commands

```bash
# Verify Nx recognizes all projects
nx show projects

# Expected output:
# @dsai-io/react
# @dsai-io/tools
# @dsai-io/tokens
# @dsai-io/figma-tokens
# @dsai-io/storybook
# @dsai-io/docs
# demo85
# playground

# Verify Nx can show project details
nx show project @dsai-io/react

# Verify TypeScript paths
grep -A 20 '"paths"' tsconfig.base.json

# Check no old references in config files
grep -r "@dsai-io/" *.json *.yaml *.mjs *.cjs | grep -v "@dsai-io" | grep -v node_modules
```

---

## Common Issues

### Issue: Nx can't find project

**Cause**: project.json name doesn't match the expected format.

**Solution**: Ensure project.json `name` field matches package.json `name` field.

### Issue: TypeScript can't resolve imports

**Cause**: tsconfig.base.json paths not updated correctly.

**Solution**: Verify paths mapping syntax and file paths are correct.

### Issue: Jest tests fail with module not found

**Cause**: jest.config moduleNameMapper not updated.

**Solution**: Update the regex pattern in moduleNameMapper.

---

## Rollback Commands

```bash
# Restore all config files from git
git checkout HEAD -- tsconfig.base.json
git checkout HEAD -- nx.json
git checkout HEAD -- jest.config.cjs
git checkout HEAD -- pnpm-workspace.yaml
git checkout HEAD -- packages/@dsai-io/*/project.json
nx reset
pnpm install
```

---

## Next Task

After completing this task, proceed to TASK-114 (Update Source Imports)

---

## Task Created

- Date: 2026-01-14
- Created By: AI Assistant
- Reviewed By: Pending

---
