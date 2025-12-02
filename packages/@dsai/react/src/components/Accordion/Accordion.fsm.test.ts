/**
 * Accordion FSM Tests
 *
 * Tests for the accordion state machine reducer and utility functions.
 * Covers state transitions for expand/collapse behavior in both
 * single and multiple selection modes.
 */

import {
  accordionFSMReducer,
  createInitialAccordionFSMState,
  getAccordionItemVisualState,
  getActiveKeysArray,
  isItemExpanded,
} from './Accordion.fsm';

import type { AccordionFSMEvent } from './Accordion.fsm';

// =============================================================================
// Initial State Tests
// =============================================================================

describe('createInitialAccordionFSMState', () => {
  it('creates state with empty activeKeys by default', () => {
    const state = createInitialAccordionFSMState();
    expect(getActiveKeysArray(state)).toEqual([]);
    expect(state.selectionMode).toBe('single');
  });

  it('creates state with provided activeKeys', () => {
    const state = createInitialAccordionFSMState(['1', '2'], 'multiple');
    expect(getActiveKeysArray(state).sort()).toEqual(['1', '2']);
  });

  it('creates state with single selection mode', () => {
    const state = createInitialAccordionFSMState([], 'single');
    expect(state.selectionMode).toBe('single');
  });

  it('creates state with multiple selection mode', () => {
    const state = createInitialAccordionFSMState([], 'multiple');
    expect(state.selectionMode).toBe('multiple');
  });

  it('in single mode, only keeps the first active key', () => {
    const state = createInitialAccordionFSMState(['1', '2', '3'], 'single');
    expect(getActiveKeysArray(state)).toEqual(['1']);
  });

  it('in multiple mode, keeps all active keys', () => {
    const state = createInitialAccordionFSMState(['1', '2', '3'], 'multiple');
    expect(getActiveKeysArray(state).sort()).toEqual(['1', '2', '3']);
  });

  it('handles empty array correctly', () => {
    const state = createInitialAccordionFSMState([]);
    expect(getActiveKeysArray(state)).toEqual([]);
  });
});

// =============================================================================
// Utility Functions Tests
// =============================================================================

describe('isItemExpanded', () => {
  it('returns true when item key is in activeKeys', () => {
    const state = createInitialAccordionFSMState(['1', '2'], 'multiple');
    expect(isItemExpanded(state, '1')).toBe(true);
    expect(isItemExpanded(state, '2')).toBe(true);
  });

  it('returns false when item key is not in activeKeys', () => {
    const state = createInitialAccordionFSMState(['1'], 'single');
    expect(isItemExpanded(state, '2')).toBe(false);
    expect(isItemExpanded(state, '3')).toBe(false);
  });

  it('returns false for empty activeKeys', () => {
    const state = createInitialAccordionFSMState();
    expect(isItemExpanded(state, '1')).toBe(false);
  });
});

describe('getActiveKeysArray', () => {
  it('converts Set to array', () => {
    const state = createInitialAccordionFSMState(['3', '1', '2'], 'multiple');
    const keys = getActiveKeysArray(state);
    expect(keys).toContain('1');
    expect(keys).toContain('2');
    expect(keys).toContain('3');
    expect(keys).toHaveLength(3);
  });

  it('returns empty array for empty state', () => {
    const state = createInitialAccordionFSMState();
    expect(getActiveKeysArray(state)).toEqual([]);
  });
});

describe('getAccordionItemVisualState', () => {
  it('returns "expanded" when item is expanded', () => {
    const state = createInitialAccordionFSMState(['1'], 'single');
    expect(getAccordionItemVisualState(state, '1')).toBe('expanded');
  });

  it('returns "collapsed" when item is not expanded', () => {
    const state = createInitialAccordionFSMState(['2'], 'single');
    expect(getAccordionItemVisualState(state, '1')).toBe('collapsed');
  });

  it('returns "collapsed" for empty activeKeys', () => {
    const state = createInitialAccordionFSMState();
    expect(getAccordionItemVisualState(state, '1')).toBe('collapsed');
  });
});

// =============================================================================
// TOGGLE Event Tests - Single Mode
// =============================================================================

describe('accordionFSMReducer - TOGGLE (single mode)', () => {
  it('expands a collapsed item', () => {
    const state = createInitialAccordionFSMState([], 'single');
    const event: AccordionFSMEvent = { type: 'TOGGLE', eventKey: '1' };
    const nextState = accordionFSMReducer(state, event);

    expect(isItemExpanded(nextState, '1')).toBe(true);
  });

  it('collapses an expanded item', () => {
    const state = createInitialAccordionFSMState(['1'], 'single');
    const event: AccordionFSMEvent = { type: 'TOGGLE', eventKey: '1' };
    const nextState = accordionFSMReducer(state, event);

    expect(isItemExpanded(nextState, '1')).toBe(false);
  });

  it('collapses other items when expanding a new one (single mode)', () => {
    const state = createInitialAccordionFSMState(['1'], 'single');
    const event: AccordionFSMEvent = { type: 'TOGGLE', eventKey: '2' };
    const nextState = accordionFSMReducer(state, event);

    expect(isItemExpanded(nextState, '1')).toBe(false);
    expect(isItemExpanded(nextState, '2')).toBe(true);
  });

  it('allows collapsing all items (none expanded)', () => {
    const state = createInitialAccordionFSMState(['1'], 'single');
    const event: AccordionFSMEvent = { type: 'TOGGLE', eventKey: '1' };
    const nextState = accordionFSMReducer(state, event);

    expect(getActiveKeysArray(nextState)).toEqual([]);
  });
});

// =============================================================================
// TOGGLE Event Tests - Multiple Mode
// =============================================================================

describe('accordionFSMReducer - TOGGLE (multiple mode)', () => {
  it('expands multiple items', () => {
    let state = createInitialAccordionFSMState([], 'multiple');

    state = accordionFSMReducer(state, { type: 'TOGGLE', eventKey: '1' });
    state = accordionFSMReducer(state, { type: 'TOGGLE', eventKey: '2' });

    expect(isItemExpanded(state, '1')).toBe(true);
    expect(isItemExpanded(state, '2')).toBe(true);
  });

  it('keeps other items expanded when toggling a new one', () => {
    const state = createInitialAccordionFSMState(['1'], 'multiple');
    const event: AccordionFSMEvent = { type: 'TOGGLE', eventKey: '2' };
    const nextState = accordionFSMReducer(state, event);

    expect(isItemExpanded(nextState, '1')).toBe(true);
    expect(isItemExpanded(nextState, '2')).toBe(true);
  });

  it('collapses individual items without affecting others', () => {
    const state = createInitialAccordionFSMState(['1', '2', '3'], 'multiple');
    const event: AccordionFSMEvent = { type: 'TOGGLE', eventKey: '2' };
    const nextState = accordionFSMReducer(state, event);

    expect(isItemExpanded(nextState, '1')).toBe(true);
    expect(isItemExpanded(nextState, '2')).toBe(false);
    expect(isItemExpanded(nextState, '3')).toBe(true);
  });

  it('allows expanding all items', () => {
    let state = createInitialAccordionFSMState([], 'multiple');

    state = accordionFSMReducer(state, { type: 'TOGGLE', eventKey: '1' });
    state = accordionFSMReducer(state, { type: 'TOGGLE', eventKey: '2' });
    state = accordionFSMReducer(state, { type: 'TOGGLE', eventKey: '3' });

    expect(getActiveKeysArray(state)).toHaveLength(3);
  });

  it('allows collapsing all items', () => {
    let state = createInitialAccordionFSMState(['1', '2'], 'multiple');

    state = accordionFSMReducer(state, { type: 'TOGGLE', eventKey: '1' });
    state = accordionFSMReducer(state, { type: 'TOGGLE', eventKey: '2' });

    expect(getActiveKeysArray(state)).toEqual([]);
  });
});

// =============================================================================
// EXPAND Event Tests
// =============================================================================

