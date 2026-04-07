---
applyTo: "**/*"
---

# SonarQube Fix Agent — Batch {{BATCH_ID}}

You are fixing SonarQube issues in the DSAi monorepo. Your assigned batch file is at:
`sonar-issues/batches/batch-{{BATCH_ID}}.md`

## Step 1: Read your batch file

Read `sonar-issues/batches/batch-{{BATCH_ID}}.md` to get the list of files and their issues (line numbers, severity, rule ID, message).

## Step 2: Fix each file

For each file in your batch, read the source file first, then fix all listed issues. Work through files one at a time. After fixing all issues in a file, move to the next.

### Rule-specific fix instructions

Apply these fixes based on the SonarQube rule ID:

#### Complexity & Structure (CRITICAL — highest priority)

**S1541 / S3776** — Function complexity too high
- Extract helper functions to reduce cyclomatic/cognitive complexity
- Break large switch/if chains into lookup objects or maps
- Extract repeated condition blocks into named functions
- Do NOT just add `// NOSONAR` or suppress — actually reduce complexity

**S134** — Nesting depth > 3
- Extract inner blocks into separate named functions
- Use early returns to flatten nesting
- Invert conditions to reduce else branches

**S1192** — Duplicated string literal 3+ times
- Extract into a named constant at the top of the scope
- Name it descriptively (e.g., `const DEFAULT_VARIANT = 'primary'`)

#### Type Safety (MAJOR)

**S4622** — Union type has too many elements
- Extract union into a named type alias in the same file or the `.types.ts` file
- Example: `type Variant = 'primary' | 'secondary' | 'danger'`

**S4798** — Optional parameter without default value
- Add a default value: `function foo(sortable = false)` or `function foo(verbose = false)`
- Only for boolean/simple params where a sensible default exists
- If destructured: `{ sortable = false }: Props`

**S109** — Magic numbers
- Extract into a named constant: `const MAX_COLUMNS = 3`
- Place at module scope or top of function
- For timing values, use descriptive names: `const DEBOUNCE_MS = 150`

**S107** — Too many function parameters (>7)
- Group related params into an options object: `function foo(options: FooOptions)`
- Keep the existing function signature as-is if it would require changes across many call sites — in that case, use a params object type and destructure

**S3358** — Nested ternary
- Replace with if/else block, or extract into a helper function
- Or use a lookup object: `const map = { a: 1, b: 2 }; return map[key] ?? default`

**S4624** — Nested template literal
- Extract inner template into a variable first: `const inner = \`...\`; const result = \`...\${inner}...\``

**S6819** — Use semantic HTML instead of ARIA roles
- Replace `<div role="separator">` with `<hr>`
- Replace `<div role="img">` with `<img alt="...">`
- Replace `<span role="presentation">` with appropriate semantic element
- Preserve existing className, style, and other props

**S125** — Commented-out code
- Delete it entirely. It's in git history if needed.

**S6660** — If is the only statement in else block
- Convert to `else if`

**S881** — Increment inside expression
- Extract: `const id = taskIdCounter; taskIdCounter += 1;`

**S1121** — Assignment inside expression
- Extract assignment to its own statement

**S6481** — Object in Context provider value changes every render
- Wrap with `useMemo`: `const contextValue = useMemo(() => ({ ... }), [deps])`

**S4328** — Import not in dependencies
- Check if it's a devDependency that's fine, or add to package.json, or remove unused import

**S6564** — Redundant type alias for `boolean`
- Remove the alias, use `boolean` directly

**S5843** — Complex regex
- Simplify or break into multiple simpler patterns with comments

#### Code Style (MINOR — fix while you're in the file)

**S7764** — `window` instead of `globalThis`
- Replace `window.` with `globalThis.` (only in non-DOM contexts)
- In React components that reference browser APIs, `window` is fine — skip these

**S7735** — Negated condition with else
- Flip: `if (!x) { a } else { b }` → `if (x) { b } else { a }`
- If there's no else, leave it alone

**S4325** — Unnecessary type assertion
- Remove the `as Type` cast: `foo as Bar` → `foo` (when types already match)

**S1874** — Deprecated API
- `MutableRefObject` → `React.RefObject` (React 19 unified refs)

**S7741** — `typeof x !== 'undefined'` instead of `x !== undefined`
- Replace with direct comparison: `x !== undefined`
- Safe in TypeScript strict mode

