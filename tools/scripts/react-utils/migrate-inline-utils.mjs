#!/usr/bin/env node

/**
 * migrate-inline-utils.mjs
 *
 * Migrates components from inline utility functions to centralized imports.
 * Reads the generated-utils.json and applies transformations to source files.
 *
 * Usage:
 *   node tools/scripts/react-utils/migrate-inline-utils.mjs [options]
 *
 * Options:
 *   --dry-run       Preview changes without writing files
 *   --only=<name>   Migrate only the specified utility
 *   --verbose       Show detailed migration information
 *   --backup        Create .bak files before modifying
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../..');

// CLI argument parsing
const args = process.argv.slice(2);
const flags = {
  dryRun: args.includes('--dry-run'),
  verbose: args.includes('--verbose'),
  backup: args.includes('--backup'),
  only: args.find((a) => a.startsWith('--only='))?.split('=')[1],
  help: args.includes('--help') || args.includes('-h'),
};

if (flags.help) {
  console.log(`
migrate-inline-utils.mjs

Migrates components from inline utility functions to centralized imports.

Usage:
  node tools/scripts/react-utils/migrate-inline-utils.mjs [options]

Options:
  --dry-run       Preview changes without writing files
  --only=<name>   Migrate only the specified utility (e.g., --only=isSafeHref)
  --verbose       Show detailed migration information
  --backup        Create .bak files before modifying
  --help, -h      Show this help message

Prerequisites:
  Run the generator first:
  node tools/scripts/react-utils/generate-utils-from-analysis.mjs

Examples:
  node tools/scripts/react-utils/migrate-inline-utils.mjs --dry-run
  node tools/scripts/react-utils/migrate-inline-utils.mjs --only=isSafeHref --backup
  node tools/scripts/react-utils/migrate-inline-utils.mjs --verbose
`);
  process.exit(0);
}

// Load migration data
const generatedUtilsPath = path.join(REPO_ROOT, '.temp', 'generated-utils.json');
const inventoryPath = path.join(REPO_ROOT, '.temp', 'utils-inventory.json');

if (!fs.existsSync(generatedUtilsPath)) {
  console.error(`❌ Generated utilities data not found at ${generatedUtilsPath}`);
  console.error(
    '   Run the generator first: node tools/scripts/react-utils/generate-utils-from-analysis.mjs'
  );
  process.exit(1);
}

if (!fs.existsSync(inventoryPath)) {
  console.error(`❌ Inventory not found at ${inventoryPath}`);
  console.error('   Run the scanner first: node tools/scripts/react-utils/scan-utils-usage.mjs');
  process.exit(1);
}

const generatedUtils = JSON.parse(fs.readFileSync(generatedUtilsPath, 'utf-8'));
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));

/**
 * Find the inline function declaration in source code
 */
function findInlineFunction(source, functionName) {
  // Match: function functionName(...) { ... }
  // Match: const functionName = (...) => { ... }
  // Match: const functionName = function(...) { ... }

  const patterns = [
    // Regular function declaration
    new RegExp(
      `(^|\\n)(\\s*)function\\s+${functionName}\\s*(<[^>]*>)?\\s*\\([^)]*\\)[^{]*\\{`,
      'm'
    ),
    // Arrow function with const
    new RegExp(
      `(^|\\n)(\\s*)const\\s+${functionName}\\s*=\\s*(<[^>]*>)?\\s*\\([^)]*\\)\\s*(?::\\s*[^=]+)?\\s*=>\\s*\\{`,
      'm'
    ),
    // Function expression with const
    new RegExp(
      `(^|\\n)(\\s*)const\\s+${functionName}\\s*=\\s*function\\s*(<[^>]*>)?\\s*\\([^)]*\\)`,
      'm'
    ),
  ];

  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match) {
      const startIndex = match.index + match[1].length;
      const indent = match[2];

      // Find the matching closing brace
      let depth = 0;
      let inString = false;
      let stringChar = '';
      let endIndex = startIndex;

      for (let i = startIndex; i < source.length; i++) {
        const char = source[i];
        const prevChar = source[i - 1];

        // Track string boundaries
        if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
          }
          continue;
        }

        if (inString) continue;

        if (char === '{') depth++;
        if (char === '}') {
          depth--;
          if (depth === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }

      // Include trailing semicolon and newline if present
      if (source[endIndex] === ';') endIndex++;
      if (source[endIndex] === '\n') endIndex++;

      return {
        start: startIndex,
        end: endIndex,
        text: source.slice(startIndex, endIndex),
        indent,
      };
    }
  }

  return null;
}

/**
 * Find existing import statement for a module
 */
