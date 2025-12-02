#!/usr/bin/env node

/**
 * Button Usage Analyzer CLI Tool
 *
 * Phase 6 of the Button FSM Implementation
 *
 * This tool scans the codebase for Button component usage patterns and validates:
 * - Accessibility: icon-only buttons require aria-label
 * - FSM patterns: proper use of loading, error, disabled states
 * - Anti-patterns: event handlers on disabled buttons, missing accessible names
 *
 * Usage:
 *   node tools/scripts/analysis/analyze-button-usage.cjs [path]
 *   pnpm analyze:buttons [path]
 *
 * Options:
 *   --fix     Auto-fix some issues (coming soon)
 *   --json    Output results as JSON
 *   --verbose Show all files scanned
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

/**
 * Issue severity levels
 */
const Severity = {
  ERROR: 'error', // Accessibility violations
  WARNING: 'warning', // Anti-patterns that should be fixed
  INFO: 'info', // Informational messages
};

/**
 * Issue categories
 */
const Category = {
  ACCESSIBILITY: 'accessibility',
  FSM_PATTERN: 'fsm-pattern',
  ANTI_PATTERN: 'anti-pattern',
  BEST_PRACTICE: 'best-practice',
};

/**
 * Represents an issue found during analysis
 */
class Issue {
  constructor(severity, category, message, file, line, code, suggestion) {
    this.severity = severity;
    this.category = category;
    this.message = message;
    this.file = file;
    this.line = line;
    this.code = code;
    this.suggestion = suggestion;
  }

  toString() {
    const severityColor =
      this.severity === Severity.ERROR
        ? colors.red
        : this.severity === Severity.WARNING
          ? colors.yellow
          : colors.blue;
    const categoryBadge = `[${this.category}]`;

    let output = `${severityColor}${this.severity.toUpperCase()}${colors.reset} ${colors.dim}${categoryBadge}${colors.reset}\n`;
    output += `  ${colors.cyan}${this.file}:${this.line}${colors.reset}\n`;
    output += `  ${this.message}\n`;
    if (this.code) {
      output += `  ${colors.dim}Code: ${this.code.trim().substring(0, 100)}...${colors.reset}\n`;
    }
    if (this.suggestion) {
      output += `  ${colors.green}Suggestion: ${this.suggestion}${colors.reset}\n`;
    }
    return output;
  }
}

/**
 * Analyzer class for scanning Button usage
 */
class ButtonUsageAnalyzer {
  constructor(options = {}) {
    this.issues = [];
    this.filesScanned = 0;
    this.buttonsFound = 0;
    this.options = {
      verbose: options.verbose || false,
      json: options.json || false,
      ignorePaths: options.ignorePaths || [
        'node_modules',
        'dist',
        'build',
        '.next',
        'coverage',
        '.git',
      ],
      extensions: options.extensions || ['.tsx', '.jsx', '.ts', '.js'],
    };
  }

  /**
   * Check if a file should be scanned
   */
  shouldScanFile(filePath) {
    // Check if path contains ignored directories
    for (const ignorePath of this.options.ignorePaths) {
      if (filePath.includes(`/${ignorePath}/`) || filePath.includes(`\\${ignorePath}\\`)) {
        return false;
      }
    }

    // Check extension
    const ext = path.extname(filePath);
    return this.options.extensions.includes(ext);
  }

