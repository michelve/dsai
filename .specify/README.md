# .specify Directory

DSAi's Spec-Driven Development toolkit for component development.
Inspired by [Bitovi's SpecKit](https://github.com/bitovi/carton-case-management) but optimized for design system components.

## Quick Start

```bash
# Create a new component specification
./.specify/scripts/bash/new-component.sh Button

# Check prerequisites before implementation
./.specify/scripts/bash/check-prerequisites.sh Button

# Scaffold component files
./.specify/scripts/bash/scaffold-component.sh Button

# Validate component against quality gates
./.specify/scripts/bash/validate-component.sh Button
```

## Structure

```text
.specify/
├── README.md                      # This file
├── memory/
│   └── constitution.md            # Non-negotiable rules (Security, A11y, Testing)
├── specs/
│   └── {ComponentName}/           # Per-component specifications
│       ├── spec.md                # Requirements & acceptance criteria
│       ├── plan.md                # Technical approach & phases
│       ├── tasks.md               # Detailed task breakdown
│       └── checklist.md           # Quality gates for sign-off
├── templates/
│   ├── component-spec.md          # Specification template
│   ├── component-plan.md          # Implementation plan template
│   ├── component-tasks.md         # Task breakdown template
│   ├── component-checklist.md     # Quality checklist template
│   └── agent-file-template.md     # AGENTS.md template
└── scripts/
    └── bash/
        ├── common.sh              # Shared functions
        ├── new-component.sh       # Create new component spec
        ├── check-prerequisites.sh # Validate before implementation
        ├── scaffold-component.sh  # Create component files
        └── validate-component.sh  # Run quality checks
```

## Workflow

### 1. Specify (Define Requirements)

```bash
./.specify/scripts/bash/new-component.sh DatePicker --branch
```

Creates:

- `.specify/specs/DatePicker/spec.md` - Define what the component does
- `.specify/specs/DatePicker/plan.md` - Define how to build it
- `.specify/specs/DatePicker/tasks.md` - Break down into tasks
- `.specify/specs/DatePicker/checklist.md` - Quality gates

### 2. Plan (Review Approach)

Edit the generated files:

1. Fill out `spec.md` with user scenarios, requirements, props
2. Review `plan.md` for Constitution compliance
3. Customize `tasks.md` with specific file paths

### 3. Implement (Build Component)

```bash
# Check prerequisites
./.specify/scripts/bash/check-prerequisites.sh DatePicker

# Scaffold component files
./.specify/scripts/bash/scaffold-component.sh DatePicker
```

Creates:

- `packages/@dsai-io/react/src/components/DatePicker/DatePicker.tsx`
- `packages/@dsai-io/react/src/components/DatePicker/DatePicker.test.tsx`
- `packages/@dsai-io/react/src/components/DatePicker/DatePicker.types.ts`
- `packages/@dsai-io/react/src/components/DatePicker/DatePicker.figma.tsx`
- `packages/@dsai-io/react/src/components/DatePicker/index.ts`

### 4. Validate (Quality Gates)

```bash
./.specify/scripts/bash/validate-component.sh DatePicker
```

Checks:

- Files exist
- Lint passes
- Tests pass
- No security violations
- jest-axe passes

### 5. Complete (Sign-off)

Use `checklist.md` for final sign-off before merging.

## Constitution

The [constitution.md](memory/constitution.md) defines non-negotiable rules:

| Category | Key Rules |
| -------- | --------- |
| Security | No prop spreading, explicit handlers, validate input |
| Accessibility | WCAG 2.2 AA, keyboard navigation, jest-axe tests |
| Testing | 95%+ coverage, RTL, jest-axe |
| Performance | Bundle size < 3KB, memoization |
| Documentation | Storybook stories, Figma Code Connect |

All templates include Constitution checkpoints.

## Templates

| Template | Purpose |
| -------- | ------- |
| `component-spec.md` | User scenarios, requirements, props interface, Figma mapping |
| `component-plan.md` | Technical approach, Constitution check, implementation phases |
| `component-tasks.md` | Phased task breakdown with parallel execution markers |
| `component-checklist.md` | Pre-completion quality gates aligned with Constitution |

## Comparison: DSAi vs Bitovi SpecKit

| Feature | Bitovi | DSAi |
| ------- | ------ | ---- |
| Target | App features | UI Components |
| Constitution | Generic | WCAG 2.2 AA + Security focused |
| Figma Integration | ❌ | ✅ Code Connect templates |
| Accessibility | Basic | jest-axe mandatory |
| Templates | 5 | 4 (component-focused) |
| Scripts | 5 | 4 (simplified) |
| Multi-agent | 15+ agents | Focused on Copilot/Claude |

## Integration with Existing Workflow

This extends DSAi's existing `tasks/` directory:

- `tasks/` - General project tasks (audits, migrations, releases)
- `.specify/specs/` - Component-specific specs (per-component lifecycle)

Both workflows can coexist. Use `.specify/` for new component development.