describe('accordionFSMReducer - EXPAND', () => {
  it('expands a collapsed item', () => {
    const state = createInitialAccordionFSMState([], 'single');
    const event: AccordionFSMEvent = { type: 'EXPAND', eventKey: '1' };
    const nextState = accordionFSMReducer(state, event);

    expect(isItemExpanded(nextState, '1')).toBe(true);
  });

  it('does not change state if already expanded', () => {
    const state = createInitialAccordionFSMState(['1'], 'single');
    const event: AccordionFSMEvent = { type: 'EXPAND', eventKey: '1' };
    const nextState = accordionFSMReducer(state, event);

    expect(nextState).toBe(state);
  });

  it('in single mode, collapses others when expanding', () => {
    const state = createInitialAccordionFSMState(['1'], 'single');
    const event: AccordionFSMEvent = { type: 'EXPAND', eventKey: '2' };
    const nextState = accordionFSMReducer(state, event);

    expect(isItemExpanded(nextState, '1')).toBe(false);
    expect(isItemExpanded(nextState, '2')).toBe(true);
  });

  it('in multiple mode, adds to existing expanded items', () => {
    const state = createInitialAccordionFSMState(['1'], 'multiple');
    const event: AccordionFSMEvent = { type: 'EXPAND', eventKey: '2' };
    const nextState = accordionFSMReducer(state, event);

    expect(isItemExpanded(nextState, '1')).toBe(true);
    expect(isItemExpanded(nextState, '2')).toBe(true);
  });
});

// =============================================================================
// COLLAPSE Event Tests
// =============================================================================

describe('accordionFSMReducer - COLLAPSE', () => {
  it('collapses an expanded item', () => {
    const state = createInitialAccordionFSMState(['1'], 'single');
    const event: AccordionFSMEvent = { type: 'COLLAPSE', eventKey: '1' };
    const nextState = accordionFSMReducer(state, event);

    expect(isItemExpanded(nextState, '1')).toBe(false);
  });

  it('does not change state if already collapsed', () => {
    const state = createInitialAccordionFSMState(['2'], 'single');
    const event: AccordionFSMEvent = { type: 'COLLAPSE', eventKey: '1' };
    const nextState = accordionFSMReducer(state, event);

    expect(nextState).toBe(state);
  });
});

// =============================================================================
// COLLAPSE_ALL Event Tests
// =============================================================================

describe('accordionFSMReducer - COLLAPSE_ALL', () => {
  it('collapses all expanded items', () => {
    const state = createInitialAccordionFSMState(['1', '2', '3'], 'multiple');
    const event: AccordionFSMEvent = { type: 'COLLAPSE_ALL' };
    const nextState = accordionFSMReducer(state, event);

    expect(getActiveKeysArray(nextState)).toEqual([]);
  });

  it('does not change state if already all collapsed', () => {
    const state = createInitialAccordionFSMState([], 'single');
    const event: AccordionFSMEvent = { type: 'COLLAPSE_ALL' };
    const nextState = accordionFSMReducer(state, event);

    expect(nextState).toBe(state);
  });
});

// =============================================================================
// RESET_FROM_PROPS Event Tests
// =============================================================================

describe('accordionFSMReducer - RESET_FROM_PROPS', () => {
  it('resets activeKeys from props', () => {
    const state = createInitialAccordionFSMState(['1'], 'multiple');
    const event: AccordionFSMEvent = {
      type: 'RESET_FROM_PROPS',
      activeKeys: ['2', '3'],
    };
    const nextState = accordionFSMReducer(state, event);

    expect(getActiveKeysArray(nextState).sort()).toEqual(['2', '3']);
  });

  it('clears activeKeys when empty array provided', () => {
    const state = createInitialAccordionFSMState(['1', '2'], 'multiple');
    const event: AccordionFSMEvent = {
      type: 'RESET_FROM_PROPS',
      activeKeys: [],
    };
    const nextState = accordionFSMReducer(state, event);

    expect(getActiveKeysArray(nextState)).toEqual([]);
  });

  it('preserves selection mode on reset', () => {
    const state = createInitialAccordionFSMState(['1'], 'multiple');
    const event: AccordionFSMEvent = {
      type: 'RESET_FROM_PROPS',
      activeKeys: ['2'],
    };
    const nextState = accordionFSMReducer(state, event);

    expect(nextState.selectionMode).toBe('multiple');
    expect(getActiveKeysArray(nextState)).toEqual(['2']);
  });

  it('respects single mode when resetting (keeps only first key)', () => {
    const state = createInitialAccordionFSMState(['1'], 'single');
    const event: AccordionFSMEvent = {
      type: 'RESET_FROM_PROPS',
      activeKeys: ['2', '3', '4'],
    };
    const nextState = accordionFSMReducer(state, event);

    expect(getActiveKeysArray(nextState)).toEqual(['2']);
  });

  it('returns same state if activeKeys are equivalent', () => {
    const state = createInitialAccordionFSMState(['1', '2'], 'multiple');
    const event: AccordionFSMEvent = {
      type: 'RESET_FROM_PROPS',
      activeKeys: ['1', '2'],
    };
    const nextState = accordionFSMReducer(state, event);

    // Should return same reference
    expect(nextState).toBe(state);
  });
});

