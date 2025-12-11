/**
 * Basic Utility Functions Test Suite
 *
 * Tests fundamental utility functions used across DSAi components:
 * - Reference composition (mergeRefs)
 * - ID generation (generateId)
 * - Browser environment detection (isBrowser, prefersReducedMotion)
 * - Keyboard event helpers (isEnterKey, isEscapeKey)
 * - Email and URL validation
 * - Number utilities (clamp)
 * - Accessibility selectors (focusableSelectors)
 */

import { focusableSelectorString } from '../a11y/focusableSelectors';
import { generateId } from '../a11y/generateId';
import { isBrowser } from '../browser/isBrowser';
import { prefersReducedMotion } from '../browser/prefersReducedMotion';
import { mergeRefs } from '../dom/mergeRefs';
import { isEnterKey } from '../keyboard/isEnterKey';
import { isEscapeKey } from '../keyboard/isEscapeKey';
import { clamp } from '../number/clamp';
import { isValidEmail } from '../validation/isValidEmail';
import { isValidUrl } from '../validation/isValidUrl';

describe('Basic Utility Functions', () => {
  describe('mergeRefs', () => {
    it('composes function and object refs', () => {
      const funcRefCalls: unknown[] = [];
      const funcRef = (v: unknown) => funcRefCalls.push(v);
      const objRef: { current: unknown } = { current: null };
      const merged = mergeRefs([funcRef, objRef]);
      const node = {};
      merged(node);
      expect(funcRefCalls).toEqual([node]);
      expect(objRef.current).toBe(node);
    });
  });

  describe('generateId', () => {
    it('increments with prefix', () => {
      const id1 = generateId('test');
      const id2 = generateId('test');
      expect(id1).toMatch(/^test-\d+$/);
      expect(id2).not.toEqual(id1);
    });
  });

  describe('focusableSelectors', () => {
    it('includes common selectors', () => {
      expect(focusableSelectorString).toContain('button');
      expect(focusableSelectorString).toContain('[tabindex]');
    });
  });

  describe('isBrowser', () => {
    it('guards SSR safely', () => {
      expect(isBrowser()).toBe(typeof window !== 'undefined' && typeof document !== 'undefined');
    });
  });

  describe('prefersReducedMotion', () => {
    it('returns false when matchMedia is absent', () => {
      const original = window.matchMedia;
      // @ts-expect-error - delete for test
      delete (window as typeof window & { matchMedia?: unknown }).matchMedia;
      expect(prefersReducedMotion()).toBe(false);
      window.matchMedia = original;
    });
  });

  describe('isValidEmail', () => {
    it('validates email addresses pragmatically', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('bad@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('validates URLs with allowed schemes', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('not a url')).toBe(false);
    });
  });

  describe('clamp', () => {
    it('clamps numbers within range', () => {
      expect(clamp(10, 0, 5)).toBe(5);
      expect(clamp(-1, 0, 5)).toBe(0);
      expect(clamp(3, 0, 5)).toBe(3);
    });
  });

  describe('keyboard utilities', () => {
    it('detects Enter and Escape keys', () => {
      expect(isEnterKey({ key: 'Enter' })).toBe(true);
      expect(isEnterKey({ keyCode: 13 })).toBe(true);
      expect(isEscapeKey({ key: 'Escape' })).toBe(true);
      expect(isEscapeKey({ keyCode: 27 })).toBe(true);
    });
  });
});