  /**
   * Recursively scan directory for files
   */
  getFiles(dir, fileList = []) {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        try {
          const stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
            // Skip ignored directories
            if (!this.options.ignorePaths.includes(file)) {
              this.getFiles(filePath, fileList);
            }
          } else if (this.shouldScanFile(filePath)) {
            fileList.push(filePath);
          }
        } catch {
          // Skip files we can't access
        }
      }
    } catch {
      // Skip directories we can't access
    }
    return fileList;
  }

  /**
   * Extract Button usages from file content
   */
  extractButtonUsages(content, filePath) {
    const usages = [];

    // Match Button component usages (both self-closing and with children)
    // Handles: <Button ...>, <Button>...</Button>
    const buttonRegex = /<Button\s+([^>]*?)(?:\/>|>([^]*?)<\/Button>)/g;

    let match;
    while ((match = buttonRegex.exec(content)) !== null) {
      const props = match[1] || '';
      const children = match[2] || '';
      const fullMatch = match[0];

      // Calculate line number
      const linesBefore = content.substring(0, match.index).split('\n');
      const line = linesBefore.length;

      // Skip if inside JSDoc comment or multiline comment
      const lastFewLines = linesBefore.slice(-10).join('\n');
      if (lastFewLines.includes('/**') && !lastFewLines.includes('*/')) {
        continue; // Inside JSDoc block
      }
      if (lastFewLines.includes('/*') && !lastFewLines.includes('*/')) {
        continue; // Inside multiline comment
      }

      // Skip if line starts with * (JSDoc continuation) or //
      const currentLine = linesBefore[linesBefore.length - 1] || '';
      if (/^\s*\*/.test(currentLine) || /^\s*\/\//.test(currentLine)) {
        continue;
      }

      usages.push({
        fullMatch,
        props,
        children: children.trim(),
        line,
        filePath,
      });
    }

    return usages;
  }

  /**
   * Parse props string into key-value pairs
   */
  parseProps(propsString) {
    const props = {};

    // Match prop patterns: name="value", name={value}, name (boolean)
    const propPatterns = [
      // String props: name="value" or name='value'
      /(\w+(?:-\w+)*)\s*=\s*["']([^"']*)["']/g,
      // JSX expression props: name={value}
      /(\w+(?:-\w+)*)\s*=\s*\{([^}]*)\}/g,
      // Boolean shorthand: name (without value)
      /(?:^|\s)(\w+)(?=\s|$|\/)/g,
    ];

    // Extract string props
    let match;
    while ((match = propPatterns[0].exec(propsString)) !== null) {
      props[match[1]] = match[2];
    }

    // Extract JSX expression props
    while ((match = propPatterns[1].exec(propsString)) !== null) {
      props[match[1]] = match[2];
    }

    // Extract boolean shorthand props
    const booleanProps = propsString.match(
      /(?:^|\s)(disabled|loading|error|fullWidth)(?=\s|$|\/|>)/g
    );
    if (booleanProps) {
      for (const prop of booleanProps) {
        props[prop.trim()] = true;
      }
    }

    return props;
  }

  /**
   * Check if children represent icon-only content (no meaningful text)
   */
  isIconOnlyContent(children, props) {
    // No children at all - only consider as icon-only if there's an icon prop
    if (!children || children === '' || children === "{''}") {
      return props.startIcon || props.endIcon;
    }

    const trimmed = children.trim();

    // Common short words that are meaningful button labels
    const meaningfulShortWords = [
      'ok',
      'on',
      'go',
      'no',
      'yes',
      'add',
      'del',
      'new',
      'off',
      'edit',
      'save',
      'send',
      'done',
      'open',
      'close',
      'back',
      'next',
      'prev',
      'home',
      'help',
      'info',
      'view',
      'hide',
      'show',
      'copy',
      'cut',
      'undo',
      'redo',
      'play',
      'stop',
      'skip',
      'run',
      'log',
      'in',
      'out',
    ];

    // Check if it's a known meaningful short word
    if (meaningfulShortWords.includes(trimmed.toLowerCase())) {
      return false;
    }

    // Has meaningful text content (3+ letters forming words)
    if (/[a-zA-Z]{3,}/.test(trimmed)) {
      return false;
    }

    // Single character or very short (icon-like)
    if (trimmed.length <= 2) {
      return true;
    }

    // Common icon patterns (pure icons with no text)
    const iconPatterns = [
      /^[×✕✖✗✘✓✔☓←→↑↓↔↕⬅➡⬆⬇➕➖❌✅]+$/u,
      /^<[A-Z]\w*Icon\s*\/?>$/,
      /^<Icon\s/,
      /^\{.*Icon.*\}$/,
    ];

    for (const pattern of iconPatterns) {
      if (pattern.test(trimmed)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Analyze a single Button usage
   */
  analyzeButtonUsage(usage) {
    const { props: propsString, children, line, filePath, fullMatch } = usage;
    const props = this.parseProps(propsString);

    // Rule 1: Icon-only buttons MUST have aria-label
    if (this.isIconOnlyContent(children, props)) {
      if (!props['aria-label'] && !props['aria-labelledby'] && !props.title) {
        this.issues.push(
          new Issue(
            Severity.ERROR,
            Category.ACCESSIBILITY,
            'Icon-only button missing accessible name',
            filePath,
            line,
            fullMatch.substring(0, 150),
            'Add aria-label="Description of action" to provide accessible name for screen readers'
          )
        );
      }
    }

    // Rule 2: Warn about onClick on disabled buttons
    if (props.disabled && props.onClick) {
      this.issues.push(
        new Issue(
          Severity.INFO,
          Category.BEST_PRACTICE,
          'onClick handler on disabled button (handler will not fire)',
          filePath,
          line,
          fullMatch.substring(0, 150),
          'Consider removing onClick when button is disabled, or use FSM pattern for dynamic disable'
        )
      );
    }

    // Rule 3: Check for loading without loadingText
    if (props.loading && !props.loadingText) {
      this.issues.push(
        new Issue(
          Severity.INFO,
          Category.BEST_PRACTICE,
          'Loading button without loadingText prop',
          filePath,
          line,
          fullMatch.substring(0, 150),
          'Consider adding loadingText="Loading..." to improve user feedback'
        )
      );
    }

    // Rule 4: Check for error state without recovery action
    if (props.error && !props.onClick) {
      this.issues.push(
        new Issue(
          Severity.WARNING,
          Category.FSM_PATTERN,
          'Error state button without onClick handler (no recovery action)',
          filePath,
          line,
          fullMatch.substring(0, 150),
          'Error state buttons should typically have an onClick handler for retry/recovery'
        )
      );
    }

    // Rule 5: Both loading and error at same time
    if (props.loading && props.error) {
      this.issues.push(
        new Issue(
          Severity.WARNING,
          Category.FSM_PATTERN,
          'Button has both loading and error props set simultaneously',
          filePath,
          line,
          fullMatch.substring(0, 150),
          'Use either loading OR error state, not both. FSM prioritizes loading over error.'
        )
      );
    }

    // Rule 6: Missing children entirely
    if (!children && !props['aria-label'] && !props.startIcon && !props.endIcon) {
      this.issues.push(
        new Issue(
          Severity.ERROR,
          Category.ACCESSIBILITY,
          'Button has no visible content or accessible name',
          filePath,
          line,
          fullMatch.substring(0, 150),
          'Add text content, or aria-label for icon-only buttons'
        )
      );
    }

    // Rule 7: type="submit" without form context (informational)
    if (props.type === 'submit' && !props.form) {
      // This is just info - submit buttons are often inside forms
      // We'll only flag this as info, not a warning
    }

    // Rule 8: aria-expanded without aria-controls
    if (props['aria-expanded'] && !props['aria-controls']) {
      this.issues.push(
        new Issue(
          Severity.WARNING,
          Category.ACCESSIBILITY,
          'aria-expanded used without aria-controls',
          filePath,
          line,
          fullMatch.substring(0, 150),
          'When using aria-expanded, also specify aria-controls to reference the controlled element ID'
        )
      );
    }

    this.buttonsFound++;
  }

  /**
   * Analyze a single file
   */
  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Quick check if file contains Button usage
      if (!content.includes('<Button')) {
        return;
      }

      const usages = this.extractButtonUsages(content, filePath);

      for (const usage of usages) {
        this.analyzeButtonUsage(usage);
      }

      this.filesScanned++;

      if (this.options.verbose) {
        console.log(`${colors.dim}Scanned: ${filePath} (${usages.length} buttons)${colors.reset}`);
      }
    } catch {
      if (this.options.verbose) {
        console.log(`${colors.yellow}Warning: Could not read ${filePath}${colors.reset}`);
      }
    }
  }

  /**
   * Run the analyzer on a directory or file
   */
  analyze(targetPath) {
    const resolvedPath = path.resolve(targetPath);

    try {
      const stat = fs.statSync(resolvedPath);

      if (stat.isDirectory()) {
        const files = this.getFiles(resolvedPath);
        for (const file of files) {
          this.analyzeFile(file);
        }
      } else {
        this.analyzeFile(resolvedPath);
      }
    } catch {
      console.error(`${colors.red}Error: Cannot access ${resolvedPath}${colors.reset}`);
      process.exit(1);
    }
  }

  /**
   * Get summary statistics
   */
  getSummary() {
    const errors = this.issues.filter((i) => i.severity === Severity.ERROR);
    const warnings = this.issues.filter((i) => i.severity === Severity.WARNING);
    const infos = this.issues.filter((i) => i.severity === Severity.INFO);

    return {
      filesScanned: this.filesScanned,
      buttonsFound: this.buttonsFound,
      totalIssues: this.issues.length,
      errors: errors.length,
      warnings: warnings.length,
      infos: infos.length,
      byCategory: {
        accessibility: this.issues.filter((i) => i.category === Category.ACCESSIBILITY).length,
        fsmPattern: this.issues.filter((i) => i.category === Category.FSM_PATTERN).length,
        antiPattern: this.issues.filter((i) => i.category === Category.ANTI_PATTERN).length,
        bestPractice: this.issues.filter((i) => i.category === Category.BEST_PRACTICE).length,
      },
    };
  }

  /**
   * Print results to console
   */
  printResults() {
    const summary = this.getSummary();

    console.log(
      '\n' +
        colors.bold +
        '═══════════════════════════════════════════════════════════════' +
        colors.reset
    );
    console.log(
      colors.bold +
        '                    Button Usage Analysis Report                 ' +
        colors.reset
    );
    console.log(
      colors.bold +
        '═══════════════════════════════════════════════════════════════' +
        colors.reset +
        '\n'
    );

    console.log(`${colors.cyan}Files scanned:${colors.reset}  ${summary.filesScanned}`);
    console.log(`${colors.cyan}Buttons found:${colors.reset}  ${summary.buttonsFound}`);
    console.log(`${colors.cyan}Total issues:${colors.reset}   ${summary.totalIssues}\n`);

    if (summary.totalIssues === 0) {
      console.log(
        `${colors.green}✓ No issues found! All Button usages follow best practices.${colors.reset}\n`
      );
      return;
    }

    // Print issue breakdown
    console.log(`${colors.bold}Issue Summary:${colors.reset}`);
    if (summary.errors > 0) {
      console.log(`  ${colors.red}● Errors:${colors.reset}     ${summary.errors} (must fix)`);
    }
    if (summary.warnings > 0) {
      console.log(
        `  ${colors.yellow}● Warnings:${colors.reset}   ${summary.warnings} (should fix)`
      );
    }
    if (summary.infos > 0) {
      console.log(`  ${colors.blue}● Info:${colors.reset}       ${summary.infos} (suggestions)`);
    }

    console.log(`\n${colors.bold}By Category:${colors.reset}`);
    if (summary.byCategory.accessibility > 0) {
      console.log(
        `  ${colors.magenta}● Accessibility:${colors.reset}  ${summary.byCategory.accessibility}`
      );
    }
    if (summary.byCategory.fsmPattern > 0) {
      console.log(
        `  ${colors.magenta}● FSM Pattern:${colors.reset}    ${summary.byCategory.fsmPattern}`
      );
    }
    if (summary.byCategory.bestPractice > 0) {
      console.log(
        `  ${colors.magenta}● Best Practice:${colors.reset}  ${summary.byCategory.bestPractice}`
      );
    }

    // Print individual issues
    console.log(
      '\n' +
        colors.bold +
        '───────────────────────────────────────────────────────────────' +
        colors.reset
    );
    console.log(
      colors.bold + '                           Issues                              ' + colors.reset
    );
    console.log(
      colors.bold +
        '───────────────────────────────────────────────────────────────' +
        colors.reset +
        '\n'
    );

    // Sort by severity: errors first, then warnings, then info
    const sortedIssues = [...this.issues].sort((a, b) => {
      const severityOrder = { error: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

    for (const issue of sortedIssues) {
      console.log(issue.toString());
    }

    // Exit code
    console.log(
      colors.bold + '───────────────────────────────────────────────────────────────' + colors.reset
    );
    if (summary.errors > 0) {
      console.log(
        `\n${colors.red}✗ Analysis failed with ${summary.errors} error(s)${colors.reset}`
      );
      console.log(`${colors.dim}Fix errors to ensure accessibility compliance.${colors.reset}\n`);
    } else if (summary.warnings > 0) {
      console.log(
        `\n${colors.yellow}⚠ Analysis completed with ${summary.warnings} warning(s)${colors.reset}`
      );
      console.log(
        `${colors.dim}Consider fixing warnings to improve code quality.${colors.reset}\n`
      );
    } else {
      console.log(
        `\n${colors.green}✓ Analysis completed with info-level suggestions only${colors.reset}\n`
      );
    }
  }

  /**
   * Print results as JSON
   */
  printJSON() {
    const output = {
      summary: this.getSummary(),
      issues: this.issues.map((i) => ({
        severity: i.severity,
        category: i.category,
        message: i.message,
        file: i.file,
        line: i.line,
        suggestion: i.suggestion,
      })),
    };
    console.log(JSON.stringify(output, null, 2));
  }

  /**
   * Get exit code based on issues found
   */
  getExitCode() {
    const summary = this.getSummary();
    if (summary.errors > 0) return 1;
    return 0;
  }
}

// CLI Entry Point
function main() {
  const args = process.argv.slice(2);

  // Parse options
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    json: args.includes('--json'),
  };

  // Get target path (default to current directory)
  const targetPath = args.find((arg) => !arg.startsWith('-')) || '.';

  // Print header
  if (!options.json) {
    console.log(`\n${colors.cyan}${colors.bold}🔍 Button Usage Analyzer${colors.reset}`);
    console.log(`${colors.dim}Phase 6 - FSM Implementation${colors.reset}\n`);
    console.log(`Analyzing: ${path.resolve(targetPath)}`);
  }

  // Run analysis
  const analyzer = new ButtonUsageAnalyzer(options);
  analyzer.analyze(targetPath);

  // Output results
  if (options.json) {
    analyzer.printJSON();
  } else {
    analyzer.printResults();
  }

  // Exit with appropriate code
  process.exit(analyzer.getExitCode());
}

main();
