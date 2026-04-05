#!/usr/bin/env node

/**
 * Batch-update icon components to use shared useIconProps hook.
 *
 * This reduces cognitive complexity from ~11 to ~1 per component
 * by extracting shared logic into useIconProps.
 *
 * Usage:
 *   node tools/scripts/icons/reduce-icon-complexity.cjs
 */

const fs = require('node:fs');
const path = require('node:path');

const ICONS_DIR = path.join(
  __dirname,
  '../../../packages/@dsai-io/icons/src/components'
);

function transformIcon(content, filename) {
  const componentName = filename.replace('.tsx', '');

  // Extract the JSDoc header (everything before the first import)
  const jsDocMatch = content.match(/^(\/\*\*[\s\S]*?\*\/)\s*\nimport/);
  const jsDoc = jsDocMatch ? jsDocMatch[1] : '';

  // Extract viewBox
  const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 16 16';

  // Extract the SVG inner content (paths, circles, etc.)
  // Find everything between the closing > of the <svg> tag and </svg>
  const _svgInnerMatch = content.match(
    /\{titleContent && <title id=\{titleId\}>\{titleContent\}<\/title>\}[\s\S]*?(?=\s*<\/svg>)/
  );

  // If already transformed, skip
  if (content.includes('useIconProps')) {
    return null;
  }

  // Extract SVG children (everything between focusable="false" line and </svg>)
  // Look for the content after the title line or after {...allowedProps}
  const childrenMatch = content.match(
    /\{(?:\(title \|\| ariaLabel\)|titleContent) && <title[^>]*>[^<]*<\/title>\}\n([\s\S]*?)\s*<\/svg>/
  );

  let svgChildren = '';
  if (childrenMatch) {
    svgChildren = childrenMatch[1].trim();
  } else {
    // Try alternate pattern: content between > and </svg> after allowedProps
    const altMatch = content.match(
      /\{\.\.\.(allowedProps|filteredProps)\}\s*\n\s*>\n([\s\S]*?)\s*<\/svg>/
    );
    if (altMatch) {
      svgChildren = altMatch[2].trim();
    }
  }

  if (!svgChildren) {
    console.warn(`  ⚠️  Could not extract SVG children from ${filename}`);
    return null;
  }

  // Indent children properly (8 spaces)
  const indentedChildren = svgChildren
    .split('\n')
    .map((line) => (line.trim() ? `        ${line.trim()}` : ''))
    .filter(Boolean)
    .join('\n');

  const newContent = `${jsDoc}
import { forwardRef } from 'react';

import type { IconProps } from '../types';
import { useIconProps } from '../useIconProps';

export const ${componentName} = forwardRef<SVGSVGElement, IconProps>(
  (props, ref) => {
    const {
      color,
      className,
      style,
      ariaLabel,
      computedAriaHidden,
      titleId,
      computedLabelledBy,
      titleContent,
      allowedProps,
    } = useIconProps(props);

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
        aria-labelledby={computedLabelledBy}
        focusable="false"
        {...allowedProps}
      >
        {titleContent && <title id={titleId}>{titleContent}</title>}
${indentedChildren}
      </svg>
    );
  }
);

${componentName}.displayName = '${componentName}';
`;

  return newContent;
}

async function main() {
  console.log('🔧 Reducing icon component complexity...\n');

  const files = fs
    .readdirSync(ICONS_DIR)
    .filter((f) => f.endsWith('.tsx'));

  console.log(`📁 Found ${files.length} icon components\n`);

  let transformed = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    try {
      const filePath = path.join(ICONS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      const newContent = transformIcon(content, file);

      if (newContent === null) {
        skipped++;
        continue;
      }

      fs.writeFileSync(filePath, newContent);
      transformed++;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      errors++;
    }
  }

  console.log(`
✅ Transformation complete!
   - Transformed: ${transformed}
   - Skipped: ${skipped}
   - Errors: ${errors}
`);
}

main().catch(console.error);
