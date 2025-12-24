# Task: Icons Migration

**Task ID:** TASK-106
**Title:** Icon Generation Scripts Migration to @dsai/tools
**Priority:** High
**Status:** ✅ Completed
**Assigned To:** Unassigned
**Blocked by Task:** TASK-101, TASK-102, TASK-105
**Created:** 2024-12-23
**Updated:** 2025-01-15

---

## 📋 Task Description

### Goal

Migrate icon generation scripts from `tools/icons/` and `tools/scripts/` to `@dsai/tools` package. Create a modular, configurable icon generation system that supports React and raw SVG output with full enterprise customization. (Vue support deferred to future enhancement.)

### Problem/Issue

Current icon tooling issues:

1. **Scattered Scripts**: Icon scripts in multiple locations
2. **Hardcoded Paths**: Output directories hardcoded
3. **No Customization**: Can't override templates or transforms
4. **Limited Formats**: Only React components generated
5. **No Optimization**: SVGs not optimized automatically
6. **No Types**: No TypeScript types for icon components

### Expected Outcome

A comprehensive icon generation system that:

1. Consolidates all icon scripts in one module
2. Uses configuration system for all paths
3. Supports React, Vue, and SVG outputs
4. Optimizes SVGs with SVGO
5. Generates TypeScript types
6. Supports custom templates

---

## 🎯 Acceptance Criteria

### Core Features

- [x] SVG optimization with SVGO
- [x] React component generation
- [x] SVG sprite generation
- [x] TypeScript declarations

### Configuration

- [x] Uses config for source/output paths
- [x] Custom template support
- [x] Custom transforms support
- [x] Icon name transformations

### Output Quality

- [x] Tree-shakeable exports
- [x] Accessible icons (aria-label)
- [x] Consistent naming conventions
- [x] Clean generated code

### CLI Integration

- [x] `dsai icons build` command
- [x] Format selection (--format)
- [ ] Watch mode (--watch) - deferred to future enhancement
- [ ] Individual icon generation - deferred to future enhancement

---

## 📂 Files to Create/Modify

### New Files

```
packages/@dsai/tools/src/icons/
├── index.ts                    # Main exports
├── types.ts                    # Icon types
├── core/
│   ├── index.ts               # Core exports
│   ├── scanner.ts             # SVG file scanner
│   ├── parser.ts              # SVG parser
│   ├── optimizer.ts           # SVGO integration
│   └── transformer.ts         # Icon transformations
├── generators/
│   ├── index.ts               # Generator exports
│   ├── react.ts               # React component generator
│   ├── vue.ts                 # Vue component generator
│   ├── svg-sprite.ts          # SVG sprite generator
│   └── types.ts               # TypeScript declaration generator
├── templates/
│   ├── index.ts               # Template exports
│   ├── react.ts               # React component template
│   ├── vue.ts                 # Vue SFC template
│   └── types.ts               # TypeScript template
└── utils/
    ├── index.ts               # Utility exports
    ├── naming.ts              # Icon naming utilities
    └── paths.ts               # Path utilities
```

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-101: Package Scaffolding
- [ ] TASK-102: Configuration System
- [ ] TASK-105: CLI Implementation

### Blocks

- TASK-108: Documentation (documents icon system)

### New Dependencies

```json
{
  "dependencies": {
    "svgo": "^3.2.0",
    "fast-glob": "^3.3.0"
  }
}
```

---

## 🧪 Testing Requirements

### Unit Tests

- [ ] SVG parsing extracts correct data
- [ ] Optimization reduces file size
- [ ] Naming conventions applied correctly
- [ ] Templates render correctly

### Integration Tests

- [ ] Full icon build workflow
- [ ] Watch mode detects changes
- [ ] Custom templates work

### Snapshot Tests

- [ ] Generated React components match snapshots
- [ ] Generated Vue components match snapshots
- [ ] Generated types match snapshots

---

## 📖 Documentation Requirements

- [ ] Icon configuration guide
- [ ] Template customization guide
- [ ] React usage examples
- [ ] Vue usage examples
- [ ] Custom generator guide

