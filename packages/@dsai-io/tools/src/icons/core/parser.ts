/**
 * SVG parser
 *
 * Parses SVG content into structured data.
 *
 * @packageDocumentation
 */

import { normalizeIconName, toComponentName } from '../utils/naming.js';

import type { ParsedSVG, RawSVGData } from '../types.js';

/**
 * Parse raw SVG data into structured format
 *
 * Extracts viewBox, attributes, inner content, and accessibility info.
 *
 * @param raw - Raw SVG data
 * @returns Parsed SVG data
 */
export function parseSVG(raw: RawSVGData): ParsedSVG {
  const { content, fileName } = raw;

  // Extract SVG opening tag attributes
  const svgMatch = /<svg([^>]*)>/i.exec(content);
  const svgAttributes = svgMatch?.[1] ?? '';

  // Parse attributes into object
  const attributes: Record<string, string> = {};
  const attrRegex = /([a-zA-Z][a-zA-Z0-9-]*)=["']([^"']*)["']/g;

  for (const attrMatch of svgAttributes.matchAll(attrRegex)) {
    const key = attrMatch[1];
    const value = attrMatch[2];
    if (key && value !== undefined) {
      Object.assign(attributes, { [key]: value });
    }
  }

  // Extract viewBox (or construct from width/height)
  let viewBox = attributes['viewBox'] ?? '';
  if (!viewBox) {
    const width = attributes['width']?.replaceAll(/[^\d.]/g, '') ?? '24';
    const height = attributes['height']?.replaceAll(/[^\d.]/g, '') ?? '24';
    viewBox = `0 0 ${width} ${height}`;
  }

  // Extract inner content (everything between <svg> and </svg>)
  const innerContentMatch = /<svg[^>]*>([\s\S]*?)<\/svg>/i.exec(content);
  const innerContent = innerContentMatch?.[1]?.trim() ?? '';

  // Extract title for accessibility
  const titleMatch = /<title>([^<]*)<\/title>/i.exec(content);
  const title = titleMatch?.[1];

  // Extract description for accessibility
  const descMatch = /<desc>([^<]*)<\/desc>/i.exec(content);
  const description = descMatch?.[1];

  // Generate normalized name and component name
  const name = normalizeIconName(fileName);
  const componentName = toComponentName(fileName);

  return {
    name,
    componentName,
    fileName,
    viewBox,
    width: attributes['width'],
    height: attributes['height'],
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

/**
 * Clean SVG content for React compatibility
 *
 * Converts kebab-case attributes to camelCase for JSX.
 *
 * @param svg - SVG content string
 * @returns Cleaned SVG content
 */
/**
 * SVG attribute prefixes that use kebab-case and need camelCase conversion for React.
 * Kept as an array for readability; joined into a regex alternation at module load.
 */
const SVG_KEBAB_PREFIXES = [
  'stroke', 'fill', 'line', 'clip', 'stop', 'color', 'font', 'text',
  'letter', 'word', 'alignment', 'dominant', 'glyph', 'horiz', 'overline',
  'paint', 'pointer', 'shape', 'strikethrough', 'underline', 'unicode',
  'units', 'vert', 'writing',
];

// Pattern is built from a static array — safe to construct dynamically.
// eslint-disable-next-line security/detect-non-literal-regexp
const SVG_KEBAB_ATTR_PATTERN = new RegExp(
  `(${SVG_KEBAB_PREFIXES.join('|')})-([a-z])`,
  'g'
);

export function cleanSVGForReact(svg: string): string {
  return (
    svg
      // Convert kebab-case attributes to camelCase for React
      .replaceAll(
        SVG_KEBAB_ATTR_PATTERN,
        (_, p1, p2) => p1 + p2.toUpperCase()
      )
      // Convert specific attributes
      .replaceAll('class="', 'className="')
      .replaceAll('xlink:href', 'xlinkHref')
      .replaceAll('xmlns:xlink', 'xmlnsXlink')
      // Use currentColor for strokes and fills (inherits from CSS)
      .replaceAll(/stroke="#[^"]+"/g, 'stroke="currentColor"')
      .replaceAll(/fill="#[^"]+"/g, 'fill="currentColor"')
      // Handle fill="none" (keep as-is, common for stroke-only icons)
      .replaceAll(/fill="currentColor"([^>]*stroke)/g, 'fill="none"$1')
  );
}

/**
 * Extract viewBox from SVG string
 *
 * @param svg - SVG content string
 * @returns ViewBox string or default
 */
export function extractViewBox(svg: string): string {
  const match = /viewBox="([^"]+)"/.exec(svg);
  return match?.[1] ?? '0 0 24 24';
}
