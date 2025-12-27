const fs = require('node:fs');
const path = require('node:path');

// Read the main colors file
const colorsPath = path.join(__dirname, '..', 'collections', 'colors.json');
const colorsArray = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
const colorsData = colorsArray[0];

console.log('🔄 Applying export format to colors.json...\n');

// Function to simplify a color token to match export format
function simplifyColorToken(token) {
  if (!token || typeof token !== 'object') {return token;}

  const simplified = {
    $codeSyntax: token.$codeSyntax || {},
    $scopes: ['ALL_SCOPES'],
    $type: token.$type || 'color',
    $value: token.$value,
  };

  // Remove description - Figma export doesn't include it
  return simplified;
}

// Function to process a color object recursively
function processColors(obj) {
  if (!obj || typeof obj !== 'object') {return obj;}

  // If this looks like a color token (has $value), simplify it
  if (obj.$value !== undefined) {
    return simplifyColorToken(obj);
  }

  // Otherwise, recurse through the object
  const processed = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      processed[key] = processColors(value);
    } else {
      processed[key] = value;
    }
  }
  return processed;
}

// Change mode names from "Light Mode" / "Dark Mode" to "Light" / "Dark"
const lightMode = colorsData.Colors.modes['Light Mode'];
const darkMode = colorsData.Colors.modes['Dark Mode'];

// Process all colors to match export format BEFORE changing mode names
if (lightMode?.colors) {
  lightMode.colors = processColors(lightMode.colors);
}
if (darkMode?.colors) {
  darkMode.colors = processColors(darkMode.colors);
}

// Now create the new modes structure
const newModes = {
  Light: lightMode,
  Dark: darkMode,
};

colorsData.Colors.modes = newModes;

console.log('✅ Converted mode names: "Light Mode" → "Light", "Dark Mode" → "Dark"');
console.log('✅ Simplified all scopes to ["ALL_SCOPES"]');
console.log('✅ Removed descriptions (Figma export format)');
console.log('✅ Kept hex values and code syntax\n');

// Save the updated file
colorsArray[0] = colorsData;
fs.writeFileSync(colorsPath, JSON.stringify(colorsArray, null, 2));

console.log(`💾 Updated: ${colorsPath}`);
console.log('✅ colors.json now matches Figma export format!');
