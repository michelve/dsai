/**
 * @file Additional coverage tests for safety utilities
 *
 * Covers untested branches in:
 * - readFromClipboard: permission denied, clipboard API unavailable, errors, non-secure context
 * - copyToClipboard: fallback (execCommand), permission errors, successful copy w/ fallback
 * - sanitizeUrl: XSS vectors, encoded attacks, tel/mailto, null bytes, control chars
 */

import { copyToClipboard } from '../safety/copyToClipboard';
import { readFromClipboard } from '../safety/readFromClipboard';
import { sanitizeUrl } from '../safety/sanitizeUrl';

// =============================================================================
// readFromClipboard - additional branch coverage
// =============================================================================

describe('readFromClipboard (additional coverage)', () => {
  const originalClipboard = navigator.clipboard;
  const originalIsSecureContext = window.isSecureContext;
  const originalPermissions = navigator.permissions;

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: originalIsSecureContext,
      configurable: true,
    });
    Object.defineProperty(navigator, 'permissions', {
      value: originalPermissions,
      configurable: true,
    });
  });

  it('should return error when clipboard read API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {},
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    });

    const result = await readFromClipboard();
    expect(result.success).toBe(false);
    expect(result.error).toContain('not supported');
  });

  it('should call onError when clipboard read API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {},
      configurable: true,
    });
    const onError = jest.fn();

    const result = await readFromClipboard({ onError });
    expect(result.success).toBe(false);
    expect(onError).toHaveBeenCalled();
  });

  it('should return error when not in secure context', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: jest.fn() },
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: false,
      configurable: true,
    });

    const result = await readFromClipboard();
    expect(result.success).toBe(false);
    expect(result.error).toContain('secure context');
  });

  it('should return permissionDenied when permission is denied via query', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: jest.fn() },
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'permissions', {
      value: {
        query: jest.fn().mockResolvedValue({ state: 'denied' }),
      },
      configurable: true,
    });

    const onError = jest.fn();
    const result = await readFromClipboard({ onError });
    expect(result.success).toBe(false);
    expect(result.permissionDenied).toBe(true);
    expect(onError).toHaveBeenCalled();
  });

  it('should handle permission query failure gracefully (returns unknown)', async () => {
    const mockReadText = jest.fn().mockResolvedValue('text content');
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: mockReadText },
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'permissions', {
      value: {
        query: jest.fn().mockRejectedValue(new Error('not supported')),
      },
      configurable: true,
    });

    const result = await readFromClipboard();
    expect(result.success).toBe(true);
    expect(result.text).toBe('text content');
  });

  it('should handle missing permissions API gracefully', async () => {
    const mockReadText = jest.fn().mockResolvedValue('clipboard data');
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: mockReadText },
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'permissions', {
      value: undefined,
      configurable: true,
    });

    const result = await readFromClipboard();
    expect(result.success).toBe(true);
    expect(result.text).toBe('clipboard data');
  });

  it('should detect NotAllowedError as permission denied', async () => {
    const notAllowedError = new DOMException('Not allowed', 'NotAllowedError');
    const mockReadText = jest.fn().mockRejectedValue(notAllowedError);
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: mockReadText },
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'permissions', {
      value: {
        query: jest.fn().mockResolvedValue({ state: 'prompt' }),
      },
      configurable: true,
    });

    const result = await readFromClipboard();
    expect(result.success).toBe(false);
    expect(result.permissionDenied).toBe(true);
  });

  it('should handle non-Error thrown from clipboard readText', async () => {
    const mockReadText = jest.fn().mockRejectedValue('string error');
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: mockReadText },
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'permissions', {
      value: {
        query: jest.fn().mockResolvedValue({ state: 'granted' }),
      },
      configurable: true,
    });

    const result = await readFromClipboard();
    expect(result.success).toBe(false);
    expect(result.error).toBe('Clipboard read failed');
  });

  it('should call onSuccess callback when read succeeds', async () => {
    const mockReadText = jest.fn().mockResolvedValue('hello');
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: mockReadText },
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'permissions', {
      value: {
        query: jest.fn().mockResolvedValue({ state: 'granted' }),
      },
      configurable: true,
    });

    const onSuccess = jest.fn();
    const result = await readFromClipboard({ onSuccess });
    expect(result.success).toBe(true);
    expect(onSuccess).toHaveBeenCalledWith('hello');
  });
});

