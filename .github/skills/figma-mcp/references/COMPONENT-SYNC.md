# Component Sync Workflow

Use this workflow to audit an existing component against its Figma design and decide how to handle differences.

## Workflow Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│ 1. INITIALIZE - Create output dir, fetch Figma context         │
├─────────────────────────────────────────────────────────────────┤
│ 2. TRACE DEPENDENCIES - Identify internal components used      │
├─────────────────────────────────────────────────────────────────┤
│ 3. ANALYZE - Compare design vs implementation (all files)      │
├─────────────────────────────────────────────────────────────────┤
│ 4. REVIEW - User decides: IMPLEMENT, ACCEPT, or SKIP each      │
├─────────────────────────────────────────────────────────────────┤
│ 5. APPLY - Implement approved changes, document accepted       │
└─────────────────────────────────────────────────────────────────┘
```

## When to Use This Workflow

- Reviewing if a component matches its Figma design
- Auditing visual accuracy after Figma design changes
- Updating components to match new Figma designs
- Documenting accepted design differences

## Prerequisites

- Component must have a `*.figma.tsx` file with Code Connect mapping
- Component README exists at `packages/@dsai-io/react/src/components/{Component}/README.md`
- Figma MCP configured and authenticated

## Step 1: Initialize Check

Given a component path (e.g., `packages/@dsai-io/react/src/components/Button`):

1. **Create output directory**:

   ```text
   .temp/component-updates/{Component}/
   ```

2. **Read the component's Code Connect file** to get the Figma URL:

   ```text
   packages/@dsai-io/react/src/components/{Component}/{Component}.figma.tsx
   ```

3. **Extract the Figma node info** from the `figma.connect()` call:

   ```tsx
   figma.connect(Button, '<FIGMA_DSAI_BUTTON>', { ... })
   ```

4. **Fetch Figma design context** using `get_design_context`:
   - Extract `fileKey` and `nodeId` from the Figma URL
   - Save output to `.temp/component-updates/{Component}/figma-context.md`

5. **Read current component implementation**:
   - `{Component}.tsx` - Main component
   - `{Component}.types.ts` - Props interface
   - `README.md` - Current documentation
   - Save to `.temp/component-updates/{Component}/current-implementation.md`

## Step 2: Trace Dependencies

Identify internal components that may implement Figma-specified styles:

1. **Parse imports** from the main component file:
   - ✅ Include: Relative imports (`../BaseComponent`, `./SubComponent`)
   - ❌ Exclude: External packages (`react`, `classnames`, `@dsai-io/utils`)

2. **For each internal dependency**:
   - Read the component's source code
   - Check if it has its own `*.figma.tsx` with Figma source
   - If yes, fetch that Figma context too

3. **Create property-to-file mapping**:

   ```markdown
   # Dependency Analysis: {Component}

   ## Internal Dependencies

   | Component    | Path             | Has Figma Source? |
   | ------------ | ---------------- | ----------------- |
   | BaseButton   | ../BaseButton    | Yes               |
   | ButtonIcon   | ./ButtonIcon     | No                |

   ## Property Ownership Map

   | Figma Property | Responsible File | Current Value                | SCSS Variable                  |
   | -------------- | ---------------- | ---------------------------- | ------------------------------ |
   | Padding        | Button.tsx       | `p-2` (8px)                  | `$spacing-2` (0.5rem)          |
   | Icon Gap       | ButtonIcon.tsx   | `gap-2` (8px)                | `$spacing-2` (0.5rem)          |
   | Border Radius  | BaseButton.tsx   | `rounded-2` (6px)            | `$border-radius-default`       |
   | Background     | Button.tsx       | `bg-primary`                 | `$theme-primary`               |
   ```

4. **Save** to `.temp/component-updates/{Component}/dependencies.md`

## Step 3: Generate Comparison

Create `.temp/component-updates/{Component}/comparison.md`:

**Only include differences.** Do NOT include matching properties.

```markdown
# Component Comparison: {Component}

> Figma: https://www.figma.com/design/...?node-id=...

## Differences

### 📁 {Component}.tsx

#### 1. Padding
- **Figma:** 12px (`spacing3` = 1rem)
- **Code:** 8px (`spacing2` = 0.5rem)
- **SCSS Variable:** `$spacing-3` vs `$spacing-2`
- **Bootstrap Class:** `p-3` vs `p-2`
- **Impact:** Medium

**Decision:**
- [ ] 🔧 IMPLEMENT
- [ ] ✅ ACCEPT - Reason:
- [ ] ⏭️ SKIP

---

### 📁 BaseButton.tsx (dependency)

#### 1. Border Radius
- **Figma:** 8px (`borderRadiusLg` = 0.5rem)
- **Code:** 6px (`borderRadiusDefault` = 0.375rem)
- **SCSS Variable:** `$border-radius-lg` vs `$border-radius-default`
- **Bootstrap Class:** `rounded-3` vs `rounded-2`
- **Impact:** Low

