/**
 * Enhance color tokens with descriptions and proper Figma scopes
 * Based on Bootstrap documentation and usage patterns
 */

const fs = require('node:fs');
const path = require('node:path');

// Color descriptions based on Bootstrap docs
const colorDescriptions = {
  // Brand colors
  blue: {
    base: 'Primary brand blue - used for hyperlinks, focus styles, and component active states',
    100: 'Lightest blue tint (80%) - used for subtle backgrounds in alerts and hover states',
    200: 'Light blue tint (60%) - used for secondary backgrounds and lighter UI elements',
    300: 'Medium-light blue tint (40%) - used for borders and dividers',
    400: 'Medium blue tint (20%) - used for hover states and interactive elements',
    500: 'Base blue - primary brand color, default button color',
    600: 'Medium-dark blue shade (20%) - used for hover states on primary buttons',
    700: 'Dark blue shade (40%) - used for active states and emphasis',
    800: 'Darker blue shade (60%) - used for high contrast text and borders',
    900: 'Darkest blue shade (80%) - used for maximum contrast and shadows',
  },
  indigo: {
    base: 'Indigo brand color - vibrant purple-blue for accent and decorative elements',
    100: 'Lightest indigo tint (80%) - decorative backgrounds and cards',
    200: 'Light indigo tint (60%) - secondary backgrounds',
    300: 'Medium-light indigo tint (40%) - borders and dividers',
    400: 'Medium indigo tint (20%) - interactive elements',
    500: 'Base indigo - accent color for badges and tags',
    600: 'Medium-dark indigo shade (20%) - hover states',
    700: 'Dark indigo shade (40%) - active states',
    800: 'Darker indigo shade (60%) - high contrast elements',
    900: 'Darkest indigo shade (80%) - shadows and depth',
  },
  purple: {
    base: 'Purple brand color - used for creative and premium features',
    100: 'Lightest purple tint (80%) - subtle backgrounds for premium content',
    200: 'Light purple tint (60%) - secondary backgrounds',
    300: 'Medium-light purple tint (40%) - borders and dividers',
    400: 'Medium purple tint (20%) - interactive elements',
    500: 'Base purple - accent color for premium features',
    600: 'Medium-dark purple shade (20%) - hover states',
    700: 'Dark purple shade (40%) - active states',
    800: 'Darker purple shade (60%) - high contrast elements',
    900: 'Darkest purple shade (80%) - shadows and depth',
  },
  pink: {
    base: 'Pink brand color - used for attention-grabbing and promotional elements',
    100: 'Lightest pink tint (80%) - soft backgrounds for promotions',
    200: 'Light pink tint (60%) - secondary backgrounds',
    300: 'Medium-light pink tint (40%) - borders and dividers',
    400: 'Medium pink tint (20%) - interactive elements',
    500: 'Base pink - accent color for badges and highlights',
    600: 'Medium-dark pink shade (20%) - hover states',
    700: 'Dark pink shade (40%) - active states',
    800: 'Darker pink shade (60%) - high contrast elements',
    900: 'Darkest pink shade (80%) - shadows and depth',
  },
  red: {
    base: 'Danger/Error color - used for errors, dangerous actions, and destructive operations',
    100: 'Lightest red tint (80%) - error alert backgrounds',
    200: 'Light red tint (60%) - error borders and soft warnings',
    300: 'Medium-light red tint (40%) - error text backgrounds',
    400: 'Medium red tint (20%) - error hover states',
    500: 'Base red - primary error and danger color',
    600: 'Medium-dark red shade (20%) - error button hover',
    700: 'Dark red shade (40%) - error active states',
    800: 'Darker red shade (60%) - high contrast error text',
    900: 'Darkest red shade (80%) - error shadows and depth',
  },
  orange: {
    base: 'Orange brand color - used for call-to-action and energetic elements',
    100: 'Lightest orange tint (80%) - soft notification backgrounds',
    200: 'Light orange tint (60%) - secondary CTA backgrounds',
    300: 'Medium-light orange tint (40%) - borders and dividers',
    400: 'Medium orange tint (20%) - interactive elements',
    500: 'Base orange - accent color for CTAs and highlights',
    600: 'Medium-dark orange shade (20%) - CTA hover states',
    700: 'Dark orange shade (40%) - CTA active states',
    800: 'Darker orange shade (60%) - high contrast elements',
    900: 'Darkest orange shade (80%) - shadows and depth',
  },
  yellow: {
    base: 'Warning color - used for non-destructive warning messages and cautionary elements',
    100: 'Lightest yellow tint (80%) - warning alert backgrounds',
    200: 'Light yellow tint (60%) - subtle warning indicators',
    300: 'Medium-light yellow tint (40%) - warning borders',
    400: 'Medium yellow tint (20%) - warning hover states',
    500: 'Base yellow - primary warning color',
    600: 'Medium-dark yellow shade (20%) - warning button hover',
    700: 'Dark yellow shade (40%) - warning active states',
    800: 'Darker yellow shade (60%) - high contrast warning text',
    900: 'Darkest yellow shade (80%) - warning shadows',
  },
  green: {
    base: 'Success color - used for positive feedback, successful actions, and confirmations',
    100: 'Lightest green tint (80%) - success alert backgrounds',
    200: 'Light green tint (60%) - soft success indicators',
    300: 'Medium-light green tint (40%) - success borders',
    400: 'Medium green tint (20%) - success hover states',
    500: 'Base green - primary success color',
    600: 'Medium-dark green shade (20%) - success button hover',
    700: 'Dark green shade (40%) - success active states',
    800: 'Darker green shade (60%) - high contrast success text',
    900: 'Darkest green shade (80%) - success shadows',
  },
  teal: {
    base: 'Teal brand color - used for secondary accents and fresh UI elements',
    100: 'Lightest teal tint (80%) - soft backgrounds',
    200: 'Light teal tint (60%) - secondary backgrounds',
    300: 'Medium-light teal tint (40%) - borders and dividers',
    400: 'Medium teal tint (20%) - interactive elements',
    500: 'Base teal - secondary accent color',
    600: 'Medium-dark teal shade (20%) - hover states',
    700: 'Dark teal shade (40%) - active states',
    800: 'Darker teal shade (60%) - high contrast elements',
    900: 'Darkest teal shade (80%) - shadows and depth',
  },
  cyan: {
    base: 'Info color - used for neutral informative content and helpful messages',
    100: 'Lightest cyan tint (80%) - info alert backgrounds',
    200: 'Light cyan tint (60%) - soft info indicators',
    300: 'Medium-light cyan tint (40%) - info borders',
    400: 'Medium cyan tint (20%) - info hover states',
    500: 'Base cyan - primary info color',
    600: 'Medium-dark cyan shade (20%) - info button hover',
    700: 'Dark cyan shade (40%) - info active states',
    800: 'Darker cyan shade (60%) - high contrast info text',
    900: 'Darkest cyan shade (80%) - info shadows',
  },
  gray: {
    base: 'Neutral gray scale - used for text, borders, backgrounds, and UI structure',
    100: 'Lightest gray - used for subtle backgrounds, cards, and wells',
    200: 'Light gray - used for dividers, borders, and disabled states',
    300: 'Medium-light gray - used for borders and inactive elements',
    400: 'Medium gray - used for input borders and separators',
    500: 'Mid gray - used for secondary text and muted content',
    600: 'Medium-dark gray - used for body text and secondary buttons',
    700: 'Dark gray - used for headings and primary text',
    800: 'Darker gray - used for emphasized text and dark backgrounds',
    900: 'Darkest gray - used for maximum contrast and dark theme elements',
  },
};

