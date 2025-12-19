import fs from 'node:fs';
import path from 'node:path';

/**
 * DSAi Icon Generator - REST API Version
 *
 * This script fetches icons from a Figma file via REST API and generates
 * React components compatible with the DSAi design system (@dsai/react).
 *
 * Usage:
 *   node --env-file=.env app.mjs          # Full fetch + generate
 *   node --env-file=.env app.mjs --skip-rest-api  # Use cached icons.json
 *
 * Environment variables (.env file):
 *   FIGMA_ACCESS_TOKEN - Your Figma personal access token
 *   FIGMA_FILE_KEY - The file key from your Figma icons URL
 *
 * Output:
 *   - packages/@dsai/react/src/components/Icon/components/*.tsx
 *   - packages/@dsai/react/src/components/Icon/index.ts
 *   - packages/@dsai/react/src/figma/icons/Icons.figma.tsx
 *
 * Security Note: This is a build-time tool that runs locally with environment
 * variables. The URLs are from Figma's trusted API and the filenames are derived
 * from Figma component names (alphanumeric only after sanitization).
 */

const TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY;
const URL_BASE = 'https://api.figma.com/v1/files';
const URL_BASE_IMAGES = 'https://api.figma.com/v1/images';

// The name of the variant for each icon you want to export (base 16px size)
const ICON_VARIANT_NAME = 'Size=16';

// The node ids from root to icon component parent
const ROOT_TRAVERSE_IDS = ['7809:18809', '522:12152']; // Page ID > Section ID

// Output paths (relative to this script)
const OUTPUT_BASE = '../../packages/@dsai/react/src';
const ICONS_OUTPUT = `${OUTPUT_BASE}/components/Icon/components`;
const INDEX_OUTPUT = `${OUTPUT_BASE}/components/Icon/index.ts`;
const FIGMA_CONNECT_OUTPUT = `${OUTPUT_BASE}/figma/icons/Icons.figma.tsx`;

// URL substitution for Code Connect (matches figma.config.json)
const FIGMA_URL_SUBSTITUTION = '<FIGMA_DSAI_ICONS>';

// DSAi Icon sizes
const DSAI_ICON_SIZES = ['16', '20', '24', '32', '40', '48'];

// Skip REST API flag - use cached icons.json instead
const SKIP_REST_API = process.argv.includes('--skip-rest-api');

/**
 * Securely write a file within a restricted base directory.
 * Prevents path traversal attacks by validating the resolved path.
 *
 * SECURITY: This function is safe despite static analysis warnings because:
 * 1. Filenames are pre-sanitized to alphanumeric only (no path separators)
 * 2. Path separators in filename are explicitly rejected
 * 3. Path is normalized and validated against base directory
 * 4. This is a build-time CLI tool, not a web server
 *
 * @param {string} baseDir - The allowed base directory (must be absolute or resolved)
 * @param {string} filename - The sanitized filename (no path separators allowed)
 * @param {string} content - The file content to write
 * @returns {boolean} - True if write succeeded, false if path validation failed
 */
function secureWriteFile(baseDir, filename, content) {
  // Reject filenames containing path separators
  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
    console.error(`Security: Invalid filename rejected: ${filename}`);
    return false;
  }

  // Resolve the base directory to an absolute path
  const resolvedBase = path.resolve(baseDir);

  // Construct and normalize the full path
  const fullPath = path.normalize(path.join(resolvedBase, filename));

  // Verify the path stays within the base directory
  if (!fullPath.startsWith(resolvedBase + path.sep) && fullPath !== resolvedBase) {
    console.error(`Security: Path traversal attempt blocked: ${filename}`);
    return false;
  }

  // nosemgrep: javascript.lang.security.audit.path-traversal.path-traversal-join
  // Safe: filename is pre-validated (no path separators, alphanumeric only)
  fs.writeFileSync(fullPath, content);
  return true;
}

/**
 * Allowed props for security (matches DSAi Icon component)
 */
const ALLOWED_PROPS_CODE = `const ALLOWED_PROPS = [
  'id',
  'data-testid',
  'data-icon',
  'focusable',
  'preserveAspectRatio',
  'transform',
  'opacity',
] as const;`;

/**
 * Generate a DSAi-compatible icon component
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

${ALLOWED_PROPS_CODE}

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
 * Generate Figma Code Connect mapping for an icon
 */
