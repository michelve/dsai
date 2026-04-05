/**
 * Enhanced Init Command with Interactive Prompts
 *
 * Provides a comprehensive project initialization experience with
 * automatic project detection, interactive configuration, and
 * safe integration with existing projects.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/cli/commands/init
 *
 * @remarks
 * Currently supports React framework integration.
 * TODO: Add support for Vue, Angular, Svelte, Solid, and other frameworks (coming soon)
 */

/* eslint-disable no-console */
/* eslint-disable security/detect-non-literal-fs-filename */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import * as p from '@clack/prompts';
import { Command } from 'commander';
import pc from 'picocolors';

import { detectProject, getProjectSummary, getRecommendedConfig } from '../init/detector.js';
import {
  addDsaiToPackageJson,
  getChangesSummary,
  getInstallCommand,
  isDsaiInstalled,
  detectOutdatedDependencies,
  getAllDsaiDependencies,
  DSAI_DEPENDENCIES,
  DSAI_OPTIONAL_DEPENDENCIES,
} from '../init/package-modifier.js';
import {
  generateTemplate,
  getFrameworkSupportMessage,
  isFrameworkSupported,
  generateFigmaConfig,
  generateStyleDictionaryConfig,
  generateBuildTokensScript,
} from '../init/templates.js';
import { ExitCode } from '../types.js';

import type { ProjectInfo } from '../init/detector.js';
import type { InitOptions } from '../types.js';

// ============================================================================
// Constants
// ============================================================================

/** Message shown when user cancels the setup wizard */
const MSG_SETUP_CANCELLED = 'Setup cancelled.';

/** File encoding for all read/write operations */
const FILE_ENCODING = 'utf-8' as const;

/** Figma configuration filename */
const FIGMA_CONFIG_FILENAME = 'figma.config.mjs';

// ============================================================================
// Framework Support Check
// ============================================================================

/**
 * Check if the detected framework is supported.
 * If not, display a message and return false.
 *
 * @param projectInfo - Detected project information
 * @returns true if framework is supported, false otherwise
 */
function checkFrameworkSupport(projectInfo: ProjectInfo): boolean {
  if (isFrameworkSupported(projectInfo.framework)) {
    return true;
  }

  const message = getFrameworkSupportMessage(projectInfo.framework);
  console.log();
  console.log(pc.yellow('⚠ Framework Support Notice'));
  const SEPARATOR_WIDTH = 40;
  console.log(pc.gray('─'.repeat(SEPARATOR_WIDTH)));
  console.log();
  console.log(`  Detected framework: ${pc.cyan(projectInfo.framework)}`);
  console.log(`  ${message}`);
  console.log();
  console.log('  Currently supported frameworks:');
  console.log(`    ${pc.green('•')} React (including Next.js, Remix, Gatsby)`);
  console.log(`    ${pc.green('•')} Vanilla JavaScript/TypeScript`);
  console.log();
  console.log('  Coming soon:');
  console.log(`    ${pc.gray('•')} Vue (Nuxt, Vite)`);
  console.log(`    ${pc.gray('•')} Angular`);
  console.log(`    ${pc.gray('•')} Svelte (SvelteKit)`);
  console.log(`    ${pc.gray('•')} Solid`);
  console.log();
  console.log('  You can still use the vanilla configuration with any framework.');
  console.log(`  Run ${pc.cyan('dsai init --template vanilla')} to proceed.`);
  console.log();

  return false;
}

// ============================================================================
// Config Generation (Using templates module)
// ============================================================================

/**
 * Generate configuration content based on project info and user choices.
 * Delegates to the templates module for actual content generation.
 */
function generateConfigContent(options: {
  projectInfo: ProjectInfo;
  prefix: string;
  outputDir: string;
  sourceDir: string;
  formats: string[];
  template: 'minimal' | 'full' | 'enterprise';
  configFormat: 'mjs' | 'js' | 'ts';
}): string {
  const { projectInfo, prefix, outputDir, sourceDir, formats, template, configFormat } = options;

  // Use the templates module for generation
  const result = generateTemplate({
    projectInfo,
    prefix,
    outputDir,
    sourceDir,
    formats,
    template,
    configFormat,
  });

  return result.configContent;
}

