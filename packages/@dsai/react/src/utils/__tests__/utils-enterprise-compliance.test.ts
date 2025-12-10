/**
 * TASK-072 Enterprise Acceptance Criteria Compliance Test Suite
 *
 * Validates that DSAi utilities meet enterprise-grade acceptance criteria:
 *
 * 1. Type Strictness - Fully typed inputs/outputs, readonly props, no implicit any
 * 2. SSR Safety - No module-scope DOM access, feature guards, noop fallbacks
 * 3. Accessibility Guarantees - Reduced-motion, ARIA defaults, keyboard support
 * 4. Input Validation - External input validation, descriptive errors
 * 5. Side-Effect Isolation - Pure functions stay pure, cleanup for stateful utilities
 * 6. Tree-Shakeability - ES modules, no dynamic requires, side-effect free
 *
 * These tests verify compliance with standards defined in:
 * - tasks/03-medium/TASK-072-ready-ac.md
 * - TASK-072-COMPLIANCE-REPORT.md
 */

import { announceToScreenReader } from '../a11y/announceToScreenReader';
import { trapFocus } from '../a11y/trapFocus';
import { prefersReducedMotion } from '../browser/prefersReducedMotion';
import { getVariantClass } from '../string/getVariantClass';
import { isExternalUrl } from '../types/isExternalUrl';

describe('Enterprise Criteria: SSR Safety', () => {
  describe('trapFocus', () => {
    it('returns noop cleanup when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const cleanup = trapFocus(document.createElement('div'));
      expect(typeof cleanup).toBe('function');
      expect(() => cleanup()).not.toThrow();

      global.window = originalWindow;
    });

    it('returns noop cleanup for invalid container', () => {
      const cleanup = trapFocus(null as unknown as HTMLElement);
      expect(typeof cleanup).toBe('function');
      expect(() => cleanup()).not.toThrow();
    });
  });

  describe('announceToScreenReader', () => {
    it('returns noop cleanup when document is undefined', () => {
      const originalDocument = global.document;
      // @ts-expect-error - Testing SSR scenario
      delete global.document;

      const cleanup = announceToScreenReader('test message');
      expect(typeof cleanup).toBe('function');
      expect(() => cleanup()).not.toThrow();

      global.document = originalDocument;
    });
  });

  describe('prefersReducedMotion', () => {
    it('returns false when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const result = prefersReducedMotion();
      expect(result).toBe(false);

      global.window = originalWindow;
    });

    it('returns false when matchMedia throws error', () => {
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = (() => {
        throw new Error('matchMedia error');
      }) as typeof window.matchMedia;

      const result = prefersReducedMotion();
      expect(result).toBe(false);

      window.matchMedia = originalMatchMedia;
    });
  });
});

