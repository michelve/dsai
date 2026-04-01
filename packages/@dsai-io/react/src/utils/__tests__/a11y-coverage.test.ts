/**
 * @file Additional coverage tests for a11y utilities
 *
 * Covers untested branches in:
 * - shouldAnimate: prefersReducedMotion true/false, no matchMedia, cache
 * - onAnimationPreferenceChange: listener setup and cleanup
 * - trapFocus: untested paths (invalid container, no focusable elements, escape, single element)
 * - announceToScreenReader: cleanup, timeout clearing, reuse container with different politeness
 * - generateId: branch paths (default prefix, custom prefix)
 */

import { announceToScreenReader } from '../a11y/announceToScreenReader';
import { generateId } from '../a11y/generateId';
import { trapFocus } from '../a11y/trapFocus';

// =============================================================================
// shouldAnimate & onAnimationPreferenceChange
// =============================================================================

describe('shouldAnimate (additional coverage)', () => {
  // We use jest.resetModules() + require() so each test gets a fresh module
  // with its own cachedMediaQuery. We mock matchMedia via jest.spyOn.

  it('should return false when matchMedia is unavailable', () => {
    jest.resetModules();
    const origMM = window.matchMedia;
    // Set matchMedia to undefined (writable: true from custom env)
    (window as any).matchMedia = undefined;

    const mod = require('../a11y/shouldAnimate');
    expect(mod.shouldAnimate()).toBe(false);

    // Restore
    (window as any).matchMedia = origMM;
  });

  it('should return true when reduced motion is NOT preferred', () => {
    jest.resetModules();
    const spy = jest.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    const mod = require('../a11y/shouldAnimate');
    expect(mod.shouldAnimate()).toBe(true);
    spy.mockRestore();
  });

  it('should return false when reduced motion IS preferred', () => {
    jest.resetModules();
    const spy = jest.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    const mod = require('../a11y/shouldAnimate');
    expect(mod.shouldAnimate()).toBe(false);
    spy.mockRestore();
  });

  it('should cache the media query and reuse it', () => {
    jest.resetModules();
    const mockMatchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });
    const spy = jest.spyOn(window, 'matchMedia').mockImplementation(mockMatchMedia);

    const mod = require('../a11y/shouldAnimate');
    mod.shouldAnimate();
    mod.shouldAnimate();
    // matchMedia should be called only once due to caching
    expect(mockMatchMedia).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});

describe('onAnimationPreferenceChange (additional coverage)', () => {
  it('should return noop when matchMedia is unavailable', () => {
    jest.resetModules();
    const origMM = window.matchMedia;
    (window as any).matchMedia = undefined;

    const mod = require('../a11y/shouldAnimate');
    const cleanup = mod.onAnimationPreferenceChange(jest.fn());
    expect(typeof cleanup).toBe('function');
    cleanup(); // should not throw

    (window as any).matchMedia = origMM;
  });

  it('should add and remove event listener', () => {
    jest.resetModules();
    const addListener = jest.fn();
    const removeListener = jest.fn();
    const spy = jest.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      addEventListener: addListener,
      removeEventListener: removeListener,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    const mod = require('../a11y/shouldAnimate');
    const callback = jest.fn();
    const cleanup = mod.onAnimationPreferenceChange(callback);

    expect(addListener).toHaveBeenCalledWith('change', expect.any(Function));

    cleanup();
    expect(removeListener).toHaveBeenCalledWith('change', expect.any(Function));
    spy.mockRestore();
  });

  it('should call callback with inverted matches value on change', () => {
    jest.resetModules();
    let changeHandler: ((event: MediaQueryListEvent) => void) | null = null;
    const spy = jest.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      addEventListener: jest.fn((_event: string, handler: (event: MediaQueryListEvent) => void) => {
        changeHandler = handler;
      }),
      removeEventListener: jest.fn(),
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    const mod = require('../a11y/shouldAnimate');
    const callback = jest.fn();
    mod.onAnimationPreferenceChange(callback);

    // Simulate change event - matches=true means reduced motion preferred, so shouldAnimate=false
    changeHandler!({ matches: true } as MediaQueryListEvent);
    expect(callback).toHaveBeenCalledWith(false);

    changeHandler!({ matches: false } as MediaQueryListEvent);
    expect(callback).toHaveBeenCalledWith(true);

    spy.mockRestore();
  });
});

// =============================================================================
// trapFocus - additional coverage
// =============================================================================

