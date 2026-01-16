/**
 * @file readFromClipboard - Clipboard read with permission handling
 * @module @dsai-io/react/utils/safety
 *
 * Enterprise-grade clipboard read utility with:
 * - Modern Clipboard API support
 * - Permission request handling
 * - Security context validation
 * - Comprehensive error handling
 */

/**
 * Result of clipboard read operation
 */
export interface ClipboardReadResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** The text content if successful */
  text?: string;
  /** Error message if failed */
  error?: string;
  /** Whether permission was denied */
  permissionDenied?: boolean;
}

/**
 * Options for clipboard read operations
 */
export interface ReadFromClipboardOptions {
  /** Timeout in milliseconds for the operation (default: 5000) */
  timeout?: number;
  /** Callback when read succeeds */
  onSuccess?: (text: string) => void;
  /** Callback when read fails */
  onError?: (error: Error) => void;
}

/**
 * Check if the Clipboard API read is available
 */
function hasClipboardReadApi(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard !== 'undefined' &&
    typeof navigator.clipboard.readText === 'function'
  );
}

/**
 * Check if we're in a secure context (required for Clipboard API)
 */
function isSecureContext(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.isSecureContext === true;
}

/**
 * Check clipboard-read permission status
 */
async function checkClipboardPermission(): Promise<'granted' | 'denied' | 'prompt' | 'unknown'> {
  if (typeof navigator === 'undefined' || !navigator.permissions) {
    return 'unknown';
  }

  try {
    // Note: 'clipboard-read' permission query may not be supported in all browsers
    const permission = await navigator.permissions.query({
      name: 'clipboard-read' as PermissionName,
    });
    return permission.state;
  } catch {
    // Permission query not supported
    return 'unknown';
  }
}

/**
 * Read text from the system clipboard
 *
 * Uses the modern Clipboard API with proper permission handling.
 * Reading from clipboard requires user gesture in most browsers
 * and may prompt for permission.
 *
 * @param options - Read options
 * @returns Promise resolving to clipboard read result
 *
 * @example
 * ```tsx
 * // Basic usage
 * const result = await readFromClipboard();
 * if (result.success) {
 *   console.log('Clipboard content:', result.text);
 * }
 *
 * // With callbacks
 * await readFromClipboard({
 *   onSuccess: (text) => setInputValue(text),
 *   onError: (error) => showToast(`Failed: ${error.message}`),
 * });
 *
 * // Handle permission denied
 * const result = await readFromClipboard();
 * if (result.permissionDenied) {
 *   showToast('Please allow clipboard access');
 * }
 *
 * // In React component
 * function PasteButton({ onPaste }: { onPaste: (text: string) => void }) {
 *   const handlePaste = async () => {
 *     const result = await readFromClipboard();
 *     if (result.success && result.text) {
 *       onPaste(result.text);
 *     } else if (result.permissionDenied) {
 *       alert('Clipboard access denied');
 *     }
 *   };
 *
 *   return <button onClick={handlePaste}>Paste</button>;
 * }
 *
 * // With timeout
 * await readFromClipboard({ timeout: 10000 });
 * ```
 */
export async function readFromClipboard(
  options: ReadFromClipboardOptions = {}
): Promise<ClipboardReadResult> {
  const { timeout = 5000, onSuccess, onError } = options;

  // Check for SSR
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    const error = new Error('Clipboard operations require a browser environment');
    onError?.(error);
    return {
      success: false,
      error: error.message,
    };
  }

  // Check for Clipboard API support
  if (!hasClipboardReadApi()) {
    const error = new Error('Clipboard read API is not supported in this browser');
    onError?.(error);
    return {
      success: false,
      error: error.message,
    };
  }

  // Check for secure context
  if (!isSecureContext()) {
    const error = new Error('Clipboard read requires a secure context (HTTPS or localhost)');
    onError?.(error);
    return {
      success: false,
      error: error.message,
    };
  }

  // Check permission status (informational)
  const permissionStatus = await checkClipboardPermission();
  if (permissionStatus === 'denied') {
    const error = new Error('Clipboard read permission denied');
    onError?.(error);
    return {
      success: false,
      error: error.message,
      permissionDenied: true,
    };
  }

  try {
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Clipboard read operation timed out')), timeout);
    });

    // Race between clipboard operation and timeout
    const text = await Promise.race([navigator.clipboard.readText(), timeoutPromise]);

    onSuccess?.(text);
    return {
      success: true,
      text,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Clipboard read failed');

    // Check for permission errors
    const isPermissionError =
      error.name === 'NotAllowedError' ||
      error.message.includes('permission') ||
      error.message.includes('denied');

    onError?.(error);
    return {
      success: false,
      error: error.message,
      permissionDenied: isPermissionError,
    };
  }
}