---

## 🔄 Implementation Steps

### Step 1: Define Icon Types

**src/icons/types.ts:**

```typescript
/**
 * Icon system type definitions
 *
 * @packageDocumentation
 */

/**
 * Raw SVG data from file
 */
export interface RawSVGData {
  /** File path (absolute) */
  filePath: string;

  /** File name without extension */
  fileName: string;

  /** SVG content string */
  content: string;

  /** Original file size in bytes */
  originalSize: number;
}

/**
 * Parsed SVG data
 */
export interface ParsedSVG {
  /** Icon name (normalized) */
  name: string;

  /** Component name (PascalCase) */
  componentName: string;

  /** Original file name */
  fileName: string;

  /** SVG viewBox */
  viewBox: string;

  /** SVG width */
  width?: string | number;

  /** SVG height */
  height?: string | number;

  /** SVG inner content (without <svg> wrapper) */
  innerContent: string;

  /** Full SVG content */
  fullContent: string;

  /** SVG attributes */
  attributes: Record<string, string>;

  /** Title for accessibility */
  title?: string;

  /** Description for accessibility */
  description?: string;
}

/**
 * Optimized SVG data
 */
export interface OptimizedSVG extends ParsedSVG {
  /** Optimized file size in bytes */
  optimizedSize: number;

  /** Size reduction percentage */
  sizeReduction: number;
}

/**
 * Generated icon component
 */
export interface GeneratedIcon {
  /** Icon name */
  name: string;

  /** Component name */
  componentName: string;

  /** Generated code */
  code: string;

  /** Output file path */
  outputPath: string;

  /** Format (react, vue, svg) */
  format: IconFormat;
}

/**
 * Icon format
 */
export type IconFormat = 'react' | 'vue' | 'svg' | 'svg-sprite';

/**
 * Icon build options
 */
export interface IconBuildOptions {
  /** Formats to generate */
  formats?: IconFormat[];

  /** Watch for changes */
  watch?: boolean;

  /** Specific icons to build (file names) */
  icons?: string[];

  /** Dry run */
  dryRun?: boolean;
}

/**
 * Icon build result
 */
export interface IconBuildResult {
  /** Build successful */
  success: boolean;

  /** Generated icons */
  icons: GeneratedIcon[];

  /** Total icons processed */
  totalIcons: number;

  /** Files written */
  filesWritten: number;

  /** Total size reduction */
  totalSizeReduction: number;

  /** Build errors */
  errors: IconError[];

  /** Build warnings */
  warnings: IconWarning[];
}

/**
 * Icon error
 */
export interface IconError {
  /** Icon name */
  icon: string;

  /** Error message */
  message: string;

  /** Error code */
  code: string;
}

/**
 * Icon warning
 */
export interface IconWarning {
  /** Icon name */
  icon: string;

  /** Warning message */
  message: string;
}

/**
 * SVGO configuration
 */
export interface SVGOConfig {
  /** Enable multipass optimization */
  multipass?: boolean;

  /** Plugins to use */
  plugins?: SVGOPlugin[];
}

/**
 * SVGO plugin configuration
 */
export interface SVGOPlugin {
  /** Plugin name */
  name: string;

  /** Plugin parameters */
  params?: Record<string, unknown>;
}

/**
 * Icon template function
 */
export type IconTemplate = (icon: OptimizedSVG) => string;

/**
 * Index template function
 */
export type IndexTemplate = (icons: OptimizedSVG[]) => string;

/**
 * Types template function
 */
export type TypesTemplate = (icons: OptimizedSVG[]) => string;
```

### Step 2: Implement SVG Scanner

**src/icons/core/scanner.ts:**

