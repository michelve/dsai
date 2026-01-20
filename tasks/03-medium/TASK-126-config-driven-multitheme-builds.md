# Config-Driven Multi-Theme Token Builds

**Task ID:** TASK-126
**Title:** Config-Driven Multi-Theme Token Builds
**Priority:** Medium
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Blocked by Task:** None
**Created:** 2025-01-20
**Updated:** 2025-01-20

---

## 📋 Task Description

### Goal

Eliminate hardcoded theme definitions in `build-tokens.mjs` scripts by making multi-theme token builds fully config-driven through `dsai.config.mjs`. The tools package should handle theme discovery, file matching, and Style Dictionary configuration generation internally.

### Problem/Issue

Currently, apps like `playground` maintain a 337-line `build-tokens.mjs` script with **hardcoded theme definitions**:

```javascript
// apps/playground/build-tokens.mjs - CURRENT (problematic)
const THEMES = {
  light: {
    suffix: null,
    selector: ':root',
    cssFile: 'tokens.css',
    scssFile: '_variables.scss',
    bootstrapScssFile: '_variables.scss',
    isDefault: true,
  },
  dark: {
    suffix: '-dark',
    selector: '[data-dsai-theme="dark"]',
    cssFile: 'tokens-dark.css',
    // ... more hardcoded values
  },
  pro: { /* ... */ },
  enterprise: { /* ... */ },
  moonlight: { /* ... */ },
};
```

**Issues with current approach:**

1. **Duplication**: Every app maintaining its own `build-tokens.mjs` with similar logic
2. **Hardcoded values**: Theme names, selectors, file patterns not configurable
3. **No central config**: Theme definitions not in `dsai.config.mjs`
4. **Inconsistency risk**: Different apps may define themes differently
5. **Gap exists**: The tools package has `ThemesConfig` types but `buildTokens()` doesn't use them
6. **Template generator also hardcoded**: `generateBuildTokensScript()` in `templates.ts` generates scripts with hardcoded THEMES object (lines 1130-1250)

**Two locations with hardcoded themes:**

```text
1. apps/playground/build-tokens.mjs (line 38)          ← App-level script
2. packages/@dsai-io/tools/src/cli/init/templates.ts (line 1160) ← Template generator!
```

**Infrastructure already exists (unused):**

```typescript
// types.ts - ThemesConfig interface (partially implemented)
interface ThemesConfig {
  autoDetect?: boolean;
  default?: string;
  ignoreModes?: string[];
  selectorPattern?: ThemeSelectorPattern;
}

// schema.ts - themesConfigSchema (more complete, different structure)
themesConfigSchema = z.object({
  enabled: z.boolean(),
  defaultMode: z.enum(['light', 'dark', 'system']),
  modes: z.record(z.string(), themeModeSchema),
  outputFileName: z.string(),
  colorScheme: z.object({ light, dark }),
});

// defaults.ts - defaultSelectorPattern (exists but unused)
defaultSelectorPattern = {
  default: ':root',
  others: '[data-dsai-theme="{mode}"]',
};
```

### Expected Outcome

After implementation, apps can define themes entirely in config:

```javascript
// dsai.config.mjs - DESIRED
export default defineConfig({
  tokens: {
    themes: {
      enabled: true,
      autoDetect: false, // Use explicit definitions below
      
      definitions: {
        light: {
          isDefault: true,
          suffix: null, // Files without suffix (e.g., foundation.json)
          selector: ':root',
          outputFiles: {
            css: 'tokens.css',
            scss: '_variables.scss',
          },
        },
        dark: {
          suffix: '-dark', // Files ending with -dark (e.g., foundation-dark.json)
          selector: '[data-dsai-theme="dark"]',
          mediaQuery: '(prefers-color-scheme: dark)', // Optional
          outputFiles: {
            css: 'tokens-dark.css',
            scss: '_variables-dark.scss',
          },
        },
        pro: {
          suffix: '-pro',
          selector: '[data-dsai-theme="pro"]',
          outputFiles: {
            css: 'tokens-pro.css',
          },
        },
      },
      
      // Auto-discovery pattern (when autoDetect: true)
      suffixPattern: '-{theme}', // How to extract theme from filename
      selectorPattern: '[data-dsai-theme="{mode}"]', // Template for selectors
    },
  },
});
```

And `build-tokens.mjs` becomes minimal:

```javascript
// apps/playground/build-tokens.mjs - AFTER (simplified)
import { buildTokens, loadConfig } from '@dsai-io/tools';

const config = await loadConfig();
await buildTokens(config);
```

---

## 🎯 Acceptance Criteria

### Core Functionality

