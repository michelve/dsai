import { getSafeInputProps, SAFE_INPUT_ATTRIBUTES } from '../misc/getSafeInputProps';
import { selectAllEvent } from '../misc/selectAllEvent';
import { toggleAllEvent } from '../misc/toggleAllEvent';
import { type IsSafeHrefOptions, isSafeHref } from '../validation/isSafeHref';
import { isValidHref } from '../validation/isValidHref';

describe('href validators', () => {
  const blocked = [
    'javascript:alert(1)',
    'data:text/html;base64,PGgxPkJhZDwvaDE+',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    'about:blank',
    'text/html',
  ];

  it('blocks unsafe protocols and encoded payloads', () => {
    blocked.forEach((href) => {
      expect(isSafeHref(href)).toBe(false);
      expect(isValidHref(href)).toBe(false);
    });
    expect(isSafeHref('javascript%3Aalert(1)')).toBe(false);
    expect(isValidHref('data%3Atext%2Fhtml%3Bbase64%2CBg%3D%3D')).toBe(false);
  });

  it('handles undefined according to options', () => {
    const unsafe: IsSafeHrefOptions = { undefinedBehavior: 'unsafe' };
    expect(isSafeHref(undefined)).toBe(true);
    expect(isSafeHref(undefined, unsafe)).toBe(false);
    expect(isValidHref(undefined)).toBe(true);
    expect(isValidHref(undefined, { undefinedBehavior: 'unsafe' })).toBe(false);
  });
});

describe('selection events', () => {
  it('selectAllEvent emits dual payloads', () => {
    const event = selectAllEvent([1, 'b'], 2);
    expect(event.type).toBe('SELECT_ALL');
    expect(event.totalEnabled).toBe(2);
    expect(event.enabledValues).toEqual(['1', 'b']);
    expect(event.enabledRowIds).toEqual([1, 'b']);
  });

  it('toggleAllEvent emits dual payloads', () => {
    const event = toggleAllEvent(['x'], 1);
    expect(event.type).toBe('TOGGLE_ALL');
    expect(event.totalEnabled).toBe(1);
    expect(event.enabledValues).toEqual(['x']);
    expect(event.enabledRowIds).toEqual(['x']);
  });
});

describe('getSafeInputProps', () => {
  it('filters out non-whitelisted props', () => {
    const props = {
      id: 'email',
      className: 'foo',
      onClick: () => {},
      'aria-label': 'Email',
      custom: 'nope',
    };
    const safe = getSafeInputProps(props);
    expect(safe).toHaveProperty('id', 'email');
    expect(safe).toHaveProperty('className', 'foo');
    expect(safe).toHaveProperty('aria-label', 'Email');
    expect((safe as Record<string, unknown>).onClick).toBeUndefined();
    expect((safe as Record<string, unknown>).custom).toBeUndefined();
  });

  it('contains a stable whitelist', () => {
    expect(Object.keys(SAFE_INPUT_ATTRIBUTES).length).toBeGreaterThan(0);
    expect(SAFE_INPUT_ATTRIBUTES).toHaveProperty('aria-label');
    expect(SAFE_INPUT_ATTRIBUTES).not.toHaveProperty('onClick');
  });
});