```typescript
/**
 * SVG file scanner
 *
 * @packageDocumentation
 */

import { readFileSync, statSync } from 'fs';
import fg from 'fast-glob';
import type { RawSVGData } from '../types.js';

/**
 * Scanner options
 */
export interface ScannerOptions {
  /** Source directory */
  sourceDir: string;

  /** Glob patterns to include */
  include?: string[];

  /** Glob patterns to exclude */
  exclude?: string[];
}

/**
 * Scan directory for SVG files
 *
 * @param options - Scanner options
 * @returns Array of raw SVG data
 */
export async function scanSVGFiles(options: ScannerOptions): Promise<RawSVGData[]> {
  const {
    sourceDir,
    include = ['**/*.svg'],
    exclude = ['**/node_modules/**', '**/dist/**'],
  } = options;

  // Find all SVG files
  const files = await fg(include, {
    cwd: sourceDir,
    ignore: exclude,
    absolute: true,
    onlyFiles: true,
  });

  // Read each file
  const svgFiles: RawSVGData[] = [];

  for (const filePath of files) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const stats = statSync(filePath);

      // Extract file name
      const fileName = filePath
        .split('/')
        .pop()!
        .replace(/\.svg$/i, '');

      svgFiles.push({
        filePath,
        fileName,
        content,
        originalSize: stats.size,
      });
    } catch (error) {
      console.warn(`Warning: Failed to read ${filePath}`);
    }
  }

  // Sort by name for consistent output
  svgFiles.sort((a, b) => a.fileName.localeCompare(b.fileName));

  return svgFiles;
}
```

### Step 3: Implement SVG Parser

**src/icons/core/parser.ts:**

```typescript
/**
 * SVG parser
 *
 * @packageDocumentation
 */

import type { RawSVGData, ParsedSVG } from '../types.js';
import { toComponentName } from '../utils/naming.js';

/**
 * Parse raw SVG data into structured format
 *
 * @param raw - Raw SVG data
 * @returns Parsed SVG data
 */
export function parseSVG(raw: RawSVGData): ParsedSVG {
  const { content, fileName } = raw;

  // Extract SVG attributes
  const svgMatch = content.match(/<svg([^>]*)>/i);
  const svgAttributes = svgMatch ? svgMatch[1] : '';

  // Parse attributes
  const attributes: Record<string, string> = {};
  const attrRegex = /(\w+(?:-\w+)*)=["']([^"']*)["']/g;
  let match;

  while ((match = attrRegex.exec(svgAttributes)) !== null) {
    attributes[match[1]] = match[2];
  }

  // Extract viewBox
  let viewBox = attributes.viewBox || '';
  if (!viewBox) {
    const width = attributes.width?.replace(/[^\d.]/g, '') || '24';
    const height = attributes.height?.replace(/[^\d.]/g, '') || '24';
    viewBox = `0 0 ${width} ${height}`;
  }

  // Extract inner content
  const innerContentMatch = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerContent = innerContentMatch ? innerContentMatch[1].trim() : '';

  // Extract title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : undefined;

  // Extract description
  const descMatch = content.match(/<desc>([^<]*)<\/desc>/i);
  const description = descMatch ? descMatch[1] : undefined;

  // Generate normalized name
  const name = fileName
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  return {
    name,
    componentName: toComponentName(fileName),
    fileName,
    viewBox,
    width: attributes.width,
    height: attributes.height,
    innerContent,
    fullContent: content,
    attributes,
    title,
    description,
  };
}

/**
 * Parse multiple SVG files
 *
 * @param rawFiles - Array of raw SVG data
 * @returns Array of parsed SVG data
 */
export function parseSVGFiles(rawFiles: RawSVGData[]): ParsedSVG[] {
  return rawFiles.map(parseSVG);
}
```

### Step 4: Implement SVG Optimizer

**src/icons/core/optimizer.ts:**

