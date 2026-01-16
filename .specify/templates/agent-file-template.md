# DSAi Development Guidelines

Auto-generated from component plans. Last updated: [DATE]

## Active Technologies

- React 18+ with TypeScript strict mode
- Bootstrap 5.3 with SCSS Modules
- Jest 30.x + RTL 16.x + jest-axe 10.x
- Storybook 10
- Style Dictionary 5.1.1 for design tokens
- Nx for monorepo management

## Project Structure

```text
packages/@dsai-io/react/src/components/
├── {ComponentName}/
│   ├── {ComponentName}.tsx
│   ├── {ComponentName}.test.tsx
│   ├── {ComponentName}.module.scss
│   ├── {ComponentName}.figma.tsx
│   ├── {ComponentName}.types.ts
│   └── index.ts
└── index.ts

packages/@dsai-io/storybook/docs/components/
├── {ComponentName}/
│   ├── {ComponentName}.stories.tsx
│   └── {ComponentName}.mdx
└── index.ts
```

## Commands

```bash
# Run all tests
pnpm test

# Run specific component tests
nx test @dsai-io/react --testFile={ComponentName}

# Run tests with coverage
nx test @dsai-io/react --coverage

# Lint
nx lint @dsai-io/react

# Build
nx build @dsai-io/react

# Storybook
nx storybook @dsai-io/storybook

# Figma Code Connect
figma connect publish
```

## Code Style

### TypeScript

- Use TypeScript strict mode
- No `any` types without justification
- Prefer explicit types over inference for public APIs
- Use JSDoc for all public props and functions

### React

- Named exports only (no default exports)
- No unrestricted prop spreading
- All event handlers explicitly defined
- Use `React.memo` for complex components

### CSS

- CSS Modules only (no inline styles)
- All values from design tokens
- Bootstrap 5 class patterns

## Recent Changes

- [COMPONENT]: Added [details]

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
