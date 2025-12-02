const fs = require('fs');
const path = require('path');

// Bootstrap color descriptions based on official documentation
const colorDescriptions = {
  brand: {
    blue: {
      base: 'Primary brand color. Used for primary buttons, links, and interactive elements.',
      100: 'Very light blue tint (80% lighter). Used for subtle backgrounds and hover states.',
      200: 'Light blue tint (60% lighter). Used for background variations and disabled states.',
      300: 'Medium-light blue tint (40% lighter). Used for borders and dividers.',
      400: 'Light blue tint (20% lighter). Used for active states and focus rings.',
      500: 'Base primary blue. The main brand color for primary actions and emphasis.',
      600: 'Dark blue shade (20% darker). Used for hover states on primary elements.',
      700: 'Darker blue shade (40% darker). Used for pressed states and dark UI elements.',
      800: 'Very dark blue shade (60% darker). Used for text on light backgrounds.',
      900: 'Darkest blue shade (80% darker). Used for high contrast text and borders.',
    },
    indigo: {
      base: 'Indigo accent color. Used for secondary brand elements and visual variety.',
      100: 'Very light indigo tint. Used for subtle accent backgrounds.',
      200: 'Light indigo tint. Used for secondary background variations.',
      300: 'Medium-light indigo tint. Used for borders and dividers.',
      400: 'Light indigo tint. Used for hover states on indigo elements.',
      500: 'Base indigo. Secondary brand color for accents and variety.',
      600: 'Dark indigo shade. Used for hover states on indigo elements.',
      700: 'Darker indigo shade. Used for pressed states.',
      800: 'Very dark indigo shade. Used for text on light backgrounds.',
      900: 'Darkest indigo shade. Used for high contrast elements.',
    },
    purple: {
      base: 'Purple accent color. Used for creative and premium UI elements.',
      100: 'Very light purple tint. Used for creative backgrounds.',
      200: 'Light purple tint. Used for secondary backgrounds.',
      300: 'Medium-light purple tint. Used for borders.',
      400: 'Light purple tint. Used for hover states.',
      500: 'Base purple. Used for creative accents and premium features.',
      600: 'Dark purple shade. Used for hover states.',
      700: 'Darker purple shade. Used for pressed states.',
      800: 'Very dark purple shade. Used for text.',
      900: 'Darkest purple shade. Used for high contrast.',
    },
    pink: {
      base: 'Pink accent color. Used for playful and friendly UI elements.',
      100: 'Very light pink tint. Used for friendly backgrounds.',
      200: 'Light pink tint. Used for secondary backgrounds.',
      300: 'Medium-light pink tint. Used for borders.',
      400: 'Light pink tint. Used for hover states.',
      500: 'Base pink. Used for playful accents and friendly features.',
      600: 'Dark pink shade. Used for hover states.',
      700: 'Darker pink shade. Used for pressed states.',
      800: 'Very dark pink shade. Used for text.',
      900: 'Darkest pink shade. Used for high contrast.',
    },
    red: {
      base: 'Danger color. Used for errors, destructive actions, and critical alerts.',
      100: 'Very light red tint. Used for error backgrounds and danger alerts.',
      200: 'Light red tint. Used for error messages and warning backgrounds.',
      300: 'Medium-light red tint. Used for error borders.',
      400: 'Light red tint. Used for hover states on danger elements.',
      500: 'Base danger red. Used for error states and destructive actions.',
      600: 'Dark red shade. Used for hover states on danger buttons.',
      700: 'Darker red shade. Used for pressed states on danger elements.',
      800: 'Very dark red shade. Used for error text.',
      900: 'Darkest red shade. Used for high contrast error messages.',
    },
    orange: {
      base: 'Orange accent color. Used for highlights and attention-grabbing elements.',
      100: 'Very light orange tint. Used for warm backgrounds.',
      200: 'Light orange tint. Used for secondary backgrounds.',
      300: 'Medium-light orange tint. Used for borders.',
      400: 'Light orange tint. Used for hover states.',
      500: 'Base orange. Used for highlights and warm accents.',
      600: 'Dark orange shade. Used for hover states.',
      700: 'Darker orange shade. Used for pressed states.',
      800: 'Very dark orange shade. Used for text.',
      900: 'Darkest orange shade. Used for high contrast.',
    },
    yellow: {
      base: 'Warning color. Used for caution messages, warnings, and important notices.',
      100: 'Very light yellow tint. Used for warning backgrounds and caution alerts.',
      200: 'Light yellow tint. Used for notice backgrounds.',
      300: 'Medium-light yellow tint. Used for warning borders.',
      400: 'Light yellow tint. Used for hover states on warning elements.',
      500: 'Base warning yellow. Used for caution states and important notices.',
      600: 'Dark yellow shade. Used for hover states on warning buttons.',
      700: 'Darker yellow shade. Used for pressed states on warning elements.',
      800: 'Very dark yellow shade. Used for warning text.',
      900: 'Darkest yellow shade. Used for high contrast warnings.',
    },
    green: {
      base: 'Success color. Used for success messages, confirmations, and positive actions.',
      100: 'Very light green tint. Used for success backgrounds and positive alerts.',
      200: 'Light green tint. Used for success message backgrounds.',
      300: 'Medium-light green tint. Used for success borders.',
      400: 'Light green tint. Used for hover states on success elements.',
      500: 'Base success green. Used for confirmation and positive feedback.',
      600: 'Dark green shade. Used for hover states on success buttons.',
      700: 'Darker green shade. Used for pressed states on success elements.',
      800: 'Very dark green shade. Used for success text.',
      900: 'Darkest green shade. Used for high contrast success messages.',
    },
    teal: {
      base: 'Teal accent color. Used for fresh and modern UI elements.',
      100: 'Very light teal tint. Used for fresh backgrounds.',
      200: 'Light teal tint. Used for secondary backgrounds.',
      300: 'Medium-light teal tint. Used for borders.',
      400: 'Light teal tint. Used for hover states.',
      500: 'Base teal. Used for fresh accents and modern features.',
      600: 'Dark teal shade. Used for hover states.',
      700: 'Darker teal shade. Used for pressed states.',
      800: 'Very dark teal shade. Used for text.',
      900: 'Darkest teal shade. Used for high contrast.',
    },
    cyan: {
      base: 'Info color. Used for informational messages, tips, and neutral notifications.',
      100: 'Very light cyan tint. Used for info backgrounds and neutral alerts.',
      200: 'Light cyan tint. Used for informational message backgrounds.',
      300: 'Medium-light cyan tint. Used for info borders.',
      400: 'Light cyan tint. Used for hover states on info elements.',
      500: 'Base info cyan. Used for informational content and tips.',
      600: 'Dark cyan shade. Used for hover states on info buttons.',
      700: 'Darker cyan shade. Used for pressed states on info elements.',
      800: 'Very dark cyan shade. Used for info text.',
      900: 'Darkest cyan shade. Used for high contrast info messages.',
    },
    gray: {
      base: 'Neutral gray color. Used for text, borders, and UI structure.',
      100: 'Very light gray. Used for subtle backgrounds, cards, and light UI surfaces.',
      200: 'Light gray. Used for borders, dividers, and disabled states.',
      300: 'Medium-light gray. Used for secondary borders and hover backgrounds.',
      400: 'Light gray. Used for placeholder text and inactive elements.',
      500: 'Base gray. Used for secondary text and neutral UI elements.',
      600: 'Dark gray. Used for body text and medium emphasis content.',
      700: 'Darker gray. Used for headings and high emphasis text.',
      800: 'Very dark gray. Used for primary text and strong emphasis.',
      900: 'Darkest gray. Used for maximum contrast text and dark backgrounds.',
    },
  },
  neutral: {
    white: 'Pure white. Used for page backgrounds, cards, and light UI surfaces.',
    black: 'Pure black. Used for maximum contrast text and dark mode backgrounds.',
    gray: {
      100: 'Alias to brand gray 100. Consistent light gray for backgrounds.',
      200: 'Alias to brand gray 200. Consistent gray for borders.',
      300: 'Alias to brand gray 300. Consistent gray for dividers.',
      400: 'Alias to brand gray 400. Consistent gray for placeholders.',
      500: 'Alias to brand gray 500. Consistent gray for secondary text.',
      600: 'Alias to brand gray 600. Consistent gray for body text.',
      700: 'Alias to brand gray 700. Consistent gray for headings.',
      800: 'Alias to brand gray 800. Consistent gray for primary text.',
      900: 'Alias to brand gray 900. Consistent gray for maximum contrast.',
    },
  },
  theme: {
    primary:
      'Primary theme color. Main brand color for primary actions, links, and key UI elements.',
    secondary: 'Secondary theme color. Used for less prominent actions and supporting UI elements.',
    success:
      'Success theme color. Used for positive feedback, confirmations, and successful operations.',
    info: 'Info theme color. Used for informational content, tips, and neutral notifications.',
    warning: 'Warning theme color. Used for cautions, warnings, and important notices.',
    danger: 'Danger theme color. Used for errors, destructive actions, and critical alerts.',
    light:
      'Light theme color. Used for light backgrounds, subtle UI elements, and light mode surfaces.',
    dark: 'Dark theme color. Used for dark backgrounds, strong emphasis, and dark mode surfaces.',
  },
};

