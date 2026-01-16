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
} from './types.js';

// ============================================================================
// Constants
// ============================================================================

/** Default Figma API base URL */
const DEFAULT_BASE_URL = 'https://api.figma.com';

/** Default request timeout (30 seconds) */
const DEFAULT_TIMEOUT = 30000;

/** Default retry count */
const DEFAULT_RETRIES = 3;

/** API version */
const API_VERSION = 'v1';

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
    const metadataMatch = description.match(
      /^(.+?)(?:\s*\n)?((?:[A-Z][a-z]+\.[A-Z][a-zA-Z]+:\s*.+(?:\s*•\s*)?)+)$/s
    );
    if (metadataMatch?.[1] && metadataMatch[2]) {
      return {
        description: metadataMatch[1].trim(),
        metadata: parseMetadataLine(metadataMatch[2]),
      };
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
  const result: Record<string, Record<string, string>> = {};

  // Split by bullet separator
  const pairs = line.split(/\s*•\s*/);

  for (const pair of pairs) {
    // Match Key.SubKey: value format
    const match = pair.match(/^([A-Z][a-z]+)\.([A-Z][a-zA-Z]+):\s*(.+)$/);
    if (match?.[1] && match[2] && match[3]) {
      const category = match[1].toLowerCase();
      // Convert PascalCase to camelCase for the key
      const key = match[2].charAt(0).toLowerCase() + match[2].slice(1);
      const value = match[3].trim();

      if (!result[category]) {
        result[category] = {};
      }
      result[category][key] = value;
    }
  }

  return result;
}

// ============================================================================
// Token Transformation Helpers
// ============================================================================

/**
 * Detect the semantic type of a variable based on its name and resolved type
 * Inspired by Figma SDS approach
 */
function detectTokenType(
  name: string,
  resolvedType: string
): { type: string; category?: TokenCategory } {
  // Font weight detection
  if (resolvedType === 'FLOAT' && FONT_WEIGHT_PATTERN.test(name)) {
    return { type: 'fontWeight', category: 'fontWeight' };
  }

  // Font family detection
  if (resolvedType === 'STRING' && FONT_FAMILY_PATTERN.test(name)) {
    return { type: 'fontFamily', category: 'fontFamily' };
  }

  // Font size detection
  if (resolvedType === 'FLOAT' && FONT_SIZE_PATTERN.test(name)) {
    return { type: 'dimension', category: 'fontSize' };
  }

  // Line height detection
  if (resolvedType === 'FLOAT' && LINE_HEIGHT_PATTERN.test(name)) {
    return { type: 'number', category: 'lineHeight' };
  }

  // Letter spacing detection
  if (resolvedType === 'FLOAT' && LETTER_SPACING_PATTERN.test(name)) {
    return { type: 'dimension', category: 'letterSpacing' };
  }

  // Default type mappings
  switch (resolvedType) {
    case 'COLOR':
      return { type: 'color', category: 'color' };
    case 'FLOAT':
      return { type: 'number' };
    case 'STRING':
      return { type: 'string' };
    case 'BOOLEAN':
      return { type: 'boolean' };
    default:
      return { type: 'string' };
  }
}

/**
 * Convert Figma color (0-1 range) to hex string
 */
