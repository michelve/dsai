# Color Descriptions Update

## Summary

Added comprehensive Bootstrap-based descriptions to all color tokens in `colors.json`.

## What Was Added

### Brand Colors (11 color families × 9 shades = 99 tokens)

Each brand color (blue, indigo, purple, pink, red, orange, yellow, green, teal, cyan, gray) now has descriptions for:

- **100-400**: Tint variations with usage guidance
- **500**: Base color with primary usage
- **600-900**: Shade variations with usage contexts

### Neutral Colors

- **white**: Pure white usage
- **black**: Pure black usage
- **gray 100-900**: Alias descriptions referencing brand grays

### Theme Colors (8 tokens)

- **primary**: Main brand color
- **secondary**: Supporting actions
- **success**: Positive feedback
- **info**: Informational content
- **warning**: Cautions and notices
- **danger**: Errors and destructive actions
- **light**: Light backgrounds
- **dark**: Dark backgrounds

## Description Format

All descriptions follow Bootstrap's semantic color system and include:

1. **Color characterization**: Shade/tint level and relationship to base
2. **Usage context**: Where and when to use the color
3. **Practical examples**: Specific UI elements that use this color

## Example Token Structure

```json
{
  "$codeSyntax": {
    "WEB": "var(--bs-blue-500)",
    "ANDROID": "color.blue.500",
    "iOS": "Color.Blue.shade500"
  },
  "$scopes": ["ALL_SCOPES"],
  "$type": "color",
  "$value": "#0d6efd",
  "$description": "Base primary blue. The main brand color for primary actions and emphasis."
}
```

## Figma Plugin Integration

The plugin (`code.js`) now displays:

1. **Description field**: Shows the Bootstrap-based usage description
2. **Code Syntax** (optional): Platform-specific code references appended to description

When a variable is imported to Figma, the description will show:

```
Base primary blue. The main brand color for primary actions and emphasis.

WEB: var(--bs-blue-500)
ANDROID: color.blue.500
iOS: Color.Blue.shade500
```

## Script Used

`scripts/add-color-descriptions.js` - Automatically adds descriptions to all color tokens based on:

- Official Bootstrap color system documentation
- Semantic color usage patterns
- Design system best practices

## Files Updated

- ✅ `collections/colors.json` - All 109+ color tokens now have descriptions
- ✅ `plugin/code.js` - Already configured to display descriptions + codeSyntax
- ✅ `scripts/add-color-descriptions.js` - New script for future updates

## Next Steps

To test in Figma:

1. Open Figma file
2. Run DSAI Import Tokens plugin
3. Upload `colors.json`
4. Select any variable and check the Description field
5. Verify Bootstrap usage guidance appears
