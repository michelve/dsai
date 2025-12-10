import { renderHook } from '@testing-library/react';

import { useKeyPress } from './useKeyPress';

describe('useKeyPress', () => {
  describe('Basic Functionality', () => {
    it('should return false initially', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useKeyPress('a', callback));

      expect(result.current).toBe(false);
    });

    it('should detect single key press and call callback', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress('Enter', callback));

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      window.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith(event);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should detect key from array of keys', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress(['a', 'b', 'c'], callback));

      // Test first key
      const eventA = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(eventA);
      expect(callback).toHaveBeenCalledWith(eventA);

      // Test middle key
      const eventB = new KeyboardEvent('keydown', { key: 'b' });
      window.dispatchEvent(eventB);
      expect(callback).toHaveBeenCalledWith(eventB);

      // Test last key
      const eventC = new KeyboardEvent('keydown', { key: 'c' });
      window.dispatchEvent(eventC);
      expect(callback).toHaveBeenCalledWith(eventC);

      expect(callback).toHaveBeenCalledTimes(3);
    });

    it('should be case-insensitive', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress('a', callback));

      // Lower case key event
      const eventLower = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(eventLower);
      expect(callback).toHaveBeenCalledWith(eventLower);

      // Upper case key event
      const eventUpper = new KeyboardEvent('keydown', { key: 'A' });
      window.dispatchEvent(eventUpper);
      expect(callback).toHaveBeenCalledWith(eventUpper);

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should not call callback for non-matching keys', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress('Enter', callback));

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Pressed State', () => {
    it('should return true when key is pressed down', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useKeyPress('Space', callback));

      expect(result.current).toBe(false);

      const event = new KeyboardEvent('keydown', { key: 'Space' });
      window.dispatchEvent(event);

      expect(result.current).toBe(true);
    });

    it('should return false when key is released', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useKeyPress('a', callback));

      // Press key down
      const keydownEvent = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(keydownEvent);
      expect(result.current).toBe(true);

      // Release key
      const keyupEvent = new KeyboardEvent('keyup', { key: 'a' });
      window.dispatchEvent(keyupEvent);
      expect(result.current).toBe(false);
    });

    it('should track pressed state for multiple keys', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useKeyPress(['Shift', 'Control'], callback));

      // Press Shift
      const shiftDown = new KeyboardEvent('keydown', { key: 'Shift' });
      window.dispatchEvent(shiftDown);
      expect(result.current).toBe(true);

      // Release Shift
      const shiftUp = new KeyboardEvent('keyup', { key: 'Shift' });
      window.dispatchEvent(shiftUp);
      expect(result.current).toBe(false);

      // Press Control
      const ctrlDown = new KeyboardEvent('keydown', { key: 'Control' });
      window.dispatchEvent(ctrlDown);
      expect(result.current).toBe(true);

      // Release Control
      const ctrlUp = new KeyboardEvent('keyup', { key: 'Control' });
      window.dispatchEvent(ctrlUp);
      expect(result.current).toBe(false);
    });

    it('should not track pressed state for keyup event type', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useKeyPress('Enter', callback, { event: 'keyup' }));

      const event = new KeyboardEvent('keyup', { key: 'Enter' });
      window.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith(event);
      expect(result.current).toBe(false); // Should stay false for keyup
    });
  });

  describe('Form Tag Filtering', () => {
    it('should ignore key presses in input elements by default', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress('a', callback));

      const input = document.createElement('input');
      document.body.appendChild(input);

      const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
      Object.defineProperty(event, 'target', { value: input, enumerable: true });
      input.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();

      document.body.removeChild(input);
    });

    it('should ignore key presses in textarea elements by default', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress('Enter', callback));

      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      Object.defineProperty(event, 'target', { value: textarea, enumerable: true });
      textarea.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();

      document.body.removeChild(textarea);
    });

    it('should ignore key presses in select elements by default', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress('ArrowDown', callback));

      const select = document.createElement('select');
      document.body.appendChild(select);

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      Object.defineProperty(event, 'target', { value: select, enumerable: true });
      select.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();

      document.body.removeChild(select);
    });

    it('should enable key presses in form elements when enableOnFormTags is true', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress('Escape', callback, { enableOnFormTags: true }));

      const input = document.createElement('input');
      document.body.appendChild(input);

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      Object.defineProperty(event, 'target', { value: input, enumerable: true });
      input.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith(event);

      document.body.removeChild(input);
    });

    it('should work normally for non-form elements', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress('k', callback));

      const div = document.createElement('div');
      document.body.appendChild(div);

      const event = new KeyboardEvent('keydown', { key: 'k', bubbles: true });
      Object.defineProperty(event, 'target', { value: div, enumerable: true });
      div.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith(event);

      document.body.removeChild(div);
    });
  });

  describe('Event Type Option', () => {
    it('should listen for keydown by default', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress('a', callback));

      const keydownEvent = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(keydownEvent);
      expect(callback).toHaveBeenCalledWith(keydownEvent);

      const keyupEvent = new KeyboardEvent('keyup', { key: 'a' });
      callback.mockClear();
      window.dispatchEvent(keyupEvent);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should listen for keyup when event option is set to keyup', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress('b', callback, { event: 'keyup' }));

      const keydownEvent = new KeyboardEvent('keydown', { key: 'b' });
      window.dispatchEvent(keydownEvent);
      expect(callback).not.toHaveBeenCalled();

      const keyupEvent = new KeyboardEvent('keyup', { key: 'b' });
      window.dispatchEvent(keyupEvent);
      expect(callback).toHaveBeenCalledWith(keyupEvent);
    });
  });

  describe('Target Option', () => {
    it('should listen on window by default', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress('a', callback));

      const event = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith(event);
    });

    it('should listen on custom element via ref', () => {
      const callback = jest.fn();
      const div = document.createElement('div');
      document.body.appendChild(div);

      const targetRef = { current: div };
      renderHook(() => useKeyPress('Enter', callback, { target: targetRef }));

      // Window event should not trigger
      const windowEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      window.dispatchEvent(windowEvent);
      expect(callback).not.toHaveBeenCalled();

      // Element event should trigger
      const elementEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      div.dispatchEvent(elementEvent);
      expect(callback).toHaveBeenCalledWith(elementEvent);

      document.body.removeChild(div);
    });

    it('should handle null ref gracefully', () => {
      const callback = jest.fn();
      const targetRef = { current: null } as unknown as React.RefObject<HTMLElement>;

      expect(() => {
        renderHook(() => useKeyPress('a', callback, { target: targetRef }));
      }).not.toThrow();

      // Should not trigger callback
      const event = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(event);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should listen on document when target is document', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress('d', callback, { target: document }));

      const event = new KeyboardEvent('keydown', { key: 'd' });
      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith(event);
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const callback = jest.fn();
      const { unmount } = renderHook(() => useKeyPress('a', callback));

      // Should work before unmount
      const event1 = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(event1);
      expect(callback).toHaveBeenCalledWith(event1);
      expect(callback).toHaveBeenCalledTimes(1);

      callback.mockClear();
      unmount();

      // Should not work after unmount
      const event2 = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(event2);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should remove both keydown and keyup listeners when using keydown event', () => {
      const callback = jest.fn();
      const { unmount } = renderHook(() => useKeyPress('b', callback));

      unmount();

      // Neither should trigger after unmount
      const keydownEvent = new KeyboardEvent('keydown', { key: 'b' });
      window.dispatchEvent(keydownEvent);

      const keyupEvent = new KeyboardEvent('keyup', { key: 'b' });
      window.dispatchEvent(keyupEvent);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should update listeners when keys change', () => {
      const callback = jest.fn();
      const { rerender } = renderHook(({ keys }) => useKeyPress(keys, callback), {
        initialProps: { keys: 'a' },
      });

      // Old key should work
      const eventA = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(eventA);
      expect(callback).toHaveBeenCalledWith(eventA);
      expect(callback).toHaveBeenCalledTimes(1);

      callback.mockClear();

      // Change to new key
      rerender({ keys: 'b' });

      // Old key should not work
      const eventA2 = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(eventA2);
      expect(callback).not.toHaveBeenCalled();

      // New key should work
      const eventB = new KeyboardEvent('keydown', { key: 'b' });
      window.dispatchEvent(eventB);
      expect(callback).toHaveBeenCalledWith(eventB);
    });
  });

  describe('Special Keys', () => {
    it('should handle modifier keys', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress(['Control', 'Meta', 'Alt', 'Shift'], callback));

      const ctrlEvent = new KeyboardEvent('keydown', { key: 'Control' });
      window.dispatchEvent(ctrlEvent);
      expect(callback).toHaveBeenCalledWith(ctrlEvent);

      const metaEvent = new KeyboardEvent('keydown', { key: 'Meta' });
      window.dispatchEvent(metaEvent);
      expect(callback).toHaveBeenCalledWith(metaEvent);

      const altEvent = new KeyboardEvent('keydown', { key: 'Alt' });
      window.dispatchEvent(altEvent);
      expect(callback).toHaveBeenCalledWith(altEvent);

      const shiftEvent = new KeyboardEvent('keydown', { key: 'Shift' });
      window.dispatchEvent(shiftEvent);
      expect(callback).toHaveBeenCalledWith(shiftEvent);

      expect(callback).toHaveBeenCalledTimes(4);
    });

    it('should handle arrow keys', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], callback));

      const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      window.dispatchEvent(upEvent);
      expect(callback).toHaveBeenCalledWith(upEvent);

      const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      window.dispatchEvent(downEvent);
      expect(callback).toHaveBeenCalledWith(downEvent);

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should handle special keys like Escape and Enter', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress(['Escape', 'Enter', 'Tab'], callback));

      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(escEvent);
      expect(callback).toHaveBeenCalledWith(escEvent);

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      window.dispatchEvent(enterEvent);
      expect(callback).toHaveBeenCalledWith(enterEvent);

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      window.dispatchEvent(tabEvent);
      expect(callback).toHaveBeenCalledWith(tabEvent);

      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty keys array', () => {
      const callback = jest.fn();
      expect(() => {
        renderHook(() => useKeyPress([], callback));
      }).not.toThrow();

      const event = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(event);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle rapid key presses', () => {
      const callback = jest.fn();
      renderHook(() => useKeyPress('a', callback));

      // Rapid presses
      for (let i = 0; i < 10; i++) {
        const event = new KeyboardEvent('keydown', { key: 'a' });
        window.dispatchEvent(event);
      }

      expect(callback).toHaveBeenCalledTimes(10);
    });

    it('should handle callback reference changes', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const { rerender } = renderHook(({ cb }) => useKeyPress('a', cb), {
        initialProps: { cb: callback1 },
      });

      // First callback should be called
      const event1 = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(event1);
      expect(callback1).toHaveBeenCalledWith(event1);
      expect(callback2).not.toHaveBeenCalled();

      // Change callback
      rerender({ cb: callback2 });

      // New callback should be called
      const event2 = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(event2);
      expect(callback2).toHaveBeenCalledWith(event2);
      expect(callback1).toHaveBeenCalledTimes(1); // Not called again
    });
  });

  describe('SSR Safety', () => {
    it('should not throw in SSR environment', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Simulating SSR
      delete global.window;

      const callback = jest.fn();
      expect(() => {
        renderHook(() => useKeyPress('a', callback));
      }).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('Type Safety', () => {
    it('should accept single string key', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useKeyPress('a', callback));
      expect(typeof result.current).toBe('boolean');
    });

    it('should accept array of string keys', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useKeyPress(['a', 'b', 'c'], callback));
      expect(typeof result.current).toBe('boolean');
    });

    it('should accept all valid options', () => {
      const callback = jest.fn();
      const targetRef = { current: document.createElement('div') };

      expect(() => {
        renderHook(() =>
          useKeyPress('Enter', callback, {
            event: 'keydown',
            target: targetRef,
            enableOnFormTags: true,
            eventOptions: { passive: false, capture: true },
          })
        );
      }).not.toThrow();
    });

    it('should return boolean', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useKeyPress('Space', callback));
      expect(typeof result.current).toBe('boolean');
      expect(result.current).toBe(false);
    });
  });
});
