import { toggleAllEvent, type RowId, type ToggleAllEvent } from './toggleAllEvent';

describe('toggleAllEvent', () => {
  describe('Basic functionality', () => {
    it('should create TOGGLE_ALL event with type', () => {
      const result = toggleAllEvent([], 0);

      expect(result.type).toBe('TOGGLE_ALL');
    });

    it('should include totalEnabled count', () => {
      const result = toggleAllEvent(['a', 'b', 'c'], 3);

      expect(result.totalEnabled).toBe(3);
    });

    it('should convert enabled items to both formats', () => {
      const result = toggleAllEvent(['option1', 'option2'], 2);

      expect(result.enabledValues).toEqual(['option1', 'option2']);
      expect(result.enabledRowIds).toEqual(['option1', 'option2']);
    });
  });

  describe('String values (CheckboxGroup)', () => {
    it('should handle string values', () => {
      const enabled = ['apple', 'banana', 'cherry'];
      const result = toggleAllEvent(enabled, 3);

      expect(result).toEqual({
        type: 'TOGGLE_ALL',
        totalEnabled: 3,
        enabledValues: ['apple', 'banana', 'cherry'],
        enabledRowIds: ['apple', 'banana', 'cherry'],
      });
    });

    it('should preserve string values in enabledValues', () => {
      const enabled = ['value-1', 'value-2', 'value-3'];
      const result = toggleAllEvent(enabled, 3);

      expect(result.enabledValues).toEqual(['value-1', 'value-2', 'value-3']);
      expect(result.enabledValues?.every((v) => typeof v === 'string')).toBe(true);
    });

    it('should handle empty string values', () => {
      const enabled = ['', 'valid', ''];
      const result = toggleAllEvent(enabled, 3);

      expect(result.enabledValues).toEqual(['', 'valid', '']);
    });

    it('should handle special characters in strings', () => {
      const enabled = ['value-with-dash', 'value_with_underscore', 'value.with.dot'];
      const result = toggleAllEvent(enabled, 3);

      expect(result.enabledValues).toEqual([
        'value-with-dash',
        'value_with_underscore',
        'value.with.dot',
      ]);
    });

    it('should handle Unicode characters', () => {
      const enabled = ['你好', 'مرحبا', 'Здравствуй'];
      const result = toggleAllEvent(enabled, 3);

      expect(result.enabledValues).toEqual(['你好', 'مرحبا', 'Здравствуй']);
    });
  });

  describe('Number values (Table row IDs)', () => {
    it('should handle numeric row IDs', () => {
      const enabled = [1, 2, 3, 4, 5];
      const result = toggleAllEvent(enabled, 5);

      expect(result).toEqual({
        type: 'TOGGLE_ALL',
        totalEnabled: 5,
        enabledValues: ['1', '2', '3', '4', '5'],
        enabledRowIds: [1, 2, 3, 4, 5],
      });
    });

    it('should convert numbers to strings for enabledValues', () => {
      const enabled = [42, 99, 123];
      const result = toggleAllEvent(enabled, 3);

      expect(result.enabledValues).toEqual(['42', '99', '123']);
      expect(result.enabledValues?.every((v) => typeof v === 'string')).toBe(true);
    });

    it('should preserve numbers as RowId type in enabledRowIds', () => {
      const enabled = [1, 2, 3];
      const result = toggleAllEvent(enabled, 3);

      expect(result.enabledRowIds).toEqual([1, 2, 3]);
      expect(result.enabledRowIds?.every((v) => typeof v === 'number')).toBe(true);
    });

    it('should handle zero as row ID', () => {
      const enabled = [0, 1, 2];
      const result = toggleAllEvent(enabled, 3);

      expect(result.enabledRowIds).toEqual([0, 1, 2]);
      expect(result.enabledValues).toEqual(['0', '1', '2']);
    });

    it('should handle negative numbers', () => {
      const enabled = [-1, -2, -3];
      const result = toggleAllEvent(enabled, 3);

      expect(result.enabledRowIds).toEqual([-1, -2, -3]);
      expect(result.enabledValues).toEqual(['-1', '-2', '-3']);
    });

    it('should handle large numbers', () => {
      const enabled = [1000000, 9999999];
      const result = toggleAllEvent(enabled, 2);

      expect(result.enabledRowIds).toEqual([1000000, 9999999]);
      expect(result.enabledValues).toEqual(['1000000', '9999999']);
    });

    it('should handle decimal numbers', () => {
      const enabled = [1.5, 2.7, 3.9];
      const result = toggleAllEvent(enabled, 3);

      expect(result.enabledRowIds).toEqual([1.5, 2.7, 3.9]);
      expect(result.enabledValues).toEqual(['1.5', '2.7', '3.9']);
    });
  });

  describe('Mixed values', () => {
    it('should handle mixed string and number values', () => {
      const enabled: Array<string | number> = ['row-1', 2, 'row-3', 4];
      const result = toggleAllEvent(enabled, 4);

      expect(result.enabledValues).toEqual(['row-1', '2', 'row-3', '4']);
      expect(result.enabledRowIds).toEqual(['row-1', 2, 'row-3', 4]);
    });

    it('should convert all values to strings for enabledValues', () => {
      const enabled: Array<string | number> = [1, 'two', 3, 'four'];
      const result = toggleAllEvent(enabled, 4);

      expect(result.enabledValues).toEqual(['1', 'two', '3', 'four']);
      expect(result.enabledValues?.every((v) => typeof v === 'string')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty array', () => {
      const result = toggleAllEvent([], 0);

      expect(result).toEqual({
        type: 'TOGGLE_ALL',
        totalEnabled: 0,
        enabledValues: [],
        enabledRowIds: [],
      });
    });

    it('should handle single item', () => {
      const result = toggleAllEvent(['only-one'], 1);

      expect(result).toEqual({
        type: 'TOGGLE_ALL',
        totalEnabled: 1,
        enabledValues: ['only-one'],
        enabledRowIds: ['only-one'],
      });
    });

    it('should handle totalEnabled different from array length', () => {
      const result = toggleAllEvent(['a', 'b'], 10);

      expect(result.totalEnabled).toBe(10);
      expect(result.enabledValues).toHaveLength(2);
    });

    it('should handle totalEnabled of zero with non-empty array', () => {
      const result = toggleAllEvent(['a', 'b'], 0);

      expect(result.totalEnabled).toBe(0);
      expect(result.enabledValues).toEqual(['a', 'b']);
    });

    it('should handle large arrays', () => {
      const enabled = Array.from({ length: 1000 }, (_, i) => i);
      const result = toggleAllEvent(enabled, 1000);

      expect(result.enabledRowIds).toHaveLength(1000);
      expect(result.enabledValues).toHaveLength(1000);
      expect(result.totalEnabled).toBe(1000);
    });

    it('should handle duplicate values', () => {
      const enabled = ['a', 'b', 'a', 'b'];
      const result = toggleAllEvent(enabled, 4);

      expect(result.enabledValues).toEqual(['a', 'b', 'a', 'b']);
      expect(result.enabledRowIds).toEqual(['a', 'b', 'a', 'b']);
    });
  });

  describe('Type safety', () => {
    it('should return readonly ToggleAllEvent type', () => {
      const result: ToggleAllEvent = toggleAllEvent(['a'], 1);

      // TypeScript enforces readonly at compile time
      // Runtime immutability is not enforced in JavaScript
      expect(result.type).toBe('TOGGLE_ALL');
      expect(typeof result.totalEnabled).toBe('number');
    });

    it('should accept RowId type (string | number)', () => {
      const stringIds: RowId[] = ['a', 'b'];
      const numberIds: RowId[] = [1, 2];
      const mixedIds: RowId[] = ['a', 1, 'b', 2];

      expect(() => toggleAllEvent(stringIds, 2)).not.toThrow();
      expect(() => toggleAllEvent(numberIds, 2)).not.toThrow();
      expect(() => toggleAllEvent(mixedIds, 4)).not.toThrow();
    });
  });

  describe('Immutability', () => {
    it('should not mutate input array', () => {
      const enabled = ['a', 'b', 'c'];
      const originalEnabled = [...enabled];

      toggleAllEvent(enabled, 3);

      expect(enabled).toEqual(originalEnabled);
    });

    it('should create new arrays for enabledValues and enabledRowIds', () => {
      const enabled = ['a', 'b'];
      const result = toggleAllEvent(enabled, 2);

      expect(result.enabledValues).not.toBe(enabled);
      expect(result.enabledRowIds).not.toBe(enabled);
    });
  });

  describe('Integration scenarios', () => {
    it('should work with CheckboxGroup toggle pattern', () => {
      const allOptions = ['option1', 'option2', 'option3', 'option4'];
      const enabledOptions = allOptions.filter((id) => id !== 'option3'); // option3 disabled

      const event = toggleAllEvent(enabledOptions, enabledOptions.length);

      expect(event.type).toBe('TOGGLE_ALL');
      expect(event.enabledValues).toEqual(['option1', 'option2', 'option4']);
      expect(event.totalEnabled).toBe(3);
    });

    it('should work with Table row toggle pattern', () => {
      const allRowIds = [0, 1, 2, 3, 4];
      const enabledRowIds = allRowIds.filter((id) => id !== 2); // row 2 disabled

      const event = toggleAllEvent(enabledRowIds, enabledRowIds.length);

      expect(event.type).toBe('TOGGLE_ALL');
      expect(event.enabledRowIds).toEqual([0, 1, 3, 4]);
      expect(event.enabledValues).toEqual(['0', '1', '3', '4']);
      expect(event.totalEnabled).toBe(4);
    });

    it('should support FSM reducer pattern', () => {
      const event = toggleAllEvent(['a', 'b', 'c'], 3);

      // Simulate FSM reducer expecting both formats
      const valueBasedSelection = event.enabledValues;
      const rowBasedSelection = event.enabledRowIds;

      expect(valueBasedSelection).toEqual(['a', 'b', 'c']);
      expect(rowBasedSelection).toEqual(['a', 'b', 'c']);
    });

    it('should toggle from selected to unselected state', () => {
      // Scenario: All items currently selected, toggle to unselect
      const currentlySelected = ['item1', 'item2', 'item3'];
      const enabledItems = ['item1', 'item2', 'item3'];

      const event = toggleAllEvent(enabledItems, 3);

      expect(event.totalEnabled).toBe(3);
      expect(event.enabledValues).toEqual(currentlySelected);
    });

    it('should toggle from unselected to selected state', () => {
      // Scenario: No items currently selected, toggle to select all
      const enabledItems = ['item1', 'item2', 'item3'];

      const event = toggleAllEvent(enabledItems, 3);

      expect(event.totalEnabled).toBe(3);
      expect(event.enabledValues).toEqual(['item1', 'item2', 'item3']);
    });

    it('should handle partial selection toggle', () => {
      // Scenario: Some items selected, toggle should select all enabled
      const enabledItems = ['item1', 'item2', 'item3', 'item4'];

      const event = toggleAllEvent(enabledItems, 4);

      expect(event.totalEnabled).toBe(4);
      expect(event.enabledValues).toHaveLength(4);
    });
  });

  describe('Comparison with selectAllEvent', () => {
    it('should have same shape as selectAllEvent but different type', () => {
      const enabled = ['a', 'b', 'c'];
      const result = toggleAllEvent(enabled, 3);

      expect(result).toHaveProperty('type', 'TOGGLE_ALL');
      expect(result).toHaveProperty('totalEnabled', 3);
      expect(result).toHaveProperty('enabledValues');
      expect(result).toHaveProperty('enabledRowIds');
    });

    it('should produce same payload structure as selectAllEvent', () => {
      const enabled = ['x', 'y', 'z'];
      const toggleResult = toggleAllEvent(enabled, 3);

      // Both should have identical structure except for type
      expect(toggleResult.enabledValues).toEqual(['x', 'y', 'z']);
      expect(toggleResult.enabledRowIds).toEqual(['x', 'y', 'z']);
      expect(toggleResult.totalEnabled).toBe(3);
    });
  });

  describe('Performance', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => `item-${i}`);

      const start = performance.now();
      const result = toggleAllEvent(largeArray, 10000);
      const end = performance.now();

      expect(end - start).toBeLessThan(100);
      expect(result.enabledValues).toHaveLength(10000);
      expect(result.enabledRowIds).toHaveLength(10000);
    });
  });
});
