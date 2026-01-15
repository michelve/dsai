# API Reference

Programmatic API reference for @DSAi/tools.

## Overview

@DSAi/tools can be used both as a CLI and as a library. This section documents the programmatic API.

## Installation

```bash
npm install @dsai/tools
```

## Quick Example

```typescript
import { loadConfig, buildTokens, buildIcons } from '@dsai/tools';

// Load configuration
const { config } = await loadConfig();

// Build tokens
const tokenResult = await buildTokens(config);
console.log(`Built ${tokenResult.filesWritten} token files`);

// Build icons
const iconResult = await buildIcons(config, { formats: ['react'] });
console.log(`Generated ${iconResult.totalIcons} icons`);
```

## API Modules

- [Configuration API](./config.md) - Load and validate configuration
- [Tokens API](./tokens.md) - Build, validate, and transform tokens
- [Icons API](./icons.md) - Generate icon components

## Common Types

### ResolvedConfig

The fully resolved configuration object:

```typescript
interface ResolvedConfig {
  global: GlobalConfig;
  tokens: TokensConfig;
  icons: IconsConfig;
  hooks: HooksConfig;
  cwd: string;
  configPath: string | undefined;
}
```

### BuildResult

Result returned from build operations:

```typescript
interface BuildResult {
  success: boolean;
  filesWritten: number;
  files: string[];
  duration: number;
  errors: string[];
  warnings: string[];
}
```

### TokenValidationResult

Result from token validation:

```typescript
interface TokenValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  stats: {
    totalTokens: number;
    totalFiles: number;
  };
}
```

## Error Handling

All API functions throw typed errors:

```typescript
import { ConfigError, BuildError, ValidationError } from '@dsai/tools';

try {
  await buildTokens(config);
} catch (error) {
  if (error instanceof ConfigError) {
    console.error('Configuration error:', error.message);
  } else if (error instanceof BuildError) {
    console.error('Build error:', error.message);
  } else if (error instanceof ValidationError) {
    console.error('Validation error:', error.message);
  }
}
```

## Logging

Control logging output:

```typescript
import { setLogLevel } from '@dsai/tools';

// Options: 'debug', 'info', 'warn', 'error', 'silent'
setLogLevel('info');
```

## Next Steps

- [Configuration API](./config.md) - Load and manage configuration
- [Tokens API](./tokens.md) - Work with design tokens
- [Icons API](./icons.md) - Generate icon components
