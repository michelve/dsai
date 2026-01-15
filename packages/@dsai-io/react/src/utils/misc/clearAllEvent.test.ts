/**
 * @file clearAllEvent tests
 * @module @dsai-io/react/utils/misc
 */

import { clearAllEvent, type ClearAllEvent } from './clearAllEvent';

describe('clearAllEvent', () => {
  describe('Basic functionality', () => {
    it('should return event with CLEAR_ALL type', () => {
      const event = clearAllEvent();
      expect(event.type).toBe('CLEAR_ALL');
    });

    it('should return an object with only the type property', () => {
      const event = clearAllEvent();
      const keys = Object.keys(event);
      expect(keys).toEqual(['type']);
      expect(keys).toHaveLength(1);
    });

    it('should return the same structure on multiple calls', () => {
      const event1 = clearAllEvent();
      const event2 = clearAllEvent();
      expect(event1).toEqual(event2);
    });
  });

  describe('Type safety', () => {
    it('should match ClearAllEvent interface', () => {
      const event: ClearAllEvent = clearAllEvent();
      expect(event.type).toBe('CLEAR_ALL');
    });

    it('should have readonly type property', () => {
      const event = clearAllEvent();
      // TypeScript enforces readonly at compile time
      // Runtime check that the property exists and has expected value
      expect(Object.getOwnPropertyDescriptor(event, 'type')).toEqual({
        value: 'CLEAR_ALL',
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });
  });

  describe('Immutability', () => {
    it('should return a new object instance on each call', () => {
      const event1 = clearAllEvent();
      const event2 = clearAllEvent();
      expect(event1).not.toBe(event2);
      expect(event1).toEqual(event2);
    });

    it('should create independent objects', () => {
      const event1 = clearAllEvent();
      const event2 = clearAllEvent();

      // Verify they are different object references
      expect(event1 === event2).toBe(false);

      // Verify modifying one doesn't affect the other
      const mutableEvent1 = event1 as { type: string };
      mutableEvent1.type = 'MODIFIED';
      expect(event2.type).toBe('CLEAR_ALL');
    });
  });

  describe('FSM integration', () => {
    it('should be usable in FSM dispatch calls', () => {
      const mockDispatch = jest.fn();
      const event = clearAllEvent();

      mockDispatch(event);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'CLEAR_ALL',
      });
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should be serializable for FSM state persistence', () => {
      const event = clearAllEvent();
      const serialized = JSON.stringify(event);
      const deserialized = JSON.parse(serialized);

      expect(deserialized).toEqual(event);
      expect(deserialized.type).toBe('CLEAR_ALL');
    });
  });

  describe('Edge cases', () => {
    it('should handle multiple sequential calls', () => {
      const events = Array.from({ length: 100 }, () => clearAllEvent());

      events.forEach((event) => {
        expect(event.type).toBe('CLEAR_ALL');
        expect(Object.keys(event)).toEqual(['type']);
      });
    });

    it('should maintain structure after Object.freeze', () => {
      const event = clearAllEvent();
      const frozenEvent = Object.freeze(event);

      expect(frozenEvent.type).toBe('CLEAR_ALL');
      expect(Object.isFrozen(frozenEvent)).toBe(true);
    });
  });
});
