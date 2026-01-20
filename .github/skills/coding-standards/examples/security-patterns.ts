/**
 * Security Patterns - Code Examples
 *
 * Enterprise-level security patterns for DSAi codebase.
 * These examples demonstrate safe coding practices.
 */

// =============================================================================
// SAFE DYNAMIC PROPERTY ACCESS
// =============================================================================

// ❌ FORBIDDEN - Object Injection Sink
// const value = obj[dynamicKey];
// obj[dynamicKey] = newValue;
// const item = array[dynamicIndex];

// ✅ SAFE - Use Reflect.get for reads
function safePropertyRead<T>(obj: Record<string, T>, key: string): T | undefined {
  return Reflect.get(obj, key) as T | undefined;
}

// ✅ SAFE - Use Object.defineProperty for writes
function safePropertyWrite<T>(obj: Record<string, T>, key: string, value: T): void {
  Object.defineProperty(obj, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

// ✅ SAFE - Use Map for dynamic key-value storage
function createSafeStore<V>(): {
  get: (key: string) => V | undefined;
  set: (key: string, value: V) => void;
} {
  const store = new Map<string, V>();
  return {
    get: (key: string) => store.get(key),
    set: (key: string, value: V) => store.set(key, value),
  };
}

// ✅ SAFE - Use .at() for array access
function safeArrayAccess<T>(arr: T[], index: number): T | undefined {
  return arr.at(index);
}

// ✅ SAFE - Use for...of instead of indexed loops
function processItems<T>(items: T[], processor: (item: T) => void): void {
  for (const item of items) {
    processor(item);
  }
}

// ✅ SAFE - Process all but last item
function processAllButLast<T>(items: T[], processor: (item: T) => void): void {
  const allButLast = items.slice(0, -1);
  for (const item of allButLast) {
    processor(item);
  }
}

// =============================================================================
// PROTOTYPE POLLUTION PREVENTION
// =============================================================================

const FORBIDDEN_KEYS = ['__proto__', 'constructor', 'prototype'] as const;
type ForbiddenKey = (typeof FORBIDDEN_KEYS)[number];

function isSafeKey(key: string): boolean {
  return !FORBIDDEN_KEYS.includes(key as ForbiddenKey);
}

function safeAssign<T>(obj: Record<string, T>, key: string, value: T): boolean {
  if (!isSafeKey(key)) {
    return false;
  }
  Object.defineProperty(obj, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  return true;
}

// =============================================================================
// REGEX SAFETY (ReDoS Prevention)
// =============================================================================

// ❌ DANGEROUS - Exponential backtracking possible
// const unsafeRegex = /^(.+?)(?:\s*\n)?((?:[A-Z][a-z]+)+)$/s;

// ✅ SAFE - Simple, non-backtracking patterns
const SAFE_METADATA_PATTERN = /[A-Z][a-z]+\.[A-Z][a-zA-Z]+:\s*[^•]+/g;

// ✅ SAFE - Break complex patterns into multiple simple steps
function parseMetadataSafely(line: string): Array<{ key: string; value: string }> {
  const results: Array<{ key: string; value: string }> = [];
  const pairs = line.split(/\s*•\s*/);

  for (const pair of pairs) {
    const match = pair.match(/^([A-Z][a-z]+)\.([A-Z][a-zA-Z]+):\s*(.+)$/);
    if (match?.[1] && match[2] && match[3]) {
      results.push({ key: `${match[1]}.${match[2]}`, value: match[3] });
    }
  }

  return results;
}

// =============================================================================
// INPUT VALIDATION & SANITIZATION
// =============================================================================

// ✅ Type guard for runtime validation
interface ConfigType {
  requiredField: string;
  optionalField?: number;
}

function isValidConfig(input: unknown): input is ConfigType {
  return (
    typeof input === 'object' &&
    input !== null &&
    'requiredField' in input &&
    typeof (input as ConfigType).requiredField === 'string'
  );
}

// ✅ Sanitize file paths
function sanitizePath(userPath: string): string {
  return userPath
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/[<>:"|?*]/g, '') // Remove invalid chars
    .normalize('NFC'); // Unicode normalization
}

// ✅ Validate against allowlists, not blocklists
const ALLOWED_EXTENSIONS = ['.json', '.ts', '.tsx', '.js', '.mjs'] as const;

function isAllowedFile(filename: string): boolean {
  return ALLOWED_EXTENSIONS.some((ext) => filename.endsWith(ext));
}

// =============================================================================
// ENVIRONMENT VARIABLES & SECRETS
// =============================================================================

// ✅ Access env vars safely with Reflect.get
function getEnvVar(name: string, fallback = ''): string {
  return (Reflect.get(process.env, name) as string | undefined) ?? fallback;
}

// ✅ Environment-specific validation
function validateProductionEnv(): void {
  if (process.env['NODE_ENV'] === 'production') {
    const requiredVars = ['API_KEY', 'DATABASE_URL'];
    for (const varName of requiredVars) {
      if (!Reflect.get(process.env, varName)) {
        throw new Error(`${varName} required in production`);
      }
    }
  }
}

// =============================================================================
// NULL SAFETY PATTERNS
// =============================================================================

// ✅ Assertion function for runtime checks
function assertDefined<T>(value: T | null | undefined, name: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${name} must be defined`);
  }
}

// ✅ Use nullish coalescing and optional chaining
interface NestedConfig {
  level1?: {
    level2?: {
      value?: string;
    };
  };
}

function getNestedValue(config: NestedConfig, defaultValue: string): string {
  return config?.level1?.level2?.value ?? defaultValue;
}

export {
  safePropertyRead,
  safePropertyWrite,
  createSafeStore,
  safeArrayAccess,
  processItems,
  processAllButLast,
  isSafeKey,
  safeAssign,
  SAFE_METADATA_PATTERN,
  parseMetadataSafely,
  isValidConfig,
  sanitizePath,
  isAllowedFile,
  getEnvVar,
  validateProductionEnv,
  assertDefined,
  getNestedValue,
};
