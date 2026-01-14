# DSAi Components Overview

Always prefer components from the `@dsai/react` package if they are available. Each component has a guidelines file that contains helpful examples and additional context. You must follow all relevant instructions.

## Import Pattern

```tsx
import { Button, Alert, Badge, Card, Input } from '@dsai/react';
```

## Available Components

Here are the guidelines files and descriptions for DSAi components:

| Component      | Description                                            | Guidelines file                                     |
| -------------- | ------------------------------------------------------ | --------------------------------------------------- |
| Accordion      | Collapsible content sections with expand/collapse      | [accordion.md](components/accordion.md)             |
| Alert          | Contextual feedback messages for user actions          | [alert.md](components/alert.md)                     |
| Avatar         | Visual representation of users or entities             | [avatar.md](components/avatar.md)                   |
| Badge          | Small status labels, counters, or tags                 | [badge.md](components/badge.md)                     |
| Breadcrumb     | Navigation showing current location in hierarchy       | [breadcrumb.md](components/breadcrumb.md)           |
| Button         | Clickable triggers for actions and navigation          | [button.md](components/button.md)                   |
| Card           | Flexible content container with optional header/footer | [card.md](components/card.md)                       |
| CardList       | Grid or list of selectable cards                       | [card-list.md](components/card-list.md)             |
| Carousel       | Slideshow for cycling through elements                 | [carousel.md](components/carousel.md)               |
| Checkbox       | Boolean input for single on/off selection              | [checkbox.md](components/checkbox.md)               |
| CheckboxGroup  | Group of related checkboxes with shared state          | [checkbox-group.md](components/checkbox-group.md)   |
| Dropdown       | Toggle-triggered menu with options                     | [dropdown.md](components/dropdown.md)               |
| Icon           | SVG icon component with sizing                         | [icon.md](components/icon.md)                       |
| Input          | Single-line text input field                           | [input.md](components/input.md)                     |
| ListGroup      | Flexible list display for series of content            | [list-group.md](components/list-group.md)           |
| Modal          | Dialog overlay for focused interactions                | [modal.md](components/modal.md)                     |
| Navbar         | Responsive navigation header                           | [navbar.md](components/navbar.md)                   |
| Pagination     | Navigation between pages of content                    | [pagination.md](components/pagination.md)           |
| Popover        | Interactive popup with rich content                    | [popover.md](components/popover.md)                 |
| Progress       | Visual indicator for completion percentage             | [progress.md](components/progress.md)               |
| Radio          | Single selection from mutually exclusive options       | [radio.md](components/radio.md)                     |
| Scrollspy      | Navigation that highlights based on scroll position    | [scrollspy.md](components/scrollspy.md)             |
| Select         | Dropdown for selecting from predefined options         | [select.md](components/select.md)                   |
| SelectableCard | Card variant that can be selected/toggled              | [selectable-card.md](components/selectable-card.md) |
| Sheet          | Slide-in panel from screen edge                        | [sheet.md](components/sheet.md)                     |
| Spinner        | Loading indicator animation                            | [spinner.md](components/spinner.md)                 |
| Switch         | Toggle switch for binary settings                      | [switch.md](components/switch.md)                   |
| Table          | Tabular data display with sorting/pagination           | [table.md](components/table.md)                     |
| Tabs           | Organize content into switchable panels                | [tabs.md](components/tabs.md)                       |
| TabsPro        | Advanced tabs with more features                       | [tabs-pro.md](components/tabs-pro.md)               |
| Toast          | Temporary notification messages                        | [toast.md](components/toast.md)                     |
| Tooltip        | Hover-triggered informational popup                    | [tooltip.md](components/tooltip.md)                 |
| Typography     | Text styling components (headings, paragraphs)         | [typography.md](components/typography.md)           |

## General Component Usage

### Common Props

Most DSAi components accept these common props:

- `className`: Additional CSS classes (use sparingly, prefer variants)
- `disabled`: Boolean to disable the component
- `data-*`: Data attributes are always allowed
- `aria-*`: ARIA attributes for accessibility
- Components extend base element types (e.g., Button extends `<button>` props)

IMPORTANT: Do not override component styles with inline styles unless absolutely necessary. Prefer using variants and sizes.

### Controlled vs Uncontrolled

- **Controlled**: Component receives `value` and `onChange` props, parent manages state
- **Uncontrolled**: Component manages own state, use `defaultValue` for initial value
- Prefer controlled components for forms and data-driven UI

### Sizing

Most components support a `size` prop:

- `"sm"` - Small (24px height, compact UI)
- `"md"` - Medium (32px height, default)
- `"lg"` - Large (40px height, prominent UI)

### Variants

Button, Alert, Badge, and Progress support semantic variants:

```tsx
// Primary - Main actions (blue)
<Button variant="primary">Save</Button>

// Secondary - Secondary actions (gray)
<Button variant="secondary">Cancel</Button>

// Success - Positive feedback (green)
<Alert variant="success">Saved successfully!</Alert>

// Danger - Destructive actions or errors (red)
<Button variant="danger">Delete</Button>

// Warning - Caution indicators (yellow)
<Alert variant="warning">This action cannot be undone</Alert>

// Info - Informational messages (cyan)
<Badge variant="info">New</Badge>
```

### Component Selection Guide

**Choose Button when:**

- User needs to trigger an action
- Navigating to a new page (use `as="a"` with `href`)

**Choose Input vs Select:**

- Use `Input` for freeform text entry
- Use `Select` for choosing from 4-20 predefined options
- Use `Radio` for 2-4 mutually exclusive options

**Choose Modal vs Sheet:**

- Use `Modal` for focused tasks requiring attention
- Use `Sheet` for supplementary content that doesn't block workflow

**Choose Toast vs Alert:**

- Use `Toast` for temporary, auto-dismissing notifications
- Use `Alert` for persistent messages that require acknowledgment
