/**
 * isValidEmail - Lightweight email validation.
 *
 * Uses a pragmatic pattern (RFC-lite) suitable for UI validation without
 * over-restricting valid addresses.
 */
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
  if (!email || email.length > 254) {
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
