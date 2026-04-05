/**
 * DSAi Figma Plugin - Icon Generator
 *
 * This plugin extracts icons from a Figma file and generates React components
 * compatible with the DSAi design system (@dsai-io/react).
 *
 * Output format matches: packages/@dsai-io/react/src/components/Icon/components/
 *
 * Usage:
 * 1. Open the Figma file containing icons
 * 2. Run this plugin from Plugins > Development > Run Plugin
 * 3. Copy the generated exports and component files
 *
 * Configuration:
 * - Update FILE_URL to match your Figma icons library URL
 * - Update FIGMA_URL_SUBSTITUTION to match your figma.config.json
 */

// URL substitution variable (used in figma.config.json for Code Connect)
// This gets substituted with the actual Figma file URL at build time
// See: packages/@dsai-io/react/figma.config.json
const FIGMA_URL_SUBSTITUTION = '<FIGMA_DSAI_ICONS>';

// Icon variant to export - can be size in pixels OR variant name
// Set to a number (16) for pixel-based matching, or a string ("Size=16") for name-based matching
const ICON_VARIANT_SIZE = 16;
const ICON_VARIANT_NAME = 'Size=16'; // Alternative: match by variant name

// Also include standalone components (not just component sets with variants)
const INCLUDE_STANDALONE_COMPONENTS = true;

// DSAi Icon sizes (matches IconProps)
const DSAI_ICON_SIZES = ['16', '20', '24', '32', '40', '48'];

/**
 * Allowed props for security (matches DSAi Icon component ALLOWED_PROPS)
 */
const ALLOWED_PROPS = `const ALLOWED_PROPS = [
  'id',
  'data-testid',
  'data-icon',
  'focusable',
  'preserveAspectRatio',
  'transform',
  'opacity',
] as const;`;

/**
 * Generate the DSAi-compatible icon component template
 */
function generateIconComponent(iconName, svgContent, viewBox = '0 0 16 16') {
  return `/**
 * ${iconName}
 *
 * DSAi Design System - React Component
 * Auto-generated from Figma. DO NOT EDIT MANUALLY.
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * \`\`\`tsx
 * <Button startIcon={<${iconName} />}>Click me</Button>
 * \`\`\`
 *
 * @example Semantic (standalone)
 * \`\`\`tsx
 * <${iconName} aria-label="Description" />
 * \`\`\`
 */
import { forwardRef, useMemo } from 'react';
import type { IconProps } from '../types';

${ALLOWED_PROPS}

export const ${iconName} = forwardRef<SVGSVGElement, IconProps>(
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
        ${svgContent}
      </svg>
    );
  }
);

${iconName}.displayName = '${iconName}';
`;
}

/**
 * Generate Figma Code Connect mapping
 */
function generateCodeConnect(iconName, nodeId) {
  const sizeEnum = DSAI_ICON_SIZES.map((s) => `"${s}": "${s}"`).join(', ');
  return `figma.connect(${iconName}, "${FIGMA_URL_SUBSTITUTION}?node-id=${nodeId}", {
  props: {
    size: figma.enum("Size", { ${sizeEnum} }),
  },
  example: ({ size }) => <${iconName} size={size} />,
});`;
}

/**
 * Clean SVG content for React compatibility
 */
function cleanSvgContent(svg) {
  return (
    svg
      // Convert kebab-case attributes to camelCase for React
      .replaceAll(
        /(stroke|fill|line|clip|stop|color|font|text|letter|word|alignment|dominant|glyph|horiz|overline|paint|pointer|shape|strikethrough|stroke|underline|unicode|units|v|vert|writing|x)-(.)/g,
        (_, p1, p2) => p1 + p2.toUpperCase()
      )
      // Remove outer SVG tags (we wrap in our own)
      .replaceAll(/<svg[^>]*>/g, '')
      .replaceAll(/<\/svg>/g, '')
      // Use currentColor for strokes and fills (inherits from CSS)
      .replaceAll(/stroke="#[^"]+"/g, 'stroke="currentColor"')
      .replaceAll(/fill="#[^"]+"/g, 'fill="currentColor"')
      // Handle fill="none" (keep as-is, common for stroke-only icons)
      .replaceAll(/fill="currentColor"([^>]*stroke)/g, 'fill="none"$1')
      // Remove newlines for cleaner output
      .replaceAll('\n', '')
      // Trim whitespace
      .trim()
  );
}

