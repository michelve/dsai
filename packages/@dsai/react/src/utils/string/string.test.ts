/**
 * @file String utility tests
 * @module @dsai/react/utils/string
 */

import { capitalize } from './capitalize';
import { slugify } from './slugify';
import { truncate } from './truncate';

describe('truncate', () => {
  describe('Basic functionality', () => {
    it('should truncate text longer than maxLength', () => {
      const result = truncate('Hello, World!', { maxLength: 8 });
      expect(result).toBe('Hello...');
    });

    it('should not truncate text shorter than maxLength', () => {
      const result = truncate('Hello', { maxLength: 10 });
      expect(result).toBe('Hello');
    });

    it('should handle exact maxLength', () => {
      const result = truncate('Hello', { maxLength: 5 });
      expect(result).toBe('Hello');
    });

    it('should use default maxLength of 80', () => {
      const longText = 'a'.repeat(100);
      const result = truncate(longText);
      expect(result.length).toBe(80);
      expect(result.endsWith('...')).toBe(true);
    });
  });

  describe('Custom ellipsis', () => {
    it('should use custom ellipsis', () => {
      const result = truncate('Hello, World!', {
        maxLength: 8,
        ellipsis: '…',
      });
      expect(result).toBe('Hello, …');
    });

    it('should handle empty ellipsis', () => {
      const result = truncate('Hello, World!', {
        maxLength: 5,
        ellipsis: '',
      });
      expect(result).toBe('Hello');
    });

    it('should handle long ellipsis', () => {
      const result = truncate('Hello, World!', {
        maxLength: 8,
        ellipsis: '[...]',
      });
      expect(result).toBe('Hel[...]');
    });
  });

  describe('Word boundary', () => {
    it('should respect word boundaries', () => {
      const result = truncate('Hello, World!', {
        maxLength: 10,
        wordBoundary: true,
      });
      expect(result).toBe('Hello,...');
    });

    it('should fall back to character truncation if no word boundary found', () => {
      const result = truncate('Supercalifragilisticexpialidocious', {
        maxLength: 10,
        wordBoundary: true,
      });
      expect(result.length).toBe(10);
      expect(result.endsWith('...')).toBe(true);
    });

    it('should trim trailing whitespace before ellipsis', () => {
      const result = truncate('Hello World Test', {
        maxLength: 12,
        wordBoundary: true,
      });
      expect(result).not.toMatch(/\s\.\.\./);
    });
  });

  describe('Error handling', () => {
    it('should throw TypeError for non-string input', () => {
      expect(() => truncate(123 as unknown as string)).toThrow(TypeError);
      expect(() => truncate(null as unknown as string)).toThrow(TypeError);
    });

    it('should throw RangeError for maxLength < 1', () => {
      expect(() => truncate('Hello', { maxLength: 0 })).toThrow(RangeError);
      expect(() => truncate('Hello', { maxLength: -1 })).toThrow(RangeError);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      const result = truncate('', { maxLength: 10 });
      expect(result).toBe('');
    });

    it('should handle maxLength smaller than ellipsis', () => {
      const result = truncate('Hello, World!', {
        maxLength: 2,
        ellipsis: '...',
      });
      expect(result).toBe('..');
    });

    it('should handle emoji', () => {
      const result = truncate('Hello 👋 World 🌍', {
        maxLength: 10,
      });
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it('should handle CJK characters', () => {
      const result = truncate('你好世界', { maxLength: 3 });
      expect(result).toBe('你好世界');
    });

    it('should handle very long text', () => {
      const longText = 'a'.repeat(10000);
      const result = truncate(longText, { maxLength: 50 });
      expect(result.length).toBe(50);
    });
  });
});

describe('capitalize', () => {
  describe('First character mode (default)', () => {
    it('should capitalize first character', () => {
      expect(capitalize('hello world')).toBe('Hello world');
    });

    it('should handle already capitalized', () => {
      expect(capitalize('Hello world')).toBe('Hello world');
    });

    it('should preserve rest of string', () => {
      expect(capitalize('hELLO WORLD')).toBe('HELLO WORLD');
    });
  });

  describe('Words mode (title case)', () => {
    it('should capitalize all words', () => {
      expect(capitalize('hello world', { mode: 'words' })).toBe('Hello World');
    });

    it('should handle multiple spaces', () => {
      expect(capitalize('hello  world', { mode: 'words' })).toBe('Hello  World');
    });

    it('should handle tabs', () => {
      expect(capitalize('hello\tworld', { mode: 'words' })).toBe('Hello\tWorld');
    });

    it('should handle single word', () => {
      expect(capitalize('hello', { mode: 'words' })).toBe('Hello');
    });
  });

  describe('Sentences mode', () => {
    it('should capitalize first character of each sentence', () => {
      const result = capitalize('hello. world. foo.', { mode: 'sentences' });
      expect(result).toBe('Hello. World. Foo.');
    });

    it('should handle exclamation marks', () => {
      const result = capitalize('hello! world! foo!', { mode: 'sentences' });
      expect(result).toBe('Hello! World! Foo!');
    });

    it('should handle question marks', () => {
      const result = capitalize('hello? world? foo?', { mode: 'sentences' });
      expect(result).toBe('Hello? World? Foo?');
    });

    it('should handle multiple punctuation', () => {
      const result = capitalize('hello... world!!! foo???', { mode: 'sentences' });
      expect(result).toMatch(/^[A-Z]/);
    });
  });

  describe('Locale support', () => {
    it('should handle Turkish i with locale', () => {
      const result = capitalize('istanbul', { locale: 'tr' });
      // Turkish capital I has a dot: İ
      expect(result).toMatch(/^[İI]/);
    });

    it('should handle default locale', () => {
      const result = capitalize('istanbul');
      expect(result).toBe('Istanbul');
    });
  });

  describe('Error handling', () => {
    it('should throw TypeError for non-string input', () => {
      expect(() => capitalize(123 as unknown as string)).toThrow(TypeError);
      expect(() => capitalize(null as unknown as string)).toThrow(TypeError);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should handle numbers', () => {
      expect(capitalize('123 hello')).toBe('123 hello');
    });

    it('should handle special characters', () => {
      expect(capitalize('!hello')).toBe('!hello');
    });

    it('should handle emoji', () => {
      expect(capitalize('👋 hello')).toBe('👋 hello');
    });
  });
});

describe('slugify', () => {
  describe('Basic functionality', () => {
    it('should convert to lowercase and replace spaces', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Hello    World')).toBe('hello-world');
    });

    it('should remove leading/trailing spaces', () => {
      expect(slugify('  Hello World  ')).toBe('hello-world');
    });

    it('should preserve numbers', () => {
      expect(slugify('ECMAScript 2024')).toBe('ecmascript-2024');
    });
  });

  describe('Custom separator', () => {
    it('should use custom separator', () => {
      expect(slugify('Hello World', { separator: '_' })).toBe('hello_world');
    });

    it('should use dot separator', () => {
      expect(slugify('Hello World', { separator: '.' })).toBe('hello.world');
    });

    it('should handle empty separator', () => {
      expect(slugify('Hello World', { separator: '' })).toBe('helloworld');
    });
  });

  describe('Diacritic removal', () => {
    it('should remove accents from Latin characters', () => {
      expect(slugify('Café')).toBe('cafe');
    });

    it('should handle multiple diacritics', () => {
      expect(slugify('Münchën')).toBe('munchen');
    });

    it('should handle French accents', () => {
      expect(slugify('Crème brûlée')).toBe('creme-brulee');
    });

    it('should handle Spanish', () => {
      expect(slugify('Año Niño')).toBe('ano-nino');
    });
  });

  describe('Special character handling', () => {
    it('should convert & to and', () => {
      expect(slugify('Hello & World')).toBe('hello-and-world');
    });

    it('should convert @ to at', () => {
      expect(slugify('user@example')).toBe('user-at-example');
    });

    it('should handle æ ligature', () => {
      expect(slugify('Encyclopædia')).toBe('encyclopaedia');
    });

    it('should handle œ ligature', () => {
      expect(slugify('Cœur')).toBe('coeur');
    });

    it('should handle ß', () => {
      expect(slugify('Straße')).toBe('strasse');
    });

    it('should handle ø', () => {
      expect(slugify('København')).toBe('kobenhavn');
    });
  });

  describe('Strict mode', () => {
    it('should remove non-alphanumeric in strict mode', () => {
      expect(slugify('Hello (World) [2024]', { strict: true })).toBe('hello-world-2024');
    });

    it('should keep numbers in strict mode', () => {
      expect(slugify('Test 123', { strict: true })).toBe('test-123');
    });
  });

  describe('Case handling', () => {
    it('should lowercase by default', () => {
      expect(slugify('HELLO WORLD')).toBe('hello-world');
    });

    it('should preserve case when lowercase is false', () => {
      expect(slugify('Hello World', { lowercase: false })).toBe('Hello-World');
    });
  });

  describe('Error handling', () => {
    it('should throw TypeError for non-string input', () => {
      expect(() => slugify(123 as unknown as string)).toThrow(TypeError);
      expect(() => slugify(null as unknown as string)).toThrow(TypeError);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      expect(slugify('')).toBe('');
    });

    it('should handle only special characters', () => {
      expect(slugify('!!!')).toBe('');
    });

    it('should handle consecutive separators', () => {
      expect(slugify('Hello---World')).toBe('hello-world');
    });

    it('should handle mixed punctuation', () => {
      expect(slugify('Hello, World! How are you?')).toBe('hello-world-how-are-you');
    });

    it('should handle very long strings', () => {
      const longText = 'Hello World '.repeat(100);
      const result = slugify(longText);
      expect(result).not.toContain('  ');
      expect(result).not.toMatch(/--/);
    });
  });
});
