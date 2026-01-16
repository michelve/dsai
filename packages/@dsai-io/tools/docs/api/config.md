# Configuration API

API reference for configuration loading and management.

## Functions

### `defineConfig`

Type-safe configuration helper.

```typescript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    prefix: '--myapp-',
  },
});
```

**Signature:**

```typescript
function defineConfig(config: DsaiConfig): DsaiConfig;
```

**Parameters:**

| Parameter | Type         | Description          |
| --------- | ------------ | -------------------- |
| `config`  | `DsaiConfig` | Configuration object |

**Returns:** The same config object with type inference.

---

### `loadConfig`

Load configuration from the filesystem.

```typescript
import { loadConfig } from '@dsai-io/tools';

const { config, filepath } = await loadConfig();
console.log('Loaded from:', filepath);
```

**Signature:**

```typescript
function loadConfig(options?: LoadConfigOptions): Promise<LoadConfigResult>;
```

**Parameters:**

| Parameter            | Type     | Description                    |
| -------------------- | -------- | ------------------------------ |
| `options.cwd`        | `string` | Working directory (default: .) |
| `options.configPath` | `string` | Explicit config file path      |

**Returns:**

```typescript
interface LoadConfigResult {
  config: ResolvedConfig;
  filepath: string | undefined;
}
```

**Example:**

```typescript
// Load from current directory
const { config } = await loadConfig();

// Load from specific directory
const { config } = await loadConfig({ cwd: '/path/to/project' });

// Load specific file
const { config } = await loadConfig({ configPath: './custom.config.mjs' });
```

---

### `validateConfig`

Validate a configuration object against the schema.

```typescript
import { validateConfig } from '@dsai-io/tools';

const result = validateConfig(myConfig);
if (!result.valid) {
  console.error('Errors:', result.errors);
}
```

**Signature:**

```typescript
function validateConfig(config: unknown): ValidationResult;
```

**Parameters:**

| Parameter | Type      | Description               |
| --------- | --------- | ------------------------- |
| `config`  | `unknown` | Configuration to validate |

**Returns:**

```typescript
interface ValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string;
  }>;
}
```

---

### `resolveConfig`

Resolve a partial config with defaults.

```typescript
import { resolveConfig } from '@dsai-io/tools';

const fullConfig = resolveConfig(partialConfig);
```

**Signature:**

```typescript
function resolveConfig(config: Partial<DsaiConfig>): ResolvedConfig;
```

**Parameters:**

| Parameter | Type                  | Description           |
| --------- | --------------------- | --------------------- |
| `config`  | `Partial<DsaiConfig>` | Partial configuration |

**Returns:** Fully resolved configuration with all defaults applied.

---

### `mergeConfigs`

Merge multiple configuration objects.

```typescript
import { mergeConfigs } from '@dsai-io/tools';

const merged = mergeConfigs(baseConfig, overrideConfig);
```

**Signature:**

```typescript
function mergeConfigs(...configs: Partial<DsaiConfig>[]): DsaiConfig;
```

**Parameters:**

| Parameter    | Type                    | Description                   |
| ------------ | ----------------------- | ----------------------------- |
| `...configs` | `Partial<DsaiConfig>[]` | Configs to merge (later wins) |

**Returns:** Merged configuration object.

---

## Types

### DsaiConfig

```typescript
interface DsaiConfig {
  extends?: string;
  global?: GlobalConfig;
  tokens?: TokensConfig;
  icons?: IconsConfig;
  hooks?: HooksConfig;
}
```

### GlobalConfig

```typescript
interface GlobalConfig {
  debug?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
}
```

### ResolvedConfig

```typescript
interface ResolvedConfig {
  global: Required<GlobalConfig>;
  tokens: Required<TokensConfig>;
  icons: Required<IconsConfig>;
  hooks: HooksConfig;
  cwd: string;
  configPath: string | undefined;
}
```

## Error Handling

```typescript
import { loadConfig, ConfigError } from '@dsai-io/tools';

try {
  const { config } = await loadConfig();
} catch (error) {
  if (error instanceof ConfigError) {
    console.error('Config error:', error.message);
    console.error('Path:', error.configPath);
  }
}
```

## Environment Variables

Configuration can be overridden via environment variables:

| Variable          | Config Path        |
| ----------------- | ------------------ |
| `DSAI_DEBUG`      | `global.debug`     |
| `DSAI_PREFIX`     | `tokens.prefix`    |
| `DSAI_OUTPUT_DIR` | `tokens.outputDir` |
| `DSAI_SOURCE_DIR` | `tokens.sourceDir` |
