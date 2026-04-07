/**
 * isValidEmail - Lightweight email validation.
 *
 * Uses a pragmatic pattern (RFC-lite) suitable for UI validation without
 * over-restricting valid addresses.
 */

const MAX_DOMAIN_LABEL_LENGTH = 63;
const MAX_EMAIL_LENGTH = 254;

/**
 * Validate a single domain label (e.g. "example" in "example.com").
 */
function isValidDomainLabel(label: string): boolean {
  if (!label || label.length > MAX_DOMAIN_LABEL_LENGTH) {
    return false;
  }
  if (label.startsWith('-') || label.endsWith('-')) {
    return false;
  }
  return /^[A-Za-z0-9-]+$/.test(label);
}

/**
 * Validate the domain part of an email address.
 */
function isValidDomain(domain: string): boolean {
  if (/[<>\s]/.test(domain)) {
    return false;
  }

  const labels = domain.split('.');
  if (labels.length < 2) {
    return false;
  }

  return labels.every(isValidDomainLabel);
}

export function isValidEmail(value: string | undefined | null): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }
  const email = value.trim();
  if (!email || email.length > MAX_EMAIL_LENGTH) {
    return false;
  }

  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) {
    return false;
  }

  if (localPart.length > 64 || /[<>\s]/.test(localPart)) {
    return false;
  }

  return isValidDomain(domain);
}

export default isValidEmail;
