# Token Sync Workflow

Use this workflow to sync design tokens between Figma and your codebase.

## Available Commands

From the playground app or any project with `@dsai-io/figma-tokens`:

```bash
# Export tokens from Figma → local JSON
node figma.config.mjs export

# Sync tokens (pull from Figma or push to Figma)
node figma.config.mjs sync

# Show Figma file info
node figma.config.mjs info

# Full pipeline: Export → Validate → Transform → Build
node figma.config.mjs workflow
```

## Sync Directions

| Direction | Command       | Description                     |
| --------- | ------------- | ------------------------------- |
| `pull`    | Figma → Local | Fetch latest tokens from Figma  |
| `push`    | Local → Figma | Update Figma with local changes |
| `both`    | Bidirectional | Merge changes from both sides   |

## Conflict Resolution

When tokens differ between Figma and local:

| Strategy | Description                   |
| -------- | ----------------------------- |
| `remote` | Figma wins (default for pull) |
| `local`  | Local wins (default for push) |
| `manual` | Prompt for each conflict      |

## After Sync

Run the token build pipeline:

```bash
pnpm dsai tokens build
```

This generates:

- CSS custom properties (`dsai-theme.css`)
- JavaScript/TypeScript exports
- SCSS variables
- JSON for tooling

## Example Prompts

### Sync design tokens

```text
Export the latest design tokens from Figma to packages/@dsai-io/tokens/src/figma-exports
```

### Check token differences

```text
Compare the current Figma variables against apps/playground/src/generated/tokens.json
```
