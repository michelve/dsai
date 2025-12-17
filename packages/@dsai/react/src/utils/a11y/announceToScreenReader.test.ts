import { announceToScreenReader } from './announceToScreenReader';

describe('announceToScreenReader', () => {
  beforeEach(() => {
    // Clean up any existing live region containers
    document.querySelectorAll('[id^="dsai-live-region"]').forEach((el) => {
      el.remove();
    });
    jest.clearAllTimers();
  });

  afterEach(() => {
    // Clean up
    document.querySelectorAll('[id^="dsai-live-region"]').forEach((el) => {
      el.remove();
    });
    jest.clearAllTimers();
  });

  describe('Basic functionality', () => {
    it('should create a live region container with the message', () => {
      announceToScreenReader('Test message');

      const container = document.getElementById('dsai-live-region');
      expect(container).toBeTruthy();
      expect(container?.textContent).toBe('Test message');
    });

    it('should reuse existing container with same ID', () => {
      announceToScreenReader('First message');
      const firstContainer = document.getElementById('dsai-live-region');

      announceToScreenReader('Second message');
      const secondContainer = document.getElementById('dsai-live-region');

      expect(firstContainer).toBe(secondContainer);
      expect(secondContainer?.textContent).toBe('Second message');
    });

    it('should create separate containers for different IDs', () => {
      announceToScreenReader('Message 1', { id: 'region-1' });
      announceToScreenReader('Message 2', { id: 'region-2' });

      const container1 = document.getElementById('region-1');
      const container2 = document.getElementById('region-2');

      expect(container1).toBeTruthy();
      expect(container2).toBeTruthy();
      expect(container1).not.toBe(container2);
      expect(container1?.textContent).toBe('Message 1');
      expect(container2?.textContent).toBe('Message 2');
    });
  });

  describe('Politeness levels', () => {
    it('should default to polite politeness', () => {
      announceToScreenReader('Test message');

      const container = document.getElementById('dsai-live-region');
      expect(container?.getAttribute('aria-live')).toBe('polite');
      expect(container?.getAttribute('role')).toBe('status');
    });

    it('should use assertive politeness when explicitly set', () => {
      announceToScreenReader('Test message', { politeness: 'assertive' });

      const container = document.getElementById('dsai-live-region');
      expect(container?.getAttribute('aria-live')).toBe('assertive');
      expect(container?.getAttribute('role')).toBe('alert');
    });

    it('should use polite politeness when explicitly set', () => {
      announceToScreenReader('Test message', { politeness: 'polite' });

      const container = document.getElementById('dsai-live-region');
      expect(container?.getAttribute('aria-live')).toBe('polite');
      expect(container?.getAttribute('role')).toBe('status');
    });

    it('should use assertive when assertive boolean is true', () => {
      announceToScreenReader('Test message', { assertive: true });

      const container = document.getElementById('dsai-live-region');
      expect(container?.getAttribute('aria-live')).toBe('assertive');
      expect(container?.getAttribute('role')).toBe('alert');
    });

    it('should use polite when assertive boolean is false', () => {
      announceToScreenReader('Test message', { assertive: false });

      const container = document.getElementById('dsai-live-region');
      expect(container?.getAttribute('aria-live')).toBe('polite');
      expect(container?.getAttribute('role')).toBe('status');
    });

    it('should prioritize explicit politeness over assertive boolean', () => {
      announceToScreenReader('Test message', {
        politeness: 'polite',
        assertive: true,
      });

      const container = document.getElementById('dsai-live-region');
      expect(container?.getAttribute('aria-live')).toBe('polite');
      expect(container?.getAttribute('role')).toBe('status');
    });

    it('should prioritize explicit assertive politeness over assertive false boolean', () => {
      announceToScreenReader('Test message', {
        politeness: 'assertive',
        assertive: false,
      });

      const container = document.getElementById('dsai-live-region');
      expect(container?.getAttribute('aria-live')).toBe('assertive');
      expect(container?.getAttribute('role')).toBe('alert');
    });
  });

  describe('ARIA attributes', () => {
    it('should set aria-live, role, and aria-atomic attributes', () => {
      announceToScreenReader('Test message');

      const container = document.getElementById('dsai-live-region');
      expect(container?.getAttribute('aria-live')).toBe('polite');
      expect(container?.getAttribute('role')).toBe('status');
      expect(container?.getAttribute('aria-atomic')).toBe('true');
    });

    it('should update ARIA attributes when reusing container with different politeness', () => {
      announceToScreenReader('First message', { politeness: 'polite' });
      const container = document.getElementById('dsai-live-region');
      expect(container?.getAttribute('aria-live')).toBe('polite');
      expect(container?.getAttribute('role')).toBe('status');

      announceToScreenReader('Second message', { politeness: 'assertive' });
      expect(container?.getAttribute('aria-live')).toBe('assertive');
      expect(container?.getAttribute('role')).toBe('alert');
    });

    it('should always set aria-atomic to true', () => {
      announceToScreenReader('Test message', { politeness: 'polite' });
      let container = document.getElementById('dsai-live-region');
      expect(container?.getAttribute('aria-atomic')).toBe('true');

      announceToScreenReader('Test message 2', { politeness: 'assertive' });
      container = document.getElementById('dsai-live-region');
      expect(container?.getAttribute('aria-atomic')).toBe('true');
    });
  });

  describe('Visually hidden styles', () => {
    it('should apply visually hidden styles to new container', () => {
      announceToScreenReader('Test message');

      const container = document.getElementById('dsai-live-region');
      expect(container?.style.position).toBe('absolute');
      expect(container?.style.width).toBe('1px');
      expect(container?.style.height).toBe('1px');
      expect(container?.style.margin).toBe('-1px');
      expect(container?.style.border).toBe('0px');
      expect(container?.style.padding).toBe('0px');
      expect(container?.style.overflow).toBe('hidden');
      // Note: clip property is set but JSDOM doesn't always reflect deprecated properties
    });

    it('should preserve styles when reusing container', () => {
      announceToScreenReader('First message');
      const container = document.getElementById('dsai-live-region');
      const originalStyle = container?.style.cssText;

      announceToScreenReader('Second message');
      expect(container?.style.cssText).toBe(originalStyle);
    });
  });

  describe('Timeout behavior', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should clear message text after default timeout (2000ms)', () => {
      announceToScreenReader('Test message');

      const container = document.getElementById('dsai-live-region');
      expect(container?.textContent).toBe('Test message');

      jest.advanceTimersByTime(1999);
      expect(container?.textContent).toBe('Test message');

      jest.advanceTimersByTime(1);
      expect(container?.textContent).toBe('');
    });

    it('should clear message text after custom timeout', () => {
      announceToScreenReader('Test message', { timeoutMs: 5000 });

      const container = document.getElementById('dsai-live-region');
      expect(container?.textContent).toBe('Test message');

      jest.advanceTimersByTime(4999);
      expect(container?.textContent).toBe('Test message');

      jest.advanceTimersByTime(1);
      expect(container?.textContent).toBe('');
    });

    it('should handle zero timeout', () => {
      announceToScreenReader('Test message', { timeoutMs: 0 });

      const container = document.getElementById('dsai-live-region');
      expect(container?.textContent).toBe('Test message');

      jest.advanceTimersByTime(0);
      expect(container?.textContent).toBe('');
    });

    it('should not clear if container removed before timeout', () => {
      announceToScreenReader('Test message');

      const container = document.getElementById('dsai-live-region');
      container?.remove();

      // Should not throw when timeout fires
      expect(() => jest.advanceTimersByTime(2000)).not.toThrow();
    });
  });

  describe('Cleanup function', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should clear message text when called', () => {
      const cleanup = announceToScreenReader('Test message');

      const container = document.getElementById('dsai-live-region');
      expect(container?.textContent).toBe('Test message');

      cleanup();
      expect(container?.textContent).toBe('');
    });

    it('should cancel pending timeout', () => {
      const cleanup = announceToScreenReader('Test message');

      const container = document.getElementById('dsai-live-region');
      cleanup();

      jest.advanceTimersByTime(2000);
      // Text should already be cleared by cleanup, not by timeout
      expect(container?.textContent).toBe('');
    });

    it('should be safe to call multiple times', () => {
      const cleanup = announceToScreenReader('Test message');

      cleanup();
      expect(() => cleanup()).not.toThrow();
      expect(() => cleanup()).not.toThrow();
    });

    it('should not throw if container was removed', () => {
      const cleanup = announceToScreenReader('Test message');

      const container = document.getElementById('dsai-live-region');
      container?.remove();

      expect(() => cleanup()).not.toThrow();
    });

    it('should allow multiple announcements with independent cleanups', () => {
      const cleanup1 = announceToScreenReader('Message 1', { id: 'region-1' });
      const cleanup2 = announceToScreenReader('Message 2', { id: 'region-2' });

      const container1 = document.getElementById('region-1');
      const container2 = document.getElementById('region-2');

      cleanup1();
      expect(container1?.textContent).toBe('');
      expect(container2?.textContent).toBe('Message 2');

      cleanup2();
      expect(container2?.textContent).toBe('');
    });
  });

  describe('SSR safety', () => {
    it('should return no-op cleanup function when document is undefined', () => {
      const originalDocument = global.document;
      // @ts-expect-error - Testing SSR scenario
      delete global.document;

      expect(() => announceToScreenReader('Test message')).not.toThrow();

      global.document = originalDocument;
    });

    it('should not throw when called in SSR environment', () => {
      const originalDocument = global.document;
      // @ts-expect-error - Testing SSR scenario
      delete global.document;

      expect(() => announceToScreenReader('Test message')).not.toThrow();

      global.document = originalDocument;
    });
  });

  describe('document.body fallback', () => {
    it('should use documentElement when body is not available', () => {
      const originalBody = document.body;
      Object.defineProperty(document, 'body', {
        configurable: true,
        value: null,
      });

      announceToScreenReader('Test message');

      const container = document.getElementById('dsai-live-region');
      expect(container?.parentNode).toBe(document.documentElement);

      Object.defineProperty(document, 'body', {
        configurable: true,
        value: originalBody,
      });
    });

    it('should use body when available', () => {
      announceToScreenReader('Test message');

      const container = document.getElementById('dsai-live-region');
      expect(container?.parentNode).toBe(document.body);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty message', () => {
      announceToScreenReader('');

      const container = document.getElementById('dsai-live-region');
      expect(container?.textContent).toBe('');
    });

    it('should handle message with special characters', () => {
      const message = 'Test <script>alert("xss")</script> & "quotes"';
      announceToScreenReader(message);

      const container = document.getElementById('dsai-live-region');
      expect(container?.textContent).toBe(message);
    });

    it('should handle very long messages', () => {
      const message = 'a'.repeat(10000);
      announceToScreenReader(message);

      const container = document.getElementById('dsai-live-region');
      expect(container?.textContent).toBe(message);
    });

    it('should handle Unicode messages', () => {
      const message = '你好世界 🌍 Здравствуй мир';
      announceToScreenReader(message);

      const container = document.getElementById('dsai-live-region');
      expect(container?.textContent).toBe(message);
    });

    it('should handle multiline messages', () => {
      const message = 'Line 1\nLine 2\nLine 3';
      announceToScreenReader(message);

      const container = document.getElementById('dsai-live-region');
      expect(container?.textContent).toBe(message);
    });

    it('should handle rapid successive announcements', () => {
      const cleanup1 = announceToScreenReader('Message 1');
      const cleanup2 = announceToScreenReader('Message 2');
      const cleanup3 = announceToScreenReader('Message 3');

      const container = document.getElementById('dsai-live-region');
      expect(container?.textContent).toBe('Message 3');

      cleanup1();
      cleanup2();
      cleanup3();
    });
  });

  describe('Integration scenarios', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should handle form validation announcements', () => {
      // Simulate form validation flow
      const announceError = (field: string, error: string) => {
        return announceToScreenReader(`${field}: ${error}`, {
          politeness: 'assertive',
          id: 'form-validation',
        });
      };

      const cleanup1 = announceError('Email', 'Invalid email format');
      const container = document.getElementById('form-validation');
      expect(container?.textContent).toBe('Email: Invalid email format');
      expect(container?.getAttribute('role')).toBe('alert');

      cleanup1();
      expect(container?.textContent).toBe('');

      const cleanup2 = announceError('Password', 'Password too short');
      expect(container?.textContent).toBe('Password: Password too short');

      cleanup2();
    });

    it('should handle status update announcements', () => {
      // Simulate status updates
      announceToScreenReader('Loading data...', { id: 'status-updates' });
      let container = document.getElementById('status-updates');
      expect(container?.textContent).toBe('Loading data...');
      expect(container?.getAttribute('aria-live')).toBe('polite');

      jest.advanceTimersByTime(2000);
      expect(container?.textContent).toBe('');

      announceToScreenReader('Data loaded successfully', { id: 'status-updates' });
      container = document.getElementById('status-updates');
      expect(container?.textContent).toBe('Data loaded successfully');
    });

    it('should handle multiple announcement regions simultaneously', () => {
      const statusCleanup = announceToScreenReader('Status: Ready', {
        id: 'app-status',
        politeness: 'polite',
      });

      const errorCleanup = announceToScreenReader('Error: Connection lost', {
        id: 'app-errors',
        politeness: 'assertive',
      });

      const notifCleanup = announceToScreenReader('New message received', {
        id: 'app-notifications',
        politeness: 'polite',
      });

      const statusContainer = document.getElementById('app-status');
      const errorContainer = document.getElementById('app-errors');
      const notifContainer = document.getElementById('app-notifications');

      expect(statusContainer?.textContent).toBe('Status: Ready');
      expect(statusContainer?.getAttribute('role')).toBe('status');

      expect(errorContainer?.textContent).toBe('Error: Connection lost');
      expect(errorContainer?.getAttribute('role')).toBe('alert');

      expect(notifContainer?.textContent).toBe('New message received');
      expect(notifContainer?.getAttribute('role')).toBe('status');

      errorCleanup();
      expect(errorContainer?.textContent).toBe('');
      expect(statusContainer?.textContent).toBe('Status: Ready');
      expect(notifContainer?.textContent).toBe('New message received');

      statusCleanup();
      notifCleanup();
    });
  });

  describe('Performance', () => {
    it('should handle many rapid announcements efficiently', () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        announceToScreenReader(`Message ${i}`, { id: 'perf-test' });
      }

      const end = performance.now();
      const container = document.getElementById('perf-test');

      expect(end - start).toBeLessThan(100);
      expect(container?.textContent).toBe('Message 99');
    });

    it('should handle many separate live regions efficiently', () => {
      const cleanups: Array<() => void> = [];
      const start = performance.now();

      for (let i = 0; i < 50; i++) {
        const cleanup = announceToScreenReader(`Message ${i}`, { id: `region-${i}` });
        cleanups.push(cleanup);
      }

      const end = performance.now();

      expect(end - start).toBeLessThan(100);
      expect(document.querySelectorAll('[id^="region-"]').length).toBe(50);

      cleanups.forEach((cleanup) => {
        cleanup();
      });
    });
  });
});
