const fs = require('node:fs');
const path = require('node:path');

// Read the colors.json file
const colorsPath = path.join(__dirname, '..', 'collections', 'colors.json');
const colorsArray = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
const colorsData = colorsArray[0]; // It's wrapped in an array

console.log('🔧 Starting Dark Mode color fix...\n');

// Bootstrap principle: Brand colors are IDENTICAL in light and dark modes
// Only semantic colors (text emphasis, backgrounds, borders) differ

const brandColors = colorsData.Colors.modes['Light Mode'].colors.brand;
const darkModeColors = colorsData.Colors.modes['Dark Mode'].colors;

let fixedCount = 0;
let unchangedCount = 0;

// Fix brand colors - they should match Light Mode exactly
for (const colorFamily of [
  'blue',
  'indigo',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'cyan',
  'gray',
]) {
  if (!darkModeColors.brand[colorFamily]) {
    console.log(`⚠️  Missing ${colorFamily} in Dark Mode`);
    continue;
  }

  for (const shade of ['100', '200', '300', '400', '500', '600', '700', '800', '900']) {
    const lightValue = brandColors[colorFamily][shade]?.$value;
    const darkColor = darkModeColors.brand[colorFamily][shade];

    if (!darkColor) continue;

    const currentDarkValue = darkColor.$value;

    // Check if it's a placeholder value that needs fixing
    const isPlaceholder =
      currentDarkValue === '#ffffff' ||
      currentDarkValue === 'rgba(0, 0, 0, 0)' ||
      currentDarkValue === '#000000';

    if (isPlaceholder && lightValue) {
      // Fix: Use the same value as Light Mode
      darkModeColors.brand[colorFamily][shade].$value = lightValue;

      // Also copy over the enhanced properties if missing
      if (brandColors[colorFamily][shade].$codeSyntax && !darkColor.$codeSyntax) {
        darkModeColors.brand[colorFamily][shade].$codeSyntax =
          brandColors[colorFamily][shade].$codeSyntax;
      }
      if (brandColors[colorFamily][shade].$description && !darkColor.$description) {
        darkModeColors.brand[colorFamily][shade].$description =
          brandColors[colorFamily][shade].$description;
      }
      if (
        brandColors[colorFamily][shade].$scopes &&
        JSON.stringify(darkColor.$scopes) !==
          JSON.stringify(brandColors[colorFamily][shade].$scopes)
      ) {
        darkModeColors.brand[colorFamily][shade].$scopes = brandColors[colorFamily][shade].$scopes;
      }

      fixedCount++;
      console.log(`✅ Fixed ${colorFamily}-${shade}: ${currentDarkValue} → ${lightValue}`);
    } else if (lightValue && currentDarkValue !== lightValue && !isPlaceholder) {
      // Report colors that differ but aren't placeholders (might be intentional)
      unchangedCount++;
      console.log(
        `ℹ️  Kept ${colorFamily}-${shade}: ${currentDarkValue} (differs from Light Mode: ${lightValue})`
      );
    }
  }
}

// Fix neutral colors (white/black stay the same in both modes)
if (darkModeColors.neutral) {
  const lightWhite = colorsData.Colors.modes['Light Mode'].colors.neutral.white;
  const lightBlack = colorsData.Colors.modes['Light Mode'].colors.neutral.black;

  if (darkModeColors.neutral.white && lightWhite) {
    const currentWhite = darkModeColors.neutral.white.$value;
    if (currentWhite !== lightWhite.$value) {
      darkModeColors.neutral.white = { ...lightWhite };
      fixedCount++;
      console.log(`✅ Fixed white: ${currentWhite} → ${lightWhite.$value}`);
    }
  }

  if (darkModeColors.neutral.black && lightBlack) {
    const currentBlack = darkModeColors.neutral.black.$value;
    if (currentBlack !== lightBlack.$value) {
      // Copy all properties from light mode black
      const blackKeys = Object.keys(lightBlack);
      blackKeys.forEach((key) => {
        darkModeColors.neutral.black[key] = lightBlack[key];
      });
      fixedCount++;
      console.log(`✅ Fixed black: ${currentBlack} → ${lightBlack.$value}`);
    }
  }

  // Fix neutral.gray aliases to reference brand.gray
  if (darkModeColors.neutral.gray) {
    for (const shade of ['100', '200', '300', '400', '500', '600', '700', '800', '900']) {
      const darkGray = darkModeColors.neutral.gray[shade];
      if (!darkGray) continue;

      const isPlaceholder = darkGray.$value === 'rgba(0, 0, 0, 0)' || darkGray.$value === '#ffffff';

      if (isPlaceholder) {
        // Use alias to reference brand.gray
        darkModeColors.neutral.gray[shade] = {
          $codeSyntax: {
            WEB: `var(--bs-gray-${shade})`,
            ANDROID: `color.gray.${shade}`,
            iOS: `Color.Gray.shade${shade}`,
          },
          $scopes: ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE', 'EFFECT_COLOR'],
          $type: 'color',
          $value: `{colors.brand.gray.${shade}}`,
          $description: brandColors.gray[shade]?.$description || `Gray ${shade} shade`,
        };
        fixedCount++;
        console.log(`✅ Fixed neutral.gray-${shade} as alias to brand.gray.${shade}`);
      }
    }
  }
}

// Fix theme colors - they should reference brand colors (use aliases)
if (darkModeColors.theme) {
  const themeMapping = {
    primary: 'blue',
    secondary: 'gray',
    success: 'green',
    info: 'cyan',
    warning: 'yellow',
    danger: 'red',
    light: 'gray',
    dark: 'gray',
  };

  for (const [themeName] of Object.entries(themeMapping)) {
    const darkTheme = darkModeColors.theme[themeName];
    if (!darkTheme) continue;

    const currentValue = darkTheme.$value;
    const isPlaceholder =
      currentValue === 'rgba(0, 0, 0, 0)' ||
      currentValue === '#ffffff' ||
      (typeof currentValue === 'string' && !currentValue.startsWith('{'));

    if (isPlaceholder) {
      // Determine which shade to use
      let shadeReference;
      if (themeName === 'primary') shadeReference = '{colors.brand.blue.500}';
      else if (themeName === 'secondary') shadeReference = '{colors.brand.gray.600}';
      else if (themeName === 'success') shadeReference = '{colors.brand.green.500}';
      else if (themeName === 'info') shadeReference = '{colors.brand.cyan.500}';
      else if (themeName === 'warning') shadeReference = '{colors.brand.yellow.500}';
      else if (themeName === 'danger') shadeReference = '{colors.brand.red.500}';
      else if (themeName === 'light') shadeReference = '{colors.brand.gray.100}';
      else if (themeName === 'dark') shadeReference = '{colors.brand.gray.900}';

      darkModeColors.theme[themeName].$value = shadeReference;
      fixedCount++;
      console.log(`✅ Fixed theme.${themeName}: ${currentValue} → ${shadeReference}`);
    }
  }
}

// Save the updated file
colorsArray[0] = colorsData;
fs.writeFileSync(colorsPath, JSON.stringify(colorsArray, null, 2));

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ Dark Mode fix complete!`);
console.log(`📊 Fixed: ${fixedCount} colors`);
console.log(`ℹ️  Unchanged (intentionally different): ${unchangedCount} colors`);
console.log(`💾 Updated: ${colorsPath}`);
console.log('='.repeat(60));
