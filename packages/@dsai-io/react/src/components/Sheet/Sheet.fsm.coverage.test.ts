/**
 * Sheet FSM Coverage Tests
 *
 * Tests default/unknown event types and state branches not covered
 * by the main Sheet.fsm.test.ts.
 */

import { createInitialSheetFSMState, sheetFSMReducer } from './Sheet.fsm';

import type { SheetFSMEvent, SheetFSMState } from './Sheet.fsm';

describe('Sheet FSM - Coverage', () => {
  describe('Default branch handling (unknown event types)', () => {
    const states: Array<{ name: string; state: SheetFSMState }> = [
      { name: 'closed', state: createInitialSheetFSMState(false) },
      {
        name: 'opening',
        state: sheetFSMReducer(createInitialSheetFSMState(false), { type: 'OPEN' }),
      },
      { name: 'open', state: createInitialSheetFSMState(true) },
      {
        name: 'closing',
        state: sheetFSMReducer(createInitialSheetFSMState(true), { type: 'CLOSE' }),
      },
    ];

    it.each(states)(
      'returns same state for unknown event in $name state',
      ({ state }) => {
        const unknownEvent = { type: 'UNKNOWN_EVENT' } as unknown as SheetFSMEvent;
        const result = sheetFSMReducer(state, unknownEvent);
        expect(result).toBe(state);
      }
    );
  });

  describe('Unknown visibility state', () => {
    it('returns same state for completely unknown visibility', () => {
      const unknownState: SheetFSMState = {
        visibility: 'unknown' as SheetFSMState['visibility'],
        shouldRender: false,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: false,
      };

      const result = sheetFSMReducer(unknownState, { type: 'OPEN' });
      expect(result).toBe(unknownState);
    });
  });

  describe('Double idempotent transitions', () => {
    it('closed + CLOSE + ANIMATION_END stays closed', () => {
      const closed = createInitialSheetFSMState(false);
      const s1 = sheetFSMReducer(closed, { type: 'CLOSE' });
      const s2 = sheetFSMReducer(s1, { type: 'ANIMATION_END' });
      expect(s1).toBe(closed);
      expect(s2).toBe(closed);
    });

    it('opening + OPEN stays opening (same reference)', () => {
      const opening = sheetFSMReducer(createInitialSheetFSMState(false), { type: 'OPEN' });
      const result = sheetFSMReducer(opening, { type: 'OPEN' });
      expect(result).toBe(opening);
    });

    it('closing + CLOSE stays closing (same reference)', () => {
      const closing = sheetFSMReducer(createInitialSheetFSMState(true), { type: 'CLOSE' });
      const result = sheetFSMReducer(closing, { type: 'CLOSE' });
      expect(result).toBe(closing);
    });
  });
});
