/**
 * Breakpoints Coverage Tests
 *
 * Tests breakpointUp, breakpointDown, breakpointBetween,
 * getBreakpointValue for all breakpoint keys.
 */

import {
  BREAKPOINTS,
  breakpointBetween,
  breakpointDown,
  breakpointUp,
  getBreakpointValue,
} from './breakpoints';

import type { Breakpoint } from './breakpoints';

describe('Breakpoints', () => {
  const allBreakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

  describe('BREAKPOINTS constant', () => {
    it('has correct pixel values', () => {
      expect(BREAKPOINTS.xs).toBe(0);
      expect(BREAKPOINTS.sm).toBe(576);
      expect(BREAKPOINTS.md).toBe(768);
      expect(BREAKPOINTS.lg).toBe(992);
      expect(BREAKPOINTS.xl).toBe(1200);
      expect(BREAKPOINTS.xxl).toBe(1400);
    });
  });

  describe('breakpointUp', () => {
    it.each(allBreakpoints)('generates min-width query for %s', (bp) => {
      const result = breakpointUp(bp);
      expect(result).toBe(`(min-width: ${BREAKPOINTS[bp]}px)`);
    });

    it('returns correct value for xs', () => {
      expect(breakpointUp('xs')).toBe('(min-width: 0px)');
    });

    it('returns correct value for md', () => {
      expect(breakpointUp('md')).toBe('(min-width: 768px)');
    });

    it('returns correct value for xxl', () => {
      expect(breakpointUp('xxl')).toBe('(min-width: 1400px)');
    });
  });

  describe('breakpointDown', () => {
    it.each(allBreakpoints)('generates max-width query for %s', (bp) => {
      const result = breakpointDown(bp);
      const expected = BREAKPOINTS[bp] - 0.02;
      expect(result).toBe(`(max-width: ${expected}px)`);
    });

    it('returns correct value for xs', () => {
      expect(breakpointDown('xs')).toBe('(max-width: -0.02px)');
    });

    it('returns correct value for sm', () => {
      expect(breakpointDown('sm')).toBe('(max-width: 575.98px)');
    });

    it('returns correct value for lg', () => {
      expect(breakpointDown('lg')).toBe('(max-width: 991.98px)');
    });
  });

  describe('breakpointBetween', () => {
    it('generates range query for sm to lg', () => {
      expect(breakpointBetween('sm', 'lg')).toBe(
        '(min-width: 576px) and (max-width: 991.98px)'
      );
    });

    it('generates range query for md to xl', () => {
      expect(breakpointBetween('md', 'xl')).toBe(
        '(min-width: 768px) and (max-width: 1199.98px)'
      );
    });

    it('generates range query for xs to xxl', () => {
      expect(breakpointBetween('xs', 'xxl')).toBe(
        '(min-width: 0px) and (max-width: 1399.98px)'
      );
    });
  });

  describe('getBreakpointValue', () => {
    it.each(allBreakpoints)('returns correct pixel value for %s', (bp) => {
      expect(getBreakpointValue(bp)).toBe(BREAKPOINTS[bp]);
    });

    it('returns 0 for xs', () => {
      expect(getBreakpointValue('xs')).toBe(0);
    });

    it('returns 1400 for xxl', () => {
      expect(getBreakpointValue('xxl')).toBe(1400);
    });
  });
});
