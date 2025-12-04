#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../..');
const DEFAULT_TEMP_DIR = path.join(REPO_ROOT, '.temp');

const DEFAULT_COMPONENT_DIR = 'packages/@dsai/react/src/components';
const DEFAULT_OUTPUT = path.join(DEFAULT_TEMP_DIR, 'utils-inventory.json');
const DEFAULT_TSCONFIG = 'tsconfig.base.json';
let aliasPrefixes = [];

function parseArgs(argv) {
  const opts = {
    components: DEFAULT_COMPONENT_DIR,
    output: DEFAULT_OUTPUT,
    tsconfig: DEFAULT_TSCONFIG,
  };
  const positionals = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--components' || arg === '-c') {
      opts.components = argv[i + 1];
      i += 1;
    } else if (arg === '--output' || arg === '-o') {
      opts.output = argv[i + 1];
      i += 1;
    } else if (arg === '--tsconfig' || arg === '-t') {
      opts.tsconfig = argv[i + 1];
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      positionals.push(arg);
    }
  }

  if (positionals[0]) {
    opts.components = positionals[0];
  }
  if (positionals[1]) {
    opts.output = positionals[1];
  }

  return {
    components: path.resolve(process.cwd(), opts.components ?? DEFAULT_COMPONENT_DIR),
    output: path.resolve(process.cwd(), opts.output ?? DEFAULT_OUTPUT),
    tsconfig: path.resolve(process.cwd(), opts.tsconfig ?? DEFAULT_TSCONFIG),
  };
}

function printHelp() {
  /* eslint-disable no-console */
  console.log(`Usage: scan-utils-usage [options]

Options:
  -c, --components <dir>  Component directory to scan (default: ${DEFAULT_COMPONENT_DIR})
  -o, --output <file>      Output JSON file (default: ${DEFAULT_OUTPUT})
  -t, --tsconfig <path>    Tsconfig used for path metadata (default: ${DEFAULT_TSCONFIG})
  -h, --help               Show this help message

Positional compatibility:
  scan-utils-usage <componentsDir> <outputFile>
`);
  /* eslint-enable no-console */
}

const DIR_BLOCKLIST = new Set([
  '__tests__',
  '__mocks__',
  '__fixtures__',
  '__stories__',
  '.storybook',
  'mocks',
  'tests',
  'stories',
]);

const FILE_BLOCKLIST = [
  /\.d\.ts$/,
  /\.spec\.(ts|tsx)$/,
  /\.test\.(ts|tsx)$/,
  /\.stories\.(ts|tsx)$/,
  /\.a11y\.(ts|tsx)$/,
  /\.security\.(ts|tsx)$/,
  /\.integration\.(ts|tsx)$/,
  /\.figma\.(ts|tsx)$/,
];

// =============================================================================
// Enterprise Baseline - Expected utilities for a mature design system
// =============================================================================
const ENTERPRISE_BASELINE = {
  string: {
    description: 'String manipulation utilities',
    expected: [
      'cn',
      'classNames',
      'slugify',
      'capitalize',
      'truncate',
      'toCamelCase',
      'toKebabCase',
    ],
  },
  array: {
    description: 'Array manipulation utilities',
    expected: ['ensureArray', 'uniqueBy', 'chunk', 'partition', 'flatten', 'compact'],
  },
  object: {
    description: 'Object manipulation utilities',
    expected: ['mergeDeep', 'pick', 'omit', 'deepEqual', 'get'],
  },
  types: {
    description: 'Type guards and validators',
    expected: ['isNonEmpty', 'isDefined', 'isPlainObject', 'isFunction', 'isString'],
  },
  dom: {
    description: 'DOM utilities',
    expected: ['mergeRefs', 'getScrollParent', 'isElementVisible', 'focusableSelectors'],
  },
  keyboard: {
    description: 'Keyboard event handling',
    expected: ['isEnterKey', 'isSpaceKey', 'isEscapeKey', 'isNavigationKey', 'isActivationKey'],
  },
  a11y: {
    description: 'Accessibility utilities (WCAG 2.1)',
    expected: ['generateId', 'createAriaDescribedBy', 'announceToScreenReader', 'trapFocus'],
  },
  validation: {
    description: 'Input validation utilities',
    expected: ['isSafeHref', 'isValidEmail', 'isValidUrl', 'sanitizeInput'],
  },
  number: {
    description: 'Number utilities',
    expected: ['clamp', 'inRange', 'roundToStep'],
  },
  browser: {
    description: 'Browser environment utilities',
    expected: ['isBrowser', 'prefersReducedMotion', 'supportsTouch'],
  },
};

