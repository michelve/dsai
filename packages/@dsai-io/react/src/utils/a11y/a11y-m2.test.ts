/**
 * @file M2.1 Accessibility Helpers Tests
 * @module @dsai-io/react/utils/a11y
 */

import {
  ANIMATION_DURATION,
  buildAriaLabel,
  combineAriaDescriptions,
  createRovingTabindex,
  getArrowKeyHandler,
  getFastDuration,
  getNormalDuration,
  getSlowDuration,
  getStandardDuration,
} from './index';

describe('buildAriaLabel', () => {
  describe('Basic functionality', () => {
    it('should return aria-label when label provided', () => {
      const result = buildAriaLabel({ label: 'Submit form' });
      expect(result).toEqual({ 'aria-label': 'Submit form' });
    });

    it('should return aria-labelledby when labelledBy provided', () => {
      const result = buildAriaLabel({ labelledBy: 'form-title' });
      expect(result).toEqual({ 'aria-labelledby': 'form-title' });
    });

    it('should prioritize labelledBy over label', () => {
      const result = buildAriaLabel({
        label: 'Submit',
        labelledBy: 'title',
      });
      expect(result).toEqual({ 'aria-labelledby': 'title' });
      expect(result['aria-label']).toBeUndefined();
    });

    it('should handle multiple labelledBy IDs as array', () => {
      const result = buildAriaLabel({
        labelledBy: ['title', 'subtitle'],
      });
      expect(result).toEqual({ 'aria-labelledby': 'title subtitle' });
    });

    it('should handle describedBy', () => {
      const result = buildAriaLabel({
        describedBy: 'help-text',
      });
      expect(result).toEqual({ 'aria-describedby': 'help-text' });
    });

    it('should handle multiple describedBy IDs', () => {
      const result = buildAriaLabel({
        describedBy: ['help', 'error'],
      });
      expect(result).toEqual({ 'aria-describedby': 'help error' });
    });

    it('should combine all properties', () => {
      const result = buildAriaLabel({
        labelledBy: 'title',
        describedBy: ['help', 'error'],
      });
      expect(result).toEqual({
        'aria-labelledby': 'title',
        'aria-describedby': 'help error',
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty strings', () => {
      const result = buildAriaLabel({
        label: '',
        labelledBy: '',
        describedBy: '',
      });
      expect(result).toEqual({});
    });

    it('should trim whitespace', () => {
      const result = buildAriaLabel({
        label: '  Submit  ',
      });
      expect(result).toEqual({ 'aria-label': 'Submit' });
    });

    it('should filter empty array items', () => {
      const result = buildAriaLabel({
        labelledBy: ['title', '', '  '],
      });
      expect(result).toEqual({ 'aria-labelledby': 'title' });
    });

    it('should return empty object when no options provided', () => {
      const result = buildAriaLabel({});
      expect(result).toEqual({});
    });
  });
});

describe('combineAriaDescriptions', () => {
  describe('Basic functionality', () => {
    it('should handle single ID', () => {
      const result = combineAriaDescriptions('help-text');
      expect(result).toBe('help-text');
    });

    it('should handle multiple IDs', () => {
      const result = combineAriaDescriptions(['help', 'error']);
      expect(result).toBe('help error');
    });

    it('should handle variadic arguments', () => {
      const result = combineAriaDescriptions('id1', 'id2', 'id3');
      expect(result).toBe('id1 id2 id3');
    });

    it('should handle mixed arrays and strings', () => {
      const result = combineAriaDescriptions('id1', ['id2', 'id3'], 'id4');
      expect(result).toBe('id1 id2 id3 id4');
    });
  });

  describe('Deduplication', () => {
    it('should remove duplicates', () => {
      const result = combineAriaDescriptions(['help', 'help', 'error']);
      expect(result).toBe('help error');
    });

    it('should preserve first occurrence order', () => {
      const result = combineAriaDescriptions(['id3', 'id1', 'id2', 'id1']);
      expect(result).toBe('id3 id1 id2');
    });
  });

  describe('Edge cases', () => {
    it('should filter null and undefined', () => {
      const result = combineAriaDescriptions('id1', null, undefined, 'id2');
      expect(result).toBe('id1 id2');
    });

    it('should filter empty strings', () => {
      const result = combineAriaDescriptions(['id1', '', 'id2']);
      expect(result).toBe('id1 id2');
    });

    it('should trim whitespace', () => {
      const result = combineAriaDescriptions(['  id1  ', 'id2  ']);
      expect(result).toBe('id1 id2');
    });

    it('should return empty string when no valid IDs', () => {
      const result = combineAriaDescriptions('', null, undefined);
      expect(result).toBe('');
    });
  });
});

describe('getArrowKeyHandler', () => {
  describe('Basic functionality', () => {
    it('should call handler for matching arrow key', () => {
      const mockUp = jest.fn();
      const handler = getArrowKeyHandler({ ArrowUp: mockUp });

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      handler(event);

      expect(mockUp).toHaveBeenCalledWith(event);
    });

    it('should not call handler for non-arrow keys', () => {
      const mockUp = jest.fn();
      const handler = getArrowKeyHandler({ ArrowUp: mockUp });

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      handler(event);

      expect(mockUp).not.toHaveBeenCalled();
    });

    it('should handle all arrow directions', () => {
      const handlers = {
        ArrowUp: jest.fn(),
        ArrowDown: jest.fn(),
        ArrowLeft: jest.fn(),
        ArrowRight: jest.fn(),
      };

      const handler = getArrowKeyHandler(handlers);

      handler(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      handler(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      handler(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      handler(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      expect(handlers.ArrowUp).toHaveBeenCalledTimes(1);
      expect(handlers.ArrowDown).toHaveBeenCalledTimes(1);
      expect(handlers.ArrowLeft).toHaveBeenCalledTimes(1);
      expect(handlers.ArrowRight).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle partial handler map', () => {
      const mockUp = jest.fn();
      const handler = getArrowKeyHandler({ ArrowUp: mockUp });

      handler(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      expect(mockUp).not.toHaveBeenCalled();
    });

    it('should handle empty handler map', () => {
      const handler = getArrowKeyHandler({});

      expect(() => {
        handler(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      }).not.toThrow();
    });
  });
});

describe('createRovingTabindex', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <button>Item 1</button>
      <button>Item 2</button>
      <button>Item 3</button>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Basic functionality', () => {
    it('should create manager', () => {
      const manager = createRovingTabindex(container, {
        itemSelector: 'button',
      });

      expect(manager).toBeDefined();
      expect(manager.getCurrentIndex()).toBe(0);
    });

    it('should set tabindex on items', () => {
      createRovingTabindex(container, {
        itemSelector: 'button',
      });

      const buttons = container.querySelectorAll('button');
      expect(buttons[0]?.getAttribute('tabindex')).toBe('0');
      expect(buttons[1]?.getAttribute('tabindex')).toBe('-1');
      expect(buttons[2]?.getAttribute('tabindex')).toBe('-1');
    });

    it('should focus at index', () => {
      const manager = createRovingTabindex(container, {
        itemSelector: 'button',
      });

      manager.focusAt(1);

      const buttons = container.querySelectorAll('button');
      expect(buttons[1]).toBe(document.activeElement);
    });

    it('should focus first', () => {
      const manager = createRovingTabindex(container, {
        itemSelector: 'button',
      });

      manager.focusAt(2);
      manager.focusFirst();

      expect(manager.getCurrentIndex()).toBe(0);
    });

    it('should focus last', () => {
      const manager = createRovingTabindex(container, {
        itemSelector: 'button',
      });

      manager.focusLast();

      expect(manager.getCurrentIndex()).toBe(2);
    });

    it('should focus next', () => {
      const manager = createRovingTabindex(container, {
        itemSelector: 'button',
      });

      manager.focusNext();

      expect(manager.getCurrentIndex()).toBe(1);
    });

    it('should focus previous', () => {
      const manager = createRovingTabindex(container, {
        itemSelector: 'button',
      });

      manager.focusAt(1);
      manager.focusPrevious();

      expect(manager.getCurrentIndex()).toBe(0);
    });
  });

  describe('Looping', () => {
    it('should loop to first when at end', () => {
      const manager = createRovingTabindex(container, {
        itemSelector: 'button',
        loop: true,
      });

      manager.focusAt(2);
      manager.focusNext();

      expect(manager.getCurrentIndex()).toBe(0);
    });

    it('should loop to last when at start', () => {
      const manager = createRovingTabindex(container, {
        itemSelector: 'button',
        loop: true,
      });

      manager.focusPrevious();

      expect(manager.getCurrentIndex()).toBe(2);
    });

    it('should not loop when disabled', () => {
      const manager = createRovingTabindex(container, {
        itemSelector: 'button',
        loop: false,
      });

      manager.focusNext();
      manager.focusNext();
      manager.focusNext();

      expect(manager.getCurrentIndex()).toBe(2);
    });
  });

  describe('Keyboard navigation', () => {
    it('should handle horizontal arrow keys', () => {
      const manager = createRovingTabindex(container, {
        itemSelector: 'button',
        orientation: 'horizontal',
      });

      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(manager.getCurrentIndex()).toBe(1);

      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(manager.getCurrentIndex()).toBe(0);
    });

    it('should handle vertical arrow keys', () => {
      const manager = createRovingTabindex(container, {
        itemSelector: 'button',
        orientation: 'vertical',
      });

      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(manager.getCurrentIndex()).toBe(1);

      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(manager.getCurrentIndex()).toBe(0);
    });

    it('should handle Home and End keys', () => {
      const manager = createRovingTabindex(container, {
        itemSelector: 'button',
      });

      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      expect(manager.getCurrentIndex()).toBe(2);

      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      expect(manager.getCurrentIndex()).toBe(0);
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on destroy', () => {
      const manager = createRovingTabindex(container, {
        itemSelector: 'button',
      });

      manager.destroy();

      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(manager.getCurrentIndex()).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('should throw for non-Element container', () => {
      expect(() => {
        createRovingTabindex(null as never, { itemSelector: 'button' });
      }).toThrow(TypeError);
    });
  });
});

describe('shouldAnimate', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    jest.resetModules();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should return true when reduced motion not preferred', () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as never;

    const { shouldAnimate: freshShouldAnimate } = jest.requireActual('./shouldAnimate');
    expect(freshShouldAnimate()).toBe(true);
  });

  it('should return false when reduced motion preferred', () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as never;

    const { shouldAnimate: freshShouldAnimate } = jest.requireActual('./shouldAnimate');
    expect(freshShouldAnimate()).toBe(false);
  });
});

describe('onAnimationPreferenceChange', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    jest.resetModules();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should listen for preference changes', () => {
    const mockAddEventListener = jest.fn();
    const mockRemoveEventListener = jest.fn();

    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    }) as never;

    const { onAnimationPreferenceChange: freshOnAnimationPreferenceChange } =
      jest.requireActual('./shouldAnimate');

    const callback = jest.fn();
    const cleanup = freshOnAnimationPreferenceChange(callback);

    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    cleanup();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});