/**
 * Convert Figma component name to PascalCase icon name
 */
function toIconName(name) {
  return `${name
    .split(/[^a-zA-Z0-9]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.substring(1).toLowerCase())
    .join('')}Icon`;
}

/**
 * Extract viewBox from SVG string
 */
function extractViewBox(svg) {
  const match = svg.match(/viewBox="([^"]+)"/);
  return match ? match[1] : '0 0 16 16';
}

/**
 * Main plugin execution
 */
async function run() {
  const exports = [];
  const files = [];
  const codeConnects = [];
  const skipped = [];

  // Find all component sets (icon variants) on current page
  const componentSets = figma.currentPage.findAllWithCriteria({
    types: ['COMPONENT_SET'],
  });

  // Also find standalone components if enabled
  const standaloneComponents = INCLUDE_STANDALONE_COMPONENTS
    ? figma.currentPage
        .findAllWithCriteria({
          types: ['COMPONENT'],
        })
        .filter((c) => !c.parent || c.parent.type !== 'COMPONENT_SET')
    : [];

  const allItems = [...componentSets, ...standaloneComponents];

  if (allItems.length === 0) {
    figma.showUI(
      `<div style="padding: 20px; font-family: system-ui;">
        <h3>No icons found</h3>
        <p>Make sure you're on a page with icon components.</p>
        <p>Looking for: Component Sets with size variants, or standalone Components.</p>
        <p><strong>Tip:</strong> Select a frame or section containing icons and try again.</p>
      </div>`,
      { height: 200, width: 400 }
    );
    return;
  }

  // Process each item
  await Promise.all(
    allItems.map(async (item) => {
      const iconName = toIconName(item.name);
      let nodeToExport = null;
      const nodeId = item.id;

      if (item.type === 'COMPONENT_SET') {
        // For component sets, find the base variant
        // Try multiple strategies:
        // 1. Match by variant name (e.g., "Size=16")
        // 2. Match by exact width
        // 3. Match by smallest size
        nodeToExport =
          item.children.find((child) => child.name === ICON_VARIANT_NAME) ||
          item.children.find((child) => child.width === ICON_VARIANT_SIZE) ||
          item.children.find((child) => child.width <= 24) || // Fallback: smallest reasonable icon
          item.children[0]; // Last resort: first variant
      } else if (item.type === 'COMPONENT') {
        // Standalone component - use directly
        nodeToExport = item;
      }

      if (!nodeToExport) {
        skipped.push(`${item.name}: no suitable variant found`);
        console.log(`Skipping ${item.name}: no suitable variant found`);
        return;
      }

      try {
        // Export SVG
        const svg = await nodeToExport.exportAsync({ format: 'SVG_STRING' });
        const viewBox = extractViewBox(svg);
        const svgContent = cleanSvgContent(svg);

        // Generate component file
        const componentCode = generateIconComponent(iconName, svgContent, viewBox);
        files.push([`${iconName}.tsx`, componentCode]);

        // Generate export statement
        exports.push(`export { ${iconName} } from './components/${iconName}';`);

        // Generate Code Connect mapping
        codeConnects.push(generateCodeConnect(iconName, nodeId));
      } catch (error) {
        skipped.push(`${item.name}: ${error.message}`);
        console.error(`Error processing ${item.name}:`, error);
      }
    })
  );

  // Sort alphabetically
  exports.sort();
  files.sort((a, b) => a[0].localeCompare(b[0]));
  codeConnects.sort();

  // Generate index.ts content
  const indexContent = `/**
 * DSAi Icons - React Components
 *
 * Auto-generated from Figma. DO NOT EDIT MANUALLY.
 * Run the Figma plugin to regenerate.
 *
 * @packageDocumentation
 */

${exports.join('\n')}

// Re-export types
export type { IconProps, IconComponent } from './types';
`;

  // Generate Code Connect file content
  const codeConnectContent = `/**
 * DSAi Icons - Figma Code Connect
 *
 * Auto-generated. DO NOT EDIT MANUALLY.
 * Maps Figma icon components to React implementations.
 */
import figma from '@figma/code-connect';

// Import all icons
${exports.map((e) => e.replaceAll("from './components/", "from '@dsai-io/react/components/Icon/components/")).join('\n')}

// Code Connect mappings
${codeConnects.join('\n\n')}
`;

  // Build debug info (avoid nested template literals)
  const componentSetsList = componentSets
    .map(
      (cs) =>
        '  - ' +
        cs.name +
        ' (children: ' +
        cs.children.length +
        ', sizes: ' +
        cs.children.map((c) => `${c.width}px`).join(', ') +
        ')'
    )
    .join('\n');
  const standaloneList = standaloneComponents
    .map((c) => `  - ${c.name} (${c.width}x${c.height}px)`)
    .join('\n');
  const skippedInfo =
    skipped.length > 0 ? `\n\nSkipped (${skipped.length}):\n${skipped.join('\n')}` : '';

  const debugContent = `Configuration:
- ICON_VARIANT_SIZE: ${ICON_VARIANT_SIZE}px
- ICON_VARIANT_NAME: "${ICON_VARIANT_NAME}"
- INCLUDE_STANDALONE_COMPONENTS: ${INCLUDE_STANDALONE_COMPONENTS}

Found on page "${figma.currentPage.name}":
- Component Sets: ${componentSets.length}
- Standalone Components: ${standaloneComponents.length}

Component Sets:
${componentSetsList}

Standalone Components:
${standaloneList}
${skippedInfo}`;

  // Show UI with results
  figma.showUI(
    `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background: #1e1e1e;
      color: #fff;
    }
    .header {
      padding: 16px;
      background: #2d2d2d;
      border-bottom: 1px solid #3d3d3d;
    }
    .header h2 { margin: 0 0 8px 0; }
    .header p { margin: 0; color: #999; font-size: 14px; }
    .header .stats { margin-top: 8px; font-size: 12px; color: #666; }
    .tabs {
      display: flex;
      background: #2d2d2d;
      border-bottom: 1px solid #3d3d3d;
    }
    .tab {
      padding: 12px 20px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      color: #999;
    }
    .tab:hover { color: #fff; }
    .tab.active {
      color: #fff;
      border-bottom-color: #0d99ff;
    }
    .content { display: none; height: calc(100vh - 160px); }
    .content.active { display: block; }
    textarea {
      width: 100%;
      height: 100%;
      padding: 16px;
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 12px;
      line-height: 1.5;
      background: #1e1e1e;
      color: #d4d4d4;
      border: none;
      resize: none;
      white-space: pre;
    }
    textarea:focus { outline: none; }
  </style>
</head>
<body>
  <div class="header">
    <h2>DSAi Icon Generator</h2>
    <p>Generated ${files.length} icons from ${allItems.length} items found</p>
    <div class="stats">
      Component Sets: ${componentSets.length} | Standalone: ${standaloneComponents.length} | Skipped: ${skipped.length}
    </div>
  </div>
  <div class="tabs">
    <div class="tab active" onclick="showTab('index')">index.ts</div>
    <div class="tab" onclick="showTab('files')">Components (${files.length})</div>
    <div class="tab" onclick="showTab('connect')">Code Connect</div>
    <div class="tab" onclick="showTab('debug')">Debug</div>
  </div>
  <div id="index" class="content active">
    <textarea readonly>${indexContent}</textarea>
  </div>
  <div id="files" class="content">
    <textarea readonly>${JSON.stringify(files, null, 2)}</textarea>
  </div>
  <div id="connect" class="content">
    <textarea readonly>${codeConnectContent}</textarea>
  </div>
  <div id="debug" class="content">
    <textarea readonly>${debugContent}</textarea>
  </div>
  <script>
    function showTab(id) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById(id).classList.add('active');
    }
  </script>
</body>
</html>`,
    {
      height: 700,
      width: 900,
      title: 'DSAi Icon Generator',
    }
  );
}

run().catch(console.error);
