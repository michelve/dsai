import { selectAllEvent, type RowId, type SelectAllEvent } from './selectAllEvent';

describe('selectAllEvent', () => {
  describe('Basic functionality', () => {
    it('should create SELECT_ALL event with type', () => {
      const result = selectAllEvent([], 0);

      expect(result.type).toBe('SELECT_ALL');
    });

    it('should include totalEnabled count', () => {
      const result = selectAllEvent(['a', 'b', 'c'], 3);

      expect(result.totalEnabled).toBe(3);
    });

    it('should convert enabled items to both formats', () => {
      const result = selectAllEvent(['option1', 'option2'], 2);

      expect(result.enabledValues).toEqual(['option1', 'option2']);
      expect(result.enabledRowIds).toEqual(['option1', 'option2']);
    });
  });

  describe('String values (CardList/CheckboxGroup)', () => {
    it('should handle string values', () => {
      const enabled = ['apple', 'banana', 'cherry'];
      const result = selectAllEvent(enabled, 3);

      expect(result).toEqual({
        type: 'SELECT_ALL',
        enabledValues: ['apple', 'banana', 'cherry'],
        enabledRowIds: ['apple', 'banana', 'cherry'],
        totalEnabled: 3,
      });
    });

    it('should preserve string values in enabledValues', () => {
      const enabled = ['value-1', 'value-2', 'value-3'];
      const result = selectAllEvent(enabled, 3);

      expect(result.enabledValues).toEqual(['value-1', 'value-2', 'value-3']);
      expect(result.enabledValues?.every((v) => typeof v === 'string')).toBe(true);
    });

    it('should handle empty string values', () => {
      const enabled = ['', 'valid', ''];
      const result = selectAllEvent(enabled, 3);

      expect(result.enabledValues).toEqual(['', 'valid', '']);
    });

    it('should handle special characters in strings', () => {
      const enabled = ['value-with-dash', 'value_with_underscore', 'value.with.dot'];
      const result = selectAllEvent(enabled, 3);

      expect(result.enabledValues).toEqual([
        'value-with-dash',
        'value_with_underscore',
        'value.with.dot',
      ]);
    });

    it('should handle Unicode characters', () => {
      const enabled = ['你好', 'مرحبا', 'Здравствуй'];
      const result = selectAllEvent(enabled, 3);

      expect(result.enabledValues).toEqual(['你好', 'مرحبا', 'Здравствуй']);
    });
  });

  describe('Number values (Table row IDs)', () => {
    it('should handle numeric row IDs', () => {
      const enabled = [1, 2, 3, 4, 5];
      const result = selectAllEvent(enabled, 5);

      expect(result).toEqual({
        type: 'SELECT_ALL',
        enabledValues: ['1', '2', '3', '4', '5'],
        enabledRowIds: [1, 2, 3, 4, 5],
        totalEnabled: 5,
      });
    });

    it('should convert numbers to strings for enabledValues', () => {
      const enabled = [42, 99, 123];
      const result = selectAllEvent(enabled, 3);

      expect(result.enabledValues).toEqual(['42', '99', '123']);
      expect(result.enabledValues?.every((v) => typeof v === 'string')).toBe(true);
    });

    it('should preserve numbers as RowId type in enabledRowIds', () => {
      const enabled = [1, 2, 3];
      const result = selectAllEvent(enabled, 3);

      expect(result.enabledRowIds).toEqual([1, 2, 3]);
      expect(result.enabledRowIds?.every((v) => typeof v === 'number')).toBe(true);
    });

    it('should handle zero as row ID', () => {
      const enabled = [0, 1, 2];
      const result = selectAllEvent(enabled, 3);

      expect(result.enabledRowIds).toEqual([0, 1, 2]);
      expect(result.enabledValues).toEqual(['0', '1', '2']);
    });

    it('should handle negative numbers', () => {
      const enabled = [-1, -2, -3];
      const result = selectAllEvent(enabled, 3);

      expect(result.enabledRowIds).toEqual([-1, -2, -3]);
      expect(result.enabledValues).toEqual(['-1', '-2', '-3']);
    });

    it('should handle large numbers', () => {
      const enabled = [1000000, 9999999];
      const result = selectAllEvent(enabled, 2);

      expect(result.enabledRowIds).toEqual([1000000, 9999999]);
      expect(result.enabledValues).toEqual(['1000000', '9999999']);
    });

    it('should handle decimal numbers', () => {
      const enabled = [1.5, 2.7, 3.9];
      const result = selectAllEvent(enabled, 3);

      expect(result.enabledRowIds).toEqual([1.5, 2.7, 3.9]);
      expect(result.enabledValues).toEqual(['1.5', '2.7', '3.9']);
    });
  });

  describe('Mixed values', () => {
    it('should handle mixed string and number values', () => {
      const enabled: Array<string | number> = ['row-1', 2, 'row-3', 4];
      const result = selectAllEvent(enabled, 4);

      expect(result.enabledValues).toEqual(['row-1', '2', 'row-3', '4']);
      expect(result.enabledRowIds).toEqual(['row-1', 2, 'row-3', 4]);
    });

    it('should convert all values to strings for enabledValues', () => {
      const enabled: Array<string | number> = [1, 'two', 3, 'four'];
      const result = selectAllEvent(enabled, 4);

      expect(result.enabledValues).toEqual(['1', 'two', '3', 'four']);
      expect(result.enabledValues?.every((v) => typeof v === 'string')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty array', () => {
      const result = selectAllEvent([], 0);

      expect(result).toEqual({
        type: 'SELECT_ALL',
        enabledValues: [],
        enabledRowIds: [],
        totalEnabled: 0,
      });
    });

    it('should handle single item', () => {
      const result = selectAllEvent(['only-one'], 1);

      expect(result).toEqual({
        type: 'SELECT_ALL',
        enabledValues: ['only-one'],
        enabledRowIds: ['only-one'],
        totalEnabled: 1,
      });
    });

    it('should handle totalEnabled different from array length', () => {
      const result = selectAllEvent(['a', 'b'], 10);

      expect(result.totalEnabled).toBe(10);
      expect(result.enabledValues).toHaveLength(2);
    });

    it('should handle totalEnabled of zero with non-empty array', () => {
      const result = selectAllEvent(['a', 'b'], 0);

      expect(result.totalEnabled).toBe(0);
      expect(result.enabledValues).toEqual(['a', 'b']);
    });

    it('should handle large arrays', () => {
      const enabled = Array.from({ length: 1000 }, (_, i) => i);
      const result = selectAllEvent(enabled, 1000);

      expect(result.enabledRowIds).toHaveLength(1000);
      expect(result.enabledValues).toHaveLength(1000);
      expect(result.totalEnabled).toBe(1000);
    });

    it('should handle duplicate values', () => {
      const enabled = ['a', 'b', 'a', 'b'];
      const result = selectAllEvent(enabled, 4);

      expect(result.enabledValues).toEqual(['a', 'b', 'a', 'b']);
      expect(result.enabledRowIds).toEqual(['a', 'b', 'a', 'b']);
    });
  });

  describe('Type safety', () => {
    it('should return readonly SelectAllEvent type', () => {
      const result: SelectAllEvent = selectAllEvent(['a'], 1);

      // TypeScript enforces readonly at compile time
      // Runtime immutability is not enforced in JavaScript
      expect(result.type).toBe('SELECT_ALL');
      expect(result.enabledValues).toBeDefined();
      expect(result.totalEnabled).toBeDefined();
    });

    it('should accept RowId type (string | number)', () => {
      const stringIds: RowId[] = ['a', 'b'];
      const numberIds: RowId[] = [1, 2];
      const mixedIds: RowId[] = ['a', 1, 'b', 2];

      expect(() => selectAllEvent(stringIds, 2)).not.toThrow();
      expect(() => selectAllEvent(numberIds, 2)).not.toThrow();
      expect(() => selectAllEvent(mixedIds, 4)).not.toThrow();
    });
  });

  describe('Immutability', () => {
    it('should not mutate input array', () => {
      const enabled = ['a', 'b', 'c'];
      const originalEnabled = [...enabled];

      selectAllEvent(enabled, 3);

      expect(enabled).toEqual(originalEnabled);
    });

    it('should create new arrays for enabledValues and enabledRowIds', () => {
      const enabled = ['a', 'b'];
      const result = selectAllEvent(enabled, 2);

      expect(result.enabledValues).not.toBe(enabled);
      expect(result.enabledRowIds).not.toBe(enabled);
    });
  });

  describe('Integration scenarios', () => {
    it('should work with CardList selection pattern', () => {
      const allCards = ['card-1', 'card-2', 'card-3', 'card-4'];
      const enabledCards = allCards.filter((id) => id !== 'card-3'); // card-3 disabled

      const event = selectAllEvent(enabledCards, enabledCards.length);

      expect(event.type).toBe('SELECT_ALL');
      expect(event.enabledValues).toEqual(['card-1', 'card-2', 'card-4']);
      expect(event.totalEnabled).toBe(3);
    });

    it('should work with CheckboxGroup selection pattern', () => {
      const options = ['option1', 'option2', 'option3'];
      const enabledOptions = options; // All enabled

      const event = selectAllEvent(enabledOptions, enabledOptions.length);

      expect(event.enabledValues).toEqual(options);
      expect(event.totalEnabled).toBe(3);
    });

    it('should work with Table row selection pattern', () => {
      const allRowIds = [0, 1, 2, 3, 4];
      const enabledRowIds = allRowIds.filter((id) => id !== 2); // row 2 disabled

      const event = selectAllEvent(enabledRowIds, enabledRowIds.length);

      expect(event.type).toBe('SELECT_ALL');
      expect(event.enabledRowIds).toEqual([0, 1, 3, 4]);
      expect(event.enabledValues).toEqual(['0', '1', '3', '4']);
      expect(event.totalEnabled).toBe(4);
    });

    it('should support FSM reducer pattern', () => {
      const event = selectAllEvent(['a', 'b', 'c'], 3);

      // Simulate FSM reducer expecting both formats
      const valueBasedSelection = event.enabledValues;
      const rowBasedSelection = event.enabledRowIds;

      expect(valueBasedSelection).toEqual(['a', 'b', 'c']);
      expect(rowBasedSelection).toEqual(['a', 'b', 'c']);
    });
  });

  describe('Performance', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => `item-${i}`);

      const start = performance.now();
      const result = selectAllEvent(largeArray, 10000);
      const end = performance.now();

      expect(end - start).toBeLessThan(100);
      expect(result.enabledValues).toHaveLength(10000);
      expect(result.enabledRowIds).toHaveLength(10000);
    });
  });
});
