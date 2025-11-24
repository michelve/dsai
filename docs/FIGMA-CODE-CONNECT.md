# Figma Code Connect Setup

This guide explains how to set up and use Figma Code Connect with the DSAi design system.

## What is Code Connect?

[Figma Code Connect](https://www.figma.com/developers/api/code-connect) bridges the gap between Figma designs and your React components. When developers select a component in Figma with Code Connect enabled, AI tools generate code that imports and uses your actual components instead of generic implementations.

## Prerequisites

### 1. Figma Desktop App

Code Connect requires the **Figma Desktop application** (not the web version) because:

- The desktop app runs a local MCP server at `http://127.0.0.1:3845/mcp`
- This server provides access to `get_code_connect_map` and `get_variable_defs`
- The web version only supports the remote server (limited to 4 tools)

**Download**: [Figma Desktop](https://www.figma.com/downloads/)

### 2. Figma Access Token

Generate a personal access token with Code Connect permissions:

1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Navigate to **Personal Access Tokens**
3. Click **Generate new token**
4. Name it (e.g., "Code Connect - DSAi")
5. Select scopes:
   - ✅ **File content** (read)
   - ✅ **Code Connect** (read/write)
6. Copy the token immediately (shown only once)

### 3. Environment Variable

```bash
# Add to your shell profile (.zshrc, .bashrc, etc.)
export FIGMA_ACCESS_TOKEN=figd_your_token_here

# Or create .env file (add to .gitignore!)
FIGMA_ACCESS_TOKEN=figd_your_token_here
```

## Project Structure

```
dsai/
├── figma.config.json                           # Code Connect configuration
├── packages/@dsai/react/
│   └── src/
│       └── Button/
│           ├── Button.tsx                      # React component
│           ├── Button.figma.tsx                # Code Connect mapping
│           ├── Button.types.ts                 # TypeScript types
│           └── Button.test.tsx                 # Tests
```

## Configuration: figma.config.json

The configuration uses **URL substitution variables** for maintainability:

```json
{
  "$schema": "https://www.figma.com/developers/api/code-connect/schema",
  "codeConnect": {
    "include": ["packages/@dsai/react/src/**/*.figma.tsx"],
    "exclude": ["**/*.test.tsx", "**/*.spec.tsx", "**/node_modules/**", "**/dist/**"],
    "importPaths": {
      "packages/@dsai/react/src": "@dsai/react"
    },
    "parser": "react"
  },
  "documentUrlSubstitutions": {
    "<FIGMA_DSAI_BUTTON>": "https://www.figma.com/design/FILE_ID/DSAi?node-id=123-456"
  }
}
```

### Configuration Fields

| Field                      | Description                                |
| -------------------------- | ------------------------------------------ |
| `include`                  | Glob patterns for mapping files            |
| `exclude`                  | Patterns to ignore                         |
| `importPaths`              | Map source paths to package imports        |
| `parser`                   | Framework parser (`react`, `vue`, `swift`) |
| `documentUrlSubstitutions` | URL variables for reusable mappings        |

### Why URL Substitutions?

Instead of hardcoding URLs in every mapping file:

```typescript
// ❌ Brittle - breaks if you copy to another file
figma.connect(Button, 'https://figma.com/file/abc123?node-id=123', { ... });
```

Use substitution variables:

```typescript
// ✅ Reusable - change URL in one place
figma.connect(Button, '<FIGMA_DSAI_BUTTON>', { ... });
```

**Benefits**:

- Change Figma file → update one config value
- Copy components between projects → just update config
- Works with Figma branching → swap URLs for different branches

## Creating Mappings

### Step 1: Get Figma Component URL

1. Open your Figma design system file
2. Select the **main component** (not an instance)
3. Right-click → "Copy link to selection"
4. Add to `documentUrlSubstitutions` in `figma.config.json`

### Step 2: Create Mapping File

Create `ComponentName.figma.tsx` next to your component:

```typescript
import figma from '@figma/code-connect';
import { Button } from './Button';

figma.connect(Button, '<FIGMA_DSAI_BUTTON>', {
  props: {
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
    }),
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),
    disabled: figma.boolean('Disabled'),
    children: figma.string('Label'),
  },
  example: ({ variant, size, disabled, children }) => (
    <Button variant={variant} size={size} disabled={disabled}>
      {children}
    </Button>
  ),
});
```

### Property Mapping Types

| Figma Property | Code Connect Method | Use Case                           |
| -------------- | ------------------- | ---------------------------------- |
| Variant/Enum   | `figma.enum()`      | Map variant options to prop values |
| Boolean        | `figma.boolean()`   | Map on/off states                  |
| Text           | `figma.string()`    | Map text content                   |
| Instance       | `figma.instance()`  | Map nested components              |
| Children       | `figma.children()`  | Map arbitrary nested content       |

## Publishing

### Preview (Dry Run)

```bash
pnpm figma:publish:dry
```

Shows what will be published without actually publishing.

### Publish to Figma

```bash
pnpm figma:publish
```

Expected output:

```
✓ Parsing Code Connect files...
✓ Found 1 connection
✓ Validating connections...
✓ Publishing to Figma...
✓ Published successfully!
```

## Verification

### 1. Figma Dev Mode

1. Open Figma Desktop
2. Enter Dev Mode (Shift + D)
3. Select a component instance
4. Check **Code** panel shows:
   - ✅ Correct import path (`@dsai/react`)
   - ✅ Correct component name
   - ✅ Correct props with values from design

### 2. AI Generation Test

When using Figma MCP, AI should generate:

```tsx
import { Button } from '@dsai/react';

<Button variant="primary" size="md">
  Click me
</Button>;
```

## Troubleshooting

### "Connection not found in Figma"

| Cause               | Solution                                   |
| ------------------- | ------------------------------------------ |
| Wrong node ID       | Copy URL from main component, not instance |
| Wrong file          | Verify `documentUrlSubstitutions` URL      |
| Missing permissions | Regenerate token with "Code Connect" scope |
| Cache issue         | Close/reopen file in Figma                 |

### "Props not mapping correctly"

Figma property names must match **exactly** (case-sensitive):

```typescript
// ❌ Wrong - case mismatch
variant: figma.enum('variant', { ... })  // Figma has "Variant"

// ✅ Correct
variant: figma.enum('Variant', { ... })
```

### "Import path incorrect"

Check `importPaths` in `figma.config.json`:

```json
"importPaths": {
  "packages/@dsai/react/src": "@dsai/react"
}
```

## Best Practices

### 1. Co-locate Mapping Files

```
✅ Good - mapping next to component
Button/
├── Button.tsx
└── Button.figma.tsx

❌ Bad - mappings in separate folder
src/
├── components/Button.tsx
└── figma/Button.figma.tsx
```

### 2. Use URL Substitutions

```typescript
// ✅ Reusable
figma.connect(Button, '<FIGMA_DSAI_BUTTON>', { ... });

// ❌ Brittle
figma.connect(Button, 'https://figma.com/file/...', { ... });
```

### 3. Match Figma Naming to Code

| Figma Property   | Code Prop           |
| ---------------- | ------------------- |
| Variant: Primary | `variant="primary"` |
| Size: Large      | `size="lg"`         |
| Disabled: true   | `disabled={true}`   |

### 4. Version Control

Commit mapping files alongside components:

```bash
git add src/Button/Button.tsx
git add src/Button/Button.figma.tsx
git commit -m "Add Button with Code Connect mapping"
```

## Available Scripts

| Script                   | Description                |
| ------------------------ | -------------------------- |
| `pnpm figma:connect`     | Run Code Connect CLI       |
| `pnpm figma:publish`     | Publish mappings to Figma  |
| `pnpm figma:publish:dry` | Preview without publishing |

## Resources

- [Figma Code Connect Documentation](https://www.figma.com/developers/api/code-connect)
- [Code Connect GitHub](https://github.com/figma/code-connect)
- [Complete Guide to Figma MCP](https://github.com/michelve/figma-code-connect-docs)
- [Code Connect Setup Guide](https://github.com/michelve/figma-code-connect-docs/blob/main/04-code-connect-setup.md)
