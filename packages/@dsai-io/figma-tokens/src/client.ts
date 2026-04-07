/**
 * @file Figma API Client
 * @description REST API client for Figma integration with support for
 * variables, components, and token synchronization.
 *
 * @example Basic usage
 * ```ts
 * import { FigmaClient } from '@dsai-io/figma-tokens/client';
 *
 * const client = new FigmaClient({
 *   accessToken: process.env.FIGMA_TOKEN!,
 * });
 *
 * // Get file information
 * const file = await client.getFile('file-key');
 *
 * // Get variables
 * const variables = await client.getVariables('file-key');
 * ```
 *
 * @packageDocumentation
 */

import { CircuitBreaker } from '@dsai-io/tools/utils/circuit-breaker';

import { RateLimiter } from './rate-limiter.js';

import type {
  FigmaClientConfig,
  FigmaFile,
  FigmaNode,
  FigmaApiError,
  FigmaVariablesResponse,
  FigmaVariable,
  FigmaColor,
  FigmaVariableAlias,
  ExportTokensOptions,
  ExportTokensResult,
  ExportedFile,
  SyncFigmaOptions,
  SyncFigmaResult,
  SyncConflict,
  ExtendedExportOptions,
  TokenExtensions,
  TokenCategory,
  FigmaPostVariablesRequest,
  FigmaPostVariablesResponse,
  FigmaPaginatedResponse,
  FigmaComponentActionByComponent,
  FigmaActionByTeam,
  FigmaComponentUsageByComponent,
  FigmaUsageByFile,
  FigmaStyleActionByStyle,
  FigmaStyleUsageByStyle,
  FigmaVariableActionByVariable,
  FigmaVariableUsageByVariable,
  FigmaAnalyticsActionsOptions,
  FigmaAnalyticsUsagesOptions,
  FigmaUser,
  FigmaPublishedComponent,
  FigmaPublishedComponentSet,
  FigmaPublishedStyle,
  FigmaVersionsResponse,
  FigmaFileMetadata,
} from './types.js';

// ============================================================================
// Constants
// ============================================================================

/** Default Figma API base URL */
const DEFAULT_BASE_URL = 'https://api.figma.com';

/** Default request timeout (30 seconds) */
const DEFAULT_TIMEOUT = 30_000;

/** Default retry count */
const DEFAULT_RETRIES = 3;

/** API version */
const API_VERSION = 'v1';

/** Maximum value for 8-bit unsigned integer */
const MAX_UINT8 = 255;

/** HTTP 403 Forbidden */
const HTTP_FORBIDDEN = 403;

/** HTTP 404 Not Found */
const HTTP_NOT_FOUND = 404;

/** HTTP 429 Too Many Requests */
const HTTP_TOO_MANY_REQUESTS = 429;

/** HTTP 500+ Server Error threshold */
const HTTP_SERVER_ERROR_THRESHOLD = 500;

// ============================================================================
// Font Detection Patterns (inspired by Figma SDS)
// ============================================================================

/** Pattern to detect font weight variables */
const FONT_WEIGHT_PATTERN = /\/?weight/i;

/** Pattern to detect font family variables */
const FONT_FAMILY_PATTERN = /\/?family/i;

/** Pattern to detect font size variables */
const FONT_SIZE_PATTERN = /\/?size|fontSize/i;

/** Pattern to detect line height variables */
const LINE_HEIGHT_PATTERN = /\/?lineHeight|line-height/i;

/** Pattern to detect letter spacing variables */
const LETTER_SPACING_PATTERN = /\/?letterSpacing|letter-spacing|tracking/i;

// ============================================================================
// Description Metadata Parser
// ============================================================================

/**
 * Parsed description result with clean description and structured metadata
 */
interface ParsedDescription {
  /** Clean description without metadata */
  description: string;
  /** Structured metadata extracted from description */
  metadata?: {
    docs?: Record<string, string>;
    platform?: Record<string, string>;
    [key: string]: Record<string, string> | undefined;
  };
}

/**
 * Parse Figma description to extract structured metadata
 *
 * Figma descriptions may contain metadata in format:
 * ```
 * Main description text here.
 *
 * Docs.Reference: https://... • Docs.Section: Customization • Platform.ScssVariableName: $var
 * ```
 *
 * This function extracts the metadata into a structured object.
 */
function parseDescription(description: string | undefined): ParsedDescription {
  if (!description) {
    return { description: '' };
  }

  // Split by double newline to separate description from metadata
  const parts = description.split(/\n\n+/);

  if (parts.length === 1) {
    // No metadata section, check if metadata is in the same line
    // Use a simpler pattern to avoid exponential backtracking (unsafe regex)
    const metadataPattern = /[A-Z][a-z]+\.[A-Z][a-zA-Z]+:\s*[^•]+/g;
    const metadataMatches = description.match(metadataPattern);
    if (metadataMatches && metadataMatches.length > 0) {
      // Find where metadata starts
      const firstMatch = metadataMatches[0];
      const metadataIndex = firstMatch ? description.indexOf(firstMatch) : -1;
      if (metadataIndex > 0) {
        const descPart = description.slice(0, metadataIndex).trim();
        const metaPart = description.slice(metadataIndex);
        return {
          description: descPart,
          metadata: parseMetadataLine(metaPart),
        };
      }
    }
    return { description: description.trim() };
  }

  // First part is the description, rest may contain metadata
  const mainDescription = parts[0]?.trim() ?? '';
  const metadataParts = parts.slice(1).join('\n\n');

  // Check if remaining parts contain structured metadata (Key.SubKey: value format)
  if (/[A-Z][a-z]+\.[A-Z][a-zA-Z]+:/.test(metadataParts)) {
    const metadata = parseMetadataLine(metadataParts);
    return {
      description: mainDescription,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    };
  }

  // No structured metadata found, return full description
  return { description: description.trim() };
}

/**
 * Parse a metadata line in format: "Key.SubKey: value • Key.SubKey: value"
 */
