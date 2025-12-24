# Task: @dsai/tools Package Initiative - Master Roadmap

**Task ID:** TASK-100
**Title:** @dsai/tools Package Initiative - Enterprise-Ready Build Tooling
**Priority:** High
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Blocked by Task:** None
**Created:** 2024-12-23
**Updated:** 2024-12-23

---

## 📋 Task Description

### Goal

Create a new `@dsai/tools` package that consolidates all build tooling, scripts, and configuration management into a proper npm package. This enables enterprise teams to consume DSAi design tokens and tooling as proper dependencies with full customization capabilities.

### Problem/Issue

**Current Issues:**

1. **Hardcoded Paths**: Token scripts use relative paths like `../../../tools/scripts/tokens/` making them unusable outside the monorepo
2. **No Configuration Override**: Teams cannot customize prefixes, output paths, theme selectors without modifying source
3. **Scripts Not Packageable**: Build scripts in `tools/` directory cannot be installed as dependencies
4. **Tight Coupling**: `@dsai/tokens` is tightly coupled to monorepo structure
5. **No CLI**: No command-line interface for external consumers
6. **No Extensibility Hooks**: No way to add custom transforms, formats, or preprocessors

**Enterprise Pain Points:**

- Cannot `npm install @dsai/tokens` and have working build pipeline
- Cannot override CSS variable prefix (`--dsai-` → `--acme-`)
- Cannot customize theme attribute selectors
- Cannot point to custom Figma export locations
- Cannot extend Style Dictionary with custom transforms

### Expected Outcome

A fully functional `@dsai/tools` package that:

1. Provides CLI commands for token building, validation, transformation
2. Supports layered configuration (project → user → defaults)
3. Exports programmatic APIs for CI/CD integration
4. Enables full customization without source modification
5. Works standalone or within the DSAi monorepo
6. Maintains backward compatibility with existing workflows

---

## 🎯 Architecture Overview

### Package Structure

```
packages/@dsai/tools/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── README.md
├── bin/
│   └── dsai-tools.mjs              # CLI entry point
├── src/
│   ├── index.ts                     # Main exports
│   ├── cli/
│   │   ├── index.ts                 # CLI orchestration
│   │   ├── commands/
│   │   │   ├── tokens.ts            # tokens build/validate/transform
│   │   │   ├── icons.ts             # icons generate
│   │   │   └── init.ts              # init config file
│   │   └── utils/
│   │       ├── logger.ts            # Colored console output
│   │       └── spinner.ts           # Progress indicators
│   ├── config/
│   │   ├── index.ts                 # Config exports
│   │   ├── resolver.ts              # Config resolution logic
│   │   ├── defaults.ts              # Default configuration values
│   │   ├── schema.ts                # Zod schema validation
│   │   ├── loader.ts                # Load from various formats
│   │   └── types.ts                 # TypeScript interfaces
│   ├── tokens/
│   │   ├── index.ts                 # Token tooling exports
│   │   ├── validate.ts              # Token validation
│   │   ├── transform.ts             # Figma → DTCG transformation
│   │   ├── sync.ts                  # Sync tokens-flat
│   │   ├── build.ts                 # Build orchestration
│   │   └── style-dictionary/
│   │       ├── index.ts             # SD integration exports
│   │       ├── config.ts            # SD config generator
│   │       ├── transforms.ts        # Custom transforms
│   │       ├── formats.ts           # Custom formats
│   │       └── preprocessors.ts     # Custom preprocessors
│   ├── icons/
│   │   ├── index.ts                 # Icon tooling exports
│   │   └── generate.ts              # Icon generation
│   └── utils/
│       ├── index.ts                 # Utility exports
│       ├── paths.ts                 # Path resolution utilities
│       ├── files.ts                 # File system utilities
│       └── logger.ts                # Logging utilities
├── templates/
│   ├── dsai.config.mjs              # Template config file
│   └── tokens.config.json           # Legacy config template
└── tests/
    ├── config.test.ts
    ├── tokens.test.ts
    └── cli.test.ts
```

### Configuration System

```typescript
// Enterprise usage: dsai.config.mjs
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    // Source configuration
    source: 'theme',
    sourceDir: './figma-exports',
    collectionsDir: './collections',

    // Output configuration
    outputDir: './dist',
    prefix: '--acme-',

    // Theme configuration
    themes: {
      autoDetect: true,
      default: 'Light',
      ignoreModes: ['WIP'],
      selectorPattern: {
        default: ':root',
        others: '[data-acme-theme="{mode}"]',
      },
    },

    // Extensibility hooks
    transforms: [],
    formats: [],
    preprocessors: [],
  },

  icons: {
    sourceDir: './icons',
    outputDir: './dist/icons',
    framework: 'react',
  },
});
```

---

## 🗺️ Task Breakdown

### Phase 1: Foundation (TASK-101 to TASK-102)

| Task ID  | Title                | Priority | Description                                                      |
| -------- | -------------------- | -------- | ---------------------------------------------------------------- |
| TASK-101 | Package Scaffolding  | High     | Create @dsai/tools package structure, dependencies, build config |
| TASK-102 | Configuration System | High     | Implement config resolver, schema validation, loader             |

### Phase 2: Token Tooling (TASK-103 to TASK-104)

