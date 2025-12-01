# DSAi Icon Generator

Tools for generating React icon components from Figma icons.

## Overview

This directory contains two approaches for extracting icons from Figma and generating DSAi-compatible React components:

1. **REST API Script** (`app.mjs`) - Node.js script that fetches icons via Figma REST API
2. **Figma Plugin** (`figma-plugin-icons-tsx/`) - Plugin that runs directly in Figma

Both tools generate:

- Individual icon components with full accessibility support
- Index file with all exports
- Figma Code Connect mappings

## Output Format

Generated icons match the DSAi Icon component pattern:

```tsx
import { forwardRef, useMemo } from 'react';
import type { IconProps } from '../types';

export const ArrowRightIcon = forwardRef<SVGSVGElement, IconProps>(
  (
    { size = 16, color = 'currentColor', className, title, 'aria-label': ariaLabel, ...props },
    ref
  ) => {
    // Full accessibility support
    const isDecorative = !ariaLabel && !title;
    const computedAriaHidden = isDecorative ? true : ariaLabel ? undefined : props['aria-hidden'];

    return (
      <svg
        ref={ref}
        viewBox="0 0 16 16"
        fill={color}
        className={className}
        aria-hidden={computedAriaHidden}
        aria-label={ariaLabel}
        role={ariaLabel ? 'img' : undefined}
        focusable="false"
        {...allowedProps}
      >
        {title && <title>{title}</title>}
        <path d="..." />
      </svg>
    );
  }
);

ArrowRightIcon.displayName = 'ArrowRightIcon';
```

## Method 1: REST API Script

### Setup

1. Create a `.env` file in this directory:

```env
FIGMA_ACCESS_TOKEN=your-personal-access-token
FIGMA_FILE_KEY=your-figma-file-key
```

1. Get your Figma access token from the [Figma API docs](https://www.figma.com/developers/api#access-tokens)
1. Get your file key from your Figma URL: `https://figma.com/design/{FILE_KEY}/...`

### REST API Configuration

Edit `app.mjs` to match your Figma file structure:

```javascript
// The variant name for the base icon size
const ICON_VARIANT_NAME = 'Size=16';

// Node IDs from root to icon parent (Page ID > Section ID)
const ROOT_TRAVERSE_IDS = ['7809:18809', '522:12152'];
```

### Usage

```bash
# Full fetch from Figma API + generate components
node --env-file=.env app.mjs

# Use cached icons.json (skip API calls)
node --env-file=.env app.mjs --skip-rest-api
```

### Output Files

- `packages/@dsai/react/src/components/Icon/components/*.tsx` - Icon components
- `packages/@dsai/react/src/components/Icon/index.ts` - Barrel exports
- `packages/@dsai/react/src/figma/icons/Icons.figma.tsx` - Code Connect

### Intermediate Files

- `icons.json` - Cached icon data (component code + Code Connect)
- `icons-index.txt` - Generated index file
- `Icons.figma.txt` - Generated Code Connect imports

## Method 2: Figma Plugin

### Plugin Setup

1. In Figma, go to **Plugins > Development > Import plugin from manifest...**
2. Select `figma-plugin-icons-tsx/manifest.json`

### Plugin Usage

1. Open your Figma icons file
2. Navigate to the page containing icon component sets
3. Run the plugin from **Plugins > Development > DSAi Icon Generator**
4. Copy the generated code from the plugin UI

### Configuration

Edit `figma-plugin-icons-tsx/code.js`:

```javascript
// URL substitution for Code Connect (matches figma.config.json)
const FIGMA_URL_SUBSTITUTION = '<FIGMA_DSAI_ICONS>';

// Base icon size variant to export
const ICON_VARIANT_SIZE = 16;

// Available sizes in your design system
const DSAI_ICON_SIZES = ['16', '20', '24', '32', '40', '48'];
```

## Figma File Structure

Both tools expect icons to be organized as component sets with size variants:

```text
📁 Icons Page
  📦 arrow-right (Component Set)
    ├─ Size=16 (Component)
    ├─ Size=20 (Component)
    ├─ Size=24 (Component)
    └─ ...
  📦 arrow-left (Component Set)
    └─ ...
```

## Code Connect Integration

Generated Code Connect uses URL substitution compatible with `figma.config.json`:

```json
{
  "codeConnect": {
    "include": ["src/figma/**/*.figma.tsx"],
    "parser": "react"
  },
  "urlSubstitutions": {
    "<FIGMA_DSAI_ICONS>": "https://figma.com/design/YOUR_FILE_KEY"
  }
}
```

## Security Notes

- The REST API script validates Figma S3 URLs against an allowlist
- Filenames are sanitized to prevent path traversal
- All paths are normalized and validated before file operations

## See Also

- [DSAi Icon Component](/packages/@dsai/react/src/components/Icon/)
- [Figma Code Connect Documentation](https://www.figma.com/developers/api#code-connect)
- [Bootstrap Icons](https://icons.getbootstrap.com/) (current icon source)