function generateCodeConnect(iconName, componentSetId) {
  const sizeEnum = DSAI_ICON_SIZES.map((s) => `"${s}": "${s}"`).join(', ');
  return `figma.connect(${iconName}, "${FIGMA_URL_SUBSTITUTION}?node-id=${componentSetId}", {
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
      .replace(
        /(stroke|fill|line|clip|stop|color|font|text|letter|word|alignment|dominant|glyph|horiz|overline|paint|pointer|shape|strikethrough|stroke|underline|unicode|units|v|vert|writing|x)-(.)/g,
        (_, p1, p2) => p1 + p2.toUpperCase()
      )
      // Remove outer SVG tags (we wrap in our own)
      .replace(/<svg[^>]*>/, '')
      .replace(/<\/svg>/, '')
      // Use currentColor for strokes and fills (inherits from CSS)
      .replace(/stroke="#[^"]+"/g, 'stroke="currentColor"')
      .replace(/fill="#[^"]+"/g, 'fill="currentColor"')
      // Handle fill="none" (keep as-is, common for stroke-only icons)
      .replace(/fill="currentColor"([^>]*stroke)/g, 'fill="none"$1')
      // Remove newlines for cleaner output
      .replace(/\n/g, '')
      // Trim whitespace
      .trim()
  );
}

/**
 * Extract viewBox from SVG string
 */
function extractViewBox(svg) {
  const match = svg.match(/viewBox="([^"]+)"/);
  return match ? match[1] : '0 0 16 16';
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
 * Main execution
 */
async function run() {
  console.log('DSAi Icon Generator');
  console.log('===================\n');

  // Fetch from Figma API or use cached data
  if (!SKIP_REST_API) {
    console.log('Fetching icon data from Figma API...');
    const data = await getIconComponents();
    const names = data.map((a) => a.name).sort();

    // Write intermediate files for debugging/caching
    fs.writeFileSync(
      './Icons.figma.txt',
      `import figma from '@figma/code-connect';\nimport { ${names.join(', ')} } from '@dsai/react/components/Icon';\n`
    );
    fs.writeFileSync(
      './icons-index.txt',
      names.map((n) => `export { ${n} } from './components/${n}';`).join('\n')
    );
    fs.writeFileSync('./icons.json', JSON.stringify(data, null, 2));
    console.log(`Cached ${data.length} icons to icons.json\n`);
  } else {
    console.log('Using cached icons.json (--skip-rest-api flag detected)\n');
  }

  // Parse the cached icon data
  const iconData = JSON.parse(fs.readFileSync('./icons.json'));
  console.log(`Processing ${iconData.length} icons...\n`);

  // Ensure output directory exists
  fs.mkdirSync(ICONS_OUTPUT, { recursive: true });
  fs.mkdirSync(`${OUTPUT_BASE}/figma/icons`, { recursive: true });

  // Generate component files
  const exports = [];
  const codeConnects = [];

  for (const icon of iconData) {
    const { name, componentCode, codeConnect } = icon;
    // Sanitize filename to prevent path traversal (alphanumeric + Icon suffix only)
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '');
    if (!safeName.endsWith('Icon')) {
      console.warn(`Skipping invalid icon name: ${name}`);
      continue;
    }

    // Use secure write function to prevent path traversal
    const filename = `${safeName}.tsx`;
    if (!secureWriteFile(ICONS_OUTPUT, filename, componentCode)) {
      console.warn(`Failed to write icon: ${name}`);
      continue;
    }

    exports.push(`export { ${safeName} } from './components/${safeName}';`);
    codeConnects.push(codeConnect);
  }

  // Sort alphabetically
  exports.sort();
  codeConnects.sort();

  // Generate index.ts
  const indexContent = `/**
 * DSAi Icons - React Components
 *
 * Auto-generated from Figma. DO NOT EDIT MANUALLY.
 * Run: node --env-file=.env tools/icons/app.mjs
 *
 * @packageDocumentation
 */

${exports.join('\n')}

// Re-export types
export type { IconProps, IconComponent } from './types';
`;
  fs.writeFileSync(INDEX_OUTPUT, indexContent);
  console.log(`Generated ${INDEX_OUTPUT}`);

  // Generate Code Connect file
  const importNames = iconData.map((i) => i.name).sort();
  const codeConnectContent = `/**
 * DSAi Icons - Figma Code Connect
 *
 * Auto-generated from Figma. DO NOT EDIT MANUALLY.
 * Maps Figma icon components to React implementations.
 */
import figma from '@figma/code-connect';
import { ${importNames.join(', ')} } from '@dsai/react/components/Icon';

${codeConnects.join('\n\n')}
`;
  fs.writeFileSync(FIGMA_CONNECT_OUTPUT, codeConnectContent);
  console.log(`Generated ${FIGMA_CONNECT_OUTPUT}`);

  console.log(`\n✅ Done! Generated ${iconData.length} icon components.`);
}

/**
 * Get icon components from Figma REST API
 */
async function getIconComponents() {
  const fileResponse = await fetch(`${URL_BASE}/${FILE_KEY}`, {
    method: 'GET',
    headers: { 'X-FIGMA-TOKEN': TOKEN },
  });
  const data = await fileResponse.json();
  return await processFileResponse(data);
}

/**
 * Get SVG images from Figma
 */
async function getSVGImages(nodeIds) {
  const fileResponse = await fetch(
    `${URL_BASE_IMAGES}/${FILE_KEY}?format=svg&ids=${nodeIds.join(',')}`,
    {
      method: 'GET',
      headers: { 'X-FIGMA-TOKEN': TOKEN },
    }
  );
  return await fileResponse.json();
}

/**
 * Process Figma file response into icon data
 */
async function processFileResponse(response) {
  // Navigate to icon parent node
  let parentNode = response.document;
  for (const id of ROOT_TRAVERSE_IDS) {
    parentNode = parentNode.children.find((a) => a.id === id);
  }

  if (!parentNode) {
    throw new Error('Could not find icon parent node. Check ROOT_TRAVERSE_IDS.');
  }

  // Collect icon nodes
  const iconNodes = {};
  parentNode.children.forEach((component) => {
    const icon =
      component.type === 'COMPONENT_SET'
        ? component.children.find((child) => child.name === ICON_VARIANT_NAME)
        : component.type === 'COMPONENT'
          ? component
          : null;

    if (icon) {
      const iconName = toIconName(component.name);
      iconNodes[icon.id] = { name: iconName, componentSetId: component.id };
    }
  });

  const nodeIds = Object.keys(iconNodes);
  console.log(`Found ${nodeIds.length} icons to process`);

  // Get SVG URLs
  const { images } = await getSVGImages(nodeIds);

  // Wait for S3 images to be available
  console.log('Waiting for images to be available...');
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Process each icon
  const results = [];
  const fails = [];

  await Promise.all(
    nodeIds.map(async (nodeId) => {
      try {
        const result = await processIconNode(nodeId, iconNodes, images);
        results.push(result);
      } catch {
        fails.push(nodeId);
        console.log(`Failed: ${iconNodes[nodeId].name} - retrying...`);
      }
    })
  );

  // Retry failed icons
  if (fails.length > 0) {
    console.log(`Retrying ${fails.length} failed icons...`);
    await Promise.all(
      fails.map(async (nodeId) => {
        try {
          const result = await processIconNode(nodeId, iconNodes, images);
          results.push(result);
        } catch {
          console.error(`Failed again: ${iconNodes[nodeId].name}`);
        }
      })
    );
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Process a single icon node
 * @param {string} nodeId - The Figma node ID
 * @param {Object} iconNodes - Map of node IDs to icon metadata
 * @param {Object} images - Map of node IDs to S3 URLs (from Figma API)
 */
async function processIconNode(nodeId, iconNodes, images) {
  const imageUrl = images[nodeId];

  // Security: Validate URL is from Figma's trusted S3 buckets
  // Figma API returns SVG URLs in formats like:
  // - https://s3-us-west-2.amazonaws.com/figma-alpha-api/...
  // - https://figma-alpha-api.s3.us-west-2.amazonaws.com/...
  // - https://s3-alpha.figma.com/...
  const ALLOWED_HOSTS = [
    's3-us-west-2.amazonaws.com',
    'figma-alpha-api.s3.us-west-2.amazonaws.com',
    's3-alpha.figma.com',
    'figma-alpha.s3.us-west-2.amazonaws.com',
  ];

  if (!imageUrl) {
    throw new Error(`No image URL for ${nodeId}`);
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    throw new Error(`Invalid URL format for ${nodeId}: ${imageUrl}`);
  }

  // Validate protocol and host
  if (parsedUrl.protocol !== 'https:') {
    throw new Error(`URL must use HTTPS for ${nodeId}`);
  }

  const isAllowedHost = ALLOWED_HOSTS.some(
    (host) => parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`)
  );

  if (!isAllowedHost) {
    throw new Error(`URL host not in allowlist for ${nodeId}: ${parsedUrl.hostname}`);
  }

  // Fetch from validated URL
  // nosemgrep: javascript.lang.security.audit.ssrf.node-ssrf
  // Safe: URL is validated against ALLOWED_HOSTS allowlist above (Figma S3 buckets only)
  const svgResponse = await fetch(parsedUrl.href, { method: 'GET' });
  const svg = await svgResponse.text();

  const { name, componentSetId } = iconNodes[nodeId];
  const viewBox = extractViewBox(svg);
  const svgContent = cleanSvgContent(svg);

  return {
    name,
    componentSetId,
    componentCode: generateIconComponent(name, svgContent, viewBox),
    codeConnect: generateCodeConnect(name, componentSetId),
  };
}

run();