describe('trapFocus (additional coverage)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should return noop for invalid container (null)', () => {
    const cleanup = trapFocus(null as unknown as HTMLElement);
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('should return noop for non-HTMLElement container', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const cleanup = trapFocus({} as HTMLElement);
    expect(typeof cleanup).toBe('function');
    cleanup();
    warnSpy.mockRestore();
  });

  it('should return noop when no focusable elements found', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const container = document.createElement('div');
    container.innerHTML = '<span>Not focusable</span>';
    document.body.appendChild(container);

    const cleanup = trapFocus(container);
    expect(typeof cleanup).toBe('function');
    cleanup();
    warnSpy.mockRestore();
  });

  it('should handle Escape key when onEscape is provided', () => {
    const container = document.createElement('div');
    const button = document.createElement('button');
    button.textContent = 'Click';
    container.appendChild(button);
    document.body.appendChild(container);

    const onEscape = jest.fn();
    const cleanup = trapFocus(container, { onEscape });

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    container.dispatchEvent(event);

    expect(onEscape).toHaveBeenCalled();
    expect(preventDefaultSpy).toHaveBeenCalled();

    cleanup();
  });

  it('should trap Tab on single focusable element', () => {
    const container = document.createElement('div');
    const button = document.createElement('button');
    button.textContent = 'Only button';
    container.appendChild(button);
    document.body.appendChild(container);

    const onWrap = jest.fn();
    const cleanup = trapFocus(container, { onWrap });

    // Focus the button
    button.focus();

    // Tab should wrap to same element
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
    });
    jest.spyOn(event, 'preventDefault');
    container.dispatchEvent(event);

    expect(onWrap).toHaveBeenCalled();

    cleanup();
  });

  it('should focus first element when initialFocus is true', () => {
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    button1.textContent = 'First';
    const button2 = document.createElement('button');
    button2.textContent = 'Second';
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);

    const focusSpy = jest.spyOn(button1, 'focus');
    const cleanup = trapFocus(container, { initialFocus: true });

    expect(focusSpy).toHaveBeenCalled();
    cleanup();
  });

  it('should wrap Tab forward from last element to first', () => {
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    button1.textContent = 'First';
    const button2 = document.createElement('button');
    button2.textContent = 'Second';
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);

    const onWrap = jest.fn();
    const cleanup = trapFocus(container, { onWrap });

    // Focus last element
    button2.focus();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
    });
    jest.spyOn(event, 'preventDefault');
    container.dispatchEvent(event);

    expect(onWrap).toHaveBeenCalled();
    cleanup();
  });

  it('should wrap Shift+Tab from first element to last', () => {
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    button1.textContent = 'First';
    const button2 = document.createElement('button');
    button2.textContent = 'Second';
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);

    const onWrap = jest.fn();
    const cleanup = trapFocus(container, { onWrap });

    // Focus first element
    button1.focus();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    });
    jest.spyOn(event, 'preventDefault');
    container.dispatchEvent(event);

    expect(onWrap).toHaveBeenCalled();
    cleanup();
  });

  it('should not interfere with non-Tab keys (other than Escape)', () => {
    const container = document.createElement('div');
    const button = document.createElement('button');
    button.textContent = 'Button';
    container.appendChild(button);
    document.body.appendChild(container);

    const cleanup = trapFocus(container);

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    container.dispatchEvent(event);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
    cleanup();
  });
});

// =============================================================================
// announceToScreenReader - additional coverage
// =============================================================================

describe('announceToScreenReader (additional coverage)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  it('should clear message text after timeout', () => {
    announceToScreenReader('Temporary message', { timeoutMs: 1000 });

    const container = document.getElementById('dsai-live-region');
    expect(container?.textContent).toBe('Temporary message');

    jest.advanceTimersByTime(1500);
    expect(container?.textContent).toBe('');
  });

  it('should clear message text when cleanup is called before timeout', () => {
    const cleanup = announceToScreenReader('Cleanup test', { timeoutMs: 5000 });

    const container = document.getElementById('dsai-live-region');
    expect(container?.textContent).toBe('Cleanup test');

    cleanup();
    expect(container?.textContent).toBe('');
  });

  it('should reuse existing container and update ARIA attributes', () => {
    // First call creates polite
    announceToScreenReader('Polite message', { politeness: 'polite' });
    let container = document.getElementById('dsai-live-region');
    expect(container?.getAttribute('aria-live')).toBe('polite');
    expect(container?.getAttribute('role')).toBe('status');

    // Second call reuses and updates to assertive
    announceToScreenReader('Assertive message', { politeness: 'assertive' });
    container = document.getElementById('dsai-live-region');
    expect(container?.getAttribute('aria-live')).toBe('assertive');
    expect(container?.getAttribute('role')).toBe('alert');
  });

  it('should use custom ID for live region', () => {
    announceToScreenReader('Custom region', { id: 'custom-live-region' });
    const container = document.getElementById('custom-live-region');
    expect(container).not.toBeNull();
    expect(container?.textContent).toBe('Custom region');
  });

  it('should resolve assertive from boolean alias', () => {
    announceToScreenReader('Assert via boolean', { assertive: true });
    const container = document.getElementById('dsai-live-region');
    expect(container?.getAttribute('aria-live')).toBe('assertive');
  });

  it('should prefer explicit politeness over assertive boolean', () => {
    announceToScreenReader('Polite overrides', {
      politeness: 'polite',
      assertive: true,
    });
    const container = document.getElementById('dsai-live-region');
    expect(container?.getAttribute('aria-live')).toBe('polite');
  });
});

// =============================================================================
// generateId - branch coverage
// =============================================================================

describe('generateId (branch coverage)', () => {
  it('should use default prefix "id" when no prefix provided', () => {
    const id = generateId();
    expect(id).toMatch(/^id-\d+$/);
  });

  it('should use custom prefix', () => {
    const id = generateId('modal');
    expect(id).toMatch(/^modal-\d+$/);
  });

  it('should increment counter for each call', () => {
    const id1 = generateId('test');
    const id2 = generateId('test');
    const num1 = parseInt(id1.split('-')[1], 10);
    const num2 = parseInt(id2.split('-')[1], 10);
    expect(num2).toBe(num1 + 1);
  });

  it('should generate unique IDs across different prefixes', () => {
    const id1 = generateId('a');
    const id2 = generateId('b');
    expect(id1).not.toBe(id2);
  });
});