// Theme color descriptions
const themeDescriptions = {
  primary:
    'Primary theme color - main brand color used for primary actions, links, and focus states',
  secondary: 'Secondary theme color - used for less prominent actions and secondary content',
  success: 'Success theme color - indicates successful or positive actions',
  info: 'Info theme color - used for informative and neutral messages',
  warning: 'Warning theme color - indicates caution or non-destructive warnings',
  danger: 'Danger theme color - used for errors and destructive actions',
  light: 'Light theme color - used for light backgrounds and subtle UI elements',
  dark: 'Dark theme color - used for dark text, dark theme, and high contrast elements',
};

// Neutral color descriptions
const neutralDescriptions = {
  white: 'Pure white - used for light backgrounds, cards, and contrast against dark elements',
  black: 'Pure black - used for maximum contrast text and dark backgrounds',
};

// Figma-specific scopes for colors (more granular than ALL_FILLS)
const colorScopes = [
  'FRAME_FILL', // For frame/container backgrounds
  'SHAPE_FILL', // For shape fills (rectangles, circles, etc)
  'TEXT_FILL', // For text colors
  'STROKE', // For borders and strokes
  'EFFECT_COLOR', // For shadows and effects
];

/**
 * Generate multi-platform code syntax
 */
function generateCodeSyntax(colorName, shade = null) {
  const varName = shade ? `${colorName}-${shade}` : colorName;

  return {
    WEB: `var(--bs-${varName})`,
    ANDROID: `color.${colorName}${shade ? `.${shade}` : ''}`,
    iOS: `Color.${colorName.charAt(0).toUpperCase() + colorName.slice(1)}${shade ? `.shade${shade}` : ''}`,
  };
}