```typescript
/**
 * SVG optimizer (SVGO integration)
 *
 * @packageDocumentation
 */

import { optimize as svgoOptimize } from 'svgo';
import type { ParsedSVG, OptimizedSVG, SVGOConfig, RawSVGData } from '../types.js';

/**
 * Default SVGO configuration
 */
export const defaultSVGOConfig: SVGOConfig = {
  multipass: true,
  plugins: [
    { name: 'preset-default' },
    { name: 'removeXMLNS' },
    { name: 'removeDimensions' },
    { name: 'removeStyleElement' },
    { name: 'removeScriptElement' },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['class', 'style', 'data-name', 'xmlns:xlink'],
      },
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [{ 'aria-hidden': 'true' }, { focusable: 'false' }],
      },
    },
    {
      name: 'sortAttrs',
      params: {
        xmlnsOrder: 'alphabetical',
      },
    },
  ],
};

/**
 * Optimize a single SVG
 *
 * @param parsed - Parsed SVG data
 * @param raw - Raw SVG data (for size comparison)
 * @param config - SVGO configuration
 * @returns Optimized SVG data
 */
export function optimizeSVG(
  parsed: ParsedSVG,
  raw: RawSVGData,
  config: SVGOConfig = defaultSVGOConfig
): OptimizedSVG {
  // Run SVGO optimization
  const result = svgoOptimize(raw.content, {
    multipass: config.multipass,
    plugins: config.plugins as any,
  });

  const optimizedContent = result.data;
  const optimizedSize = Buffer.byteLength(optimizedContent, 'utf-8');
  const sizeReduction = ((raw.originalSize - optimizedSize) / raw.originalSize) * 100;

  // Re-parse optimized content
  const innerContentMatch = optimizedContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerContent = innerContentMatch ? innerContentMatch[1].trim() : parsed.innerContent;

  // Extract updated viewBox
  const viewBoxMatch = optimizedContent.match(/viewBox=["']([^"']*)["']/i);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : parsed.viewBox;

  return {
    ...parsed,
    innerContent,
    fullContent: optimizedContent,
    viewBox,
    optimizedSize,
    sizeReduction,
  };
}

/**
 * Optimize multiple SVGs
 *
 * @param parsedFiles - Array of parsed SVG data
 * @param rawFiles - Array of raw SVG data
 * @param config - SVGO configuration
 * @returns Array of optimized SVG data
 */
export function optimizeSVGFiles(
  parsedFiles: ParsedSVG[],
  rawFiles: RawSVGData[],
  config: SVGOConfig = defaultSVGOConfig
): OptimizedSVG[] {
  return parsedFiles.map((parsed, index) => {
    const raw = rawFiles.find((r) => r.fileName === parsed.fileName);
    if (!raw) {
      throw new Error(`Raw file not found for ${parsed.fileName}`);
    }
    return optimizeSVG(parsed, raw, config);
  });
}
```

### Step 5: Implement React Generator

**src/icons/generators/react.ts:**

```typescript
/**
 * React component generator
 *
 * @packageDocumentation
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import type {
  OptimizedSVG,
  GeneratedIcon,
  IconTemplate,
  IndexTemplate,
  TypesTemplate,
} from '../types.js';

/**
 * Default React icon template
 */
export const defaultReactTemplate: IconTemplate = (icon) => `/**
 * ${icon.componentName} icon
 * 
 * @generated by @dsai/tools
 */

import * as React from 'react';
import type { SVGProps } from 'react';

export interface ${icon.componentName}Props extends SVGProps<SVGSVGElement> {
  /** Icon size */
  size?: number | string;
  /** Icon title for accessibility */
  title?: string;
}

export const ${icon.componentName} = React.forwardRef<SVGSVGElement, ${icon.componentName}Props>(
  ({ size = 24, title${icon.title ? ` = "${icon.title}"` : ''}, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="${icon.viewBox}"
      width={size}
      height={size}
      fill="currentColor"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      {...props}
    >
      {title && <title>{title}</title>}
      ${icon.innerContent}
    </svg>
  )
);

${icon.componentName}.displayName = '${icon.componentName}';

export default ${icon.componentName};
`;

/**
 * Default React index template
 */
export const defaultReactIndexTemplate: IndexTemplate = (icons) => `/**
 * Icon exports
 * 
 * @generated by @dsai/tools
 */

${icons.map((icon) => `export { ${icon.componentName} } from './${icon.componentName}';`).join('\n')}

// Re-export types
export type { SVGProps } from 'react';
`;

/**
 * Default React types template
 */
export const defaultReactTypesTemplate: TypesTemplate = (icons) => `/**
 * Icon types
 * 
 * @generated by @dsai/tools
 */

import type { SVGProps, ForwardRefExoticComponent, RefAttributes } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  title?: string;
}

