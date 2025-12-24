# Task: Clean Up Old Token Scripts

**Task ID:** TASK-112
**Title:** Remove Duplicate Scripts from tools/scripts/tokens
**Priority:** Medium
**Status:** ✅ Completed
**Assigned To:** Copilot
**Blocked by Task:** TASK-111 (completed)
**Created:** 2024-12-23
**Updated:** 2024-12-23
**Completed:** 2024-12-23

---

## 📋 Task Description

### Goal

Remove duplicate/migrated token scripts from `tools/scripts/tokens/` that are now implemented in `@dsai/tools`. This reduces maintenance overhead and eliminates confusion about which tool to use.

### Problem/Issue

After completing TASK-107 and TASK-111, the following scripts in `tools/scripts/tokens/` are duplicates of functionality now in `@dsai/tools`:

| Old Script                   | New Location                            |
| ---------------------------- | --------------------------------------- |
| `validate-tokens.cjs`        | `@dsai/tools/src/tokens/validate.ts`    |
| `transform-figma-tokens.cjs` | `@dsai/tools/src/tokens/transform.ts`   |
| `sync-tokens-flat.js`        | `@dsai/tools/src/tokens/sync.ts`        |
| `postprocess-theme-css.cjs`  | `@dsai/tools/src/tokens/postprocess.ts` |
| `merge-collections.cjs`      | `@dsai/tools/src/tokens/merge.ts`       |
| `merge-tokens.cjs`           | `@dsai/tools/src/tokens/merge.ts`       |

### Expected Outcome

- Reduced file count in `tools/scripts/tokens/`
- Single source of truth for token tooling
- Cleaner repository structure

---

## 🎯 Acceptance Criteria

### Removal

- [x] `validate-tokens.cjs` removed
- [x] `transform-figma-tokens.cjs` removed
- [x] `sync-tokens-flat.js` removed
- [x] `postprocess-theme-css.cjs` removed
- [x] `merge-collections.cjs` removed
- [x] `merge-tokens.cjs` removed
- [x] `build-all.cjs` removed (also migrated to @DSAi/tools)

### Verification

- [x] No broken references anywhere in the codebase
- [x] All build commands still work
- [ ] CI/CD passes (pending)
- [x] No grep hits for removed file paths

### Keep These (Not Migrated)

- [x] Verify `build-all.cjs` is either migrated or still needed → Removed (migrated)
- [x] Verify utility scripts are still referenced or can be removed:
  - `add-color-descriptions.cjs`
  - `apply-export-format.cjs`
  - `copy-light-to-dark.cjs`
  - `enhance-color-tokens.cjs`
  - `fix-dark-description.cjs`
  - `fix-dark-mode-colors.cjs`
  - `generate-token-index.cjs`
  - `update-descriptions-from-md.cjs`
  - `validate-figma-tokens.cjs`

---

## 📂 Files to Remove

```
tools/scripts/tokens/
├── validate-tokens.cjs         # REMOVE - migrated
├── transform-figma-tokens.cjs  # REMOVE - migrated
├── sync-tokens-flat.js         # REMOVE - migrated
├── postprocess-theme-css.cjs   # REMOVE - migrated
├── merge-collections.cjs       # REMOVE - migrated
├── merge-tokens.cjs            # REMOVE - migrated
├── build-all.cjs               # EVALUATE - may still be needed
└── [other utility scripts]     # EVALUATE - one-off utilities
```

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-111: Update Package References (must be completed first)
- [ ] All packages using `dsai` CLI successfully

### Blocks

- None

---

## 🔄 Implementation Steps

### Step 1: Verify No References Exist

```bash
# Search for any remaining references to scripts we're removing
grep -r "validate-tokens.cjs" --include="*.json" --include="*.ts" --include="*.js" .
grep -r "transform-figma-tokens.cjs" --include="*.json" --include="*.ts" --include="*.js" .
grep -r "sync-tokens-flat.js" --include="*.json" --include="*.ts" --include="*.js" .
grep -r "postprocess-theme-css.cjs" --include="*.json" --include="*.ts" --include="*.js" .
grep -r "merge-collections.cjs" --include="*.json" --include="*.ts" --include="*.js" .
grep -r "merge-tokens.cjs" --include="*.json" --include="*.ts" --include="*.js" .
```

### Step 2: Remove Migrated Scripts

```bash
# Remove files that have been migrated to @dsai/tools
rm tools/scripts/tokens/validate-tokens.cjs
rm tools/scripts/tokens/transform-figma-tokens.cjs
rm tools/scripts/tokens/sync-tokens-flat.js
rm tools/scripts/tokens/postprocess-theme-css.cjs
rm tools/scripts/tokens/merge-collections.cjs
rm tools/scripts/tokens/merge-tokens.cjs
```

### Step 3: Evaluate Remaining Scripts

For each remaining script in `tools/scripts/tokens/`:

1. Check if it's referenced anywhere
2. Check if functionality exists in `@dsai/tools`
3. If one-off utility, consider keeping or documenting
4. If duplicated, remove

### Step 4: Update Documentation

- Update `tools/scripts/tokens/README.md` to reflect remaining scripts
- Document which utilities are available and when to use them

### Step 5: Run Full Build

```bash
# Verify nothing is broken
pnpm nx run-many -t build -p @dsai/tokens @dsai/react @dsai/tools
pnpm nx run-many -t test -p @dsai/tokens
```

---

## 🧪 Testing Requirements

- [ ] `pnpm nx build @dsai/tokens` succeeds
- [ ] `pnpm nx build @dsai/react` succeeds
- [ ] No broken imports or require() calls
- [ ] CI/CD pipeline passes

---

## 📖 Documentation Requirements

- [ ] Update `tools/scripts/README.md`
- [ ] Update `tools/scripts/tokens/README.md` (or remove if empty)
- [ ] Add note to @DSAi/tools README about migration

---

## ✅ Definition of Done

- [ ] All duplicate scripts removed
- [ ] No broken references in codebase
- [ ] Remaining scripts documented
- [ ] CI/CD passes
- [ ] README updated