- [ ] Theme definitions can be specified in `dsai.config.mjs`
- [ ] `buildTokens()` reads and uses theme config from resolved config
- [ ] Per-theme output files generated with correct CSS selectors
- [ ] Theme suffix pattern auto-discovers files (e.g., `*-dark.json` → dark theme)
- [ ] Default theme uses `:root` selector without data attribute
- [ ] Non-default themes use `[data-dsai-theme="{mode}"]` selector

### Configuration

- [ ] Backward compatible: existing configs without themes still work
- [ ] Support both `autoDetect: true` (scan files) and explicit definitions
- [ ] Configurable selector patterns (for different frameworks)
- [ ] Configurable output file names per theme
- [ ] MediaQuery support for prefers-color-scheme

### Edge Cases

- [ ] Graceful handling when theme files not found for defined theme
- [ ] Warning when files exist but theme not defined (autoDetect: false)
- [ ] Conflicting selector validation
- [ ] Case-insensitive theme matching option

### Migration

- [ ] Playground `build-tokens.mjs` reduced to <20 lines
- [ ] CLI `dsai tokens:build` uses themes from config
- [ ] Documentation updated with examples

### Testing

- [ ] Unit tests for theme config resolution
- [ ] Unit tests for file discovery by suffix
- [ ] Integration tests for multi-theme build
- [ ] Tests for edge cases (missing files, conflicting selectors)

---

## 📂 Files to Modify

### Config Layer

| File | Changes |
|------|---------|
| `packages/@dsai-io/tools/src/config/types.ts` | Extend `ThemesConfig` with `definitions` object matching playground pattern |
| `packages/@dsai-io/tools/src/config/schema.ts` | Reconcile with types.ts, add `definitions` schema with validation |
| `packages/@dsai-io/tools/src/config/defaults.ts` | Add default theme definitions (light/dark) |
| `packages/@dsai-io/tools/src/config/resolver.ts` | Ensure `resolveThemesConfig()` handles new definitions |

### Build Layer

| File | Changes |
|------|---------|
| `packages/@dsai-io/tools/src/tokens/build.ts` | Update `buildTokens()` to use themes config |
| `packages/@dsai-io/tools/src/tokens/theme-builder.ts` | **NEW**: Theme-aware build orchestration |
| `packages/@dsai-io/tools/src/tokens/theme-discovery.ts` | **NEW**: Auto-discover theme files by suffix pattern |

### CLI Layer

| File | Changes |
|------|---------|
| `packages/@dsai-io/tools/src/cli/commands/tokens.ts` | Pass themes config to build, add `--theme` flag |
| `packages/@dsai-io/tools/src/cli/init/templates.ts` | **CRITICAL**: Update `generateBuildTokensScript()` to use config, not hardcoded THEMES |

### Integration

| File | Changes |
|------|---------|
| `apps/playground/build-tokens.mjs` | Simplify to use tools package directly |
| `apps/playground/dsai.config.mjs` | Add explicit theme definitions |

### Tests

| File | Changes |
|------|---------|
| `packages/@dsai-io/tools/src/config/__tests__/themes.test.ts` | **NEW**: Theme config resolution tests |
| `packages/@dsai-io/tools/src/tokens/__tests__/theme-builder.test.ts` | **NEW**: Theme build orchestration tests |
| `packages/@dsai-io/tools/src/tokens/__tests__/theme-discovery.test.ts` | **NEW**: Theme file discovery tests |
| `packages/@dsai-io/tools/src/cli/init/__tests__/templates.test.ts` | Update theme-related test (line 171) |

---

## 🔗 Dependencies

### Prerequisites

- [x] TASK-122: Incremental Builds (completed - uses cache infrastructure)
- [x] TASK-124: Changelog Generation (completed - uses diff infrastructure)
- [ ] Existing `defaultSelectorPattern` in defaults.ts (exists, ready to use)
- [ ] Existing `themeModeSchema` in schema.ts (exists, ready to extend)

### Blocks

- Future theme-related features (theme inheritance, theme composition)
- Brand theming feature (relies on config-driven themes)

---

## 🧪 Testing Requirements

### Unit Tests

- [ ] `resolveThemesConfig()` with various inputs
- [ ] Theme definition validation (missing selector, conflicting names)
- [ ] File suffix pattern matching (`*-dark.json`, `*-pro.json`)
- [ ] Selector template interpolation (`{mode}` replacement)
- [ ] Output file name generation

### Integration Tests

- [ ] Multi-theme build produces correct files
- [ ] Each theme file has correct CSS selector
- [ ] Default theme uses `:root` selector
- [ ] Incremental builds work with themes
- [ ] CLI `--theme dark` builds only dark theme

### Edge Case Tests

