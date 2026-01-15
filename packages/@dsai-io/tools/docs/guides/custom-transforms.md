# Custom Transforms

Learn how to create custom token transformations for specialized output needs.

## Overview

Transforms modify token values during the build process. Common use cases include:

- Converting color formats (hex to HSL, RGB, etc.)
- Adding platform-specific prefixes
- Calculating derivative values (shadows, gradients)
- Custom unit conversions

---

## Creating a Transform

### Basic Transform

```typescript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  transforms: {
    customTransforms: [
      {
        name: 'color/rgba',
        type: 'value',
        matcher: (token) => token.type === 'color',
        transformer: (token) => {
          // Convert hex to RGBA
          const hex = token.value.replace('#', '');
          const r = parseInt(hex.slice(0, 2), 16);
          const g = parseInt(hex.slice(2, 4), 16);
          const b = parseInt(hex.slice(4, 6), 16);
          const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
          return `rgba(${r}, ${g}, ${b}, ${a})`;
        },
      },
    ],
  },
});
```

### Transform Interface

```typescript
interface Transform {
  name: string;
  type: 'value' | 'attribute' | 'name';
  matcher: (token: Token) => boolean;
  transformer: (token: Token, config: ResolvedConfig) => string | object;
}
```

---

## Transform Types

### Value Transforms

Modify the token's output value:

```typescript
{
  name: 'size/pxToRem',
  type: 'value',
  matcher: (token) => token.type === 'size',
  transformer: (token) => {
    const px = parseFloat(token.value);
    return `${px / 16}rem`;
  },
}
```

### Attribute Transforms

Add or modify token attributes:

```typescript
{
  name: 'attribute/category',
  type: 'attribute',
  matcher: () => true,
  transformer: (token) => {
    const parts = token.path.split('/');
    return {
      ...token.attributes,
      category: parts[0],
      group: parts[1],
      item: parts[2],
    };
  },
}
```

### Name Transforms

Modify the token's output name:

```typescript
{
  name: 'name/camelCase',
  type: 'name',
  matcher: () => true,
  transformer: (token) => {
    return token.name
      .split(/[-_]/)
      .map((part, i) => i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  },
}
```

---

## Built-in Transforms

### Color Transforms

| Name         | Description            |
| ------------ | ---------------------- |
| `color/hex`  | Convert to hex format  |
| `color/rgb`  | Convert to RGB format  |
| `color/hsl`  | Convert to HSL format  |
| `color/rgba` | Convert to RGBA format |

### Size Transforms

| Name       | Description          |
| ---------- | -------------------- |
| `size/px`  | Convert to pixels    |
| `size/rem` | Convert to rem units |
| `size/em`  | Convert to em units  |

### Name Transforms

| Name              | Description           |
| ----------------- | --------------------- |
| `name/camelCase`  | Convert to camelCase  |
| `name/kebabCase`  | Convert to kebab-case |
| `name/snakeCase`  | Convert to snake_case |
| `name/pascalCase` | Convert to PascalCase |

---

## Transform Groups

Group related transforms together:

```typescript
export default defineConfig({
  transforms: {
    transformGroups: {
      'web-css': ['color/hex', 'size/rem', 'name/kebabCase'],
      'ios-swift': ['color/rgba', 'size/cgFloat', 'name/camelCase'],
      'android-kotlin': ['color/argb', 'size/dp', 'name/snakeCase'],
    },
  },
});
```

Use a transform group in platforms:

```typescript
export default defineConfig({
  platforms: {
    web: {
      transformGroup: 'web-css',
      buildPath: './dist/web/',
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: './dist/ios/',
    },
  },
});
```

---

## Advanced Patterns

### Conditional Transforms

```typescript
{
  name: 'color/adaptive',
  type: 'value',
  matcher: (token) => token.type === 'color' && token.attributes?.adaptive,
  transformer: (token, config) => {
    if (config.mode === 'dark') {
      return token.darkValue || token.value;
    }
    return token.value;
  },
}
```

### Token References

Access other tokens during transformation:

```typescript
{
  name: 'shadow/resolve',
  type: 'value',
  matcher: (token) => token.type === 'shadow',
  transformer: (token, config) => {
    const { x, y, blur, spread, color } = token.value;

    // Resolve color reference if present
    const resolvedColor = color.startsWith('{')
      ? config.resolveReference(color)
      : color;

    return `${x}px ${y}px ${blur}px ${spread}px ${resolvedColor}`;
  },
}
```

### Composite Transforms

Create complex values from multiple properties:

```typescript
{
  name: 'typography/composite',
  type: 'value',
  matcher: (token) => token.type === 'typography',
  transformer: (token) => {
    const { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } = token.value;
    return {
      fontFamily,
      fontSize: `${fontSize}px`,
      fontWeight,
      lineHeight: `${lineHeight}`,
      letterSpacing: `${letterSpacing}em`,
    };
  },
}
```

---

## Platform-Specific Transforms

Apply different transforms per platform:

```typescript
export default defineConfig({
  platforms: {
    web: {
      transforms: ['color/hex', 'size/rem'],
    },
    ios: {
      transforms: ['color/uicolor', 'size/cgFloat'],
    },
    android: {
      transforms: ['color/argb', 'size/dp'],
    },
  },
});
```

---

## Testing Transforms

```typescript
import { createTransformContext, runTransform } from '@dsai-io/tools/testing';

describe('color/rgba transform', () => {
  it('converts hex to rgba', () => {
    const context = createTransformContext();
    const token = {
      name: 'color-primary',
      type: 'color',
      value: '#007bff',
    };

    const result = runTransform('color/rgba', token, context);

    expect(result).toBe('rgba(0, 123, 255, 1)');
  });
});
```

---

## Best Practices

1. **Single Responsibility** - Each transform should do one thing well
2. **Pure Functions** - Transforms should not have side effects
3. **Error Handling** - Return original value on failure
4. **Documentation** - Document custom transforms in your project
5. **Testing** - Write tests for all custom transforms

---

## See Also

- [Custom Formats](./custom-formats.md)
- [Tokens API Reference](../api/tokens.md)
- [Configuration Reference](../configuration.md)
