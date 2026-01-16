# Token Examples

Detailed examples for creating and managing DSAi design tokens.

## DTCG Token Format Examples

### Basic Color Token

```json
{
  "color": {
    "blue": {
      "500": {
        "$value": "#0a58ca",
        "$type": "color",
        "$description": "Primary brand color. Use for primary actions and links.",
        "$extensions": {
          "docs": {
            "reference": "https://getbootstrap.com/docs/5.3/customize/color/",
            "section": "Customization",
            "subsection": "Colors - Brand - Blue"
          },
          "platform": {
            "scssVariableName": "$color-blue-500",
            "bootstrapVersion": "5.3"
          }
        }
      }
    }
  }
}
```

### Semantic Color (Reference)

```json
{
  "theme": {
    "primary": {
      "$value": "{color.blue.500}",
      "$type": "color",
      "$description": "Primary theme color for CTAs and links"
    },
    "secondary": {
      "$value": "{color.gray.500}",
      "$type": "color",
      "$description": "Secondary theme color for less prominent actions"
    },
    "success": {
      "$value": "{color.green.500}",
      "$type": "color",
      "$description": "Success state color for confirmations"
    },
    "danger": {
      "$value": "{color.red.500}",
      "$type": "color",
      "$description": "Danger state color for errors and destructive actions"
    },
    "warning": {
      "$value": "{color.yellow.500}",
      "$type": "color",
      "$description": "Warning state color for caution messages"
    },
    "info": {
      "$value": "{color.cyan.500}",
      "$type": "color",
      "$description": "Info state color for informational messages"
    }
  }
}
```

### Typography Tokens

```json
{
  "typography": {
    "fontFamily": {
      "base": {
        "$value": "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        "$type": "fontFamily",
        "$description": "Primary font family for body text and UI elements"
      },
      "heading": {
        "$value": "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        "$type": "fontFamily",
        "$description": "Font family for headings (same as base for brand consistency)"
      },
      "monospace": {
        "$value": "Roboto Mono, SFMono-Regular, Menlo, Monaco, monospace",
        "$type": "fontFamily",
        "$description": "Monospace font for code blocks and technical content"
      }
    },
    "fontSize": {
      "xs": {
        "$value": "12px",
        "$type": "dimension",
        "$description": "Extra small text for captions and labels"
      },
      "sm": {
        "$value": "14px",
        "$type": "dimension",
        "$description": "Small text for secondary content"
      },
      "base": {
        "$value": "16px",
        "$type": "dimension",
        "$description": "Base font size for body text"
      },
      "lg": {
        "$value": "18px",
        "$type": "dimension",
        "$description": "Large text for emphasis"
      },
      "xl": {
        "$value": "20px",
        "$type": "dimension",
        "$description": "Extra large text for subheadings"
      },
      "2xl": {
        "$value": "24px",
        "$type": "dimension",
        "$description": "Heading level 4 size"
      },
      "3xl": {
        "$value": "30px",
        "$type": "dimension",
        "$description": "Heading level 3 size"
      },
      "4xl": {
        "$value": "36px",
        "$type": "dimension",
        "$description": "Heading level 2 size"
      },
      "5xl": {
        "$value": "48px",
        "$type": "dimension",
        "$description": "Heading level 1 size"
      }
    },
    "fontWeight": {
      "light": {
        "$value": "300",
        "$type": "fontWeight",
        "$description": "Light weight for decorative text"
      },
      "normal": {
        "$value": "400",
        "$type": "fontWeight",
        "$description": "Normal weight for body text"
      },
      "medium": {
        "$value": "500",
        "$type": "fontWeight",
        "$description": "Medium weight for emphasis"
      },
      "semibold": {
        "$value": "600",
        "$type": "fontWeight",
        "$description": "Semibold weight for subheadings"
      },
      "bold": {
        "$value": "700",
        "$type": "fontWeight",
        "$description": "Bold weight for headings"
      }
    },
    "lineHeight": {
      "tight": {
        "$value": "1.25",
        "$type": "number",
        "$description": "Tight line height for headings"
      },
      "normal": {
        "$value": "1.5",
        "$type": "number",
        "$description": "Normal line height for body text"
      },
      "relaxed": {
        "$value": "1.75",
        "$type": "number",
        "$description": "Relaxed line height for improved readability"
      }
    }
  }
}
```

### Spacing Tokens

```json
{
  "spacing": {
    "0": {
      "$value": "0px",
      "$type": "dimension",
      "$description": "No spacing"
    },
    "1": {
      "$value": "4px",
      "$type": "dimension",
      "$description": "Extra small spacing (0.25rem)"
    },
    "2": {
      "$value": "8px",
      "$type": "dimension",
      "$description": "Small spacing (0.5rem)"
    },
    "3": {
      "$value": "16px",
      "$type": "dimension",
      "$description": "Base spacing (1rem)"
    },
    "4": {
      "$value": "24px",
      "$type": "dimension",
      "$description": "Medium spacing (1.5rem)"
    },
    "5": {
      "$value": "48px",
      "$type": "dimension",
      "$description": "Large spacing (3rem)"
    },
    "6": {
      "$value": "64px",
      "$type": "dimension",
      "$description": "Extra large spacing (4rem)"
    },
    "7": {
      "$value": "80px",
      "$type": "dimension",
      "$description": "2XL spacing (5rem)"
    },
    "8": {
      "$value": "96px",
      "$type": "dimension",
      "$description": "3XL spacing (6rem)"
    }
  }
}
```

### Border Tokens

