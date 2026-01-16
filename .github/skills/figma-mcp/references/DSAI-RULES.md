# DSAi Figma MCP Rules

Project-specific rules for Figma MCP integration with the DSAi design system.

## Framework and Styling

- **Framework:** React 18+ with TypeScript
- **Styling:** Bootstrap 5 classes with CSS custom properties
- **DO NOT** use Tailwind CSS classes
- **DO NOT** use inline styles except for token-based custom properties

## Component Resolution

When generating code from Figma:

1. Check if a matching component exists in `packages/@dsai-io/react`
2. Reuse existing components instead of creating duplicates
3. Follow the component patterns established in the codebase

## Token Usage

Map Figma variables to DSAi tokens:

### Colors

| Figma Variable    | DSAi Token                    |
| ----------------- | ----------------------------- |
| `color/primary`   | `var(--dsai-color-primary)`   |
| `color/secondary` | `var(--dsai-color-secondary)` |
| `color/success`   | `var(--dsai-color-success)`   |
| `color/danger`    | `var(--dsai-color-danger)`    |
| `color/warning`   | `var(--dsai-color-warning)`   |
| `color/info`      | `var(--dsai-color-info)`      |
| `color/light`     | `var(--dsai-color-light)`     |
| `color/dark`      | `var(--dsai-color-dark)`      |

### Spacing

| Figma Variable | DSAi Token               |
| -------------- | ------------------------ |
| `spacing/xs`   | `var(--dsai-spacing-xs)` |
| `spacing/sm`   | `var(--dsai-spacing-sm)` |
| `spacing/md`   | `var(--dsai-spacing-md)` |
| `spacing/lg`   | `var(--dsai-spacing-lg)` |
| `spacing/xl`   | `var(--dsai-spacing-xl)` |

### Typography

| Figma Variable        | DSAi Token                        |
| --------------------- | --------------------------------- |
| `font/family/base`    | `var(--dsai-font-family-base)`    |
| `font/family/heading` | `var(--dsai-font-family-heading)` |
| `font/size/sm`        | `var(--dsai-font-size-sm)`        |
| `font/size/md`        | `var(--dsai-font-size-md)`        |
| `font/size/lg`        | `var(--dsai-font-size-lg)`        |

## File Structure

Place generated components in the correct location:

```text
packages/@dsai-io/react/src/components/
└── ComponentName/
    ├── ComponentName.tsx
    ├── ComponentName.types.ts
    ├── ComponentName.test.tsx
    ├── README.md
    └── index.ts
```

## Asset Handling

- Use localhost images directly when provided by the desktop server
- DO NOT import new icon packages
- Place downloaded assets in `packages/@dsai-io/react/src/assets/`

## Accessibility Requirements

All generated components must:

- Include appropriate ARIA attributes
- Support keyboard navigation
- Meet WCAG 2.1 AA contrast requirements
- Include focus indicators

## Code Quality

Generated code must:

- Use TypeScript with proper types
- Follow DSAi naming conventions
- Include JSDoc comments for props
- Be formatted with Prettier/Biome
