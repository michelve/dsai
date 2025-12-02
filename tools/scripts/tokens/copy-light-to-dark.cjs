const fs = require('fs');
const path = require('path');

const colorsPath = path.join(__dirname, '..', 'collections', 'colors.json');
const colorsArray = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
const colorsData = colorsArray[0];

console.log('🔧 Copying Light mode hex values to Dark mode for all hues...\n');

const lightColors = colorsData.Colors.modes.Light.colors.brand;
const darkColors = colorsData.Colors.modes.Dark.colors.brand;

const hues = [
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
];
const shades = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];

let fixedCount = 0;

hues.forEach((hue) => {
  if (!lightColors[hue] || !darkColors[hue]) {
    console.log(`⚠️  Missing ${hue} in Light or Dark mode`);
    return;
  }

  shades.forEach((shade) => {
    const lightValue = lightColors[hue][shade]?.$value;
    const darkValue = darkColors[hue][shade]?.$value;

    if (lightValue && darkValue !== lightValue) {
      darkColors[hue][shade].$value = lightValue;
      fixedCount++;
      console.log(`✅ Fixed ${hue}-${shade}: ${darkValue} → ${lightValue}`);
    }
  });
});

// Save the updated file
colorsArray[0] = colorsData;
fs.writeFileSync(colorsPath, JSON.stringify(colorsArray, null, 2));

console.log('\n' + '='.repeat(60));
console.log(`✅ Fixed ${fixedCount} Dark mode colors`);
console.log(`💾 Updated: ${colorsPath}`);
console.log('='.repeat(60));