function addDescriptions(data) {
  const collections = Array.isArray(data) ? data : [data];

  collections.forEach((collection) => {
    const colors = collection.Colors;
    if (!colors || !colors.modes) return;

    // Process both Light and Dark modes
    Object.keys(colors.modes).forEach((modeName) => {
      const mode = colors.modes[modeName];
      if (!mode.colors) return;

      // Process brand colors
      if (mode.colors.brand) {
        Object.keys(mode.colors.brand).forEach((colorName) => {
          const colorGroup = mode.colors.brand[colorName];
          const descriptions = colorDescriptions.brand[colorName];

          if (!descriptions) return;

          Object.keys(colorGroup).forEach((shade) => {
            const token = colorGroup[shade];
            if (token && token.$type === 'color' && !token.$description) {
              token.$description = descriptions[shade] || descriptions.base;
            }
          });
        });
      }

      // Process neutral colors
      if (mode.colors.neutral) {
        // White
        if (mode.colors.neutral.white && !mode.colors.neutral.white.$description) {
          mode.colors.neutral.white.$description = colorDescriptions.neutral.white;
        }

        // Black
        if (mode.colors.neutral.black && !mode.colors.neutral.black.$description) {
          mode.colors.neutral.black.$description = colorDescriptions.neutral.black;
        }

        // Gray aliases
        if (mode.colors.neutral.gray) {
          Object.keys(mode.colors.neutral.gray).forEach((shade) => {
            const token = mode.colors.neutral.gray[shade];
            if (token && token.$type === 'color' && !token.$description) {
              token.$description = colorDescriptions.neutral.gray[shade];
            }
          });
        }
      }

      // Process theme colors
      if (mode.colors.theme) {
        Object.keys(mode.colors.theme).forEach((themeName) => {
          const token = mode.colors.theme[themeName];
          if (token && token.$type === 'color' && !token.$description) {
            token.$description = colorDescriptions.theme[themeName];
          }
        });
      }
    });
  });

  return data;
}

// Read the colors.json file
const colorsPath = path.join(__dirname, '../collections/colors.json');
const data = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));

// Add descriptions
const updatedData = addDescriptions(data);

// Write back to file
fs.writeFileSync(colorsPath, JSON.stringify(updatedData, null, 2), 'utf8');

console.log('✓ Color descriptions added successfully!');
console.log('✓ Updated file:', colorsPath);
