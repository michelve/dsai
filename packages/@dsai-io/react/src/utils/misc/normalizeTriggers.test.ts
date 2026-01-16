/**
 * @file normalizeTriggers tests
 * @module @dsai-io/react/utils/misc
 */

import { normalizeTriggers, type FloatingTrigger } from './normalizeTriggers';

describe('normalizeTriggers', () => {
  describe('Basic functionality', () => {
    it('should wrap single trigger in array', () => {
      expect(normalizeTriggers('hover')).toEqual(['hover']);
      expect(normalizeTriggers('focus')).toEqual(['focus']);
      expect(normalizeTriggers('click')).toEqual(['click']);
    });

    it('should return array unchanged when input is array', () => {
      expect(normalizeTriggers(['hover'])).toEqual(['hover']);
      expect(normalizeTriggers(['hover', 'focus'])).toEqual(['hover', 'focus']);
      expect(normalizeTriggers(['click', 'focus', 'hover'])).toEqual(['click', 'focus', 'hover']);
    });

    it('should always return an array', () => {
      const result1 = normalizeTriggers('hover');
      const result2 = normalizeTriggers(['hover', 'focus']);

      expect(Array.isArray(result1)).toBe(true);
      expect(Array.isArray(result2)).toBe(true);
    });
  });

  describe('Branch coverage', () => {
    it('should take array branch when input is array', () => {
      const triggers: FloatingTrigger[] = ['hover', 'focus'];
      const result = normalizeTriggers(triggers);

      // Array branch: should return the same array reference
      expect(result).toBe(triggers);
      expect(result).toEqual(['hover', 'focus']);
    });

    it('should take non-array branch when input is single value', () => {
      const trigger: FloatingTrigger = 'hover';
      const result = normalizeTriggers(trigger);

      // Non-array branch: should wrap in new array
      expect(result).toEqual(['hover']);
      expect(result).toHaveLength(1);
    });
  });

  describe('All trigger types', () => {
    describe('hover trigger', () => {
      it('should normalize single "hover" trigger', () => {
        expect(normalizeTriggers('hover')).toEqual(['hover']);
      });

      it('should pass through "hover" in array', () => {
        expect(normalizeTriggers(['hover'])).toEqual(['hover']);
      });
    });

    describe('focus trigger', () => {
      it('should normalize single "focus" trigger', () => {
        expect(normalizeTriggers('focus')).toEqual(['focus']);
      });

      it('should pass through "focus" in array', () => {
        expect(normalizeTriggers(['focus'])).toEqual(['focus']);
      });
    });

    describe('click trigger', () => {
      it('should normalize single "click" trigger', () => {
        expect(normalizeTriggers('click')).toEqual(['click']);
      });

      it('should pass through "click" in array', () => {
        expect(normalizeTriggers(['click'])).toEqual(['click']);
      });
    });
  });

  describe('Multiple triggers', () => {
    it('should handle two triggers', () => {
      expect(normalizeTriggers(['hover', 'focus'])).toEqual(['hover', 'focus']);
      expect(normalizeTriggers(['hover', 'click'])).toEqual(['hover', 'click']);
      expect(normalizeTriggers(['focus', 'click'])).toEqual(['focus', 'click']);
    });

    it('should handle all three triggers', () => {
      const result = normalizeTriggers(['hover', 'focus', 'click']);
      expect(result).toEqual(['hover', 'focus', 'click']);
      expect(result).toHaveLength(3);
    });

    it('should preserve trigger order', () => {
      expect(normalizeTriggers(['click', 'hover'])).toEqual(['click', 'hover']);
      expect(normalizeTriggers(['focus', 'hover', 'click'])).toEqual(['focus', 'hover', 'click']);
    });

    it('should handle duplicate triggers in array', () => {
      // Function doesn't deduplicate, just normalizes format
      const result = normalizeTriggers(['hover', 'hover']);
      expect(result).toEqual(['hover', 'hover']);
    });
  });

  describe('Type safety', () => {
    it('should accept FloatingTrigger type', () => {
      const trigger: FloatingTrigger = 'hover';
      const result = normalizeTriggers(trigger);
      expect(result).toEqual(['hover']);
    });

    it('should accept FloatingTrigger[] type', () => {
      const triggers: FloatingTrigger[] = ['hover', 'focus'];
      const result = normalizeTriggers(triggers);
      expect(result).toEqual(['hover', 'focus']);
    });

    it('should return FloatingTrigger[]', () => {
      const result: FloatingTrigger[] = normalizeTriggers('hover');
      expect(result).toEqual(['hover']);
    });

    it('should maintain type through multiple calls', () => {
      const result1 = normalizeTriggers('hover');
      const result2 = normalizeTriggers(['focus', 'click']);

      // Both results should be FloatingTrigger[]
      const triggers1: FloatingTrigger[] = result1;
      const triggers2: FloatingTrigger[] = result2;

      expect(triggers1).toEqual(['hover']);
      expect(triggers2).toEqual(['focus', 'click']);
    });
  });

  describe('Integration scenarios', () => {
    it('should work with Popover component pattern', () => {
      // Simulates how Popover uses normalizeTriggers
      const singleTrigger: FloatingTrigger | FloatingTrigger[] = 'hover';
      const normalized = normalizeTriggers(singleTrigger);
      expect(normalized).toEqual(['hover']);
      expect(Array.isArray(normalized)).toBe(true);
    });

    it('should work with Tooltip component pattern', () => {
      // Simulates how Tooltip uses normalizeTriggers
      const multipleTriggers: FloatingTrigger | FloatingTrigger[] = ['hover', 'focus'];
      const normalized = normalizeTriggers(multipleTriggers);
      expect(normalized).toEqual(['hover', 'focus']);
    });

    it('should handle prop that could be either format', () => {
      function setupFloating(trigger: FloatingTrigger | FloatingTrigger[]) {
        return normalizeTriggers(trigger);
      }

      expect(setupFloating('click')).toEqual(['click']);
      expect(setupFloating(['hover', 'focus'])).toEqual(['hover', 'focus']);
    });

    it('should work in event handler setup', () => {
      const triggers = ['hover', 'focus'] as FloatingTrigger[];
      const normalized = normalizeTriggers(triggers);

      // Simulates attaching event handlers
      normalized.forEach((trigger) => {
        expect(['hover', 'focus', 'click']).toContain(trigger);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty array', () => {
      const result = normalizeTriggers([]);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return same array reference when input is array', () => {
      const triggers: FloatingTrigger[] = ['hover', 'focus'];
      const result = normalizeTriggers(triggers);

      // Array.isArray check returns true, so should return same reference
      expect(result).toBe(triggers);
    });

    it('should create new array when input is single value', () => {
      const trigger: FloatingTrigger = 'hover';
      const result = normalizeTriggers(trigger);

      // Single value wrapped in new array
      expect(result).toEqual(['hover']);
      expect(result !== trigger).toBe(true);
    });

    it('should work with const assertion', () => {
      const trigger = 'hover' as const;
      const result = normalizeTriggers(trigger);
      expect(result).toEqual(['hover']);
    });

    it('should work with array const assertion', () => {
      const triggers = ['hover', 'focus'] as const;
      const result = normalizeTriggers(triggers as FloatingTrigger[]);
      expect(result).toEqual(['hover', 'focus']);
    });
  });

  describe('Immutability', () => {
    it('should not mutate input array', () => {
      const original: FloatingTrigger[] = ['hover', 'focus'];
      const originalCopy = [...original];

      normalizeTriggers(original);

      // Original array should be unchanged
      expect(original).toEqual(originalCopy);
    });

    it('should return independent array for single value', () => {
      const result1 = normalizeTriggers('hover');
      const result2 = normalizeTriggers('hover');

      // Different array instances
      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });
  });

  describe('Performance', () => {
    it('should execute quickly for single value', () => {
      const start = performance.now();
      normalizeTriggers('hover');
      const end = performance.now();

      // Should be nearly instantaneous (< 1ms)
      expect(end - start).toBeLessThan(1);
    });

    it('should execute quickly for array', () => {
      const start = performance.now();
      normalizeTriggers(['hover', 'focus', 'click']);
      const end = performance.now();

      // Should be nearly instantaneous (< 1ms)
      expect(end - start).toBeLessThan(1);
    });

    it('should handle bulk operations efficiently', () => {
      const singleValues: FloatingTrigger[] = Array(100).fill('hover');

      const start = performance.now();
      singleValues.forEach((value) => {
        normalizeTriggers(value);
      });
      const end = performance.now();

      // Bulk operation should be fast (< 5ms for 100 items)
      expect(end - start).toBeLessThan(5);
    });
  });

  describe('Documentation compliance', () => {
    it('should match documented behavior in JSDoc examples', () => {
      // Example from JSDoc: normalizeTriggers('hover'); // ['hover']
      expect(normalizeTriggers('hover')).toEqual(['hover']);

      // Example from JSDoc: normalizeTriggers(['hover', 'focus']); // ['hover', 'focus']
      expect(normalizeTriggers(['hover', 'focus'])).toEqual(['hover', 'focus']);

      // Example from JSDoc: normalizeTriggers('click'); // ['click']
      expect(normalizeTriggers('click')).toEqual(['click']);
    });

    it('should normalize triggers as described', () => {
      // Function should convert single value OR array into consistent array format
      const single = normalizeTriggers('focus');
      const multiple = normalizeTriggers(['focus', 'hover']);

      expect(Array.isArray(single)).toBe(true);
      expect(Array.isArray(multiple)).toBe(true);
      expect(single).toEqual(['focus']);
      expect(multiple).toEqual(['focus', 'hover']);
    });
  });

  describe('Real-world usage patterns', () => {
    it('should work with default prop values', () => {
      const defaultTrigger: FloatingTrigger | FloatingTrigger[] = 'hover';
      const normalized = normalizeTriggers(defaultTrigger);
      expect(normalized).toEqual(['hover']);
    });

    it('should work with user-provided overrides', () => {
      const userTriggers: FloatingTrigger | FloatingTrigger[] = ['hover', 'click'];
      const normalized = normalizeTriggers(userTriggers);
      expect(normalized).toEqual(['hover', 'click']);
    });

    it('should enable flexible prop API', () => {
      // Component can accept trigger={'hover'} or trigger={['hover', 'focus']}
      function useFloating(trigger: FloatingTrigger | FloatingTrigger[]) {
        const triggers = normalizeTriggers(trigger);
        return { triggers, count: triggers.length };
      }

      const result1 = useFloating('hover');
      const result2 = useFloating(['hover', 'focus']);

      expect(result1).toEqual({ triggers: ['hover'], count: 1 });
      expect(result2).toEqual({ triggers: ['hover', 'focus'], count: 2 });
    });
  });
});