export type IconComponent = ForwardRefExoticComponent<
  IconProps & RefAttributes<SVGSVGElement>
>;

/**
 * Available icon names
 */
export type IconName =
${icons.map((icon) => `  | '${icon.name}'`).join('\n')};

/**
 * Icon component map
 */
export interface IconMap {
${icons.map((icon) => `  '${icon.name}': IconComponent;`).join('\n')}
}

/**
 * Icon metadata
 */
export interface IconMeta {
  name: IconName;
  componentName: string;
  viewBox: string;
}

export const iconMeta: IconMeta[] = [
${icons.map((icon) => `  { name: '${icon.name}', componentName: '${icon.componentName}', viewBox: '${icon.viewBox}' },`).join('\n')}
];
`;

/**
 * Generate React icon components
 *
 * @param icons - Optimized SVG data
 * @param outputDir - Output directory
 * @param options - Generator options
 * @returns Generated icons
 */
export async function generateReactIcons(
  icons: OptimizedSVG[],
  outputDir: string,
  options: {
    template?: IconTemplate;
    indexTemplate?: IndexTemplate;
    typesTemplate?: TypesTemplate;
    dryRun?: boolean;
  } = {}
): Promise<GeneratedIcon[]> {
  const {
    template = defaultReactTemplate,
    indexTemplate = defaultReactIndexTemplate,
    typesTemplate = defaultReactTypesTemplate,
    dryRun = false,
  } = options;

  const generated: GeneratedIcon[] = [];

  // Ensure output directory exists
  if (!dryRun && !existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Generate individual icon components
  for (const icon of icons) {
    const code = template(icon);
    const outputPath = join(outputDir, `${icon.componentName}.tsx`);

    if (!dryRun) {
      writeFileSync(outputPath, code, 'utf-8');
    }

    generated.push({
      name: icon.name,
      componentName: icon.componentName,
      code,
      outputPath,
      format: 'react',
    });
  }

  // Generate index file
  const indexCode = indexTemplate(icons);
  const indexPath = join(outputDir, 'index.ts');

  if (!dryRun) {
    writeFileSync(indexPath, indexCode, 'utf-8');
  }

  generated.push({
    name: 'index',
    componentName: 'index',
    code: indexCode,
    outputPath: indexPath,
    format: 'react',
  });

  // Generate types file
  const typesCode = typesTemplate(icons);
  const typesPath = join(outputDir, 'types.ts');

  if (!dryRun) {
    writeFileSync(typesPath, typesCode, 'utf-8');
  }

  generated.push({
    name: 'types',
    componentName: 'types',
    code: typesCode,
    outputPath: typesPath,
    format: 'react',
  });

  return generated;
}
```

### Step 6: Implement Vue Generator

**src/icons/generators/vue.ts:**

```typescript
/**
 * Vue component generator
 *
 * @packageDocumentation
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import type { OptimizedSVG, GeneratedIcon, IconTemplate, IndexTemplate } from '../types.js';

/**
 * Default Vue SFC template
 */
export const defaultVueTemplate: IconTemplate = (icon) => `<!--
  ${icon.componentName} icon
  @generated by @dsai/tools
-->

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    :width="size"
    :height="size"
    fill="currentColor"
    :role="title ? 'img' : 'presentation'"
    :aria-label="title"
    v-bind="$attrs"
  >
    <title v-if="title">{{ title }}</title>
    ${icon.innerContent}
  </svg>
</template>

<script setup lang="ts">
interface Props {
  /** Icon size */
  size?: number | string;
  /** Icon title for accessibility */
  title?: string;
}

withDefaults(defineProps<Props>(), {
  size: 24,
  title: ${icon.title ? `'${icon.title}'` : 'undefined'},
});

