/**
 * @file trapFocus tests
 * @module @dsai/react/utils/a11y
 */

import { trapFocus } from './trapFocus';

describe('trapFocus', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Basic functionality', () => {
    it('should return cleanup function', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      const cleanup = trapFocus(container);
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('should trap Tab key navigation within container', () => {
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      button1.textContent = 'First';
      button2.textContent = 'Last';
      container.appendChild(button1);
      container.appendChild(button2);

      trapFocus(container);
      button2.focus();

      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(tabEvent);

      expect(document.activeElement).toBe(button1);
    });

    it('should trap Shift+Tab key navigation within container', () => {
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      container.appendChild(button1);
      container.appendChild(button2);

      trapFocus(container);
      button1.focus();

      const shiftTabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(shiftTabEvent);

      expect(document.activeElement).toBe(button2);
    });

    it('should handle single focusable element', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      trapFocus(container);
      button.focus();

      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(tabEvent);

      expect(document.activeElement).toBe(button);
    });
  });

  describe('initialFocus option', () => {
    it('should focus first element when initialFocus is true', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      const focusSpy = jest.spyOn(button, 'focus');
      trapFocus(container, { initialFocus: true });

      expect(focusSpy).toHaveBeenCalled();
      focusSpy.mockRestore();
    });

    it('should not focus first element when initialFocus is false', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      const focusSpy = jest.spyOn(button, 'focus');
      trapFocus(container, { initialFocus: false });

      expect(focusSpy).not.toHaveBeenCalled();
      focusSpy.mockRestore();
    });

    it('should not focus first element by default', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      const focusSpy = jest.spyOn(button, 'focus');
      trapFocus(container);

      expect(focusSpy).not.toHaveBeenCalled();
      focusSpy.mockRestore();
    });
  });

  describe('onWrap callback', () => {
    it('should call onWrap when focus wraps from last to first', () => {
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      container.appendChild(button1);
      container.appendChild(button2);

      const onWrap = jest.fn();
      trapFocus(container, { onWrap });

      button2.focus();
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(tabEvent);

      expect(onWrap).toHaveBeenCalled();
    });

    it('should call onWrap when focus wraps from first to last', () => {
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      container.appendChild(button1);
      container.appendChild(button2);

      const onWrap = jest.fn();
      trapFocus(container, { onWrap });

      button1.focus();
      const shiftTabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(shiftTabEvent);

      expect(onWrap).toHaveBeenCalled();
    });

    it('should call onWrap with single focusable element', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      const onWrap = jest.fn();
      trapFocus(container, { onWrap });

      button.focus();
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(tabEvent);

      expect(onWrap).toHaveBeenCalled();
    });
  });

  describe('onEscape callback', () => {
    it('should call onEscape when Escape key is pressed', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      const onEscape = jest.fn();
      trapFocus(container, { onEscape });

      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(escapeEvent);

      expect(onEscape).toHaveBeenCalled();
    });

    it('should prevent default on Escape key', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      const onEscape = jest.fn();
      trapFocus(container, { onEscape });

      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = jest.spyOn(escapeEvent, 'preventDefault');
      container.dispatchEvent(escapeEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not call onEscape if not provided', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      trapFocus(container);

      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });

      // Should not throw error
      expect(() => container.dispatchEvent(escapeEvent)).not.toThrow();
    });
  });

  describe('Focusable element detection', () => {
    it('should detect anchor elements with href', () => {
      const link = document.createElement('a');
      link.href = '#';
      container.appendChild(link);

      const cleanup = trapFocus(container);
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('should detect enabled buttons', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      const cleanup = trapFocus(container);
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('should skip disabled buttons', () => {
      const button = document.createElement('button');
      button.disabled = true;
      container.appendChild(button);

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const cleanup = trapFocus(container);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[trapFocus] No focusable elements found in container'
      );
      consoleWarnSpy.mockRestore();
      cleanup();
    });

    it('should detect enabled textarea', () => {
      const textarea = document.createElement('textarea');
      container.appendChild(textarea);

      const cleanup = trapFocus(container);
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('should skip disabled textarea', () => {
      const textarea = document.createElement('textarea');
      textarea.disabled = true;
      container.appendChild(textarea);

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      trapFocus(container);

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should detect enabled input', () => {
      const input = document.createElement('input');
      container.appendChild(input);

      const cleanup = trapFocus(container);
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('should skip disabled input', () => {
      const input = document.createElement('input');
      input.disabled = true;
      container.appendChild(input);

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      trapFocus(container);

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should detect enabled select', () => {
      const select = document.createElement('select');
      container.appendChild(select);

      const cleanup = trapFocus(container);
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('should skip disabled select', () => {
      const select = document.createElement('select');
      select.disabled = true;
      container.appendChild(select);

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      trapFocus(container);

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should detect elements with positive tabindex', () => {
      const div = document.createElement('div');
      div.tabIndex = 0;
      container.appendChild(div);

      const cleanup = trapFocus(container);
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('should skip elements with tabindex -1', () => {
      const div = document.createElement('div');
      div.tabIndex = -1;
      container.appendChild(div);

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      trapFocus(container);

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Custom focusable selectors', () => {
    it('should accept custom focusableSelectors', () => {
      const div = document.createElement('div');
      div.className = 'custom-focusable';
      container.appendChild(div);

      const cleanup = trapFocus(container, {
        focusableSelectors: ['.custom-focusable'],
      });

      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('should combine multiple custom selectors', () => {
      const div1 = document.createElement('div');
      div1.className = 'focusable-1';
      const div2 = document.createElement('div');
      div2.className = 'focusable-2';
      container.appendChild(div1);
      container.appendChild(div2);

      const cleanup = trapFocus(container, {
        focusableSelectors: ['.focusable-1', '.focusable-2'],
      });

      expect(typeof cleanup).toBe('function');
      cleanup();
    });
  });

  describe('Visibility filtering', () => {
    it('should skip elements with display none', () => {
      const button = document.createElement('button');
      button.style.display = 'none';
      container.appendChild(button);

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      trapFocus(container);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[trapFocus] No focusable elements found in container'
      );
      consoleWarnSpy.mockRestore();
    });

    it('should skip elements with visibility hidden', () => {
      const button = document.createElement('button');
      button.style.visibility = 'hidden';
      container.appendChild(button);

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      trapFocus(container);

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should include visible elements', () => {
      const button = document.createElement('button');
      button.style.display = 'block';
      button.style.visibility = 'visible';
      container.appendChild(button);

      const cleanup = trapFocus(container);
      expect(typeof cleanup).toBe('function');
      cleanup();
    });
  });

  describe('Cleanup function', () => {
    it('should remove event listener on cleanup', () => {
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      container.appendChild(button1);
      container.appendChild(button2);

      const cleanup = trapFocus(container);
      button2.focus();

      // Before cleanup: Tab should wrap
      const tabEvent1 = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(tabEvent1);
      expect(document.activeElement).toBe(button1);

      // After cleanup: Tab should not wrap
      cleanup();
      button2.focus();
      const tabEvent2 = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(tabEvent2);
      // Focus should remain on button2 (no wrapping after cleanup)
      expect(document.activeElement).toBe(button2);
    });

    it('should be safe to call cleanup multiple times', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      const cleanup = trapFocus(container);

      expect(() => {
        cleanup();
        cleanup();
        cleanup();
      }).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('should warn and return no-op when container is invalid', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const cleanup = trapFocus(null as unknown as HTMLElement);

      expect(consoleWarnSpy).toHaveBeenCalledWith('[trapFocus] Invalid container element provided');
      expect(typeof cleanup).toBe('function');
      cleanup(); // Should not throw

      consoleWarnSpy.mockRestore();
    });

    it('should warn and return no-op when no focusable elements exist', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const cleanup = trapFocus(container);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[trapFocus] No focusable elements found in container'
      );
      expect(typeof cleanup).toBe('function');

      consoleWarnSpy.mockRestore();
    });

    it('should handle non-Tab, non-Escape keys without error', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      trapFocus(container);

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });

      expect(() => container.dispatchEvent(enterEvent)).not.toThrow();
    });

    it('should handle Tab when focus is not on first or last element', () => {
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      const button3 = document.createElement('button');
      container.appendChild(button1);
      container.appendChild(button2);
      container.appendChild(button3);

      trapFocus(container);
      button2.focus();

      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(tabEvent);

      // Focus should not wrap (middle element)
      expect(document.activeElement).toBe(button2);
    });

    it('should handle Shift+Tab when focus is not on first or last element', () => {
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      const button3 = document.createElement('button');
      container.appendChild(button1);
      container.appendChild(button2);
      container.appendChild(button3);

      trapFocus(container);
      button2.focus();

      const shiftTabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(shiftTabEvent);

      // Focus should not wrap (middle element)
      expect(document.activeElement).toBe(button2);
    });
  });

  describe('Integration scenarios', () => {
    it('should work with modal pattern', () => {
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      const submitButton = document.createElement('button');
      submitButton.textContent = 'Submit';

      container.appendChild(closeButton);
      container.appendChild(submitButton);

      const onEscape = jest.fn();
      const cleanup = trapFocus(container, {
        initialFocus: true,
        onEscape,
      });

      expect(document.activeElement).toBe(closeButton);

      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(escapeEvent);

      expect(onEscape).toHaveBeenCalled();
      cleanup();
    });

    it('should work with dialog pattern', () => {
      const input = document.createElement('input');
      const cancelButton = document.createElement('button');
      const okButton = document.createElement('button');

      container.appendChild(input);
      container.appendChild(cancelButton);
      container.appendChild(okButton);

      const onWrap = jest.fn();
      trapFocus(container, { onWrap });

      okButton.focus();
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(tabEvent);

      expect(document.activeElement).toBe(input);
      expect(onWrap).toHaveBeenCalled();
    });

    it('should work with complex form', () => {
      const input1 = document.createElement('input');
      const input2 = document.createElement('input');
      const textarea = document.createElement('textarea');
      const select = document.createElement('select');
      const button = document.createElement('button');

      container.appendChild(input1);
      container.appendChild(input2);
      container.appendChild(textarea);
      container.appendChild(select);
      container.appendChild(button);

      const cleanup = trapFocus(container, { initialFocus: true });

      expect(document.activeElement).toBe(input1);

      button.focus();
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(tabEvent);

      expect(document.activeElement).toBe(input1);
      cleanup();
    });
  });

  describe('Performance', () => {
    it('should handle containers with many focusable elements', () => {
      const buttons = Array.from({ length: 100 }, () => document.createElement('button'));
      buttons.forEach((button) => container.appendChild(button));

      const start = performance.now();
      const cleanup = trapFocus(container);
      const end = performance.now();

      expect(end - start).toBeLessThan(250);
      cleanup();
    });

    it('should handle rapid key events', () => {
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      container.appendChild(button1);
      container.appendChild(button2);

      trapFocus(container);
      button1.focus();

      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        const tabEvent = new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
          cancelable: true,
        });
        container.dispatchEvent(tabEvent);
      }
      const end = performance.now();

      expect(end - start).toBeLessThan(50);
    });
  });
});