// ============================================================================
// Interactive Init
// ============================================================================

/**
 * Run interactive initialization
 */
async function runInteractiveInit(cwd: string, projectInfo: ProjectInfo): Promise<void> {
  const recommendations = getRecommendedConfig(projectInfo);

  // Show project detection results
  p.note(
    getProjectSummary(projectInfo)
      .map((line) => `  ${line}`)
      .join('\n'),
    'Detected Project'
  );

  // Check for existing configuration
  if (projectInfo.existingConfigFile) {
    const overwrite = await p.confirm({
      message: `Found existing ${projectInfo.existingConfigFile}. Overwrite?`,
      initialValue: false,
    });

    if (p.isCancel(overwrite)) {
      p.cancel(MSG_SETUP_CANCELLED);
      process.exit(0);
    }

    if (!overwrite) {
      p.log.info('Keeping existing configuration.');
      return;
    }
  }

  // Gather configuration through prompts
  const config = await p.group(
    {
      template: () =>
        p.select({
          message: 'Configuration template',
          initialValue: 'full',
          options: [
            { value: 'minimal', label: 'Minimal', hint: 'Basic setup with essential options' },
            { value: 'full', label: 'Full', hint: 'Recommended for most projects' },
            {
              value: 'enterprise',
              label: 'Enterprise',
              hint: 'Advanced options for large teams',
            },
          ],
        }),

      prefix: () =>
        p.text({
          message: 'CSS custom property prefix',
          placeholder: recommendations.prefix,
          initialValue: recommendations.prefix,
          validate: (value: string) => {
            if (!value.startsWith('--')) {
              return 'Prefix should start with --';
            }
            if (!value.endsWith('-')) {
              return 'Prefix should end with -';
            }
            return undefined;
          },
        }),

      outputDir: () =>
        p.text({
          message: 'Output directory for generated tokens',
          placeholder: recommendations.outputDir,
          initialValue: recommendations.outputDir,
        }),

      sourceDir: () =>
        p.text({
          message: 'Source directory for Figma exports',
          placeholder: recommendations.sourceDir,
          initialValue: recommendations.sourceDir,
        }),

      formats: () =>
        p.multiselect({
          message: 'Output formats to generate',
          initialValues: recommendations.outputFormats,
          options: [
            { value: 'css', label: 'CSS', hint: 'CSS custom properties' },
            { value: 'scss', label: 'SCSS', hint: 'SCSS variables' },
            { value: 'js', label: 'JavaScript', hint: 'JS module' },
            { value: 'ts', label: 'TypeScript', hint: 'TS module with types' },
            { value: 'json', label: 'JSON', hint: 'JSON tokens file' },
          ],
          required: true,
        }),

      includeFigmaSync: () =>
        p.confirm({
          message: 'Include Figma sync integration?',
          initialValue: false,
        }),

      includeIcons: () =>
        p.confirm({
          message: 'Include icon generation support?',
          initialValue: false,
        }),

      includeScssIntegration: () =>
        p.confirm({
          message: 'Include SCSS integration?',
          initialValue: false,
        }),

      includeBootstrap: ({ results }) =>
        results.includeScssIntegration
          ? p.confirm({
              message: 'Include Bootstrap framework?',
              initialValue: true,
            })
          : Promise.resolve(false),

      modifyPackageJson: () =>
        p.confirm({
          message: 'Add build scripts to package.json?',
          initialValue: true,
        }),

      installDeps: () =>
        p.confirm({
          message: 'Install dependencies now?',
          initialValue: true,
        }),
    },
    {
      onCancel: () => {
        p.cancel(MSG_SETUP_CANCELLED);
        process.exit(0);
      },
    }
  );

  // Execute setup tasks
  const s = p.spinner();

  // 1. Create directories
  createSetupDirectories(cwd, [config.sourceDir as string, config.outputDir as string], s);

  // 2. Generate configuration files
  const configFileName = `dsai.config.${recommendations.configFormat}`;
  generateSetupConfigs(cwd, config, configFileName, projectInfo, recommendations, s);

  // 3. Handle outdated dependencies
  const upgradeDependencies = await handleOutdatedDeps(cwd, config);

  // 4. Modify package.json
  updatePackageJsonIfRequested(cwd, config, upgradeDependencies, s);

  // 5. Suggest install command
  suggestInstallDeps(config, projectInfo);

  // 6. Create sample files
  createSampleFiles(cwd, config.sourceDir as string, projectInfo, s);

  // Show next steps
  showNextSteps(configFileName, config, projectInfo);
}

