/**
 * isValidUrl - Validates that a URL is well-formed and uses allowed protocols.
 *
 * By default allows http/https. Configure allowedSchemes to expand.
 */
export interface IsValidUrlOptions {
  allowedSchemes?: string[];
  allowHostnames?: string[];
  blockHostnames?: string[];
}

export function isValidUrl(
  href: string | undefined | null,
  options: IsValidUrlOptions = {}
): boolean {
  if (!href || typeof href !== 'string') {
    return false;
  }
  const { allowedSchemes = ['http', 'https'], allowHostnames, blockHostnames } = options;

  try {
    const url = new URL(href.trim());
    const scheme = url.protocol.replace(':', '');
    if (!allowedSchemes.includes(scheme)) {
      return false;
    }
    const hostname = url.hostname.toLowerCase();
    if (allowHostnames && allowHostnames.length > 0 && !allowHostnames.includes(hostname)) {
      return false;
    }
    if (blockHostnames && blockHostnames.length > 0 && blockHostnames.includes(hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export default isValidUrl;
