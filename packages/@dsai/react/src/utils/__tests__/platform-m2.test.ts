/**
 * @file Platform utilities test suite
 */

import {
  getBrowser,
  getDevicePixelRatio,
  getOS,
  getTextDirection,
  hasHover,
  isDesktop,
  isMobile,
  isRTL,
  isTablet,
  isTouchDevice,
} from '../platform';

describe('Platform utilities', () => {
  const originalUA = navigator.userAgent;
  const originalPlatform = navigator.platform;

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', { value: originalUA, configurable: true });
    Object.defineProperty(navigator, 'platform', { value: originalPlatform, configurable: true });
    (getBrowser as any)._cached = undefined;
    (getOS as any)._cached = undefined;
    (isMobile as any)._cached = undefined;
    (isTablet as any)._cached = undefined;
    (isDesktop as any)._cached = undefined;
  });

  it('returns null in SSR for guarded utilities', () => {
    const isBrowserSpy = jest.spyOn(require('../browser'), 'isBrowser').mockReturnValue(false);
    expect(getBrowser()).toBeNull();
    expect(getOS()).toBeNull();
    expect(isMobile()).toBeNull();
    expect(isTablet()).toBeNull();
    expect(isDesktop()).toBeNull();
    expect(getTextDirection()).toBeNull();
    expect(isRTL()).toBeNull();
    expect(hasHover()).toBeNull();
    expect(isTouchDevice()).toBeNull();
    expect(getDevicePixelRatio()).toBeNull();
    isBrowserSpy.mockRestore();
  });

  it('detects browser and caches result', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
      configurable: true,
    });
    expect(getBrowser()).toBe('Chrome');
    expect((getBrowser as any)._cached).toBe('Chrome');
  });

  it('detects OS and caches result', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      configurable: true,
    });
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    });
    expect(getOS()).toBe('macOS');
    expect((getOS as any)._cached).toBe('macOS');
  });

  it('detects mobile vs tablet vs desktop', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      configurable: true,
    });
    expect(isMobile()).toBe(true);
    expect(isTablet()).toBe(false);
    expect(isDesktop()).toBe(false);
  });

    it('handles touch and hover detection', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });
    // Simulate matchMedia
    (window as any).matchMedia = jest.fn().mockImplementation((query: string) => {
      return {
        media: query,
        matches: query.includes('hover: hover') ? true : query.includes('pointer: coarse'),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
    });
    expect(hasHover()).toBe(true);
    // With coarse pointer media query reporting true, consider as touch
    expect(isTouchDevice()).toBe(true);
  });

  it('returns text direction based on isRTL', () => {
    const isBrowserSpy = jest.spyOn(require('../browser'), 'isBrowser').mockReturnValue(true);
    const rtlSpy = jest.spyOn(require('../platform/isRTL'), 'isRTL').mockReturnValue(true);
    expect(getTextDirection()).toBe('rtl');
    rtlSpy.mockReturnValue(false);
    expect(getTextDirection()).toBe('ltr');
    rtlSpy.mockRestore();
    isBrowserSpy.mockRestore();
  });
});
