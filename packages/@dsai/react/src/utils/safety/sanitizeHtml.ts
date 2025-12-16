/**
 * @file sanitizeHtml - HTML sanitization with XSS protection
 * @module @dsai/react/utils/safety
 *
 * Enterprise-grade HTML sanitizer with:
 * - Allowlist-based tag and attribute filtering
 * - XSS attack prevention
 * - Data URI blocking
 * - Event handler stripping
 * - Protocol validation
 */

/**
 * Options for HTML sanitization
 */
export interface SanitizeHtmlOptions {
  /** Allowed HTML tags (default: safe formatting tags) */
  allowedTags?: readonly string[];
  /** Allowed attributes per tag (default: safe attributes only) */
  allowedAttributes?: Readonly<Record<string, readonly string[]>>;
  /** Allow data: URIs (default: false for security) */
  allowDataUrls?: boolean;
  /** Custom protocol allowlist for href/src (default: http, https, mailto, tel) */
  allowedProtocols?: readonly string[];
  /** Strip all tags and return text only (default: false) */
  stripAllTags?: boolean;
}

/**
 * Default safe tags that don't pose XSS risks
 */
const DEFAULT_ALLOWED_TAGS = Object.freeze([
  // Text formatting
  'b',
  'i',
  'u',
  's',
  'em',
  'strong',
  'small',
  'sub',
  'sup',
  'mark',
  // Structure
  'p',
  'br',
  'hr',
  'div',
  'span',
  // Lists
  'ul',
  'ol',
  'li',
  // Links (with protocol validation)
  'a',
  // Headings
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  // Semantic
  'blockquote',
  'code',
  'pre',
  'abbr',
  'cite',
  'q',
  // Tables
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
] as const);

/**
 * Tags whose content should be completely removed
 */
const DANGEROUS_TAGS = new Set([
  'script',
  'style',
  'noscript',
  'iframe',
  'object',
  'embed',
  'applet',
  'frame',
  'frameset',
  'base',
  'meta',
  'link',
  'template',
]);

/**
 * Default safe attributes per tag
 * All other attributes are stripped
 */
