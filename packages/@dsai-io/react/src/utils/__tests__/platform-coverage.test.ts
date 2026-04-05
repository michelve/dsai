/**
 * @file Extended platform utilities coverage tests
 *
 * Covers branches not exercised by platform-m2.test.ts:
 * isRTL, getBrowser, getOS, getDevicePixelRatio, isDesktop,
 * hasHover, isTouchDevice
 */

import * as browserModule from '../browser';
import {
  getBrowser,
  getDevicePixelRatio,
  getOS,
  hasHover,
  isDesktop,
  isMobile,
  isRTL,
  isTablet,
  isTouchDevice,
} from '../platform';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const originalUA = navigator.userAgent;
const originalPlatform = navigator.platform;
const originalDir = document.dir;
let originalMatchMedia: typeof window.matchMedia;

function setUA(value: string): void {
  Object.defineProperty(navigator, 'userAgent', { value, configurable: true });
}

function setPlatform(value: string): void {
  Object.defineProperty(navigator, 'platform', { value, configurable: true });
}

function mockMatchMedia(resultMap: Record<string, boolean>): void {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    media: query,
    matches: resultMap[query] ?? false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
}

function clearAllCaches(): void {
  for (const fn of [
    getBrowser,
    getOS,
    isMobile,
    isTablet,
    isDesktop,
    isRTL,
    hasHover,
    isTouchDevice,
  ]) {
    (fn as unknown as Record<string, unknown>)._cached = undefined;
  }
}

// ---------------------------------------------------------------------------
// Setup / Teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  originalMatchMedia = window.matchMedia;
});

afterEach(() => {
  Object.defineProperty(navigator, 'userAgent', { value: originalUA, configurable: true });
  Object.defineProperty(navigator, 'platform', { value: originalPlatform, configurable: true });
  document.dir = originalDir;
  document.documentElement.removeAttribute('dir');
  window.matchMedia = originalMatchMedia;
  clearAllCaches();
  jest.restoreAllMocks();
});

// ===========================================================================
// isRTL
// ===========================================================================

describe('isRTL', () => {
  it('returns null in SSR', () => {
    jest.spyOn(browserModule, 'isBrowser').mockReturnValue(false);
    expect(isRTL()).toBeNull();
  });

  it('detects RTL via document.dir', () => {
    document.dir = 'rtl';
    expect(isRTL()).toBe(true);
  });

  it('detects LTR via document.dir', () => {
    document.dir = 'ltr';
    expect(isRTL()).toBe(false);
  });

  it('detects RTL via html[dir] attribute when document.dir is empty', () => {
    document.dir = '';
    document.documentElement.setAttribute('dir', 'RTL');
    expect(isRTL()).toBe(true);
  });

  it('detects LTR via html[dir] attribute when document.dir is empty', () => {
    document.dir = '';
    document.documentElement.setAttribute('dir', 'ltr');
    expect(isRTL()).toBe(false);
  });

  it('falls back to computed style when dir attributes are empty', () => {
    document.dir = '';
    document.documentElement.removeAttribute('dir');

    const spy = jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      direction: 'rtl',
    } as CSSStyleDeclaration);

    expect(isRTL()).toBe(true);
    spy.mockRestore();
  });

  it('returns false when computed style is ltr', () => {
    document.dir = '';
    document.documentElement.removeAttribute('dir');

    const spy = jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      direction: 'ltr',
    } as CSSStyleDeclaration);

    expect(isRTL()).toBe(false);
    spy.mockRestore();
  });

  it('caches the result on subsequent calls', () => {
    document.dir = 'rtl';
    expect(isRTL()).toBe(true);

    // Change dir after first call — should still return cached value
    document.dir = 'ltr';
    expect(isRTL()).toBe(true);
  });

  it('returns cached boolean value on second call (cache hit path)', () => {
    document.dir = 'ltr';
    isRTL(); // populates cache
    // Explicitly verify _cached was set
    expect((isRTL as unknown as Record<string, unknown>)._cached).toBe(false);
    // Second call should hit the typeof cached === 'boolean' branch
    expect(isRTL()).toBe(false);
  });
});

// ===========================================================================
// getBrowser
// ===========================================================================

describe('getBrowser', () => {
  it('returns null in SSR', () => {
    jest.spyOn(browserModule, 'isBrowser').mockReturnValue(false);
    expect(getBrowser()).toBeNull();
  });

  it('detects Edge', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Edg/120.0');
    expect(getBrowser()).toBe('Edge');
  });

  it('detects Opera via opr', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0) OPR/100.0');
    expect(getBrowser()).toBe('Opera');
  });

  it('detects Opera via opera keyword', () => {
    setUA('Opera/9.80 (Windows NT 6.1)');
    expect(getBrowser()).toBe('Opera');
  });

  it('detects Samsung Internet', () => {
    setUA('Mozilla/5.0 (Linux; Android 12) SamsungBrowser/19.0');
    expect(getBrowser()).toBe('Samsung');
  });

  it('detects Chrome', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0) Chrome/120.0.0.0 Safari/537.36');
    expect(getBrowser()).toBe('Chrome');
  });

  it('detects Safari', () => {
    setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15');
    expect(getBrowser()).toBe('Safari');
  });

  it('detects Firefox', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/121.0');
    expect(getBrowser()).toBe('Firefox');
  });

  it('returns Unknown for unrecognized UA', () => {
    setUA('SomeWeirdBrowser/1.0');
    expect(getBrowser()).toBe('Unknown');
  });

  it('caches the result', () => {
    setUA('Mozilla/5.0 Firefox/121.0');
    expect(getBrowser()).toBe('Firefox');
    // Change UA — cached result should still be returned
    setUA('Mozilla/5.0 Chrome/120.0');
    expect(getBrowser()).toBe('Firefox');
  });
});

