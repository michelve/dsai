/**
 * @file Misc utilities test suite (placements, triggers, safe input props)
 */

import { getSafeInputProps, SAFE_INPUT_ATTRIBUTES } from '../misc/getSafeInputProps';
import { mapPlacement } from '../misc/mapPlacement';
import { normalizeTriggers } from '../misc/normalizeTriggers';

describe('Misc utilities', () => {
  describe('mapPlacement', () => {
    it('passes through known placements', () => {
      expect(mapPlacement('bottom-start')).toBe('bottom-start');
      expect(mapPlacement('top')).toBe('top');
      expect(mapPlacement('right-end')).toBe('right-end');
    });
  });

  describe('normalizeTriggers', () => {
    it('wraps single trigger into array', () => {
      expect(normalizeTriggers('hover')).toEqual(['hover']);
    });

    it('returns array unchanged', () => {
      const triggers: Array<'hover' | 'focus'> = ['hover', 'focus'];
      expect(normalizeTriggers(triggers)).toBe(triggers);
    });
  });

  describe('getSafeInputProps', () => {
    it('filters to safe attributes and drops events', () => {
      const props = {
        id: 'email',
        name: 'email',
        className: 'input',
        onClick: () => {},
        'aria-label': 'Email',
        custom: 'nope',
      };
      const safe = getSafeInputProps(props);
      expect(safe).toEqual({
        id: 'email',
        name: 'email',
        className: 'input',
        'aria-label': 'Email',
      });
    });

    it('includes all SAFE_INPUT_ATTRIBUTES when present', () => {
      const props: Record<string, unknown> = {};
      for (const key of Object.keys(SAFE_INPUT_ATTRIBUTES)) {
        props[key] = key;
      }
      const safe = getSafeInputProps(props);
      expect(Object.keys(safe)).toHaveLength(Object.keys(SAFE_INPUT_ATTRIBUTES).length);
    });
  });
});
