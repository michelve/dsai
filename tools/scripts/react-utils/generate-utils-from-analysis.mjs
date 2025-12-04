#!/usr/bin/env node

/**
 * generate-utils-from-analysis.mjs
 * 
 * Generates unified TypeScript utility files from the scanner's unification analysis.
 * Reads .temp/utils-inventory.json and creates utility files at the suggested paths.
 * 
 * Usage:
 *   node tools/scripts/react-utils/generate-utils-from-analysis.mjs [options]
 * 
 * Options:
 *   --dry-run       Preview changes without writing files
 *   --only=<name>   Generate only the specified utility
 *   --category=<c>  Generate only utilities in the specified category
 *   --verbose       Show detailed generation information
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
  only: args.find(a => a.startsWith('--only='))?.split('=')[1],
  category: args.find(a => a.startsWith('--category='))?.split('=')[1],
  help: args.includes('--help') || args.includes('-h'),
};

if (flags.help) {
  console.log(`
generate-utils-from-analysis.mjs

Generates unified TypeScript utility files from the scanner's unification analysis.

Usage:
  node tools/scripts/react-utils/generate-utils-from-analysis.mjs [options]

Options:
  --dry-run       Preview changes without writing files
  --only=<name>   Generate only the specified utility (e.g., --only=isSafeHref)
  --category=<c>  Generate only utilities in the specified category
  --verbose       Show detailed generation information
  --help, -h      Show this help message

Examples:
  node tools/scripts/react-utils/generate-utils-from-analysis.mjs --dry-run
  node tools/scripts/react-utils/generate-utils-from-analysis.mjs --only=isSafeHref
  node tools/scripts/react-utils/generate-utils-from-analysis.mjs --category=validation
`);
  process.exit(0);
}

// Load inventory
const inventoryPath = path.join(REPO_ROOT, '.temp', 'utils-inventory.json');

if (!fs.existsSync(inventoryPath)) {
  console.error(`❌ Inventory not found at ${inventoryPath}`);
  console.error('   Run the scanner first: node tools/scripts/react-utils/scan-utils-usage.mjs');
  process.exit(1);
}

const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));

// Utility templates
const UTILITY_TEMPLATES = {
  /**
   * Generate utility file for isSafeHref
   */
  isSafeHref: (analysis) => {
    const { differences, files } = analysis;
    
    // Determine if we need options for undefined behavior
    const hasUndefinedVariation = differences.behaviorNotes.some(
      note => note.toLowerCase().includes('undefined')
    );
    
    return `/**
 * isSafeHref - Validates that a URL href is safe to use
 * 
 * Blocks dangerous protocols like javascript:, data:, vbscript:, and file:
 * to prevent XSS attacks through malicious URLs.
 * 
 * @module utils/validation/isSafeHref
 * 
 * Consolidated from:
 * ${files.map(f => `- ${f}`).join('\n * ')}
 */

/** Dangerous URL protocols that should be blocked */
const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];

export interface IsSafeHrefOptions {
  /**
   * How to treat undefined/empty href values.
   * - 'safe': Returns true for undefined/empty (default for most components)
   * - 'unsafe': Returns false for undefined/empty (stricter validation)
   * 
   * @default 'safe'
   */
  undefinedBehavior?: 'safe' | 'unsafe';
}

/**
 * Checks if a URL href is safe to use in href attributes.
 * 
 * @param href - The URL to validate
 * @param options - Configuration options
 * @returns true if the URL is safe, false if it contains a blocked protocol
 * 
 * @example
 * // Basic usage - undefined is safe by default
 * isSafeHref(undefined);                    // true
 * isSafeHref('https://example.com');        // true
 * isSafeHref('javascript:alert(1)');        // false
 * 
 * @example
 * // Strict mode - undefined is unsafe
 * isSafeHref(undefined, { undefinedBehavior: 'unsafe' }); // false
 * isSafeHref('', { undefinedBehavior: 'unsafe' });        // false
 * 
 * @example
 * // All blocked protocols
 * isSafeHref('javascript:void(0)');  // false
 * isSafeHref('data:text/html,...');  // false
 * isSafeHref('vbscript:msgbox(1)');  // false
 * isSafeHref('file:///etc/passwd');  // false
 */
export function isSafeHref(
  href: string | undefined,
  options: IsSafeHrefOptions = {}
): boolean {
  const { undefinedBehavior = 'safe' } = options;
  
  // Handle undefined/empty cases based on configuration
  if (!href || typeof href !== 'string') {
    return undefinedBehavior === 'safe';
  }
  
  const normalized = href.toLowerCase().trim();
  
  // Block dangerous protocols
  return !BLOCKED_PROTOCOLS.some(protocol => normalized.startsWith(protocol));
}

export default isSafeHref;
`;
  },

  /**
   * Generate utility file for isExternalUrl
   */
  isExternalUrl: (analysis) => {
    const { files } = analysis;
    
    return `/**
 * isExternalUrl - Checks if a URL is an external link
 * 
 * Determines if a URL points to an external domain by checking
 * for http:// or https:// protocol prefixes.
 * 
 * @module utils/types/isExternalUrl
 * 
 * Consolidated from:
 * ${files.map(f => `- ${f}`).join('\n * ')}
 */

/**
 * Checks if a URL is an external link (starts with http:// or https://).
 * 
 * @param href - The URL to check
 * @returns true if the URL is external, false otherwise
 * 
 * @example
 * isExternalUrl('https://google.com');     // true
 * isExternalUrl('http://example.com');     // true
 * isExternalUrl('/about');                  // false
 * isExternalUrl('#section');                // false
 * isExternalUrl(undefined);                 // false
 */
export function isExternalUrl(href?: string): boolean {
  if (!href || typeof href !== 'string') {
    return false;
  }
  
  return href.startsWith('http://') || href.startsWith('https://');
}

export default isExternalUrl;
`;
  },

  /**
   * Generate a generic utility based on analysis
   */
  generic: (analysis, duplicates) => {
    const { name, category, files, differences, unifiedProposal } = analysis;
    const { signature } = unifiedProposal;
    
    // Find source code from duplicates
    const sourceEntry = duplicates?.find(d => d.name === name);
    const sourceCode = sourceEntry?.occurrences?.[0]?.sourceCode || '';
    
    // Extract the function body from the first occurrence
    const functionBody = extractFunctionBody(sourceCode);
    
    // Build the params string
    const paramsStr = signature.params
      .map(p => `${p.name}${p.optional ? '?' : ''}: ${p.type}`)
      .join(', ');
    
    // Build JSDoc params
    const paramDocs = signature.params
      .map(p => ` * @param ${p.name} - ${p.optional ? '(optional) ' : ''}${describeParam(p)}`)
      .join('\n');
    
    return `/**
 * ${name} - ${describeFunctionName(name)}
 * 
 * @module utils/${category}/${name}
 * 
 * Consolidated from:
 * ${files.map(f => `- ${f}`).join('\n * ')}
 */

/**
 * ${describeFunctionName(name)}
 * 
${paramDocs}
 * @returns ${signature.returnType}
 */
export function ${name}(${paramsStr}): ${signature.returnType} {
${functionBody || `  // TODO: Implement consolidated logic\n  throw new Error('Not implemented');`}
}

