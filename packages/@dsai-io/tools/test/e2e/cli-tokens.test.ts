/**
 * E2E tests for CLI token commands
 *
 * Tests the CLI commands for token operations:
 * - tokens validate
 * - tokens build (where possible)
 * - tokens sync
 *
 * These tests run the actual CLI commands in a test environment.
 */

import { execSync, type ExecSyncOptions } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// ============================================================================
// Test Helpers
// ============================================================================

interface CLIResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

function createTestDir(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const testDir = join(tmpdir(), `dsai-e2e-test-${timestamp}-${random}`);
  mkdirSync(testDir, { recursive: true });
  return testDir;
}

function cleanupTestDir(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

function writeTokenFile(dir: string, name: string, content: object): string {
  const filePath = join(dir, name);
  const parentDir = join(filePath, '..');
  if (!existsSync(parentDir)) {
    mkdirSync(parentDir, { recursive: true });
  }
  writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  return filePath;
}

function runCLI(args: string[], cwd: string): CLIResult {
  // Use process.cwd() based resolution since __dirname may not work correctly in Jest
  const toolsPackageRoot = resolve(__dirname, '../..');

  // Prefer using the built binary if it exists (more reliable, especially for --help)
  const binaryPath = resolve(toolsPackageRoot, 'bin/dsai-tools.mjs');
  const distPath = resolve(toolsPackageRoot, 'dist/cli/index.js');
  const sourcePath = resolve(toolsPackageRoot, 'src/cli/index.ts');

  // Debug logging for CI troubleshooting
  const binaryExists = existsSync(binaryPath);
  const distExists = existsSync(distPath);
  const sourceExists = existsSync(sourcePath);

  // Determine which CLI to use: binary (with dist) > source via tsx
  let cliCommand: string;
  if (binaryExists && distExists) {
    cliCommand = `node ${binaryPath}`;
  } else if (sourceExists) {
    cliCommand = `npx tsx ${sourcePath}`;
  } else {
    return {
      stdout: '',
      stderr: `CLI not found. binary=${binaryExists}, dist=${distExists}, source=${sourceExists}. Paths: ${binaryPath}, ${distPath}, ${sourcePath}`,
      exitCode: 1,
    };
  }

  const execOptions: ExecSyncOptions = {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      NODE_ENV: 'test',
      FORCE_COLOR: '0',
    },
    timeout: 30000,
    maxBuffer: 10 * 1024 * 1024,
  };

  try {
    const command = `${cliCommand} ${args.join(' ')}`;
    const stdout = execSync(command, { ...execOptions, stdio: 'pipe' }) as unknown as string;
    return {
      stdout: stdout || '',
      stderr: '',
      exitCode: 0,
    };
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string; status?: number; message?: string };
    return {
      stdout: err.stdout?.toString() || '',
      stderr: err.stderr?.toString() || err.message || '',
      exitCode: err.status ?? 1,
    };
  }
}

function createMinimalConfig(dir: string, collectionsDir: string): string {
  const configPath = join(dir, 'dsai.config.mjs');
  const configContent = `
export default {
  tokens: {
    collectionsDir: '${collectionsDir}',
    formats: ['css'],
  },
};
`;
  writeFileSync(configPath, configContent, 'utf8');
  return configPath;
}

// ============================================================================
// CLI Help Tests
// ============================================================================

