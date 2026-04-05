/**
 * Grouped token structure for easy access in components
 * Auto-generated helper - builds grouped structure from flat tokens
 */

import * as flat from './tokens.js';

// Type for Storybook compatibility (.value property)
interface TokenValue {
  value: string;
  cssVar: string;
}

// ============================================================================
// Safe Token Structure Builders
// ============================================================================

/**
 * Safely set a value in a nested Map structure
 */
function setNestedMapValue(
  map: Map<string, Map<string, TokenValue>>,
  category: string,
  key: string,
  token: TokenValue
): void {
  if (!map.has(category)) {
    map.set(category, new Map());
  }
  const innerMap = map.get(category);
  if (innerMap) {
    innerMap.set(key, token);
  }
}

/**
 * Convert a Map<string, TokenValue> to Record<string, TokenValue>
 */
function mapToRecord(map: Map<string, TokenValue>): Record<string, TokenValue> {
  return Object.fromEntries(map.entries());
}

/**
 * Convert nested Map to nested Record
 */
function nestedMapToRecord(
  map: Map<string, Map<string, TokenValue>>
): Record<string, Record<string, TokenValue>> {
  const entries: [string, Record<string, TokenValue>][] = [];
  map.forEach((innerMap, key) => {
    entries.push([key, mapToRecord(innerMap)]);
  });
  return Object.fromEntries(entries);
}

// ============================================================================
// Token Grouping Logic
// ============================================================================

const colorMap = new Map<string, Map<string, TokenValue>>();
const themeMap = new Map<string, TokenValue>();
const semanticMap = new Map<string, TokenValue>();
const neutralMap = new Map<string, TokenValue>();
const backgroundMap = new Map<string, TokenValue>();
const opacityMap = new Map<string, TokenValue>();
const borderColorMap = new Map<string, TokenValue>();
const borderWidthMap = new Map<string, TokenValue>();
const typographyMap = new Map<string, TokenValue>();
const spacingMap = new Map<string, TokenValue>();

/**
 * Convert camelCase name to kebab-case
 */
function toKebabCase(name: string): string {
  return (
    name.charAt(0).toLowerCase() +
    name
      .slice(1)
      .replaceAll(/([A-Z])/g, '-$1')
      .toLowerCase()
  );
}

/** Route a parsed token to the appropriate category map */
function routeToken(key: string, token: TokenValue): void {
  if (key.startsWith('Color')) {
    const match = /^Color([A-Z][a-z]+)_(\d+)$/.exec(key);
    if (match?.[1] && match[2]) {
      const hue = match[1].toLowerCase();
      token.cssVar = `--dsai-color-${hue}-${match[2]}`;
      setNestedMapValue(colorMap, hue, match[2], token);
    }
    return;
  }

  // Simple prefix-to-map routing table
  const prefixRoutes: Array<[string, string, Map<string, TokenValue>]> = [
    ['Theme', 'theme', themeMap],
    ['Semantic', 'semantic', semanticMap],
    ['Neutral', 'neutral', neutralMap],
    ['Background', 'background', backgroundMap],
    ['BorderColor', 'border-color', borderColorMap],
    ['Typography', 'typography', typographyMap],
  ];

  for (const [prefix, cssCategory, map] of prefixRoutes) {
    if (key.startsWith(prefix)) {
      const name = key.replace(prefix, '');
      const kebab = toKebabCase(name);
      token.cssVar = `--dsai-${cssCategory}-${kebab}`;
      map.set(kebab, token);
      return;
    }
  }

  if (key.startsWith('Opacity_')) {
    const num = key.replace('Opacity_', '');
    token.cssVar = `--dsai-opacity-${num}`;
    opacityMap.set(num, token);
  } else if (key.startsWith('BorderWidth_')) {
    const num = key.replace('BorderWidth_', '');
    token.cssVar = `--dsai-border-width-${num}`;
    borderWidthMap.set(num, token);
  } else if (key.startsWith('Spacing')) {
    const name = key.replace('Spacing_', '');
    token.cssVar = `--dsai-spacing-${name}`;
    spacingMap.set(name, token);
  }
}

// Parse flat tokens into Maps
// Token keys are PascalCase with underscores for numbers (e.g. ColorBlue_50, ThemePrimary)
Object.entries(flat).forEach(([key, value]) => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return;
  }
  const token: TokenValue = { value: String(value) };
  routeToken(key, token);
});

// Export grouped structure
export const tokens = {
  color: nestedMapToRecord(colorMap),
  theme: mapToRecord(themeMap),
  semantic: mapToRecord(semanticMap),
  neutral: mapToRecord(neutralMap),
  background: mapToRecord(backgroundMap),
  opacity: mapToRecord(opacityMap),
  border: {
    color: mapToRecord(borderColorMap),
    width: mapToRecord(borderWidthMap),
  },
  typography: mapToRecord(typographyMap),
  spacing: mapToRecord(spacingMap),
};

export default tokens;