// ===========================================================================
// getOS
// ===========================================================================

describe('getOS', () => {
  it('returns null in SSR', () => {
    jest.spyOn(browserModule, 'isBrowser').mockReturnValue(false);
    expect(getOS()).toBeNull();
  });

  it('detects iOS via iPhone', () => {
    setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)');
    expect(getOS()).toBe('iOS');
  });

  it('detects iOS via iPad', () => {
    setUA('Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)');
    expect(getOS()).toBe('iOS');
  });

  it('detects iOS via iPod', () => {
    setUA('Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X)');
    expect(getOS()).toBe('iOS');
  });

  it('detects Android', () => {
    setUA('Mozilla/5.0 (Linux; Android 13; Pixel 7)');
    setPlatform('Linux armv8l');
    expect(getOS()).toBe('Android');
  });

  it('detects Windows', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    setPlatform('Win32');
    expect(getOS()).toBe('Windows');
  });

  it('detects macOS', () => {
    setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');
    setPlatform('MacIntel');
    expect(getOS()).toBe('macOS');
  });

  it('detects Linux', () => {
    setUA('Mozilla/5.0 (X11; Linux x86_64)');
    setPlatform('Linux x86_64');
    expect(getOS()).toBe('Linux');
  });

  it('returns Unknown for unrecognized UA and platform', () => {
    setUA('SomethingRandom/1.0');
    setPlatform('UnknownPlatform');
    expect(getOS()).toBe('Unknown');
  });

  it('caches the result', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    setPlatform('Win32');
    expect(getOS()).toBe('Windows');

    setUA('Mozilla/5.0 (X11; Linux x86_64)');
    setPlatform('Linux x86_64');
    // Should still return cached value
    expect(getOS()).toBe('Windows');
  });

  it('handles missing navigator.platform gracefully', () => {
    setUA('SomethingRandom/1.0');
    Object.defineProperty(navigator, 'platform', { value: undefined, configurable: true });
    expect(getOS()).toBe('Unknown');
  });
});

// ===========================================================================
// getDevicePixelRatio
// ===========================================================================

describe('getDevicePixelRatio', () => {
  it('returns null in SSR', () => {
    jest.spyOn(browserModule, 'isBrowser').mockReturnValue(false);
    expect(getDevicePixelRatio()).toBeNull();
  });

  it('returns window.devicePixelRatio when present', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
    expect(getDevicePixelRatio()).toBe(2);
  });

  it('returns 1 when devicePixelRatio is 0 (falsy)', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 0, configurable: true });
    expect(getDevicePixelRatio()).toBe(1);
  });

  it('returns 1 when devicePixelRatio is undefined', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: undefined, configurable: true });
    expect(getDevicePixelRatio()).toBe(1);
  });

  it('returns high DPI value', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 3, configurable: true });
    expect(getDevicePixelRatio()).toBe(3);
  });

  it('returns fractional value', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 1.5, configurable: true });
    expect(getDevicePixelRatio()).toBe(1.5);
  });
});

// ===========================================================================
// isDesktop
// ===========================================================================

describe('isDesktop', () => {
  it('returns null in SSR', () => {
    jest.spyOn(browserModule, 'isBrowser').mockReturnValue(false);
    expect(isDesktop()).toBeNull();
  });

  it('returns true when not mobile and not tablet', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
    expect(isDesktop()).toBe(true);
  });

  it('returns false when device is mobile', () => {
    setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)');
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
    expect(isDesktop()).toBe(false);
  });

  it('returns false when device is tablet', () => {
    setUA('Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)');
    Object.defineProperty(window, 'innerWidth', { value: 810, configurable: true });
    expect(isDesktop()).toBe(false);
  });

  it('caches the result', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
    expect(isDesktop()).toBe(true);

    // Change to mobile UA — cached result should still return true
    setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)');
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
    (isMobile as unknown as Record<string, unknown>)._cached = undefined;
    (isTablet as unknown as Record<string, unknown>)._cached = undefined;
    // isDesktop cache is still set
    expect(isDesktop()).toBe(true);
  });

  it('returns true when isMobile or isTablet return null (edge case)', () => {
    // Simulate the edge case where isBrowser returns true for isDesktop
    // but isMobile/isTablet somehow return null
    const isBrowserSpy = jest.spyOn(browserModule, 'isBrowser');
    // First call (isDesktop) -> true, then (isMobile) -> false, then (isTablet) -> false
    // We need to make isMobile and isTablet return null
    // We can do this by making isBrowser return true for isDesktop's check
    // but false for isMobile/isTablet checks
    let callCount = 0;
    isBrowserSpy.mockImplementation(() => {
      callCount++;
      // First call is from isDesktop, second from isMobile, third from isTablet
      return callCount === 1;
    });

    expect(isDesktop()).toBe(true);
  });
});

