/**
 * @file Object utilities tests
 * @module @dsai/react/utils/object
 */

import { deepMerge } from './deepMerge';
import { omit } from './omit';
import { pick } from './pick';

describe('deepMerge', () => {
  describe('Basic functionality', () => {
    it('should merge two simple objects', () => {
      const result = deepMerge({ a: 1, b: 2 }, { b: 3, c: 4 });
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should merge nested objects', () => {
      const result = deepMerge({ a: 1, b: { c: 2, d: 3 } }, { b: { d: 4, e: 5 }, f: 6 });
      expect(result).toEqual({
        a: 1,
        b: { c: 2, d: 4, e: 5 },
        f: 6,
      });
    });

    it('should not mutate source objects', () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 } };
      const targetCopy = JSON.parse(JSON.stringify(target));
      const sourceCopy = JSON.parse(JSON.stringify(source));

      deepMerge(target, source);

      expect(target).toEqual(targetCopy);
      expect(source).toEqual(sourceCopy);
    });

    it('should merge multiple sources', () => {
      const result = deepMerge({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 });
      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    it('should skip null/undefined sources', () => {
      const result = deepMerge({ a: 1 }, null as never, undefined as never, { b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('Array merge strategies', () => {
    it('should replace arrays by default', () => {
      const result = deepMerge({ arr: [1, 2, 3] }, { arr: [4, 5] });
      expect(result).toEqual({ arr: [4, 5] });
    });

    it('should replace arrays when strategy is "replace"', () => {
      const result = deepMerge(
        { arr: [1, 2, 3] },
        { arr: [4, 5] },
        { arrayMergeStrategy: 'replace' }
      );
      expect(result).toEqual({ arr: [4, 5] });
    });

    it('should concat arrays when strategy is "concat"', () => {
      const result = deepMerge({ arr: [1, 2] }, { arr: [3, 4] }, { arrayMergeStrategy: 'concat' });
      expect(result).toEqual({ arr: [1, 2, 3, 4] });
    });

    it('should create unique arrays when strategy is "unique"', () => {
      const result = deepMerge(
        { arr: [1, 2, 3] },
        { arr: [2, 3, 4] },
        { arrayMergeStrategy: 'unique' }
      );
      expect(result).toEqual({ arr: [1, 2, 3, 4] });
    });

    it('should handle unique arrays with objects', () => {
      const result = deepMerge(
        { arr: [{ id: 1 }, { id: 2 }] },
        { arr: [{ id: 2 }, { id: 3 }] },
        { arrayMergeStrategy: 'unique' }
      );
      expect(result).toEqual({
        arr: [{ id: 1 }, { id: 2 }, { id: 3 }],
      });
    });

    it('should replace non-array with array', () => {
      const result = deepMerge({ value: 'string' }, { value: [1, 2, 3] });
      expect(result).toEqual({ value: [1, 2, 3] });
    });
  });

  describe('Depth limits', () => {
    it('should merge within default depth limit', () => {
      const deep = {
        l1: { l2: { l3: { l4: { l5: { l6: { l7: { l8: { l9: { l10: 'deep' } } } } } } } } },
      };
      const result = deepMerge(deep, { l1: { l2: { l3: { added: true } } } });
      expect(result.l1.l2.l3).toHaveProperty('added', true);
    });

    it('should throw when max depth exceeded', () => {
      const deep = {
        l1: { l2: { l3: { l4: { l5: 'value' } } } },
      };
      expect(() =>
        deepMerge(deep, { l1: { l2: { l3: { l4: { l5: { l6: 'too deep' } } } } } }, { maxDepth: 3 })
      ).toThrow('maximum depth');
    });

    it('should enforce custom max depth', () => {
      expect(() =>
        deepMerge({ a: { b: { c: 1 } } }, { a: { b: { c: { d: 2 } } } }, { maxDepth: 2 })
      ).toThrow('maximum depth');
    });
  });

  describe('Circular reference detection', () => {
    it('should detect circular references', () => {
      const circular: Record<string, unknown> = { a: 1 };
      circular.self = circular;

      expect(() => deepMerge({}, circular)).toThrow('circular reference');
    });

    it('should detect nested circular references', () => {
      const obj1: Record<string, unknown> = { a: 1 };
      const obj2: Record<string, unknown> = { b: 2 };
      obj1.child = obj2;
      obj2.parent = obj1;

      expect(() => deepMerge({}, obj1)).toThrow('circular reference');
    });
  });

  describe('Prototype pollution prevention', () => {
    it('should prevent __proto__ pollution', () => {
      expect(() => deepMerge({}, JSON.parse('{"__proto__": {"polluted": true}}'))).toThrow(
        'prototype pollution'
      );
    });

    it('should prevent constructor pollution', () => {
      expect(() => deepMerge({}, { constructor: { polluted: true } })).toThrow(
        'prototype pollution'
      );
    });

    it('should prevent prototype pollution', () => {
      expect(() => deepMerge({}, { prototype: { polluted: true } })).toThrow('prototype pollution');
    });
  });

  describe('Error handling', () => {
    it('should throw for non-object target', () => {
      expect(() => deepMerge(null as never, {})).toThrow(TypeError);
      expect(() => deepMerge([] as never, {})).toThrow(TypeError);
      expect(() => deepMerge('string' as never, {})).toThrow(TypeError);
    });

    it('should throw for non-object sources', () => {
      expect(() => deepMerge({}, [] as never)).toThrow(TypeError);
      expect(() => deepMerge({}, 'string' as never)).toThrow(TypeError);
    });

    it('should throw for array length mismatch when not allowed', () => {
      expect(() =>
        deepMerge({ arr: [1, 2, 3] }, { arr: [4, 5] }, { allowArrayLengthMismatch: false })
      ).toThrow('array length mismatch');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty objects', () => {
      expect(deepMerge({}, {})).toEqual({});
    });

    it('should handle deeply nested empty objects', () => {
      const result = deepMerge({ a: { b: { c: {} } } }, { a: { b: { c: { d: 1 } } } });
      expect(result).toEqual({ a: { b: { c: { d: 1 } } } });
    });

    it('should handle objects with many keys', () => {
      const obj1 = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, i]));
      const obj2 = { newKey: 'value' };
      const result = deepMerge(obj1, obj2);
      expect(result).toHaveProperty('key0', 0);
      expect(result).toHaveProperty('key99', 99);
      expect(result).toHaveProperty('newKey', 'value');
    });
  });
});

describe('pick', () => {
  describe('Basic functionality', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = pick(obj, ['a', 'c']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should handle single key', () => {
      const obj = { a: 1, b: 2 };
      const result = pick(obj, ['a']);
      expect(result).toEqual({ a: 1 });
    });

    it('should not mutate source object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const copy = { ...obj };
      pick(obj, ['a']);
      expect(obj).toEqual(copy);
    });
  });

  describe('Type safety', () => {
    it('should preserve types', () => {
      const obj = { a: 1, b: 'string', c: true };
      const result = pick(obj, ['a', 'c']);
      expect(result.a).toBe(1);
      expect(result.c).toBe(true);
    });

    it('should handle missing keys gracefully', () => {
      const obj = { a: 1 };
      const result = pick(obj, ['a', 'b' as never]);
      expect(result).toEqual({ a: 1 });
      expect(result).not.toHaveProperty('b');
    });
  });

  describe('Prototype pollution prevention', () => {
    it('should prevent __proto__ pollution', () => {
      expect(() => pick({}, ['__proto__' as never])).toThrow('prototype pollution');
    });

    it('should prevent constructor pollution', () => {
      expect(() => pick({}, ['constructor' as never])).toThrow('prototype pollution');
    });

    it('should prevent prototype pollution', () => {
      expect(() => pick({}, ['prototype' as never])).toThrow('prototype pollution');
    });
  });

  describe('Error handling', () => {
    it('should throw for non-object input', () => {
      expect(() => pick(null as never, ['a'])).toThrow(TypeError);
      expect(() => pick([] as never, ['a'])).toThrow(TypeError);
      expect(() => pick('string' as never, ['a'])).toThrow(TypeError);
    });

    it('should throw for non-array keys', () => {
      expect(() => pick({}, 'a' as never)).toThrow(TypeError);
      expect(() => pick({}, null as never)).toThrow(TypeError);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty object', () => {
      expect(pick({}, [])).toEqual({});
    });

    it('should handle empty keys array', () => {
      expect(pick({ a: 1, b: 2 }, [])).toEqual({});
    });

    it('should handle objects with many keys', () => {
      const obj = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, i]));
      const result = pick(obj, ['key0', 'key50', 'key99']);
      expect(result).toEqual({ key0: 0, key50: 50, key99: 99 });
    });

    it('should only pick own properties', () => {
      const proto = { inherited: 'value' };
      const obj = Object.create(proto);
      obj.own = 'own value';
      const result = pick(obj, ['own', 'inherited' as never]);
      expect(result).toEqual({ own: 'own value' });
      expect(result).not.toHaveProperty('inherited');
    });
  });
});

