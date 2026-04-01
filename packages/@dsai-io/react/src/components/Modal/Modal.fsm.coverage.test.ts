/**
 * Modal FSM Coverage Tests
 *
 * Tests default/unknown event types and state branches not covered
 * by the main Modal.fsm.test.ts.
 */

import { createInitialModalFSMState, modalFSMReducer } from './Modal.fsm';

import type { ModalFSMEvent, ModalFSMState } from './Modal.fsm';

describe('Modal FSM - Coverage', () => {
  describe('Default branch handling (unknown event types)', () => {
    const states: Array<{ name: string; state: ModalFSMState }> = [
      { name: 'closed', state: createInitialModalFSMState(false) },
      {
        name: 'opening',
        state: modalFSMReducer(createInitialModalFSMState(false), { type: 'OPEN' }),
      },
      { name: 'open', state: createInitialModalFSMState(true) },
      {
        name: 'closing',
        state: modalFSMReducer(createInitialModalFSMState(true), { type: 'CLOSE' }),
      },
    ];

    it.each(states)(
      'returns same state for unknown event in $name state',
      ({ state }) => {
        const unknownEvent = { type: 'UNKNOWN_EVENT' } as unknown as ModalFSMEvent;
        const result = modalFSMReducer(state, unknownEvent);
        expect(result).toBe(state);
      }
    );
  });

  describe('Unknown visibility state', () => {
    it('returns same state for completely unknown visibility', () => {
      const unknownState: ModalFSMState = {
        visibility: 'unknown' as ModalFSMState['visibility'],
        shouldRender: false,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: false,
      };

      const result = modalFSMReducer(unknownState, { type: 'OPEN' });
      expect(result).toBe(unknownState);
    });
  });

  describe('Double idempotent transitions', () => {
    it('closed + CLOSE + ANIMATION_END stays closed', () => {
      const closed = createInitialModalFSMState(false);
      const s1 = modalFSMReducer(closed, { type: 'CLOSE' });
      const s2 = modalFSMReducer(s1, { type: 'ANIMATION_END' });
      expect(s1).toBe(closed);
      expect(s2).toBe(closed);
    });

    it('opening + OPEN stays opening (same reference)', () => {
      const opening = modalFSMReducer(createInitialModalFSMState(false), { type: 'OPEN' });
      const result = modalFSMReducer(opening, { type: 'OPEN' });
      expect(result).toBe(opening);
    });

    it('closing + CLOSE stays closing (same reference)', () => {
      const closing = modalFSMReducer(createInitialModalFSMState(true), { type: 'CLOSE' });
      const result = modalFSMReducer(closing, { type: 'CLOSE' });
      expect(result).toBe(closing);
    });
  });
});