- [ ] Empty themes config (uses defaults)
- [ ] Theme defined but no files found
- [ ] Files found but theme not defined (autoDetect: false)
- [ ] Duplicate selectors across themes
- [ ] Invalid selector pattern (missing `{mode}`)
- [ ] Case sensitivity (Dark vs dark)

---

## 📖 Documentation Requirements

- [ ] Update `packages/@dsai-io/tools/README.md` with themes config section
- [ ] Update `packages/@dsai-io/tools/docs/TOOLS-GUIDE.md` with multi-theme examples
- [ ] Add JSDoc to all new types and functions
- [ ] Create migration guide for existing `build-tokens.mjs` scripts
- [ ] Update CLI help text for `--theme` flag

---

## 🔄 Implementation Steps

### Phase 1: Reconcile Type Definitions

1. [ ] Audit differences between `types.ts` and `schema.ts` theme configs
2. [ ] Design unified `ThemesConfig` interface that covers all use cases
3. [ ] Add `definitions: Record<string, ThemeDefinition>` to ThemesConfig
4. [ ] Update `ThemeDefinition` type with full properties:

   ```typescript
   interface ThemeDefinition {
     isDefault?: boolean;
     suffix?: string | null;
     selector: string;
     mediaQuery?: string;
     dataAttribute?: string;
     outputFiles?: Partial<Record<OutputFormat, string>>;
   }
   ```

5. [ ] Update Zod schema to match new types
6. [ ] Ensure backward compatibility with existing configs

### Phase 2: Theme Discovery

1. [ ] Create `theme-discovery.ts` module
2. [ ] Implement `discoverThemeFiles(sourceDir, themes)` function
3. [ ] Support suffix pattern matching (e.g., `-dark`, `-pro`)
4. [ ] Handle default theme (files without suffix)
5. [ ] Return mapping: `{ theme: string, files: string[] }[]`

### Phase 3: Theme Builder

1. [ ] Create `theme-builder.ts` module
2. [ ] Implement `buildTheme(theme, files, config)` function
3. [ ] Generate Style Dictionary config from theme definition
4. [ ] Use correct format for default vs non-default themes:
    - Default: `css/variables-with-comments` format
    - Others: `css/variables-dark-mode` format with selector
5. [ ] Support all output formats (CSS, SCSS, JS, TS, JSON)

### Phase 4: Build Integration

1. [ ] Update `buildTokens()` to check for themes config
2. [ ] If themes enabled: use theme-builder for multi-theme build
3. [ ] If themes disabled: use current single-theme logic
4. [ ] Integrate with incremental build (per-theme caching)
5. [ ] Integrate with changelog (per-theme diffs)

### Phase 5: CLI Integration

1. [ ] Add `--theme <name>` flag to tokens build command
2. [ ] Add `--all-themes` flag (default behavior)
3. [ ] Add `--list-themes` flag to show configured themes
4. [ ] Update help text and examples

### Phase 6: Playground Migration

1. [ ] Add theme definitions to `apps/playground/dsai.config.mjs`
2. [ ] Simplify `apps/playground/build-tokens.mjs` to ~10 lines
3. [ ] Test all themes build correctly
4. [ ] Verify output matches previous implementation

### Phase 7: Testing & Documentation

1. [ ] Write unit tests for all new modules
2. [ ] Write integration tests for end-to-end flows
3. [ ] Update README and TOOLS-GUIDE
4. [ ] Create migration guide

---

## 📝 Notes

### Key Design Decisions

1. **Use existing infrastructure**: The `defaultSelectorPattern`, `themeModeSchema`, and format `css/variables-dark-mode` already exist. Don't reinvent.

2. **Backward compatibility**: Configs without `themes.definitions` should continue to work with auto-detection.

3. **Explicit over implicit**: When `autoDetect: false`, only build themes explicitly defined. Warn about orphan files.

4. **Selector safety**: Validate selectors don't conflict. Two themes shouldn't have the same selector.

5. **File naming consistency**: Follow existing pattern:
   - Default theme: `tokens.css`, `_variables.scss`
   - Other themes: `tokens-{theme}.css`, `_variables-{theme}.scss`

### Existing Infrastructure Discovered (Use, Don't Reinvent)

| Location | What Exists | Status |
|----------|-------------|--------|
| `config/types.ts:505-550` | `ThemesConfig` interface with autoDetect, default, ignoreModes, selectorPattern | ⚠️ Incomplete |
| `config/schema.ts:126-150` | `themesConfigSchema` with modes, selector, mediaQuery, generateSeparateFiles | ⚠️ Different from types! |
| `config/defaults.ts:95-110` | `defaultSelectorPattern` = `{ default: ':root', others: '[data-dsai-theme="{mode}"]' }` | ✅ Ready |
| `config/defaults.ts:103-110` | `defaultThemesConfig` with autoDetect, default, ignoreModes | ✅ Ready |
| `config/resolver.ts:75-85` | `resolveThemesConfig()` function | ⚠️ Needs extension |
| `tokens/style-dictionary/formats/css-dark-mode.ts` | `css/variables-dark-mode` format with selector option | ✅ Ready |
| `cli/init/templates.ts:72-90` | `getThemeSelectorPattern()` for framework-specific selectors | ✅ Reusable |
| `types.ts:756` | `ResolvedTokensConfig.themes: ResolvedThemesConfig` already nested | ✅ Ready |