// Patterns to detect as extraction candidates
const UTILITY_PATTERNS = [
  {
    name: 'className-concat',
    regex:
      /className\s*=\s*\{[^}]*\+|\.join\s*\(\s*['"`]\s+['"`]\s*\)|\.filter\s*\(\s*Boolean\s*\)\.join/g,
    category: 'string',
  },
  { name: 'ref-merge', regex: /refs?\s*\.\s*forEach|refs?\.map.*current/g, category: 'dom' },
  {
    name: 'safe-href',
    regex: /javascript:|vbscript:|data:|startsWith\s*\(\s*['"`]javascript/gi,
    category: 'validation',
  },
  {
    name: 'keyboard-check',
    regex: /event\.key\s*===|keyCode\s*===|\.key\s*===\s*['"`](Enter|Escape|Space|Tab|Arrow)/g,
    category: 'keyboard',
  },
  { name: 'aria-id', regex: /aria-labelledby|aria-describedby|aria-controls/g, category: 'a11y' },
  {
    name: 'clamp-pattern',
    regex: /Math\.min\s*\(\s*Math\.max|Math\.max\s*\(\s*Math\.min/g,
    category: 'number',
  },
  {
    name: 'is-browser',
    regex:
      /typeof\s+window\s*[!=]==?\s*['"`]undefined|typeof\s+document\s*[!=]==?\s*['"`]undefined/g,
    category: 'browser',
  },
  {
    name: 'deep-equal',
    regex: /JSON\.stringify\s*\([^)]+\)\s*===\s*JSON\.stringify/g,
    category: 'object',
  },
];

function collectComponentFiles(rootDir) {
  const files = [];
  if (!fs.existsSync(rootDir)) {
    throw new Error(`Component directory not found: ${rootDir}`);
  }

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (DIR_BLOCKLIST.has(entry.name)) continue;
        walk(entryPath);
        continue;
      }

      if (!entry.isFile()) continue;
      if (!/(\.ts|\.tsx)$/.test(entry.name)) continue;
      if (FILE_BLOCKLIST.some((regex) => regex.test(entry.name))) continue;
      files.push(entryPath);
    }
  }

  walk(rootDir);
  return files;
}

function inferCategory(importPath) {
  const match = importPath.match(/utils\/(\w+)/);
  if (match) return match[1];
  if (importPath.includes('@dsai/react/utils')) return importPath.split('/').pop() ?? 'root';
  return 'misc';
}

function inferNameFromPath(importPath, fallback) {
  const base = path.basename(importPath);
  if (base === 'index' || base === '') {
    return fallback;
  }
  return base;
}

function isUtilityImportPath(spec) {
  return (
    spec.includes('/utils/') ||
    spec.endsWith('/utils') ||
    spec.includes('@dsai/react/utils') ||
    spec.includes('../utils') ||
    spec.includes('./utils') ||
    aliasPrefixes.some((prefix) => spec.startsWith(prefix))
  );
}

function getScriptKind(filePath) {
  if (filePath.endsWith('.tsx')) return ts.ScriptKind.TSX;
  return ts.ScriptKind.TS;
}

function isImportBindingNode(node) {
  const kinds = new Set([
    ts.SyntaxKind.ImportSpecifier,
    ts.SyntaxKind.ImportClause,
    ts.SyntaxKind.NamespaceImport,
    ts.SyntaxKind.ImportEqualsDeclaration,
  ]);
  return kinds.has(node.kind);
}

function collectUtilityImports(sourceFile) {
  const bindings = [];
  sourceFile.forEachChild((node) => {
    if (!ts.isImportDeclaration(node) || !node.importClause) {
      return;
    }

    const moduleSpecifier = node.moduleSpecifier.getText(sourceFile).slice(1, -1);
    if (!isUtilityImportPath(moduleSpecifier)) {
      return;
    }

    const importPath = moduleSpecifier;
    const { importClause } = node;

    if (importClause.namedBindings && ts.isNamedImports(importClause.namedBindings)) {
      for (const element of importClause.namedBindings.elements) {
        const localName = element.name.getText(sourceFile);
        const exportedName = element.propertyName
          ? element.propertyName.getText(sourceFile)
          : element.name.getText(sourceFile);
        bindings.push({
          localName,
          exportedName,
          importPath,
          kind: 'named',
        });
      }
    } else if (importClause.namedBindings && ts.isNamespaceImport(importClause.namedBindings)) {
      const localName = importClause.namedBindings.name.getText(sourceFile);
      bindings.push({
        localName,
        exportedName: localName,
        importPath,
        kind: 'namespace',
      });
    }

    if (importClause.name) {
      const localName = importClause.name.getText(sourceFile);
      bindings.push({
        localName,
        exportedName: inferNameFromPath(importPath, localName),
        importPath,
        kind: 'default',
      });
    }
  });
  return bindings;
}

// =============================================================================
// Inline Helper Detection
// =============================================================================

/**
 * Categorize a function name based on common naming patterns
 */
function categorizeFunctionName(name) {
  const lower = name.toLowerCase();

  // Validation / type guards
  if (lower.startsWith('is') || lower.startsWith('has') || lower.startsWith('can')) {
    if (lower.includes('safe') || lower.includes('valid')) return 'validation';
    return 'types';
  }

  // String utilities
  if (
    lower.includes('class') ||
    lower.includes('slug') ||
    lower.includes('camel') ||
    lower.includes('kebab') ||
    lower.includes('capitalize') ||
    lower.includes('truncate') ||
    (lower.includes('format') && lower.includes('string'))
  ) {
    return 'string';
  }

  // DOM utilities
  if (
    lower.includes('ref') ||
    lower.includes('element') ||
    lower.includes('dom') ||
    lower.includes('scroll') ||
    lower.includes('focus')
  ) {
    return 'dom';
  }

  // Keyboard utilities
  if (lower.includes('key') || lower.includes('keyboard')) {
    return 'keyboard';
  }

  // A11y utilities
  if (
    lower.includes('aria') ||
    lower.includes('a11y') ||
    lower.includes('accessible') ||
    lower.includes('announce') ||
    lower.includes('screenreader')
  ) {
    return 'a11y';
  }

  // Number utilities
  if (
    lower.includes('clamp') ||
    lower.includes('range') ||
    lower.includes('round') ||
    lower.includes('number') ||
    lower.includes('calculate')
  ) {
    return 'number';
  }

  // Array utilities
  if (
    lower.includes('array') ||
    lower.includes('unique') ||
    lower.includes('chunk') ||
    lower.includes('flatten') ||
    lower.includes('partition')
  ) {
    return 'array';
  }

  // Object utilities
  if (
    lower.includes('merge') ||
    lower.includes('pick') ||
    lower.includes('omit') ||
    lower.includes('deep') ||
    lower.includes('clone')
  ) {
    return 'object';
  }

  // Browser utilities
  if (
    lower.includes('browser') ||
    lower.includes('window') ||
    lower.includes('motion') ||
    lower.includes('touch') ||
    lower.includes('mobile')
  ) {
    return 'browser';
  }

  return 'misc';
}

/**
 * Check if a function looks like a utility (pure, reusable)
 */
function looksLikeUtility(node, sourceFile) {
  const name = node.name?.getText(sourceFile) || '';

  // Skip React lifecycle / hooks
  if (name.startsWith('use') || name.startsWith('handle') || name.startsWith('on')) {
    return false;
  }

  // Skip render methods
  if (name.startsWith('render') || name === 'Component') {
    return false;
  }

  // Skip private/internal (underscore prefix)
  if (name.startsWith('_')) {
    return false;
  }

  // Must have a reasonable name length
  if (name.length < 3) {
    return false;
  }

  return true;
}

/**
 * Collect inline helper functions defined in a source file
 */
function collectInlineHelpers(sourceFile, relativeFile, source) {
  const helpers = [];

  function visit(node) {
    // Function declarations: function foo() {}
    if (ts.isFunctionDeclaration(node) && node.name) {
      if (looksLikeUtility(node, sourceFile)) {
        const name = node.name.getText(sourceFile);
        const position = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        const endPosition = sourceFile.getLineAndCharacterOfPosition(node.getEnd());

        // Extract function signature and body
        const functionText = source.substring(node.getStart(), node.getEnd());
        const signature = extractSignature(node, sourceFile);

        helpers.push({
          name,
          category: categorizeFunctionName(name),
          type: 'function',
          line: position.line + 1,
          endLine: endPosition.line + 1,
          file: relativeFile,
          exported: node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) || false,
          signature,
          sourceCode: functionText,
        });
      }
    }

    // Arrow functions assigned to const: const foo = () => {}
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (
          decl.initializer &&
          (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer)) &&
          ts.isIdentifier(decl.name)
        ) {
          if (looksLikeUtility(decl, sourceFile)) {
            const name = decl.name.getText(sourceFile);
            const position = sourceFile.getLineAndCharacterOfPosition(node.getStart());
            const endPosition = sourceFile.getLineAndCharacterOfPosition(node.getEnd());

            // Extract function signature and body
            const functionText = source.substring(node.getStart(), node.getEnd());
            const signature = extractArrowSignature(decl, sourceFile);

            helpers.push({
              name,
              category: categorizeFunctionName(name),
              type: 'arrow',
              line: position.line + 1,
              endLine: endPosition.line + 1,
              file: relativeFile,
              exported:
                node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) || false,
              signature,
              sourceCode: functionText,
            });
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  // Only visit top-level nodes (not inside functions/classes)
  sourceFile.forEachChild(visit);

  return helpers;
}

/**
 * Extract function signature (params and return type)
 */
function extractSignature(node, sourceFile) {
  const params =
    node.parameters?.map((p) => {
      const name = p.name.getText(sourceFile);
      const type = p.type ? p.type.getText(sourceFile) : 'any';
      const optional = p.questionToken ? true : false;
      const defaultValue = p.initializer ? p.initializer.getText(sourceFile) : undefined;
      return { name, type, optional, defaultValue };
    }) || [];

  const returnType = node.type ? node.type.getText(sourceFile) : 'unknown';

  return { params, returnType };
}

/**
 * Extract arrow function signature
 */
function extractArrowSignature(decl, sourceFile) {
  const fn = decl.initializer;
  const params =
    fn.parameters?.map((p) => {
      const name = p.name.getText(sourceFile);
      const type = p.type ? p.type.getText(sourceFile) : 'any';
      const optional = p.questionToken ? true : false;
      const defaultValue = p.initializer ? p.initializer.getText(sourceFile) : undefined;
      return { name, type, optional, defaultValue };
    }) || [];

  // Try to get return type from declaration or arrow function
  let returnType = 'unknown';
  if (decl.type) {
    // const foo: () => boolean = ...
    returnType = decl.type.getText(sourceFile);
  } else if (fn.type) {
    returnType = fn.type.getText(sourceFile);
  }

  return { params, returnType };
}

// =============================================================================
// Pattern Detection
// =============================================================================

/**
 * Detect common utility patterns in source code
 */
function detectPatterns(source, relativeFile) {
  const detected = [];

  for (const pattern of UTILITY_PATTERNS) {
    const matches = source.match(pattern.regex);
    if (matches && matches.length > 0) {
      // Find line numbers for each match
      const lines = [];
      let searchPos = 0;
      for (const match of matches) {
        const idx = source.indexOf(match, searchPos);
        if (idx !== -1) {
          const lineNum = source.substring(0, idx).split('\n').length;
          lines.push(lineNum);
          searchPos = idx + match.length;
        }
      }

      detected.push({
        pattern: pattern.name,
        category: pattern.category,
        count: matches.length,
        file: relativeFile,
        lines,
      });
    }
  }

  return detected;
}

function analyzeFile(filePath, repoRoot) {
  const source = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    getScriptKind(filePath)
  );
  const bindings = collectUtilityImports(sourceFile);
  const relativeFile = path.relative(repoRoot, filePath) || filePath;

  // Collect inline helper functions (with source code)
  const inlineHelpers = collectInlineHelpers(sourceFile, relativeFile, source);

  // Detect utility patterns
  const patterns = detectPatterns(source, relativeFile);

  if (bindings.length === 0) {
    return { utilityUsage: [], inlineHelpers, patterns };
  }

  const localLookup = new Map();
  for (const binding of bindings) {
    localLookup.set(binding.localName, binding);
  }

  const fileUsage = new Map();

  function recordUsage(binding, exportedName, node) {
    const name =
      exportedName ||
      binding.exportedName ||
      inferNameFromPath(binding.importPath, binding.localName);
    const key = `${binding.importPath}::${name}`;
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const line = position.line + 1;
    const existing = fileUsage.get(key) || {
      binding,
      count: 0,
      lines: new Set(),
    };
    existing.count += 1;
    existing.lines.add(line);
    fileUsage.set(key, existing);
  }

  function shouldCountIdentifier(node) {
    const parent = node.parent;
    if (!parent) return true;
    if (isImportBindingNode(parent)) {
      return false;
    }
    if (ts.isPropertyAccessExpression(parent) && parent.expression === node) {
      return false;
    }
    return true;
  }

  function visit(node) {
    if (ts.isIdentifier(node)) {
      const binding = localLookup.get(node.text);
      if (binding && binding.kind !== 'namespace' && shouldCountIdentifier(node)) {
        recordUsage(binding, binding.exportedName, node);
      }
    } else if (ts.isPropertyAccessExpression(node)) {
      if (ts.isIdentifier(node.expression)) {
        const binding = localLookup.get(node.expression.text);
        if (binding && binding.kind === 'namespace') {
          const memberName = node.name.getText(sourceFile);
          recordUsage(binding, memberName, node.name);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  const results = [];

  for (const [key, usage] of fileUsage.entries()) {
    const [importPath, name] = key.split('::');
    results.push({
      name,
      importPath,
      category: inferCategory(importPath),
      count: usage.count,
      file: relativeFile,
      lines: Array.from(usage.lines).sort((a, b) => a - b),
    });
  }

  return { utilityUsage: results, inlineHelpers, patterns };
}

function aggregateResults(perFileResults) {
  const utilityMap = new Map();
  const allHelpers = [];
  const patternMap = new Map();

  for (const result of perFileResults) {
    // Aggregate utility usage
    for (const usage of result.utilityUsage) {
      const key = `${usage.importPath}::${usage.name}`;
      const existing = utilityMap.get(key) || {
        name: usage.name,
        importPath: usage.importPath,
        category: usage.category,
        totalCount: 0,
        files: [],
      };
      existing.totalCount += usage.count;
      existing.files.push({
        file: usage.file,
        count: usage.count,
        lines: usage.lines,
      });
      utilityMap.set(key, existing);
    }

    // Collect inline helpers
    allHelpers.push(...result.inlineHelpers);

    // Aggregate patterns
    for (const pattern of result.patterns) {
      const key = pattern.pattern;
      const existing = patternMap.get(key) || {
        pattern: pattern.pattern,
        category: pattern.category,
        totalCount: 0,
        files: [],
      };
      existing.totalCount += pattern.count;
      existing.files.push({
        file: pattern.file,
        count: pattern.count,
        lines: pattern.lines,
      });
      patternMap.set(key, existing);
    }
  }

  return {
    utilities: Array.from(utilityMap.values()).sort((a, b) => b.totalCount - a.totalCount),
    inlineHelpers: allHelpers,
    patterns: Array.from(patternMap.values()).sort((a, b) => b.totalCount - a.totalCount),
  };
}

/**
 * Aggregate inline helpers by name to find duplicates
 */
function aggregateHelpersByName(helpers) {
  const map = new Map();
  for (const helper of helpers) {
    const existing = map.get(helper.name) || {
      name: helper.name,
      category: helper.category,
      occurrences: [],
    };
    existing.occurrences.push({
      file: helper.file,
      line: helper.line,
      endLine: helper.endLine,
      type: helper.type,
      exported: helper.exported,
      signature: helper.signature,
      sourceCode: helper.sourceCode,
    });
    map.set(helper.name, existing);
  }
  return Array.from(map.values())
    .filter((h) => h.occurrences.length > 0)
    .sort((a, b) => b.occurrences.length - a.occurrences.length);
}

/**
 * Analyze differences between duplicate implementations
 */
function analyzeDuplicateDifferences(duplicates) {
  const analyzed = [];

  for (const dup of duplicates) {
    if (dup.occurrences.length < 2) continue;

    const analysis = {
      name: dup.name,
      category: dup.category,
      occurrenceCount: dup.occurrences.length,
      files: dup.occurrences.map((o) => o.file),
      differences: {
        parameterVariations: [],
        returnTypeVariations: [],
        behaviorNotes: [],
      },
      unifiedProposal: null,
    };

    // Analyze parameter variations
    const paramSets = new Map();
    const returnTypes = new Set();
    const undefinedBehaviors = [];

    for (const occ of dup.occurrences) {
      if (!occ.signature) continue;

      // Track parameter patterns
      const paramKey = occ.signature.params
        .map((p) => `${p.name}${p.optional ? '?' : ''}:${p.type}`)
        .join(', ');
      if (!paramSets.has(paramKey)) {
        paramSets.set(paramKey, []);
      }
      paramSets.get(paramKey).push(occ.file);

      // Track return types
      returnTypes.add(occ.signature.returnType);

      // Analyze undefined/null handling from source code
      if (occ.sourceCode) {
        if (occ.sourceCode.includes('return true') && occ.sourceCode.includes('!href')) {
          undefinedBehaviors.push({ file: occ.file, behavior: 'returns true for undefined' });
        } else if (occ.sourceCode.includes('return false') && occ.sourceCode.includes('!href')) {
          undefinedBehaviors.push({ file: occ.file, behavior: 'returns false for undefined' });
        }
      }
    }

    // Record variations
    if (paramSets.size > 1) {
      analysis.differences.parameterVariations = Array.from(paramSets.entries()).map(
        ([sig, files]) => ({
          signature: sig,
          usedIn: files,
        })
      );
    }

    if (returnTypes.size > 1) {
      analysis.differences.returnTypeVariations = Array.from(returnTypes);
    }

    if (undefinedBehaviors.length > 0) {
      const behaviors = new Set(undefinedBehaviors.map((b) => b.behavior));
      if (behaviors.size > 1) {
        analysis.differences.behaviorNotes.push({
          issue: 'Inconsistent undefined/null handling',
          details: undefinedBehaviors,
        });
      }
    }

    // Generate unified proposal
    analysis.unifiedProposal = generateUnifiedProposal(dup, analysis.differences);

    analyzed.push(analysis);
  }

  return analyzed;
}

/**
 * Generate a unified utility proposal based on all implementations
 */
function generateUnifiedProposal(duplicate, differences) {
  const { name, category, occurrences } = duplicate;

  // Collect all unique parameters across implementations
  const allParams = new Map();
  let mostCompleteReturnType = 'unknown';

  for (const occ of occurrences) {
    if (!occ.signature) continue;

    for (const param of occ.signature.params) {
      const existing = allParams.get(param.name);
      if (!existing) {
        allParams.set(param.name, { ...param, sources: [occ.file] });
      } else {
        existing.sources.push(occ.file);
        // Keep the most specific type
        if (param.type !== 'any' && existing.type === 'any') {
          existing.type = param.type;
        }
        // If any occurrence has it optional, mark as optional
        if (param.optional) {
          existing.optional = true;
        }
      }
    }

    // Track most specific return type
    if (occ.signature.returnType !== 'unknown') {
      mostCompleteReturnType = occ.signature.returnType;
    }
  }

  // Check if we need an options parameter for behavioral differences
  const needsOptions = differences.behaviorNotes.some((n) => n.issue.includes('Inconsistent'));

  // Build proposed signature
  const proposedParams = Array.from(allParams.values()).map((p) => ({
    name: p.name,
    type: p.type,
    optional: p.optional,
  }));

  // Add options param if needed
  const optionsNeeded = [];
  if (needsOptions) {
    if (differences.behaviorNotes.some((n) => n.issue.includes('undefined'))) {
      optionsNeeded.push({
        name: 'undefinedBehavior',
        type: "'safe' | 'unsafe'",
        description: 'How to handle undefined input: safe (returns true) or unsafe (returns false)',
        default: "'safe'",
      });
    }
  }

  // Collect all blocked patterns/protocols from source
  const blockedPatterns = new Set();
  for (const occ of occurrences) {
    if (!occ.sourceCode) continue;
    const matches = occ.sourceCode.match(
      /['"`](javascript:|data:|vbscript:|file:|text\/html|about:blank)['"`]/gi
    );
    if (matches) {
      matches.forEach((m) => blockedPatterns.add(m.replace(/['"`]/g, '').toLowerCase()));
    }
  }

  return {
    name,
    category,
    suggestedPath: `packages/@dsai/react/src/utils/${category}/${name}.ts`,
    signature: {
      params: proposedParams,
      returnType: mostCompleteReturnType,
      optionsParam:
        optionsNeeded.length > 0
          ? {
              name: 'options',
              type: `${capitalize(name)}Options`,
              optional: true,
              properties: optionsNeeded,
            }
          : null,
    },
    consolidatedLogic: {
      blockedPatterns: Array.from(blockedPatterns),
      notes: [
        `Combines logic from ${occurrences.length} implementations`,
        needsOptions
          ? 'Uses options parameter to support different behaviors'
          : 'All implementations have consistent behavior',
      ],
    },
    migrationSteps: occurrences.map((occ) => ({
      file: occ.file,
      action: 'Replace inline function with import',
      importStatement: `import { ${name} } from '../../utils/${category}';`,
    })),
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Calculate enterprise baseline gaps
 */
function calculateBaselineGaps(utilities, inlineHelpers) {
  const discovered = new Set();

  // Add utilities from imports
  for (const util of utilities) {
    discovered.add(util.name.toLowerCase());
  }

  // Add inline helpers
  for (const helper of inlineHelpers) {
    discovered.add(helper.name.toLowerCase());
  }

  const gaps = {};
  for (const [category, baseline] of Object.entries(ENTERPRISE_BASELINE)) {
    const missing = baseline.expected.filter((name) => !discovered.has(name.toLowerCase()));
    const found = baseline.expected.filter((name) => discovered.has(name.toLowerCase()));
    if (missing.length > 0 || found.length > 0) {
      gaps[category] = {
        description: baseline.description,
        expected: baseline.expected.length,
        found: found.length,
        missing,
        foundNames: found,
      };
    }
  }
  return gaps;
}

function printSummary(aggregated, filesScanned, outputFile, duplicateAnalysis) {
  const { utilities, inlineHelpers, patterns } = aggregated;
  /* eslint-disable no-console */
  console.log('✅ Scan complete');
  console.log('');
  console.log(`Files scanned: ${filesScanned}`);
  console.log(`Utilities imported: ${utilities.length}`);
  console.log(`Inline helpers found: ${inlineHelpers.length}`);
  console.log(`Utility patterns detected: ${patterns.length}`);

  // Utility usage by category
  const categoryCounts = new Map();
  for (const util of utilities) {
    categoryCounts.set(util.category, (categoryCounts.get(util.category) || 0) + util.totalCount);
  }

  if (categoryCounts.size > 0) {
    console.log('');
    console.log('Utility usage by category:');
    for (const [category, count] of Array.from(categoryCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    )) {
      console.log(`  ${category.padEnd(12)} ${count}`);
    }
  }

  // Top inline helpers (potential extraction candidates)
  const helpersByName = aggregateHelpersByName(inlineHelpers);
  const duplicateHelpers = helpersByName.filter((h) => h.occurrences.length > 1);
  if (duplicateHelpers.length > 0) {
    console.log('');
    console.log('⚠️  Duplicate helpers (extraction candidates):');
    for (const helper of duplicateHelpers.slice(0, 10)) {
      console.log(`  ${helper.occurrences.length} × ${helper.name} (${helper.category})`);
    }
  }

  // Show unification analysis
  if (duplicateAnalysis && duplicateAnalysis.length > 0) {
    console.log('');
    console.log('🔧 Unification proposals generated:');
    for (const analysis of duplicateAnalysis.slice(0, 5)) {
      const hasDiffs =
        analysis.differences.parameterVariations.length > 0 ||
        analysis.differences.returnTypeVariations.length > 0 ||
        analysis.differences.behaviorNotes.length > 0;
      const status = hasDiffs ? '⚡ has variations' : '✓ consistent';
      console.log(`  ${analysis.name} (${analysis.occurrenceCount} files) - ${status}`);
      if (analysis.unifiedProposal?.signature?.optionsParam) {
        console.log(
          `    → Needs options param for: ${analysis.unifiedProposal.signature.optionsParam.properties.map((p) => p.name).join(', ')}`
        );
      }
    }
  }

  // Top patterns
  if (patterns.length > 0) {
    console.log('');
    console.log('🔍 Detected patterns (consider centralizing):');
    for (const pattern of patterns.slice(0, 8)) {
      console.log(
        `  ${pattern.totalCount.toString().padStart(3)} × ${pattern.pattern} (${pattern.category})`
      );
    }
  }

  console.log('');
  console.log(`Full inventory saved to ${outputFile}`);
  console.log('');
  console.log('📋 Next steps:');
  console.log('  1. Review unificationAnalysis in the JSON for proposed utilities');
  console.log('  2. Each proposal includes signature, migration steps, and consolidated logic');
  console.log('  3. Use the sourceCode field to understand implementation differences');
  /* eslint-enable no-console */
}

function normalizeAlias(alias) {
  return alias.replace(/\/\*$/, '').replace(/\*$/, '').replace(/\/$/, '');
}

function loadUtilityAliasPrefixes(tsconfigPath) {
  if (!fs.existsSync(tsconfigPath)) {
    return [];
  }

  const configFile = ts.readConfigFile(tsconfigPath, (file) => fs.readFileSync(file, 'utf8'));
  if (configFile.error) {
    return [];
  }

  const paths = configFile.config?.compilerOptions?.paths ?? {};
  return Object.entries(paths)
    .filter(([alias, targets]) => {
      if (alias.includes('utils')) {
        return true;
      }
      return (
        Array.isArray(targets) &&
        targets.some((target) => typeof target === 'string' && target.includes('/utils'))
      );
    })
    .map(([alias]) => normalizeAlias(alias))
    .filter((alias) => alias.length > 0);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  aliasPrefixes = loadUtilityAliasPrefixes(options.tsconfig);
  const componentDir = options.components;
  /* eslint-disable no-console */
  console.log('🔍 Scanning components for utility usage...');
  console.log(`📁 Component directory: ${componentDir}`);
  console.log(`📝 Output file: ${options.output}`);
  if (aliasPrefixes.length > 0) {
    console.log(`🔗 Alias prefixes: ${aliasPrefixes.join(', ')}`);
  }
  console.log('');
  /* eslint-enable no-console */
  const files = collectComponentFiles(componentDir);
  if (files.length === 0) {
    throw new Error(`No component files found in ${componentDir}`);
  }

  const perFileResults = [];
  for (const filePath of files) {
    perFileResults.push(analyzeFile(filePath, REPO_ROOT));
  }

  const aggregated = aggregateResults(perFileResults);
  const helpersByName = aggregateHelpersByName(aggregated.inlineHelpers);
  const duplicates = helpersByName.filter((h) => h.occurrences.length > 1);
  const duplicateAnalysis = analyzeDuplicateDifferences(duplicates);
  const baselineGaps = calculateBaselineGaps(aggregated.utilities, aggregated.inlineHelpers);

  const payload = {
    generatedAt: new Date().toISOString(),
    componentDir: path.relative(REPO_ROOT, componentDir) || componentDir,
    filesScanned: files.length,
    tsconfig: path.relative(REPO_ROOT, options.tsconfig) || options.tsconfig,
    aliasPrefixes,

    // Existing utility imports
    utilities: aggregated.utilities,

    // NEW: Inline helpers that could be extracted
    extractionCandidates: {
      summary: {
        totalHelpers: aggregated.inlineHelpers.length,
        uniqueNames: helpersByName.length,
        duplicates: duplicates.length,
      },
      byCategory: groupByCategory(helpersByName),
      // Include duplicates with source code for AI analysis
      duplicates: duplicates.map((d) => ({
        name: d.name,
        category: d.category,
        occurrences: d.occurrences.map((o) => ({
          file: o.file,
          line: o.line,
          endLine: o.endLine,
          type: o.type,
          exported: o.exported,
          signature: o.signature,
          // Include source code for analysis
          sourceCode: o.sourceCode,
        })),
      })),
    },

    // NEW: Analyzed duplicates with unified proposals
    unificationAnalysis: duplicateAnalysis,

    // NEW: Detected patterns suggesting utility needs
    detectedPatterns: aggregated.patterns,

    // NEW: Enterprise baseline comparison
    enterpriseGaps: baselineGaps,
  };

  fs.mkdirSync(DEFAULT_TEMP_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  fs.writeFileSync(options.output, JSON.stringify(payload, null, 2));

  printSummary(aggregated, files.length, options.output, duplicateAnalysis);
}

/**
 * Group helpers by category for the report
 */
function groupByCategory(helpersByName) {
  const groups = {};
  for (const helper of helpersByName) {
    if (!groups[helper.category]) {
      groups[helper.category] = [];
    }
    groups[helper.category].push({
      name: helper.name,
      count: helper.occurrences.length,
    });
  }
  return groups;
}

main().catch((error) => {
  console.error('❌ Scan failed');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