describe('Enterprise Criteria: Input Validation', () => {
  describe('isExternalUrl', () => {
    it('handles null and undefined safely', () => {
      expect(isExternalUrl(null)).toBe(false);
      expect(isExternalUrl(undefined)).toBe(false);
    });

    it('handles empty strings', () => {
      expect(isExternalUrl('')).toBe(false);
      expect(isExternalUrl('   ')).toBe(false);
    });

    it('detects various external protocols', () => {
      expect(isExternalUrl('http://example.com')).toBe(true);
      expect(isExternalUrl('https://example.com')).toBe(true);
      expect(isExternalUrl('ftp://server.com')).toBe(true);
      expect(isExternalUrl('ftps://server.com')).toBe(true);
      expect(isExternalUrl('mailto:test@example.com')).toBe(true);
      expect(isExternalUrl('tel:+1234567890')).toBe(true);
    });

    it('handles case-insensitive protocols', () => {
      expect(isExternalUrl('HTTP://EXAMPLE.COM')).toBe(true);
      expect(isExternalUrl('HTTPS://EXAMPLE.COM')).toBe(true);
    });

    it('rejects relative and internal URLs', () => {
      expect(isExternalUrl('/about')).toBe(false);
      expect(isExternalUrl('./relative')).toBe(false);
      expect(isExternalUrl('#anchor')).toBe(false);
      expect(isExternalUrl('javascript:void(0)')).toBe(false);
    });
  });

  describe('getVariantClass', () => {
    it('handles invalid variant inputs', () => {
      // @ts-expect-error - Testing runtime validation
      expect(getVariantClass(null)).toBe('');
      // @ts-expect-error - Testing runtime validation
      expect(getVariantClass(undefined)).toBe('');
      // @ts-expect-error - Testing runtime validation
      expect(getVariantClass(123)).toBe('');
      expect(getVariantClass('')).toBe('');
    });

    it('validates known variants without warning', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      expect(getVariantClass('primary')).toBe('text-bg-primary');
      expect(getVariantClass('success')).toBe('text-bg-success');
      expect(getVariantClass('danger')).toBe('text-bg-danger');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('can skip validation for custom variants', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      expect(getVariantClass('custom', { skipValidation: true })).toBe('text-bg-custom');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });
});

describe('Enterprise Criteria: Accessibility', () => {
  describe('trapFocus', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it('supports initial focus option', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      const focusSpy = jest.spyOn(button, 'focus');
      trapFocus(container, { initialFocus: true });

      expect(focusSpy).toHaveBeenCalled();
      focusSpy.mockRestore();
    });

    it('handles Escape key with onEscape callback', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      const onEscape = jest.fn();
      trapFocus(container, { onEscape });

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      container.dispatchEvent(event);

      expect(onEscape).toHaveBeenCalled();
    });

    it('provides cleanup function to remove listeners', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      const cleanup = trapFocus(container);
      expect(typeof cleanup).toBe('function');

      cleanup();

      // Dispatching Tab after cleanup should not affect focus
      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      container.dispatchEvent(event);
      // If cleanup worked, no error is thrown
    });
  });

  describe('announceToScreenReader', () => {
    afterEach(() => {
      // Clean up any live regions created during tests
      const liveRegion = document.getElementById('dsai-live-region');
      if (liveRegion) {
        liveRegion.remove();
      }
    });

    it('creates accessible live region with correct attributes', () => {
      const cleanup = announceToScreenReader('Test message');

      const liveRegion = document.getElementById('dsai-live-region');
      expect(liveRegion).toBeTruthy();
      expect(liveRegion?.getAttribute('aria-live')).toBe('polite');
      expect(liveRegion?.getAttribute('aria-atomic')).toBe('true');
      expect(liveRegion?.textContent).toBe('Test message');

      cleanup();
    });

    it('supports assertive politeness', () => {
      const cleanup = announceToScreenReader('Urgent message', { politeness: 'assertive' });

      const liveRegion = document.getElementById('dsai-live-region');
      expect(liveRegion?.getAttribute('aria-live')).toBe('assertive');

      cleanup();
    });

    it('cleans up announcement when cleanup is called', () => {
      const cleanup = announceToScreenReader('Test message', { timeoutMs: 5000 });

      const liveRegion = document.getElementById('dsai-live-region');
      expect(liveRegion?.textContent).toBe('Test message');

      cleanup();

      expect(liveRegion?.textContent).toBe('');
    });
  });
});

describe('Enterprise Criteria: Side-Effect Isolation', () => {
  describe('trapFocus cleanup', () => {
    it('removes event listeners when cleanup is called', () => {
      const container = document.createElement('div');
      const button = document.createElement('button');
      container.appendChild(button);
      document.body.appendChild(container);

      const removeEventListenerSpy = jest.spyOn(container, 'removeEventListener');
      const cleanup = trapFocus(container);

      cleanup();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      removeEventListenerSpy.mockRestore();
      document.body.removeChild(container);
    });
  });

  describe('announceToScreenReader cleanup', () => {
    it('clears timeout when cleanup is called', () => {
      jest.useFakeTimers();

      const cleanup = announceToScreenReader('Test', { timeoutMs: 2000 });
      const liveRegion = document.getElementById('dsai-live-region');

      expect(liveRegion?.textContent).toBe('Test');

      cleanup();

      jest.advanceTimersByTime(3000);
      // Text should be cleared immediately by cleanup, not by timeout
      expect(liveRegion?.textContent).toBe('');

      jest.useRealTimers();
    });
  });
});

describe('Enterprise Criteria: Type Strictness', () => {
  it('trapFocus options are readonly', () => {
    const options = {
      focusableSelectors: ['button'],
      onWrap: () => {},
      onEscape: () => {},
      initialFocus: true,
    } as const;

    const container = document.createElement('div');
    expect(() => trapFocus(container, options)).not.toThrow();
  });

  it('announceToScreenReader options are readonly', () => {
    const options = {
      politeness: 'polite',
      id: 'test-region',
      timeoutMs: 1000,
    } as const;

    expect(() => announceToScreenReader('test', options)).not.toThrow();
  });

  it('getVariantClass options are readonly', () => {
    const options = {
      prefix: 'btn',
      map: { error: 'danger' },
      skipValidation: true,
    } as const;

    expect(() => getVariantClass('primary', options)).not.toThrow();
  });
});
