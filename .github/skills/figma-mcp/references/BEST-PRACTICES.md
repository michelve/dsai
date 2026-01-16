# Figma MCP Best Practices

Detailed best practices for using the Figma MCP server effectively with DSAi.

## Structuring Figma Files for Better Code

Prepare your Figma files to get the best code output:

### Use Components

- Create components for anything reused (buttons, cards, inputs)
- Link components to codebase via Code Connect for best reuse results
- Name components to match DSAi component names when possible

### Use Variables

- Define variables for spacing, color, radius, and typography
- Use consistent naming that maps to DSAi tokens
- Apply variables instead of hardcoded values

### Name Layers Semantically

```text
✅ CardContainer, HeaderNav, PrimaryButton
❌ Group 5, Frame 42, Rectangle 1
```

### Use Auto Layout

- Apply Auto Layout to communicate responsive intent
- Resize frames in Figma to verify responsive behavior
- Use constraints for positioning

### Add Annotations

Use annotations and dev resources for:

- Behavior that's hard to capture visually
- Alignment and spacing rules
- Responsive breakpoint behavior
- Interaction states

## Writing Effective Prompts

### Specify Framework and Styling

```text
✅ "Generate iOS SwiftUI code from this frame"
✅ "Use Bootstrap 5 classes for this layout"
✅ "Generate as a React component using DSAi tokens"
```

### Reference Component Locations

```text
✅ "Use components from packages/@dsai-io/react/src/components"
✅ "Add this to packages/@dsai-io/react/src/components/marketing/PricingCard.tsx"
```

### Specify Layout Systems

```text
✅ "Use Bootstrap grid for the layout"
✅ "Use flexbox with gap utilities"
✅ "Use our Stack layout component"
```

## Tool Selection Guide

### When to use `get_design_context`

- Translating Figma frames to code
- Getting styled component representations
- Default choice for most design-to-code tasks
- Supported files: Figma Design, Figma Make

### When to use `get_metadata`

- Very large designs (over 50 layers)
- When `get_design_context` is slow or truncated
- Getting an overview before detailed extraction
- Breaking down complex designs into manageable sections

### When to use `get_variable_defs`

- Extracting design tokens (colors, spacing, typography)
- Auditing token usage in designs
- Syncing Figma variables with codebase tokens
- Supported files: Figma Design only

### When to use `get_screenshot`

- Preserving visual fidelity
- Complex layouts where structure matters
- Visual comparison during implementation
- Supported files: Figma Design, FigJam

### When to use `get_code_connect_map`

- Checking existing component mappings
- Verifying Figma nodes are linked to codebase components
- Before generating code to ensure reuse of existing components

### When to use `add_code_connect_map`

- Creating new mappings between Figma nodes and components
- Setting up Code Connect for a new component
- Improving code generation accuracy for specific components

### When to use `create_design_system_rules`

- Initial project setup for consistent code output
- Creating rule files for agent context
- Outputs to `rules/` or `instructions/` directory
- No file context required

### When to use `get_figjam`

- Extracting FigJam diagrams (architecture, workflows)
- Getting metadata with node screenshots
- Documenting processes and flows

### When to use `whoami` (remote only)

- Verifying authentication status
- Checking user plan and seat type
- Debugging permission issues

### When to use `get_strategy_for_mapping` (alpha, local only)

- Auto-detecting component mapping strategies
- Figma-prompted component detection
- Setting up Code Connect mappings automatically

### When to use `send_get_strategy_response` (alpha, local only)

- Completing the Figma-prompted mapping workflow
- After calling `get_strategy_for_mapping`

## Handling Large Designs

For complex or full-page designs:

1. **Start with `get_metadata`** to get the layer tree
2. **Identify logical sections** (header, sidebar, content, footer)
3. **Extract each section** with `get_design_context`
4. **Compose** the full layout from generated parts
5. **Take screenshots** of each section for validation

## Code Connect Integration

Code Connect maps Figma components to your codebase:

### Setting Up Code Connect

1. Identify Figma components that match DSAi components
2. Use `add_code_connect_map` to create mappings
3. Store mappings in version control

### Benefits

- Generated code reuses actual DSAi components
- Consistent with existing codebase patterns
- Reduces post-generation cleanup

### Example Mapping

```json
{
  "node-id-123": {
    "codeConnectSrc": "packages/@dsai-io/react/src/components/Button/Button.tsx",
    "codeConnectName": "Button"
  }
}
```

## Common Issues and Solutions

### Issue: Generated code uses Tailwind

**Solution:** Explicitly request Bootstrap 5 or DSAi tokens:

```text
"Generate using Bootstrap 5 classes and DSAi CSS custom properties"
```

### Issue: Output is too large

**Solution:** Break down the selection:

1. Use `get_metadata` first
2. Select smaller portions
3. Generate incrementally

### Issue: Missing component mappings

**Solution:** Set up Code Connect:

1. Run `get_code_connect_map` to see existing mappings
2. Use `add_code_connect_map` to add new ones
3. Re-run `get_design_context`

### Issue: Images not loading

**Solution:** Check image settings in desktop server:

1. Open MCP server settings in Figma
2. Select "Local server" or "Download" for images
3. Use provided localhost URLs directly

## Quality Checklist

Before marking Figma-to-code complete:

- [ ] Visual parity with Figma design
- [ ] Uses DSAi components where applicable
- [ ] Uses design tokens instead of hardcoded values
- [ ] Responsive behavior matches Figma
- [ ] Accessibility attributes present
- [ ] No Tailwind classes in final code
- [ ] Tests added for new components
