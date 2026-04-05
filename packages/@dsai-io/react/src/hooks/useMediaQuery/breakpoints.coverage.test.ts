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

// -- Named constants for magic numbers (SonarQube S109) --
const BREAKPOINT_SM = 576;
const BREAKPOINT_MD = 768;
const BREAKPOINT_LG = 992;
const BREAKPOINT_XL = 1200;
const BREAKPOINT_XXL = 1400;
const BREAKPOINT_OFFSET = 0.02;

describe('Breakpoints', () => {
  const allBreakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

  describe('BREAKPOINTS constant', () => {
    it('has correct pixel values', () => {
      expect(BREAKPOINTS.xs).toBe(0);
      expect(BREAKPOINTS.sm).toBe(BREAKPOINT_SM);
      expect(BREAKPOINTS.md).toBe(BREAKPOINT_MD);
      expect(BREAKPOINTS.lg).toBe(BREAKPOINT_LG);
      expect(BREAKPOINTS.xl).toBe(BREAKPOINT_XL);
      expect(BREAKPOINTS.xxl).toBe(BREAKPOINT_XXL);
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
      expect(breakpointUp('md')).toBe(`(min-width: ${BREAKPOINT_MD}px)`);
    });

    it('returns correct value for xxl', () => {
      expect(breakpointUp('xxl')).toBe(`(min-width: ${BREAKPOINT_XXL}px)`);
    });
  });

  describe('breakpointDown', () => {
    it.each(allBreakpoints)('generates max-width query for %s', (bp) => {
      const result = breakpointDown(bp);
      const expected = BREAKPOINTS[bp] - BREAKPOINT_OFFSET;
      expect(result).toBe(`(max-width: ${expected}px)`);
    });

    it('returns correct value for xs', () => {
      expect(breakpointDown('xs')).toBe('(max-width: -0.02px)');
    });

    it('returns correct value for sm', () => {
      expect(breakpointDown('sm')).toBe(`(max-width: ${BREAKPOINT_SM - BREAKPOINT_OFFSET}px)`);
    });

    it('returns correct value for lg', () => {
      expect(breakpointDown('lg')).toBe(`(max-width: ${BREAKPOINT_LG - BREAKPOINT_OFFSET}px)`);
    });
  });

  describe('breakpointBetween', () => {
    it('generates range query for sm to lg', () => {
      expect(breakpointBetween('sm', 'lg')).toBe(
        `(min-width: ${BREAKPOINT_SM}px) and (max-width: ${BREAKPOINT_LG - BREAKPOINT_OFFSET}px)`
      );
    });

    it('generates range query for md to xl', () => {
      expect(breakpointBetween('md', 'xl')).toBe(
        `(min-width: ${BREAKPOINT_MD}px) and (max-width: ${BREAKPOINT_XL - BREAKPOINT_OFFSET}px)`
      );
    });

    it('generates range query for xs to xxl', () => {
      expect(breakpointBetween('xs', 'xxl')).toBe(
        `(min-width: 0px) and (max-width: ${BREAKPOINT_XXL - BREAKPOINT_OFFSET}px)`
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
      expect(getBreakpointValue('xxl')).toBe(BREAKPOINT_XXL);
    });
  });
});
