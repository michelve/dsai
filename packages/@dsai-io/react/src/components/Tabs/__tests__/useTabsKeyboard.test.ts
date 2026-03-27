import { renderHook } from '@testing-library/react';

import { useTabsKeyboard } from '../useTabsKeyboard';

describe('useTabsKeyboard', () => {
  const defaultOptions = {
    tabs: ['tab1', 'tab2', 'tab3'],
    activeTab: 'tab1',
    orientation: 'horizontal' as const,
    activationMode: 'automatic' as const,
    setActiveTab: jest.fn(),
    setFocusedTab: jest.fn(),
    baseId: 'test',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a keydown handler function', () => {
    const { result } = renderHook(() => useTabsKeyboard(defaultOptions));
    expect(typeof result.current).toBe('function');
  });

  it('navigates to next tab on ArrowRight (horizontal)', () => {
    const { result } = renderHook(() => useTabsKeyboard(defaultOptions));
    const mockEvent = {
      key: 'ArrowRight',
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;

    result.current(mockEvent);
    expect(defaultOptions.setActiveTab).toHaveBeenCalledWith('tab2');
  });

  it('navigates to previous tab on ArrowLeft (horizontal)', () => {
    const options = { ...defaultOptions, activeTab: 'tab2' };
    const { result } = renderHook(() => useTabsKeyboard(options));
    const mockEvent = {
      key: 'ArrowLeft',
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;

    result.current(mockEvent);
    expect(options.setActiveTab).toHaveBeenCalledWith('tab1');
  });

  it('wraps from last to first on ArrowRight', () => {
    const options = { ...defaultOptions, activeTab: 'tab3' };
    const { result } = renderHook(() => useTabsKeyboard(options));
    const mockEvent = {
      key: 'ArrowRight',
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;

    result.current(mockEvent);
    expect(options.setActiveTab).toHaveBeenCalledWith('tab1');
  });

  it('wraps from first to last on ArrowLeft', () => {
    const { result } = renderHook(() => useTabsKeyboard(defaultOptions));
    const mockEvent = {
      key: 'ArrowLeft',
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;

    result.current(mockEvent);
    expect(defaultOptions.setActiveTab).toHaveBeenCalledWith('tab3');
  });

  it('uses ArrowDown/ArrowUp for vertical orientation', () => {
    const options = { ...defaultOptions, orientation: 'vertical' as const };
    const { result } = renderHook(() => useTabsKeyboard(options));
    const downEvent = {
      key: 'ArrowDown',
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;

    result.current(downEvent);
    expect(options.setActiveTab).toHaveBeenCalledWith('tab2');
  });

  it('navigates to first tab on Home', () => {
    const options = { ...defaultOptions, activeTab: 'tab3' };
    const { result } = renderHook(() => useTabsKeyboard(options));
    const mockEvent = {
      key: 'Home',
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;

    result.current(mockEvent);
    expect(options.setActiveTab).toHaveBeenCalledWith('tab1');
  });

  it('navigates to last tab on End', () => {
    const { result } = renderHook(() => useTabsKeyboard(defaultOptions));
    const mockEvent = {
      key: 'End',
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;

    result.current(mockEvent);
    expect(defaultOptions.setActiveTab).toHaveBeenCalledWith('tab3');
  });

  it('in manual mode, moves focus without activating', () => {
    const options = { ...defaultOptions, activationMode: 'manual' as const };
    const { result } = renderHook(() => useTabsKeyboard(options));
    const mockEvent = {
      key: 'ArrowRight',
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;

    result.current(mockEvent);
    expect(options.setFocusedTab).toHaveBeenCalledWith('tab2');
    expect(options.setActiveTab).not.toHaveBeenCalled();
  });

  it('in manual mode, activates focused tab on Enter', () => {
    const options = {
      ...defaultOptions,
      activationMode: 'manual' as const,
      focusedTab: 'tab2',
    };
    const { result } = renderHook(() => useTabsKeyboard(options));
    const mockEvent = {
      key: 'Enter',
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;

    result.current(mockEvent);
    expect(options.setActiveTab).toHaveBeenCalledWith('tab2');
  });

  it('in manual mode, activates focused tab on Space', () => {
    const options = {
      ...defaultOptions,
      activationMode: 'manual' as const,
      focusedTab: 'tab2',
    };
    const { result } = renderHook(() => useTabsKeyboard(options));
    const mockEvent = {
      key: ' ',
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;

    result.current(mockEvent);
    expect(options.setActiveTab).toHaveBeenCalledWith('tab2');
  });

  it('ignores unrelated keys', () => {
    const { result } = renderHook(() => useTabsKeyboard(defaultOptions));
    const mockEvent = {
      key: 'a',
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;

    result.current(mockEvent);
    expect(defaultOptions.setActiveTab).not.toHaveBeenCalled();
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('does nothing with empty tabs array', () => {
    const options = { ...defaultOptions, tabs: [] };
    const { result } = renderHook(() => useTabsKeyboard(options));
    const mockEvent = {
      key: 'ArrowRight',
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent;

    result.current(mockEvent);
    expect(options.setActiveTab).not.toHaveBeenCalled();
  });
});