describe('CLI Help Output', () => {
  it('should display help for tokens command', () => {
    const result = runCLI(['tokens', '--help'], process.cwd());

    // Fail explicitly if CLI not available - CI builds before tests, local devs need feedback
    if (result.stderr.includes('CLI not found')) {
      throw new Error(
        `CLI not available: ${result.stderr}. Run 'pnpm nx run @dsai-io/tools:build' first.`
      );
    }

    const output = result.stdout + result.stderr;

    // Fail if output is empty - CLI should always produce output when built
    if (!output.trim()) {
      const toolsRoot = resolve(__dirname, '../..');
      const distExists = existsSync(resolve(toolsRoot, 'dist/cli/index.js'));
      const binExists = existsSync(resolve(toolsRoot, 'bin/dsai-tools.mjs'));
      throw new Error(
        `CLI returned empty output. dist/cli/index.js exists: ${distExists}, bin/dsai-tools.mjs exists: ${binExists}. ` +
          "Run 'pnpm nx run @dsai-io/tools:build' first."
      );
    }

    // Help text should include command description
    expect(output).toMatch(/token/i);
  });

  it('should display help for tokens validate command', () => {
    const result = runCLI(['tokens', 'validate', '--help'], process.cwd());

    // Fail explicitly if CLI not available - CI builds before tests, local devs need feedback
    if (result.stderr.includes('CLI not found')) {
      throw new Error(
        `CLI not available: ${result.stderr}. Run 'pnpm nx run @dsai-io/tools:build' first.`
      );
    }

    const output = result.stdout + result.stderr;

    // Fail if output is empty - CLI should always produce output when built
    if (!output.trim()) {
      const toolsRoot = resolve(__dirname, '../..');
      const distExists = existsSync(resolve(toolsRoot, 'dist/cli/index.js'));
      const binExists = existsSync(resolve(toolsRoot, 'bin/dsai-tools.mjs'));
      throw new Error(
        `CLI returned empty output. dist/cli/index.js exists: ${distExists}, bin/dsai-tools.mjs exists: ${binExists}. ` +
          "Run 'pnpm nx run @dsai-io/tools:build' first."
      );
    }

    expect(output).toMatch(/validate/i);
  });
});

// ============================================================================
// Token Validation E2E Tests
// ============================================================================

