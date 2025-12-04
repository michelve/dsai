/**
 * Grouped token structure for easy access in components
 * Auto-generated - do not edit manually
 */

import * as flat from './tokens-flat.js';

// Type for Storybook compatibility (.value property)
interface TokenValue {
  value: string;
}

// ============================================================================
// Safe Token Structure Builders
// ============================================================================

// Using Maps for safe dynamic key construction, then converting to plain objects
// This avoids ESLint security/detect-object-injection warnings while maintaining
// the same runtime behavior

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
 * Uses Object.fromEntries for safe object construction without dynamic property assignment
 */
function mapToRecord(map: Map<string, TokenValue>): Record<string, TokenValue> {
  return Object.fromEntries(map.entries());
}

/**
 * Convert nested Map to nested Record
 * Uses Object.fromEntries for safe object construction without dynamic property assignment
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

// Use Maps for building the structure
const colorMap = new Map<string, Map<string, TokenValue>>();
const themeMap = new Map<string, TokenValue>();
const semanticMap = new Map<string, TokenValue>();
const neutralMap = new Map<string, TokenValue>();
const backgroundMap = new Map<string, TokenValue>();
const opacityMap = new Map<string, TokenValue>();
const borderColorMap = new Map<string, TokenValue>();
const borderWidthMap = new Map<string, TokenValue>();

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

// Parse flat tokens into Maps (safe iteration with Object.entries)
Object.entries(flat).forEach(([key, value]) => {
  if (typeof value !== 'string') {
    return;
  }

  const token: TokenValue = { value };

  if (key.startsWith('color')) {
    // colorBlue50 -> color.blue['50']
    const match = key.match(/^color([A-Z][a-z]+)(\d+)$/);
    if (match && match[1] && match[2]) {
      const hue = match[1].toLowerCase();
      const step = match[2];
      setNestedMapValue(colorMap, hue, step, token);
    }
  } else if (key.startsWith('theme')) {
    // themePrimary -> theme.primary
    const name = key.replace('theme', '');
    themeMap.set(toKebabCase(name), token);
  } else if (key.startsWith('semantic')) {
    // semanticBodyColor -> semantic['body-color']
    const name = key.replace('semantic', '');
    semanticMap.set(toKebabCase(name), token);
  } else if (key.startsWith('neutral')) {
    // neutralWhite -> neutral.white
    const name = key.replace('neutral', '');
    neutralMap.set(toKebabCase(name), token);
  } else if (key.startsWith('background')) {
    // backgroundPrimary -> background.primary
    const name = key.replace('background', '');
    backgroundMap.set(toKebabCase(name), token);
  } else if (key.startsWith('opacity')) {
    // opacity50 -> opacity['50']
    const num = key.replace('opacity', '');
    opacityMap.set(num, token);
  } else if (key.startsWith('borderColor')) {
    // borderColorDefault -> border.color.default
    const name = key.replace('borderColor', '');
    borderColorMap.set(toKebabCase(name), token);
  } else if (key.startsWith('borderWidth')) {
    // borderWidthThin -> border.width.thin
    const name = key.replace('borderWidth', '');
    borderWidthMap.set(toKebabCase(name), token);
  }
});

// Convert Maps to Records for the final export
// This is safe: all keys come from controlled Map iteration, not external input
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
};

export default tokens;