function figmaColorToHex(color: FigmaColor): string {
  const toHex = (value: number): string => {
    const hex = Math.round(value * 255).toString(16);
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

/**
 * Set a nested value in an object using a path array
 * Uses Object.defineProperty for safe key assignment
 *
 * Note: The object injection warnings are intentional - we are building
 * nested objects from validated Figma variable paths (e.g., "colors/brand/primary")
 */
/* eslint-disable security/detect-object-injection */
function setNestedValue(obj: Record<string, unknown>, path: string[], value: unknown): void {
  if (path.length === 0) {
    return;
  }

  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (key === undefined) {
      continue;
    }
    // Guard against prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    // Safe: key comes from path array split from validated variable names
    const existing = key in current ? current[key] : undefined;
    if (typeof existing !== 'object' || existing === null) {
      Object.defineProperty(current, key, {
        value: {},
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
    // Safe: key is validated string from path array
    current = current[key] as Record<string, unknown>;
  }

  const lastKey = path[path.length - 1];
  if (lastKey !== undefined) {
    Object.defineProperty(current, lastKey, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });
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
    if (error.status === 403) {
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
    } else if (error.status === 404) {
      hint =
        '⚠️  File not found. Check that:\n' +
        '   • The file key is correct (from the Figma URL)\n' +
        '   • The file has not been deleted or moved';
    } else if (error.status === 429) {
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
   * Make API request with retry logic
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    this.ensureConfigured();

    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders();

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...options,
          headers: { ...headers, ...options.headers },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

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
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (error instanceof FigmaClientError && error.status < 500) {
          throw error;
        }

        // Don't retry on config errors
        if (error instanceof FigmaConfigError) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.config.retries) {
          await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
        }
      }
    }

    throw lastError ?? new Error('Request failed after retries');
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
    const endpoint = `/files/${fileKey}${query ? `?${query}` : ''}`;

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
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    const a = color.a !== undefined ? color.a * opacity : opacity;

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
      if (node.lineHeight.unit === 'PIXELS' && node.lineHeight.value !== undefined) {
        typography['lineHeight'] = `${node.lineHeight.value}px`;
      } else if (node.lineHeight.unit === 'PERCENT' && node.lineHeight.value !== undefined) {
        typography['lineHeight'] = `${node.lineHeight.value}%`;
      } else {
        typography['lineHeight'] = 'normal';
      }
    }
    if (node.letterSpacing) {
      if (node.letterSpacing.unit === 'PIXELS') {
        typography['letterSpacing'] = `${node.letterSpacing.value}px`;
      } else {
        typography['letterSpacing'] = `${node.letterSpacing.value}%`;
      }
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
      .map((p) => p.trim().toLowerCase().replace(/\s+/g, '-'))
      .filter(Boolean);

    if (path.length === 0) {
      return;
    }

    let obj = tokens;
    for (let i = 0; i < path.length - 1; i++) {
      const segment = path[i];
      // Guard against prototype pollution
      if (
        !segment ||
        segment === '__proto__' ||
        segment === 'constructor' ||
        segment === 'prototype'
      ) {
        continue;
      }
      if (!(segment in obj)) {
        Object.defineProperty(obj, segment, {
          value: {},
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
      const descriptor = Object.getOwnPropertyDescriptor(obj, segment);
      obj = (descriptor?.value ?? {}) as Record<string, unknown>;
    }

    const finalKey = path[path.length - 1];
    if (
      finalKey &&
      finalKey !== '__proto__' &&
      finalKey !== 'constructor' &&
      finalKey !== 'prototype'
    ) {
      Object.defineProperty(obj, finalKey, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
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

      let tokenValue: Record<string, unknown>;

      if (node?.effects && node.effects.length > 0) {
        const shadowValue = this.effectToShadowValue(node.effects);
        if (shadowValue) {
          tokenValue = {
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
        } else {
          // Blur effect (no shadow value)
          const blurEffect = node.effects.find(
            (e) => e.type === 'LAYER_BLUR' || e.type === 'BACKGROUND_BLUR'
          );
          tokenValue = {
            $value: `blur(${blurEffect?.radius ?? 0}px)`,
            $type: 'blur',
            $description: style.description || undefined,
            $extensions: {
              figmaKey: style.key,
              styleName: style.name,
              blurType: blurEffect?.type,
            },
          };
        }
      } else {
        // Fallback when node data not available
        tokenValue = {
          $value: style.name,
          $type: 'shadow',
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

      let tokenValue: Record<string, unknown>;

      if (node?.fills && node.fills.length > 0) {
        const colorValue = this.paintToColorValue(node.fills);
        const isGradient = node.fills[0]?.type?.startsWith('GRADIENT_');

        tokenValue = {
          $value: colorValue ?? style.name,
          $type: isGradient ? 'gradient' : 'color',
          $description: style.description || undefined,
          $extensions: {
            figmaKey: style.key,
            styleName: style.name,
            category: 'color' as TokenCategory,
          },
        };
      } else {
        // Fallback when node data not available
        tokenValue = {
          $value: style.name,
          $type: 'color',
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
      // Fetch variables from Figma
      const { variables, variableCollections } = await this.getVariables(options.fileKey);

      const collectionEntries = Object.entries(variableCollections);
      const variableEntries = Object.entries(variables);

      if (collectionEntries.length === 0) {
        warnings.push('No variable collections found in the Figma file');
        return {
          success: true,
          files: [],
          tokenCount: 0,
          collectionCount: 0,
          errors,
          warnings,
        };
      }

      // Build variable lookup map by ID
      const variableById = new Map<string, FigmaVariable>();
      for (const [id, variable] of variableEntries) {
        variableById.set(id, variable);
      }

      // Process each collection
      for (const [collectionId, collection] of collectionEntries) {
        // Skip remote/library collections - these are from linked libraries
        if (collection.remote) {
          continue;
        }

        // Filter collections if specified
        if (options.collections && options.collections.length > 0) {
          if (!options.collections.includes(collection.name)) {
            continue;
          }
        }

        // Get variables for this collection
        const collectionVariables = variableEntries.filter(
          ([, v]) => v.variableCollectionId === collectionId
        );

        // Check output structure mode
        const extendedOptions = options as ExtendedExportOptions;
        const outputStructure = extendedOptions.outputStructure ?? 'separate';

        if (outputStructure === 'combined') {
          // Combined structure: Collection > modes > ModeName > tokens
          const combinedTokens: Record<string, unknown> = {
            [collection.name]: {
              modes: {},
            },
          };

          let collectionTokenCount = 0;

          for (const mode of collection.modes) {
            // Filter modes if specified
            if (options.modes && options.modes.length > 0) {
              if (!options.modes.includes(mode.name)) {
                continue;
              }
            }

            const modeTokens: Record<string, unknown> = {};
            let modeTokenCount = 0;

            for (const [, variable] of collectionVariables) {
              const modeValue = variable.valuesByMode[mode.modeId];
              if (modeValue === undefined) {
                continue;
              }

              // Convert variable to token
              const tokenValue = this.convertVariableValue(
                modeValue,
                variable.resolvedType,
                variableById,
                options.resolveAliases ?? false
              );

              // Build token structure based on format
              const tokenPath = variableNameToPath(variable.name);
              const token = this.buildToken(
                tokenValue,
                variable,
                options.format ?? 'dtcg',
                options.includeDescriptions ?? true
              );

              setNestedValue(modeTokens, tokenPath, token);
              modeTokenCount++;
            }

            if (modeTokenCount > 0) {
              // Add mode tokens to combined structure
              const collectionObj = combinedTokens[collection.name] as Record<string, unknown>;
              const modesObj = collectionObj['modes'] as Record<string, unknown>;
              modesObj[mode.name] = modeTokens;
              collectionTokenCount += modeTokenCount;
            }
          }

          if (collectionTokenCount > 0) {
            // Write single combined file per collection
            const sanitizedCollectionName = collection.name.toLowerCase().replace(/\s+/g, '-');
            const fileName = `${sanitizedCollectionName}.json`;
            const filePath = `${options.outputDir}/${fileName}`;

            await this.writeTokenFile(filePath, combinedTokens);

            exportedFiles.push({
              path: filePath,
              collection: collection.name,
              mode: 'all',
              tokenCount: collectionTokenCount,
            });

            totalTokenCount += collectionTokenCount;
          }
        } else {
          // Separate structure: One file per mode (original behavior)
          for (const mode of collection.modes) {
            // Filter modes if specified
            if (options.modes && options.modes.length > 0) {
              if (!options.modes.includes(mode.name)) {
                continue;
              }
            }

            const tokens: Record<string, unknown> = {};
            let modeTokenCount = 0;

            for (const [, variable] of collectionVariables) {
              const modeValue = variable.valuesByMode[mode.modeId];
              if (modeValue === undefined) {
                continue;
              }

              // Convert variable to token
              const tokenValue = this.convertVariableValue(
                modeValue,
                variable.resolvedType,
                variableById,
                options.resolveAliases ?? false
              );

              // Build token structure based on format
              const tokenPath = variableNameToPath(variable.name);
              const token = this.buildToken(
                tokenValue,
                variable,
                options.format ?? 'dtcg',
                options.includeDescriptions ?? true
              );

              setNestedValue(tokens, tokenPath, token);
              modeTokenCount++;
            }

            if (modeTokenCount > 0) {
              // Determine output filename
              const sanitizedCollectionName = collection.name.toLowerCase().replace(/\s+/g, '-');
              const sanitizedModeName = mode.name.toLowerCase().replace(/\s+/g, '-');
              const fileName =
                collection.modes.length > 1
                  ? `${sanitizedCollectionName}.${sanitizedModeName}.json`
                  : `${sanitizedCollectionName}.json`;

              const filePath = `${options.outputDir}/${fileName}`;

              await this.writeTokenFile(filePath, tokens);

              exportedFiles.push({
                path: filePath,
                collection: collection.name,
                mode: mode.name,
                tokenCount: modeTokenCount,
              });

              totalTokenCount += modeTokenCount;
            }
          }
        }
      }

      // Export styles if requested (effect, paint, text styles)
      const extendedOptions = options as ExtendedExportOptions;
      const includeEffects = extendedOptions.includeEffects ?? false;
      const includePaints = extendedOptions.includePaints ?? false;
      const includeTextStyles = extendedOptions.includeTextStyles ?? false;

      if (includeEffects || includePaints || includeTextStyles) {
        try {
          const styles = await this.exportStyles(options.fileKey, {
            includeEffects,
            includePaints,
            includeTextStyles,
          });

          // Write effect styles
          if (includeEffects && Object.keys(styles.effects).length > 0) {
            const effectsPath = `${options.outputDir}/effects.json`;
            await this.writeTokenFile(effectsPath, styles.effects);
            const effectCount = this.countTokens(styles.effects);
            exportedFiles.push({
              path: effectsPath,
              collection: 'Effects',
              mode: 'default',
              tokenCount: effectCount,
            });
            totalTokenCount += effectCount;
          }

          // Write paint styles
          if (includePaints && Object.keys(styles.paints).length > 0) {
            const paintsPath = `${options.outputDir}/paints.json`;
            await this.writeTokenFile(paintsPath, styles.paints);
            const paintCount = this.countTokens(styles.paints);
            exportedFiles.push({
              path: paintsPath,
              collection: 'Paints',
              mode: 'default',
              tokenCount: paintCount,
            });
            totalTokenCount += paintCount;
          }

          // Write text styles
          if (includeTextStyles && Object.keys(styles.textStyles).length > 0) {
            const textStylesPath = `${options.outputDir}/text-styles.json`;
            await this.writeTokenFile(textStylesPath, styles.textStyles);
            const textCount = this.countTokens(styles.textStyles);
            exportedFiles.push({
              path: textStylesPath,
              collection: 'TextStyles',
              mode: 'default',
              tokenCount: textCount,
            });
            totalTokenCount += textCount;
          }
        } catch (styleError) {
          // Styles export is optional, don't fail the whole export
          warnings.push(
            `Could not export styles: ${styleError instanceof Error ? styleError.message : String(styleError)}`
          );
        }
      }

      return {
        success: true,
        files: exportedFiles,
        tokenCount: totalTokenCount,
        collectionCount: collectionEntries.length,
        errors,
        warnings,
      };
    } catch (error) {
      // Use detailed message for FigmaClientError (includes hints about plan requirements)
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
        const refPath = referencedVariable.name.replace(/\//g, '.');
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
  private buildToken(
    value: unknown,
    variable: FigmaVariable,
    format: 'dtcg' | 'tokens-studio' | 'style-dictionary',
    includeDescription: boolean
  ): Record<string, unknown> {
    // Use smart type detection
    const { type: tokenType } = detectTokenType(variable.name, variable.resolvedType);

    // Parse description to extract metadata
    const parsed = parseDescription(variable.description);

    // $extensions only contains parsed metadata (docs, platform, etc.) - no Figma internals
    const hasExtensionData = parsed.metadata && Object.keys(parsed.metadata).length > 0;
    const extensions: TokenExtensions | undefined = hasExtensionData ? parsed.metadata : undefined;

    // Include scopes if available
    const scopes = variable.scopes?.length ? variable.scopes : undefined;

    // $codeSyntax at root level (not inside $extensions)
    const codeSyntax = variable.codeSyntax;

    switch (format) {
      case 'dtcg':
        return {
          $value: value,
          $type: tokenType,
          // Use clean description (without metadata) if available
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
      // Create backup if requested
      if (options.backup && !options.dryRun) {
        await this.createBackup(options.tokensDir);
      }

      // Fetch remote tokens from Figma
      const { variables, variableCollections } = await this.getVariables(options.fileKey);

      // Build remote token map
      const remoteTokens = new Map<string, unknown>();
      for (const [, variable] of Object.entries(variables)) {
        const collection = variableCollections[variable.variableCollectionId];
        if (!collection) {
          continue;
        }

        // Use first mode as default for sync comparison
        const defaultMode = collection.modes.find((m) => m.modeId === collection.defaultModeId);
        if (!defaultMode) {
          continue;
        }

        const value = variable.valuesByMode[defaultMode.modeId];
        const tokenPath = variable.name.replace(/\//g, '.');
        remoteTokens.set(
          tokenPath,
          this.convertVariableValue(value, variable.resolvedType, new Map(), true)
        );
      }

      // Read local tokens
      const localTokens = await this.readLocalTokens(options.tokensDir);

      // Compare and sync based on direction
      if (options.direction === 'pull' || options.direction === 'both') {
        // Pull: Update local with remote changes
        for (const [path, remoteValue] of remoteTokens) {
          const localValue = localTokens.get(path);

          if (localValue === undefined) {
            // New token from Figma
            added.push(path);
            if (!options.dryRun) {
              localTokens.set(path, remoteValue);
            }
          } else if (!this.valuesEqual(localValue, remoteValue)) {
            // Check for conflicts
            if (options.conflictResolution === 'manual') {
              conflicts.push({
                path,
                localValue,
                remoteValue,
              });
            } else if (options.conflictResolution === 'remote' || options.direction === 'pull') {
              updated.push(path);
              if (!options.dryRun) {
                localTokens.set(path, remoteValue);
              }
            }
          }
        }

        // Check for removed tokens (in remote but not local)
        for (const [path] of localTokens) {
          if (!remoteTokens.has(path)) {
            removed.push(path);
          }
        }
      }

      if (options.direction === 'push' || options.direction === 'both') {
        // Push direction is not fully supported as Figma Variables API
        // has limited write capabilities in REST API v1
        if (options.direction === 'push') {
          errors.push(
            'Push to Figma is not fully supported via REST API. ' +
              'Use Figma plugin or Tokens Studio for pushing changes to Figma.'
          );
        }
      }

      // Write updated tokens if not dry run
      if (!options.dryRun && (added.length > 0 || updated.length > 0)) {
        await this.writeLocalTokens(options.tokensDir, localTokens);
      }

      return {
        success: errors.length === 0,
        direction: options.direction,
        added,
        updated,
        removed,
        conflicts,
        errors,
      };
    } catch (error) {
      // Use detailed message for FigmaClientError (includes hints about plan requirements)
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
        added,
        updated,
        removed,
        conflicts,
        errors,
      };
    }
  }

  /**
   * Create a backup of the tokens directory
   */
  private async createBackup(tokensDir: string): Promise<void> {
    try {
      const fs = await import('node:fs/promises');
      const path = await import('node:path');

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
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
