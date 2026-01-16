/**
 * useClickOutside Tests
 *
 * Comprehensive tests for the useClickOutside hook.
 * Tests cover single/multi refs, event types, enabled option, capture phase, SSR safety, and cleanup.
 */

import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useRef } from 'react';

import { useClickOutside } from './useClickOutside';

import type { UseClickOutsideOptions } from './useClickOutside.types';

describe('useClickOutside', () => {
  let outsideElement: HTMLDivElement;
  let insideElement: HTMLDivElement;
  let callback: jest.Mock;

  beforeEach(() => {
    // Create DOM elements for testing
    outsideElement = document.createElement('div');
    insideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    document.body.appendChild(insideElement);

    // Create mock callback
    callback = jest.fn();
  });

  afterEach(() => {
    // Cleanup DOM
    document.body.removeChild(outsideElement);
    document.body.removeChild(insideElement);

    // Clear mocks
    jest.clearAllMocks();
  });

  describe('Single Ref', () => {
    it('should call callback when clicking outside element', () => {
      renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback);
        return ref;
      });

      // Click outside
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    it('should NOT call callback when clicking inside element', () => {
      renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback);
        return ref;
      });

      // Click inside
      insideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle touch events', () => {
      renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback);
        return ref;
      });

      // Touch outside
      outsideElement.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(expect.any(TouchEvent));
    });

    it('should handle null ref gracefully', () => {
      renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        useClickOutside(ref, callback);
        return ref;
      });

      // Click anywhere
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      // Should call callback since ref is null (considered "outside")
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Multiple Refs', () => {
    let triggerElement: HTMLButtonElement;
    let contentElement: HTMLDivElement;

    beforeEach(() => {
      triggerElement = document.createElement('button');
      contentElement = document.createElement('div');
      document.body.appendChild(triggerElement);
      document.body.appendChild(contentElement);
    });

    afterEach(() => {
      document.body.removeChild(triggerElement);
      document.body.removeChild(contentElement);
    });

    it('should NOT call callback when clicking inside any of the refs', () => {
      renderHook(() => {
        const triggerRef = useRef<HTMLButtonElement>(triggerElement);
        const contentRef = useRef<HTMLDivElement>(contentElement);
        useClickOutside([triggerRef, contentRef], callback);
        return { triggerRef, contentRef };
      });

      // Click on trigger
      triggerElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(callback).not.toHaveBeenCalled();

      // Click on content
      contentElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(callback).not.toHaveBeenCalled();
    });

    it('should call callback when clicking outside all refs', () => {
      renderHook(() => {
        const triggerRef = useRef<HTMLButtonElement>(triggerElement);
        const contentRef = useRef<HTMLDivElement>(contentElement);
        useClickOutside([triggerRef, contentRef], callback);
        return { triggerRef, contentRef };
      });

      // Click outside both
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle array with some null refs', () => {
      renderHook(() => {
        const validRef = useRef<HTMLDivElement>(insideElement);
        const nullRef = useRef<HTMLDivElement>(null);
        useClickOutside([validRef, nullRef], callback);
        return { validRef, nullRef };
      });

      // Click on valid element
      insideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(callback).not.toHaveBeenCalled();

      // Click outside
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Options', () => {
    it('should NOT attach listeners when enabled is false', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback, { enabled: false });
        return ref;
      });

      expect(addEventListenerSpy).not.toHaveBeenCalled();

      // Click outside
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(callback).not.toHaveBeenCalled();

      addEventListenerSpy.mockRestore();
    });

    it('should attach listeners when enabled is true', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback, { enabled: true });
        return ref;
      });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2); // mousedown + touchstart
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), true);
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), true);

      addEventListenerSpy.mockRestore();
    });

    it('should use capture phase when capture is true', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback, { capture: true });
        return ref;
      });

      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), true);
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), true);

      addEventListenerSpy.mockRestore();
    });

    it('should use bubble phase when capture is false', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback, { capture: false });
        return ref;
      });

      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), false);
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), false);

      addEventListenerSpy.mockRestore();
    });

    it('should use custom event types', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback, { events: ['pointerdown'] });
        return ref;
      });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
      expect(addEventListenerSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function), true);

      addEventListenerSpy.mockRestore();
    });

    it('should respond to custom event types', () => {
      renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback, { events: ['mousedown'] });
        return ref;
      });

      // Mousedown outside (using mousedown since PointerEvent may not be available in test env)
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should accept empty options object', () => {
      renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback, {});
        return ref;
      });

      // Should use defaults
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback);
        return ref;
      });

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2); // mousedown + touchstart
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), true);
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), true);

      removeEventListenerSpy.mockRestore();
    });

    it('should NOT call callback after unmount', () => {
      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback);
        return ref;
      });

      unmount();

      // Click outside after unmount
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle rapid mount/unmount cycles', () => {
      const { unmount: unmount1 } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback);
        return ref;
      });

      unmount1();

      const { unmount: unmount2 } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback);
        return ref;
      });

      // Click should work for second instance
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(callback).toHaveBeenCalledTimes(1);

      unmount2();
    });
  });

  describe('Edge Cases', () => {
    it('should handle event target being removed from DOM', () => {
      const removableElement = document.createElement('div');
      document.body.appendChild(removableElement);

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback);
        return ref;
      });

      // Dispatch event then remove element
      removableElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      document.body.removeChild(removableElement);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple hook instances independently', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      document.body.appendChild(element1);
      document.body.appendChild(element2);

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(element1);
        useClickOutside(ref, callback1);
        return ref;
      });

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(element2);
        useClickOutside(ref, callback2);
        return ref;
      });

      // Click on element1 (outside of element2 but inside element1)
      element1.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(callback1).not.toHaveBeenCalled(); // Inside its own element
      expect(callback2).toHaveBeenCalledTimes(1); // Outside element2

      document.body.removeChild(element1);
      document.body.removeChild(element2);
    });

    it('should handle enabled option changes without memory leaks', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { rerender } = renderHook(
        (props) => {
          const ref = useRef<HTMLDivElement>(insideElement);
          useClickOutside(ref, callback, { enabled: props.enabled });
          return ref;
        },
        { initialProps: { enabled: true } }
      );

      // Clear spy after initial mount
      removeEventListenerSpy.mockClear();

      // Disable the hook
      rerender({ enabled: false });

      // Should remove listeners when disabled
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2); // mousedown + touchstart
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), true);
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), true);

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('SSR Safety', () => {
    it('should not crash when window is undefined', () => {
      const originalWindow = global.window;
      const originalDocument = global.document;

      // @ts-expect-error - Simulating SSR environment
      delete global.window;
      // @ts-expect-error - Simulating SSR environment
      delete global.document;

      expect(() => {
        renderHook(() => {
          const ref = useRef<HTMLDivElement>(null);
          useClickOutside(ref, callback);
          return ref;
        });
      }).not.toThrow();

      global.window = originalWindow;
      global.document = originalDocument;
    });

    it('should not attach listeners during SSR', () => {
      const originalWindow = global.window;
      const originalDocument = global.document;

      // @ts-expect-error - Simulating SSR environment
      delete global.window;
      // @ts-expect-error - Simulating SSR environment
      delete global.document;

      // Mock document.addEventListener to verify it's not called
      const mockAddEventListener = jest.fn();
      const mockDocument = {
        addEventListener: mockAddEventListener,
      };

      // @ts-expect-error - Mock document
      global.document = mockDocument;

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        useClickOutside(ref, callback);
        return ref;
      });

      // No listeners should be attached during SSR
      expect(mockAddEventListener).not.toHaveBeenCalled();

      global.window = originalWindow;
      global.document = originalDocument;
    });
  });

  describe('Type Safety', () => {
    it('should accept UseClickOutsideOptions type', () => {
      const options: UseClickOutsideOptions = {
        enabled: true,
        capture: false,
        events: ['mousedown', 'touchstart'],
      };

      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(insideElement);
        useClickOutside(ref, callback, options);
        return ref;
      });

      expect(result.current.current).toBe(insideElement);
    });

    it('should work with HTMLElement subtypes', () => {
      const buttonElement = document.createElement('button');
      document.body.appendChild(buttonElement);

      renderHook(() => {
        const ref = useRef<HTMLButtonElement>(buttonElement);
        useClickOutside(ref, callback);
        return ref;
      });

      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(callback).toHaveBeenCalledTimes(1);

      document.body.removeChild(buttonElement);
    });
  });
});