describe('omit', () => {
  describe('Basic functionality', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj, ['b']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should omit multiple keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = omit(obj, ['b', 'd']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should not mutate source object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const copy = { ...obj };
      omit(obj, ['b']);
      expect(obj).toEqual(copy);
    });
  });

  describe('Type safety', () => {
    it('should preserve types', () => {
      const obj = { a: 1, b: 'string', c: true };
      const result = omit(obj, ['b']);
      expect(result.a).toBe(1);
      expect(result.c).toBe(true);
    });

    it('should handle missing keys gracefully', () => {
      const obj = { a: 1 };
      const result = omit(obj, ['a', 'b' as never]);
      expect(result).toEqual({});
    });
  });

  describe('Prototype pollution prevention', () => {
    it('should prevent __proto__ pollution', () => {
      expect(() => omit({}, ['__proto__' as never])).toThrow('prototype pollution');
    });

    it('should prevent constructor pollution', () => {
      expect(() => omit({}, ['constructor' as never])).toThrow('prototype pollution');
    });

    it('should prevent prototype pollution', () => {
      expect(() => omit({}, ['prototype' as never])).toThrow('prototype pollution');
    });
  });

  describe('Error handling', () => {
    it('should throw for non-object input', () => {
      expect(() => omit(null as never, ['a'])).toThrow(TypeError);
      expect(() => omit([] as never, ['a'])).toThrow(TypeError);
      expect(() => omit('string' as never, ['a'])).toThrow(TypeError);
    });

    it('should throw for non-array keys', () => {
      expect(() => omit({}, 'a' as never)).toThrow(TypeError);
      expect(() => omit({}, null as never)).toThrow(TypeError);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty object', () => {
      expect(omit({}, [])).toEqual({});
    });

    it('should handle empty keys array', () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, [])).toEqual(obj);
    });

    it('should handle objects with many keys', () => {
      const obj = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, i]));
      const result = omit(obj, ['key50']);
      expect(result).toHaveProperty('key0', 0);
      expect(result).not.toHaveProperty('key50');
      expect(result).toHaveProperty('key99', 99);
      expect(Object.keys(result)).toHaveLength(99);
    });

    it('should only omit own properties', () => {
      const proto = { inherited: 'value' };
      const obj = Object.create(proto);
      obj.own = 'own value';
      obj.remove = 'remove me';
      const result = omit(obj, ['remove']);
      expect(result).toEqual({ own: 'own value' });
      expect(result).not.toHaveProperty('remove');
    });
  });
});
