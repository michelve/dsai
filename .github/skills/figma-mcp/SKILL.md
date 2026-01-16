---
name: figma-mcp
description: Use Figma MCP server to generate code from Figma designs, extract design context, variables, and component mappings. Use when implementing UI from Figma files, extracting design tokens, getting screenshots for visual reference, or mapping Figma components to codebase components via Code Connect.
license: Complete terms in LICENSE.txt
metadata:
  author: dsai
  version: '1.0'
---

# Figma MCP Server Integration

Use the Figma MCP server to translate Figma designs into production-ready code for DSAi.

## When to Use

- Implementing UI components from Figma design files
- Extracting design context (layout, styles, components) from Figma selections
- Getting design tokens and variables from Figma files
- Taking screenshots of Figma frames for visual reference
- Mapping Figma components to codebase components via Code Connect
- Creating design system rules from Figma files

## Prerequisites

### MCP Server Setup

The Figma MCP server can run **remotely** or **locally** (desktop app):

| Server Type | URL                         | Requirements                            |
| ----------- | --------------------------- | --------------------------------------- |
| Remote      | `https://mcp.figma.com/mcp` | Figma OAuth authentication              |
| Desktop     | `http://127.0.0.1:3845/mcp` | Figma desktop app with Dev Mode enabled |

### VS Code Configuration

Add to your `mcp.json`:

```json
{
  "servers": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

Or for desktop server:

```json
{
  "servers": {
    "figma-desktop": {
      "type": "http",
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

## Available Tools

### `get_design_context`

**Primary tool** for generating code from Figma designs.

- Supported files: Figma Design, Figma Make
- Default output: React + Tailwind (customizable via prompts)
- Use for: Translating frames into component code

**Prompt examples:**

```text
Generate my Figma selection in React
Generate this frame using components from packages/@dsai-io/react
Generate my Figma selection in plain HTML + CSS
```

### `get_variable_defs`

Extract design tokens and variables from selections.

- Returns: Colors, spacing, typography variables
- Use for: Syncing Figma variables with DSAi design tokens

**Prompt examples:**

```text
Get the variables used in my Figma selection
What color and spacing variables are used here?
List the variable names and values used in this frame
```

### `get_code_connect_map`

Retrieve mappings between Figma nodes and codebase components.

- Returns: `codeConnectSrc` (file path) and `codeConnectName` (component name)
- Use for: Reusing existing DSAi components when generating code

### `add_code_connect_map`

Add new mappings between Figma nodes and code components.

- Use for: Connecting Figma designs to DSAi component implementations

### `get_screenshot`

Take screenshots of Figma selections for visual reference.

- Supported files: Figma Design, FigJam
- Use for: Preserving layout fidelity, visual comparison

### `create_design_system_rules`

Generate rule files for consistent code output.

- No file context required
- Outputs to `rules/` or `instructions/` directory
- Use for: Aligning generated code with DSAi conventions

### `get_metadata`

Get sparse XML representation of selections.

- Returns: Layer IDs, names, types, positions, sizes
- Use for: Breaking down large designs before calling `get_design_context`

### `get_figjam`

Extract metadata from FigJam diagrams.

- Similar to `get_metadata` but includes node screenshots
- Use for: Architecture diagrams, workflows

### `whoami` (remote only)

Get authenticated user identity and plan information.

- Returns: Email address, plans, seat types
- Use for: Verifying authentication and permissions

### `get_strategy_for_mapping` (alpha, local only)

Figma-prompted tool to detect and map Figma components to codebase components.

- Supported files: Figma Design
- Use for: Auto-detecting component mapping strategies
- Note: Alpha feature, desktop MCP server only

### `send_get_strategy_response` (alpha, local only)

Send a response after calling `get_strategy_for_mapping`.

- Use for: Completing the Figma-prompted mapping workflow
- Note: Alpha feature, desktop MCP server only

## Required Workflow

**IMPORTANT:** Always follow this sequence for Figma-to-code tasks:

1. **Run `get_design_context`** first to fetch the structured representation
2. If response is too large, run `get_metadata` first, then `get_design_context` on specific nodes
3. **Run `get_screenshot`** for visual reference
4. Download any required assets
5. **Translate output** to DSAi conventions (see below)
6. **Validate against Figma** for 1:1 visual parity

## DSAi Translation Rules

When translating Figma MCP output to DSAi components:

### Component Mapping

| Figma Output    | DSAi Component        | Location            |
| --------------- | --------------------- | ------------------- |
| Button elements | `<Button>`            | `@dsai-io/react`    |
| Card layouts    | `<Card>`              | `@dsai-io/react`    |
| Input fields    | `<Input>`             | `@dsai-io/react`    |
| Modal dialogs   | `<Modal>`             | `@dsai-io/react`    |
| Typography      | Use Bootstrap classes | `dsai-theme-bs.css` |

### Styling Rules

- **DO NOT** use Tailwind classes directly
- **Replace** Tailwind utilities with Bootstrap 5 classes
- **Use** DSAi design tokens via CSS custom properties
- **Reference** tokens from `packages/@dsai-io/tokens`

```tsx
// ❌ Figma MCP output (Tailwind)
<div className="flex gap-4 p-6 bg-blue-500">

// ✅ DSAi translation (Bootstrap + SCSS variables)
<div className="d-flex gap-3 p-4 bg-primary">
// Or with inline style: style={{ backgroundColor: '$theme-primary' }}
```

### Token Mapping

Map Figma variables to SCSS variables (from `_variables.scss`):

| Figma Variable    | SCSS Variable            | Value       |
| ----------------- | ------------------------ | ----------- |
| `color/primary`   | `$theme-primary`         | `#0a58ca`   |
| `color/secondary` | `$theme-secondary`       | `#a8adb7`   |
| `spacing/md`      | `$spacing-3`             | `1rem`      |
| `radius/md`       | `$border-radius-default` | `0.375rem`  |

### Asset Handling

- **Use localhost images** directly when provided by desktop server
- **DO NOT** import new icon packages; use assets from Figma payload
- **DO NOT** create placeholders if localhost source is provided

## Prompting Best Practices

### Be Specific About Framework

```text
✅ "Generate this frame as a React component using @dsai-io/react components"
❌ "Make code from this design"
```

### Specify File Locations

```text
✅ "Add this to packages/@dsai-io/react/src/components/NewComponent"
❌ "Create a component"
```

### Reference Existing Components

```text
✅ "Use components from packages/@dsai-io/react/src/components/ui"
✅ "Follow the pattern in the Button component"
```

### Break Down Large Selections

For complex designs:

1. Generate code for smaller sections (Card, Header, Sidebar)
2. Compose the full layout from generated parts
3. If slow or stuck, reduce selection size

## Integration with DSAi Workflows

### With Design Tokens

After extracting variables with `get_variable_defs`:

```bash
# Sync to DSAi token files
node packages/@dsai-io/tokens/scripts/sync-figma.mjs
```

### With Component Development

1. Extract design context from Figma
2. Generate component skeleton
3. Apply [component-development](../component-development/SKILL.md) patterns
4. Add accessibility per [accessibility](../accessibility/SKILL.md) skill
5. Write tests per [testing-patterns](../testing-patterns/SKILL.md) skill

### With Storybook

After generating component:

1. Create stories per [storybook-docs](../storybook-docs/SKILL.md) skill
2. Document props and variants
3. Add visual comparison with Figma screenshot

## Troubleshooting

### Connection Issues

- Verify MCP server is running (check Dev Mode panel in Figma desktop)
- Restart Figma desktop app and VS Code
- Confirm server URL in `mcp.json`

### Large Context Issues

- Use `get_metadata` first for large selections
- Break down into smaller component selections
- Target specific layers by node ID

### Authentication (Remote Server)

- Complete OAuth flow when prompted
- Verify Figma account has appropriate seat type
- Check rate limits (Tier 1 API limits apply)

## References

- [Figma MCP Server Guide](https://github.com/figma/mcp-server-guide)
- [Tools and Prompts Documentation](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- [Remote Server Installation](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)
- [Desktop Server Installation](https://developers.figma.com/docs/figma-mcp-server/local-server-installation/)
- [Code Connect Documentation](https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect)

---

## Component Sync Workflow

Audit an existing component against its Figma design and decide how to handle differences.

**When to use:** Reviewing component accuracy, syncing after Figma changes, documenting accepted deviations.

**Workflow:**

1. **INITIALIZE** - Create output dir, fetch Figma context
2. **TRACE DEPENDENCIES** - Identify internal components used
3. **ANALYZE** - Compare design vs implementation (all files)
4. **REVIEW** - User decides: IMPLEMENT, ACCEPT, or SKIP each
5. **APPLY** - Implement approved changes, document accepted

**Output:** `.temp/component-updates/{Component}/comparison.md` with decision checkboxes.

📖 **Full workflow:** See [references/COMPONENT-SYNC.md](references/COMPONENT-SYNC.md)
📋 **Templates:** See [examples/](examples/) for `figma-context-template.md` and `comparison-template.md`

---

## Token Sync Workflow

Sync design tokens between Figma and your codebase.

**Commands:**

```bash
node figma.config.mjs export    # Figma → local JSON
node figma.config.mjs sync      # Bidirectional sync
node figma.config.mjs workflow  # Full pipeline
```

**After sync:** Run `pnpm dsai tokens build` to generate CSS/JS/SCSS outputs.

📖 **Full workflow:** See [references/TOKEN-SYNC.md](references/TOKEN-SYNC.md)

---

## Example Prompts

### Check a component against Figma

```text
Get the design context for the Button component in Figma and compare it against
packages/@dsai-io/react/src/components/Button/Button.tsx
```

### Generate a new component from Figma

```text
Generate this Figma selection as a React component using @dsai-io/react patterns.
Follow the component-development skill for structure.
```

### Sync design tokens

```text
Export the latest design tokens from Figma to packages/@dsai-io/tokens/src/figma-exports
```

### Update Code Connect after changes

```text
Update the Code Connect mapping in Button.figma.tsx to include the new "error" variant
```
