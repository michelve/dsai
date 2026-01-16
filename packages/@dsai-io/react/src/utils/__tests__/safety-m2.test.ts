/**
 * @file M2.4 Data Safety Utilities Tests
 *
 * Comprehensive test coverage for:
 * - sanitizeHtml
 * - sanitizeUrl
 * - copyToClipboard
 * - readFromClipboard
 * - generateToken
 * - generateCryptoId
 */

import {
  copyToClipboard,
  DEFAULT_ALLOWED_ATTRIBUTES,
  DEFAULT_ALLOWED_TAGS,
  generateCryptoId,
  generateToken,
  readFromClipboard,
  sanitizeHtml,
  sanitizeUrl,
} from '../safety';

describe('M2.4 Data Safety Utilities', () => {
  // ========================================
  // sanitizeHtml Tests
  // ========================================
  describe('sanitizeHtml', () => {
    describe('basic sanitization', () => {
      it('should preserve safe HTML tags', () => {
        const html = '<p>Hello <b>world</b></p>';
        expect(sanitizeHtml(html)).toBe('<p>Hello <b>world</b></p>');
      });

      it('should remove script tags', () => {
        const html = '<p>Hello</p><script>alert("xss")</script>';
        expect(sanitizeHtml(html)).toBe('<p>Hello</p>');
      });

      it('should remove event handlers', () => {
        const html = '<p onclick="alert(1)">Click me</p>';
        expect(sanitizeHtml(html)).toBe('<p>Click me</p>');
      });

      it('should handle empty input', () => {
        expect(sanitizeHtml('')).toBe('');
        expect(sanitizeHtml('   ')).toBe('');
      });

      it('should handle null/undefined', () => {
        expect(sanitizeHtml(null as unknown as string)).toBe('');
        expect(sanitizeHtml(undefined as unknown as string)).toBe('');
      });

      it('should convert non-string to string', () => {
        expect(sanitizeHtml(123 as unknown as string)).toBe('123');
      });
    });

    describe('XSS prevention', () => {
      it('should block javascript: URLs in href', () => {
        const html = '<a href="javascript:alert(1)">Click</a>';
        expect(sanitizeHtml(html)).toBe('<a>Click</a>');
      });

      it('should block vbscript: URLs', () => {
        const html = '<a href="vbscript:msgbox(1)">Click</a>';
        expect(sanitizeHtml(html)).toBe('<a>Click</a>');
      });

      it('should block data: URLs by default', () => {
        const html = '<a href="data:text/html,<script>alert(1)</script>">Click</a>';
        expect(sanitizeHtml(html)).toBe('<a>Click</a>');
      });

      it('should strip onerror handlers', () => {
        const html = '<img onerror="alert(1)" src="x">';
        const result = sanitizeHtml(html, { allowedTags: ['img'] });
        expect(result).not.toContain('onerror');
      });

      it('should strip onload handlers', () => {
        const html = '<body onload="alert(1)">Content</body>';
        expect(sanitizeHtml(html)).not.toContain('onload');
      });
    });

    describe('tag filtering', () => {
      it('should use default allowed tags', () => {
        expect(DEFAULT_ALLOWED_TAGS).toContain('p');
        expect(DEFAULT_ALLOWED_TAGS).toContain('b');
        expect(DEFAULT_ALLOWED_TAGS).toContain('a');
        expect(DEFAULT_ALLOWED_TAGS).not.toContain('script');
        expect(DEFAULT_ALLOWED_TAGS).not.toContain('iframe');
      });

      it('should allow custom tag allowlist', () => {
        const html = '<p>Para</p><div>Div</div>';
        const result = sanitizeHtml(html, { allowedTags: ['p'] });
        expect(result).toBe('<p>Para</p>Div');
      });

      it('should handle self-closing tags', () => {
        const html = '<p>Text</p><br/><p>More</p>';
        expect(sanitizeHtml(html)).toContain('<br');
      });

      it('should preserve allowed table structure', () => {
        const html = '<table><tr><td>Cell</td></tr></table>';
        expect(sanitizeHtml(html)).toBe('<table><tr><td>Cell</td></tr></table>');
      });
    });

    describe('attribute filtering', () => {
      it('should use default allowed attributes', () => {
        expect(DEFAULT_ALLOWED_ATTRIBUTES.a).toContain('href');
        expect(DEFAULT_ALLOWED_ATTRIBUTES['*']).toContain('class');
      });

      it('should preserve safe link attributes', () => {
        const html = '<a href="https://example.com" title="Link">Click</a>';
        const result = sanitizeHtml(html);
        expect(result).toContain('href="https://example.com"');
        expect(result).toContain('title="Link"');
      });

      it('should strip disallowed attributes', () => {
        const html = '<p data-custom="value" style="color:red">Text</p>';
        const result = sanitizeHtml(html);
        expect(result).not.toContain('data-custom');
        expect(result).not.toContain('style');
      });

      it('should allow global attributes on any tag', () => {
        const html = '<p class="text" id="para">Text</p>';
        const result = sanitizeHtml(html);
        expect(result).toContain('class="text"');
        expect(result).toContain('id="para"');
      });
    });

    describe('stripAllTags mode', () => {
      it('should return text only', () => {
        const html = '<p>Hello <b>world</b></p>';
        expect(sanitizeHtml(html, { stripAllTags: true })).toBe('Hello world');
      });

      it('should normalize whitespace', () => {
        const html = '<p>Hello</p>   <p>World</p>';
        expect(sanitizeHtml(html, { stripAllTags: true })).toBe('Hello World');
      });

      it('should convert nbsp', () => {
        const html = '<p>Hello&nbsp;World</p>';
        expect(sanitizeHtml(html, { stripAllTags: true })).toBe('Hello World');
      });
    });

    describe('comments handling', () => {
      it('should strip HTML comments', () => {
        const html = '<p>Before</p><!-- comment --><p>After</p>';
        expect(sanitizeHtml(html)).toBe('<p>Before</p><p>After</p>');
      });
    });
  });

  // ========================================
  // sanitizeUrl Tests
  // ========================================
  describe('sanitizeUrl', () => {
    describe('safe URLs', () => {
      it('should allow http URLs', () => {
        expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
      });

      it('should allow https URLs', () => {
        expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
      });

      it('should allow mailto URLs', () => {
        expect(sanitizeUrl('mailto:test@example.com')).toBe('mailto:test@example.com');
      });

      it('should allow tel URLs', () => {
        expect(sanitizeUrl('tel:+1234567890')).toBe('tel:+1234567890');
      });

      it('should allow relative URLs', () => {
        expect(sanitizeUrl('/path/to/page')).toBe('/path/to/page');
        expect(sanitizeUrl('./relative')).toBe('./relative');
        expect(sanitizeUrl('../parent')).toBe('../parent');
      });

      it('should allow hash URLs', () => {
        expect(sanitizeUrl('#section')).toBe('#section');
      });

      it('should allow query strings', () => {
        expect(sanitizeUrl('?param=value')).toBe('?param=value');
      });
    });

    describe('dangerous URLs', () => {
      it('should block javascript: URLs', () => {
        expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
      });

      it('should block vbscript: URLs', () => {
        expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('#');
      });

      it('should block encoded javascript: URLs', () => {
        expect(sanitizeUrl('java%73cript:alert(1)')).toBe('#');
        expect(sanitizeUrl('javascript%3aalert(1)')).toBe('#');
      });

      it('should block data: URLs by default', () => {
        expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
      });

      it('should block file: URLs', () => {
        expect(sanitizeUrl('file:///etc/passwd')).toBe('#');
      });

      it('should block blob: URLs', () => {
        expect(sanitizeUrl('blob:http://example.com/uuid')).toBe('#');
      });
    });

    describe('options', () => {
      it('should use custom fallback URL', () => {
        expect(sanitizeUrl('javascript:alert(1)', { fallbackUrl: 'about:blank' })).toBe(
          'about:blank'
        );
      });

      it('should allow data URLs when enabled', () => {
        const dataUrl = 'data:image/png;base64,abc123';
        expect(sanitizeUrl(dataUrl, { allowDataUrls: true })).toBe(dataUrl);
      });

      it('should block unsafe data MIME types even when data URLs allowed', () => {
        const dataUrl = 'data:text/html,<script>alert(1)</script>';
        expect(sanitizeUrl(dataUrl, { allowDataUrls: true })).toBe('#');
      });

      it('should block relative URLs when disabled', () => {
        expect(sanitizeUrl('/path', { allowRelative: false })).toBe('#');
      });

      it('should allow custom protocols', () => {
        expect(
          sanitizeUrl('custom://app/path', {
            allowedProtocols: ['custom:'],
          })
        ).toBe('custom://app/path');
      });
    });

    describe('edge cases', () => {
      it('should handle empty input', () => {
        expect(sanitizeUrl('')).toBe('#');
      });

      it('should handle null/undefined', () => {
        expect(sanitizeUrl(null as unknown as string)).toBe('#');
        expect(sanitizeUrl(undefined as unknown as string)).toBe('#');
      });

      it('should trim whitespace', () => {
        expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com');
      });

      it('should handle URLs with spaces', () => {
        expect(sanitizeUrl('java script:alert(1)')).toBe('#');
      });

      it('should handle protocol-relative URLs', () => {
        expect(sanitizeUrl('//example.com/path')).toBe('//example.com/path');
      });
    });
  });

  // ========================================
  // copyToClipboard Tests
  // ========================================
  describe('copyToClipboard', () => {
    // Mock clipboard API
    const mockWriteText = jest.fn();
    const originalClipboard = navigator.clipboard;
    const originalIsSecureContext = window.isSecureContext;

    beforeEach(() => {
      jest.clearAllMocks();
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      });
      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        configurable: true,
      });
    });

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

    it('should copy text using Clipboard API', async () => {
      mockWriteText.mockResolvedValueOnce(undefined);

      const result = await copyToClipboard('Hello');

      expect(result.success).toBe(true);
      expect(result.method).toBe('clipboard-api');
      expect(mockWriteText).toHaveBeenCalledWith('Hello');
    });

    it('should call onSuccess callback on success', async () => {
      mockWriteText.mockResolvedValueOnce(undefined);
      const onSuccess = jest.fn();

      await copyToClipboard('Hello', { onSuccess });

      expect(onSuccess).toHaveBeenCalled();
    });

    it('should handle null input', async () => {
      const result = await copyToClipboard(null as unknown as string);

      expect(result.success).toBe(false);
      expect(result.error).toContain('null');
    });

    it('should call onError callback on failure', async () => {
      mockWriteText.mockRejectedValueOnce(new Error('Clipboard error'));
      const onError = jest.fn();

      // Mock fallback to also fail
      const mockExecCommand = jest.fn().mockReturnValue(false);
      document.execCommand = mockExecCommand;

      await copyToClipboard('Hello', { onError });

      expect(onError).toHaveBeenCalled();
    });

    it('should convert non-string input to string', async () => {
      mockWriteText.mockResolvedValueOnce(undefined);

      const result = await copyToClipboard(123 as unknown as string);

      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('123');
    });
  });

  // ========================================
  // readFromClipboard Tests
  // ========================================
  describe('readFromClipboard', () => {
    // Mock clipboard API
    const mockReadText = jest.fn();
    const originalClipboard = navigator.clipboard;
    const originalIsSecureContext = window.isSecureContext;

    beforeEach(() => {
      jest.clearAllMocks();
      Object.defineProperty(navigator, 'clipboard', {
        value: { readText: mockReadText },
        configurable: true,
      });
      Object.defineProperty(window, 'isSecureContext', {
        value: true,
        configurable: true,
      });
      // Mock permissions API
      Object.defineProperty(navigator, 'permissions', {
        value: {
          query: jest.fn().mockResolvedValue({ state: 'granted' }),
        },
        configurable: true,
      });
    });

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

    it('should read text from clipboard', async () => {
      mockReadText.mockResolvedValueOnce('Clipboard content');

      const result = await readFromClipboard();

      expect(result.success).toBe(true);
      expect(result.text).toBe('Clipboard content');
    });

    it('should call onSuccess callback with text', async () => {
      mockReadText.mockResolvedValueOnce('Content');
      const onSuccess = jest.fn();

      await readFromClipboard({ onSuccess });

      expect(onSuccess).toHaveBeenCalledWith('Content');
    });

    it('should handle permission denied', async () => {
      Object.defineProperty(navigator, 'permissions', {
        value: {
          query: jest.fn().mockResolvedValue({ state: 'denied' }),
        },
        configurable: true,
      });

      const result = await readFromClipboard();

      expect(result.success).toBe(false);
      expect(result.permissionDenied).toBe(true);
    });

    it('should handle read errors', async () => {
      mockReadText.mockRejectedValueOnce(new Error('Read failed'));
      const onError = jest.fn();

      const result = await readFromClipboard({ onError });

      expect(result.success).toBe(false);
      expect(onError).toHaveBeenCalled();
    });
  });

  // ========================================
  // generateToken Tests
  // ========================================
  describe('generateToken', () => {
    describe('basic generation', () => {
      it('should generate hex token by default', () => {
        const token = generateToken();
        expect(token).toMatch(/^[0-9a-f]+$/);
      });

      it('should generate token of correct length', () => {
        const token = generateToken({ length: 16 });
        expect(token).toHaveLength(16);
      });

      it('should generate unique tokens', () => {
        const tokens = new Set(Array.from({ length: 100 }, () => generateToken()));
        expect(tokens.size).toBe(100);
      });
    });

    describe('encoding formats', () => {
      it('should generate base64 tokens', () => {
        const token = generateToken({ length: 20, encoding: 'base64' });
        expect(token).toHaveLength(20);
      });

      it('should generate base64url tokens (URL-safe)', () => {
        const token = generateToken({ length: 20, encoding: 'base64url' });
        expect(token).not.toContain('+');
        expect(token).not.toContain('/');
        expect(token).not.toContain('=');
      });

      it('should generate alphanumeric tokens', () => {
        const token = generateToken({ length: 20, encoding: 'alphanumeric' });
        expect(token).toMatch(/^[A-Za-z0-9]+$/);
      });
    });

    describe('options', () => {
      it('should add prefix to token', () => {
        const token = generateToken({ length: 16, prefix: 'sk_' });
        expect(token).toMatch(/^sk_[0-9a-f]{16}$/);
      });

      it('should use custom alphabet', () => {
        const token = generateToken({
          length: 10,
          encoding: 'alphanumeric',
          alphabet: '0123456789',
        });
        expect(token).toMatch(/^[0-9]{10}$/);
      });
    });

    describe('validation', () => {
      it('should throw on zero length', () => {
        expect(() => generateToken({ length: 0 })).toThrow();
      });

      it('should throw on negative length', () => {
        expect(() => generateToken({ length: -1 })).toThrow();
      });

      it('should throw on excessive length', () => {
        expect(() => generateToken({ length: 2000 })).toThrow();
      });
    });
  });

  // ========================================
  // generateCryptoId Tests
  // ========================================
  describe('generateCryptoId', () => {
    describe('nanoid format (default)', () => {
      it('should generate 21 character ID by default', () => {
        const id = generateCryptoId();
        expect(id).toHaveLength(21);
      });

      it('should generate URL-safe IDs', () => {
        const id = generateCryptoId();
        // Should only contain URL-safe characters
        expect(encodeURIComponent(id)).toBe(id);
      });

      it('should generate unique IDs', () => {
        const ids = new Set(Array.from({ length: 1000 }, () => generateCryptoId()));
        expect(ids.size).toBe(1000);
      });

      it('should respect custom length', () => {
        const id = generateCryptoId({ length: 10 });
        expect(id).toHaveLength(10);
      });
    });

    describe('UUID format', () => {
      it('should generate valid UUID v4', () => {
        const uuid = generateCryptoId({ format: 'uuid' });
        // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(uuid).toMatch(uuidRegex);
      });

      it('should generate unique UUIDs', () => {
        const uuids = new Set(
          Array.from({ length: 100 }, () => generateCryptoId({ format: 'uuid' }))
        );
        expect(uuids.size).toBe(100);
      });
    });

    describe('prefixed format', () => {
      it('should add prefix with separator', () => {
        const id = generateCryptoId({ format: 'prefixed', prefix: 'user' });
        expect(id).toMatch(/^user_/);
      });

      it('should use custom separator', () => {
        const id = generateCryptoId({
          format: 'prefixed',
          prefix: 'usr',
          separator: '-',
        });
        expect(id).toMatch(/^usr-/);
      });
    });

    describe('timestamp format', () => {
      it('should include timestamp prefix', () => {
        const id = generateCryptoId({ format: 'timestamp' });
        // Timestamp IDs start with a base36 encoded timestamp
        // They should be a mix of letters and numbers
        expect(id).toMatch(/^[a-z0-9]+$/i);
        expect(id.length).toBeGreaterThan(10);
      });

      it('should generate unique timestamp IDs', () => {
        const ids = new Set(
          Array.from({ length: 100 }, () => generateCryptoId({ format: 'timestamp' }))
        );
        expect(ids.size).toBe(100);
      });
    });

    describe('validation', () => {
      it('should throw on zero length', () => {
        expect(() => generateCryptoId({ length: 0 })).toThrow();
      });

      it('should throw on negative length', () => {
        expect(() => generateCryptoId({ length: -1 })).toThrow();
      });

      it('should throw on excessive length', () => {
        expect(() => generateCryptoId({ length: 500 })).toThrow();
      });
    });
  });
});
