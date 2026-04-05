/**
 * isValidEmail - Lightweight email validation.
 *
 * Uses a pragmatic pattern (RFC-lite) suitable for UI validation without
 * over-restricting valid addresses.
 */
/**
 * Validate a single domain label (e.g. "example" in "example.com").
 */
function isValidDomainLabel(label: string): boolean {
  if (!label || label.length > 63) {
    return false;
  }
  if (label.startsWith('-') || label.endsWith('-')) {
    return false;
  }
  return /^[A-Za-z0-9-]+$/.test(label);
}

export function isValidEmail(value: string | undefined | null): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }
  const email = value.trim();
  if (!email || email.length > 254) {
    return false;
  }

  const [localPart, domain] = email.split('@');
  if (!localPart || !domain || localPart.length > 64) {
    return false;
  }

  // Reject obvious invalid characters early
  if (/[<>\s]/.test(localPart) || /[<>\s]/.test(domain)) {
    return false;
  }

  const labels = domain.split('.');
  if (labels.length < 2) {
    return false;
  }

  return labels.every(isValidDomainLabel);
}

export default isValidEmail;