| Task ID  | Title                        | Priority | Description                                              |
| -------- | ---------------------------- | -------- | -------------------------------------------------------- |
| TASK-103 | Token Scripts Migration      | High     | Migrate validate, transform, sync, build scripts         |
| TASK-104 | Style Dictionary Integration | High     | Extract SD transforms, formats, preprocessors as modules |

### Phase 3: CLI & Icons (TASK-105 to TASK-106)

| Task ID  | Title              | Priority | Description                                   |
| -------- | ------------------ | -------- | --------------------------------------------- |
| TASK-105 | CLI Implementation | High     | Create dsai-tools CLI with subcommands        |
| TASK-106 | Icons Migration    | Medium   | Move icon generation scripts to tools package |

### Phase 4: Integration (TASK-107 to TASK-110)

| Task ID  | Title                    | Priority | Description                                         |
| -------- | ------------------------ | -------- | --------------------------------------------------- |
| TASK-107 | Tokens Package Update    | High     | Update @dsai/tokens to use @dsai/tools              |
| TASK-108 | Enterprise Documentation | Medium   | Complete docs for customization and usage           |
| TASK-109 | Testing Suite            | High     | Comprehensive tests for all modules                 |
| TASK-110 | Style Merge & Bundle     | High     | Merge additional SCSS/CSS dirs, create bundle files |

---

## 🔗 Dependencies Graph

```
TASK-100 (This task - Master Roadmap)
    │
    ├── TASK-101 (Package Scaffolding)
    │       │
    │       └── TASK-102 (Configuration System)
    │               │
    │               ├── TASK-103 (Token Scripts Migration)
    │               │       │
    │               │       └── TASK-104 (Style Dictionary Integration)
    │               │               │
    │               │               └── TASK-110 (Style Merge & Bundle)
    │               │                       │
    │               │                       └── TASK-107 (Tokens Package Update)
    │               │
    │               └── TASK-105 (CLI Implementation)
    │                       │
    │                       └── TASK-106 (Icons Migration)
    │
    ├── TASK-108 (Enterprise Documentation) - Can run parallel after TASK-107
    │
    └── TASK-109 (Testing Suite) - Can run parallel after TASK-104
```

---

## 🎯 Acceptance Criteria

### Must Have

- [ ] @dsai/tools package exists with proper structure
- [ ] `pnpm add @dsai/tools` works for external consumers
- [ ] `dsai-tools tokens build` CLI command works
- [ ] `dsai.config.mjs` configuration file supported
- [ ] All existing token build functionality preserved
- [ ] Custom prefix override works (`--dsai-` → `--custom-`)
- [ ] Custom output directory works
- [ ] Custom theme selectors work
- [ ] Backward compatible with existing monorepo usage

### Should Have

- [ ] `dsai-tools tokens validate` command
- [ ] `dsai-tools tokens transform` command
- [ ] `dsai-tools icons generate` command
- [ ] `dsai-tools init` scaffolds config file
- [ ] Programmatic API for CI/CD integration
- [ ] Custom transforms/formats/preprocessors hooks
- [ ] JSON Schema for config file validation

### Nice to Have

- [ ] Watch mode for all commands
- [ ] Dry-run mode
- [ ] Verbose logging levels
- [ ] Config validation command
- [ ] Migration command from legacy config

---

## 📊 Success Metrics

1. **Zero Breaking Changes**: Existing `pnpm tokens:build` in tokens package works unchanged
2. **External Consumption**: A test project can `npm install @dsai/tools` and build tokens
3. **Configuration Override**: All configurable values can be overridden via config file
4. **CLI Completeness**: All token operations available via CLI
5. **Test Coverage**: >80% test coverage on core modules
6. **Documentation**: Complete enterprise usage guide

---

## 📝 Notes

### Design Decisions

1. **Config Format**: Use `dsai.config.mjs` (ESM) as primary, support `.dsairc.json` for simple cases
2. **Config Resolution**: cosmiconfig-style resolution (project → user → defaults)
3. **CLI Framework**: Use Commander.js for CLI (lightweight, well-documented)
4. **Validation**: Zod for runtime schema validation
5. **Build Tool**: tsup for bundling (already used in monorepo)

### Backward Compatibility

- Keep `tokens.config.json` support with deprecation warning
- Existing `pnpm tokens:build` scripts continue to work
- Relative path scripts remain functional during transition

### Migration Path

1. Install @dsai/tools as devDependency
2. Create dsai.config.mjs (optional, defaults work)
3. Update package.json scripts to use CLI
4. Remove legacy relative path scripts

---

## ✅ Definition of Done

- [ ] All child tasks (TASK-101 through TASK-109) completed
- [ ] @dsai/tools published to npm registry
- [ ] @dsai/tokens updated to use @dsai/tools
- [ ] Enterprise documentation complete
- [ ] Test coverage meets threshold
- [ ] No regression in existing functionality
- [ ] External consumption validated

---

## 📚 Related Documents

- TASK-101: Package Scaffolding
- TASK-102: Configuration System
- TASK-103: Token Scripts Migration
- TASK-104: Style Dictionary Integration
- TASK-105: CLI Implementation
- TASK-106: Icons Migration
- TASK-107: Tokens Package Update
- TASK-108: Enterprise Documentation
- TASK-109: Testing Suite