### Critical Discovery: Two Different Theme Schemas

The codebase has **two conflicting theme config structures**:

**1. types.ts - ThemesConfig (simpler)**

```typescript
interface ThemesConfig {
  autoDetect?: boolean;
  default?: string;
  ignoreModes?: string[];
  selectorPattern?: ThemeSelectorPattern;
}
```

**2. schema.ts - themesConfigSchema (more complete)**

```typescript
themesConfigSchema = z.object({
  enabled: z.boolean().default(true),
  defaultMode: z.enum(['light', 'dark', 'system']).default('light'),
  modes: z.record(z.string(), themeModeSchema), // ← This is closer to what we need!
  outputFileName: z.string().default('themes'),
  colorScheme: z.object({ light, dark }),
});

themeModeSchema = z.object({
  selector: z.string(),
  mediaQuery: z.string().optional(),
  dataAttribute: z.string().optional(),
  cssVariables: z.boolean().default(true),
  generateSeparateFiles: z.boolean().default(false),
  prefix: z.string().optional(),
});
```

**Resolution**: The `themeModeSchema` in schema.ts is closer to what we need. Extend it with `suffix` and `outputFiles`, then align types.ts.

### Discovered: Template Generator Also Hardcoded

`generateBuildTokensScript()` in `templates.ts` (lines 1130-1250) generates new project scripts with the same hardcoded THEMES pattern:

```javascript
// Generated by templates.ts - also hardcoded!
const THEMES = {
  light: { suffix: null, selector: ':root', ... },
  dark: { suffix: '-dark', selector: '[data-dsai-theme="dark"]', ... },
};
```

**Fix**: Update `generateBuildTokensScript()` to either:

1. Generate a minimal script that calls tools package, OR
2. Read theme config and inject dynamic definitions

### Config Already Flows Through System

The config resolution path is already set up:

```
dsai.config.mjs 
  → loadConfig() 
    → resolveConfig() 
      → resolveTokensConfig() 
        → resolveThemesConfig() ← Themes resolved here
          → ResolvedTokensConfig.themes ← Available here
```

The `buildTokens()` just needs to **read and use** `config.tokens.themes`.

### Patterns from Playground to Preserve

```javascript
// File discovery pattern - keep this logic
function getThemeFiles(theme) {
  if (config.isDefault) {
    // All files EXCEPT those with theme suffixes
    const themeSuffixes = Object.values(THEMES)
      .filter((t) => t.suffix)
      .map((t) => `**/*${t.suffix}.json`);
    return globSync('src/collections/**/*.json', {
      ignore: themeSuffixes.map((s) => `src/collections/${s}`),
    });
  }
  // Files with their specific suffix
  return globSync(`src/collections/**/*${config.suffix}.json`);
}
```

### Framework Selector Presets (Future Enhancement)

Consider adding selector presets for common frameworks:

```javascript
themes: {
  selectorPreset: 'tailwind', // Uses class="dark"
  // OR
  selectorPreset: 'bootstrap', // Uses data-bs-theme="dark"
  // OR
  selectorPreset: 'dsai', // Uses data-dsai-theme="dark" (default)
}
```

### Edge Cases to Handle

| Scenario | Expected Behavior |
|----------|-------------------|
| Theme defined, no files found | Warning: "No files found for theme 'pro'" |
| Files exist, theme not defined (autoDetect: false) | Warning: "Found files with suffix '-custom' but no theme defined" |
| Duplicate selector | Error: "Selector ':root' used by multiple themes: light, default" |
| Invalid suffix pattern | Error: "Suffix pattern must contain {mode} placeholder" |
| Empty definitions object | Use autoDetect with default patterns |
| Theme name case mismatch | Use case-insensitive matching by default |

---

## ✅ Definition of Done

- [ ] All acceptance criteria met
- [ ] Code reviewed and approved
- [ ] Types and schema reconciled
- [ ] Tests passing (unit + integration)
- [ ] Playground migrated and working
- [ ] CLI `dsai tokens:build` uses themes from config
- [ ] Documentation updated with examples
- [ ] No hardcoded theme values in consumer apps
- [ ] Backward compatible with existing configs
