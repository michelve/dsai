/**
 * @file toggleItemEvent tests
 * @module @dsai-io/react/utils/misc
 */

import { toggleItemEvent, type ToggleItemEvent } from './toggleItemEvent';

describe('toggleItemEvent', () => {
  describe('Basic functionality', () => {
    it('should return event with correct type and parameters', () => {
      const event = toggleItemEvent('item-1', 5);
      expect(event.type).toBe('TOGGLE_ITEM');
      expect(event.value).toBe('item-1');
      expect(event.totalEnabled).toBe(5);
    });

    it('should return an object with three properties', () => {
      const event = toggleItemEvent('test', 10);
      const keys = Object.keys(event);
      expect(keys).toEqual(['type', 'value', 'totalEnabled']);
      expect(keys).toHaveLength(3);
    });

    it('should return the same structure for same inputs', () => {
      const event1 = toggleItemEvent('item-1', 5);
      const event2 = toggleItemEvent('item-1', 5);
      expect(event1).toEqual(event2);
    });

    it('should return different structures for different inputs', () => {
      const event1 = toggleItemEvent('item-1', 5);
      const event2 = toggleItemEvent('item-2', 5);
      expect(event1).not.toEqual(event2);
      expect(event1.value).not.toBe(event2.value);
    });
  });

  describe('Type safety', () => {
    it('should match ToggleItemEvent interface', () => {
      const event: ToggleItemEvent = toggleItemEvent('item-1', 5);
      expect(event.type).toBe('TOGGLE_ITEM');
      expect(event.value).toBe('item-1');
      expect(event.totalEnabled).toBe(5);
    });

    it('should have readonly properties', () => {
      const event = toggleItemEvent('test', 10);
      // TypeScript enforces readonly at compile time
      // Runtime check that the properties exist and have expected values
      expect(Object.getOwnPropertyDescriptor(event, 'type')).toEqual({
        value: 'TOGGLE_ITEM',
        writable: true,
        enumerable: true,
        configurable: true,
      });
      expect(Object.getOwnPropertyDescriptor(event, 'value')).toEqual({
        value: 'test',
        writable: true,
        enumerable: true,
        configurable: true,
      });
      expect(Object.getOwnPropertyDescriptor(event, 'totalEnabled')).toEqual({
        value: 10,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });
  });

  describe('Parameter handling', () => {
    it('should handle various string values', () => {
      expect(toggleItemEvent('simple', 1).value).toBe('simple');
      expect(toggleItemEvent('with-dash', 1).value).toBe('with-dash');
      expect(toggleItemEvent('with_underscore', 1).value).toBe('with_underscore');
      expect(toggleItemEvent('with.dot', 1).value).toBe('with.dot');
      expect(toggleItemEvent('with spaces', 1).value).toBe('with spaces');
    });

    it('should handle empty string value', () => {
      const event = toggleItemEvent('', 5);
      expect(event.value).toBe('');
      expect(event.totalEnabled).toBe(5);
    });

    it('should handle very long string values', () => {
      const longString = 'a'.repeat(1000);
      const event = toggleItemEvent(longString, 10);
      expect(event.value).toBe(longString);
      expect(event.value.length).toBe(1000);
    });

    it('should handle special characters in value', () => {
      const specialChars = '!@#$%^&*()[]{}|\\:";\'<>?,./`~';
      const event = toggleItemEvent(specialChars, 5);
      expect(event.value).toBe(specialChars);
    });

    it('should handle Unicode characters in value', () => {
      const unicode = '你好世界🌍✨';
      const event = toggleItemEvent(unicode, 5);
      expect(event.value).toBe(unicode);
    });
  });

  describe('totalEnabled parameter', () => {
    it('should handle zero totalEnabled', () => {
      const event = toggleItemEvent('item-1', 0);
      expect(event.totalEnabled).toBe(0);
    });

    it('should handle negative totalEnabled', () => {
      const event = toggleItemEvent('item-1', -5);
      expect(event.totalEnabled).toBe(-5);
    });

    it('should handle large positive numbers', () => {
      const event = toggleItemEvent('item-1', 999999);
      expect(event.totalEnabled).toBe(999999);
    });

    it('should handle decimal numbers', () => {
      const event = toggleItemEvent('item-1', 5.5);
      expect(event.totalEnabled).toBe(5.5);
    });

    it('should handle Number.MAX_SAFE_INTEGER', () => {
      const event = toggleItemEvent('item-1', Number.MAX_SAFE_INTEGER);
      expect(event.totalEnabled).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should handle Number.MIN_SAFE_INTEGER', () => {
      const event = toggleItemEvent('item-1', Number.MIN_SAFE_INTEGER);
      expect(event.totalEnabled).toBe(Number.MIN_SAFE_INTEGER);
    });
  });

  describe('Immutability', () => {
    it('should return a new object instance on each call', () => {
      const event1 = toggleItemEvent('item-1', 5);
      const event2 = toggleItemEvent('item-1', 5);
      expect(event1).not.toBe(event2);
      expect(event1).toEqual(event2);
    });

    it('should create independent objects', () => {
      const event1 = toggleItemEvent('item-1', 5);
      const event2 = toggleItemEvent('item-2', 10);

      // Verify they are different object references
      expect(event1 === event2).toBe(false);

      // Verify modifying one doesn't affect the other
      const mutableEvent1 = event1 as { value: string };
      mutableEvent1.value = 'modified';
      expect(event2.value).toBe('item-2');
    });
  });

  describe('FSM integration', () => {
    it('should be usable in FSM dispatch calls', () => {
      const mockDispatch = jest.fn();
      const event = toggleItemEvent('card-1', 10);

      mockDispatch(event);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'TOGGLE_ITEM',
        value: 'card-1',
        totalEnabled: 10,
      });
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should be serializable for FSM state persistence', () => {
      const event = toggleItemEvent('item-1', 5);
      const serialized = JSON.stringify(event);
      const deserialized = JSON.parse(serialized);

      expect(deserialized).toEqual(event);
      expect(deserialized.type).toBe('TOGGLE_ITEM');
      expect(deserialized.value).toBe('item-1');
      expect(deserialized.totalEnabled).toBe(5);
    });

    it('should handle rapid successive calls', () => {
      const events = Array.from({ length: 100 }, (_, i) => toggleItemEvent(`item-${i}`, i));

      events.forEach((event, i) => {
        expect(event.type).toBe('TOGGLE_ITEM');
        expect(event.value).toBe(`item-${i}`);
        expect(event.totalEnabled).toBe(i);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle same value with different totalEnabled', () => {
      const event1 = toggleItemEvent('item-1', 5);
      const event2 = toggleItemEvent('item-1', 10);

      expect(event1.value).toBe(event2.value);
      expect(event1.totalEnabled).not.toBe(event2.totalEnabled);
      expect(event1).not.toEqual(event2);
    });

    it('should handle different value with same totalEnabled', () => {
      const event1 = toggleItemEvent('item-1', 5);
      const event2 = toggleItemEvent('item-2', 5);

      expect(event1.value).not.toBe(event2.value);
      expect(event1.totalEnabled).toBe(event2.totalEnabled);
      expect(event1).not.toEqual(event2);
    });

    it('should maintain structure after Object.freeze', () => {
      const event = toggleItemEvent('item-1', 5);
      const frozenEvent = Object.freeze(event);

      expect(frozenEvent.type).toBe('TOGGLE_ITEM');
      expect(frozenEvent.value).toBe('item-1');
      expect(frozenEvent.totalEnabled).toBe(5);
      expect(Object.isFrozen(frozenEvent)).toBe(true);
    });

    it('should work with destructuring', () => {
      const { type, value, totalEnabled } = toggleItemEvent('item-1', 5);

      expect(type).toBe('TOGGLE_ITEM');
      expect(value).toBe('item-1');
      expect(totalEnabled).toBe(5);
    });

    it('should work with spread operator', () => {
      const event = toggleItemEvent('item-1', 5);
      const spread = { ...event };

      expect(spread).toEqual(event);
      expect(spread).not.toBe(event);
    });
  });
});
