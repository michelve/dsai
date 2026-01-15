# Icons API

API reference for icon generation and optimization.

## Functions

### `buildIcons`

Generate icon components from SVG files.

```typescript
import { buildIcons, loadConfig } from '@dsai-io/tools';

const { config } = await loadConfig();
const result = await buildIcons(config, { formats: ['react'] });

console.log(`Generated ${result.totalIcons} icons`);
```

**Signature:**

```typescript
function buildIcons(config: ResolvedConfig, options?: BuildIconsOptions): Promise<IconBuildResult>;
```

**Parameters:**

| Parameter         | Type             | Description               |
| ----------------- | ---------------- | ------------------------- |
| `config`          | `ResolvedConfig` | Resolved configuration    |
| `options.formats` | `string[]`       | Output formats            |
| `options.watch`   | `boolean`        | Enable watch mode         |
| `options.clean`   | `boolean`        | Clean output before build |

**Returns:**

```typescript
interface IconBuildResult {
  success: boolean;
  totalIcons: number;
  filesWritten: number;
  files: string[];
  duration: number;
  errors: string[];
}
```

---

### `optimizeSvg`

Optimize an SVG file using SVGO.

```typescript
import { optimizeSvg } from '@dsai-io/tools';

const optimized = await optimizeSvg('./icons/arrow.svg', {
  removeViewBox: false,
  removeDimensions: true,
});

console.log('Optimized:', optimized.data);
console.log('Size reduction:', optimized.reduction);
```

**Signature:**

```typescript
function optimizeSvg(svgPath: string, options?: SVGOOptions): Promise<OptimizeResult>;
```

**Parameters:**

| Parameter                  | Type       | Description              |
| -------------------------- | ---------- | ------------------------ |
| `svgPath`                  | `string`   | Path to SVG file         |
| `options.removeViewBox`    | `boolean`  | Remove viewBox attribute |
| `options.removeDimensions` | `boolean`  | Remove width/height      |
| `options.plugins`          | `Plugin[]` | Custom SVGO plugins      |

**Returns:**

```typescript
interface OptimizeResult {
  data: string;
  path: string;
  originalSize: number;
  optimizedSize: number;
  reduction: number; // percentage
}
```

---

### `extractIconMetadata`

Extract metadata from an SVG file.

```typescript
import { extractIconMetadata } from '@dsai-io/tools';

const metadata = await extractIconMetadata('./icons/arrow.svg');

console.log('Name:', metadata.name);
console.log('ViewBox:', metadata.viewBox);
console.log('Size:', metadata.width, 'x', metadata.height);
```

**Signature:**

```typescript
function extractIconMetadata(svgPath: string): Promise<IconMetadata>;
```

**Parameters:**

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `svgPath` | `string` | Path to SVG file |

**Returns:**

```typescript
interface IconMetadata {
  name: string;
  fileName: string;
  viewBox: string;
  width: number;
  height: number;
  paths: string[];
  hasTitle: boolean;
  colors: string[];
}
```

---

### `generateReactIcon`

Generate a React component from SVG content.

```typescript
import { generateReactIcon } from '@dsai-io/tools';

const component = generateReactIcon({
  name: 'ArrowRight',
  svg: '<svg viewBox="0 0 24 24">...</svg>',
  typescript: true,
});

console.log(component.code);
```

**Signature:**

```typescript
function generateReactIcon(options: GenerateIconOptions): GeneratedComponent;
```

**Parameters:**

| Parameter              | Type      | Description          |
| ---------------------- | --------- | -------------------- |
| `name`                 | `string`  | Component name       |
| `svg`                  | `string`  | SVG content          |
| `typescript`           | `boolean` | Generate TypeScript  |
| `includeAccessibility` | `boolean` | Include ARIA support |

**Returns:**

```typescript
interface GeneratedComponent {
  name: string;
  code: string;
  fileName: string;
}
```

---

### `generateIconIndex`

Generate an index file exporting all icons.

```typescript
import { generateIconIndex } from '@dsai-io/tools';

const index = generateIconIndex({
  icons: ['ArrowRight', 'ArrowLeft', 'Check'],
  format: 'esm',
});

console.log(index);
// export { ArrowRight } from './ArrowRight';
// export { ArrowLeft } from './ArrowLeft';
// export { Check } from './Check';
```

**Signature:**

```typescript
function generateIconIndex(options: IndexOptions): string;
```

**Parameters:**

| Parameter | Type       | Description              |
| --------- | ---------- | ------------------------ |
| `icons`   | `string[]` | Icon component names     |
| `format`  | `string`   | Module format (esm, cjs) |

**Returns:** Index file content as string.

---

## Types

### IconConfig

```typescript
interface IconConfig {
  sourceDir: string;
  outputDir: string;
  format: 'react' | 'vue' | 'svg' | 'svg-sprite';
  optimize: boolean;
  svgoPlugins?: SVGOPlugin[];
  template?: (icon: OptimizedSVG) => string;
  indexTemplate?: (icons: OptimizedSVG[]) => string;
}
```

### OptimizedSVG

```typescript
interface OptimizedSVG {
  name: string;
  fileName: string;
  svg: string;
  viewBox: string;
  width: number;
  height: number;
  paths: PathData[];
}
```

---

## Custom Templates

### React Template

```typescript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  icons: {
    template: (icon) => `
import { forwardRef } from 'react';
import type { IconProps } from './types';

export const ${icon.name} = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, color = 'currentColor', ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="${icon.viewBox}"
      width={size}
      height={size}
      fill={color}
      {...props}
    >
      ${icon.paths.map((p) => `<path d="${p.d}" />`).join('\n      ')}
    </svg>
  )
);

${icon.name}.displayName = '${icon.name}';
`,
  },
});
```

### Index Template

```typescript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  icons: {
    indexTemplate: (icons) => {
      const exports = icons.map((i) => `export { ${i.name} } from './${i.name}';`);
      return exports.join('\n');
    },
  },
});
```

---

## Error Handling

```typescript
import { buildIcons, IconBuildError } from '@dsai-io/tools';

try {
  await buildIcons(config);
} catch (error) {
  if (error instanceof IconBuildError) {
    console.error('Icon build failed:', error.message);
    error.failedIcons.forEach((icon) => {
      console.error(` - ${icon.name}: ${icon.error}`);
    });
  }
}
```
