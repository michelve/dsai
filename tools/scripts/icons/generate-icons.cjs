#!/usr/bin/env node

/**
 * SVG to React Icon Component Generator
 *
 * Converts Bootstrap Icons SVG files to React components.
 * Output is Figma-compatible (inline SVG, no npm dependencies).
 *
 * Usage:
 *   node tools/scripts/icons/generate-icons.cjs
 *
 * Prerequisites:
 *   Run `node tools/scripts/icons/fetch-icon-metadata.cjs` first to fetch metadata.
 *
 * @packageDocumentation
 */

const fs = require('fs');
const path = require('path');

// Paths - Icons now live under components/Icon
const ICONS_DIR = path.join(__dirname, '../../../packages/@dsai/react/src/components/Icon');
const OUTPUT_DIR = path.join(
  __dirname,
  '../../../packages/@dsai/react/src/components/Icon/components'
);
const METADATA_FILE = path.join(__dirname, 'icon-metadata.json');

/**
 * Load icon metadata from JSON file
 * @returns {{icons: Record<string, {title: string, categories: string[], tags: string[], url: string}>} | null}
 */
function loadMetadata() {
  try {
    if (fs.existsSync(METADATA_FILE)) {
      const data = fs.readFileSync(METADATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
    console.warn(
      '⚠️  No metadata file found. Run fetch-icon-metadata.js first for enriched JSDoc.'
    );
    return null;
  } catch (error) {
    console.warn(`⚠️  Error loading metadata: ${error.message}`);
    return null;
  }
}

/**
 * Get metadata for a specific icon by filename
 * @param {string} filename - SVG filename (e.g., 'activity.svg')
 * @param {object} metadata - Loaded metadata object
 * @returns {{title: string, categories: string[], tags: string[], url: string} | null}
 */
function getIconMetadata(filename, metadata) {
  if (!metadata || !metadata.icons) {
    return null;
  }
  const iconName = filename.replace('.svg', '');
  return metadata.icons[iconName] || null;
}

/**
 * Convert kebab-case to PascalCase
 */
function toPascalCase(str) {
  return str
    .split('-')
    .map((part) => {
      // Handle numbers at the start
      if (/^\d/.test(part)) {
        return part;
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
}

/**
 * Generate a valid component name from filename
 */
function getComponentName(filename) {
  const baseName = filename.replace('.svg', '');
  let pascalName = toPascalCase(baseName);

  // If starts with number, prefix with 'Icon'
  if (/^\d/.test(pascalName)) {
    pascalName = 'Icon' + pascalName;
  }

  return pascalName + 'Icon';
}

/**
 * Extract path data from SVG content
 */
function extractSvgData(svgContent) {
  // Extract viewBox
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 16 16';

  // Extract all path elements
  const pathMatches = svgContent.matchAll(/<path([^>]*)\/>/g);
  const paths = [];

  for (const match of pathMatches) {
    const pathAttrs = match[1];
    const dMatch = pathAttrs.match(/d="([^"]+)"/);
    const fillRuleMatch = pathAttrs.match(/fill-rule="([^"]+)"/);

    if (dMatch) {
      paths.push({
        d: dMatch[1],
        fillRule: fillRuleMatch ? fillRuleMatch[1] : null,
      });
    }
  }

  // Check for circle, rect, or other elements
  const hasCircle = svgContent.includes('<circle');
  const hasRect = svgContent.includes('<rect');
  const hasPolygon = svgContent.includes('<polygon');
  const hasLine = svgContent.includes('<line');

  return {
    viewBox,
    paths,
    hasComplexElements: hasCircle || hasRect || hasPolygon || hasLine,
    rawContent: svgContent,
  };
}

/**
 * Generate JSDoc header with metadata
 * @param {string} componentName - React component name
 * @param {{title: string, categories: string[], tags: string[], url: string} | null} iconMeta - Icon metadata
 * @returns {string}
 */
function generateJSDoc(componentName, iconMeta) {
  const title = iconMeta?.title || componentName;
  const url = iconMeta?.url || 'https://icons.getbootstrap.com/';
  const categories = iconMeta?.categories || [];
  const tags = iconMeta?.tags || [];

  // Build description with metadata
  let description = `${componentName}\n *\n * Bootstrap Icons - ${title}`;

  if (categories.length > 0) {
    description += `\n * @category ${categories.join(', ')}`;
  }

  if (tags.length > 0) {
    description += `\n * @tags ${tags.join(', ')}`;
  }

  return `/**
 * ${description}
 * @see ${url}
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * \`\`\`tsx
 * <Button startIcon={<${componentName} />}>Click me</Button>
 * \`\`\`
 *
 * @example Semantic (standalone)
 * \`\`\`tsx
 * <${componentName} aria-label="${title}" />
 * \`\`\`
 */`;
}

/**
 * Generate React component code for an icon
 * @param {string} componentName - React component name
 * @param {object} svgData - Extracted SVG data
 * @param {{title: string, categories: string[], tags: string[], url: string} | null} iconMeta - Icon metadata
 */
function generateComponent(componentName, svgData, iconMeta = null) {
  const { viewBox, paths, hasComplexElements, rawContent } = svgData;
  const jsDoc = generateJSDoc(componentName, iconMeta);

  // For complex SVGs with circles/rects, we need to handle them differently
  if (hasComplexElements || paths.length === 0) {
    // Extract inner content between <svg> tags
    const innerMatch = rawContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    const innerContent = innerMatch ? innerMatch[1].trim() : '';

    return `${jsDoc}
import { forwardRef, useMemo } from 'react';
import type { IconProps } from '../types';

const ALLOWED_PROPS = ['id', 'data-testid', 'data-icon', 'focusable', 'preserveAspectRatio', 'transform', 'opacity'] as const;

export const ${componentName} = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 16,
      color = 'currentColor',
      className,
      title,
      style: propStyle,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      ...rest
    },
    ref
  ) => {
    const isDecorative = !ariaLabel && !title;

    // Improved A11y: Prevent contradictory aria-hidden when labelled
    // - Decorative → always hidden
    // - With aria-label → never hidden (ignore user's aria-hidden)
    // - With title only → respect user's aria-hidden
    const computedAriaHidden = isDecorative ? true : ariaLabel ? undefined : ariaHidden;

    const style = useMemo(
      () => ({
        width: typeof size === 'number' ? \`\${size}px\` : size,
        height: typeof size === 'number' ? \`\${size}px\` : size,
        ...propStyle,
      }),
      [size, propStyle]
    );

    const allowedProps: Record<string, unknown> = {};
    for (const key of ALLOWED_PROPS) {
      if (key in rest) {
        // Dynamic access is safe here because key comes from ALLOWED_PROPS.
        // eslint-disable-next-line security/detect-object-injection
        allowedProps[key] = rest[key as keyof typeof rest];
      }
    }

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="${viewBox}"
        fill={color}
        className={className}
        style={style}
        aria-hidden={computedAriaHidden}
        aria-label={ariaLabel}
        role={ariaLabel ? 'img' : undefined}
        focusable="false"
        {...allowedProps}
      >
        {title && <title>{title}</title>}
        ${innerContent.replace(/fill="currentColor"/g, '').replace(/class="[^"]*"/g, '')}
      </svg>
    );
  }
);

${componentName}.displayName = '${componentName}';
`;
  }

  // Simple path-based icons
  const pathElements = paths
    .map((p) => {
      const fillRule = p.fillRule ? ` fillRule="${p.fillRule}"` : '';
      return `        <path${fillRule} d="${p.d}" />`;
    })
    .join('\n');

  return `${jsDoc}
import { forwardRef, useMemo } from 'react';
import type { IconProps } from '../types';

const ALLOWED_PROPS = ['id', 'data-testid', 'data-icon', 'focusable', 'preserveAspectRatio', 'transform', 'opacity'] as const;

export const ${componentName} = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 16,
      color = 'currentColor',
      className,
      title,
      style: propStyle,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      ...rest
    },
    ref
  ) => {
    const isDecorative = !ariaLabel && !title;

    // Improved A11y: Prevent contradictory aria-hidden when labelled
    // - Decorative → always hidden
    // - With aria-label → never hidden (ignore user's aria-hidden)
    // - With title only → respect user's aria-hidden
    const computedAriaHidden = isDecorative ? true : ariaLabel ? undefined : ariaHidden;

    const style = useMemo(
      () => ({
        width: typeof size === 'number' ? \`\${size}px\` : size,
        height: typeof size === 'number' ? \`\${size}px\` : size,
        ...propStyle,
      }),
      [size, propStyle]
    );

    const allowedProps: Record<string, unknown> = {};
    for (const key of ALLOWED_PROPS) {
      if (key in rest) {
        // Dynamic access is safe here because key comes from ALLOWED_PROPS.
        // eslint-disable-next-line security/detect-object-injection
        allowedProps[key] = rest[key as keyof typeof rest];
      }
    }

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="${viewBox}"
        fill={color}
        className={className}
        style={style}
        aria-hidden={computedAriaHidden}
        aria-label={ariaLabel}
        role={ariaLabel ? 'img' : undefined}
        focusable="false"
        {...allowedProps}
      >
        {title && <title>{title}</title>}
${pathElements}
      </svg>
    );
  }
);

${componentName}.displayName = '${componentName}';
`;
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 Generating React icon components from SVG files...\n');

  // Load metadata (optional - will still work without it)
  const metadata = loadMetadata();
  if (metadata) {
    console.log(`📚 Loaded metadata for ${metadata.totalIcons} icons`);
  }

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all SVG files
  const files = fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith('.svg'));
  console.log(`📁 Found ${files.length} SVG files\n`);

  const components = [];
  let successCount = 0;
  let errorCount = 0;
  let withMetadata = 0;

  for (const file of files) {
    try {
      const filePath = path.join(ICONS_DIR, file);
      const svgContent = fs.readFileSync(filePath, 'utf-8');
      const componentName = getComponentName(file);
      const svgData = extractSvgData(svgContent);

      // Get metadata for this icon
      const iconMeta = getIconMetadata(file, metadata);
      if (iconMeta) {
        withMetadata++;
      }

      const componentCode = generateComponent(componentName, svgData, iconMeta);

      // Write component file
      const outputPath = path.join(OUTPUT_DIR, `${componentName}.tsx`);
      fs.writeFileSync(outputPath, componentCode);

      components.push({
        name: componentName,
        file: file,
      });

      successCount++;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      errorCount++;
    }
  }

  // Generate index file
  console.log('\n📝 Generating index file...');

  const indexContent = `/**
 * Bootstrap Icons - React Components
 *
 * Auto-generated from Bootstrap Icons SVG files.
 * DO NOT EDIT - this file is generated by tools/scripts/icons/generate-icons.js
 *
 * @packageDocumentation
 */

${components.map((c) => `export { ${c.name} } from './components/${c.name}';`).join('\n')}

// Re-export types
export type { IconProps, IconComponent } from './types';
`;

  fs.writeFileSync(path.join(ICONS_DIR, 'index.ts'), indexContent);

  console.log(`
✅ Generation complete!
   - Components: ${successCount}
   - With metadata: ${withMetadata}
   - Errors: ${errorCount}
   - Output: ${OUTPUT_DIR}
`);
}

main().catch(console.error);
