/**
 * Grouped token structure for easy access in components
 * Auto-generated helper - builds grouped structure from flat tokens
 */

import * as flat from './tokens.js';

// Type for Storybook compatibility (.value property)
interface TokenValue {
  value: string;
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
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
  );
}

// Parse flat tokens into Maps
Object.entries(flat).forEach(([key, value]) => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return;
  }

  const token: TokenValue = { value: String(value) };

  if (key.startsWith('color')) {
    // colorBlue50 -> color.blue['50']
    const match = key.match(/^color([A-Z][a-z]+)(\d+)$/);
    if (match?.[1] && match[2]) {
      const hue = match[1].toLowerCase();
      const step = match[2];
      setNestedMapValue(colorMap, hue, step, token);
    }
  } else if (key.startsWith('theme')) {
    const name = key.replace('theme', '');
    themeMap.set(toKebabCase(name), token);
  } else if (key.startsWith('semantic')) {
    const name = key.replace('semantic', '');
    semanticMap.set(toKebabCase(name), token);
  } else if (key.startsWith('neutral')) {
    const name = key.replace('neutral', '');
    neutralMap.set(toKebabCase(name), token);
  } else if (key.startsWith('background')) {
    const name = key.replace('background', '');
    backgroundMap.set(toKebabCase(name), token);
  } else if (key.startsWith('opacity')) {
    const num = key.replace('opacity', '');
    opacityMap.set(num, token);
  } else if (key.startsWith('borderColor')) {
    const name = key.replace('borderColor', '');
    borderColorMap.set(toKebabCase(name), token);
  } else if (key.startsWith('borderWidth')) {
    const name = key.replace('borderWidth', '');
    borderWidthMap.set(toKebabCase(name), token);
  } else if (key.startsWith('typography')) {
    const name = key.replace('typography', '');
    typographyMap.set(toKebabCase(name), token);
  } else if (key.startsWith('spacing')) {
    const name = key.replace('spacing', '');
    spacingMap.set(name, token);
  }
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