const viewBox = '${icon.viewBox}';
</script>
`;

/**
 * Default Vue index template
 */
export const defaultVueIndexTemplate: IndexTemplate = (icons) => `/**
 * Icon exports
 * 
 * @generated by @dsai/tools
 */

${icons.map((icon) => `export { default as ${icon.componentName} } from './${icon.componentName}.vue';`).join('\n')}
`;

/**
 * Generate Vue icon components
 *
 * @param icons - Optimized SVG data
 * @param outputDir - Output directory
 * @param options - Generator options
 * @returns Generated icons
 */
export async function generateVueIcons(
  icons: OptimizedSVG[],
  outputDir: string,
  options: {
    template?: IconTemplate;
    indexTemplate?: IndexTemplate;
    dryRun?: boolean;
  } = {}
): Promise<GeneratedIcon[]> {
  const {
    template = defaultVueTemplate,
    indexTemplate = defaultVueIndexTemplate,
    dryRun = false,
  } = options;

  const generated: GeneratedIcon[] = [];

  // Ensure output directory exists
  if (!dryRun && !existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Generate individual icon components
  for (const icon of icons) {
    const code = template(icon);
    const outputPath = join(outputDir, `${icon.componentName}.vue`);

    if (!dryRun) {
      writeFileSync(outputPath, code, 'utf-8');
    }

    generated.push({
      name: icon.name,
      componentName: icon.componentName,
      code,
      outputPath,
      format: 'vue',
    });
  }

  // Generate index file
  const indexCode = indexTemplate(icons);
  const indexPath = join(outputDir, 'index.ts');

  if (!dryRun) {
    writeFileSync(indexPath, indexCode, 'utf-8');
  }

  generated.push({
    name: 'index',
    componentName: 'index',
    code: indexCode,
    outputPath: indexPath,
    format: 'vue',
  });

  return generated;
}
```

### Step 7: Implement SVG Sprite Generator

**src/icons/generators/svg-sprite.ts:**