```json
{
  "border": {
    "radius": {
      "none": {
        "$value": "0px",
        "$type": "dimension",
        "$description": "No border radius"
      },
      "sm": {
        "$value": "4px",
        "$type": "dimension",
        "$description": "Small border radius for subtle rounding"
      },
      "md": {
        "$value": "8px",
        "$type": "dimension",
        "$description": "Medium border radius for cards and inputs"
      },
      "lg": {
        "$value": "12px",
        "$type": "dimension",
        "$description": "Large border radius for modals and panels"
      },
      "xl": {
        "$value": "16px",
        "$type": "dimension",
        "$description": "Extra large border radius"
      },
      "full": {
        "$value": "9999px",
        "$type": "dimension",
        "$description": "Fully rounded (pill shape)"
      }
    },
    "width": {
      "none": {
        "$value": "0px",
        "$type": "dimension",
        "$description": "No border"
      },
      "thin": {
        "$value": "1px",
        "$type": "dimension",
        "$description": "Thin border for subtle separation"
      },
      "medium": {
        "$value": "2px",
        "$type": "dimension",
        "$description": "Medium border for emphasis"
      },
      "thick": {
        "$value": "4px",
        "$type": "dimension",
        "$description": "Thick border for strong emphasis"
      }
    }
  }
}
```

### Shadow Tokens

```json
{
  "shadow": {
    "none": {
      "$value": "none",
      "$type": "shadow",
      "$description": "No shadow"
    },
    "sm": {
      "$value": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "$type": "shadow",
      "$description": "Small shadow for subtle depth"
    },
    "md": {
      "$value": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      "$type": "shadow",
      "$description": "Medium shadow for cards and dropdowns"
    },
    "lg": {
      "$value": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      "$type": "shadow",
      "$description": "Large shadow for modals and popovers"
    },
    "xl": {
      "$value": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      "$type": "shadow",
      "$description": "Extra large shadow for floating elements"
    }
  }
}
```

## Configuration Examples

### Full dsai.config.mjs

```javascript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  // Global settings
  global: {
    debug: process.env['DEBUG'] === 'true',
    logLevel: process.env['LOG_LEVEL'] ?? 'info',
  },

  // Token configuration
  tokens: {
    // Source type
    source: 'theme',

    // Directories
    sourceDir: './src/figma-exports',
    collectionsDir: './src',
    outputDir: './src/generated',

    // CSS variable prefix
    prefix: '--dsai-',

    // Base font size for rem calculations
    baseFontSize: 16,

    // Output references in generated files
    outputReferences: true,

    // Output formats
    formats: ['css', 'js', 'ts', 'scss', 'json'],

    // Build pipeline
    pipeline: {
      steps: ['validate', 'transform', 'style-dictionary', 'postprocess'],
    },
  },
});
```

### Minimal Configuration

```javascript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    sourceDir: './tokens',
    outputDir: './dist',
    prefix: '--app-',
  },
});
```

## CSS Output Examples

### Light Mode Variables

```css
:root {
  /* Colors - Blue */
  --dsai-color-blue-50: #ebf3fc;
  --dsai-color-blue-100: #d7e6f9;
  --dsai-color-blue-500: #0a58ca;
  --dsai-color-blue-900: #052c65;

  /* Theme Colors */
  --dsai-theme-primary: var(--dsai-color-blue-500);
  --dsai-theme-secondary: var(--dsai-color-gray-500);

  /* Typography */
  --dsai-typography-font-family-base: Inter, system-ui, sans-serif;
  --dsai-typography-font-size-base: 16px;

  /* Spacing */
  --dsai-spacing-0: 0px;
  --dsai-spacing-1: 4px;
  --dsai-spacing-2: 8px;
  --dsai-spacing-3: 16px;
  --dsai-spacing-4: 24px;
  --dsai-spacing-5: 48px;
}
```

### Dark Mode Variables

```css
[data-theme='dark'] {
  /* Invert color scales for dark mode */
  --dsai-color-gray-50: #212529;
  --dsai-color-gray-100: #343a40;
  --dsai-color-gray-900: #f8f9fa;

  /* Adjusted theme colors */
  --dsai-theme-primary: var(--dsai-color-blue-400);
}
```

## Adding New Tokens Workflow

### Step 1: Create Token File

```bash
# Create a new token category
touch src/collections/animation/timing.json
```

### Step 2: Define Tokens

```json
{
  "animation": {
    "duration": {
      "fast": {
        "$value": "150ms",
        "$type": "duration",
        "$description": "Fast animations for micro-interactions"
      },
      "normal": {
        "$value": "300ms",
        "$type": "duration",
        "$description": "Normal animation duration"
      },
      "slow": {
        "$value": "500ms",
        "$type": "duration",
        "$description": "Slow animations for emphasis"
      }
    },
    "easing": {
      "ease-in": {
        "$value": "cubic-bezier(0.4, 0, 1, 1)",
        "$type": "cubicBezier",
        "$description": "Ease-in for elements entering"
      },
      "ease-out": {
        "$value": "cubic-bezier(0, 0, 0.2, 1)",
        "$type": "cubicBezier",
        "$description": "Ease-out for elements exiting"
      },
      "ease-in-out": {
        "$value": "cubic-bezier(0.4, 0, 0.2, 1)",
        "$type": "cubicBezier",
        "$description": "Standard easing for most animations"
      }
    }
  }
}
```

### Step 3: Validate

```bash
dsai tokens validate
```

### Step 4: Build

```bash
dsai tokens build
```
