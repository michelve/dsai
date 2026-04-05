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

      const isHorizontal = orientation === 'horizontal';
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

      let newIndex: number;
      let handled = false;

      switch (e.key) {
        case prevKey:
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          handled = true;
          break;
        case nextKey:
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          handled = true;
          break;
        case 'Home':
          newIndex = 0;
          handled = true;
          break;
        case 'End':
          newIndex = tabs.length - 1;
          handled = true;
          break;
        case 'Enter':
        case ' ':
          if (activationMode === 'manual' && focusedTab) {
            e.preventDefault();
            setActiveTab(focusedTab);
          }
          return;
        default:
          return;
      }

      if (!handled) {
        return;
      }

      e.preventDefault();

      const newTabId = getTabAtIndex(tabs, newIndex);
      if (!newTabId) {
        return;
      }

      if (activationMode === 'manual') {
        setFocusedTab(newTabId);
      } else {
        setActiveTab(newTabId);
      }

      // Focus the target tab button
      const tabButton = document.getElementById(`${baseId}-tab-${newTabId}`);
      tabButton?.focus();
    },
    [tabs, activeTab, orientation, activationMode, setActiveTab, setFocusedTab, baseId, focusedTab]
  );
}
