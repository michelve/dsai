# DSAi Design System Guidelines

This project uses the **DSAi Design System** (`@dsai-io/react`), an enterprise-grade React component library with Bootstrap 5 theming and WCAG 2.2 AA accessibility.

> **Version**: 1.0.0 | **Last Updated**: January 2026 | **Figma Library**: DSAi Components

## READ THIS FIRST

IMPORTANT: Always prefer components from `@dsai-io/react` if they exist. Do not create custom components when a DSAi component is available.

IMPORTANT: Follow these steps IN ORDER before writing any code:

### Step 1: Read Overview Files (REQUIRED)

Read ALL files with a name that starts with "overview-" in the guidelines directory:

- `overview-components.md` - Available components and common patterns
- `overview-accessibility.md` - Accessibility requirements

### Step 2: Read Design Tokens (REQUIRED)

Read ALL files in the `design-tokens/` folder. Do NOT skip this step:

- `colors.md` - Color palette and semantic tokens
- `typography.md` - Font families, sizes, weights, line heights
- `spacing.md` - Spacing scale and layout grid
- `borders.md` - Border widths and radius
- `shadows.md` - Elevation and shadow scale
- `icons.md` - Icon sizing guidelines

### Step 3: Plan what components you need (REQUIRED)

Before using ANY component, you MUST read its guidelines file first:

- Using Button? → Read `guidelines/components/button.md` FIRST
- Using Alert? → Read `guidelines/components/alert.md` FIRST
- Using Input? → Read `guidelines/components/input.md` FIRST

DO NOT write code using a component until you have read its specific guidelines.

---

## Framework & Technology Stack

| Technology | Value |
| ---------- | ----- |
| **Framework** | React 18+ with TypeScript |
| **CSS Framework** | Bootstrap 5.3 |
| **Component Package** | `@dsai-io/react` |
| **Token CLI** | `@dsai-io/tools` |
| **Design Tool** | Figma with Code Connect |
| **Accessibility** | WCAG 2.2 AA compliant |
| **Token Format** | DTCG (Design Token Community Group) |

## Package Import Pattern

All components are imported from `@dsai-io/react`:

```tsx
import { Button, Alert, Badge, Input } from '@dsai-io/react';
```

## Design Tokens Setup

Design tokens are generated locally using `@dsai-io/tools`:

```bash
# Generate tokens
npx dsai tokens build
```

This creates CSS variables in your configured output directory. Import the generated CSS:

```tsx
import './generated/dsai-theme-bs.css';
```

## Component Guidelines

| Component | Description | Guidelines |
| --------- | ----------- | ---------- |
| Accordion | Collapsible content panels | [accordion.md](components/accordion.md) |
| Alert | Contextual feedback messages | [alert.md](components/alert.md) |
| Avatar | User/entity representation | [avatar.md](components/avatar.md) |
| Badge | Status labels and counters | [badge.md](components/badge.md) |
| Breadcrumb | Navigation hierarchy | [breadcrumb.md](components/breadcrumb.md) |
| Button | Interactive action triggers | [button.md](components/button.md) |
| Card | Content container | [card.md](components/card.md) |
| CardList | Grid or list of selectable cards | [card-list.md](components/card-list.md) |
| Carousel | Slideshow for cycling elements | [carousel.md](components/carousel.md) |
| Checkbox | Boolean selection | [checkbox.md](components/checkbox.md) |
| CheckboxGroup | Multiple checkbox selections | [checkbox-group.md](components/checkbox-group.md) |
| Dropdown | Menu with options | [dropdown.md](components/dropdown.md) |
| Icon | SVG icon component | [icon.md](components/icon.md) |
| Input | Text input field | [input.md](components/input.md) |
| ListGroup | Flexible list display | [list-group.md](components/list-group.md) |
| Modal | Dialog overlay | [modal.md](components/modal.md) |
| Navbar | Responsive navigation header | [navbar.md](components/navbar.md) |
| Pagination | Page navigation | [pagination.md](components/pagination.md) |
| Popover | Interactive popup content | [popover.md](components/popover.md) |
| Progress | Progress indicator | [progress.md](components/progress.md) |
| Radio | Single selection from options | [radio.md](components/radio.md) |
| Scrollspy | Scroll-based navigation highlighting | [scrollspy.md](components/scrollspy.md) |
| Select | Dropdown selection | [select.md](components/select.md) |
| SelectableCard | Card variant that can be toggled | [selectable-card.md](components/selectable-card.md) |
| Sheet | Slide-in panel | [sheet.md](components/sheet.md) |
| Spinner | Loading indicator | [spinner.md](components/spinner.md) |
| Switch | Toggle control | [switch.md](components/switch.md) |
| Table | Tabular data display | [table.md](components/table.md) |
| Tabs | Content organization | [tabs.md](components/tabs.md) |
| TabsPro | Advanced tabs with features | [tabs-pro.md](components/tabs-pro.md) |
| Toast | Temporary notifications | [toast.md](components/toast.md) |
| Tooltip | Hover information | [tooltip.md](components/tooltip.md) |
| Typography | Text styles | [typography.md](components/typography.md) |