function parseMetadataLine(line: string): Record<string, Record<string, string>> {
  // Use Map for safe key-value storage (avoid Object Injection Sink)
  const resultMap = new Map<string, Map<string, string>>();

  // Split by bullet separator
  const pairs = line.split(/\s*•\s*/);

  for (const pair of pairs) {
    // Match Key.SubKey: value format
    const match = /^([A-Z][a-z]+)\.([A-Z][a-zA-Z]+):\s*(\S.*)$/.exec(pair);
    if (match?.[1] && match[2] && match[3]) {
      const category = match[1].toLowerCase();
      // Convert PascalCase to camelCase for the key
      const key = match[2].charAt(0).toLowerCase() + match[2].slice(1);
      const value = match[3].trim();

      if (!resultMap.has(category)) {
        resultMap.set(category, new Map<string, string>());
      }
      resultMap.get(category)?.set(key, value);
    }
  }

  // Convert Map back to Record for return type compatibility
  const result: Record<string, Record<string, string>> = {};
  for (const [category, innerMap] of resultMap) {
    Object.defineProperty(result, category, {
      value: Object.fromEntries(innerMap),
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  return result;
}

// ============================================================================
// Token Transformation Helpers
// ============================================================================

const FONT_PATTERN_RULES: Array<{
  resolvedType: string;
  pattern: RegExp;
  result: { type: string; category: TokenCategory };
}> = [
  { resolvedType: 'FLOAT', pattern: FONT_WEIGHT_PATTERN, result: { type: 'fontWeight', category: 'fontWeight' } },
  { resolvedType: 'STRING', pattern: FONT_FAMILY_PATTERN, result: { type: 'fontFamily', category: 'fontFamily' } },
  { resolvedType: 'FLOAT', pattern: FONT_SIZE_PATTERN, result: { type: 'dimension', category: 'fontSize' } },
  { resolvedType: 'FLOAT', pattern: LINE_HEIGHT_PATTERN, result: { type: 'number', category: 'lineHeight' } },
  { resolvedType: 'FLOAT', pattern: LETTER_SPACING_PATTERN, result: { type: 'dimension', category: 'letterSpacing' } },
];

const DEFAULT_TYPE_MAP: Record<string, { type: string; category?: TokenCategory }> = {
  COLOR: { type: 'color', category: 'color' },
  FLOAT: { type: 'number' },
  STRING: { type: 'string' },
  BOOLEAN: { type: 'boolean' },
};

function detectTokenType(
  name: string,
  resolvedType: string
): { type: string; category?: TokenCategory } {
  for (const rule of FONT_PATTERN_RULES) {
    if (resolvedType === rule.resolvedType && rule.pattern.test(name)) {
      return rule.result;
    }
  }

  return Reflect.get(DEFAULT_TYPE_MAP, resolvedType) ?? { type: 'string' };
}

/**
 * Convert Figma color (0-1 range) to hex string
 */
function figmaColorToHex(color: FigmaColor): string {
  const toHex = (value: number): string => {
    const hex = Math.round(value * MAX_UINT8).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  const hex = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;

  // Include alpha if not fully opaque
  if (color.a < 1) {
    return `${hex}${toHex(color.a)}`;
  }

  return hex;
}

/**
 * Check if a value is a Figma color object
 */
function isFigmaColor(value: unknown): value is FigmaColor {
  return (
    typeof value === 'object' &&
    value !== null &&
    'r' in value &&
    'g' in value &&
    'b' in value &&
    'a' in value
  );
}

/**
 * Check if a value is a variable alias
 */
function isVariableAlias(value: unknown): value is FigmaVariableAlias {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    value.type === 'VARIABLE_ALIAS'
  );
}

/**
 * Convert a variable name to a token path
 * e.g., "colors/brand/primary" -> ["colors", "brand", "primary"]
 */
function variableNameToPath(name: string): string[] {
  return name.split('/').map((part) => part.trim());
}

const POLLUTION_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function isSafeKey(key: string | undefined): key is string {
  return key !== undefined && !POLLUTION_KEYS.has(key);
}

function defineEnumerableProperty(
  target: Record<string, unknown>,
  key: string,
  value: unknown
): void {
  Object.defineProperty(target, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

/* eslint-disable security/detect-object-injection */
function setNestedValue(obj: Record<string, unknown>, path: string[], value: unknown): void {
  const hasOwn = Object.prototype.hasOwnProperty;

  if (path.length === 0) {
    return;
  }

  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!isSafeKey(key)) {
      continue;
    }
    const existing = hasOwn.call(current, key) ? current[key] : undefined;
    if (typeof existing !== 'object' || existing === null) {
      defineEnumerableProperty(current, key, {});
    }
    current = current[key] as Record<string, unknown>;
  }

  const lastKey = path[path.length - 1];
  if (isSafeKey(lastKey)) {
    defineEnumerableProperty(current, lastKey, value);
  }
}
/* eslint-enable security/detect-object-injection */

// ============================================================================
// Error Classes
// ============================================================================

/**
 * Error thrown when Figma API requests fail
 */
export class FigmaClientError extends Error {
  /** HTTP status code */
  readonly status: number;

  /** Error code from API */
  readonly code?: string;

  /** Request ID for debugging */
  readonly requestId?: string;

  /** Hint for resolving the error */
  readonly hint?: string;

  constructor(message: string, status: number, code?: string, requestId?: string, hint?: string) {
    super(message);
    this.name = 'FigmaClientError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.hint = hint;
  }

  /**
   * Create error from API response with contextual hints
   */
  static fromApiError(error: FigmaApiError, endpoint?: string): FigmaClientError {
    let hint: string | undefined;

    // Add helpful hints based on error status and endpoint
    if (error.status === HTTP_FORBIDDEN) {
      if (endpoint?.includes('/variables')) {
        hint =
          '⚠️  The Variables API requires a Figma Enterprise plan.\n' +
          '   See: https://developers.figma.com/docs/rest-api/variables/\n' +
          '\n' +
          '   Alternatives for Professional/Free plans:\n' +
          '   • Use the Tokens Studio plugin to export variables manually\n' +
          '   • Use the Styles API (colors, text styles, effects)\n' +
          '   • Export tokens via Figma Plugin API (desktop app)';
      } else {
        hint =
          '⚠️  Access denied. Check that:\n' +
          '   • Your token has the required scopes (file_content:read, etc.)\n' +
          '   • You have access to this file in Figma';
      }
    } else if (error.status === HTTP_NOT_FOUND) {
      hint =
        '⚠️  File not found. Check that:\n' +
        '   • The file key is correct (from the Figma URL)\n' +
        '   • The file has not been deleted or moved';
    } else if (error.status === HTTP_TOO_MANY_REQUESTS) {
      hint = '⚠️  Rate limited. Wait a moment and try again.';
    }

    return new FigmaClientError(error.err, error.status, error.code, error.requestId, hint);
  }

  /**
   * Get formatted error message with hint
   */
  toDetailedMessage(): string {
    let message = this.message;
    if (this.requestId) {
      message += ` (Request ID: ${this.requestId})`;
    }
    if (this.hint) {
      message += `\n\n${this.hint}`;
    }
    return message;
  }
}

/**
 * Error thrown when client is not configured
 */
export class FigmaConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FigmaConfigError';
  }
}

// ============================================================================
// Client Implementation
// ============================================================================

/**
 * Figma REST API client
 *
 * Provides access to Figma files, components, styles, and variables
 * for design token synchronization.
 *
 * @example
 * ```ts
 * const client = new FigmaClient({
 *   accessToken: 'your-figma-token',
 *   timeout: 60000, // 60 second timeout
 * });
 *
 * const file = await client.getFile('abc123');
 * console.log(file.name); // "Design System"
 * ```
 */
export class FigmaClient {
  private readonly config: Required<FigmaClientConfig>;
  private readonly isConfigured: boolean;
  private readonly circuitBreaker: CircuitBreaker;
  private readonly rateLimiter: RateLimiter;

  constructor(config?: FigmaClientConfig) {
    // Check if client is properly configured
    this.isConfigured = Boolean(config?.accessToken);

    // Set defaults for all config options
    this.config = {
      accessToken: config?.accessToken ?? '',
      baseUrl: config?.baseUrl ?? DEFAULT_BASE_URL,
      timeout: config?.timeout ?? DEFAULT_TIMEOUT,
      retries: config?.retries ?? DEFAULT_RETRIES,
      cache: config?.cache ?? true,
      headers: config?.headers ?? {},
    };

    // Initialize error recovery components
    this.circuitBreaker = new CircuitBreaker({
      name: 'FigmaAPI',
      failureThreshold: 5,
      cooldownMs: 60000, // 1 minute cooldown
      timeout: this.config.timeout,
    });

    this.rateLimiter = new RateLimiter({
      throttleThreshold: 0.2, // Slow down at 20% remaining
      throttleDelay: 2000, // 2s delay when throttling
      criticalThreshold: 0.1, // Critical at 10% remaining
      criticalDelay: 5000, // 5s delay when critical
    });
  }

  // ==========================================================================
  // Private Helpers
  // ==========================================================================

  /**
   * Check if client is configured
   */
  private ensureConfigured(): void {
    if (!this.isConfigured) {
      throw new FigmaConfigError(
        'Figma client not configured. Please provide an access token. ' +
          'Get one at: https://www.figma.com/developers/api#access-tokens'
      );
    }
  }

  /**
   * Build API endpoint URL
   */
  private buildUrl(endpoint: string): string {
    return `${this.config.baseUrl}/${API_VERSION}${endpoint}`;
  }

  /**
   * Build request headers
   */
  private buildHeaders(): Record<string, string> {
    return {
      'X-Figma-Token': this.config.accessToken,
      'Content-Type': 'application/json',
      ...this.config.headers,
    };
  }

  /**
   * Build query string for analytics endpoints
   */
  private buildAnalyticsQuery(groupBy: string, options?: FigmaAnalyticsActionsOptions): string {
    const params = new URLSearchParams();
    params.set('group_by', groupBy);

    if (options?.startDate) {
      params.set('start_date', options.startDate);
    }
    if (options?.endDate) {
      params.set('end_date', options.endDate);
    }
    if (options?.cursor) {
      params.set('cursor', options.cursor);
    }

    return params.toString();
  }

  private logRateLimitWarnings(): void {
    if (this.rateLimiter.isCritical()) {
      console.warn(
        '⚠️  Figma API rate limit critically low (%d%% remaining)',
        Math.round(this.rateLimiter.getRatio() * 100)
      );
      const timeUntilReset = this.rateLimiter.getTimeUntilReset();
      if (timeUntilReset > 0) {
        console.warn('   Rate limit resets in %d seconds', Math.round(timeUntilReset / 1000));
      }
    } else if (this.rateLimiter.shouldThrottle()) {
      console.warn(
        'ℹ️  Throttling Figma API requests (%d%% remaining)',
        Math.round(this.rateLimiter.getRatio() * 100)
      );
    }
  }

  private isNonRetryableError(error: unknown): boolean {
    if (error instanceof FigmaClientError && error.status < HTTP_SERVER_ERROR_THRESHOLD) {
      return true;
    }
    return error instanceof FigmaConfigError;
  }

  private async attemptRequest<T>(
    url: string,
    headers: Record<string, string>,
    options: RequestInit,
    endpoint: string
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    this.rateLimiter.updateFromHeaders(response.headers);

    if (!response.ok) {
      const errorBody = (await response.json()) as FigmaApiError;
      throw FigmaClientError.fromApiError(
        {
          status: response.status,
          err: errorBody.err ?? response.statusText,
          code: errorBody.code,
          requestId: response.headers.get('x-request-id') ?? undefined,
        },
        endpoint
      );
    }

    return (await response.json()) as T;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    this.ensureConfigured();

    return this.circuitBreaker.execute(async () => {
      await this.rateLimiter.wait();
      this.logRateLimitWarnings();

      const url = this.buildUrl(endpoint);
      const headers = this.buildHeaders();
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= this.config.retries; attempt++) {
        try {
          return await this.attemptRequest<T>(url, headers, options, endpoint);
        } catch (error) {
          lastError = error as Error;

          if (this.isNonRetryableError(error)) {
            throw error;
          }

          if (attempt < this.config.retries) {
            await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
          }
        }
      }

      throw lastError ?? new Error('Request failed after retries');
    });
  }

  // ==========================================================================
  // Public API
  // ==========================================================================

  /**
   * Check if the client is properly configured
   */
  public isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Get Figma file information
   *
   * @param fileKey - The Figma file key (from URL)
   * @param options - Optional request options
   * @returns File information including components and styles
   *
   * @example
   * ```ts
   * const file = await client.getFile('abc123');
   * console.log(file.name);
   * console.log(Object.keys(file.components).length);
   * ```
   */
  public async getFile(
    fileKey: string,
    options?: { geometry?: 'paths'; depth?: number }
  ): Promise<FigmaFile> {
    const params = new URLSearchParams();
    if (options?.geometry) {
      params.set('geometry', options.geometry);
    }
    if (options?.depth !== undefined) {
      params.set('depth', String(options.depth));
    }

    const query = params.toString();
    const queryString = query ? '?' + query : '';
    const endpoint = `/files/${fileKey}${queryString}`;

    return this.request<FigmaFile>(endpoint);
  }

  /**
   * Get variables and variable collections from a file
   *
   * @param fileKey - The Figma file key
   * @returns Variables and collections
   *
   * @example
   * ```ts
   * const { variables, variableCollections } = await client.getVariables('abc123');
   *
   * for (const [id, variable] of Object.entries(variables)) {
   *   console.log(`${variable.name}: ${variable.resolvedType}`);
   * }
   * ```
   */
  public async getVariables(fileKey: string): Promise<FigmaVariablesResponse> {
    const response = await this.request<{ meta?: FigmaVariablesResponse } & FigmaVariablesResponse>(
      `/files/${fileKey}/variables/local`
    );

    // Handle both direct response and meta-wrapped response formats
    const data = response.meta ?? response;

    return {
      variables: data.variables ?? {},
      variableCollections: data.variableCollections ?? {},
    };
  }

  /**
   * Get published variables from a file
   *
   * @param fileKey - The Figma file key
   * @returns Published variables and collections
   */
  public async getPublishedVariables(fileKey: string): Promise<FigmaVariablesResponse> {
    const response = await this.request<{ meta?: FigmaVariablesResponse } & FigmaVariablesResponse>(
      `/files/${fileKey}/variables/published`
    );

    // Handle both direct response and meta-wrapped response formats
    const data = response.meta ?? response;

    return {
      variables: data.variables ?? {},
      variableCollections: data.variableCollections ?? {},
    };
  }

  /**
   * Create, update, and delete variables, collections, modes, and mode values
   *
   * This is an atomic operation — if any change fails validation,
   * the entire request is rolled back.
   *
   * Temporary IDs can be used in `id` fields to cross-reference
   * objects created within the same request. The response maps
   * temporary IDs to their real Figma IDs.
   *
   * @param fileKey - The Figma file key
   * @param request - The changes to apply
   * @returns Response with temp-to-real ID mapping
   *
   * @remarks
   * - Requires Figma Enterprise plan
   * - Requires `file_variables:write` scope on the access token
   * - Requires edit access to the file
   * - Request body must be under 4MB
   *
   * @see https://developers.figma.com/docs/rest-api/variables-endpoints/
   *
   * @example Create a collection with a variable
   * ```ts
   * const result = await client.postVariables('abc123', {
   *   variableCollections: [
   *     { action: 'CREATE', id: 'temp-coll', name: 'Spacing' },
   *   ],
   *   variables: [
   *     {
   *       action: 'CREATE',
   *       id: 'temp-var',
   *       name: 'spacing/sm',
   *       variableCollectionId: 'temp-coll',
   *       resolvedType: 'FLOAT',
   *     },
   *   ],
   *   variableModeValues: [
   *     { variableId: 'temp-var', modeId: 'temp-coll', value: 8 },
   *   ],
   * });
   *
   * console.log(result.meta.tempIdToRealId);
   * // { 'temp-coll': 'VariableCollectionId:5:0', 'temp-var': 'VariableID:5:1' }
   * ```
   *
   * @example Update an existing variable
   * ```ts
   * await client.postVariables('abc123', {
   *   variables: [
   *     {
   *       action: 'UPDATE',
   *       id: 'VariableID:1:1',
   *       description: 'Updated via REST API',
   *     },
   *   ],
   * });
   * ```
   *
   * @example Delete a variable
   * ```ts
   * await client.postVariables('abc123', {
   *   variables: [
   *     { action: 'DELETE', id: 'VariableID:1:1' },
   *   ],
   * });
   * ```
   */
  public async postVariables(
    fileKey: string,
    request: FigmaPostVariablesRequest
  ): Promise<FigmaPostVariablesResponse> {
    return this.request<FigmaPostVariablesResponse>(`/files/${fileKey}/variables`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // ==========================================================================
  // Library Analytics API
  // ==========================================================================

  /**
   * Get component insertion and detachment actions for a library
   *
   * @param libraryFileKey - File key of the library
   * @param groupBy - Group results by `component` or `team`
   * @param options - Date range and pagination options
   * @returns Paginated analytics rows
   *
   * @remarks
   * - Requires `library_analytics:read` scope
   * - Data available for up to one year
   * - Dates are rounded to week boundaries
   *
   * @see https://developers.figma.com/docs/rest-api/library-analytics-endpoints/
   *
   * @example
   * ```ts
   * const page1 = await client.getComponentActions('lib-key', 'component', {
   *   startDate: '2026-01-01',
   *   endDate: '2026-03-29',
   * });
   *
   * for (const row of page1.rows) {
   *   console.log(`${row.component_name}: ${row.insertions} insertions`);
   * }
   *
   * if (page1.next_page) {
   *   const page2 = await client.getComponentActions('lib-key', 'component', {
   *     cursor: page1.cursor,
   *   });
   * }
   * ```
   */
  public async getComponentActions<G extends 'component' | 'team'>(
    libraryFileKey: string,
    groupBy: G,
    options?: FigmaAnalyticsActionsOptions
  ): Promise<
    FigmaPaginatedResponse<
      G extends 'component' ? FigmaComponentActionByComponent : FigmaActionByTeam
    >
  > {
    const query = this.buildAnalyticsQuery(groupBy, options);
    return this.request(`/analytics/libraries/${libraryFileKey}/component/actions?${query}`);
  }

  /**
   * Get current component usage counts for a library
   *
   * @param libraryFileKey - File key of the library
   * @param groupBy - Group results by `component` or `file`
   * @param options - Pagination options
   * @returns Paginated usage rows
   *
   * @see https://developers.figma.com/docs/rest-api/library-analytics-endpoints/
   */
  public async getComponentUsages<G extends 'component' | 'file'>(
    libraryFileKey: string,
    groupBy: G,
    options?: FigmaAnalyticsUsagesOptions
  ): Promise<
    FigmaPaginatedResponse<
      G extends 'component' ? FigmaComponentUsageByComponent : FigmaUsageByFile
    >
  > {
    const query = this.buildAnalyticsQuery(groupBy, options);
    return this.request(`/analytics/libraries/${libraryFileKey}/component/usages?${query}`);
  }

  /**
   * Get style insertion and detachment actions for a library
   *
   * @param libraryFileKey - File key of the library
   * @param groupBy - Group results by `style` or `team`
   * @param options - Date range and pagination options
   * @returns Paginated analytics rows
   *
   * @see https://developers.figma.com/docs/rest-api/library-analytics-endpoints/
   */
  public async getStyleActions<G extends 'style' | 'team'>(
    libraryFileKey: string,
    groupBy: G,
    options?: FigmaAnalyticsActionsOptions
  ): Promise<
    FigmaPaginatedResponse<G extends 'style' ? FigmaStyleActionByStyle : FigmaActionByTeam>
  > {
    const query = this.buildAnalyticsQuery(groupBy, options);
    return this.request(`/analytics/libraries/${libraryFileKey}/style/actions?${query}`);
  }

  /**
   * Get current style usage counts for a library
   *
   * @param libraryFileKey - File key of the library
   * @param groupBy - Group results by `style` or `file`
   * @param options - Pagination options
   * @returns Paginated usage rows
   *
   * @see https://developers.figma.com/docs/rest-api/library-analytics-endpoints/
   */
  public async getStyleUsages<G extends 'style' | 'file'>(
    libraryFileKey: string,
    groupBy: G,
    options?: FigmaAnalyticsUsagesOptions
  ): Promise<
    FigmaPaginatedResponse<G extends 'style' ? FigmaStyleUsageByStyle : FigmaUsageByFile>
  > {
    const query = this.buildAnalyticsQuery(groupBy, options);
    return this.request(`/analytics/libraries/${libraryFileKey}/style/usages?${query}`);
  }

  /**
   * Get variable insertion and detachment actions for a library
   *
   * @param libraryFileKey - File key of the library
   * @param groupBy - Group results by `variable` or `team`
   * @param options - Date range and pagination options
   * @returns Paginated analytics rows
   *
   * @see https://developers.figma.com/docs/rest-api/library-analytics-endpoints/
   */
  public async getVariableActions<G extends 'variable' | 'team'>(
    libraryFileKey: string,
    groupBy: G,
    options?: FigmaAnalyticsActionsOptions
  ): Promise<
    FigmaPaginatedResponse<G extends 'variable' ? FigmaVariableActionByVariable : FigmaActionByTeam>
  > {
    const query = this.buildAnalyticsQuery(groupBy, options);
    return this.request(`/analytics/libraries/${libraryFileKey}/variable/actions?${query}`);
  }

  /**
   * Get current variable usage counts for a library
   *
   * @param libraryFileKey - File key of the library
   * @param groupBy - Group results by `variable` or `file`
   * @param options - Pagination options
   * @returns Paginated usage rows
   *
   * @see https://developers.figma.com/docs/rest-api/library-analytics-endpoints/
   */
  public async getVariableUsages<G extends 'variable' | 'file'>(
    libraryFileKey: string,
    groupBy: G,
    options?: FigmaAnalyticsUsagesOptions
  ): Promise<
    FigmaPaginatedResponse<G extends 'variable' ? FigmaVariableUsageByVariable : FigmaUsageByFile>
  > {
    const query = this.buildAnalyticsQuery(groupBy, options);
    return this.request(`/analytics/libraries/${libraryFileKey}/variable/usages?${query}`);
  }

  // ==========================================================================
  // Published Library Endpoints
  // ==========================================================================

  /**
   * Get published components from a file library
   *
   * @param fileKey - The Figma file key
   * @returns Array of published component metadata
   *
   * @see https://developers.figma.com/docs/rest-api/component-endpoints/
   *
   * @example
   * ```ts
   * const components = await client.getPublishedComponents('abc123');
   * for (const comp of components) {
   *   console.log(`${comp.name} (${comp.key})`);
   * }
   * ```
   */
  public async getPublishedComponents(fileKey: string): Promise<FigmaPublishedComponent[]> {
    const response = await this.request<{
      meta: { components: FigmaPublishedComponent[] };
    }>(`/files/${fileKey}/components`);

    return response.meta.components;
  }

  /**
   * Get published component sets (variant groups) from a file library
   *
   * @param fileKey - The Figma file key
   * @returns Array of published component set metadata
   *
   * @see https://developers.figma.com/docs/rest-api/component-endpoints/
   */
  public async getPublishedComponentSets(fileKey: string): Promise<FigmaPublishedComponentSet[]> {
    const response = await this.request<{
      meta: { component_sets: FigmaPublishedComponentSet[] };
    }>(`/files/${fileKey}/component_sets`);

    return response.meta.component_sets;
  }

  /**
   * Get published styles from a file library
   *
   * @param fileKey - The Figma file key
   * @returns Array of published style metadata
   *
   * @see https://developers.figma.com/docs/rest-api/component-endpoints/
   */
  public async getPublishedStyles(fileKey: string): Promise<FigmaPublishedStyle[]> {
    const response = await this.request<{
      meta: { styles: FigmaPublishedStyle[] };
    }>(`/files/${fileKey}/styles`);

    return response.meta.styles;
  }

  // ==========================================================================
  // Single Component/Style Lookups
  // ==========================================================================

  /**
   * Get metadata for a specific component by key
   *
   * @param componentKey - The component key
   * @returns Component metadata
   *
   * @see https://developers.figma.com/docs/rest-api/component-endpoints/
   */
  public async getComponent(componentKey: string): Promise<FigmaPublishedComponent> {
    const response = await this.request<{
      meta: FigmaPublishedComponent;
    }>(`/components/${componentKey}`);

    return response.meta;
  }

  /**
   * Get metadata for a specific component set by key
   *
   * @param componentSetKey - The component set key
   * @returns Component set metadata
   *
   * @see https://developers.figma.com/docs/rest-api/component-endpoints/
   */
  public async getComponentSet(componentSetKey: string): Promise<FigmaPublishedComponentSet> {
    const response = await this.request<{
      meta: FigmaPublishedComponentSet;
    }>(`/component_sets/${componentSetKey}`);

    return response.meta;
  }

  /**
   * Get metadata for a specific style by key
   *
   * @param styleKey - The style key
   * @returns Style metadata
   *
   * @see https://developers.figma.com/docs/rest-api/component-endpoints/
   */
  public async getStyle(styleKey: string): Promise<FigmaPublishedStyle> {
    const response = await this.request<{
      meta: FigmaPublishedStyle;
    }>(`/styles/${styleKey}`);

    return response.meta;
  }

  // ==========================================================================
  // Version History
  // ==========================================================================

  /**
   * Get version history for a file
   *
   * @param fileKey - The Figma file key (or branch key)
   * @returns Versions array with URL-based pagination
   *
   * @see https://developers.figma.com/docs/rest-api/version-history-endpoints/
   *
   * @example
   * ```ts
   * const history = await client.getVersionHistory('abc123');
   * for (const version of history.versions) {
   *   console.log(`${version.label || 'Untitled'} by ${version.user.handle}`);
   * }
   * ```
   */
  public async getVersionHistory(fileKey: string): Promise<FigmaVersionsResponse> {
    return this.request<FigmaVersionsResponse>(`/files/${fileKey}/versions`);
  }

  // ==========================================================================
  // File Metadata
  // ==========================================================================

  /**
   * Get lightweight metadata for a file
   *
   * Cheaper than getFile() — returns creator, last modified, access info
   * without the full document tree.
   *
   * @param fileKey - The Figma file key
   * @returns File metadata
   *
   * @see https://developers.figma.com/docs/rest-api/file-endpoints/
   */
  public async getFileMetadata(fileKey: string): Promise<FigmaFileMetadata> {
    const response = await this.request<{
      file: FigmaFileMetadata;
    }>(`/files/${fileKey}/meta`);

    return response.file;
  }

  // ==========================================================================
  // Authenticated User
  // ==========================================================================

  /**
   * Get the authenticated user's info
   *
   * @returns User object including email
   *
   * @remarks Requires `current_user:read` scope
   *
   * @see https://developers.figma.com/docs/rest-api/users-endpoints/
   */
  public async getMe(): Promise<FigmaUser> {
    return this.request<FigmaUser>('/me');
  }

  // ==========================================================================
  // Styles Export (Effect, Paint, Text) - Full Implementation
  // ==========================================================================

  /**
   * Get specific nodes from a file by their IDs
   * Used to fetch full style data from style nodes
   */
  public async getFileNodes(
    fileKey: string,
    nodeIds: string[]
  ): Promise<Record<string, FigmaNode>> {
    if (nodeIds.length === 0) {
      return {};
    }

    const idsParam = nodeIds.join(',');
    const response = await this.request<{ nodes: Record<string, { document: FigmaNode }> }>(
      `/files/${fileKey}/nodes?ids=${encodeURIComponent(idsParam)}`
    );

    const result: Record<string, FigmaNode> = Object.create(null);
    for (const [id, node] of Object.entries(response.nodes)) {
      // Guard against prototype pollution
      if (id === '__proto__' || id === 'constructor' || id === 'prototype') {
        continue;
      }
      if (node?.document) {
        Object.defineProperty(result, id, {
          value: node.document,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    }
    return result;
  }

  /**
   * Safely get a node from the nodes record by ID
   * Uses Object.getOwnPropertyDescriptor to avoid object injection sink warnings
   */
  private safeGetNode<T>(nodes: Record<string, T>, nodeId: string): T | undefined {
    const descriptor = Object.getOwnPropertyDescriptor(nodes, nodeId);
    return descriptor?.value as T | undefined;
  }

  /**
   * Convert Figma color with opacity to CSS rgba
   */
  private figmaColorToRgba(color: FigmaColor, opacity = 1): string {
    const r = Math.round(color.r * MAX_UINT8);
    const g = Math.round(color.g * MAX_UINT8);
    const b = Math.round(color.b * MAX_UINT8);
    const a = color.a === undefined ? opacity : color.a * opacity;

    if (a === 1) {
      return `rgb(${r}, ${g}, ${b})`;
    }
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
  }

  /**
   * Convert effect array to shadow CSS value
   */
  private effectToShadowValue(
    effects: Array<{
      type: string;
      visible: boolean;
      color?: FigmaColor;
      offset?: { x: number; y: number };
      radius?: number;
      spread?: number;
    }>
  ): string | null {
    const visibleShadows = effects.filter(
      (e) => e.visible && (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW')
    );

    if (visibleShadows.length === 0) {
      return null;
    }

    const shadowValues = visibleShadows.map((effect) => {
      const inset = effect.type === 'INNER_SHADOW' ? 'inset ' : '';
      const x = Math.round(effect.offset?.x ?? 0);
      const y = Math.round(effect.offset?.y ?? 0);
      const blur = Math.round(effect.radius ?? 0);
      const spread = Math.round(effect.spread ?? 0);
      const color = effect.color ? this.figmaColorToRgba(effect.color) : 'rgba(0, 0, 0, 0.25)';

      return `${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`;
    });

    return shadowValues.join(', ');
  }

  /**
   * Convert paint array to color CSS value
   */
  private paintToColorValue(
    paints: Array<{
      type: string;
      visible: boolean;
      opacity?: number;
      color?: FigmaColor;
      gradientStops?: Array<{ position: number; color: FigmaColor }>;
    }>
  ): string | null {
    const visiblePaints = paints.filter((p) => p.visible !== false);

    if (visiblePaints.length === 0) {
      return null;
    }

    const paint = visiblePaints[0];
    if (!paint) {
      return null;
    }

    if (paint.type === 'SOLID' && paint.color) {
      return this.figmaColorToRgba(paint.color, paint.opacity ?? 1);
    }

    if (paint.type.startsWith('GRADIENT_') && paint.gradientStops) {
      const gradientType = paint.type === 'GRADIENT_LINEAR' ? 'linear-gradient' : 'radial-gradient';
      const stops = paint.gradientStops
        .map((stop) => `${this.figmaColorToRgba(stop.color)} ${Math.round(stop.position * 100)}%`)
        .join(', ');
      return `${gradientType}(${stops})`;
    }

    return null;
  }

  /**
   * Convert text style node to typography token value object
   */
  private static convertLineHeight(lineHeight: { unit: string; value?: number }): string {
    if (lineHeight.value !== undefined) {
      if (lineHeight.unit === 'PIXELS') {
        return `${lineHeight.value}px`;
      }
      if (lineHeight.unit === 'PERCENT') {
        return `${lineHeight.value}%`;
      }
    }
    return 'normal';
  }

  private static convertLetterSpacing(letterSpacing: { unit: string; value: number }): string {
    const suffix = letterSpacing.unit === 'PIXELS' ? 'px' : '%';
    return `${letterSpacing.value}${suffix}`;
  }

  private textStyleToTypographyValue(node: {
    fontFamily?: string;
    fontWeight?: number;
    fontSize?: number;
    lineHeight?: { unit: string; value?: number };
    letterSpacing?: { unit: string; value: number };
    textCase?: string;
    textDecoration?: string;
  }): Record<string, string | number> {
    const typography: Record<string, string | number> = {};

    if (node.fontFamily) {
      typography['fontFamily'] = node.fontFamily;
    }
    if (node.fontWeight !== undefined) {
      typography['fontWeight'] = node.fontWeight;
    }
    if (node.fontSize !== undefined) {
      typography['fontSize'] = `${node.fontSize}px`;
    }
    if (node.lineHeight) {
      typography['lineHeight'] = FigmaClient.convertLineHeight(node.lineHeight);
    }
    if (node.letterSpacing) {
      typography['letterSpacing'] = FigmaClient.convertLetterSpacing(node.letterSpacing);
    }
    if (node.textCase && node.textCase !== 'ORIGINAL') {
      typography['textTransform'] = node.textCase.toLowerCase();
    }
    if (node.textDecoration && node.textDecoration !== 'NONE') {
      typography['textDecoration'] = node.textDecoration.toLowerCase();
    }

    return typography;
  }

  /**
   * Count tokens in a nested token object
   * Tokens are objects with $value property
   */
  private countTokens(obj: Record<string, unknown>): number {
    let count = 0;

    for (const value of Object.values(obj)) {
      if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        if ('$value' in record || 'value' in record) {
          count++;
        } else {
          count += this.countTokens(record);
        }
      }
    }

    return count;
  }

  /**
   * Build nested token path from style name (e.g., "shadows/elevation/md" → nested object)
   *
   * Note: The object injection warnings are false positives - we validate keys
   * against prototype pollution before any property access.
   */
  // nosemgrep: javascript.lang.security.audit.prototype-pollution.prototype-pollution-loop
  private buildTokenPath(
    tokens: Record<string, unknown>,
    styleName: string,
    value: Record<string, unknown>
  ): void {
    const path = styleName
      .split('/')
      .map((p) => p.trim().toLowerCase().replaceAll(/\s+/g, '-'))
      .filter(Boolean);

    if (path.length === 0) {
      return;
    }

    const parentPath = path.slice(0, -1);
    let obj = tokens;

    for (const segment of parentPath) {
      if (!isSafeKey(segment)) {
        continue;
      }
      if (!(segment in obj)) {
        defineEnumerableProperty(obj, segment, {});
      }
      const descriptor = Object.getOwnPropertyDescriptor(obj, segment);
      obj = (descriptor?.value ?? {}) as Record<string, unknown>;
    }

    const finalKey = path.at(-1);
    if (isSafeKey(finalKey)) {
      defineEnumerableProperty(obj, finalKey, value);
    }
  }

  private buildEffectTokenValue(
    node:
      | {
          effects?: Array<{
            type: string;
            visible: boolean;
            color?: FigmaColor;
            offset?: { x: number; y: number };
            radius?: number;
            spread?: number;
          }>;
        }
      | undefined,
    style: { key: string; name: string; description?: string }
  ): Record<string, unknown> {
    if (!node?.effects || node.effects.length === 0) {
      return {
        $value: style.name,
        $type: 'shadow',
        $description: style.description || undefined,
        $extensions: { figmaKey: style.key, styleName: style.name },
      };
    }

    const shadowValue = this.effectToShadowValue(node.effects);
    if (shadowValue) {
      return {
        $value: shadowValue,
        $type: 'shadow',
        $description: style.description || undefined,
        $extensions: {
          figmaKey: style.key,
          styleName: style.name,
          category: 'shadow' as TokenCategory,
          effects: node.effects.map((e) => ({
            type: e.type,
            offsetX: e.offset?.x,
            offsetY: e.offset?.y,
            blur: e.radius,
            spread: e.spread,
          })),
        },
      };
    }

    const blurEffect = node.effects.find(
      (e) => e.type === 'LAYER_BLUR' || e.type === 'BACKGROUND_BLUR'
    );
    return {
      $value: `blur(${blurEffect?.radius ?? 0}px)`,
      $type: 'blur',
      $description: style.description || undefined,
      $extensions: { figmaKey: style.key, styleName: style.name, blurType: blurEffect?.type },
    };
  }

  /**
   * Export effect styles (shadows, blurs) from file with full style data
   * Fetches actual effect values from nodes for accurate CSS output
   */
  public async getEffectStyles(fileKey: string): Promise<Record<string, Record<string, unknown>>> {
    const file = await this.getFile(fileKey);
    const tokens: Record<string, Record<string, unknown>> = {};

    // Collect effect style node IDs
    const effectStyleNodes: Array<{
      nodeId: string;
      style: { key: string; name: string; description?: string; styleType: string };
    }> = [];

    for (const [nodeId, style] of Object.entries(file.styles)) {
      if (style.styleType === 'EFFECT') {
        effectStyleNodes.push({ nodeId, style });
      }
    }

    if (effectStyleNodes.length === 0) {
      return tokens;
    }

    // Fetch node data to get actual effect values
    const nodeIds = effectStyleNodes.map((n) => n.nodeId);
    const nodes = await this.getFileNodes(fileKey, nodeIds);

    for (const { nodeId, style } of effectStyleNodes) {
      const node = this.safeGetNode(nodes, nodeId) as
        | {
            effects?: Array<{
              type: string;
              visible: boolean;
              color?: FigmaColor;
              offset?: { x: number; y: number };
              radius?: number;
              spread?: number;
            }>;
          }
        | undefined;

      const tokenValue = this.buildEffectTokenValue(node, style);
      this.buildTokenPath(tokens, style.name, tokenValue);
    }

    return tokens;
  }

  private buildPaintTokenValue(
    node:
      | {
          fills?: Array<{
            type: string;
            visible: boolean;
            opacity?: number;
            color?: FigmaColor;
            gradientStops?: Array<{ position: number; color: FigmaColor }>;
          }>;
        }
      | undefined,
    style: { key: string; name: string; description?: string }
  ): Record<string, unknown> {
    if (!node?.fills || node.fills.length === 0) {
      return {
        $value: style.name,
        $type: 'color',
        $description: style.description || undefined,
        $extensions: { figmaKey: style.key, styleName: style.name },
      };
    }

    const colorValue = this.paintToColorValue(node.fills);
    const isGradient = node.fills[0]?.type?.startsWith('GRADIENT_');

    return {
      $value: colorValue ?? style.name,
      $type: isGradient ? 'gradient' : 'color',
      $description: style.description || undefined,
      $extensions: {
        figmaKey: style.key,
        styleName: style.name,
        category: 'color' as TokenCategory,
      },
    };
  }

  /**
   * Export paint/fill styles (colors, gradients) from file with full style data
   * Fetches actual color values from nodes
   */
  public async getPaintStyles(fileKey: string): Promise<Record<string, Record<string, unknown>>> {
    const file = await this.getFile(fileKey);
    const tokens: Record<string, Record<string, unknown>> = {};

    // Collect fill style node IDs
    const paintStyleNodes: Array<{
      nodeId: string;
      style: { key: string; name: string; description?: string; styleType: string };
    }> = [];

    for (const [nodeId, style] of Object.entries(file.styles)) {
      if (style.styleType === 'FILL') {
        paintStyleNodes.push({ nodeId, style });
      }
    }

    if (paintStyleNodes.length === 0) {
      return tokens;
    }

    // Fetch node data to get actual paint values
    const nodeIds = paintStyleNodes.map((n) => n.nodeId);
    const nodes = await this.getFileNodes(fileKey, nodeIds);

    for (const { nodeId, style } of paintStyleNodes) {
      const node = this.safeGetNode(nodes, nodeId) as
        | {
            fills?: Array<{
              type: string;
              visible: boolean;
              opacity?: number;
              color?: FigmaColor;
              gradientStops?: Array<{ position: number; color: FigmaColor }>;
            }>;
          }
        | undefined;

      const tokenValue = this.buildPaintTokenValue(node, style);
      this.buildTokenPath(tokens, style.name, tokenValue);
    }

    return tokens;
  }

  /**
   * Export text styles (typography) from file with full style data
   * Fetches actual font properties from nodes
   */
  public async getTextStyles(fileKey: string): Promise<Record<string, Record<string, unknown>>> {
    const file = await this.getFile(fileKey);
    const tokens: Record<string, Record<string, unknown>> = {};

    // Collect text style node IDs
    const textStyleNodes: Array<{
      nodeId: string;
      style: { key: string; name: string; description?: string; styleType: string };
    }> = [];

    for (const [nodeId, style] of Object.entries(file.styles)) {
      if (style.styleType === 'TEXT') {
        textStyleNodes.push({ nodeId, style });
      }
    }

    if (textStyleNodes.length === 0) {
      return tokens;
    }

    // Fetch node data to get actual text style values
    const nodeIds = textStyleNodes.map((n) => n.nodeId);
    const nodes = await this.getFileNodes(fileKey, nodeIds);

    for (const { nodeId, style } of textStyleNodes) {
      const node = this.safeGetNode(nodes, nodeId) as
        | {
            style?: {
              fontFamily?: string;
              fontWeight?: number;
              fontSize?: number;
              lineHeight?: { unit: string; value?: number };
              letterSpacing?: { unit: string; value: number };
              textCase?: string;
              textDecoration?: string;
            };
            fontFamily?: string;
            fontWeight?: number;
            fontSize?: number;
            lineHeight?: { unit: string; value?: number };
            letterSpacing?: { unit: string; value: number };
            textCase?: string;
            textDecoration?: string;
          }
        | undefined;

      let tokenValue: Record<string, unknown>;

      // Text properties can be at node level or in node.style
      const textProps = node?.style ?? node;

      if (textProps?.fontFamily || textProps?.fontSize) {
        const typographyValue = this.textStyleToTypographyValue(textProps);

        tokenValue = {
          $value: typographyValue,
          $type: 'typography',
          $description: style.description || undefined,
          $extensions: {
            figmaKey: style.key,
            styleName: style.name,
            fontFamily: textProps.fontFamily,
            fontWeight: textProps.fontWeight,
            fontSize: textProps.fontSize,
          },
        };
      } else {
        // Fallback when node data not available
        tokenValue = {
          $value: style.name,
          $type: 'typography',
          $description: style.description || undefined,
          $extensions: {
            figmaKey: style.key,
            styleName: style.name,
          },
        };
      }

      this.buildTokenPath(tokens, style.name, tokenValue);
    }

    return tokens;
  }

  /**
   * Export all styles (effects, paints, text) to a combined tokens object
   * Runs style fetches in parallel for efficiency
   */
  public async exportStyles(
    fileKey: string,
    options: {
      includeEffects?: boolean;
      includePaints?: boolean;
      includeTextStyles?: boolean;
    } = {}
  ): Promise<{
    effects: Record<string, Record<string, unknown>>;
    paints: Record<string, Record<string, unknown>>;
    textStyles: Record<string, Record<string, unknown>>;
  }> {
    const includeEffects = options.includeEffects ?? true;
    const includePaints = options.includePaints ?? true;
    const includeTextStyles = options.includeTextStyles ?? true;

    const [effects, paints, textStyles] = await Promise.all([
      includeEffects ? this.getEffectStyles(fileKey) : Promise.resolve({}),
      includePaints ? this.getPaintStyles(fileKey) : Promise.resolve({}),
      includeTextStyles ? this.getTextStyles(fileKey) : Promise.resolve({}),
    ]);

    return {
      effects: effects as Record<string, Record<string, unknown>>,
      paints: paints as Record<string, Record<string, unknown>>,
      textStyles: textStyles as Record<string, Record<string, unknown>>,
    };
  }

  /**
   * Export tokens from Figma file
   *
   * @param options - Export options
   * @returns Export result with file paths and token counts
   *
   * @example
   * ```ts
   * const result = await client.exportTokens({
   *   fileKey: 'abc123',
   *   outputDir: './figma-exports',
   *   format: 'dtcg',
   * });
   *
   * if (result.success) {
   *   console.log(`Exported ${result.tokenCount} tokens`);
   * }
   * ```
   */
  public async exportTokens(options: ExportTokensOptions): Promise<ExportTokensResult> {
    this.ensureConfigured();

    const errors: string[] = [];
    const warnings: string[] = [];
    const exportedFiles: ExportedFile[] = [];
    let totalTokenCount = 0;

    try {
      const { variables, variableCollections } = await this.getVariables(options.fileKey);

      const collectionEntries = Object.entries(variableCollections);
      const variableEntries = Object.entries(variables);

      if (collectionEntries.length === 0) {
        warnings.push('No variable collections found in the Figma file');
        return { success: true, files: [], tokenCount: 0, collectionCount: 0, errors, warnings };
      }

      const variableById = new Map<string, FigmaVariable>();
      for (const [id, variable] of variableEntries) {
        variableById.set(id, variable);
      }

      for (const [collectionId, collection] of collectionEntries) {
        if (collection.remote) {
          continue;
        }

        if (options.collections?.length && !options.collections.includes(collection.name)) {
          continue;
        }

        const collectionVariables = variableEntries.filter(
          ([, v]) => v.variableCollectionId === collectionId
        );

        const extendedOptions = options as ExtendedExportOptions;
        const outputStructure = extendedOptions.outputStructure ?? 'separate';

        const result =
          outputStructure === 'combined'
            ? await this.processCollectionCombined(options, collection, collectionVariables, variableById)
            : await this.processCollectionSeparate(options, collection, collectionVariables, variableById);

        exportedFiles.push(...result.files);
        totalTokenCount += result.tokenCount;
      }

      const styleResult = await this.exportStyleTokens(options, warnings);
      exportedFiles.push(...styleResult.files);
      totalTokenCount += styleResult.tokenCount;

      return {
        success: true,
        files: exportedFiles,
        tokenCount: totalTokenCount,
        collectionCount: collectionEntries.length,
        errors,
        warnings,
      };
    } catch (error) {
      const errorMessage =
        error instanceof FigmaClientError
          ? error.toDetailedMessage()
          : error instanceof Error
            ? error.message
            : String(error);
      errors.push(`Export failed: ${errorMessage}`);

      return {
        success: false,
        files: exportedFiles,
        tokenCount: totalTokenCount,
        collectionCount: 0,
        errors,
        warnings,
      };
    }
  }

  private shouldFilterMode(options: ExportTokensOptions, modeName: string): boolean {
    return Boolean(options.modes?.length && !options.modes.includes(modeName));
  }

  private processVariablesForMode(
    collectionVariables: Array<[string, FigmaVariable]>,
    modeId: string,
    variableById: Map<string, FigmaVariable>,
    options: ExportTokensOptions
  ): { tokens: Record<string, unknown>; count: number } {
    const tokens: Record<string, unknown> = {};
    let count = 0;

    for (const [, variable] of collectionVariables) {
      const modeValue = Reflect.get(variable.valuesByMode, modeId) as unknown;
      if (modeValue === undefined) {
        continue;
      }

      const tokenValue = this.convertVariableValue(
        modeValue,
        variable.resolvedType,
        variableById,
        options.resolveAliases ?? false
      );

      const tokenPath = variableNameToPath(variable.name);
      const token = this.buildToken(
        tokenValue,
        variable,
        options.format ?? 'dtcg',
        options.includeDescriptions ?? true
      );

      setNestedValue(tokens, tokenPath, token);
      count++;
    }

    return { tokens, count };
  }

  private async processCollectionCombined(
    options: ExportTokensOptions,
    collection: { name: string; modes: Array<{ modeId: string; name: string }> },
    collectionVariables: Array<[string, FigmaVariable]>,
    variableById: Map<string, FigmaVariable>
  ): Promise<{ files: ExportedFile[]; tokenCount: number }> {
    const combinedTokens: Record<string, unknown> = {
      [collection.name]: { modes: {} },
    };
    let collectionTokenCount = 0;

    for (const mode of collection.modes) {
      if (this.shouldFilterMode(options, mode.name)) {
        continue;
      }

      const { tokens: modeTokens, count: modeTokenCount } = this.processVariablesForMode(
        collectionVariables, mode.modeId, variableById, options
      );

      if (modeTokenCount > 0) {
        const collectionObj = combinedTokens[collection.name] as Record<string, unknown>;
        const modesObj = collectionObj['modes'] as Record<string, unknown>;
        modesObj[mode.name] = modeTokens;
        collectionTokenCount += modeTokenCount;
      }
    }

    if (collectionTokenCount === 0) {
      return { files: [], tokenCount: 0 };
    }

    const sanitizedCollectionName = collection.name.toLowerCase().replaceAll(/\s+/g, '-');
    const filePath = `${options.outputDir}/${sanitizedCollectionName}.json`;
    await this.writeTokenFile(filePath, combinedTokens);

    return {
      files: [{ path: filePath, collection: collection.name, mode: 'all', tokenCount: collectionTokenCount }],
      tokenCount: collectionTokenCount,
    };
  }

  private async processCollectionSeparate(
    options: ExportTokensOptions,
    collection: { name: string; modes: Array<{ modeId: string; name: string }> },
    collectionVariables: Array<[string, FigmaVariable]>,
    variableById: Map<string, FigmaVariable>
  ): Promise<{ files: ExportedFile[]; tokenCount: number }> {
    const files: ExportedFile[] = [];
    let totalCount = 0;

    for (const mode of collection.modes) {
      if (this.shouldFilterMode(options, mode.name)) {
        continue;
      }

      const { tokens, count: modeTokenCount } = this.processVariablesForMode(
        collectionVariables, mode.modeId, variableById, options
      );

      if (modeTokenCount === 0) {
        continue;
      }

      const sanitizedCollectionName = collection.name.toLowerCase().replaceAll(/\s+/g, '-');
      const sanitizedModeName = mode.name.toLowerCase().replaceAll(/\s+/g, '-');
      const fileName =
        collection.modes.length > 1
          ? `${sanitizedCollectionName}.${sanitizedModeName}.json`
          : `${sanitizedCollectionName}.json`;

      const filePath = `${options.outputDir}/${fileName}`;
      await this.writeTokenFile(filePath, tokens);

      files.push({ path: filePath, collection: collection.name, mode: mode.name, tokenCount: modeTokenCount });
      totalCount += modeTokenCount;
    }

    return { files, tokenCount: totalCount };
  }

  private async writeStyleFile(
    outputDir: string,
    fileName: string,
    collectionName: string,
    styleTokens: Record<string, unknown>
  ): Promise<ExportedFile | null> {
    if (Object.keys(styleTokens).length === 0) {
      return null;
    }
    const filePath = `${outputDir}/${fileName}`;
    await this.writeTokenFile(filePath, styleTokens);
    const tokenCount = this.countTokens(styleTokens);
    return { path: filePath, collection: collectionName, mode: 'default', tokenCount };
  }

  private parseStyleFlags(options: ExportTokensOptions): {
    includeEffects: boolean;
    includePaints: boolean;
    includeTextStyles: boolean;
    hasAny: boolean;
  } {
    const extendedOptions = options as ExtendedExportOptions;
    const includeEffects = extendedOptions.includeEffects ?? false;
    const includePaints = extendedOptions.includePaints ?? false;
    const includeTextStyles = extendedOptions.includeTextStyles ?? false;
    return {
      includeEffects,
      includePaints,
      includeTextStyles,
      hasAny: includeEffects || includePaints || includeTextStyles,
    };
  }

  private async writeIncludedStyleFiles(
    outputDir: string,
    styleEntries: Array<[boolean, string, string, Record<string, unknown>]>
  ): Promise<{ files: ExportedFile[]; tokenCount: number }> {
    const files: ExportedFile[] = [];
    let tokenCount = 0;

    for (const [included, fileName, collectionName, styleTokens] of styleEntries) {
      if (!included) {
        continue;
      }
      const file = await this.writeStyleFile(outputDir, fileName, collectionName, styleTokens);
      if (file) {
        files.push(file);
        tokenCount += file.tokenCount;
      }
    }

    return { files, tokenCount };
  }

  private async exportStyleTokens(
    options: ExportTokensOptions,
    warnings: string[]
  ): Promise<{ files: ExportedFile[]; tokenCount: number }> {
    const flags = this.parseStyleFlags(options);

    if (!flags.hasAny) {
      return { files: [], tokenCount: 0 };
    }

    try {
      const styles = await this.exportStyles(options.fileKey, {
        includeEffects: flags.includeEffects,
        includePaints: flags.includePaints,
        includeTextStyles: flags.includeTextStyles,
      });

      const styleEntries: Array<[boolean, string, string, Record<string, unknown>]> = [
        [flags.includeEffects, 'effects.json', 'Effects', styles.effects as Record<string, unknown>],
        [flags.includePaints, 'paints.json', 'Paints', styles.paints as Record<string, unknown>],
        [flags.includeTextStyles, 'text-styles.json', 'TextStyles', styles.textStyles as Record<string, unknown>],
      ];

      return this.writeIncludedStyleFiles(options.outputDir, styleEntries);
    } catch (styleError) {
      warnings.push(
        `Could not export styles: ${styleError instanceof Error ? styleError.message : String(styleError)}`
      );
      return { files: [], tokenCount: 0 };
    }
  }

  /**
   * Convert a Figma variable value to a token value
   */
  private convertVariableValue(
    value: unknown,
    _type: string,
    variableById: Map<string, FigmaVariable>,
    resolveAliases: boolean
  ): unknown {
    // Handle alias references
    if (isVariableAlias(value)) {
      if (resolveAliases) {
        const referencedVariable = variableById.get(value.id);
        if (referencedVariable) {
          // Get the first mode value (or could be more sophisticated)
          const modeIds = Object.keys(referencedVariable.valuesByMode);
          if (modeIds.length > 0 && modeIds[0] !== undefined) {
            const refValue = referencedVariable.valuesByMode[modeIds[0]];
            return this.convertVariableValue(
              refValue,
              referencedVariable.resolvedType,
              variableById,
              true
            );
          }
        }
        return null;
      }
      // Return as reference
      const referencedVariable = variableById.get(value.id);
      if (referencedVariable) {
        const refPath = referencedVariable.name.replaceAll('/', '.');
        return `{${refPath}}`;
      }
      return null;
    }

    // Handle color values
    if (isFigmaColor(value)) {
      return figmaColorToHex(value);
    }

    // Return primitive values as-is
    return value;
  }

  /**
   * Build a token object in the specified format
   * Now with smart font detection inspired by Figma SDS
   */
  private buildTokenMetadata(variable: FigmaVariable): {
    tokenType: string;
    parsed: ParsedDescription;
    extensions: TokenExtensions | undefined;
    scopes: string[] | undefined;
    codeSyntax: FigmaVariable['codeSyntax'];
  } {
    const { type: tokenType } = detectTokenType(variable.name, variable.resolvedType);
    const parsed = parseDescription(variable.description);
    const hasExtensionData = parsed.metadata && Object.keys(parsed.metadata).length > 0;
    const extensions: TokenExtensions | undefined = hasExtensionData ? parsed.metadata : undefined;
    const scopes = variable.scopes?.length ? variable.scopes : undefined;
    const codeSyntax = variable.codeSyntax;

    return { tokenType, parsed, extensions, scopes, codeSyntax };
  }

  private buildToken(
    value: unknown,
    variable: FigmaVariable,
    format: 'dtcg' | 'tokens-studio' | 'style-dictionary',
    includeDescription: boolean
  ): Record<string, unknown> {
    const { tokenType, parsed, extensions, scopes, codeSyntax } =
      this.buildTokenMetadata(variable);

    switch (format) {
      case 'dtcg':
        return {
          $value: value,
          $type: tokenType,
          ...(includeDescription && parsed.description ? { $description: parsed.description } : {}),
          ...(extensions ? { $extensions: extensions } : {}),
          ...(codeSyntax ? { $codeSyntax: codeSyntax } : {}),
          ...(scopes ? { $scopes: scopes } : {}),
        };

      case 'tokens-studio':
        return {
          value,
          type: tokenType,
          ...(includeDescription && parsed.description ? { description: parsed.description } : {}),
          ...(extensions ? { extensions } : {}),
          ...(codeSyntax ? { codeSyntax } : {}),
          ...(scopes ? { scopes } : {}),
        };

      case 'style-dictionary':
      default:
        return {
          value,
          ...(includeDescription && parsed.description ? { comment: parsed.description } : {}),
        };
    }
  }

  /**
   * Write tokens to a JSON file
   * Uses dynamic import for Node.js fs module
   */
  private async writeTokenFile(filePath: string, tokens: Record<string, unknown>): Promise<void> {
    // Dynamic import to work in both Node.js and browser contexts
    try {
      const fs = await import('node:fs/promises');
      const path = await import('node:path');

      // Ensure directory exists
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      // Write the file
      const content = JSON.stringify(tokens, null, 2);
      await fs.writeFile(filePath, content, 'utf-8');
    } catch {
      // In browser context, log warning
      console.warn(`[FigmaClient] Cannot write file in browser context: ${filePath}`);
    }
  }

  /**
   * Sync tokens between Figma and local files
   *
   * @param options - Sync options
   * @returns Sync result with changes
   *
   * @example
   * ```ts
   * const result = await client.syncTokens({
   *   fileKey: 'abc123',
   *   tokensDir: './packages/@dsai-io/tokens',
   *   direction: 'pull',
   *   dryRun: true,
   * });
   *
   * console.log('Would update:', result.updated);
   * ```
   */
  public async syncTokens(options: SyncFigmaOptions): Promise<SyncFigmaResult> {
    this.ensureConfigured();

    const added: string[] = [];
    const updated: string[] = [];
    const removed: string[] = [];
    const conflicts: SyncConflict[] = [];
    const errors: string[] = [];

    try {
      if (options.backup && !options.dryRun) {
        await this.createBackup(options.tokensDir);
      }

      const { variables, variableCollections } = await this.getVariables(options.fileKey);
      const remoteTokens = this.buildRemoteTokenMap(variables, variableCollections);
      const localTokens = await this.readLocalTokens(options.tokensDir);

      if (options.direction === 'pull' || options.direction === 'both') {
        this.pullTokens(remoteTokens, localTokens, options, added, updated, removed, conflicts);
      }

      if (options.direction === 'push') {
        errors.push(
          'Push to Figma is not fully supported via REST API. ' +
            'Use Figma plugin or Tokens Studio for pushing changes to Figma.'
        );
      }

      if (!options.dryRun && (added.length > 0 || updated.length > 0)) {
        await this.writeLocalTokens(options.tokensDir, localTokens);
      }

      return {
        success: errors.length === 0,
        direction: options.direction,
        added, updated, removed, conflicts, errors,
      };
    } catch (error) {
      const errorMessage =
        error instanceof FigmaClientError
          ? error.toDetailedMessage()
          : error instanceof Error
            ? error.message
            : String(error);
      errors.push(`Sync failed: ${errorMessage}`);

      return {
        success: false,
        direction: options.direction,
        added, updated, removed, conflicts, errors,
      };
    }
  }

  private buildRemoteTokenMap(
    variables: Record<string, FigmaVariable>,
    variableCollections: FigmaVariablesResponse['variableCollections']
  ): Map<string, unknown> {
    const remoteTokens = new Map<string, unknown>();

    for (const [, variable] of Object.entries(variables)) {
      const collection = variableCollections[variable.variableCollectionId];
      if (!collection) {
        continue;
      }

      const defaultMode = collection.modes.find((m) => m.modeId === collection.defaultModeId);
      if (!defaultMode) {
        continue;
      }

      const value = variable.valuesByMode[defaultMode.modeId];
      const tokenPath = variable.name.replaceAll('/', '.');
      remoteTokens.set(
        tokenPath,
        this.convertVariableValue(value, variable.resolvedType, new Map(), true)
      );
    }

    return remoteTokens;
  }

  private handleNewToken(
    path: string,
    remoteValue: unknown,
    localTokens: Map<string, unknown>,
    dryRun: boolean,
    added: string[]
  ): void {
    added.push(path);
    if (!dryRun) {
      localTokens.set(path, remoteValue);
    }
  }

  private handleChangedToken(
    path: string,
    localValue: unknown,
    remoteValue: unknown,
    localTokens: Map<string, unknown>,
    options: SyncFigmaOptions,
    updated: string[],
    conflicts: SyncConflict[]
  ): void {
    if (options.conflictResolution === 'manual') {
      conflicts.push({ path, localValue, remoteValue });
      return;
    }
    if (options.conflictResolution === 'remote' || options.direction === 'pull') {
      updated.push(path);
      if (!options.dryRun) {
        localTokens.set(path, remoteValue);
      }
    }
  }

  private pullTokens(
    remoteTokens: Map<string, unknown>,
    localTokens: Map<string, unknown>,
    options: SyncFigmaOptions,
    added: string[],
    updated: string[],
    removed: string[],
    conflicts: SyncConflict[]
  ): void {
    for (const [path, remoteValue] of remoteTokens) {
      const localValue = localTokens.get(path);

      if (localValue === undefined) {
        this.handleNewToken(path, remoteValue, localTokens, options.dryRun ?? false, added);
        continue;
      }

      if (!this.valuesEqual(localValue, remoteValue)) {
        this.handleChangedToken(path, localValue, remoteValue, localTokens, options, updated, conflicts);
      }
    }

    for (const [path] of localTokens) {
      if (!remoteTokens.has(path)) {
        removed.push(path);
      }
    }
  }

  /**
   * Create a backup of the tokens directory
   */
  private async createBackup(tokensDir: string): Promise<void> {
    try {
      const fs = await import('node:fs/promises');
      const path = await import('node:path');

      const timestamp = new Date().toISOString().replaceAll(/[:.]/g, '-');
      const backupDir = path.join(
        path.dirname(tokensDir),
        `${path.basename(tokensDir)}-backup-${timestamp}`
      );

      await fs.cp(tokensDir, backupDir, { recursive: true });
    } catch (error) {
      console.warn(`[FigmaClient] Failed to create backup: ${error}`);
    }
  }

  /**
   * Read local tokens from the tokens directory
   */
  private async readLocalTokens(tokensDir: string): Promise<Map<string, unknown>> {
    const tokens = new Map<string, unknown>();

    try {
      const fs = await import('node:fs/promises');
      const path = await import('node:path');

      // Read all JSON files in the tokens directory
      const files = await fs.readdir(tokensDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      for (const file of jsonFiles) {
        const filePath = path.join(tokensDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content) as Record<string, unknown>;

        // Flatten token structure into path -> value map
        this.flattenTokens(data, '', tokens);
      }
    } catch {
      // Directory doesn't exist or is empty
    }

    return tokens;
  }

  /**
   * Flatten nested token structure into a path -> value map
   */
  private flattenTokens(
    obj: Record<string, unknown>,
    prefix: string,
    result: Map<string, unknown>
  ): void {
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;

      if (this.isTokenValue(value)) {
        // This is a token leaf node
        const record = value as Record<string, unknown>;
        const tokenValue = record['$value'] ?? record['value'];
        result.set(path, tokenValue);
      } else if (typeof value === 'object' && value !== null) {
        // Recurse into nested object
        this.flattenTokens(value as Record<string, unknown>, path, result);
      }
    }
  }

  /**
   * Check if an object is a token value (has $value or value property)
   */
  private isTokenValue(obj: unknown): boolean {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }
    const record = obj as Record<string, unknown>;
    return '$value' in record || ('value' in record && !('$value' in record));
  }

  /**
   * Write local tokens to the tokens directory
   */
  private async writeLocalTokens(tokensDir: string, tokens: Map<string, unknown>): Promise<void> {
    try {
      const fs = await import('node:fs/promises');
      const path = await import('node:path');

      // Group tokens by top-level category
      const grouped = new Map<string, Record<string, unknown>>();

      for (const [tokenPath, value] of tokens) {
        const parts = tokenPath.split('.');
        const category = parts[0] ?? 'tokens';
        const restPath = parts.slice(1);

        if (!grouped.has(category)) {
          grouped.set(category, {});
        }

        const categoryObj = grouped.get(category);
        if (categoryObj) {
          setNestedValue(categoryObj, restPath, { $value: value });
        }
      }

      // Write each category to a file
      for (const [category, data] of grouped) {
        const filePath = path.join(tokensDir, `${category}.json`);
        const content = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, content, 'utf-8');
      }
    } catch (error) {
      console.warn(`[FigmaClient] Failed to write tokens: ${error}`);
    }
  }

  /**
   * Compare two token values for equality
   */
  private valuesEqual(a: unknown, b: unknown): boolean {
    if (a === b) {
      return true;
    }
    if (typeof a !== typeof b) {
      return false;
    }
    if (typeof a === 'object' && a !== null && b !== null) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return false;
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a new Figma client instance
 *
 * @param config - Client configuration
 * @returns Configured Figma client
 *
 * @example
 * ```ts
 * // Using environment variable
 * const client = createFigmaClient({
 *   accessToken: process.env.FIGMA_TOKEN!,
 * });
 *
 * // With custom options
 * const client = createFigmaClient({
 *   accessToken: 'token',
 *   timeout: 60000,
 *   retries: 5,
 * });
 * ```
 */
export function createFigmaClient(config?: FigmaClientConfig): FigmaClient {
  return new FigmaClient(config);
}

/**
 * Create a Figma client from environment variables
 *
 * Looks for FIGMA_TOKEN or FIGMA_ACCESS_TOKEN in environment.
 *
 * @param overrides - Optional configuration overrides
 * @returns Configured Figma client
 *
 * @example
 * ```ts
 * // Uses FIGMA_TOKEN from environment
 * const client = createFigmaClientFromEnv();
 *
 * // With overrides
 * const client = createFigmaClientFromEnv({ timeout: 60000 });
 * ```
 */
export function createFigmaClientFromEnv(
  overrides?: Omit<FigmaClientConfig, 'accessToken'>
): FigmaClient {
  const accessToken = process.env['FIGMA_TOKEN'] ?? process.env['FIGMA_ACCESS_TOKEN'] ?? '';

  if (!accessToken) {
    console.warn(
      '[FigmaClient] No FIGMA_TOKEN or FIGMA_ACCESS_TOKEN environment variable found. ' +
        'Client will not be able to make API requests.'
    );
  }

  return new FigmaClient({
    accessToken,
    ...overrides,
  });
}
