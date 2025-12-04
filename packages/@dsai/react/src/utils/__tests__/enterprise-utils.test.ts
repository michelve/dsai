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

describe('enterprise utilities', () => {
  it('mergeRefs composes function and object refs', () => {
    const funcRefCalls: unknown[] = [];
    const funcRef = (v: unknown) => funcRefCalls.push(v);
    const objRef: { current: unknown } = { current: null };
    const merged = mergeRefs([funcRef, objRef]);
    const node = {};
    merged(node);
    expect(funcRefCalls).toEqual([node]);
    expect(objRef.current).toBe(node);
  });

  it('generateId increments with prefix', () => {
    const id1 = generateId('test');
    const id2 = generateId('test');
    expect(id1).toMatch(/^test-\d+$/);
    expect(id2).not.toEqual(id1);
  });

  it('focusable selector string includes common selectors', () => {
    expect(focusableSelectorString).toContain('button');
    expect(focusableSelectorString).toContain('[tabindex]');
  });

  it('isBrowser guards SSR safely', () => {
    expect(isBrowser()).toBe(typeof window !== 'undefined' && typeof document !== 'undefined');
  });

  it('prefersReducedMotion returns false when matchMedia is absent', () => {
    const original = window.matchMedia;
    // @ts-expect-error - delete for test
    delete (window as typeof window & { matchMedia?: unknown }).matchMedia;
    expect(prefersReducedMotion()).toBe(false);
    window.matchMedia = original;
  });

  it('validates email addresses pragmatically', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('bad@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('validates URLs with allowed schemes', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://example.com')).toBe(true);
    expect(isValidUrl('ftp://example.com')).toBe(false);
    expect(isValidUrl('not a url')).toBe(false);
  });

  it('clamps numbers within range', () => {
    expect(clamp(10, 0, 5)).toBe(5);
    expect(clamp(-1, 0, 5)).toBe(0);
    expect(clamp(3, 0, 5)).toBe(3);
  });

  it('detects Enter and Escape keys', () => {
    expect(isEnterKey({ key: 'Enter' })).toBe(true);
    expect(isEnterKey({ keyCode: 13 })).toBe(true);
    expect(isEscapeKey({ key: 'Escape' })).toBe(true);
    expect(isEscapeKey({ keyCode: 27 })).toBe(true);
  });
});
