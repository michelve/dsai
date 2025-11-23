# Token Validation Guide

## Overview

The DSAi token system includes comprehensive validation tools to ensure **NO TOKENS ARE LOST** during the transformation process from Figma exports to usable design tokens.

**SOURCE OF TRUTH**: `packages/@dsai/tokens/figma-exports/*.json`

## Validation Scripts

### 1. Figma Export Validator (`validate-figma-tokens.js`)

Validates the **SOURCE OF TRUTH** (Figma exports) and ensures complete transformation.

#### Features

- ✅ Validates Figma export file structure
- ✅ Checks all tokens at all nesting levels
- ✅ Validates required properties ($value, $type, $description)
- ✅ Counts tokens in source vs output files
- ✅ Detects missing tokens (in source but not in output)
- ✅ Detects extra tokens (in output but not in source)
- ✅ Calculates transformation match rate
- ✅ Supports both master file and collection files
- ✅ Interactive mode for source selection
- ⏳ TODO: Dark mode validation (when dark mode is implemented)

#### Usage

**Interactive Mode** (asks which source to use):

```bash
pnpm tokens:validate:figma
```

**Non-Interactive Mode** (use environment variable):

```bash
# Use master combined file (theme.json)
pnpm tokens:validate:figma:master
# or
FIGMA_SOURCE=master pnpm tokens:validate:figma

# Use collection files (foundation.json, typography.json, etc.)
pnpm tokens:validate:figma:collections
# or
FIGMA_SOURCE=collections pnpm tokens:validate:figma
```

**CI/CD Mode** (automatically uses theme.json):

```bash
CI=true pnpm tokens:validate:figma
```

### 2. Style Dictionary Output Validator (`validate-tokens.js`)

Validates the transformed output files after Style Dictionary processing.

#### Usage

```bash
pnpm tokens:validate
```

### 3. Complete Validation

Run both validators:

```bash
pnpm tokens:validate:all
```

## Source File Options

You have **two options** for exporting tokens from Figma:

### Option 1: Master Combined File

**File**: `theme.json`

**Contents**: All tokens in one file (foundation, typography, spacing, radius, layout, shadows)

**Pros**:

- Single file to manage
- Easier to track changes in git
- Simpler export process

**Cons**:

- Large file size (~8000+ lines)
- Harder to navigate

### Option 2: Separate Collection Files

**Files**:

- `foundation.json` - Colors, borders (214 Light + 214 Dark tokens)
- `typography.json` - Font families, sizes, weights (46 tokens)
- `spacing.json` - Spacing scale (11 tokens)
- `radius.json` - Border radius values (8 tokens)
- `layout.json` - Breakpoints, containers, grid (21 tokens)
- `shadows.json` - Shadow definitions (24 tokens)

**Pros**:

- Smaller files, easier to review
- Better git diffs
- Easier to find specific tokens

**Cons**:

- More files to manage
- Must ensure all are exported together

### Recommendation

Use **whichever works best for your workflow**. The validator supports both and will ensure nothing is lost either way.

## Validation Report

The validator provides a comprehensive report:

```
================================================================================
FIGMA TOKEN VALIDATION REPORT
================================================================================

📊 STATISTICS:
  Source tokens (Figma exports):     538
  Output tokens (transformed):       304
  Missing tokens:                    0
  Extra tokens:                      0

❌ ERRORS: 0
⚠️  WARNINGS: 0

================================================================================
✨ VALIDATION PASSED - All tokens are valid!
   Source of truth is complete and all tokens transformed correctly
================================================================================
```

### Exit Codes

- `0` - Validation passed (may have warnings)
- `1` - Validation failed with errors
- `2` - Validation failed with CRITICAL errors

### Error Severity Levels

- **CRITICAL** - Source of truth is corrupt or missing
- **HIGH** - Tokens are missing or invalid
- **NORMAL** - Minor issues found
- **WARNING** - Best practices not followed (non-blocking)

## Transformation Pipeline