// =============================================================================
// State Immutability Tests
// =============================================================================

describe('State Immutability', () => {
  it('does not mutate original state on TOGGLE', () => {
    const state = createInitialAccordionFSMState(['1'], 'single');
    const originalActiveKeys = new Set(state.activeKeys);

    accordionFSMReducer(state, { type: 'TOGGLE', eventKey: '2' });

    // Original state should be unchanged
    expect(state.activeKeys).toEqual(originalActiveKeys);
  });

  it('does not mutate original state on RESET_FROM_PROPS', () => {
    const state = createInitialAccordionFSMState(['1', '2'], 'multiple');
    const originalActiveKeys = new Set(state.activeKeys);

    accordionFSMReducer(state, {
      type: 'RESET_FROM_PROPS',
      activeKeys: ['3'],
    });

    // Original state should be unchanged
    expect(state.activeKeys).toEqual(originalActiveKeys);
  });

  it('returns new state object on every transition', () => {
    const state = createInitialAccordionFSMState(['1'], 'single');
    const nextState = accordionFSMReducer(state, { type: 'TOGGLE', eventKey: '2' });

    expect(nextState).not.toBe(state);
    expect(nextState.activeKeys).not.toBe(state.activeKeys);
  });
});

// =============================================================================
// Edge Cases
// =============================================================================

describe('Edge Cases', () => {
  it('handles toggling the same item multiple times', () => {
    let state = createInitialAccordionFSMState([], 'single');

    // Toggle on
    state = accordionFSMReducer(state, { type: 'TOGGLE', eventKey: '1' });
    expect(isItemExpanded(state, '1')).toBe(true);

    // Toggle off
    state = accordionFSMReducer(state, { type: 'TOGGLE', eventKey: '1' });
    expect(isItemExpanded(state, '1')).toBe(false);

    // Toggle on again
    state = accordionFSMReducer(state, { type: 'TOGGLE', eventKey: '1' });
    expect(isItemExpanded(state, '1')).toBe(true);
  });

  it('handles empty string as key', () => {
    const state = createInitialAccordionFSMState([], 'single');
    const nextState = accordionFSMReducer(state, { type: 'TOGGLE', eventKey: '' });

    expect(isItemExpanded(nextState, '')).toBe(true);
  });

  it('handles special characters in keys', () => {
    const state = createInitialAccordionFSMState([], 'single');
    const eventKey = 'item-with-special-chars_123!@#';
    const nextState = accordionFSMReducer(state, { type: 'TOGGLE', eventKey });

    expect(isItemExpanded(nextState, eventKey)).toBe(true);
  });

  it('handles very long keys', () => {
    const state = createInitialAccordionFSMState([], 'single');
    const eventKey = 'a'.repeat(1000);
    const nextState = accordionFSMReducer(state, { type: 'TOGGLE', eventKey });

    expect(isItemExpanded(nextState, eventKey)).toBe(true);
  });

  it('handles numeric string keys', () => {
    const state = createInitialAccordionFSMState(['123'], 'single');
    expect(isItemExpanded(state, '123')).toBe(true);
    expect(isItemExpanded(state, '124')).toBe(false);
  });

  it('handles rapid sequential toggles', () => {
    let state = createInitialAccordionFSMState([], 'multiple');

    // Rapid sequential toggles
    for (let i = 0; i < 100; i++) {
      state = accordionFSMReducer(state, { type: 'TOGGLE', eventKey: `item-${i}` });
    }

    expect(getActiveKeysArray(state)).toHaveLength(100);
  });
});

// =============================================================================
// Type Safety Tests
// =============================================================================

describe('Type Safety', () => {
  it('handles unknown event types gracefully', () => {
    const state = createInitialAccordionFSMState(['1'], 'single');
    const unknownEvent = { type: 'UNKNOWN_EVENT', eventKey: '2' } as unknown as AccordionFSMEvent;

    // Should not crash, returns current state
    const nextState = accordionFSMReducer(state, unknownEvent);
    expect(getActiveKeysArray(nextState)).toEqual(['1']);
  });
});
