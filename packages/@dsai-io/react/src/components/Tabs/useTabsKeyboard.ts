import { type KeyboardEvent, useCallback } from 'react';

import type { TabsActivationMode, TabsOrientation } from './Tabs.types';

/** Safe array element access without triggering security/detect-object-injection */
function getTabAtIndex(list: readonly string[], index: number): string | undefined {
  if (index < 0 || index >= list.length) {
    return undefined;
  }
  let i = 0;
  for (const item of list) {
    if (i === index) {
      return item;
    }
    i += 1;
  }
  return undefined;
}

export interface UseTabsKeyboardOptions {
  tabs: string[];
  activeTab: string;
  orientation: TabsOrientation;
  activationMode: TabsActivationMode;
  setActiveTab: (id: string) => void;
  setFocusedTab: (id: string | null) => void;
  baseId: string;
  focusedTab?: string | null;
}

/**
 * Resolve the navigation direction keys based on orientation.
 */
function getDirectionKeys(orientation: TabsOrientation): { prevKey: string; nextKey: string } {
  const isHorizontal = orientation === 'horizontal';
  return {
    prevKey: isHorizontal ? 'ArrowLeft' : 'ArrowUp',
    nextKey: isHorizontal ? 'ArrowRight' : 'ArrowDown',
  };
}

/**
 * Map a key press to a new tab index, or return null if the key is not handled.
 */
function resolveNewIndex(
  key: string,
  prevKey: string,
  nextKey: string,
  currentIndex: number,
  tabsLength: number
): number | null {
  switch (key) {
    case prevKey:
      return currentIndex > 0 ? currentIndex - 1 : tabsLength - 1;
    case nextKey:
      return currentIndex < tabsLength - 1 ? currentIndex + 1 : 0;
    case 'Home':
      return 0;
    case 'End':
      return tabsLength - 1;
    default:
      return null;
  }
}

/**
 * Apply the tab change: activate or focus the new tab and move DOM focus.
 */
function applyTabNavigation(
  newTabId: string,
  activationMode: TabsActivationMode,
  setActiveTab: (id: string) => void,
  setFocusedTab: (id: string | null) => void,
  baseId: string
): void {
  if (activationMode === 'manual') {
    setFocusedTab(newTabId);
  } else {
    setActiveTab(newTabId);
  }

  const tabButton = document.getElementById(`${baseId}-tab-${newTabId}`);
  tabButton?.focus();
}

export function useTabsKeyboard({
  tabs,
  activeTab,
  orientation,
  activationMode,
  setActiveTab,
  setFocusedTab,
  baseId,
  focusedTab,
}: UseTabsKeyboardOptions): (e: KeyboardEvent) => void {
  return useCallback(
    (e: KeyboardEvent): void => {
      if (tabs.length === 0) {
        return;
      }

      const currentTab = focusedTab ?? activeTab;
      const currentIndex = tabs.indexOf(currentTab);
      if (currentIndex === -1) {
        return;
      }

      // Handle Enter/Space for manual activation
      if ((e.key === 'Enter' || e.key === ' ') && activationMode === 'manual' && focusedTab) {
        e.preventDefault();
        setActiveTab(focusedTab);
        return;
      }

      const { prevKey, nextKey } = getDirectionKeys(orientation);
      const newIndex = resolveNewIndex(e.key, prevKey, nextKey, currentIndex, tabs.length);

      if (newIndex === null) {
        return;
      }

      e.preventDefault();

      const newTabId = getTabAtIndex(tabs, newIndex);
      if (!newTabId) {
        return;
      }

      applyTabNavigation(newTabId, activationMode, setActiveTab, setFocusedTab, baseId);
    },
    [tabs, activeTab, orientation, activationMode, setActiveTab, setFocusedTab, baseId, focusedTab]
  );
}
