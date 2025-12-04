# React Utils Prompt Pack

This folder groups the facilitation prompts that drive the React utilities initiative.

- `utils/executive-summary.md` – project overview and success criteria.
- `utils/quick-start-guide.md` – step-by-step workflow for running scans, adding gaps, and generating scaffolds.
- `utils/workflow-visual-guide.md` – visual walkthrough of the full pipeline.
- `utils/data-driven-utils-gen.md` – detailed AST and automation playbook.

## Companion Scripts

The utility consolidation pipeline consists of three scripts in `tools/scripts/react-utils/`:

### 1. Scanner – `scan-utils-usage.mjs`

Scans components to detect utility usage, inline helpers, and patterns:

```bash
node tools/scripts/react-utils/scan-utils-usage.mjs
```

**What it does:**

- Finds existing `@dsai/utils` imports
- Detects **inline helper functions** (e.g., `isSafeHref`, `isExternalUrl`)
- Identifies **duplicates** across components with source code extraction
- Detects **enterprise patterns** (className concat, ref merge, keyboard checks, etc.)
- Calculates **gaps** vs. enterprise baseline (10 categories)
- Generates **unification proposals** with parameter variations and migration steps

**Output:** `.temp/utils-inventory.json`

### 2. Generator – `generate-utils-from-analysis.mjs`

Generates unified TypeScript utility files from the scanner's unification analysis:

```bash
# Preview without creating files
node tools/scripts/react-utils/generate-utils-from-analysis.mjs --dry-run

# Generate all utilities
node tools/scripts/react-utils/generate-utils-from-analysis.mjs

# Generate specific utility
node tools/scripts/react-utils/generate-utils-from-analysis.mjs --only=isSafeHref
```

**What it does:**

- Reads unification proposals from `.temp/utils-inventory.json`
- Creates TypeScript files at `packages/@dsai/react/src/utils/{category}/{name}.ts`
- Handles **behavioral variations** via options parameters (e.g., `undefinedBehavior`)
- Generates JSDoc documentation and barrel exports

**Output:**

- Utility files at suggested paths
- Category `index.ts` barrel files
- `.temp/generated-utils.json` (migration data)

### 3. Migrator – `migrate-inline-utils.mjs`

Replaces inline functions with imports from the centralized utilities:

```bash
# Preview without modifying files
node tools/scripts/react-utils/migrate-inline-utils.mjs --dry-run

# Migrate all utilities
node tools/scripts/react-utils/migrate-inline-utils.mjs

# Migrate with backup files
node tools/scripts/react-utils/migrate-inline-utils.mjs --backup
```

**What it does:**

- Removes inline function declarations from component files
- Adds/updates import statements for centralized utilities
- Preserves existing imports (adds to existing import blocks)
- Creates `.bak` backup files when `--backup` is specified

**Output:** `.temp/migration-report.json`

---

## Full Workflow

```bash
# 1. Scan components for utilities and inline helpers
node tools/scripts/react-utils/scan-utils-usage.mjs

# 2. Review the inventory
cat .temp/utils-inventory.json | jq '.unificationAnalysis'

# 3. Generate unified utilities (dry-run first)
node tools/scripts/react-utils/generate-utils-from-analysis.mjs --dry-run
node tools/scripts/react-utils/generate-utils-from-analysis.mjs

# 4. Migrate components to use centralized utilities (dry-run first)
node tools/scripts/react-utils/migrate-inline-utils.mjs --dry-run
node tools/scripts/react-utils/migrate-inline-utils.mjs

# 5. Validate
pnpm tsc --noEmit
pnpm test
pnpm lint
```

---

## Example: Handling Edge Cases

The scanner detects behavioral differences. For example, `isSafeHref`:

| Component      | Undefined behavior |
| -------------- | ------------------ |
| Alert.tsx      | Returns `false`    |
| Card.tsx       | Returns `true`     |
| Breadcrumb.tsx | Returns `true`     |
| ListGroup.tsx  | Returns `true`     |

The generator creates a unified utility with options:

```typescript
export interface IsSafeHrefOptions {
  undefinedBehavior?: 'safe' | 'unsafe'; // default: 'safe'
}

export function isSafeHref(href: string | undefined, options: IsSafeHrefOptions = {}): boolean {
  const { undefinedBehavior = 'safe' } = options;

  if (!href || typeof href !== 'string') {
    return undefinedBehavior === 'safe';
  }

  const normalized = href.toLowerCase().trim();
  return !BLOCKED_PROTOCOLS.some((protocol) => normalized.startsWith(protocol));
}
```

The migrator updates Alert.tsx to use the stricter option:

```typescript
import { isSafeHref } from '../../utils/validation';

// Usage in Alert becomes:
isSafeHref(href, { undefinedBehavior: 'unsafe' });
```