## Design Token Reference

| Category | File | Description |
| -------- | ---- | ----------- |
| Colors | [colors.md](design-tokens/colors.md) | Theme colors, brand palette, semantic colors |
| Typography | [typography.md](design-tokens/typography.md) | Font families, sizes, weights, line heights |
| Spacing | [spacing.md](design-tokens/spacing.md) | Spacing scale, layout grid, gutters |
| Borders | [borders.md](design-tokens/borders.md) | Border widths and radius tokens |
| Shadows | [shadows.md](design-tokens/shadows.md) | Elevation and box shadow scale |
| Icons | [icons.md](design-tokens/icons.md) | Icon sizing guidelines |

## Token Naming Convention

All CSS custom properties follow this pattern:

```txt
--dsai-{category}-{property}-{variant}
```

Examples:

- `--dsai-color-blue-500` - Color palette
- `--dsai-typography-heading-h1` - Typography
- `--dsai-spacing-4` - Spacing
- `--dsai-border-radius-lg` - Border radius
- `--dsai-shadow-default` - Shadows

## Figma Code Connect

DSAi components support Figma Code Connect for design-to-code parity.

### Code Connect Setup

```bash
# Install Figma Code Connect CLI
npm install -g @figma/code-connect

# Link components to Figma
npx figma connect publish
```

### Component Property Mapping

| Figma Property | Type | React Prop |
| -------------- | ---- | ---------- |
| State | Variant | Maps to component state/variant |
| Size | Variant | `size` prop |
| Disabled | Boolean | `disabled` prop |
| Label | Text | Text content or `label` prop |
| Icon | Instance Swap | `icon` prop (component) |

### Example Code Connect File

```tsx
// Button.figma.tsx
import figma from '@figma/code-connect';
import { Button } from '@dsai-io/react';

figma.connect(Button, 'figma-url', {
  props: {
    label: figma.string('Label'),
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Danger: 'danger',
    }),
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),
    disabled: figma.boolean('Disabled'),
  },
  example: (props) => (
    <Button
      variant={props.variant}
      size={props.size}
      disabled={props.disabled}
    >
      {props.label}
    </Button>
  ),
});
```

## General Component Rules

### Common Props

Most DSAi components accept these common props:

- `className`: Additional CSS classes (use sparingly, prefer variants)
- `disabled`: Boolean to disable the component
- `data-*`: Data attributes are always allowed
- `aria-*`: ARIA attributes for accessibility
- Components extend base element types (e.g., Button extends `<button>` props)

### Sizing

Most components support a `size` prop:

- `"sm"` - Small (compact UI)
- `"md"` - Medium (default)
- `"lg"` - Large (prominent UI)

### Variants

Button, Alert, Badge, and Progress support Bootstrap variants:

- `"primary"` - Main action (blue)
- `"secondary"` - Secondary action (gray)
- `"success"` - Positive action (green)
- `"danger"` - Destructive action (red)
- `"warning"` - Caution (yellow)
- `"info"` - Information (cyan)
- `"light"` - Light background
- `"dark"` - Dark background

Buttons also support outline variants: `"outline-primary"`, `"outline-secondary"`, etc.

## Accessibility Requirements

All components must:

1. Be keyboard navigable
2. Have proper ARIA labels
3. Support focus management
4. Meet color contrast requirements (4.5:1 for text)
5. Work with screen readers

Never remove focus outlines without providing an alternative indicator.

## Do's and Don'ts

### DO ✅

- Import components from `@dsai-io/react`
- Use semantic variants (`variant="danger"` for destructive actions)
- Include proper ARIA labels
- Use design token CSS variables
- Follow component-specific guidelines
- Test with keyboard navigation
- Verify color contrast ratios

### DON'T ❌

- Create custom components when DSAi components exist
- Override component styles with inline styles
- Remove accessibility features
- Use deprecated className patterns
- Skip reading component guidelines
- Use hardcoded color/spacing values
- Ignore Figma component property mappings

## Platform Support

| Platform | Syntax | Example |
| -------- | ------ | ------- |
| Web (CSS) | `--dsai-{category}-{token}` | `--dsai-color-blue-500` |
| SCSS | `${variable-name}` | `$color-blue-500` |
| Android | `{category}.{token}` | `color.blue.500` |
| iOS | `{Category}.{Token}` | `Color.Blue.shade500` |

## Quick Reference

### Import Pattern

```tsx
import { Button, Card, Input, Alert } from '@dsai-io/react';
import './generated/dsai-theme-bs.css';
```

### Common Patterns

```tsx
// Form with validation
<Input
  label="Email"
  type="email"
  required
  error={errors.email}
/>

// Button group
<div style={{ display: 'flex', gap: 'var(--dsai-spacing-3)' }}>
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
</div>

// Status feedback
<Alert variant="success">Changes saved successfully</Alert>
```
