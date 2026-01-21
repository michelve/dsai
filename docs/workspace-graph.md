# Workspace Graph

View the DSAi monorepo project graph and dependencies.

## Interactive Graph

Run the following command to open the interactive graph in your browser:

```bash
pnpm nx graph
```

This displays:

- All projects in the monorepo
- Dependencies between projects
- Build/test task relationships

## Export to JSON

For tooling or analysis, export the graph data:

```bash
pnpm nx graph --file=project-graph.json
```

## Via VS Code

If you have the Nx Console extension installed, you can:

1. Open the command palette (`Cmd+Shift+P`)
2. Search for "Nx: Project Graph"
3. View the interactive graph directly in VS Code
