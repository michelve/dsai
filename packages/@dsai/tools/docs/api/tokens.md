# Tokens API

API reference for token building, validation, and transformation.

## Functions

### `buildTokens`

Build tokens from source files to output formats.

```typescript
import { buildTokens, loadConfig } from '@dsai/tools';

const { config } = await loadConfig();
const result = await buildTokens(config);

console.log(`Built ${result.filesWritten} files in ${result.duration}ms`);
```

**Signature:**

```typescript
function buildTokens(config: ResolvedConfig, options?: BuildOptions): Promise<BuildResult>;
```

**Parameters:**

| Parameter         | Type             | Description               |
| ----------------- | ---------------- | ------------------------- |
| `config`          | `ResolvedConfig` | Resolved configuration    |
| `options.formats` | `string[]`       | Override output formats   |
| `options.watch`   | `boolean`        | Enable watch mode         |
| `options.clean`   | `boolean`        | Clean output before build |

**Returns:**

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

---

### `validateTokens`

Validate token files against DTCG specification.

```typescript
import { validateTokens } from '@dsai/tools';

const result = await validateTokens({
  source: ['./collections/**/*.json'],
});

if (!result.valid) {
  result.errors.forEach((err) => console.error(err.message));
}
```

**Signature:**

```typescript
function validateTokens(
  config: ValidationConfig,
  options?: ValidationOptions
): Promise<ValidationResult>;
```

**Parameters:**

| Parameter        | Type       | Description                   |
| ---------------- | ---------- | ----------------------------- |
| `config.source`  | `string[]` | Glob patterns for token files |
| `config.schema`  | `string`   | Custom schema path            |
| `options.strict` | `boolean`  | Strict validation mode        |
| `options.fix`    | `boolean`  | Attempt to fix issues         |

**Returns:**

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  stats: {
    totalTokens: number;
    totalFiles: number;
    validTokens: number;
    invalidTokens: number;
  };
}
```

---

### `transformTokens`

Transform Figma exports to DTCG token collections.

```typescript
import { transformTokens } from '@dsai/tools';

const result = transformTokens({
  sourceDir: './figma-exports',
  collectionsDir: './collections',
  verbose: true,
});

if (result.success) {
  console.log(`Transformed ${result.tokensTransformed} tokens`);
}
```

**Signature:**

```typescript
function transformTokens(options: TransformOptions): TransformResult;
```

**Parameters:**

| Parameter        | Type      | Description                  |
| ---------------- | --------- | ---------------------------- |
| `sourceDir`      | `string`  | Directory with Figma exports |
| `collectionsDir` | `string`  | Output directory for tokens  |
| `verbose`        | `boolean` | Enable verbose logging       |

**Returns:**

```typescript
interface TransformResult {
  success: boolean;
  tokensTransformed: number;
  filesCreated: number;
  errors: string[];
}
```

---

### `syncTokens`

Sync tokens to a flat TypeScript file for IDE autocomplete.

```typescript
import { syncTokensCLI } from '@dsai/tools';

const success = syncTokensCLI('./packages/tokens');
```

**Signature:**

```typescript
function syncTokensCLI(tokensDir: string): boolean;
```

**Parameters:**

| Parameter   | Type     | Description            |
| ----------- | -------- | ---------------------- |
| `tokensDir` | `string` | Path to tokens package |

**Returns:** `true` if successful, `false` otherwise.

---

### `postprocessCSS`

Post-process CSS theme files to replace selectors.

```typescript
import { postprocessCLI } from '@dsai/tools';

const success = postprocessCLI('./packages/tokens');
```

**Signature:**

```typescript
function postprocessCLI(tokensDir: string): boolean;
```

**Parameters:**

| Parameter   | Type     | Description            |
| ----------- | -------- | ---------------------- |
| `tokensDir` | `string` | Path to tokens package |

**Returns:** `true` if successful, `false` otherwise.

---

### `mergeTokenCollections`

Merge multiple token collections into one.

```typescript
import { mergeTokenCollections } from '@dsai/tools';

const merged = mergeTokenCollections(['./collections/color.json', './collections/typography.json']);
```

**Signature:**

```typescript
function mergeTokenCollections(files: string[], options?: MergeOptions): TokenCollection;
```

**Parameters:**

| Parameter             | Type       | Description              |
| --------------------- | ---------- | ------------------------ |
| `files`               | `string[]` | Token files to merge     |
| `options.resolveRefs` | `boolean`  | Resolve token references |
| `options.flatten`     | `boolean`  | Flatten nested structure |

**Returns:** Merged token collection object.

---

## Types

### Token

```typescript
interface Token {
  $value: TokenValue;
  $type?: TokenType;
  $description?: string;
  $extensions?: Record<string, unknown>;
}

type TokenValue = string | number | TokenReference | CompositeValue;
type TokenReference = `{${string}}`;
type TokenType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'strokeStyle'
  | 'border'
  | 'transition'
  | 'shadow'
  | 'gradient'
  | 'typography';
```

### TokenCollection

```typescript
interface TokenCollection {
  [key: string]: Token | TokenCollection;
}
```

### ValidationError

```typescript
interface ValidationError {
  path: string;
  message: string;
  token?: Token;
  file?: string;
  line?: number;
}
```

---

## Error Handling

```typescript
import { buildTokens, BuildError, ValidationError } from '@dsai/tools';

try {
  await buildTokens(config);
} catch (error) {
  if (error instanceof BuildError) {
    console.error('Build failed:', error.message);
    error.errors.forEach((e) => console.error(' -', e));
  }
}
```

---

## Style Dictionary Integration

Access Style Dictionary directly:

```typescript
import { getStyleDictionary } from '@dsai/tools';

const sd = await getStyleDictionary(config);

// Access SD instance
sd.registerTransform({
  name: 'custom/transform',
  type: 'value',
  transform: (token) => token.value.toUpperCase(),
});

await sd.buildAllPlatforms();
```