export default ${name};
`;
  },
};

/**
 * Extract function body from source code
 */
function extractFunctionBody(sourceCode) {
  if (!sourceCode) return '';
  
  // Find the opening brace and extract until the matching closing brace
  const braceIndex = sourceCode.indexOf('{');
  if (braceIndex === -1) return '';
  
  let depth = 0;
  let bodyStart = braceIndex + 1;
  let bodyEnd = sourceCode.length - 1;
  
  for (let i = braceIndex; i < sourceCode.length; i++) {
    if (sourceCode[i] === '{') depth++;
    if (sourceCode[i] === '}') {
      depth--;
      if (depth === 0) {
        bodyEnd = i;
        break;
      }
    }
  }
  
  const body = sourceCode.slice(bodyStart, bodyEnd).trim();
  
  // Re-indent the body
  const lines = body.split('\n');
  const minIndent = lines
    .filter(l => l.trim())
    .reduce((min, l) => {
      const indent = l.match(/^\s*/)[0].length;
      return Math.min(min, indent);
    }, Infinity);
  
  return lines
    .map(l => '  ' + l.slice(minIndent === Infinity ? 0 : minIndent))
    .join('\n');
}

/**
 * Describe a function name in human-readable form
 */
function describeFunctionName(name) {
  const descriptions = {
    isSafeHref: 'Validates that a URL href is safe to use',
    isExternalUrl: 'Checks if a URL is an external link',
    isNoneSelected: 'Checks if no items are selected in the state',
    isSomeSelected: 'Checks if some (but not all) items are selected',
    isAllSelected: 'Checks if all items are selected',
    deriveVisualState: 'Derives the visual state from selection data',
    resetFromPropsEvent: 'Creates a RESET_FROM_PROPS event for FSM',
    generateId: 'Generates a unique identifier',
    mergeRefs: 'Merges multiple refs into a single callback ref',
    useId: 'Hook to generate stable unique IDs',
  };
  
  return descriptions[name] || `Utility function: ${name}`;
}

/**
 * Describe a parameter
 */
function describeParam(param) {
  const descriptions = {
    href: 'The URL to validate or check',
    state: 'The FSM state object',
    selectedValues: 'Array of selected value identifiers',
    selectedRows: 'Array of selected row IDs',
    totalEnabled: 'Total count of enabled/selectable items',
    options: 'Configuration options',
  };
  
  return descriptions[param.name] || `Parameter of type ${param.type}`;
}

/**
 * Check if we should generate this utility
 */
function shouldGenerate(analysis) {
  const { name, category } = analysis;
  
  if (flags.only && name !== flags.only) {
    return false;
  }
  
  if (flags.category && category !== flags.category) {
    return false;
  }
  
  return true;
}

/**
 * Generate a utility file
 */
function generateUtility(analysis, duplicates) {
  const { name, unifiedProposal } = analysis;
  const { suggestedPath } = unifiedProposal;
  
  // Use specific template if available, otherwise generic
  const template = UTILITY_TEMPLATES[name] || UTILITY_TEMPLATES.generic;
  const content = template(analysis, duplicates);
  
  const fullPath = path.join(REPO_ROOT, suggestedPath);
  const dir = path.dirname(fullPath);
  
  return {
    name,
    path: fullPath,
    relativePath: suggestedPath,
    dir,
    content,
    analysis,
  };
}

/**
 * Generate barrel/index files for a category
 */
function generateCategoryIndex(category, utilities) {
  const exports = utilities
    .map(u => `export { ${u.name} } from './${u.name}';`)
    .join('\n');
  
  return `/**
 * ${category} utilities
 * 
 * @module utils/${category}
 */

