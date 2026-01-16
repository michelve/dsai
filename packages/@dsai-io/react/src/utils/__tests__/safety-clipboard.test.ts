/**
 * @file Clipboard utilities test suite
 */

import { copyToClipboard } from '../safety/copyToClipboard';
import { readFromClipboard } from '../safety/readFromClipboard';

describe('Clipboard utilities', () => {
  const originalClipboard = navigator.clipboard;
  const originalWarn = console.warn;

  afterEach(() => {
    (navigator as any).clipboard = originalClipboard;
    console.warn = originalWarn;
  });

  it('returns failure object when clipboard API is unavailable', async () => {
    // @ts-expect-error - delete for test
    delete (navigator as any).clipboard;
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await copyToClipboard('test');
    expect(result.success).toBe(false);
    expect(result.method === 'none' || result.method === 'exec-command').toBe(true);
    warnSpy.mockRestore();
  });

  it('handles clipboard write failure gracefully', async () => {
    (navigator as any).clipboard = {
      writeText: jest.fn().mockRejectedValue(new Error('denied')),
    };
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await copyToClipboard('test');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    warnSpy.mockRestore();
  });

  it('handles clipboard read failure gracefully', async () => {
    (navigator as any).clipboard = {
      readText: jest.fn().mockRejectedValue(new Error('denied')),
    };
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await readFromClipboard();
    expect(result.success).toBe(false);
    expect(result.text).toBeUndefined();
    warnSpy.mockRestore();
  });
});
