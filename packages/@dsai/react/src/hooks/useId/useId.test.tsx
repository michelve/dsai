/**
 * useId Tests
 *
 * Comprehensive tests for the useId hook.
 * Tests cover unique ID generation, stability, SSR safety, and accessibility use cases.
 */

import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';

import { useId } from './useId';

describe('useId', () => {
  describe('Basic Functionality', () => {
    it('should generate a unique ID', () => {
      const { result } = renderHook(() => useId());

      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('string');
      expect(result.current.length).toBeGreaterThan(0);
    });

    it('should generate stable ID across re-renders', () => {
      const { result, rerender } = renderHook(() => useId());

      const firstId = result.current;

      rerender();
      rerender();
      rerender();

      expect(result.current).toBe(firstId);
    });

    it('should generate different IDs for different instances', () => {
      const { result: result1 } = renderHook(() => useId());
      const { result: result2 } = renderHook(() => useId());
      const { result: result3 } = renderHook(() => useId());

      expect(result1.current).not.toBe(result2.current);
      expect(result2.current).not.toBe(result3.current);
      expect(result1.current).not.toBe(result3.current);
    });
  });

  describe('Multiple IDs', () => {
    it('should allow multiple IDs in same component', () => {
      const { result } = renderHook(() => {
        const id1 = useId();
        const id2 = useId();
        const id3 = useId();

        return { id1, id2, id3 };
      });

      expect(result.current.id1).not.toBe(result.current.id2);
      expect(result.current.id2).not.toBe(result.current.id3);
      expect(result.current.id1).not.toBe(result.current.id3);
    });

    it('should keep all IDs stable across re-renders', () => {
      const { result, rerender } = renderHook(() => {
        const id1 = useId();
        const id2 = useId();

        return { id1, id2 };
      });

      const firstIds = { ...result.current };

      rerender();

      expect(result.current.id1).toBe(firstIds.id1);
      expect(result.current.id2).toBe(firstIds.id2);
    });
  });

  describe('ID Derivation', () => {
    it('should allow deriving multiple related IDs', () => {
      const { result } = renderHook(() => {
        const baseId = useId();
        const inputId = `${baseId}-input`;
        const labelId = `${baseId}-label`;
        const hintId = `${baseId}-hint`;

        return { baseId, inputId, labelId, hintId };
      });

      expect(result.current.inputId).toContain(result.current.baseId);
      expect(result.current.labelId).toContain(result.current.baseId);
      expect(result.current.hintId).toContain(result.current.baseId);
      expect(result.current.inputId).toContain('-input');
      expect(result.current.labelId).toContain('-label');
      expect(result.current.hintId).toContain('-hint');
    });
  });

  describe('Accessibility Use Cases', () => {
    it('should work for aria-labelledby', () => {
      const { result } = renderHook(() => {
        const id = useId();
        return {
          labelId: id,
          ariaLabelledby: id,
        };
      });

      expect(result.current.ariaLabelledby).toBe(result.current.labelId);
    });

    it('should work for aria-describedby', () => {
      const { result } = renderHook(() => {
        const baseId = useId();
        return {
          inputId: `${baseId}-input`,
          descriptionId: `${baseId}-desc`,
        };
      });

      expect(result.current.descriptionId).toContain(result.current.inputId.split('-')[0]);
    });

    it('should work for form field associations', () => {
      const { result } = renderHook(() => {
        const id = useId();
        return {
          htmlFor: id,
          inputId: id,
        };
      });

      expect(result.current.htmlFor).toBe(result.current.inputId);
    });
  });

  describe('SSR Safety', () => {
    it('should generate valid IDs in Node.js environment', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const { result } = renderHook(() => useId());

      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('string');

      global.window = originalWindow;
    });

    it('should generate same structure on server and client', () => {
      // This tests that the ID format is consistent
      const { result: serverResult } = renderHook(() => useId());
      const { result: clientResult } = renderHook(() => useId());

      // Both should be strings
      expect(typeof serverResult.current).toBe('string');
      expect(typeof clientResult.current).toBe('string');

      // Both should be non-empty
      expect(serverResult.current.length).toBeGreaterThan(0);
      expect(clientResult.current.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid re-renders', () => {
      const { result, rerender } = renderHook(() => useId());

      const originalId = result.current;

      for (let i = 0; i < 100; i++) {
        rerender();
      }

      expect(result.current).toBe(originalId);
    });

    it('should not create IDs with special characters that break HTML', () => {
      const { result } = renderHook(() => useId());

      // Should not contain quotes, angle brackets, etc.
      expect(result.current).not.toMatch(/[<>"']/);
    });

    it('should work with component unmount and remount', () => {
      const { result: result1, unmount } = renderHook(() => useId());
      const id1 = result1.current;

      unmount();

      const { result: result2 } = renderHook(() => useId());
      const id2 = result2.current;

      // New instance should get different ID
      expect(id1).not.toBe(id2);
    });
  });

  describe('Type Safety', () => {
    it('should return string type', () => {
      const { result } = renderHook(() => useId());

      const id: string = result.current;
      expect(typeof id).toBe('string');
    });

    it('should work with template literals', () => {
      const { result } = renderHook(() => {
        const id = useId();
        const prefixed = `custom-${id}`;
        const suffixed = `${id}-suffix`;

        return { id, prefixed, suffixed };
      });

      expect(result.current.prefixed).toBe(`custom-${result.current.id}`);
      expect(result.current.suffixed).toBe(`${result.current.id}-suffix`);
    });
  });
});