${exports}
`;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔧 Utility Generator');
  console.log('====================\n');
  
  if (flags.dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be written\n');
  }
  
  const { unificationAnalysis, extractionCandidates } = inventory;
  
  if (!unificationAnalysis || unificationAnalysis.length === 0) {
    console.log('❌ No unification analysis found in inventory.');
    console.log('   Run the scanner with inline helper detection first.');
    process.exit(1);
  }
  
  // Filter analyses based on flags
  const toGenerate = unificationAnalysis.filter(shouldGenerate);
  
  if (toGenerate.length === 0) {
    console.log('❌ No utilities match the specified filters.');
    process.exit(1);
  }
  
  console.log(`📦 Found ${toGenerate.length} utilities to generate:\n`);
  
  const generated = [];
  const skipped = [];
  const byCategory = {};
  
  for (const analysis of toGenerate) {
    const result = generateUtility(analysis, extractionCandidates?.duplicates);
    
    // Group by category
    const cat = analysis.category;
    if (!byCategory[cat]) {
      byCategory[cat] = [];
    }
    byCategory[cat].push(result);
    
    // Check if file already exists
    if (fs.existsSync(result.path)) {
      console.log(`⏭️  ${result.name} - already exists at ${result.relativePath}`);
      skipped.push(result);
      continue;
    }
    
    if (flags.verbose) {
      console.log(`\n📄 ${result.name}`);
      console.log(`   Category: ${analysis.category}`);
      console.log(`   Path: ${result.relativePath}`);
      console.log(`   From: ${analysis.files.length} files`);
      if (analysis.differences.behaviorNotes.length > 0) {
        console.log(`   ⚠️  Behavior notes:`);
        analysis.differences.behaviorNotes.forEach(note => {
          console.log(`      - ${note}`);
        });
      }
    } else {
      console.log(`✅ ${result.name} → ${result.relativePath}`);
    }
    
    if (!flags.dryRun) {
      // Create directory if needed
      if (!fs.existsSync(result.dir)) {
        fs.mkdirSync(result.dir, { recursive: true });
      }
      
      // Write the file
      fs.writeFileSync(result.path, result.content, 'utf-8');
    }
    
    generated.push(result);
  }
  
  // Generate category index files
  console.log('\n📁 Category index files:');
  for (const [category, utilities] of Object.entries(byCategory)) {
    const indexPath = path.join(REPO_ROOT, 'packages/@dsai/react/src/utils', category, 'index.ts');
    const indexContent = generateCategoryIndex(category, utilities);
    
    if (flags.verbose) {
      console.log(`\n📄 ${category}/index.ts`);
      console.log(`   Exports: ${utilities.map(u => u.name).join(', ')}`);
    } else {
      console.log(`   ${category}/index.ts (${utilities.length} exports)`);
    }
    
    if (!flags.dryRun && generated.length > 0) {
      const dir = path.dirname(indexPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(indexPath, indexContent, 'utf-8');
    }
  }
  
  // Summary
  console.log('\n📊 Summary');
  console.log('==========');
  console.log(`Generated: ${generated.length}`);
  console.log(`Skipped (already exist): ${skipped.length}`);
  console.log(`Total: ${toGenerate.length}`);
  
  if (flags.dryRun) {
    console.log('\n💡 Run without --dry-run to create the files.');
  }
  
  // Print migration instructions
  if (generated.length > 0 && !flags.dryRun) {
    console.log('\n📋 Next Steps');
    console.log('=============');
    console.log('1. Review the generated files');
    console.log('2. Run the migration script to update component imports:');
    console.log('   node tools/scripts/react-utils/migrate-inline-utils.mjs');
    console.log('3. Run tests to verify: pnpm test');
  }
  
  // Output migration data for the next script
  if (!flags.dryRun && generated.length > 0) {
    const migrationData = {
      generated: generated.map(g => ({
        name: g.name,
        path: g.relativePath,
        migrationSteps: g.analysis.unifiedProposal.migrationSteps,
      })),
      timestamp: new Date().toISOString(),
    };
    
    const migrationPath = path.join(REPO_ROOT, '.temp', 'generated-utils.json');
    fs.writeFileSync(migrationPath, JSON.stringify(migrationData, null, 2));
    console.log(`\n📝 Migration data written to: .temp/generated-utils.json`);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  if (flags.verbose) {
    console.error(err.stack);
  }
  process.exit(1);
});
