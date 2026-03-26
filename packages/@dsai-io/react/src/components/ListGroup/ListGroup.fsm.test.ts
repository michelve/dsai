import {
  createInitialListGroupFSMState,
  listGroupFSMReducer,
  getActiveKeysArray,
  isItemActive,
} from './ListGroup.fsm';

describe('ListGroup FSM', () => {
  describe('createInitialListGroupFSMState', () => {
    it('creates empty state by default', () => {
      const state = createInitialListGroupFSMState();
      expect(state.activeKeys.size).toBe(0);
      expect(state.selectionMode).toBe('single');
    });

    it('creates state with initial active keys', () => {
      const state = createInitialListGroupFSMState(['a', 'b'], 'multiple');
      expect(state.activeKeys.has('a')).toBe(true);
      expect(state.activeKeys.has('b')).toBe(true);
    });

    it('keeps only first key in single mode', () => {
      const state = createInitialListGroupFSMState(['a', 'b'], 'single');
      expect(state.activeKeys.size).toBe(1);
      expect(state.activeKeys.has('a')).toBe(true);
    });
  });

  describe('TOGGLE - single mode', () => {
    it('selects an item', () => {
      const state = createInitialListGroupFSMState([], 'single');
      const next = listGroupFSMReducer(state, { type: 'TOGGLE', eventKey: 'a' });
      expect(next.activeKeys.has('a')).toBe(true);
    });

    it('switches selection to new item', () => {
      const state = createInitialListGroupFSMState(['a'], 'single');
      const next = listGroupFSMReducer(state, { type: 'TOGGLE', eventKey: 'b' });
      expect(next.activeKeys.has('b')).toBe(true);
      expect(next.activeKeys.has('a')).toBe(false);
    });

    it('is a no-op when toggling already-active item', () => {
      const state = createInitialListGroupFSMState(['a'], 'single');
      const next = listGroupFSMReducer(state, { type: 'TOGGLE', eventKey: 'a' });
      expect(next).toBe(state);
    });
  });

  describe('TOGGLE - multiple mode', () => {
    it('adds item to selection', () => {
      const state = createInitialListGroupFSMState(['a'], 'multiple');
      const next = listGroupFSMReducer(state, { type: 'TOGGLE', eventKey: 'b' });
      expect(next.activeKeys.has('a')).toBe(true);
      expect(next.activeKeys.has('b')).toBe(true);
    });

    it('removes item from selection', () => {
      const state = createInitialListGroupFSMState(['a', 'b'], 'multiple');
      const next = listGroupFSMReducer(state, { type: 'TOGGLE', eventKey: 'a' });
      expect(next.activeKeys.has('a')).toBe(false);
      expect(next.activeKeys.has('b')).toBe(true);
    });
  });

  describe('SELECT', () => {
    it('activates an item', () => {
      const state = createInitialListGroupFSMState([], 'single');
      const next = listGroupFSMReducer(state, { type: 'SELECT', eventKey: 'a' });
      expect(next.activeKeys.has('a')).toBe(true);
    });
  });

  describe('DESELECT', () => {
    it('deactivates an item', () => {
      const state = createInitialListGroupFSMState(['a'], 'multiple');
      const next = listGroupFSMReducer(state, { type: 'DESELECT', eventKey: 'a' });
      expect(next.activeKeys.has('a')).toBe(false);
    });

    it('is a no-op for inactive item', () => {
      const state = createInitialListGroupFSMState([], 'multiple');
      const next = listGroupFSMReducer(state, { type: 'DESELECT', eventKey: 'a' });
      expect(next).toBe(state);
    });
  });

  describe('RESET_FROM_PROPS', () => {
    it('replaces active keys', () => {
      const state = createInitialListGroupFSMState(['a'], 'single');
      const next = listGroupFSMReducer(state, { type: 'RESET_FROM_PROPS', activeKeys: ['b'] });
      expect(next.activeKeys.has('b')).toBe(true);
      expect(next.activeKeys.has('a')).toBe(false);
    });

    it('returns same state if keys are equal', () => {
      const state = createInitialListGroupFSMState(['a'], 'single');
      const next = listGroupFSMReducer(state, { type: 'RESET_FROM_PROPS', activeKeys: ['a'] });
      expect(next).toBe(state);
    });
  });

  describe('helpers', () => {
    it('getActiveKeysArray returns array', () => {
      const state = createInitialListGroupFSMState(['a', 'b'], 'multiple');
      expect(getActiveKeysArray(state)).toEqual(expect.arrayContaining(['a', 'b']));
    });

    it('isItemActive checks membership', () => {
      const state = createInitialListGroupFSMState(['a'], 'single');
      expect(isItemActive(state, 'a')).toBe(true);
      expect(isItemActive(state, 'b')).toBe(false);
    });
  });
});
