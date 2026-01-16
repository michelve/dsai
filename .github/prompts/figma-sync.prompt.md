---
agent: figma-sync
description: Check a DSAi component against its Figma design and identify differences
---

# Figma Component Sync

When asked to sync or check a component against Figma:

## Step 1: Setup

1. **Identify the component path** from user input
   - Components are in: `packages/@dsai-io/react/src/components/{ComponentName}/`
2. **Create temp directory**: `.temp/component-updates/{ComponentName}/`
3. **Read the component's Code Connect file** to find the Figma source:
   - `{ComponentName}.figma.tsx` contains `figma.connect(Component, '<FIGMA_DSAI_*>')`

## Step 2: Fetch Figma Context

1. **Parse the Figma URL** from the Code Connect file:
   - Look for substitution variable like `<FIGMA_DSAI_BUTTON>`
   - Check `figma.config.json` for the actual URL mapping
   - Extract `fileKey` and `nodeId` from the resolved URL

2. **Call `mcp_figma_get_design_context`** with:
   ```
   fileKey: extracted fileKey
   nodeId: extracted nodeId (with colon format, e.g., 1261:9396)
   ```

3. **Save the output** to `.temp/component-updates/{ComponentName}/figma-context.md`

4. **Check for parent components** (e.g., BaseButton) and fetch their Figma context too

## Step 3: Analyze Current Implementation

1. **Read the component files**:
   - `{ComponentName}.tsx` - Main component
   - `{ComponentName}.types.ts` - Props interface
   - `Base{ComponentName}.tsx` - Base component (if exists)
   - `README.md` - Documentation

2. **Document current styling using SCSS variables** (from `_variables.scss`):
   - Colors: `$theme-primary`, `$theme-secondary`, etc.
   - Typography: `$typography-text-base`, `$typography-font-weight-bold`
   - Spacing: `$spacing-0` through `$spacing-10`
   - Shadows: `$shadow-sm`, `$shadow-default`, `$shadow-lg`
   - Border radius: `$border-radius-sm`, `$border-radius-default`, `$border-radius-lg`

3. **Save analysis** to `.temp/component-updates/{ComponentName}/current-implementation.md`

## Step 4: Generate Comparison

Create `.temp/component-updates/{ComponentName}/comparison.md` with:

1. **Summary of Figma design** (from context)
2. **Summary of current implementation**
3. **Table of differences** with columns:
   - Category
   - Figma Design
   - Current Code
   - SCSS Variable
   - Bootstrap Class
   - Impact (Low/Medium/High)

4. **Decision checkboxes** for each difference:
   ```markdown
   ### 📁 {FileName}.tsx

   #### Difference {N}: {description}
   - **Figma:** {figma value}
   - **Code:** {current value}
   - **SCSS Variable:** `$spacing-3` vs `$spacing-2`
   - **Bootstrap Class:** `p-3` vs `p-2`
   - **Impact:** Medium

   **Decision:**
   - [ ] 🔧 IMPLEMENT - Update code to match Figma
   - [ ] ✅ ACCEPT - Keep current, add to accepted deviations
   - [ ] ⏭️ SKIP - Decide later

   **Reason (if accepting):**
   ```

5. **List previously accepted deviations** from README.md (if any)

## Step 5: Prompt User

After creating comparison.md, tell the user:

```
📋 Figma sync analysis complete for {ComponentName}!

I've created a comparison report at:
`.temp/component-updates/{ComponentName}/comparison.md`

**Files analyzed:**
- {ComponentName}.tsx
- {ComponentName}.types.ts
- Base{ComponentName}.tsx (if applicable)

**Next steps:**
1. Open the comparison.md file
2. Review each difference
3. Check ONE box per difference (IMPLEMENT, ACCEPT, or SKIP)
4. Add a reason for any ACCEPT decisions
5. Save the file

Then tell me: "Apply figma sync for {ComponentName}"
```

## Step 6: Apply Decisions (when user asks)

When user says "apply figma sync for {ComponentName}":

1. **Read the comparison.md**
2. **Parse decisions**:
   - Find checked boxes `[x]`
   - Extract the decision type (IMPLEMENT/ACCEPT/SKIP)

3. **For IMPLEMENT decisions**:
   - Generate implementation plan
   - Make code changes following the component-development skill
   - Update Code Connect mapping in `{ComponentName}.figma.tsx` if props changed
   - Run tests: `pnpm nx test @dsai-io/react --testPathPattern={ComponentName}`

4. **For ACCEPT decisions**:
   - Add to README.md under "## Accepted Design Differences"
   - Include the reason provided
   - Format:
     ```markdown
     | Category | Figma | Implementation | SCSS Variable | File | Reason |
     ```

5. **Verify Code Connect** is current:
   ```bash
   npx figma connect publish
   ```

6. **Clean up** `.temp/component-updates/{ComponentName}/` when done

## DSAi-Specific References

### Component Structure

```text
packages/@dsai-io/react/src/components/{ComponentName}/
├── {ComponentName}.tsx           # Main component
├── {ComponentName}.types.ts      # Props interface
├── {ComponentName}.figma.tsx     # Code Connect mapping
├── {ComponentName}.test.tsx      # Unit tests
├── {ComponentName}.a11y.test.tsx # Accessibility tests
├── Base{ComponentName}.tsx       # Base component (optional)
├── README.md                     # Documentation
└── index.ts                      # Exports
```

### SCSS Variables (from `apps/playground/src/generated/_variables.scss`)

| Category | Variable Examples                                                |
| -------- | ---------------------------------------------------------------- |
| Spacing  | `$spacing-0`=0, `$spacing-1`=0.25rem, `$spacing-3`=1rem          |
| Radius   | `$border-radius-sm`=0.25rem, `$border-radius-default`=0.375rem   |
| Colors   | `$theme-primary`=#0a58ca, `$theme-secondary`=#a8adb7             |
| Shadows  | `$shadow-sm`, `$shadow-default`, `$shadow-lg`                    |

### Related Skills

- `.github/skills/figma-mcp/SKILL.md` - Full MCP tool reference
- `.github/skills/component-development/SKILL.md` - Component patterns
- `.github/skills/testing-patterns/SKILL.md` - Test requirements