// =============================================================================
// copyToClipboard - additional branch coverage
// =============================================================================

describe('copyToClipboard (additional coverage)', () => {
  const originalClipboard = navigator.clipboard;
  const originalIsSecureContext = window.isSecureContext;

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: originalIsSecureContext,
      configurable: true,
    });
  });

  it('should use fallback (execCommand) when clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {},
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: false,
      configurable: true,
    });

    const mockExecCommand = jest.fn().mockReturnValue(true);
    document.execCommand = mockExecCommand;

    const result = await copyToClipboard('test text');
    expect(result.success).toBe(true);
    expect(result.method).toBe('exec-command');
  });

  it('should call onSuccess when fallback succeeds', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {},
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: false,
      configurable: true,
    });

    document.execCommand = jest.fn().mockReturnValue(true);
    const onSuccess = jest.fn();

    await copyToClipboard('test', { onSuccess });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should return failure when both clipboard API and fallback fail', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {},
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: false,
      configurable: true,
    });

    document.execCommand = jest.fn().mockReturnValue(false);
    const onError = jest.fn();

    const result = await copyToClipboard('test', { onError });
    expect(result.success).toBe(false);
    expect(result.method).toBe('exec-command');
    expect(onError).toHaveBeenCalled();
  });

  it('should try fallback when clipboard API throws and fallback succeeds', async () => {
    const mockWriteText = jest.fn().mockRejectedValue(new Error('Not allowed'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    });

    document.execCommand = jest.fn().mockReturnValue(true);
    const onSuccess = jest.fn();

    const result = await copyToClipboard('test', { onSuccess });
    expect(result.success).toBe(true);
    expect(result.method).toBe('exec-command');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should handle clipboard API throw with fallback also failing', async () => {
    const mockWriteText = jest.fn().mockRejectedValue(new Error('API failed'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    });

    document.execCommand = jest.fn().mockReturnValue(false);
    const onError = jest.fn();

    const result = await copyToClipboard('test', { onError });
    expect(result.success).toBe(false);
    expect(result.method).toBe('clipboard-api');
    expect(onError).toHaveBeenCalled();
  });

  it('should handle non-Error thrown from clipboard API', async () => {
    const mockWriteText = jest.fn().mockRejectedValue('string error');
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    });

    document.execCommand = jest.fn().mockReturnValue(false);

    const result = await copyToClipboard('test');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Clipboard operation failed');
  });

  it('should handle undefined input', async () => {
    const result = await copyToClipboard(undefined as unknown as string);
    expect(result.success).toBe(false);
    expect(result.method).toBe('none');
  });
});

// =============================================================================
// sanitizeUrl - additional branch coverage
// =============================================================================

