/**
 * @file Platform utilities tests (M2.9)
 * @module @dsai/react/utils/__tests__/platform-m2.test
 *
 * Comprehensive tests for M2.9 platform detection utilities:
 * - getBrowser, getOS, getDevicePixelRatio, getTextDirection
 * - hasHover, isDesktop, isMobile, isTablet, isTouchDevice, isRTL
 */

// Mock isBrowser before imports
jest.mock('../browser/isBrowser', () => ({
  isBrowser: jest.fn(() => true),
}));

import { isBrowser } from '../browser/isBrowser';
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

const mockedIsBrowser = isBrowser as jest.MockedFunction<typeof isBrowser>;

describe('M2.9 Platform Detection Utilities', () => {
  let originalNavigator: Navigator;
  let originalWindow: Window & typeof globalThis;

  beforeEach(() => {
    originalNavigator = global.navigator;
    originalWindow = global.window;
    mockedIsBrowser.mockReturnValue(true);
  });

  afterEach(() => {
    global.navigator = originalNavigator;
    global.window = originalWindow;
    jest.clearAllMocks();
  });

  describe('getBrowser', () => {
    it('should return null in SSR', () => {
      mockedIsBrowser.mockReturnValue(false);
      expect(getBrowser()).toBeNull();
    });

    it('should detect Chrome', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        configurable: true,
      });
      expect(getBrowser()).toBe('Chrome');
    });

    it('should detect Firefox', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        configurable: true,
      });
      expect(getBrowser()).toBe('Firefox');
    });

    it('should detect Safari', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        configurable: true,
      });
      expect(getBrowser()).toBe('Safari');
    });

    it('should detect Edge', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
        configurable: true,
      });
      expect(getBrowser()).toBe('Edge');
    });

    it('should detect Opera', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 OPR/77.0.4054.203',
        configurable: true,
      });
      expect(getBrowser()).toBe('Opera');
    });

    it('should return Unknown for unrecognized browsers', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Some Unknown Browser/1.0',
        configurable: true,
      });
      expect(getBrowser()).toBe('Unknown');
    });

    it('should cache the result', () => {
      const first = getBrowser();
      const second = getBrowser();
      expect(first).toBe(second);
    });
  });

  describe('getOS', () => {
    it('should return null in SSR', () => {
      mockedIsBrowser.mockReturnValue(false);
      expect(getOS()).toBeNull();
    });

    it('should detect Windows', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });
      expect(getOS()).toBe('Windows');
    });

    it('should detect macOS', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        configurable: true,
      });
      expect(getOS()).toBe('macOS');
    });

    it('should detect iOS', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)',
        configurable: true,
      });
      expect(getOS()).toBe('iOS');
    });

    it('should detect Android', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 11; Pixel 5)',
        configurable: true,
      });
      expect(getOS()).toBe('Android');
    });

    it('should detect Linux', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (X11; Linux x86_64)',
        configurable: true,
      });
      expect(getOS()).toBe('Linux');
    });

    it('should return Unknown for unrecognized OS', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Some Unknown OS',
        configurable: true,
      });
      expect(getOS()).toBe('Unknown');
    });

    it('should cache the result', () => {
      const first = getOS();
      const second = getOS();
      expect(first).toBe(second);
    });
  });

  describe('getDevicePixelRatio', () => {
    it('should return 1 in SSR', () => {
      mockedIsBrowser.mockReturnValue(false);
      expect(getDevicePixelRatio()).toBe(1);
    });

    it('should return window.devicePixelRatio', () => {
      Object.defineProperty(global.window, 'devicePixelRatio', {
        value: 2,
        configurable: true,
      });
      expect(getDevicePixelRatio()).toBe(2);
    });

    it('should handle high DPI displays', () => {
      Object.defineProperty(global.window, 'devicePixelRatio', {
        value: 3,
        configurable: true,
      });
      expect(getDevicePixelRatio()).toBe(3);
    });

    it('should default to 1 if devicePixelRatio is undefined', () => {
      Object.defineProperty(global.window, 'devicePixelRatio', {
        value: undefined,
        configurable: true,
      });
      expect(getDevicePixelRatio()).toBe(1);
    });
  });

  describe('getTextDirection', () => {
    it('should return "ltr" in SSR', () => {
      mockedIsBrowser.mockReturnValue(false);
      expect(getTextDirection()).toBe('ltr');
    });

    it('should detect LTR direction', () => {
      Object.defineProperty(document.documentElement, 'dir', {
        value: 'ltr',
        configurable: true,
      });
      expect(getTextDirection()).toBe('ltr');
    });

    it('should detect RTL direction', () => {
      Object.defineProperty(document.documentElement, 'dir', {
        value: 'rtl',
        configurable: true,
      });
      expect(getTextDirection()).toBe('rtl');
    });

    it('should check computed style if dir is not set', () => {
      Object.defineProperty(document.documentElement, 'dir', {
        value: '',
        configurable: true,
      });

      global.getComputedStyle = jest.fn().mockReturnValue({
        direction: 'rtl',
      });

      expect(getTextDirection()).toBe('rtl');
    });

    it('should default to "ltr"', () => {
      Object.defineProperty(document.documentElement, 'dir', {
        value: '',
        configurable: true,
      });

      global.getComputedStyle = jest.fn().mockReturnValue({
        direction: '',
      });

      expect(getTextDirection()).toBe('ltr');
    });
  });

  describe('hasHover', () => {
    it('should return false in SSR', () => {
      mockedIsBrowser.mockReturnValue(false);
      expect(hasHover()).toBe(false);
    });

    it('should detect hover capability', () => {
      global.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === '(hover: hover)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      expect(hasHover()).toBe(true);
    });

    it('should return false for touch-only devices', () => {
      global.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      expect(hasHover()).toBe(false);
    });

    it('should handle matchMedia not available', () => {
      const originalMatchMedia = global.matchMedia;
      (global as any).matchMedia = undefined;

      expect(hasHover()).toBe(true); // Default to true

      global.matchMedia = originalMatchMedia;
    });
  });

  describe('isDesktop', () => {
    it('should return false in SSR', () => {
      mockedIsBrowser.mockReturnValue(false);
      expect(isDesktop()).toBe(false);
    });

    it('should detect desktop based on screen width', () => {
      Object.defineProperty(global.window, 'innerWidth', {
        value: 1920,
        configurable: true,
      });

      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });

      expect(isDesktop()).toBe(true);
    });

    it('should return false for mobile user agents', () => {
      Object.defineProperty(global.window, 'innerWidth', {
        value: 1920,
        configurable: true,
      });

      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)',
        configurable: true,
      });

      expect(isDesktop()).toBe(false);
    });
  });

  describe('isMobile', () => {
    it('should return false in SSR', () => {
      mockedIsBrowser.mockReturnValue(false);
      expect(isMobile()).toBe(false);
    });

    it('should detect mobile devices', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)',
        configurable: true,
      });

      Object.defineProperty(global.window, 'innerWidth', {
        value: 375,
        configurable: true,
      });

      expect(isMobile()).toBe(true);
    });

    it('should detect Android mobile', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 11; Pixel 5)',
        configurable: true,
      });

      expect(isMobile()).toBe(true);
    });

    it('should return false for desktop', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });

      Object.defineProperty(global.window, 'innerWidth', {
        value: 1920,
        configurable: true,
      });

      expect(isMobile()).toBe(false);
    });
  });

  describe('isTablet', () => {
    it('should return false in SSR', () => {
      mockedIsBrowser.mockReturnValue(false);
      expect(isTablet()).toBe(false);
    });

    it('should detect iPad', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X)',
        configurable: true,
      });

      expect(isTablet()).toBe(true);
    });

    it('should detect Android tablets', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 11; SM-T870)',
        configurable: true,
      });

      Object.defineProperty(global.window, 'innerWidth', {
        value: 800,
        configurable: true,
      });

      expect(isTablet()).toBe(true);
    });

    it('should return false for mobile phones', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)',
        configurable: true,
      });

      expect(isTablet()).toBe(false);
    });
  });

  describe('isTouchDevice', () => {
    it('should return false in SSR', () => {
      mockedIsBrowser.mockReturnValue(false);
      expect(isTouchDevice()).toBe(false);
    });

    it('should detect touch support via ontouchstart', () => {
      Object.defineProperty(global.window, 'ontouchstart', {
        value: {},
        configurable: true,
      });

      expect(isTouchDevice()).toBe(true);
    });

    it('should detect touch support via maxTouchPoints', () => {
      Object.defineProperty(global.navigator, 'maxTouchPoints', {
        value: 5,
        configurable: true,
      });

      expect(isTouchDevice()).toBe(true);
    });

    it('should detect touch support via msMaxTouchPoints', () => {
      Object.defineProperty(global.navigator, 'msMaxTouchPoints', {
        value: 5,
        configurable: true,
      });

      expect(isTouchDevice()).toBe(true);
    });

    it('should return false for non-touch devices', () => {
      Object.defineProperty(global.window, 'ontouchstart', {
        value: undefined,
        configurable: true,
      });

      Object.defineProperty(global.navigator, 'maxTouchPoints', {
        value: 0,
        configurable: true,
      });

      expect(isTouchDevice()).toBe(false);
    });
  });

  describe('isRTL', () => {
    it('should return false in SSR', () => {
      mockedIsBrowser.mockReturnValue(false);
      expect(isRTL()).toBe(false);
    });

    it('should detect RTL from document direction', () => {
      Object.defineProperty(document.documentElement, 'dir', {
        value: 'rtl',
        configurable: true,
      });

      expect(isRTL()).toBe(true);
    });

    it('should return false for LTR', () => {
      Object.defineProperty(document.documentElement, 'dir', {
        value: 'ltr',
        configurable: true,
      });

      expect(isRTL()).toBe(false);
    });

    it('should check computed style if dir is not set', () => {
      Object.defineProperty(document.documentElement, 'dir', {
        value: '',
        configurable: true,
      });

      global.getComputedStyle = jest.fn().mockReturnValue({
        direction: 'rtl',
      });

      expect(isRTL()).toBe(true);
    });
  });
});
