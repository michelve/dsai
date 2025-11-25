├── guidelines/
│ ├── Guidelines.md ← Main guidelines file
│ ├── overview-components.md ← Optional: component overview
│ ├── overview-icons.md ← Optional: icon system
│ ├── components/ ← Optional: per-component docs
│ │ ├── button.md
│ │ ├── input.md
│ │ └── ...

Figma Make uses Markdown files in a  guidelines/  folder, not JSON configuration:

example:

# System Guidelines

This project uses the DSAi Design System built with React, TypeScript, and Bootstrap 5.

## Framework & Technology Stack

- **Framework**: React with TypeScript
- **CSS Framework**: Bootstrap 5
- **Design System Package**: `@dsai/react`
- **Design Tokens Package**: `@dsai/tokens`

## Design System Usage

### Component Library

Always import components from `@dsai/react`:

Available components:

- Button
- (Add others as you build them)

### Design Tokens

Design tokens are available via CSS or SCSS:

**CSS Import**:
