/**
 * Shared types for DSAi utilities
 *
 * Common interfaces and type definitions used across multiple utility categories.
 * Centralizing these types reduces duplication and ensures consistency.
 *
 * @module utils/types/shared
 */

// =============================================================================
// Formatter Options
// =============================================================================

/**
 * Base options for Intl-based formatters (date, number, currency)
 */
export interface FormatterOptions {
  /**
   * BCP 47 language tag (e.g., 'en-US', 'es-ES', 'ja-JP')
   * @default navigator.language || 'en-US'
   */
  readonly locale?: string;
}

/**
 * Options for date/time formatting utilities
 */
export interface DateFormatterOptions extends FormatterOptions {
  /**
   * Date style preset: full, long, medium, short
   */
  readonly dateStyle?: 'full' | 'long' | 'medium' | 'short';

  /**
   * Time style preset: full, long, medium, short
   */
  readonly timeStyle?: 'full' | 'long' | 'medium' | 'short';

  /**
   * Time zone identifier (e.g., 'America/New_York', 'UTC')
   * @default undefined (uses system time zone)
   */
  readonly timeZone?: string;

  /**
   * Use local/system time zone instead of the default UTC fallback when timeZone is not provided.
   * Defaults to false to preserve deterministic output in tests/SSR.
   */
  readonly useLocalTimeZone?: boolean;

  /**
   * Custom format options (overrides dateStyle/timeStyle)
   */
  readonly options?: Intl.DateTimeFormatOptions;
}

/**
 * Options for number formatting utilities
 */
export interface NumberFormatterOptions extends FormatterOptions {
  /**
   * Minimum number of fraction digits
   * @default 0
   */
  readonly minimumFractionDigits?: number;

  /**
   * Maximum number of fraction digits
   * @default 2
   */
  readonly maximumFractionDigits?: number;

  /**
   * Use grouping separators (e.g., 1,000 vs 1000)
   * @default true
   */
  readonly useGrouping?: boolean;

  /**
   * Compact notation (e.g., 1.2K, 1.2M)
   * @default undefined (standard notation)
   */
  readonly notation?: 'standard' | 'compact' | 'scientific' | 'engineering';

  /**
   * Compact display style (only applies when notation is 'compact')
   * @default 'short'
   */
  readonly compactDisplay?: 'short' | 'long';

  /**
   * Number style (decimal, currency, percent, unit)
   * @default 'decimal'
   */
  readonly style?: 'decimal' | 'currency' | 'percent' | 'unit';

  /**
   * Unit to use in unit formatting (e.g., 'megabyte', 'kilometer')
   * Only applies when style is 'unit'
   */
  readonly unit?: string;
}

/**
 * Options for currency formatting utilities
 */
export interface CurrencyFormatterOptions extends FormatterOptions {
  /**
   * ISO 4217 currency code (e.g., 'USD', 'EUR', 'JPY')
   * @default 'USD'
   */
  readonly currency?: string;

  /**
   * Currency display style
   * @default 'symbol'
   */
  readonly currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name';

  /**
   * Minimum fraction digits (overrides currency defaults)
   */
  readonly minimumFractionDigits?: number;

  /**
   * Maximum fraction digits (overrides currency defaults)
   */
  readonly maximumFractionDigits?: number;

  /**
   * Use grouping separators (e.g., 1,000 vs 1000)
   * @default true
   */
  readonly useGrouping?: boolean;
}

// =============================================================================
// Timing & Control Flow Options
// =============================================================================

/**
 * Options for debounce utility
 */
export interface DebounceOptions {
  /**
   * Call function on leading edge of timeout
   * @default false
   */
  readonly leading?: boolean;

  /**
   * Call function on trailing edge of timeout
   * @default true
   */
  readonly trailing?: boolean;

  /**
   * Maximum time function is allowed to be delayed before forced invocation
   * @default undefined (no max wait)
   */
  readonly maxWait?: number;
}

/**
 * Options for throttle utility
 */
export interface ThrottleOptions {
  /**
   * Call function on leading edge of interval
   * @default true
   */
  readonly leading?: boolean;

  /**
   * Call function on trailing edge of interval
   * @default true
   */
  readonly trailing?: boolean;
}

/**
 * Debounced or throttled function with cancel method
 */
export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
  /**
   * Call the debounced/throttled function
   */
  (...args: Parameters<T>): ReturnType<T> | undefined;

  /**
   * Cancel any pending invocations
   */
  cancel(): void;

  /**
   * Immediately invoke pending function and cancel future invocations
   */
  flush(): ReturnType<T> | undefined;

  /**
   * Check if there are any pending invocations
   */
  pending(): boolean;
}

/**
 * Throttled function type (alias for DebouncedFunction)
 */
export type ThrottledFunction<T extends (...args: unknown[]) => unknown> = DebouncedFunction<T>;

// =============================================================================
// Object Manipulation Options
// =============================================================================

/**
 * Strategy for merging arrays during deep merge
 */
export type ArrayMergeStrategy = 'replace' | 'concat' | 'unique';

/**
 * Options for deep merge utility
 */
export interface DeepMergeOptions {
  /**
   * How to merge arrays
   * - 'replace': source array replaces target array
   * - 'concat': arrays are concatenated
   * - 'unique': concat + deduplicate by JSON.stringify
   * @default 'replace'
   */
  readonly arrayMergeStrategy?: ArrayMergeStrategy;

  /**
   * Maximum recursion depth to prevent stack overflow
   * @default 10
   */
  readonly maxDepth?: number;

  /**
   * Allow merging of arrays with different lengths
   * @default true
   */
  readonly allowArrayLengthMismatch?: boolean;
}

// =============================================================================
// String Manipulation Options
// =============================================================================

/**
 * Options for truncate utility
 */
export interface TruncateOptions {
  /**
   * Maximum length before truncation
   * @default 100
   */
  readonly maxLength?: number;

  /**
   * String to append when truncated
   * @default '...'
   */
  readonly ellipsis?: string;

  /**
   * Truncate at word boundary (don't break words)
   * @default true
   */
  readonly wordBoundary?: boolean;

  /**
   * Include ellipsis in max length calculation
   * @default false
   */
  readonly includeEllipsisInLength?: boolean;
}

/**
 * Options for slugify utility
 */
export interface SlugifyOptions {
  /**
   * Separator character (e.g., '-', '_')
   * @default '-'
   */
  readonly separator?: string;

  /**
   * Convert to lowercase
   * @default true
   */
  readonly lowercase?: boolean;

  /**
   * Remove accents/diacritics (e.g., á -> a)
   * @default true
   */
  readonly removeAccents?: boolean;

  /**
   * Strict mode: remove all non-alphanumeric chars except separator
   * @default false
   */
  readonly strict?: boolean;
}

// =============================================================================
// Async & Retry Options
// =============================================================================

/**
 * Options for retry utility
 */
export interface RetryOptions {
  /**
   * Maximum number of retry attempts
   * @default 3
   */
  readonly maxAttempts?: number;

  /**
   * Initial delay in milliseconds before first retry
   * @default 1000
   */
  readonly initialDelay?: number;

  /**
   * Backoff multiplier (exponential backoff)
   * @default 2 (delays: 1s, 2s, 4s, 8s...)
   */
  readonly backoffMultiplier?: number;

  /**
   * Maximum delay in milliseconds
   * @default 30000 (30 seconds)
   */
  readonly maxDelay?: number;

  /**
   * Add random jitter to delay (prevents thundering herd)
   * @default true
   */
  readonly jitter?: boolean;

  /**
   * Predicate to determine if error is retryable
   * @default () => true (retry all errors)
   */
  readonly shouldRetry?: (error: unknown, attempt: number) => boolean;

  /**
   * Callback invoked before each retry
   */
  readonly onRetry?: (error: unknown, attempt: number, delay: number) => void;
}

/**
 * Result wrapper for operations that may fail
 */
export type Result<T, E = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

// =============================================================================
// Color & Theming Types
// =============================================================================

/**
 * RGB color representation
 */
export interface RGB {
  readonly r: number; // 0-255
  readonly g: number; // 0-255
  readonly b: number; // 0-255
}

/**
 * RGBA color representation (RGB + alpha)
 */
export interface RGBA extends RGB {
  readonly a: number; // 0-1
}

/**
 * HSL color representation
 */
export interface HSL {
  readonly h: number; // 0-360
  readonly s: number; // 0-100
  readonly l: number; // 0-100
}

/**
 * HSLA color representation (HSL + alpha)
 */
export interface HSLA extends HSL {
  readonly a: number; // 0-1
}

/**
 * Contrast ratio calculation result (WCAG)
 */
export interface ContrastRatio {
  /**
   * Contrast ratio (1-21)
   */
  readonly ratio: number;

  /**
   * Passes WCAG 2.2 AA for normal text (4.5:1)
   */
  readonly passesAA: boolean;

  /**
   * Passes WCAG 2.2 AAA for normal text (7:1)
   */
  readonly passesAAA: boolean;

  /**
   * Passes WCAG 2.2 AA for large text (3:1)
   */
  readonly passesAALarge: boolean;

  /**
   * Passes WCAG 2.2 AAA for large text (4.5:1)
   */
  readonly passesAAALarge: boolean;
}

// =============================================================================
// Collection Utilities Types
// =============================================================================

/**
 * Comparator function for sorting
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Key extractor function for grouping/uniqueness
 */
export type KeyExtractor<T> = (item: T) => string | number;

/**
 * Pagination options for chunking
 */
export interface PaginationOptions {
  /**
   * Number of items per page/chunk
   */
  readonly pageSize: number;

  /**
   * Current page number (1-indexed)
   * @default 1
   */
  readonly page?: number;
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
  /**
   * Items in current page
   */
  readonly items: readonly T[];

  /**
   * Total number of items across all pages
   */
  readonly totalItems: number;

