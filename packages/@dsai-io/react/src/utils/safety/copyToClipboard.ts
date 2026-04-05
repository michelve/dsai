/**
 * @file copyToClipboard - Clipboard write with fallback
 * @module @dsai-io/react/utils/safety
 *
 * Enterprise-grade clipboard utility with:
 * - Modern Clipboard API support
 * - Fallback for older browsers
 * - HTTPS/localhost requirement handling
 * - Error handling and validation
 */

/**
 * Result of clipboard operation
 */
export interface ClipboardResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Method used for the operation */
  method: 'clipboard-api' | 'exec-command' | 'none';
}

const METHOD_CLIPBOARD_API = 'clipboard-api' as const;
const METHOD_EXEC_COMMAND = 'exec-command' as const;

/**
 * Options for clipboard operations
 */
export interface CopyToClipboardOptions {
  /** Timeout in milliseconds for the operation (default: 5000) */
  timeout?: number;
  /** Callback when copy succeeds */
  onSuccess?: () => void;
  /** Callback when copy fails */
  onError?: (error: Error) => void;
}

/**
 * Check if the Clipboard API is available
 */
function hasClipboardApi(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard !== 'undefined' &&
    typeof navigator.clipboard.writeText === 'function'
  );
}

/**
 * Check if we're in a secure context (required for Clipboard API)
 */
function isSecureContext(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  // isSecureContext is true for HTTPS and localhost
  return window.isSecureContext === true;
}

/**
 * Fallback copy using deprecated execCommand
 * Used for older browsers or insecure contexts
 */
function fallbackCopy(text: string): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  // Create a temporary textarea
  const textarea = document.createElement('textarea');
  textarea.value = text;

  // Make it invisible but keep in DOM for selection
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '-9999px';
  textarea.style.opacity = '0';
  textarea.setAttribute('readonly', ''); // Prevent keyboard on mobile
  textarea.setAttribute('aria-hidden', 'true');

  document.body.appendChild(textarea);

  try {
    // Select the text
    textarea.select();
    textarea.setSelectionRange(0, text.length); // For mobile

    // Execute copy command
    const success = document.execCommand('copy');
    return success;
  } catch {
    return false;
  } finally {
    // Clean up
    textarea.remove();
  }
}

/**
 * Copy text to the system clipboard
 *
 * Uses the modern Clipboard API when available with fallback
 * to execCommand for older browsers. Handles security context
 * requirements and provides detailed error information.
 *
 * @param text - Text to copy to clipboard
 * @param options - Copy options
 * @returns Promise resolving to clipboard result
 *
 * @example
 * ```tsx
 * // Basic usage
 * const result = await copyToClipboard('Hello, World!');
 * if (result.success) {
 *   console.log('Copied successfully');
 * }
 *
 * // With callbacks
 * await copyToClipboard('Copy me', {
 *   onSuccess: () => showToast('Copied!'),
 *   onError: (error) => showToast(`Failed: ${error.message}`),
 * });
 *
 * // In React component
 * function CopyButton({ text }: { text: string }) {
 *   const [copied, setCopied] = useState(false);
 *
 *   const handleCopy = async () => {
 *     const result = await copyToClipboard(text);
 *     if (result.success) {
 *       setCopied(true);
 *       setTimeout(() => setCopied(false), 2000);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleCopy}>
 *       {copied ? 'Copied!' : 'Copy'}
 *     </button>
 *   );
 * }
 *
 * // Copy with timeout
 * await copyToClipboard(longText, { timeout: 10000 });
 * ```
 */
export async function copyToClipboard(
  text: string,
  options: CopyToClipboardOptions = {}
): Promise<ClipboardResult> {
  const { timeout = 5000, onSuccess, onError } = options;

  // Validate input
  if (text === null || text === undefined) {
    const error = new Error('Text to copy cannot be null or undefined');
    onError?.(error);
    return {
      success: false,
      error: error.message,
      method: 'none',
    };
  }

  const textStr = String(text);

  // Check for SSR
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    const error = new Error('Clipboard operations require a browser environment');
    onError?.(error);
    return {
      success: false,
      error: error.message,
      method: 'none',
    };
  }

  // Try modern Clipboard API first
  if (hasClipboardApi() && isSecureContext()) {
    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Clipboard operation timed out')), timeout);
      });

      // Race between clipboard operation and timeout
      await Promise.race([navigator.clipboard.writeText(textStr), timeoutPromise]);

      onSuccess?.();
      return {
        success: true,
        method: METHOD_CLIPBOARD_API,
      };
    } catch (err) {
      // Clipboard API failed, try fallback
      const fallbackSuccess = fallbackCopy(textStr);
      if (fallbackSuccess) {
        onSuccess?.();
        return {
          success: true,
          method: METHOD_EXEC_COMMAND,
        };
      }

      const error = err instanceof Error ? err : new Error('Clipboard operation failed');
      onError?.(error);
      return {
        success: false,
        error: error.message,
        method: METHOD_CLIPBOARD_API,
      };
    }
  }

  // Use fallback for older browsers or insecure contexts
  const fallbackSuccess = fallbackCopy(textStr);
  if (fallbackSuccess) {
    onSuccess?.();
    return {
      success: true,
      method: METHOD_EXEC_COMMAND,
    };
  }

  const error = new Error('Clipboard access denied. Ensure you are on HTTPS or localhost.');
  onError?.(error);
  return {
    success: false,
    error: error.message,
    method: METHOD_EXEC_COMMAND,
  };
}
