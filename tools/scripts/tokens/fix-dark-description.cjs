#!/usr/bin/env node
/**
 * Fix incorrect description for theme.dark token in foundation.json
 *
 * The "dark" theme token incorrectly says "Light theme color..." when it should
 * describe a dark theme color.
 */

const fs = require('node:fs');
const path = require('node:path');

const FOUNDATION_PATH = path.join(
  __dirname,
  '../../../packages/@dsai/tokens/figma-exports/foundation.json'
);

const WRONG_DESCRIPTION =
  "Light theme color. Light backgrounds, subtle surfaces, and low-emphasis elements. Use for page backgrounds, card backgrounds, light UI surfaces. Bootstrap's --bs-light maps to gray-100. Provides subtle separation. Use with dark text (700+).";

const CORRECT_DESCRIPTION =
  "Dark theme color. Dark backgrounds, strong surfaces, and high-emphasis elements. Use for page backgrounds, card backgrounds, and dark UI surfaces. Bootstrap's --bs-dark maps to gray-900. Provides strong contrast. Use with light text (100–300).";

function fixDarkDescription() {
  console.log('📝 Fixing theme.dark descriptions in foundation.json...\n');

  const data = JSON.parse(fs.readFileSync(FOUNDATION_PATH, 'utf8'));

  let fixCount = 0;

  // Fix in all modes
  for (const [modeName, modeData] of Object.entries(data.Foundation?.modes || {})) {
    const darkToken = modeData?.colors?.theme?.dark;

    if (darkToken && darkToken.$description === WRONG_DESCRIPTION) {
      console.log(`  ✅ Fixed ${modeName} mode theme.dark description`);
      darkToken.$description = CORRECT_DESCRIPTION;
      fixCount++;
    } else if (darkToken) {
      console.log(`  ⏭️  ${modeName} mode theme.dark already correct or different`);
    }
  }

  if (fixCount > 0) {
    fs.writeFileSync(FOUNDATION_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    console.log(`\n✅ Fixed ${fixCount} description(s) in foundation.json`);
  } else {
    console.log('\n⚠️  No fixes needed - descriptions may already be correct');
  }
}

fixDarkDescription();
