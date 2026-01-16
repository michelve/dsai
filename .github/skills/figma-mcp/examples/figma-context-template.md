# Figma Context Output

> Component: {COMPONENT_NAME}
> Figma URL: {FIGMA_URL}
> Fetched: {TIMESTAMP}

---

## Raw Design Context

<!-- Paste mcp_figma_get_design_context output below -->

```json
{FIGMA_CONTEXT_OUTPUT}
```

---

## Extracted Design Specifications

### Component Structure

<!-- List the component hierarchy from Figma -->

- Container
  - Header
  - Content
  - Footer (optional)

### Visual Properties

| Property      | Figma Value | SCSS Variable                  | Bootstrap Class |
| ------------- | ----------- | ------------------------------ | --------------- |
| Width         |             | N/A                            | `w-*`           |
| Height        |             | N/A                            | `h-*`           |
| Background    |             | `$theme-*`                     | `bg-*`          |
| Border        |             | `$border-color`                | `border-*`      |
| Border Radius |             | `$border-radius-*`             | `rounded-*`     |
| Shadow        |             | `$shadow-*`                    | `shadow-*`      |
| Padding       |             | `$spacing-*`                   | `p-*`           |
| Gap           |             | `$spacing-*`                   | `gap-*`         |

### Typography

| Element | Size | Weight | Color | SCSS Variable                     | Bootstrap |
| ------- | ---- | ------ | ----- | --------------------------------- | --------- |
| Title   |      |        |       | `$typography-text-base`           | `fs-*`    |
| Body    |      |        |       | `$typography-text-base`           | `fs-*`    |
| Caption |      |        |       | `$typography-text-sm`             | `fs-6`    |

### Colors Used

| Name    | Hex Value | SCSS Variable                    | Usage      |
| ------- | --------- | -------------------------------- | ---------- |
| Primary |           | `$theme-primary`                 | Background |
| Text    |           | `$theme-dark`                    | Text       |
| Border  |           | `$border-color` (Bootstrap)      | Borders    |

### States

| State    | Visual Changes                                   | SCSS Variable           |
| -------- | ------------------------------------------------ | ----------------------- |
| Rest     |                                                  |                         |
| Hover    |                                                  | Bootstrap `:hover`      |
| Focus    | Focus ring: 3px offset                           | `$focus-ring-*`         |
| Active   |                                                  | Bootstrap `:active`     |
| Disabled | Opacity 0.65                                     | `$btn-disabled-opacity` |

---

## Parent Context

<!-- If parent component exists, include its Figma context -->

### Parent Component

- **Name:** {PARENT_COMPONENT_NAME}
- **Figma URL:** {PARENT_FIGMA_URL}

### Parent Context Output

```json
{PARENT_FIGMA_CONTEXT}
```

---

## DSAi Token Mapping Reference

Use these tokens from `apps/playground/src/generated/tokens.json`:

| Category   | Token Examples                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| Spacing    | `spacing0`="0", `spacing1`="0.25rem", `spacing2`="0.5rem", `spacing3`="1rem", `spacing4`="1.5rem"       |
| Radius     | `borderRadiusSm`="0.25rem", `borderRadiusDefault`="0.375rem", `borderRadiusLg`="0.5rem", `borderRadiusXl`="1rem" |
| Colors     | `themePrimary`="#0a58ca", `themeSecondary`="#a8adb7", `themeDanger`="#842029", `themeSuccess`="#0f5132" |
| Shadows    | `shadowSm`="0 0.125rem 0.25rem rgba(0,0,0,0.075)", `shadowDefault`="0 0.5rem 1rem rgba(0,0,0,0.15)"     |
| Typography | `typographyTextBase`="1rem", `typographyTextSm`="0.875rem", `typographyFontWeightBold`=700             |