**S7728** — `.forEach()` instead of `for...of`
- Replace `arr.forEach((item) => { ... })` with `for (const item of arr) { ... }`
- Careful: if using index, keep forEach or switch to `for (const [i, item] of arr.entries())`

**S6759** — Props not marked as read-only
- Add `Readonly<>` wrapper: `function Comp(props: Readonly<Props>)`
- Or if inline: `{ readonly propName: Type }`

**S7763** — Re-export pattern
- Replace `import { X } from './foo'; export { X }` with `export { X } from './foo'`

**S6594** — Use `RegExp.exec()` instead of `String.match()`
- Replace `str.match(regex)` with `regex.exec(str)` when not using global flag

**S2138** — Use `null` instead of `undefined`
- Replace explicit `undefined` assignments/comparisons with `null`
- Do NOT change function parameter defaults or optional property types

**S4157** — Default type parameter can be omitted
- Remove the redundant type arg: `Map<string, string>` → `Map<string, string>` (remove if it matches the default)

**S6606** — Use `??=` operator
- Replace `if (x === null) x = val` or `x = x ?? val` with `x ??= val`

**S7778** — Multiple `.push()` calls
- Combine: `arr.push(a); arr.push(b)` → `arr.push(a, b)`

**S6571** — String overridden in union
- Remove the specific string literal if it's already covered by `string` in the union

**S6551** — Object stringification in template
- Add explicit `.toString()` or serialize: `String(key)` or `JSON.stringify(item)`

**S7770** — `(x) => Boolean(x)` is equivalent to `Boolean`
- Replace with `Boolean` directly: `.filter(Boolean)`

**S3512** — String concatenation instead of template literal
- Replace `'a' + b` with `` `a${b}` ``

**S7749** — Invalid numeric group length
- Add underscores: `1000000` → `1_000_000`

**S7780** — Use `String.raw` for backslashes
- Replace `'\\n'` with `String.raw`\n`` where escaping is for the string, not the value

**S7781** — Regex can be simplified to string
- Replace `str.replace(/<\/svg>/g, '</svg>')` with `str.replaceAll('</svg>', '</svg>')`

**S7776** — Use Set.has() instead of Array.includes()
- Convert array to Set, use `.has()` for lookups

**S4323** — Inline union → type alias
- Extract inline union to a named type alias

**S7745** — Useless empty check before `.every()`
- Remove the `arr.length > 0 &&` guard since `.every()` returns `true` for empty arrays (check if that's the intended behavior)

**S7785** — Top-level await over promise chain
- Replace `.then().catch()` with `try { await ... } catch { ... }` at module level

**S7786** — `new Error()` too unspecific for type check
- Use `new TypeError()` for type-related errors

**S7784** — `structuredClone` over JSON.parse(JSON.stringify)
- Replace with `structuredClone(obj)`

**S7748** — Zero fraction in number
- Replace `1.0` with `1`

**S7769** — Use `Math.hypot()`
- Replace `Math.sqrt(a*a + b*b)` with `Math.hypot(a, b)`

**S6754** — useState not destructured
- Destructure: `const [value, setValue] = useState(...)`

**S1301** — Switch with single case
- Replace with `if` statement

**S4138** — for loop → for...of
- Replace C-style `for (let i = 0; i < arr.length; i++)` with `for (const item of arr)` when only accessing `arr[i]`

**S3626** — Redundant jump
- Remove unnecessary `return`, `continue`, or `break` at end of block

## Step 3: Validation

After fixing all files in your batch:

1. Run `pnpm nx run @dsai-io/react:lint` (if you edited react package files)
2. Run `pnpm nx run @dsai-io/tools:lint` (if you edited tools package files)
3. Fix any lint errors your changes introduced
4. Do NOT run tests or build — that will be done separately

## Rules

- Do NOT change behavior. Every fix must be a pure refactor — same inputs, same outputs.
- Do NOT add new dependencies or imports (except moving existing code around).
- Do NOT modify test files, story files, or `.figma.tsx` files.
- Do NOT add comments explaining your changes.
- Do NOT add `// NOSONAR` or any suppression comments.
- Do NOT change formatting beyond what the fix requires (Biome handles formatting).
- Do NOT touch code outside the flagged lines unless necessary to complete the fix (e.g., extracting a helper function requires adding it nearby).
- If a fix would change the public API (exported types, function signatures used externally), skip it and note why.
- Use `Reflect.get()` for dynamic property access, never bracket notation — this is a project security rule.
- Preserve existing `displayName` assignments on components.
- Use the `cn()` utility for class composition, not template literals.