```typescript
/**
 * SVG sprite generator
 *
 * @packageDocumentation
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import type { OptimizedSVG, GeneratedIcon } from '../types.js';

/**
 * Generate SVG sprite
 *
 * @param icons - Optimized SVG data
 * @param outputDir - Output directory
 * @param options - Generator options
 * @returns Generated files
 */
export async function generateSVGSprite(
  icons: OptimizedSVG[],
  outputDir: string,
  options: {
    fileName?: string;
    dryRun?: boolean;
  } = {}
): Promise<GeneratedIcon[]> {
  const { fileName = 'sprite.svg', dryRun = false } = options;

  // Ensure output directory exists
  if (!dryRun && !existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Generate sprite symbols
  const symbols = icons
    .map(
      (icon) => `  <symbol id="${icon.name}" viewBox="${icon.viewBox}">
    ${icon.innerContent}
  </symbol>`
    )
    .join('\n');

  // Create sprite SVG
  const spriteCode = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  SVG Sprite
  @generated by @dsai/tools
  Contains ${icons.length} icons
-->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
${symbols}
  </defs>
</svg>
`;

  const outputPath = join(outputDir, fileName);

  if (!dryRun) {
    writeFileSync(outputPath, spriteCode, 'utf-8');
  }

  // Generate usage helper HTML
  const usageCode = `<!DOCTYPE html>
<html>
<head>
  <title>Icon Sprite Usage</title>
  <style>
    .icon { width: 24px; height: 24px; fill: currentColor; }
    .icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 16px; }
    .icon-item { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border: 1px solid #eee; border-radius: 8px; }
    .icon-name { font-size: 10px; color: #666; }
  </style>
</head>
<body>
  <h1>Icon Sprite (${icons.length} icons)</h1>
  
  <h2>Usage</h2>
  <pre>&lt;svg class="icon"&gt;
  &lt;use href="sprite.svg#icon-name"&gt;&lt;/use&gt;
&lt;/svg&gt;</pre>
  
  <h2>All Icons</h2>
  <div class="icon-grid">
${icons
  .map(
    (icon) => `    <div class="icon-item">
      <svg class="icon"><use href="${fileName}#${icon.name}"></use></svg>
      <span class="icon-name">${icon.name}</span>
    </div>`
  )
  .join('\n')}
  </div>
</body>
</html>
`;

  const usagePath = join(outputDir, 'sprite-preview.html');

  if (!dryRun) {
    writeFileSync(usagePath, usageCode, 'utf-8');
  }

  return [
    {
      name: 'sprite',
      componentName: 'sprite',
      code: spriteCode,
      outputPath,
      format: 'svg-sprite',
    },
    {
      name: 'preview',
      componentName: 'preview',
      code: usageCode,
      outputPath: usagePath,
      format: 'svg-sprite',
    },
  ];
}
```

### Step 8: Implement Main Icon Build Function

**src/icons/index.ts:**

````typescript
/**
 * Icon system main exports
 *
 * @packageDocumentation
 */

import type { ResolvedConfig } from '../config/types.js';
import type { IconBuildOptions, IconBuildResult, IconFormat, GeneratedIcon } from './types.js';
import { scanSVGFiles } from './core/scanner.js';
import { parseSVGFiles } from './core/parser.js';
import { optimizeSVGFiles } from './core/optimizer.js';
import { generateReactIcons } from './generators/react.js';
import { generateVueIcons } from './generators/vue.js';
import { generateSVGSprite } from './generators/svg-sprite.js';
import { join } from 'path';

/**
 * Build icons from SVG source files
 *
 * @param config - Resolved DSAi configuration
 * @param options - Build options
 * @returns Build result
 *
 * @example
 * ```typescript
 * import { loadConfig } from '@dsai/tools/config';
 * import { buildIcons } from '@dsai/tools/icons';
 *
 * const { config } = await loadConfig();
 * const result = await buildIcons(config, {
 *   formats: ['react', 'vue'],
 * });
 *
 * console.log(`Generated ${result.totalIcons} icons`);
 * ```
 */
export async function buildIcons(
  config: ResolvedConfig,
  options: IconBuildOptions = {}
): Promise<IconBuildResult> {
  const {
    formats = [config.icons.format as IconFormat],
    icons: iconFilter,
    dryRun = false,
  } = options;

  const result: IconBuildResult = {
    success: false,
    icons: [],
    totalIcons: 0,
    filesWritten: 0,
    totalSizeReduction: 0,
    errors: [],
    warnings: [],
  };

  try {
    // Step 1: Scan for SVG files
    const rawFiles = await scanSVGFiles({
      sourceDir: config.icons.sourceDir,
    });

    if (rawFiles.length === 0) {
      result.warnings.push({
        icon: '*',
        message: `No SVG files found in ${config.icons.sourceDir}`,
      });
      result.success = true;
      return result;
    }

    // Filter by specific icons if provided
    const filteredFiles = iconFilter
      ? rawFiles.filter((f) => iconFilter.includes(f.fileName))
      : rawFiles;

    // Step 2: Parse SVG content
    const parsedFiles = parseSVGFiles(filteredFiles);

    // Step 3: Optimize SVGs
    const optimizedFiles = optimizeSVGFiles(parsedFiles, filteredFiles, {
      multipass: true,
      plugins: config.icons.svgoPlugins ?? [],
    });

    // Calculate total size reduction
    result.totalSizeReduction =
      optimizedFiles.reduce((sum, f) => sum + f.sizeReduction, 0) / optimizedFiles.length;

    result.totalIcons = optimizedFiles.length;

    // Step 4: Generate output for each format
    const generated: GeneratedIcon[] = [];

    for (const format of formats) {
      const outputDir = join(config.icons.outputDir, format);

      switch (format) {
        case 'react':
          generated.push(...(await generateReactIcons(optimizedFiles, outputDir, { dryRun })));
          break;

        case 'vue':
          generated.push(...(await generateVueIcons(optimizedFiles, outputDir, { dryRun })));
          break;

        case 'svg':
        case 'svg-sprite':
          generated.push(...(await generateSVGSprite(optimizedFiles, outputDir, { dryRun })));
          break;
      }
    }

    result.icons = generated;
    result.filesWritten = generated.length;
    result.success = true;
  } catch (error) {
    result.errors.push({
      icon: '*',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'BUILD_ERROR',
    });
  }

  return result;
}

// Re-export types and utilities
export type {
  RawSVGData,
  ParsedSVG,
  OptimizedSVG,
  GeneratedIcon,
  IconFormat,
  IconBuildOptions,
  IconBuildResult,
  IconError,
  IconWarning,
  SVGOConfig,
  SVGOPlugin,
  IconTemplate,
  IndexTemplate,
  TypesTemplate,
} from './types.js';

export { scanSVGFiles } from './core/scanner.js';
export { parseSVG, parseSVGFiles } from './core/parser.js';
export { optimizeSVG, optimizeSVGFiles, defaultSVGOConfig } from './core/optimizer.js';
export {
  generateReactIcons,
  defaultReactTemplate,
  defaultReactIndexTemplate,
  defaultReactTypesTemplate,
} from './generators/react.js';
export { generateVueIcons, defaultVueTemplate, defaultVueIndexTemplate } from './generators/vue.js';
export { generateSVGSprite } from './generators/svg-sprite.js';
````

### Step 9: Implement Naming Utilities

**src/icons/utils/naming.ts:**

```typescript
/**
 * Icon naming utilities
 *
 * @packageDocumentation
 */