```
┌─────────────────────────────────────────┐
│  Figma (Design Tool)                    │
└─────────────────┬───────────────────────┘
                  │
                  │ Export via Tokens Studio Plugin
                  ▼
┌─────────────────────────────────────────┐
│  figma-exports/*.json                   │
│  (SOURCE OF TRUTH)                      │
│  - theme.json (master) OR               │
│  - foundation.json                      │
│  - typography.json                      │
│  - spacing.json                         │
│  - radius.json                          │
│  - layout.json                          │
│  - shadows.json                         │
└─────────────────┬───────────────────────┘
                  │
                  │ pnpm tokens:transform
                  │ (transform-figma-tokens.js)
                  ▼
┌─────────────────────────────────────────┐
│  Category Files                         │
│  - color/primitive.json                 │
│  - color/neutral.json                   │
│  - color/background.json                │
│  - color/opacity.json                   │
│  - color/semantic.json                  │
│  - color/component.json                 │
│  - typography/base.json                 │
│  - spacing/base.json                    │
│  - border/color.json                    │
│  - border/radius.json                   │
│  - border/width.json                    │
│  - shadow/base.json                     │
│  - layout/breakpoints.json              │
│  - layout/containers.json               │
│  - layout/grid.json                     │
└─────────────────┬───────────────────────┘
                  │
                  │ pnpm tokens:validate
                  │ (validate-tokens.js)
                  ▼
┌─────────────────────────────────────────┐
│  ✓ Validation Report                    │
└─────────────────┬───────────────────────┘
                  │
                  │ style-dictionary build
                  ▼
┌─────────────────────────────────────────┐
│  Output Formats                         │
│  - dist/css/variables.css               │
│  - dist/js/tokens.js                    │
│  - dist/ts/tokens.ts                    │
│  - dist/scss/_variables.scss            │
│  - dist/json/tokens.json                │
└─────────────────────────────────────────┘
```

## Common Validation Issues

### Issue: Missing Tokens

**Symptom**: "X tokens found in source but MISSING in output"

**Causes**:

1. Extractor function not handling token category
2. Token path mapping incorrect
3. Token type not recognized

**Fix**:

1. Check `transform-figma-tokens.js` extractor functions
2. Verify token paths in source match expected structure
3. Add new token type to `transformType()` function

### Issue: Extra Tokens

**Symptom**: "X tokens in output but not in source (may be computed)"

**Causes**:

1. Computed tokens from Style Dictionary
2. Alias/reference tokens
3. Manual tokens in output files

**Fix**:

- Usually not an error - these may be intentional computed values
- Review output files to confirm they're expected

### Issue: Low Match Rate

**Symptom**: "Transformation match rate is X% (below 95% threshold)"

**Causes**:

1. Dark mode tokens included in count (not yet transformed)
2. Deprecated tokens still in Figma
3. Transformation logic incomplete

**Fix**:

1. Exclude dark mode from validation (TODO reminder in script)
2. Clean up Figma exports
3. Update transformation logic to handle all token types

## Best Practices

### 1. Validate Before Committing

Always run validation before committing changes:

```bash
pnpm tokens:build  # Transforms, validates, and builds
```

### 2. CI/CD Integration

Add to your CI pipeline:

```bash
# .github/workflows/validate-tokens.yml
- name: Validate Tokens
  run: |
    cd packages/@dsai/tokens
    pnpm tokens:validate:all
```

### 3. Git Hooks

Add pre-commit hook:

```bash
# .husky/pre-commit
cd packages/@dsai/tokens && pnpm tokens:validate:all
```

### 4. Regular Audits

Run comprehensive validation regularly:

```bash
# Weekly audit
pnpm tokens:validate:figma  # Interactive mode
pnpm tokens:validate        # Output validation
```

### 5. Documentation

Keep tokens documented:

- Add `$description` to all tokens in Figma
- Add SCSS variable names in `$extensions.platform.scssVariableName`
- Document token usage in Storybook

## Troubleshooting

### Validator Not Finding Files

```bash
# Check if Figma exports exist
ls packages/@dsai/tokens/figma-exports/

# Should see:
# foundation.json  layout.json  radius.json  shadows.json  spacing.json  theme.json  typography.json
```

### Transformation Fails

```bash
# Clean and rebuild
pnpm tokens:clean
pnpm tokens:build
```

### Validation Hangs

If validator hangs in interactive mode:

- Use non-interactive mode with `FIGMA_SOURCE` env var
- Check if running in CI (should auto-detect)

## Future Enhancements

### Dark Mode Support

TODO: When dark mode is implemented:

1. Update validator to check Dark mode tokens
2. Validate Dark mode transformations
3. Ensure Light/Dark token parity
4. Add dark mode specific outputs

```javascript
// Future enhancement in validate-figma-tokens.js
if (modes.includes('Dark')) {
  // Validate dark mode tokens
  // Compare Light vs Dark token counts
  // Ensure all Light tokens have Dark equivalents
}
```

### Semantic Validation

Future enhancements:

- Color contrast validation (WCAG 2.1 AA)
- Typography scale consistency
- Spacing scale ratios
- Shadow consistency

### Performance Optimization

For large token sets:

- Parallel validation
- Incremental validation (only changed files)
- Caching validation results

## Support

For issues or questions:

1. Check this documentation
2. Review validation error messages
3. Check `tools/scripts/validate-figma-tokens.js` comments
4. Create an issue in the repository

---

**Remember**: The Figma exports are the SOURCE OF TRUTH. All validation ensures nothing is lost from that source.