const DEFAULT_ALLOWED_ATTRIBUTES: Readonly<Record<string, readonly string[]>> = Object.freeze({
  a: ['href', 'title', 'target', 'rel'],
  abbr: ['title'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan', 'scope'],
  '*': ['class', 'id', 'lang', 'dir'], // Global safe attributes
});

/**
 * Default safe protocols for URLs
 */
const DEFAULT_ALLOWED_PROTOCOLS = Object.freeze(['http:', 'https:', 'mailto:', 'tel:'] as const);

/**
 * Find the end of a tag, respecting quoted attribute values
 * This handles cases like: <a href="data:text/html,<script>">
 */
function findTagEnd(input: string, start: number): number {
  let pos = start + 1; // Skip the opening <
  let inQuote: string | null = null;

  while (pos < input.length) {
    const char = input.charAt(pos);

    if (inQuote) {
      // Inside a quoted value - only look for closing quote
      if (char === inQuote) {
        inQuote = null;
      }
    } else {
      // Not in a quote
      if (char === '"' || char === "'") {
        inQuote = char;
      } else if (char === '>') {
        return pos;
      }
    }
    pos++;
  }

  return -1; // No closing > found
}

/**
 * Escape HTML entities in text content
 */
function escapeHtml(text: string): string {
  const escapeMap = new Map<string, string>([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#x27;'],
  ]);
  return text.replace(/[&<>"']/g, (char) => escapeMap.get(char) ?? char);
}

/**
 * Check if a URL has a safe protocol
 */
function isSafeUrl(
  url: string,
  allowedProtocols: readonly string[],
  allowDataUrls: boolean
): boolean {
  const trimmed = url.trim().toLowerCase();

  // Empty or relative URLs are safe
  if (!trimmed || trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return true;
  }

  // Check for dangerous protocols
  if (/^javascript:/i.test(trimmed) || /^vbscript:/i.test(trimmed)) {
    return false;
  }

  // Handle data: URLs
  if (/^data:/i.test(trimmed)) {
    if (allowDataUrls && /^data:image\/(gif|png|jpeg|webp);base64,/i.test(trimmed)) {
      return true;
    }
    return false;
  }

  // Check against allowed protocols
  try {
    const parsed = new URL(url, 'http://example.com');
    return allowedProtocols.some((p) => parsed.protocol.toLowerCase() === p.toLowerCase());
  } catch {
    // If URL parsing fails, only allow relative-looking URLs
    return !trimmed.includes(':');
  }
}

/**
 * Check if an attribute value contains dangerous patterns
 */
function isDangerousValue(value: string): boolean {
  const patterns = [/javascript:/i, /vbscript:/i, /expression\s*\(/i, /on\w+\s*=/i];
  return patterns.some((pattern) => pattern.test(value));
}

/**
 * Parse attribute string and return safe attributes
 */
function parseAttributes(
  attrString: string,
  allowedSet: Set<string>,
  allowedProtocols: readonly string[],
  allowDataUrls: boolean
): string[] {
  const result: string[] = [];
  let pos = 0;
  const str = attrString.trim();

  while (pos < str.length) {
    // Skip whitespace
    while (pos < str.length && /\s/.test(str.charAt(pos))) {
      pos++;
    }
    if (pos >= str.length) {
      break;
    }

    // Read attribute name
    let name = '';
    while (pos < str.length && /[\w-]/.test(str.charAt(pos))) {
      name += str.charAt(pos);
      pos++;
    }
    if (!name) {
      pos++;
      continue;
    }

    const nameLower = name.toLowerCase();

    // Skip whitespace around =
    while (pos < str.length && /\s/.test(str.charAt(pos))) {
      pos++;
    }

    let value = '';
    if (pos < str.length && str.charAt(pos) === '=') {
      pos++; // skip =
      while (pos < str.length && /\s/.test(str.charAt(pos))) {
        pos++;
      }

      // Read value
      const quote = str.charAt(pos);
      if (quote === '"' || quote === "'") {
        pos++; // skip opening quote
        while (pos < str.length && str.charAt(pos) !== quote) {
          value += str.charAt(pos);
          pos++;
        }
        pos++; // skip closing quote
      } else {
        // Unquoted value
        while (pos < str.length && !/[\s>]/.test(str.charAt(pos))) {
          value += str.charAt(pos);
          pos++;
        }
      }
    }

    // Filter attribute
    if (!allowedSet.has(nameLower)) {
      continue;
    }
    if (nameLower.startsWith('on')) {
      continue;
    }
    if (isDangerousValue(value)) {
      continue;
    }

    // Validate URL attributes
    if (nameLower === 'href' || nameLower === 'src') {
      if (!isSafeUrl(value, allowedProtocols, allowDataUrls)) {
        continue;
      }
    }

    // Add safe attribute
    if (value) {
      result.push(`${nameLower}="${escapeHtml(value)}"`);
    } else {
      result.push(nameLower);
    }
  }

  return result;
}

/**
 * Sanitize HTML string by removing dangerous content
 *
 * Uses an allowlist-based approach to strip unsafe tags,
 * attributes, and URL protocols. Protects against:
 * - Script injection (script tags, event handlers)
 * - Protocol-based XSS (javascript:, vbscript:)
 * - Data URI attacks
 * - CSS expression injection
 *
 * @param html - HTML string to sanitize
 * @param options - Sanitization options
 * @returns Sanitized HTML string
 *
 * @example
 * ```tsx
 * // Basic usage - strip dangerous content
 * const safe = sanitizeHtml('<p onclick="alert(1)">Hello <script>evil()</script></p>');
 * // Returns: '<p>Hello </p>'
 *
 * // Custom allowed tags
 * const safe = sanitizeHtml(userHtml, {
 *   allowedTags: ['p', 'b', 'i', 'a'],
 *   allowedAttributes: {
 *     a: ['href'],
 *   },
 * });
 *
 * // Strip all tags - return text only
 * const text = sanitizeHtml('<p>Hello <b>world</b></p>', { stripAllTags: true });
 * // Returns: 'Hello world'
 *
 * // Block javascript: URLs
 * const safe = sanitizeHtml('<a href="javascript:alert(1)">Click</a>');
 * // Returns: '<a>Click</a>' (href removed)
 *
 * // In React component with dangerouslySetInnerHTML
 * function SafeHtml({ html }: { html: string }) {
 *   const sanitized = sanitizeHtml(html);
 *   return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
 * }
 * ```
 */
export function sanitizeHtml(html: string, options: SanitizeHtmlOptions = {}): string {
  // Handle null/undefined
  if (html === null || html === undefined) {
    return '';
  }

  const input = String(html);

  // Empty string short-circuit
  if (!input.trim()) {
    return '';
  }

  const {
    allowedTags = DEFAULT_ALLOWED_TAGS,
    allowedAttributes = DEFAULT_ALLOWED_ATTRIBUTES,
    allowDataUrls = false,
    allowedProtocols = DEFAULT_ALLOWED_PROTOCOLS,
    stripAllTags = false,
  } = options;

  // Convert to lowercase set for fast lookup
  const allowedTagSet = new Set(allowedTags.map((t) => t.toLowerCase()));

  // Strip all tags mode - return text only
  if (stripAllTags) {
    return input
      .replace(/<[^>]*>/g, '') // Remove all tags
      .replace(/&nbsp;/gi, ' ') // Convert nbsp
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  // Process HTML
  let result = '';
  let i = 0;

  while (i < input.length) {
    const currentChar = input.charAt(i);

    if (currentChar === '<') {
      // Find tag end, respecting quoted attribute values
      const tagEnd = findTagEnd(input, i);
      if (tagEnd === -1) {
        // Malformed tag - escape and stop
        result += escapeHtml(input.slice(i));
        break;
      }

      const tagContent = input.slice(i + 1, tagEnd);

      // Skip comments
      if (tagContent.startsWith('!--')) {
        const commentEnd = input.indexOf('-->', i);
        if (commentEnd === -1) {
          break;
        }
        i = commentEnd + 3;
        continue;
      }

      // Check for closing tag
      const isClosing = tagContent.startsWith('/');
      const tagPart = isClosing ? tagContent.slice(1) : tagContent;

      // Extract tag name
      const tagNameMatch = tagPart.match(/^(\w+)/);
      if (!tagNameMatch || !tagNameMatch[1]) {
        i = tagEnd + 1;
        continue;
      }

      const tagName = tagNameMatch[1].toLowerCase();

      // Skip dangerous tags AND their content entirely
      if (DANGEROUS_TAGS.has(tagName) && !isClosing) {
        // Find the closing tag for this dangerous element
        const closingTag = `</${tagName}`;
        const closingPos = input.toLowerCase().indexOf(closingTag, tagEnd);
        if (closingPos !== -1) {
          // Skip to after the closing tag
          const closingEnd = input.indexOf('>', closingPos);
          i = closingEnd !== -1 ? closingEnd + 1 : input.length;
        } else {
          // No closing tag - skip to end
          i = input.length;
        }
        continue;
      }

      // Check if tag is allowed
      if (!allowedTagSet.has(tagName)) {
        i = tagEnd + 1;
        continue;
      }

      // Process closing tag
      if (isClosing) {
        result += `</${tagName}>`;
        i = tagEnd + 1;
        continue;
      }

      // Process opening tag with attributes
      const isSelfClosing = tagContent.endsWith('/');
      const attrString = tagPart.slice(tagName.length);

      // Get allowed attributes for this tag
      const getAllowedForKey = (
        attrs: Readonly<Record<string, readonly string[]>>,
        key: string
      ): readonly string[] => {
        if (Object.prototype.hasOwnProperty.call(attrs, key)) {
          const entries = Object.entries(attrs);
          for (const [k, v] of entries) {
            if (k === key) {
              return v;
            }
          }
        }
        return [];
      };
      const tagAllowed = getAllowedForKey(allowedAttributes, tagName);
      const globalAllowed = getAllowedForKey(allowedAttributes, '*');
      const allAllowed = new Set([
        ...(tagAllowed ?? []).map((a) => a.toLowerCase()),
        ...(globalAllowed ?? []).map((a) => a.toLowerCase()),
      ]);

      // Parse and filter attributes
      const safeAttrs = parseAttributes(attrString, allAllowed, allowedProtocols, allowDataUrls);

      // Build sanitized tag
      const attrsStr = safeAttrs.length > 0 ? ` ${safeAttrs.join(' ')}` : '';
      const closeSlash = isSelfClosing ? ' /' : '';
      result += `<${tagName}${attrsStr}${closeSlash}>`;

      i = tagEnd + 1;
    } else {
      // Regular character - add to result
      result += currentChar;
      i++;
    }
  }

  return result;
}

// Export defaults for customization
export { DEFAULT_ALLOWED_ATTRIBUTES, DEFAULT_ALLOWED_PROTOCOLS, DEFAULT_ALLOWED_TAGS };
