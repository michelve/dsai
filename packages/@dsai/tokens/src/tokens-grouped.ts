/**
 * Grouped token structure for easy access in components
 * Auto-generated - do not edit manually
 */

import * as flat from './tokens-flat.js';

// Type for Storybook compatibility (.value property)
interface TokenValue {
  value: string;
}

// Group tokens by category
const color: Record<string, Record<string, TokenValue>> = {};
const theme: Record<string, TokenValue> = {};
const component: { semantic: Record<string, TokenValue> } = { semantic: {} };
const neutral: Record<string, TokenValue> = {};
const background: Record<string, TokenValue> = {};
const opacity: Record<string, TokenValue> = {};
const border: { color: Record<string, TokenValue>; width: Record<string, TokenValue> } = {
  color: {},
  width: {},
};

// Parse flat tokens into nested structure
Object.entries(flat).forEach(([key, value]) => {
  if (typeof value !== 'string') return;

  const token: TokenValue = { value };

  if (key.startsWith('color')) {
    // colorBlue50 -> color.blue['50']
    const match = key.match(/^color([A-Z][a-z]+)(\d+)$/);
    if (match && match[1] && match[2]) {
      const hue = match[1].toLowerCase();
      const step = match[2];
      if (!color[hue]) color[hue] = {};
      color[hue][step] = token;
    }
  } else if (key.startsWith('theme')) {
    // themePrimary -> theme.primary
    const name = key.replace('theme', '');
    const kebab =
      name.charAt(0).toLowerCase() +
      name
        .slice(1)
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase();
    theme[kebab] = token;
  } else if (key.startsWith('componentSemantic')) {
    // componentSemanticWarningBgSubtle -> component.semantic['warning-bg-subtle']
    const name = key.replace('componentSemantic', '');
    const kebab =
      name.charAt(0).toLowerCase() +
      name
        .slice(1)
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase();
    component.semantic[kebab] = token;
  } else if (key.startsWith('neutral')) {
    // neutralWhite -> neutral.white
    const name = key.replace('neutral', '');
    const kebab =
      name.charAt(0).toLowerCase() +
      name
        .slice(1)
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase();
    neutral[kebab] = token;
  } else if (key.startsWith('background')) {
    // backgroundPrimary -> background.primary
    const name = key.replace('background', '');
    const kebab =
      name.charAt(0).toLowerCase() +
      name
        .slice(1)
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase();
    background[kebab] = token;
  } else if (key.startsWith('opacity')) {
    // opacity50 -> opacity['50']
    const num = key.replace('opacity', '');
    opacity[num] = token;
  } else if (key.startsWith('borderColor')) {
    // borderColorDefault -> border.color.default
    const name = key.replace('borderColor', '');
    const kebab =
      name.charAt(0).toLowerCase() +
      name
        .slice(1)
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase();
    border.color[kebab] = token;
  } else if (key.startsWith('borderWidth')) {
    // borderWidthThin -> border.width.thin
    const name = key.replace('borderWidth', '');
    const kebab =
      name.charAt(0).toLowerCase() +
      name
        .slice(1)
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase();
    border.width[kebab] = token;
  }
});

// Export grouped structure
export const tokens = {
  color,
  theme,
  component,
  neutral,
  background,
  opacity,
  border,
};

export default tokens;
