/**
 * useMounted Coverage Tests
 *
 * Additional tests for unmount returning false and SSR edge cases.
 */

import { renderHook, waitFor } from '@testing-library/react';

import { useMounted } from './useMounted';

describe('useMounted - Coverage', () => {
  describe('Unmount returns false', () => {
    it('returns false immediately after unmount', async () => {
      const { result, unmount } = renderHook(() => useMounted());

      // Wait until mounted
      await waitFor(() => {
        expect(result.current.current).toBe(true);
      });

      // Unmount
      unmount();

      // Should be false
      expect(result.current.current).toBe(false);
    });

    it('ref.current is false before mount effect runs', () => {
      const { result } = renderHook(() => useMounted());
      // Synchronously false before queueMicrotask fires
      expect(result.current.current).toBe(false);
    });
  });

  describe('queueMicrotask fallback', () => {
    it('uses setTimeout when queueMicrotask is unavailable', async () => {
      const originalQueueMicrotask = globalThis.queueMicrotask;
      // @ts-expect-error - Testing fallback
      delete globalThis.queueMicrotask;

      const { result } = renderHook(() => useMounted());

      await waitFor(() => {
        expect(result.current.current).toBe(true);
      });

      globalThis.queueMicrotask = originalQueueMicrotask;
    });
  });
});
