# Component Specification: [COMPONENT_NAME]

**Branch**: `component/[component-name]`
**Created**: [DATE]
**Status**: Draft
**Figma**: [Figma link if available]

---

## Overview

[Brief description of what this component does and when to use it]

---

## User Scenarios

### Scenario 1: [Primary Use Case]

**As a** [user type]
**I want to** [action]
**So that** [benefit]

**Acceptance Test:**

```gherkin
Given [precondition]
When [action]
Then [expected result]
```

### Scenario 2: [Secondary Use Case]

**As a** [user type]
**I want to** [action]
**So that** [benefit]

---

## Requirements

### Functional Requirements

- **FR-001**: [Component renders with default props]
- **FR-002**: [All variants implemented: primary, secondary, etc.]
- **FR-003**: [All sizes implemented: sm, md, lg]
- **FR-004**: [Interactive states: hover, focus, active, disabled]

### Accessibility Requirements (WCAG 2.2 AA)

- **A11Y-001**: Component is keyboard navigable (Tab, Enter, Space, Escape)
- **A11Y-002**: Has proper ARIA labels and roles
- **A11Y-003**: Color contrast ratio meets 4.5:1 minimum
- **A11Y-004**: Focus indicator is visible and clear
- **A11Y-005**: Screen reader announces state changes

### Design Token Requirements

- **DT-001**: Uses `$spacing-*` for all padding/margin
- **DT-002**: Uses `$theme-*` for all colors
- **DT-003**: Uses `$border-radius-*` for rounded corners
- **DT-004**: Supports light/dark mode via tokens

---

## Props Interface

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `variant` | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | No | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Component size |
| `disabled` | `boolean` | `false` | No | Disables interaction |
| `children` | `ReactNode` | - | Yes | Content to render |
| `className` | `string` | - | No | Additional CSS classes |

---

## Figma Mapping

| Figma Property | Type | React Prop | Values |
| -------------- | ---- | ---------- | ------ |
| State | Variant | - | Default, Hover, Focus, Disabled |
| Size | Variant | `size` | Small → sm, Medium → md, Large → lg |
| Variant | Variant | `variant` | Primary, Secondary, Danger |

---

## Success Criteria

- **SC-001**: jest-axe reports zero violations
- **SC-002**: All keyboard navigation works without mouse
- **SC-003**: Test coverage ≥ 95%
- **SC-004**: Bundle size ≤ 3 KB
- **SC-005**: Storybook stories complete with all variants

---

## Out of Scope

- [Feature explicitly not included in this component]
- [Edge case that won't be handled]

---

## Related Components

- [ParentComponent] - Contains this component
- [SiblingComponent] - Similar functionality
- [ChildComponent] - Used within this component