// ===========================================================================
// hasHover
// ===========================================================================

describe('hasHover', () => {
  it('returns null in SSR', () => {
    jest.spyOn(browserModule, 'isBrowser').mockReturnValue(false);
    expect(hasHover()).toBeNull();
  });

  it('returns true when pointer: fine matches', () => {
    mockMatchMedia({
      '(pointer: fine)': true,
      '(hover: hover)': false,
    });
    expect(hasHover()).toBe(true);
  });

  it('returns true when hover: hover matches', () => {
    mockMatchMedia({
      '(pointer: fine)': false,
      '(hover: hover)': true,
    });
    (hasHover as unknown as Record<string, unknown>)._cached = undefined;
    expect(hasHover()).toBe(true);
  });

  it('returns true when both pointer: fine and hover: hover match', () => {
    mockMatchMedia({
      '(pointer: fine)': true,
      '(hover: hover)': true,
    });
    expect(hasHover()).toBe(true);
  });

  it('returns false when neither query matches', () => {
    mockMatchMedia({
      '(pointer: fine)': false,
      '(hover: hover)': false,
    });
    expect(hasHover()).toBe(false);
  });

  it('caches the result', () => {
    mockMatchMedia({
      '(pointer: fine)': true,
      '(hover: hover)': false,
    });
    expect(hasHover()).toBe(true);

    // Change matchMedia — cached result should persist
    mockMatchMedia({
      '(pointer: fine)': false,
      '(hover: hover)': false,
    });
    expect(hasHover()).toBe(true);
  });

  it('handles missing matchMedia gracefully', () => {
    (window as unknown as Record<string, unknown>).matchMedia = undefined;
    // With matchMedia undefined, the ?. returns undefined for both checks
    // undefined || undefined is undefined (falsy)
    const result = hasHover();
    expect(result).toBeFalsy();
  });
});

// ===========================================================================
// isTouchDevice
// ===========================================================================

describe('isTouchDevice', () => {
  it('returns null in SSR', () => {
    jest.spyOn(browserModule, 'isBrowser').mockReturnValue(false);
    expect(isTouchDevice()).toBeNull();
  });

  it('detects touch via ontouchstart', () => {
    (window as unknown as Record<string, unknown>).ontouchstart = null; // property exists
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });
    mockMatchMedia({ '(pointer: coarse)': false });
    expect(isTouchDevice()).toBe(true);
    delete (window as unknown as Record<string, unknown>).ontouchstart;
  });

  it('detects touch via maxTouchPoints', () => {
    delete (window as unknown as Record<string, unknown>).ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, configurable: true });
    mockMatchMedia({ '(pointer: coarse)': false });
    expect(isTouchDevice()).toBe(true);
  });

  it('detects touch via pointer: coarse media query', () => {
    delete (window as unknown as Record<string, unknown>).ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });
    mockMatchMedia({ '(pointer: coarse)': true });
    expect(isTouchDevice()).toBe(true);
  });

  it('returns false when no touch indicators are present', () => {
    delete (window as unknown as Record<string, unknown>).ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });
    mockMatchMedia({ '(pointer: coarse)': false });
    expect(isTouchDevice()).toBe(false);
  });

  it('detects touch via msMaxTouchPoints', () => {
    delete (window as unknown as Record<string, unknown>).ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });
    Object.defineProperty(navigator, 'msMaxTouchPoints', { value: 5, configurable: true });
    mockMatchMedia({ '(pointer: coarse)': false });
    expect(isTouchDevice()).toBe(true);
    Object.defineProperty(navigator, 'msMaxTouchPoints', { value: undefined, configurable: true });
  });

  it('caches the result', () => {
    (window as any).ontouchstart = null;
    mockMatchMedia({ '(pointer: coarse)': false });
    expect(isTouchDevice()).toBe(true);

    // Remove touch — cached result should persist
    delete (window as unknown as Record<string, unknown>).ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });
    mockMatchMedia({ '(pointer: coarse)': false });
    expect(isTouchDevice()).toBe(true);

    delete (window as unknown as Record<string, unknown>).ontouchstart;
  });

  it('handles missing matchMedia gracefully', () => {
    delete (window as unknown as Record<string, unknown>).ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });
    (window as unknown as Record<string, unknown>).matchMedia = undefined;
    // With matchMedia undefined, hasCoarsePointer is undefined (falsy)
    // hasTouchEvents is false, so result is false || undefined = undefined (falsy)
    const result = isTouchDevice();
    expect(result).toBeFalsy();
  });
});