/**
 * Enhance a color token with description, scopes, and multi-platform syntax
 */
function enhanceColorToken(token, colorName, shade = null, isNeutral = false, isTheme = false) {
  const enhanced = { ...token };

  // Add description
  if (isTheme) {
    enhanced.$description = themeDescriptions[colorName] || '';
  } else if (isNeutral && neutralDescriptions[colorName]) {
    enhanced.$description = neutralDescriptions[colorName];
  } else if (colorDescriptions[colorName]) {
    enhanced.$description = shade
      ? colorDescriptions[colorName][shade]
      : colorDescriptions[colorName].base;
  }

  // Update scopes to be more specific
  enhanced.$scopes = colorScopes;

  // Add multi-platform code syntax
  if (token.$codeSyntax) {
    enhanced.$codeSyntax = generateCodeSyntax(colorName, shade);
  }

  return enhanced;
}

/**
 * Process the colors.json file
 */
function enhanceColorsFile() {
  const filePath = path.join(__dirname, '../collections/colors.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Process each mode
  Object.keys(data[0].Colors.modes).forEach((modeName) => {
    const mode = data[0].Colors.modes[modeName];

    // Process brand colors
    if (mode.colors.brand) {
      Object.keys(mode.colors.brand).forEach((colorName) => {
        const colorGroup = mode.colors.brand[colorName];

        Object.keys(colorGroup).forEach((shade) => {
          if (colorGroup[shade].$type === 'color') {
            colorGroup[shade] = enhanceColorToken(colorGroup[shade], colorName, shade);
          }
        });
      });
    }

    // Process neutral colors
    if (mode.colors.neutral) {
      Object.keys(mode.colors.neutral).forEach((colorName) => {
        const colorItem = mode.colors.neutral[colorName];

        if (colorItem.$type === 'color' && !colorItem.$value.includes('{')) {
          mode.colors.neutral[colorName] = enhanceColorToken(colorItem, colorName, null, true);
        } else if (typeof colorItem === 'object' && !colorItem.$type) {
          // Process gray scale
          Object.keys(colorItem).forEach((shade) => {
            if (colorItem[shade].$type === 'color' && !colorItem[shade].$value.includes('{')) {
              colorItem[shade] = enhanceColorToken(colorItem[shade], 'gray', shade, true);
            }
          });
        }
      });
    }

    // Process theme colors
    if (mode.colors.theme) {
      Object.keys(mode.colors.theme).forEach((themeName) => {
        const themeColor = mode.colors.theme[themeName];

        if (themeColor.$type === 'color' && !themeColor.$value.includes('{')) {
          mode.colors.theme[themeName] = enhanceColorToken(
            themeColor,
            themeName,
            null,
            false,
            true
          );
        }
      });
    }
  });

  // Write back to file with proper formatting
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

  console.log('✅ Successfully enhanced color tokens with:');
  console.log('   - Meaningful descriptions based on Bootstrap usage');
  console.log(
    '   - Granular Figma scopes (FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE, EFFECT_COLOR)'
  );
  console.log('   - Multi-platform code syntax (WEB, ANDROID, iOS)');
}

// Run the enhancement
try {
  enhanceColorsFile();
} catch (error) {
  console.error('❌ Error enhancing color tokens:', error.message);
  process.exit(1);
}