function findImportStatement(source, modulePath) {
  // Match import { ... } from 'path'
  const pattern = new RegExp(
    `import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${escapeRegex(modulePath)}['"]`,
    'm'
  );

  const match = source.match(pattern);
  if (match) {
    return {
      full: match[0],
      imports: match[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      start: match.index,
      end: match.index + match[0].length,
    };
  }

  return null;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Find the best position to insert an import
 */
function findImportInsertPosition(source) {
  // Find the last import statement
  const importMatches = [...source.matchAll(/import\s+.*?from\s+['"][^'"]+['"]\s*;?\n?/g)];

  if (importMatches.length > 0) {
    const lastMatch = importMatches[importMatches.length - 1];
    return lastMatch.index + lastMatch[0].length;
  }

  // If no imports, find the position after initial comments/docstrings
  const firstCodeMatch = source.match(/^(?:\/\*[\s\S]*?\*\/\s*|\/\/.*\n)*\s*/);
  return firstCodeMatch ? firstCodeMatch[0].length : 0;
}

/**
 * Apply a migration to a file
 */
function migrateFile(filePath, functionName, importStatement) {
  const fullPath = path.join(REPO_ROOT, filePath);

  if (!fs.existsSync(fullPath)) {
    return { success: false, reason: 'File not found' };
  }

  let source = fs.readFileSync(fullPath, 'utf-8');
  const originalSource = source;

  // Find the inline function
  const inlineFunc = findInlineFunction(source, functionName);
  if (!inlineFunc) {
    return { success: false, reason: 'Inline function not found' };
  }

  // Extract the module path from the import statement
  const importMatch = importStatement.match(/from\s+['"]([^'"]+)['"]/);
  if (!importMatch) {
    return { success: false, reason: 'Invalid import statement' };
  }
  const modulePath = importMatch[1];

  // Check if import already exists
  const existingImport = findImportStatement(source, modulePath);

  // Remove the inline function
  source = source.slice(0, inlineFunc.start) + source.slice(inlineFunc.end);

  // Add or update import
  if (existingImport) {
    // Add to existing import if not already present
    if (!existingImport.imports.includes(functionName)) {
      const newImports = [...existingImport.imports, functionName].sort().join(', ');
      source = source.replace(existingImport.full, `import { ${newImports} } from '${modulePath}'`);
    }
  } else {
    // Add new import
    const insertPos = findImportInsertPosition(source);
    source = source.slice(0, insertPos) + importStatement + '\n' + source.slice(insertPos);
  }

  // Clean up extra blank lines
  source = source.replace(/\n{3,}/g, '\n\n');

  return {
    success: true,
    originalSource,
    newSource: source,
    removed: inlineFunc.text.trim().split('\n').length + ' lines',
    importAdded: !existingImport,
  };
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 Utility Migration Tool');
  console.log('=========================\n');

  if (flags.dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  const { generated } = generatedUtils;

  if (!generated || generated.length === 0) {
    console.log('❌ No generated utilities found.');
    console.log(
      '   Run the generator first: node tools/scripts/react-utils/generate-utils-from-analysis.mjs'
    );
    process.exit(1);
  }

  // Filter by --only flag
  const toMigrate = flags.only ? generated.filter((g) => g.name === flags.only) : generated;

  if (toMigrate.length === 0) {
    console.log(`❌ No utility named '${flags.only}' found.`);
    console.log('   Available utilities:', generated.map((g) => g.name).join(', '));
    process.exit(1);
  }

  console.log(`📦 Migrating ${toMigrate.length} utilities:\n`);

  const results = {
    success: [],
    skipped: [],
    failed: [],
  };

  for (const util of toMigrate) {
    console.log(`\n📄 ${util.name}`);
    console.log(`   Utility path: ${util.path}`);

    for (const step of util.migrationSteps) {
      const { file, importStatement } = step;

      if (flags.verbose) {
        console.log(`\n   📁 ${file}`);
        console.log(`      Import: ${importStatement}`);
      }

      const result = migrateFile(file, util.name, importStatement);

      if (result.success) {
        if (flags.verbose) {
          console.log(`      ✅ Removed ${result.removed}`);
          console.log(
            `      ${result.importAdded ? '📥 Added import' : '📝 Updated existing import'}`
          );
        } else {
          console.log(`   ✅ ${path.basename(file)}`);
        }

        if (!flags.dryRun) {
          const fullPath = path.join(REPO_ROOT, file);

          // Create backup if requested
          if (flags.backup) {
            fs.writeFileSync(fullPath + '.bak', result.originalSource);
          }

          // Write the modified file
          fs.writeFileSync(fullPath, result.newSource, 'utf-8');
        }

        results.success.push({ util: util.name, file });
      } else {
        if (flags.verbose) {
          console.log(`      ⏭️  Skipped: ${result.reason}`);
        } else {
          console.log(`   ⏭️  ${path.basename(file)} (${result.reason})`);
        }

        results.skipped.push({ util: util.name, file, reason: result.reason });
      }
    }
  }

  // Summary
  console.log('\n\n📊 Migration Summary');
  console.log('====================');
  console.log(`✅ Migrated: ${results.success.length} files`);
  console.log(`⏭️  Skipped: ${results.skipped.length} files`);
  console.log(`❌ Failed: ${results.failed.length} files`);

  if (flags.dryRun) {
    console.log('\n💡 Run without --dry-run to apply the migrations.');
  }

  if (!flags.dryRun && results.success.length > 0) {
    console.log('\n📋 Next Steps');
    console.log('=============');
    console.log('1. Review the changes: git diff');
    console.log('2. Run TypeScript check: pnpm tsc --noEmit');
    console.log('3. Run tests: pnpm test');
    console.log('4. Run linter: pnpm lint');
  }

  // Write migration report
  const reportPath = path.join(REPO_ROOT, '.temp', 'migration-report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        dryRun: flags.dryRun,
        results,
      },
      null,
      2
    )
  );

  console.log(`\n📝 Report written to: .temp/migration-report.json`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  if (flags.verbose) {
    console.error(err.stack);
  }
  process.exit(1);
});