**Decision:**
- [ ] 🔧 IMPLEMENT
- [ ] ✅ ACCEPT - Reason:
- [ ] ⏭️ SKIP

---

## Previously Accepted

| Category | Figma       | Code        | SCSS Variable           | File       | Reason                |
| -------- | ----------- | ----------- | ----------------------- | ---------- | --------------------- |
| Width    | Fixed 200px | `w-100`     | N/A (Bootstrap utility) | Button.tsx | Container flexibility |
```

## Step 4: User Review

Prompt the user:

```text
📋 Component sync analysis complete!

Found differences in {N} files:
- {Component}.tsx: {n} differences
- BaseButton.tsx (dependency): {n} differences

Please review and make decisions:
1. Open: `.temp/component-updates/{Component}/comparison.md`
2. For each difference, check ONE box: IMPLEMENT, ACCEPT, or SKIP
3. For ACCEPT, add your reason after the colon
4. Save the file
5. Tell me to apply the decisions
```

## Step 5: Apply Decisions

After user completes review:

1. **Parse `comparison.md`** for decisions grouped by file

2. **For IMPLEMENT decisions**:
   - Update the component following [component-development](../../component-development/SKILL.md) patterns
   - Update Code Connect mapping in `*.figma.tsx` if props changed
   - Run tests: `pnpm nx test @dsai-io/react --testPathPattern={Component}`

3. **For ACCEPT decisions**:
   - Add to the component's `README.md` under `## Accepted Design Differences`
   - Include the file where the deviation exists

4. **For SKIP decisions**:
   - Leave as-is for future review

5. **Verify Code Connect** is current:

   ```bash
   npx figma connect publish
   ```

**Important:** When changing dependency files, consider:

- Changes affect ALL components using that dependency
- Document the change scope in the implementation plan
- Run broader test coverage: `pnpm nx test @dsai-io/react`

## Output Files Structure

```text
.temp/component-updates/{Component}/
├── figma-context.md          # Raw Figma MCP output
├── current-implementation.md # Current code summary
├── dependencies.md           # Internal dependency & property mapping
└── comparison.md             # Differences with decision checkboxes
```

## README Format for Accepted Differences

```markdown
## Accepted Design Differences

| Category | Figma       | Implementation | SCSS Variable                | File           | Reason                |
| -------- | ----------- | -------------- | ---------------------------- | -------------- | --------------------- |
| Width    | Fixed 200px | `w-100`        | N/A (Bootstrap)              | Button.tsx     | Container flexibility |
| Gap      | 0px         | `gap-1`        | `$spacing-1` (0.25rem)       | BaseButton.tsx | Visual breathing room |
| Radius   | 8px         | `rounded-2`    | `$border-radius-default`     | Card.tsx       | Subtle corners        |
```

## Batch Processing

Check all components in a folder:

```text
Check all components in packages/@dsai-io/react/src/components/forms/ against their Figma designs
```

## Follow-up Prompts

After generating `comparison.md`:

**Apply changes:**

```text
Read .temp/component-updates/{Component}/comparison.md and implement all changes marked as IMPLEMENT
```

**Update README:**

```text
Read .temp/component-updates/{Component}/comparison.md and add all ACCEPT decisions to the component's README.md
```

## Common Properties to Check

| Category   | Figma Property   | SCSS Variable                        | Bootstrap Class           |
| ---------- | ---------------- | ------------------------------------ | ------------------------- |
| Colors     | Fill colors      | `$theme-*`, `$color-*`               | `bg-*`, `text-*`          |
| Typography | Font size        | `$typography-text-*`                 | `fs-*`                    |
| Typography | Font weight      | `$typography-font-weight-*`          | `fw-*`                    |
| Spacing    | Padding/Margin   | `$spacing-*` (0-10)                  | `p-*`, `m-*` (0-5)        |
| Spacing    | Gap              | `$spacing-*`                         | `gap-*`                   |
| Borders    | Border color     | `$border-color`                      | `border-*`                |
| Shadows    | Drop shadow      | `$shadow-*` (sm, default, lg)        | `shadow-*`                |
| Corners    | Border radius    | `$border-radius-*`                   | `rounded-*` (0-5, circle) |
| Sizing     | Width/Height     | N/A                                  | `w-*`, `h-*`              |

## SCSS Variable Reference

Reference from `apps/playground/src/generated/_variables.scss`:

| Category | SCSS Variable Examples                                               |
| -------- | -------------------------------------------------------------------- |
| Spacing  | `$spacing-0`=0, `$spacing-1`=0.25rem, `$spacing-3`=1rem              |
| Radius   | `$border-radius-sm`=0.25rem, `$border-radius-lg`=0.5rem              |
| Colors   | `$theme-primary`=#0a58ca, `$color-blue-500`=#0a58ca                  |
| Shadows  | `$shadow-sm`, `$shadow-default`, `$shadow-lg`                        |
| Layout   | `$layout-gutters-1`=0.25rem, `$layout-container-max-width-lg`        |