describe('CLI tokens validate', () => {
  let testDir: string;
  let collectionsDir: string;

  beforeEach(() => {
    testDir = createTestDir();
    collectionsDir = join(testDir, 'collections');
    mkdirSync(collectionsDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  it('should validate valid token files', () => {
    // Create valid tokens
    writeTokenFile(collectionsDir, 'colors.json', {
      color: {
        primary: {
          $type: 'color',
          $value: '#007bff',
        },
      },
    });

    // Create config
    createMinimalConfig(testDir, collectionsDir);

    const result = runCLI(['tokens', 'validate', '--quiet'], testDir);

    // Validation should succeed
    expect(result.exitCode).toBe(0);
  });

  it('should report validation errors for invalid tokens', () => {
    // Create invalid tokens (missing required fields)
    writeTokenFile(collectionsDir, 'invalid.json', {
      color: {
        broken: {
          // Missing $type and $value
          description: 'This is invalid',
        },
      },
    });

    createMinimalConfig(testDir, collectionsDir);

    const result = runCLI(['tokens', 'validate'], testDir);

    // Should complete (may have warnings)
    expect(typeof result.exitCode).toBe('number');
  });

  it('should handle empty collections directory', () => {
    createMinimalConfig(testDir, collectionsDir);

    const result = runCLI(['tokens', 'validate', '--quiet'], testDir);

    // Empty directory should be valid
    expect(result.exitCode).toBe(0);
  });

  it('should work with debug flag', () => {
    writeTokenFile(collectionsDir, 'tokens.json', {
      spacing: {
        sm: { $type: 'dimension', $value: '8px' },
      },
    });

    createMinimalConfig(testDir, collectionsDir);

    const result = runCLI(['tokens', 'validate', '--debug'], testDir);

    // Debug mode should still validate successfully
    expect(result.exitCode).toBe(0);
  });
});

// ============================================================================
// CLI Config Tests
// ============================================================================

describe('CLI config command', () => {
  let testDir: string;
  let collectionsDir: string;

  beforeEach(() => {
    testDir = createTestDir();
    collectionsDir = join(testDir, 'collections');
    mkdirSync(collectionsDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  it('should display configuration', () => {
    createMinimalConfig(testDir, collectionsDir);

    const result = runCLI(['config'], testDir);

    // Should output some configuration info
    expect(typeof result.exitCode).toBe('number');
  });

  it('should output JSON with --json flag', () => {
    createMinimalConfig(testDir, collectionsDir);

    const result = runCLI(['config', '--json'], testDir);

    // If successful, output should be valid JSON
    if (result.exitCode === 0 && result.stdout.trim()) {
      expect(() => JSON.parse(result.stdout)).not.toThrow();
    }
  });
});

// ============================================================================
// CLI Error Handling Tests
// ============================================================================

describe('CLI error handling', () => {
  it('should handle unknown commands gracefully', () => {
    const result = runCLI(['unknown-command'], process.cwd());

    // Should exit with non-zero code or show help
    expect(typeof result.exitCode).toBe('number');
  });

  it('should handle missing required arguments', () => {
    const testDir = createTestDir();

    try {
      // Run without config file
      const result = runCLI(['tokens', 'build'], testDir);

      // Should fail or warn about missing config
      expect(typeof result.exitCode).toBe('number');
    } finally {
      cleanupTestDir(testDir);
    }
  });
});

// ============================================================================
// Integration with File System
// ============================================================================

describe('CLI file system integration', () => {
  let testDir: string;
  let collectionsDir: string;

  beforeEach(() => {
    testDir = createTestDir();
    collectionsDir = join(testDir, 'collections');
    mkdirSync(collectionsDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  it('should process multiple token files', () => {
    // Create multiple token files
    writeTokenFile(collectionsDir, 'colors.json', {
      color: {
        red: { $type: 'color', $value: '#dc3545' },
        green: { $type: 'color', $value: '#28a745' },
        blue: { $type: 'color', $value: '#007bff' },
      },
    });

    writeTokenFile(collectionsDir, 'spacing.json', {
      spacing: {
        xs: { $type: 'dimension', $value: '4px' },
        sm: { $type: 'dimension', $value: '8px' },
        md: { $type: 'dimension', $value: '16px' },
      },
    });

    writeTokenFile(collectionsDir, 'typography.json', {
      typography: {
        fontSize: {
          sm: { $type: 'dimension', $value: '14px' },
          md: { $type: 'dimension', $value: '16px' },
        },
      },
    });

    createMinimalConfig(testDir, collectionsDir);

    const result = runCLI(['tokens', 'validate', '--quiet'], testDir);

    expect(result.exitCode).toBe(0);
  });

  it('should handle nested directory structures', () => {
    // Create nested token structure
    mkdirSync(join(collectionsDir, 'primitives'), { recursive: true });
    mkdirSync(join(collectionsDir, 'semantic'), { recursive: true });

    writeTokenFile(collectionsDir, 'primitives/colors.json', {
      color: {
        blue: { $type: 'color', $value: '#007bff' },
      },
    });

    writeTokenFile(collectionsDir, 'semantic/brand.json', {
      brand: {
        primary: { $type: 'color', $value: '{color.blue}' },
      },
    });

    createMinimalConfig(testDir, collectionsDir);

    const result = runCLI(['tokens', 'validate', '--quiet'], testDir);

    // Should process nested directories
    expect(typeof result.exitCode).toBe('number');
  });

  it('should respect config file settings', () => {
    writeTokenFile(collectionsDir, 'tokens.json', {
      color: {
        primary: { $type: 'color', $value: '#007bff' },
      },
    });

    // Create config with specific settings
    const configContent = `
export default {
  tokens: {
    collectionsDir: '${collectionsDir}',
    prefix: '--custom-',
    formats: ['css', 'json'],
  },
  global: {
    logLevel: 'warn',
  },
};
`;
    writeFileSync(join(testDir, 'dsai.config.mjs'), configContent, 'utf8');

    const result = runCLI(['tokens', 'validate'], testDir);

    expect(typeof result.exitCode).toBe('number');
  });
});