  /**
   * Total number of pages
   */
  readonly totalPages: number;

  /**
   * Current page number (1-indexed)
   */
  readonly currentPage: number;

  /**
   * Number of items per page
   */
  readonly pageSize: number;

  /**
   * Whether there is a next page
   */
  readonly hasNextPage: boolean;

  /**
   * Whether there is a previous page
   */
  readonly hasPreviousPage: boolean;
}

// =============================================================================
// Performance & Telemetry Types
// =============================================================================

/**
 * Performance timing result
 */
export interface PerformanceTiming {
  /**
   * Operation name
   */
  readonly name: string;

  /**
   * Duration in milliseconds
   */
  readonly duration: number;

  /**
   * Start timestamp (performance.now())
   */
  readonly startTime: number;

  /**
   * End timestamp (performance.now())
   */
  readonly endTime: number;

  /**
   * Additional metadata
   */
  readonly metadata?: Record<string, unknown>;
}

/**
 * Options for performance measurement
 */
export interface PerformanceMeasureOptions {
  /**
   * Measurement name
   */
  readonly name: string;

  /**
   * Whether to log to console
   * @default false
   */
  readonly logToConsole?: boolean;

  /**
   * Additional metadata to attach
   */
  readonly metadata?: Record<string, unknown>;
}

// =============================================================================
// Accessibility Types
// =============================================================================

/**
 * Arrow key directions for keyboard navigation
 */
export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

/**
 * Arrow key handler function
 */
export type ArrowKeyHandler = (event: KeyboardEvent) => void;

/**
 * Arrow key handler map
 */
export interface ArrowKeyHandlers {
  readonly ArrowUp?: ArrowKeyHandler;
  readonly ArrowDown?: ArrowKeyHandler;
  readonly ArrowLeft?: ArrowKeyHandler;
  readonly ArrowRight?: ArrowKeyHandler;
}

/**
 * Options for building aria labels
 */
export interface BuildAriaLabelOptions {
  /**
   * Direct label text
   */
  readonly label?: string;

  /**
   * ID(s) of labeling element(s)
   */
  readonly labelledBy?: string | readonly string[];

  /**
   * ID(s) of describing element(s)
   */
  readonly describedBy?: string | readonly string[];

  /**
   * Additional description text
   */
  readonly description?: string;
}

/**
 * Options for roving tabindex
 */
export interface RovingTabindexOptions {
  /**
   * Selector for focusable items
   */
  readonly itemSelector?: string;

  /**
   * Enable keyboard navigation
   * @default true
   */
  readonly enableKeyboard?: boolean;

  /**
   * Enable looping (wrap around)
   * @default true
   */
  readonly loop?: boolean;

  /**
   * Orientation of navigation
   * @default 'horizontal'
   */
  readonly orientation?: 'horizontal' | 'vertical' | 'both';
}

/**
 * Roving tabindex manager interface
 */
export interface RovingTabindexManager {
  /**
   * Get current focused index
   */
  readonly getCurrentIndex: () => number;

  /**
   * Focus item at index
   */
  readonly focusAt: (index: number) => void;

  /**
   * Focus first item
   */
  readonly focusFirst: () => void;

  /**
   * Focus last item
   */
  readonly focusLast: () => void;

  /**
   * Focus next item
   */
  readonly focusNext: () => void;

  /**
   * Focus previous item
   */
  readonly focusPrevious: () => void;

  /**
   * Cleanup and remove listeners
   */
  readonly destroy: () => void;
}

/**
 * Animation duration values in milliseconds
 */
export type AnimationDuration = 0 | 150 | 200 | 300 | 500;

// =============================================================================
// Validation & Safety Types
// =============================================================================

/**
 * Branded type for sanitized HTML content
 */
export type SanitizedHtml = string & { readonly __brand: 'SanitizedHtml' };

/**
 * Branded type for safe URL
 */
export type SafeUrl = string & { readonly __brand: 'SafeUrl' };

/**
 * Branded type for validated email
 */
export type ValidatedEmail = string & { readonly __brand: 'ValidatedEmail' };

/**
 * Allowed URL protocols
 */
export type UrlProtocol =
  | 'http://'
  | 'https://'
  | 'mailto:'
  | 'tel:'
  | 'sms:'
  | 'ftp://'
  | 'ftps://';

/**
 * HTML sanitization options
 */
export interface SanitizationOptions {
  /**
   * Allow specific HTML tags
   * @default ['b', 'i', 'em', 'strong', 'a', 'p', 'br']
   */
  readonly allowedTags?: readonly string[];

  /**
   * Allow specific attributes on allowed tags
   * @default ['href', 'title', 'target', 'rel']
   */
  readonly allowedAttributes?: readonly string[];

  /**
   * Allow specific protocols in URLs
   * @default ['http://', 'https://', 'mailto:']
   */
  readonly allowedProtocols?: readonly UrlProtocol[];

  /**
   * Strip all tags (keep only text content)
   * @default false
   */
  readonly stripAllTags?: boolean;
}
