# Token Changelog Generation

> **Automatic changelog generation for design token changes**
>
> Detects additions, removals, modifications, and breaking changes in design tokens, generating human-readable Markdown changelogs with before/after values.

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
- [CLI Usage](#cli-usage)
- [Change Types](#change-types)
- [Configuration](#configuration)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Integration](#integration)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Token Changelog Generation system provides automated documentation of design token changes between versions. It analyzes token collections to identify:

- **Added tokens** - New tokens introduced
- **Removed tokens** - Tokens deleted (breaking change)
- **Modified tokens** - Existing tokens with changed values
- **Type changes** - Tokens with altered types (breaking change)
- **Deprecated tokens** - Tokens marked for future removal

The system generates professional Markdown changelogs that can be committed to version control, published in release notes, or used for team communication.

### Benefits

✅ **Automatic Documentation** - No manual changelog maintenance  
✅ **Breaking Change Detection** - Identifies removals and type changes  
✅ **Value Tracking** - Shows before/after for modifications  
✅ **Format Support** - Handles both DTCG and legacy token formats  
✅ **Nested Structures** - Works with deeply nested token collections  
✅ **Markdown Output** - Professional, readable format

---

## Quick Start

### Programmatic Usage

```typescript
import { diffTokens, generateChangelog, writeChangelog } from '@dsai-io/tools/tokens';

// Load your token files
const oldTokens = JSON.parse(fs.readFileSync('old-tokens.json', 'utf-8'));
const newTokens = JSON.parse(fs.readFileSync('new-tokens.json', 'utf-8'));

// Compute diff
const diff = diffTokens(oldTokens, newTokens);

// Generate changelog
const result = generateChangelog(diff, {
  version: '1.2.0',
  date: new Date(),
  includeDescriptions: true,
  includeValues: true,
});

// Write to file
await writeChangelog(result.content, 'TOKENS-CHANGELOG.md');
```

### CLI Usage

```bash
# Basic usage
npx dsai-tools tokens changelog old-tokens.json new-tokens.json

# With version
npx dsai-tools tokens changelog old-tokens.json new-tokens.json --version 1.2.0

# Custom output path
npx dsai-tools tokens changelog old-tokens.json new-tokens.json --output CHANGELOG.md
```

---

## How It Works

### 1. Token Flattening

The system recursively traverses nested token collections and flattens them into path-value pairs:

```typescript
// Input:
{
  color: {
    brand: {
      primary: { $value: '#0000ff', $type: 'color' }
    }
  }
}

// Flattened:
'color.brand.primary' → { value: '#0000ff', type: 'color' }
```

### 2. Diff Computation

The flattened tokens are compared to detect changes:

```
Old Tokens          New Tokens          Change Type
────────────────────────────────────────────────────
token.a             token.a             No change
token.b             -                   Removed ⚠️
-                   token.c             Added
token.d (#fff)      token.d (#000)      Modified
token.e (color)     token.e (dimension) Type changed ⚠️
```

### 3. Changelog Generation

Changes are grouped by type and formatted as Markdown:

```markdown
## [1.2.0] - 2024-01-15

⚠️  **This release contains breaking changes**

**Total changes:** 5

### Breaking Changes

- `token.b` ⚠️ **BREAKING**
- `token.e` ⚠️ **BREAKING**
  - Type: `color` → `dimension`
  - Before: `#ffffff`
  - After: `16px`

### Added

- `token.c`

### Changed

- `token.d`
  - Before: `#ffffff`
  - After: `#000000`
```

---

## API Reference

### diffTokens(oldTokens, newTokens)

Compares two token collections and returns detailed differences.

**Parameters:**

- `oldTokens: TokenCollection` - Previous version of tokens
- `newTokens: TokenCollection` - New version of tokens

**Returns:** `TokenDiff`

```typescript
interface TokenDiff {
  added: TokenChange[];           // Newly added tokens
  removed: TokenChange[];          // Removed tokens (breaking)
  modified: TokenChange[];         // Value-changed tokens
  typeChanged: TokenChange[];      // Type-changed tokens (breaking)
  deprecated: TokenChange[];       // Newly deprecated tokens
  totalChanges: number;            // Total count
  hasBreaking: boolean;            // Whether any breaking changes exist
}
```

**Example:**

```typescript
const diff = diffTokens(oldTokens, newTokens);

console.log(`Total changes: ${diff.totalChanges}`);
console.log(`Breaking changes: ${diff.hasBreaking ? 'Yes' : 'No'}`);
console.log(`Added: ${diff.added.length}`);
console.log(`Removed: ${diff.removed.length}`);
```

### generateChangelog(diff, options)

Generates Markdown changelog from a diff.

**Parameters:**

- `diff: TokenDiff` - Token diff from `diffTokens()`
- `options?: ChangelogOptions` - Customization options

**Returns:** `ChangelogResult`

```typescript
interface ChangelogOptions {
  version?: string;              // Version number (default: 'Unreleased')
  date?: Date;                   // Release date (default: today)
  header?: string;               // Custom header text
  includeDescriptions?: boolean; // Include token descriptions (default: true)
  includeValues?: boolean;       // Include before/after values (default: true)
  maxValueLength?: number;       // Max value display length (default: 100)
  groupByType?: boolean;         // Group by change type (default: true)
}

interface ChangelogResult {
  content: string;    // Generated Markdown
  entryCount: number; // Number of changes
  hasBreaking: boolean; // Whether breaking changes exist
}
```

**Example:**

```typescript
const result = generateChangelog(diff, {
  version: '2.0.0',
  date: new Date('2024-01-15'),
  includeDescriptions: true,
  includeValues: true,
  maxValueLength: 80,
});

console.log(result.content);
```

### writeChangelog(content, filePath)

Writes changelog to file (prepends to existing file).

**Parameters:**

- `content: string` - Markdown content to write
- `filePath: string` - Path to changelog file

**Returns:** `Promise<boolean>` - Whether write was successful

**Behavior:**

- If file doesn't exist: Creates with "# Changelog" header
- If file exists: Prepends new content after header
- Maintains chronological order (newest first)

**Example:**

```typescript
const success = await writeChangelog(result.content, 'TOKENS-CHANGELOG.md');
if (success) {
  console.log('Changelog updated!');
}
```

### generateAndWriteChangelog(diff, filePath, options)

Convenience function that generates and writes in one step.

**Parameters:**

- `diff: TokenDiff` - Token diff from `diffTokens()`
- `filePath: string` - Path to changelog file
- `options?: ChangelogOptions` - Customization options

**Returns:** `Promise<ChangelogResult & { written: boolean }>`

**Example:**

```typescript
const result = await generateAndWriteChangelog(
  diff,
  'TOKENS-CHANGELOG.md',
  { version: '1.5.0' }
);

console.log(`Changes: ${result.entryCount}`);
console.log(`Written: ${result.written}`);
```

### Helper Functions

#### summarizeDiff(diff)

Returns a plain text summary of changes.

```typescript
const summary = summarizeDiff(diff);
// Output:
// Total changes: 5
// ⚠️  Contains breaking changes
// Added: 2
// Removed: 1 (breaking)
// Modified: 2
```

#### filterDiff(diff, types)

Filters diff to specific change types.

```typescript
const breaking = filterDiff(diff, ['removed', 'type-changed']);
const additive = filterDiff(diff, ['added', 'modified']);
```

#### getBreakingChanges(diff)

Returns only breaking changes.

```typescript
const breaking = getBreakingChanges(diff);
// Returns: [...diff.removed, ...diff.typeChanged]
```

---

## CLI Usage

### Command Structure

```bash
npx dsai-tools tokens changelog <old-tokens> <new-tokens> [options]
```

### Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--output` | `-o` | Output file path | `TOKENS-CHANGELOG.md` |
| `--version` | `-v` | Version number | `Unreleased` |
| `--no-descriptions` | | Exclude token descriptions | Include |
| `--no-values` | | Exclude before/after values | Include |
| `--max-value-length` | | Max value display length | `100` |

### Examples

```bash
# Basic changelog generation
npx dsai-tools tokens changelog old.json new.json

# With version number
npx dsai-tools tokens changelog old.json new.json --version 1.2.0

# Custom output file
npx dsai-tools tokens changelog old.json new.json --output CHANGES.md

# Compact format (no values)
npx dsai-tools tokens changelog old.json new.json --no-values

# Short values only
npx dsai-tools tokens changelog old.json new.json --max-value-length 50
```

### Output Example

```
📝 Generating token changelog...

📖 Reading old tokens: old-tokens.json
📖 Reading new tokens: new-tokens.json
🔍 Computing differences...

📊 Summary:
  • Total changes: 8
  • Added: 3
  • Removed: 1 ⚠️
  • Modified: 3
  • Type changed: 1 ⚠️

⚠️  Warning: This release contains breaking changes!

📄 Writing changelog to: TOKENS-CHANGELOG.md
✅ Changelog generated successfully!
```

---

## Change Types

### Added Tokens

New tokens introduced in the new version.

**Breaking:** No  
**Display:** Listed in "Added" section

```markdown
### Added

- `color.brand.tertiary`
  - Primary brand accent color
```

### Removed Tokens

Tokens that existed in the old version but are missing in the new version.

**Breaking:** Yes  
**Impact:** Consumers using these tokens will experience errors  
**Display:** Listed in "Breaking Changes" section with warning

```markdown
### Breaking Changes

- `color.deprecated.old` ⚠️ **BREAKING**
  - This token has been removed
```

### Modified Tokens

Tokens with changed values but same type.

**Breaking:** No (unless semantic meaning changes)  
**Display:** Listed in "Changed" section with before/after

```markdown
### Changed

- `color.brand.primary`
  - Primary brand color
  - Before: `#0000ff`
  - After: `#0066cc`
```

### Type-Changed Tokens

Tokens with changed types.

**Breaking:** Yes  
**Impact:** Type changes can cause runtime errors or incorrect behavior  
**Display:** Listed in "Breaking Changes" with type transition

```markdown
### Breaking Changes

- `size.large` ⚠️ **BREAKING**
  - Type: `dimension` → `number`
  - Before: `16px`
  - After: `16`
```

### Deprecated Tokens

Tokens marked with `$deprecated: true` or in `$extensions.deprecated`.

**Breaking:** No  
**Impact:** Warning for future removal  
**Display:** Listed in "Deprecated" section

```markdown
### Deprecated

- `color.legacy.old`
  - Use `color.brand.primary` instead
```

---

## Configuration

### Changelog Options

#### version

```typescript
{ version: '1.2.0' }
```

Specifies the version number for the changelog entry. If omitted, uses "Unreleased".

#### date

```typescript
{ date: new Date('2024-01-15') }
```

Specifies the release date. Defaults to today. Formatted as `YYYY-MM-DD`.

#### header

```typescript
{ header: '## Release 1.2.0 - Major Update' }
```

Custom header text. Overrides default `## [version] - date` format.

#### includeDescriptions

```typescript
{ includeDescriptions: true }
```

Whether to include token descriptions from `$description`, `description`, or `comment` fields.

#### includeValues

```typescript
{ includeValues: true }
```

Whether to include before/after values for modified tokens.

#### maxValueLength

```typescript
{ maxValueLength: 80 }
```

Maximum length for displayed values. Longer values are truncated with `...`.

#### groupByType

```typescript
{ groupByType: true }
```

Whether to group changes by type (Breaking/Added/Changed/Deprecated) or show flat list.

---

## Best Practices

### 1. Version Control Integration

Commit changelogs alongside token changes:

```bash
git add tokens/ TOKENS-CHANGELOG.md
git commit -m "feat: Update brand colors (v1.2.0)"
```

### 2. Semantic Versioning

Follow semver principles:

- **Major (2.0.0):** Breaking changes (removed tokens, type changes)
- **Minor (1.1.0):** Added tokens
- **Patch (1.0.1):** Modified token values

### 3. Review Breaking Changes

Always review breaking changes before release:

```typescript
const breaking = getBreakingChanges(diff);
if (breaking.length > 0) {
  console.warn('⚠️  Breaking changes detected!');
  for (const change of breaking) {
    console.warn(`  - ${change.path}`);
  }
}
```

### 4. Detailed Descriptions

Include descriptions in your tokens for better changelogs:

```json
{
  "color": {
    "brand": {
      "primary": {
        "$value": "#0066cc",
        "$type": "color",
        "$description": "Primary brand color for buttons and links"
      }
    }
  }
}
```

### 5. Pre-release Testing

Generate changelogs on feature branches to review impact:

```bash
# On feature branch
npx dsai-tools tokens changelog main-tokens.json branch-tokens.json --output PREVIEW.md
```

### 6. CI/CD Integration

Automate changelog generation in your build pipeline:

```yaml
# .github/workflows/tokens.yml
- name: Generate Changelog
  run: |
    npx dsai-tools tokens changelog \
      old-tokens.json \
      new-tokens.json \
      --version ${{ github.ref_name }}
```

---

## Examples

### Example 1: Simple Color Change

**Old Tokens:**

```json
{
  "color": {
    "primary": { "$value": "#0000ff", "$type": "color" }
  }
}
```

**New Tokens:**

```json
{
  "color": {
    "primary": { "$value": "#0066cc", "$type": "color" }
  }
}
```

**Generated Changelog:**

```markdown
## [1.0.1] - 2024-01-15

**Total changes:** 1

### Changed

- `color.primary`
  - Before: `#0000ff`
  - After: `#0066cc`
```

### Example 2: Breaking Type Change

**Old Tokens:**

```json
{
  "spacing": {
    "large": { "$value": "24px", "$type": "dimension" }
  }
}
```

**New Tokens:**

```json
{
  "spacing": {
    "large": { "$value": 24, "$type": "number" }
  }
}
```

**Generated Changelog:**

```markdown
## [2.0.0] - 2024-01-15

⚠️  **This release contains breaking changes**

**Total changes:** 1

### Breaking Changes

- `spacing.large` ⚠️ **BREAKING**
  - Type: `dimension` → `number`
  - Before: `24px`
  - After: `24`
```

### Example 3: Complex Nested Structure

**Old Tokens:**

```json
{
  "theme": {
    "light": {
      "color": {
        "background": { "$value": "#ffffff", "$type": "color" },
        "text": { "$value": "#000000", "$type": "color" }
      }
    }
  }
}
```

**New Tokens:**

```json
{
  "theme": {
    "light": {
      "color": {
        "background": { "$value": "#fafafa", "$type": "color" },
        "text": { "$value": "#000000", "$type": "color" },
        "border": { "$value": "#e0e0e0", "$type": "color" }
      }
    }
  }
}
```

**Generated Changelog:**

```markdown
## [1.1.0] - 2024-01-15

**Total changes:** 2

### Added

- `theme.light.color.border`

### Changed

- `theme.light.color.background`
  - Before: `#ffffff`
  - After: `#fafafa`
```

---

## Integration

### CI/CD Pipeline

#### GitHub Actions

```yaml
name: Token Changelog

on:
  pull_request:
    paths:
      - 'tokens/**'

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Get base tokens
        run: |
          git show ${{ github.base_ref }}:tokens/tokens.json > old-tokens.json
      
      - name: Generate changelog preview
        run: |
          npx dsai-tools tokens changelog \
            old-tokens.json \
            tokens/tokens.json \
            --output PREVIEW.md
      
      - name: Comment on PR
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const changelog = fs.readFileSync('PREVIEW.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.name,
              body: `## Token Changes\n\n${changelog}`
            });
```

#### Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/bash

if git diff --cached --name-only | grep -q "^tokens/"; then
  echo "Generating token changelog..."
  npx dsai-tools tokens changelog \
    old-tokens.json \
    tokens/tokens.json
  
  if [ $? -eq 0 ]; then
    git add TOKENS-CHANGELOG.md
  fi
fi
```

### npm Scripts

```json
{
  "scripts": {
    "changelog": "dsai-tools tokens changelog old-tokens.json tokens/tokens.json",
    "changelog:preview": "dsai-tools tokens changelog old-tokens.json tokens/tokens.json --output PREVIEW.md",
    "changelog:release": "dsai-tools tokens changelog old-tokens.json tokens/tokens.json --version $(node -p \"require('./package.json').version\")"
  }
}
```

### Programmatic Integration

```typescript
import { diffTokens, generateChangelog, getBreakingChanges } from '@dsai-io/tools/tokens';

async function updateTokensWithChangelog() {
  // Load tokens
  const oldTokens = await loadTokens('old-tokens.json');
  const newTokens = await loadTokens('new-tokens.json');
  
  // Compute diff
  const diff = diffTokens(oldTokens, newTokens);
  
  // Check for breaking changes
  const breaking = getBreakingChanges(diff);
  if (breaking.length > 0) {
    console.error('⚠️  Breaking changes detected:');
    for (const change of breaking) {
      console.error(`  - ${change.path}`);
    }
    
    // Prompt for confirmation
    const confirmed = await confirm('Continue with breaking changes?');
    if (!confirmed) {
      process.exit(1);
    }
  }
  
  // Generate changelog
  const result = generateChangelog(diff, {
    version: await getNextVersion(breaking.length > 0),
    includeDescriptions: true,
    includeValues: true,
  });
  
  // Write changelog
  await writeChangelog(result.content, 'TOKENS-CHANGELOG.md');
  
  console.log(`✅ Changelog generated: ${result.entryCount} changes`);
}
```

---

## Troubleshooting

### No changes detected

**Issue:** `generateChangelog` returns 0 changes despite visible differences.

**Causes:**

1. Token values are identical
2. Only metadata changed (descriptions, comments)
3. Whitespace/formatting differences

**Solution:**

```typescript
// Debug diff output
const diff = diffTokens(oldTokens, newTokens);
console.log('Added:', diff.added.length);
console.log('Removed:', diff.removed.length);
console.log('Modified:', diff.modified.length);

// Check raw values
console.log('Old:', JSON.stringify(oldTokens, null, 2));
console.log('New:', JSON.stringify(newTokens, null, 2));
```

### Type changes not detected

**Issue:** Type changes showing as modifications instead of breaking changes.

**Cause:** One or both tokens missing `$type` or `type` field.

**Solution:**

```json
{
  "token": {
    "$value": "#0000ff",
    "$type": "color"  // ← Ensure type is present
  }
}
```

### Incorrect breaking change flag

**Issue:** Breaking changes reported incorrectly.

**Cause:**

- Removed tokens always breaking
- Type changes always breaking
- Value changes never breaking (unless semantic)

**Solution:**

```typescript
// Review breaking changes
const breaking = getBreakingChanges(diff);
for (const change of breaking) {
  console.log(`${change.path}: ${change.type}`);
}
```

### File write failures

**Issue:** `writeChangelog` returns false.

**Causes:**

1. Insufficient permissions
2. Directory doesn't exist
3. File locked by another process

**Solution:**

```typescript
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

const outputPath = 'docs/CHANGELOG.md';
await mkdir(dirname(outputPath), { recursive: true });
const success = await writeChangelog(content, outputPath);
```

### Values truncated unexpectedly

**Issue:** Long values truncated too aggressively.

**Solution:**

```typescript
generateChangelog(diff, {
  maxValueLength: 200  // Increase limit
});
```

---

## Related Documentation

- [Token Validation](./TOKEN-VALIDATION.md) - Schema validation for tokens
- [Token Transform](./TOKEN-TRANSFORM.md) - Token format conversion
- [Incremental Build](./INCREMENTAL-BUILD.md) - Incremental build system
- [Token Pipeline](./TOKEN-PIPELINE.md) - Complete token workflow

---

**Last Updated:** 2024-01-15  
**Version:** 1.0.0  
**Author:** DSAi Tools Team
