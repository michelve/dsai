# DSAi Design System

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/1180f39c3f7647dab2b4b09b3a569fee)](https://app.codacy.com?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

![CI](https://github.com/michelve/DSAi/workflows/CI/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A comprehensive React component library and design system built with Nx, providing Bootstrap-compatible components with modern architecture and Figma integration.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd DSAi

# Install dependencies
pnpm install

# Start development (all packages in watch mode)
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# View project dependency graph
pnpm graph
```

## Repository Structure

```
├── packages/
│   └── @dsai/
│       ├── tokens/              # Design tokens (colors, typography, spacing)
│       ├── react/               # React components
│       ├── figma-tokens/        # Figma integration utilities
│       ├── storybook/           # Component documentation
│       └── docs/                # Documentation site
├── apps/
│   └── playground/              # Development playground
├── .github/                     # GitHub Actions workflows
├── tools/                       # Build and development tools
└── docs/                        # Project documentation
```

## Code Quality

### TypeScript Configuration

We use TypeScript in strict mode with comprehensive type checking:

- **Strict Mode**: All strict compiler options enabled
- **Path Mappings**: Import packages using `@dsai/*` scope
- **Project References**: Incremental builds with composite projects
- **Type Safety**: No implicit `any`, null checks, unused variable detection

See [TYPESCRIPT-ESLINT-PRETTIER.md](./docs/TYPESCRIPT-ESLINT-PRETTIER.md) for details.

### ESLint

Comprehensive linting with multiple rule sets:

- **TypeScript**: Best practices and type safety
- **React**: Component patterns and JSX conventions
- **React Hooks**: Rules of hooks and dependency checking
- **Accessibility**: WCAG 2.1 AA compliance (jsx-a11y)
- **Import**: Organization and circular dependency prevention

### Prettier

Consistent code formatting across the codebase:

- 100 character line width
- 2 space indentation
- Single quotes for strings
- Integrated with ESLint

### Git Hooks

Pre-commit hooks automatically run:

- ESLint with auto-fix
- Prettier formatting
- Only on staged files (fast and efficient)

## 📚 Packages

### @dsai/tokens

Design tokens for the component library including:

- **66 color tokens** (primary, secondary, success, etc.)
- **Typography system** (Poppins for headings, Inter for body)
- **Spacing scale** (4px base unit)
- **Shadows, borders, and effects**

Export formats: CSS custom properties, SCSS variables, JavaScript/TypeScript

### @dsai/react

React component library with 38 components:

- **Form controls**: Button, Input, Select, Checkbox, Radio, Switch
- **Navigation**: Navbar, Tabs, Breadcrumb, Pagination
- **Feedback**: Alert, Toast, Modal, Tooltip, Popover
- **Layout**: Card, Grid, Container, Stack
- **Data display**: Table, List, Badge, Progress
- **And more...**

Built with:

- TypeScript (strict mode)
- CSS Modules for styling
- Accessible by default (WCAG 2.1 AA)
- Tree-shakeable exports
- 90%+ test coverage target

### @dsai/storybook

Interactive component documentation powered by Storybook 7:

- Visual component showcase
- Props documentation
- Accessibility testing
- Design token integration
- Code examples

### @dsai/figma-tokens

Figma integration utilities:

- Token synchronization
- Code Connect mappings
- Design-to-code workflow automation

### @dsai/docs

Comprehensive documentation site:

- Getting started guides
- Component API documentation
- Design principles
- Migration guides

## 🛠️ Development Workflow

### Working on Components

```bash
# Start Storybook for component development
pnpm --filter @dsai/storybook storybook

# Build tokens (run this first when starting)
pnpm --filter @dsai/tokens build

# Build React components
pnpm --filter @dsai/react build

# Run component tests
pnpm --filter @dsai/react test

# Lint and fix components
pnpm --filter @dsai/react lint --fix

# Format code
pnpm prettier --write "packages/@dsai/react/**/*.{ts,tsx}"
```

### Code Quality Commands

```bash
# Lint all packages
pnpm lint

# Lint specific package
pnpm nx lint @dsai/react

# Lint with auto-fix
pnpm nx lint @dsai/react --fix

# Format all files
pnpm format

# Check formatting
pnpm prettier --check "."

# Type check (no emit)
pnpm tsc --noEmit
```

### Building Everything

```bash
# Build all packages
pnpm build

# Build only affected packages (after changes)
pnpm affected:build

# Test only affected packages
pnpm affected:test
```

### Using Nx Commands

```bash
# Show all projects
pnpm nx show projects

# View dependency graph
pnpm nx graph

# Run specific target for specific project
pnpm nx build @dsai/tokens

# Run target for multiple projects
pnpm nx run-many --target=build --projects=@dsai/tokens,@dsai/react

# Clear Nx cache
pnpm nx reset
```

## 🏗️ Architecture

### Monorepo Benefits

- **Shared dependencies**: Single node_modules for all packages
- **Atomic commits**: Change multiple packages in one commit
- **Code sharing**: Easy cross-package imports
- **Consistent tooling**: Shared TypeScript, ESLint, testing configs
- **Smart caching**: Nx only rebuilds what changed

### Package Dependencies

```
@dsai/tokens (base layer - design tokens)
    ↓
@dsai/react (components consuming tokens)
    ↓
@dsai/storybook (documentation)
@dsai/docs (website)
apps/playground (testing)
```

### Build System

- **Nx**: Task orchestration and caching
- **pnpm**: Fast, disk-efficient package manager
- **TypeScript**: Type-safe development
- **Rollup/tsup**: Bundle libraries for distribution

## 🧪 Testing Strategy

- **Unit tests**: Jest + React Testing Library
- **Visual regression**: Storybook + Chromatic
- **Accessibility**: axe-core integration
- **E2E**: Playwright (for playground app)

## 📝 Coding Standards

- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Semantic versioning for releases
- Conventional commits for changelog generation
- 90%+ test coverage requirement

## 🔧 Prerequisites

- **Node.js**: v18+ (v24.4.1 recommended)
- **pnpm**: v8+ (v10.13.1 recommended)
- **Git**: For version control

## 📖 Documentation

- [Roadmap](./ROADMAP/README.md) - Project roadmap and planning
- [Tasks](./tasks/) - Detailed task specifications
- Component docs - Coming soon in @dsai/docs

## 🤝 Contributing

1. Pick a task from [tasks/](./tasks/)
2. Create a feature branch
3. Implement with tests and documentation
4. Run quality checks: `pnpm test && pnpm lint`
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Related Resources

- [Nx Documentation](https://nx.dev)
- [pnpm Documentation](https://pnpm.io)
- [React Documentation](https://react.dev)
- [Storybook Documentation](https://storybook.js.org)

---

**Current Status**: Phase 0 - Foundation setup complete ✅
**Next Steps**: Configure TypeScript (TASK-002), Build pipeline (TASK-003)

## Run tasks

To run tasks with Nx use:

```sh
npx nx <target> <project-name>
```

For example:

```sh
npx nx build myproject
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

To install a new plugin you can use the `nx add` command. Here's an example of adding the React plugin:

```sh
npx nx add @nx/react
```

Use the plugin's generator to create new projects. For example, to create a new React app or library:

```sh
# Generate an app
npx nx g @nx/react:app demo

# Generate a library
npx nx g @nx/react:lib some-lib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
