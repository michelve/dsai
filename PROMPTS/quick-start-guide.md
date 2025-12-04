# 🚀 Quick Start: Data-Driven Utils Scaffold Generation

## From Component Scanning → Enterprise-Grade Utils Layer

**Your Goal:** Scan `packages/@dsai/react/src/components`, extract real utilities, fill enterprise gaps, auto-generate scaffold.

---

## 📋 Prerequisites

Ensure you have:

- ✅ Node.js 18+ with TypeScript
- ✅ pnpm workspace set up
- ✅ Component files in `packages/@dsai/react/src/components`
- ✅ Write access to `packages/@dsai/react/src/`

---

## 🎯 3-Step Quick Start

### Step 1: Scan Your Components (2 minutes)

**Run the analysis script:**

```bash
chmod +x scripts/scan-utils-usage.sh
./scripts/scan-utils-usage.sh packages/@dsai/react/src/components
```

note: move script to tools dir into its own dir , all tools and scripts goe sin tools/ dir

**What you'll get:**

- Utility inventory with usage counts
- Grouped by category (string, array, types, keyboard, a11y, etc.)
- Top 10 most-used utilities highlighted

**Example output:**

```
📊 Summary:
─────────────────────────────────
Usage by Category:
  string               5 utilities
  array                4 utilities
  types                3 utilities
  keyboard             2 utilities
  a11y                 2 utilities

Top 10 Most Used Utilities:
  12 usages: cn (string)
   7 usages: normalizeClassName (string)
   6 usages: ensureArray (array)
   5 usages: isValidColor (types)
```

**Output saved to:** `/tmp/utils-inventory.txt`

---

### Step 2: Identify Enterprise Gaps (5 minutes)

**Compare discovered utilities against enterprise baseline:**

| Category | Discovered | Enterprise Baseline | Gap                                          |
| -------- | ---------- | ------------------- | -------------------------------------------- |
| string   | 5          | 6–8                 | +2: `toCamelCase`, `toKebabCase`             |
| array    | 4          | 6–8                 | +3: `partition`, `flatten`, `uniq`           |
| object   | 0          | 5–6                 | +5: `mergeDeep`, `pick`, `omit`, `deepEqual` |
| number   | 0          | 3–4                 | +3: `clamp`, `inRange`, `roundToStep`        |
| types    | 3          | 4–5                 | +1: `assertDefined`                          |
| keyboard | 2          | 4–5                 | +2: `isNavigationKey`, `isActivationKey`     |
| a11y     | 2          | 6–8                 | +4: ARIA constants, roving tab index helpers |
| assert   | 0          | 2–3                 | +2: `invariant`, `assert`                    |
| memo     | 0          | 1–2                 | +1: `memoize`                                |

**Decision Matrix:**

```
┌─────────────────────────────────┐
│ REAL (2+ usages)               │  Implement immediately
├─────────────────────────────────┤
│ REAL (1 usage)                 │  Implement if simple
├─────────────────────────────────┤
│ ENTERPRISE (common patterns)   │  Add for scalability
├─────────────────────────────────┤
│ NICE-TO-HAVE                   │  Don't defer
└─────────────────────────────────┘
```

---

### Step 3: Generate Scaffold (Auto, 1 minute)

**Create the auto-generation config:**

**File: `scripts/utils-config.json`**

```json
{
  "componentDir": "packages/@dsai/react/src/components",
  "outputDir": "packages/@dsai/react/src/utils",
  "categories": {
    "string": {
      "description": "String manipulation utilities",
      "discovered": ["cn", "normalizeClassName", "slugify", "capitalize"],
      "enterprise": ["toCamelCase", "toKebabCase", "truncate", "trim"]
    },
    "array": {
      "description": "Array manipulation utilities",
      "discovered": ["ensureArray", "uniqueBy", "chunk"],
      "enterprise": ["partition", "flatten", "compact"]
    },
    "object": {
      "description": "Object manipulation utilities",
      "discovered": [],
      "enterprise": ["mergeDeep", "pick", "omit", "deepEqual", "get"]
    },
    "types": {
      "description": "Type guards and validators",
      "discovered": ["isValidColor", "isValidEmail"],
      "enterprise": ["isNonEmpty", "assertDefined", "isPlainObject"]
    },
    "keyboard": {
      "description": "Keyboard event handling",
      "discovered": ["constants", "isEnterKey"],
      "enterprise": ["isNavigationKey", "isActivationKey", "isModifierKey"]
    },
    "a11y": {
      "description": "Accessibility utilities (WCAG 2.1)",
      "discovered": ["roving-tab-index", "createAriaAttributes"],
      "enterprise": ["aria-constants", "isValidRole", "normalizeAriaProps"]
    },
    "number": {
      "description": "Number utilities",
      "discovered": [],
      "enterprise": ["clamp", "inRange", "roundToStep"]
    },
    "assert": {
      "description": "Runtime assertions & invariants",
      "discovered": [],
      "enterprise": ["invariant", "assert", "assertDefined"]
    },
    "memo": {
      "description": "Memoization utilities",
      "discovered": [],
      "enterprise": ["memoize"]
    }
  },
  "packageConfig": {
    "sideEffects": false,
    "exports": {
      ".": "./dist/index.js",
      "./string": "./dist/string/index.js",
      "./array": "./dist/array/index.js",
      "./object": "./dist/object/index.js",
      "./types": "./dist/types/index.js",
      "./keyboard": "./dist/keyboard/index.js",
      "./a11y": "./dist/a11y/index.js",
      "./number": "./dist/number/index.js",
      "./assert": "./dist/assert/index.js",
      "./memo": "./dist/memo/index.js"
    }
  }
}
```