/**
 * Convert string to PascalCase component name
 *
 * @example
 * toComponentName('arrow-left') // 'ArrowLeft'
 * toComponentName('24px-icon') // 'Icon24px'
 * toComponentName('my_icon') // 'MyIcon'
 */
export function toComponentName(input: string): string {
  // Handle numbers at start
  if (/^\d/.test(input)) {
    input = `icon-${input}`;
  }

  return (
    input
      // Split on non-alphanumeric
      .split(/[^a-zA-Z0-9]+/)
      // Capitalize each word
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      // Join
      .join('')
  );
}

/**
 * Convert string to kebab-case icon name
 *
 * @example
 * toIconName('ArrowLeft') // 'arrow-left'
 * toIconName('24pxIcon') // '24px-icon'
 */
export function toIconName(input: string): string {
  return (
    input
      // Insert hyphen before uppercase letters
      .replace(/([A-Z])/g, '-$1')
      // Insert hyphen before numbers
      .replace(/(\d+)/g, '-$1')
      // Clean up multiple hyphens
      .replace(/-+/g, '-')
      // Remove leading hyphen
      .replace(/^-/, '')
      // Lowercase
      .toLowerCase()
  );
}

/**
 * Validate icon name
 */
export function isValidIconName(name: string): boolean {
  // Must be non-empty
  if (!name || name.length === 0) return false;

  // Must be valid identifier-like
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) return false;

  return true;
}
```

---

## 📝 Notes

### Enterprise Extension Pattern

```typescript
// Enterprise dsai.config.mjs
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  icons: {
    sourceDir: './assets/icons',
    outputDir: './src/components/icons',
    format: 'react',

    // Custom SVGO plugins
    svgoPlugins: [
      { name: 'preset-default' },
      { name: 'removeXMLNS' },
      {
        name: 'addClassesToSVGElement',
        params: { className: 'acme-icon' },
      },
    ],

    // Custom template
    reactTemplate: (icon) => `
      import React from 'react';
      export const ${icon.componentName}: React.FC = (props) => (
        <svg {...props}>${icon.innerContent}</svg>
      );
    `,
  },
});
```

---

## ✅ Definition of Done

- [ ] SVG scanner finds all icon files
- [ ] SVG parser extracts correct data
- [ ] SVGO optimization reduces file size
- [ ] React components generated correctly
- [ ] Vue components generated correctly
- [ ] SVG sprite generated correctly
- [ ] Custom templates work
- [ ] CLI integration complete
- [ ] All tests pass
- [ ] Documentation complete