describe('getAnimationDuration', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    jest.resetModules();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should return requested duration when animations enabled', () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as never;

    const { getAnimationDuration: freshGetAnimationDuration } =
      jest.requireActual('./getAnimationDuration');
    expect(freshGetAnimationDuration(300)).toBe(300);
  });

  it('should return 0 when reduced motion preferred', () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as never;

    const { getAnimationDuration: freshGetAnimationDuration } =
      jest.requireActual('./getAnimationDuration');
    expect(freshGetAnimationDuration(300)).toBe(0);
  });

  it('should have correct predefined durations', () => {
    expect(ANIMATION_DURATION.INSTANT).toBe(0);
    expect(ANIMATION_DURATION.FAST).toBe(150);
    expect(ANIMATION_DURATION.NORMAL).toBe(200);
    expect(ANIMATION_DURATION.STANDARD).toBe(300);
    expect(ANIMATION_DURATION.SLOW).toBe(500);
  });
});

describe('Duration helper functions', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }) as never;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('getFastDuration should return 150ms', () => {
    expect(getFastDuration()).toBe(150);
  });

  it('getNormalDuration should return 200ms', () => {
    expect(getNormalDuration()).toBe(200);
  });

  it('getStandardDuration should return 300ms', () => {
    expect(getStandardDuration()).toBe(300);
  });

  it('getSlowDuration should return 500ms', () => {
    expect(getSlowDuration()).toBe(500);
  });
});