describe('sanitizeUrl (additional coverage)', () => {
  describe('XSS vectors', () => {
    it('should block javascript: with various casings', () => {
      expect(sanitizeUrl('JavaScript:alert(1)')).toBe('#');
      expect(sanitizeUrl('JAVASCRIPT:alert(1)')).toBe('#');
      expect(sanitizeUrl('jAvAsCrIpT:alert(1)')).toBe('#');
    });

    it('should block vbscript:', () => {
      expect(sanitizeUrl('vbscript:MsgBox("XSS")')).toBe('#');
      expect(sanitizeUrl('VBScript:MsgBox("XSS")')).toBe('#');
    });

    it('should block file: protocol', () => {
      expect(sanitizeUrl('file:///etc/passwd')).toBe('#');
    });

    it('should block about: protocol', () => {
      expect(sanitizeUrl('about:blank')).toBe('#');
    });

    it('should block blob: protocol', () => {
      expect(sanitizeUrl('blob:https://example.com/uuid')).toBe('#');
    });
  });

  describe('encoded attacks', () => {
    it('should block doubly-encoded javascript:', () => {
      expect(sanitizeUrl('java%2573cript:alert(1)')).toBe('#');
    });

    it('should block URL-encoded protocol separator', () => {
      expect(sanitizeUrl('javascript%3Aalert(1)')).toBe('#');
    });

    it('should handle invalid URL encoding gracefully', () => {
      // %ZZ is invalid encoding - decodeURIComponent will throw
      const result = sanitizeUrl('https://example.com/%ZZ');
      // Should not throw, should handle gracefully
      expect(typeof result).toBe('string');
    });
  });

  describe('null bytes and control characters', () => {
    it('should remove null bytes from URLs', () => {
      const result = sanitizeUrl('https://example.com/\x00path');
      expect(result).not.toContain('\x00');
    });

    it('should remove control characters', () => {
      const result = sanitizeUrl('https://example.com/\x01\x02path');
      expect(result).not.toContain('\x01');
      expect(result).not.toContain('\x02');
    });
  });

  describe('tel and mailto protocols', () => {
    it('should allow tel: URLs', () => {
      expect(sanitizeUrl('tel:+1-555-123-4567')).toBe('tel:+1-555-123-4567');
    });

    it('should allow mailto: URLs', () => {
      expect(sanitizeUrl('mailto:user@example.com')).toBe('mailto:user@example.com');
    });

    it('should allow sms: URLs', () => {
      expect(sanitizeUrl('sms:+15551234567')).toBe('sms:+15551234567');
    });
  });

  describe('data URLs', () => {
    it('should block data URLs by default', () => {
      expect(sanitizeUrl('data:image/png;base64,abc')).toBe('#');
    });

    it('should allow data URLs with allowed MIME types when enabled', () => {
      expect(sanitizeUrl('data:image/png;base64,abc', { allowDataUrls: true })).toBe(
        'data:image/png;base64,abc'
      );
      expect(sanitizeUrl('data:image/jpeg;base64,abc', { allowDataUrls: true })).toBe(
        'data:image/jpeg;base64,abc'
      );
      expect(sanitizeUrl('data:image/gif;base64,abc', { allowDataUrls: true })).toBe(
        'data:image/gif;base64,abc'
      );
    });

    it('should block disallowed MIME types in data URLs even when enabled', () => {
      expect(
        sanitizeUrl('data:text/html,<script>alert(1)</script>', { allowDataUrls: true })
      ).toBe('#');
      expect(
        sanitizeUrl('data:application/javascript,alert(1)', { allowDataUrls: true })
      ).toBe('#');
    });

    it('should allow custom data MIME types', () => {
      expect(
        sanitizeUrl('data:application/pdf;base64,abc', {
          allowDataUrls: true,
          allowedDataMimeTypes: ['application/pdf'],
        })
      ).toBe('data:application/pdf;base64,abc');
    });
  });

  describe('relative URLs', () => {
    it('should allow relative URLs by default', () => {
      expect(sanitizeUrl('/page')).toBe('/page');
      expect(sanitizeUrl('./page')).toBe('./page');
      expect(sanitizeUrl('../page')).toBe('../page');
      expect(sanitizeUrl('#hash')).toBe('#hash');
      expect(sanitizeUrl('?query=1')).toBe('?query=1');
    });

    it('should block relative URLs when allowRelative is false', () => {
      expect(sanitizeUrl('/page', { allowRelative: false })).toBe('#');
      expect(sanitizeUrl('./page', { allowRelative: false })).toBe('#');
    });

    it('should treat path-only URL without protocol as relative', () => {
      expect(sanitizeUrl('some/path')).toBe('some/path');
    });
  });

  describe('protocol-relative URLs', () => {
    it('should allow protocol-relative URLs when http/https allowed', () => {
      expect(sanitizeUrl('//example.com/path')).toBe('//example.com/path');
    });

    it('should allow protocol-relative URLs when http or https allowed', () => {
      // When http/https are in the allowed list, protocol-relative URLs pass
      expect(
        sanitizeUrl('//example.com/path', { allowedProtocols: ['http:', 'https:'] })
      ).toBe('//example.com/path');
    });
  });

  describe('custom fallback', () => {
    it('should use custom fallback URL', () => {
      expect(sanitizeUrl('javascript:alert(1)', { fallbackUrl: '/safe' })).toBe('/safe');
    });

    it('should return fallback for empty string', () => {
      expect(sanitizeUrl('', { fallbackUrl: '/home' })).toBe('/home');
    });
  });

  describe('unknown/disallowed protocols', () => {
    it('should block ftp: by default', () => {
      expect(sanitizeUrl('ftp://example.com')).toBe('#');
    });

    it('should block custom unknown protocol', () => {
      expect(sanitizeUrl('myapp://deeplink')).toBe('#');
    });
  });
});
