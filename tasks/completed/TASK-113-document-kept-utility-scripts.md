# Task: Document Kept Utility Scripts

**Task ID:** TASK-113
**Title:** Document Utility Scripts That Remain in tools/
**Priority:** Low
**Status:** ✅ Completed
**Assigned To:** Copilot
**Blocked by Task:** TASK-112 (completed)
**Created:** 2024-12-23
**Updated:** 2024-12-23
**Completed:** 2024-12-23

---

## 📋 Task Description

### Goal

Create documentation for utility scripts and tools that remain in the `tools/` directory after migration. These scripts serve specific purposes (Storybook, GitHub, analysis, etc.) and should not be moved to `@dsai/tools`.

### Problem/Issue

After TASK-111 and TASK-112, several directories/scripts in `tools/` will remain:

1. **Shell scripts** - Cannot be easily migrated to TypeScript CLI
2. **One-off utilities** - Used rarely, not worth maintaining in a package
3. **External integrations** - Storybook, GitHub, analysis tools
4. **Metadata/resources** - Component metadata, dev resources, icon generation

Without documentation, future maintainers won't know:

- Why these weren't migrated
- When to use them
- Whether they're still maintained

### Expected Outcome

Clear documentation in `tools/README.md` explaining:

- What remains in `tools/` and why
- When to use each category of scripts
- What's been migrated to `@dsai/tools`

---

## 🎯 Acceptance Criteria

### Documentation

- [x] `tools/README.md` updated with current structure
- [x] Each subdirectory has a brief description
- [x] Migration status is clear (what moved to @DSAi/tools)
- [x] Usage instructions for remaining scripts

### Cleanup

- [x] Empty directories removed (`tools/config/`, `tools/figma-plugins/`)
- [x] Outdated README files updated
- [x] Unused scripts identified (migrated scripts removed in TASK-112)

---

## 📂 Directories to Document

### Keep and Document

| Directory                   | Purpose                                 | Status   |
| --------------------------- | --------------------------------------- | -------- |
| `tools/scripts/storybook/`  | Storybook build scripts (shell scripts) | Keep     |
| `tools/scripts/github/`     | GitHub integration utilities            | Keep     |
| `tools/scripts/analysis/`   | Code analysis utilities                 | Keep     |
| `tools/scripts/icons/`      | Icon generation (if not in @DSAi/tools) | Evaluate |
| `tools/component-metadata/` | React component metadata extraction     | Keep     |
| `tools/dev-resources/`      | Development resources and docs          | Keep     |
| `tools/icons/`              | Icon assets and templates               | Keep     |

### Remove (Empty or Outdated)

| Directory              | Reason                           |
| ---------------------- | -------------------------------- |
| `tools/config/`        | Empty, configs moved to packages |
| `tools/figma-plugins/` | Empty or outdated                |

### Token Scripts (Post-Cleanup)

| Script                  | Status                            |
| ----------------------- | --------------------------------- |
| `build-all.cjs`         | Evaluate - may be replaced by CLI |
| One-off color utilities | Keep as utilities, document usage |

---

## 🔄 Implementation Steps

### Step 1: Audit Current State

```bash
# List all files and directories in tools/
find tools -type f -name "*.js" -o -name "*.cjs" -o -name "*.ts" -o -name "*.sh"

# Check for empty directories
find tools -type d -empty
```

### Step 2: Remove Empty Directories

```bash
# Remove confirmed empty/unused directories
rm -rf tools/config/
rm -rf tools/figma-plugins/
```

### Step 3: Update tools/README.md

Create a comprehensive README with:

```markdown
# Tools Directory

This directory contains utility scripts and development tools that are NOT part of the
`@dsai/tools` package. These remain here because they are:

- Shell scripts that can't be easily converted to TypeScript
- One-off utilities used infrequently
- External integration tools (Storybook, GitHub)
- Metadata and resource generators

## Migrated to @dsai/tools

The following functionality has moved to `@dsai/tools`:

- **Token validation** → `dsai tokens validate`
- **Token transformation** → `dsai tokens build`
- **Token sync** → `dsai tokens sync`
- **Icon builds** → `dsai icons build`

See `packages/@dsai/tools/README.md` for full CLI documentation.

## Remaining Tools

### scripts/storybook/

Shell scripts for Storybook builds. Used by CI/CD.

### scripts/github/

GitHub integration utilities (release notes, PR automation).

### scripts/analysis/

Code analysis and reporting scripts.

### component-metadata/

Extracts metadata from React components for documentation.

### dev-resources/

Development guidelines and resources.

### icons/

Icon assets, templates, and generation utilities.

### scripts/tokens/

One-off token utilities (color adjustments, description updates).
For main token operations, use `dsai` CLI.
```

### Step 4: Add README to Subdirectories

Add brief README.md files to key subdirectories explaining:

- Purpose
- How to run
- When to use

---

## 🧪 Testing Requirements

- [ ] All remaining scripts execute without errors
- [ ] Documentation is accurate
- [ ] No broken references

---

## 📖 Documentation Requirements

- [ ] `tools/README.md` fully updated
- [ ] Each subdirectory has README or is documented in parent
- [x] @DSAi/tools README references migration from tools/

---

## ✅ Definition of Done

- [ ] Empty directories removed
- [ ] `tools/README.md` accurately describes remaining contents
- [ ] Migration path documented
- [ ] No orphaned or undocumented scripts