/** Create directories during setup */
function createSetupDirectories(
  cwd: string,
  dirs: string[],
  s: ReturnType<typeof p.spinner>,
): void {
  s.start('Creating directories');
  for (const dir of dirs) {
    const fullPath = join(cwd, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  }
  s.stop('Directories created');
}

/** Generate config files (main, Figma, Style Dictionary) */
function generateSetupConfigs(
  cwd: string,
  config: Record<string, unknown>,
  configFileName: string,
  projectInfo: ProjectInfo,
  recommendations: ReturnType<typeof getRecommendedConfig>,
  s: ReturnType<typeof p.spinner>,
): void {
  s.start('Generating configuration');
  const configContent = generateConfigContent({
    projectInfo,
    prefix: config.prefix,
    outputDir: config.outputDir,
    sourceDir: config.sourceDir,
    formats: config.formats,
    template: config.template,
    configFormat: recommendations.configFormat,
  });
  writeFileSync(join(cwd, configFileName), configContent, FILE_ENCODING);
  s.stop(`Created ${configFileName}`);

  if (config.includeFigmaSync) {
    s.start('Generating Figma configuration');
    const figmaConfigContent = generateFigmaConfig({
      outputDir: config.sourceDir,
      tokensDir: 'collections',
      format: 'dtcg',
    });
    writeFileSync(join(cwd, FIGMA_CONFIG_FILENAME), figmaConfigContent, FILE_ENCODING);
    s.stop(`Created ${FIGMA_CONFIG_FILENAME}`);
  }

  if (config.template === 'enterprise') {
    s.start('Generating Style Dictionary configuration');
    const sdConfigContent = generateStyleDictionaryConfig({
      sourceDir: 'collections',
      outputDir: config.outputDir,
      prefix: config.prefix,
      outputReferences: true,
    });
    writeFileSync(join(cwd, 'sd.config.mjs'), sdConfigContent, FILE_ENCODING);

    const buildScriptContent = generateBuildTokensScript({
      sourceDir: 'collections',
      outputDir: config.outputDir,
      prefix: config.prefix,
      themes: ['light', 'dark'],
    });
    writeFileSync(join(cwd, 'build-tokens.mjs'), buildScriptContent, FILE_ENCODING);
    s.stop('Created sd.config.mjs and build-tokens.mjs');
  }
}

/** Display outdated deps and prompt for upgrade */
async function handleOutdatedDeps(
  cwd: string,
  config: Record<string, unknown>,
): Promise<boolean> {
  const targetDeps = getAllDsaiDependencies({
    includeFigmaTokens: config.includeFigmaSync,
    includeStyleDictionary: true,
    includeScssIntegration: config.includeScssIntegration,
    includeBootstrap: config.includeBootstrap,
  });

  const outdatedDeps = detectOutdatedDependencies(cwd, targetDeps);
  if (outdatedDeps.length === 0) { return false; }

  console.log();
  console.log(pc.yellow('Outdated dependencies detected:'));
  console.log();

  for (const dep of outdatedDeps) {
    const majorBadge = dep.isMajorChange ? pc.red(' [MAJOR]') : '';
    console.log(
      `  ${pc.cyan(dep.name)}: ${pc.gray(dep.currentVersion)} → ${pc.green(dep.latestVersion)}${majorBadge}`,
    );
    if (dep.warning) {
      console.log(`    ${pc.yellow('⚠')} ${dep.warning}`);
    }
  }
  console.log();

  const hasMajorChanges = outdatedDeps.some((d) => d.isMajorChange);
  if (hasMajorChanges) {
    console.log(pc.yellow('⚠ Warning: Some upgrades include major version changes.'));
    console.log(pc.gray('  Major version changes may include breaking changes that require'));
    console.log(pc.gray('  code updates. Review changelogs before upgrading.'));
    console.log();
  }

  const upgradeChoice = await p.confirm({
    message: 'Would you like to upgrade these dependencies?',
    initialValue: !hasMajorChanges,
  });

  if (p.isCancel(upgradeChoice)) {
    p.cancel(MSG_SETUP_CANCELLED);
    process.exit(0);
  }

  return upgradeChoice;
}

/** Update package.json with scripts and deps if requested */
function updatePackageJsonIfRequested(
  cwd: string,
  config: Record<string, unknown>,
  upgradeDependencies: boolean,
  s: ReturnType<typeof p.spinner>,
): void {
  if (!config.modifyPackageJson) { return; }

  s.start('Updating package.json');
  const result = addDsaiToPackageJson(cwd, {
    includeFigmaTokens: config.includeFigmaSync as boolean,
    includeIconsBuild: config.includeIcons as boolean,
    includeStyleDictionary: true,
    includeScssIntegration: config.includeScssIntegration as boolean,
    includeBootstrap: config.includeBootstrap as boolean,
    upgradeDependencies,
    createBackup: true,
  });

  if (result.success) {
    const changes = getChangesSummary(result);
    s.stop('Updated package.json');
    if (changes.length > 0) {
      p.log.info(changes.join('\n'));
    }
  } else {
    s.stop('Failed to update package.json');
    p.log.warn(result.error ?? 'Unknown error');
  }
}

/** Collect optional deps and suggest install command */
function suggestInstallDeps(
  config: Record<string, unknown>,
  projectInfo: ProjectInfo,
): void {
  if (!config.installDeps) { return; }

  const deps = [...DSAI_DEPENDENCIES];
  const optionalKeys: { flag: string; key: string }[] = [
    { flag: 'includeFigmaSync', key: 'figma-tokens' },
    { flag: 'includeScssIntegration', key: 'sass' },
    { flag: 'includeBootstrap', key: 'bootstrap' },
  ];

  for (const { flag, key } of optionalKeys) {
    if (config[flag]) {
      const dep = DSAI_OPTIONAL_DEPENDENCIES[key];
      if (dep) { deps.push(dep); }
    }
  }

  const installCmd = getInstallCommand(projectInfo.packageManager, deps);
  p.log.step(`Run: ${pc.cyan(installCmd)}`);
}

/** Create sample README in source directory */
function createSampleFiles(
  cwd: string,
  sourceDir: string,
  projectInfo: ProjectInfo,
  s: ReturnType<typeof p.spinner>,
): void {
  s.start('Creating sample files');
  const sampleTokensPath = join(cwd, sourceDir, 'README.md');
  if (!existsSync(sampleTokensPath)) {
    const runCmd = projectInfo.packageManager === 'npm' ? 'npm run' : projectInfo.packageManager;
    const sampleContent = `# Design Tokens

Place your Figma export files here.

## Expected Structure

After exporting from Figma, you should have a \`theme.json\` file with your design tokens.

## Usage

\`\`\`bash
# Build tokens
${runCmd} tokens:build

# Validate tokens
${runCmd} tokens:validate

# Watch for changes
${runCmd} tokens:watch
\`\`\`

## Documentation

For more information, visit https://github.com/michelve/dsai
`;
    writeFileSync(sampleTokensPath, sampleContent, FILE_ENCODING);
  }
  s.stop('Sample files created');
}

/** Show final next steps */
function showNextSteps(
  configFileName: string,
  config: Record<string, unknown>,
  projectInfo: ProjectInfo,
): void {
  const runCmd = projectInfo.packageManager === 'npm' ? 'npm run' : projectInfo.packageManager;
  const nextSteps = [
    `Edit ${pc.cyan(configFileName)} to customize settings`,
    `Add your Figma export to ${pc.cyan(config.sourceDir as string)}`,
    `Run ${pc.cyan(`${runCmd} tokens:build`)} to generate tokens`,
  ];

  if (!config.installDeps) {
    const installCmd = getInstallCommand(projectInfo.packageManager, DSAI_DEPENDENCIES);
    nextSteps.unshift(`Run ${pc.cyan(installCmd)} to install dependencies`);
  }

  p.note(nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n'), 'Next Steps');

  p.outro(pc.green('Setup complete! 🎉'));
}

// ============================================================================
// Quick Init (Non-interactive)
// ============================================================================

/**
 * Run quick initialization with defaults
 */
async function runQuickInit(
  cwd: string,
  projectInfo: ProjectInfo,
  template: 'minimal' | 'full' | 'enterprise'
): Promise<void> {
  const recommendations = getRecommendedConfig(projectInfo);

  console.log();
  console.log(pc.bold('DSAI Tools Quick Setup'));
  const QUICK_SEPARATOR_WIDTH = 30;
  console.log(pc.gray('─'.repeat(QUICK_SEPARATOR_WIDTH)));
  console.log();

  // Show detected project
  for (const line of getProjectSummary(projectInfo)) {
    console.log(`  ${pc.gray('•')} ${line}`);
  }
  console.log();

  // Check for existing config
  if (projectInfo.existingConfigFile) {
    console.log(
      `${pc.yellow('⚠')} Config file ${pc.cyan(projectInfo.existingConfigFile)} already exists.`
    );
    console.log(`  Use ${pc.cyan('dsai init')} (without --yes) to overwrite.`);
    console.log();
    process.exit(ExitCode.Success);
  }

  // Generate template with all required directories and files
  const templateResult = generateTemplate({
    projectInfo,
    prefix: recommendations.prefix,
    outputDir: recommendations.outputDir,
    sourceDir: recommendations.sourceDir,
    formats: recommendations.outputFormats,
    template,
    configFormat: recommendations.configFormat,
  });

  // Create directories (from template result)
  for (const dir of templateResult.directories) {
    const fullPath = join(cwd, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
      console.log(`${pc.green('✓')} Created ${pc.cyan(dir)}/`);
    }
  }

  // Write configuration file
  writeFileSync(
    join(cwd, templateResult.configFileName),
    templateResult.configContent,
    FILE_ENCODING
  );
  console.log(`${pc.green('✓')} Created ${pc.cyan(templateResult.configFileName)}`);

  // Create additional files (README, type stubs, etc.)
  for (const file of templateResult.additionalFiles) {
    const fullPath = join(cwd, file.path);
    const dirPath = join(cwd, file.path.split('/').slice(0, -1).join('/'));
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    if (!existsSync(fullPath)) {
      writeFileSync(fullPath, file.content, FILE_ENCODING);
      console.log(`${pc.green('✓')} Created ${pc.cyan(file.path)}`);
    }
  }

  // Enterprise template: generate Figma config and build scripts
  if (template === 'enterprise') {
    // Generate figma.config.mjs
    const figmaConfigContent = generateFigmaConfig({
      outputDir: recommendations.sourceDir,
      tokensDir: 'collections',
      format: 'dtcg',
    });
    writeFileSync(join(cwd, FIGMA_CONFIG_FILENAME), figmaConfigContent, FILE_ENCODING);
    console.log(`${pc.green('✓')} Created ${pc.cyan(FIGMA_CONFIG_FILENAME)}`);

    // Generate .env.example for Figma token
    const envExampleContent = `# Figma API Configuration
# Get your token from: https://www.figma.com/developers/api#access-tokens

FIGMA_TOKEN=your-figma-personal-access-token
FIGMA_FILE_KEY=your-figma-file-key
`;
    writeFileSync(join(cwd, '.env.example'), envExampleContent, FILE_ENCODING);
    console.log(`${pc.green('✓')} Created ${pc.cyan('.env.example')}`);
  }

  // Modify package.json
  // Enterprise template includes all features (including Bootstrap by default)
  const isEnterprise = template === 'enterprise';
  const result = addDsaiToPackageJson(cwd, {
    includeFigmaTokens: isEnterprise,
    includeStyleDictionary: true,
    includeIconsBuild: isEnterprise,
    includeScssIntegration: isEnterprise,
    includeBootstrap: isEnterprise,
    createBackup: true,
  });

  if (result.success) {
    console.log(`${pc.green('✓')} Updated ${pc.cyan('package.json')}`);
    if (result.backupPath) {
      const backupMsg = 'Backup: ' + result.backupPath;
      console.log(`  ${pc.gray(backupMsg)}`);
    }
  }

  // Show next steps
  console.log();
  console.log(pc.bold('Next steps:'));
  console.log();
  console.log(
    `  ${pc.gray('1.')} Edit ${pc.cyan(templateResult.configFileName)} to customize settings`
  );
  console.log(`  ${pc.gray('2.')} Add your Figma export to ${pc.cyan(recommendations.sourceDir)}/`);
  const buildCmd = (projectInfo.packageManager === 'npm' ? 'npm run' : projectInfo.packageManager) + ' tokens:build';
  console.log(
    `  ${pc.gray('3.')} Run ${pc.cyan(buildCmd)} to generate tokens`
  );
  console.log();

  const installCmd = getInstallCommand(projectInfo.packageManager, DSAI_DEPENDENCIES);
  console.log(`${pc.yellow('!')} Don't forget to install dependencies:`);
  console.log(`  ${pc.cyan(installCmd)}`);
  console.log();

  console.log(`${pc.green('✓')} Setup complete!`);
  console.log();
}

// ============================================================================
// Command Export
// ============================================================================

/**
 * Create init command
 *
 * @returns Commander command for initialization
 */
export function createInitCommand(): Command {
  return new Command('init')
    .description('Initialize DSAI configuration in your project')
    .option('-y, --yes', 'Skip prompts, use defaults', false)
    .option('-t, --template <template>', 'Config template (minimal|full|enterprise)', 'full')
    .option('--force', 'Overwrite existing configuration', false)
    .action(async (options: InitOptions & { force?: boolean }, command: Command) => {
      const globalOpts = command.parent?.opts() ?? {};
      const mergedOpts = { ...globalOpts, ...options };

      const cwd = resolve(mergedOpts.cwd ?? process.cwd());
      const projectInfo = detectProject(cwd);

      // Handle force flag for existing config
      if (projectInfo.existingConfigFile && mergedOpts.force) {
        projectInfo.existingConfigFile = undefined;
      }

      // Check if this is a valid project
      if (!projectInfo.isProject) {
        console.log();
        console.log(pc.yellow('⚠ No package.json found in this directory.'));
        console.log();
        console.log('To initialize DSAI in a new project, first run:');
        console.log(`  ${pc.cyan('npm init')} (or pnpm init, yarn init, bun init)`);
        console.log();
        console.log('Then run:');
        console.log(`  ${pc.cyan('dsai init')}`);
        console.log();
        process.exit(ExitCode.ConfigError);
      }

      // Check if the detected framework is supported
      // Currently only React and vanilla are supported
      // TODO: Add Vue, Angular, Svelte, Solid support (coming soon)
      if (!checkFrameworkSupport(projectInfo) && !mergedOpts.force) {
        process.exit(ExitCode.Success);
      }

      // Check if DSAI is already installed
      if (isDsaiInstalled(cwd) && !mergedOpts.force && !mergedOpts.yes) {
        console.log();
        console.log(pc.yellow('⚠ @dsai-io/tools is already installed in this project.'));
        console.log();
        console.log('To reconfigure, run:');
        console.log(`  ${pc.cyan('dsai init --force')}`);
        console.log();
        process.exit(ExitCode.Success);
      }

      // Run appropriate init mode
      if (mergedOpts.yes) {
        await runQuickInit(
          cwd,
          projectInfo,
          (mergedOpts.template as 'minimal' | 'full' | 'enterprise') ?? 'full'
        );
      } else {
        // Interactive mode with clack prompts
        console.clear();
        p.intro(pc.bgCyan(pc.black(' DSAI Tools Setup ')));
        await runInteractiveInit(cwd, projectInfo);
      }

      process.exit(ExitCode.Success);
    });
}