**Run generation:**

```bash
npx ts-node scripts/generate-utils-scaffold.ts scripts/utils-config.json
```

**Output:**

```
✅ Scaffold generated successfully!

📊 Statistics:
─────────────────────────────
Total utilities: 37
  Real (from components): 14
  Enterprise (gaps): 23

Folder structure created:
  ✓ string/ (9 files)
  ✓ array/ (7 files)
  ✓ object/ (5 files)
  ✓ types/ (5 files)
  ✓ keyboard/ (5 files)
  ✓ a11y/ (6 files)
  ✓ number/ (4 files)
  ✓ assert/ (3 files)
  ✓ memo/ (2 files)

Package config:
  ✓ package.json (sideEffects: false, exports configured)
  ✓ tsconfig.json
  ✓ index.ts (barrel exports)

📁 Location: packages/@dsai/react/src/utils/

🚀 Next steps:
  1. Review generated skeletons
  2. Implement functions (use templates as guide)
  3. Add tests for each utility
  4. Update component imports
  5. Run type-checking (pnpm typecheck)
```

---

## 📁 What Gets Generated

```
packages/@dsai/react/src/utils/
├── package.json                    # sideEffects: false, exports
├── tsconfig.json
├── index.ts                        # Barrel export (all categories)
│
├── string/
│   ├── index.ts
│   ├── cn.ts                       # REAL (impl from existing code)
│   ├── normalize-class-name.ts     # REAL
│   ├── slugify.ts                  # REAL
│   ├── capitalize.ts               # REAL
│   ├── to-camel-case.ts            # ENTERPRISE (skeleton)
│   ├── to-kebab-case.ts            # ENTERPRISE (skeleton)
│   ├── truncate.ts                 # ENTERPRISE (skeleton)
│   └── __tests__/
│
├── array/
│   ├── index.ts
│   ├── ensure-array.ts             # REAL
│   ├── unique-by.ts                # REAL
│   ├── chunk.ts                    # REAL
│   ├── partition.ts                # ENTERPRISE (skeleton)
│   ├── flatten.ts                  # ENTERPRISE (skeleton)
│   ├── compact.ts                  # ENTERPRISE (skeleton)
│   └── __tests__/
│
├── object/
│   ├── index.ts
│   ├── merge-deep.ts               # ENTERPRISE
│   ├── pick.ts                     # ENTERPRISE
│   ├── omit.ts                     # ENTERPRISE
│   ├── deep-equal.ts               # ENTERPRISE
│   ├── get.ts                      # ENTERPRISE
│   └── __tests__/
│
├── types/
│   ├── index.ts
│   ├── is-valid-color.ts           # REAL
│   ├── is-valid-email.ts           # REAL
│   ├── is-non-empty.ts             # ENTERPRISE
│   ├── assert-defined.ts           # ENTERPRISE
│   └── __tests__/
│
├── keyboard/
│   ├── index.ts
│   ├── constants.ts                # REAL
│   ├── is-enter-key.ts             # REAL
│   ├── is-navigation-key.ts        # ENTERPRISE
│   ├── is-activation-key.ts        # ENTERPRISE
│   └── __tests__/
│
├── a11y/
│   ├── index.ts
│   ├── roving-tab-index.ts         # REAL
│   ├── create-aria-attributes.ts   # REAL
│   ├── aria-constants.ts           # ENTERPRISE
│   ├── is-valid-role.ts            # ENTERPRISE
│   ├── normalize-aria-props.ts     # ENTERPRISE
│   └── __tests__/
│
├── number/
│   ├── index.ts
│   ├── clamp.ts                    # ENTERPRISE
│   ├── in-range.ts                 # ENTERPRISE
│   ├── round-to-step.ts            # ENTERPRISE
│   └── __tests__/
│
├── assert/
│   ├── index.ts
│   ├── invariant.ts                # ENTERPRISE
│   ├── assert.ts                   # ENTERPRISE
│   └── __tests__/
│
└── memo/
    ├── index.ts
    ├── memoize.ts                  # ENTERPRISE
    └── __tests__/
```

---

## 🔨 Implementation Strategy

### For REAL utilities (extracted from components):

Copy working implementation from component file + enhance:

```typescript
// From component: Button.tsx
// Already working, extract and test:

export function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

### For ENTERPRISE utilities (skeletons):

Use these templates:

**Template: `string/to-camel-case.ts`**

```typescript
/**
 * Convert a string to camelCase.
 *
 * @example
 * toCamelCase('hello-world') // 'helloWorld'
 * toCamelCase('hello_world') // 'helloWorld'
 * toCamelCase('hello world') // 'helloWorld'
 */
export function toCamelCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word, idx) =>
      idx === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}
```

**Template: `object/merge-deep.ts`**

```typescript
/**
 * Recursively merge objects (non-mutating).
 * Later objects override earlier ones.
 */
export function mergeDeep<T extends Record<string, any>>(...objects: (T | undefined)[]): T {
  return objects.reduce((result, obj) => {
    if (!obj) return result;

    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

      const sourceValue = result[key];
      const targetValue = obj[key];

      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        result[key] = mergeDeep(sourceValue, targetValue);
      } else {
        result[key] = targetValue;
      }
    }

    return result;
  }, {} as T);
}

function isPlainObject(value: unknown): value is Record<string, any> {
  return (
    typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype
  );
}
```

**Template: `assert/invariant.ts`**

```typescript
/**
 * Assert a condition. Throw if falsy.
 * Use for runtime invariant checking.
 */
export function invariant(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || '[invariant] Condition failed');
  }
}

/**
 * Development-only assertion (removed in production).
 */
export function invariantDev(condition: unknown, message?: string): asserts condition {
  if (process.env.NODE_ENV === 'development') {
    invariant(condition, message);
  }
}
```

---

## ✅ Validation Checklist

Before committing your utils:

```
[ ] All utilities have JSDoc with @example
[ ] No TypeScript `any` types without justification
[ ] All utilities are pure functions (no side effects)
[ ] package.json has sideEffects: false
[ ] Barrel exports (index.ts) in each category
[ ] Tests exist for each utility (80%+ coverage)
[ ] Type definitions are explicit and stable
[ ] ESM output configured (not CommonJS)
[ ] Tree-shaking markers added where needed
[ ] ARIA utilities follow W3C APG standards
[ ] Keyboard utilities tested with actual key codes
[ ] Accessibility utilities pass Axe scanner
```

---

## 📊 What You'll Have After This

| Aspect              | Coverage                                                               |
| ------------------- | ---------------------------------------------------------------------- |
| **Total Utils**     | 37 (14 real + 23 enterprise)                                           |
| **Categories**      | 9 (string, array, object, types, keyboard, a11y, number, assert, memo) |
| **Package Quality** | Enterprise-grade (tree-shakable, typed, tested)                        |
| **Accessibility**   | WCAG 2.1 AA compliant                                                  |
| **Bundle Impact**   | Minimal (sideEffects: false, granular exports)                         |
| **Scalability**     | Ready for 50+ component library                                        |
| **Maintenance**     | Clear, documented, organized                                           |

---

## 🚨 Common Issues & Fixes

### Issue 1: Component imports still use old relative paths

**Before:**

```typescript
import { cn } from '../utils/cn';
```

**After:**

```typescript
import { cn } from '@dsai/react/utils';
// or granular:
import { cn } from '@dsai/react/utils/string';
```

**Update paths in tsconfig.json:**

```json
{
  "compilerOptions": {
    "paths": {
      "@dsai/react/utils": ["./packages/@dsai/react/src/utils"],
      "@dsai/react/utils/*": ["./packages/@dsai/react/src/utils/*"]
    }
  }
}
```

### Issue 2: Tree-shaking not working

**Check package.json:**

```json
{
  "sideEffects": false, // ← MUST be false
  "type": "module", // ← MUST be ESM
  "exports": {
    // ← MUST specify granular exports
    "./string": "./dist/string/index.js"
  }
}
```

### Issue 3: Type errors in generated utilities

**Run type check:**

```bash
pnpm typecheck --filter @dsai/react
```

**Fix any errors** in your implementations using templates as guide.

---

## 📞 Support

**Questions?** Reference these documents:

1. **`utils-spec-analysis.md`** — Why these standards matter
2. **`data-driven-utils-gen.md`** — Deep dive into AST analysis
3. **`scan-utils-usage.sh`** — Scanning script
4. **This guide** — Quick reference

---

## 🎯 Success Metrics

After implementation:

```
✅ All component imports resolve from @dsai/react/utils
✅ Bundle size reduced (granular imports)
✅ Type coverage 100%
✅ Test coverage 80%+
✅ No circular dependencies
✅ WCAG 2.1 AA compliant (a11y utilities)
✅ Zero TypeScript `any` types (except justified)
✅ ESM + type definitions auto-generated
✅ Ready for design system scale (10x components)
```

---

**Ready to start? Run Step 1 now:**

```bash
chmod +x scripts/scan-utils-usage.sh
./scripts/scan-utils-usage.sh
```

Let's build an enterprise-grade utilities layer! 🚀
