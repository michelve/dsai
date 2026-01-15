/**
 * TabsPro Component
 *
 * Advanced tab system with FSM-based state management supporting:
 * - Async lazy loading with loading states
 * - Permission/guard gating with blocked states
 * - Error states with retry functionality
 * - Analytics hooks for tracking
 * - Dirty/unsaved changes confirmation
 *
 * Wraps the existing Tabs component - does not modify it.
 *
 * @see https://getbootstrap.com/docs/5.3/components/navs-tabs/
 * @packageDocumentation
 */

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { Tabs } from '../Tabs/Tabs';

import {
  activateTabEvent,
  createInitialTabsProFSMState,
  guardFailEvent,
  guardOkEvent,
  initializeTabsEvent,
  leaveCancelledEvent,
  leaveConfirmedEvent,
  leaveRequestEvent,
  loadErrorEvent,
  loadSuccessEvent,
  retryEvent,
  tabsProFSMReducer,
} from './TabsPro.fsm';

import type { GuardResult } from './TabsPro.fsm';
import type {
  DefaultBlockedProps,
  DefaultErrorProps,
  DefaultLoadingProps,
  ResolvedTabItem,
  TabsProItem,
  TabsProProps,
} from './TabsPro.types';
import type { TabItem } from '../Tabs/Tabs.types';

// =============================================================================
// Default Fallback Components
// =============================================================================

/**
 * Default loading spinner component
 */
const DefaultLoading = memo(function DefaultLoading({
  message = 'Loading...',
}: DefaultLoadingProps) {
  return (
    <output
      className="d-flex flex-column align-items-center justify-content-center p-4"
      aria-live="polite"
    >
      <div className="spinner-border text-primary mb-2" aria-hidden="true">
        <span className="visually-hidden">Loading</span>
      </div>
      <span className="text-muted">{message}</span>
    </output>
  );
});

DefaultLoading.displayName = 'DefaultLoading';

/**
 * Default blocked/access denied component
 */
const DefaultBlocked = memo(function DefaultBlocked({
  title = 'Access Restricted',
  description = 'You do not have permission to view this content.',
  actionLabel,
  onAction,
}: DefaultBlockedProps) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4 text-center">
      <div className="mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          fill="currentColor"
          className="text-warning"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
        </svg>
      </div>
      <h5 className="mb-2">{title}</h5>
      <p className="text-muted mb-3">{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn-outline-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
});

DefaultBlocked.displayName = 'DefaultBlocked';

/**
 * Default error component with retry button
 */
const DefaultError = memo(function DefaultError({
  message = 'Failed to load content.',
  onRetry,
}: DefaultErrorProps) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center p-4 text-center"
      role="alert"
    >
      <div className="mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          fill="currentColor"
          className="text-danger"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
        </svg>
      </div>
      <h5 className="mb-2">Something went wrong</h5>
      <p className="text-muted mb-3">{message}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
});

DefaultError.displayName = 'DefaultError';

/**
 * Leave confirmation modal component
 */
interface LeaveConfirmModalProps {
  show: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const LeaveConfirmModal = memo(function LeaveConfirmModal({
  show,
  message,
  onConfirm,
  onCancel,
  titleId,
}: LeaveConfirmModalProps & { titleId: string }) {
  if (!show) {
    return null;
  }

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={titleId}>
              Unsaved Changes
            </h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onCancel} />
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Stay
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

LeaveConfirmModal.displayName = 'LeaveConfirmModal';

// =============================================================================
// TabsPro Component
// =============================================================================

/**
 * TabsPro - Advanced tabs with async loading, permission gating, and analytics
 *
 * @example Basic async loading
 * ```tsx
 * <TabsPro
 *   items={[
 *     {
 *       id: 'reports',
 *       label: 'Reports',
 *       loadContent: async () => <ReportsPanel />,
 *     },
 *     {
 *       id: 'settings',
 *       label: 'Settings',
 *       content: <SettingsPanel />,
 *     },
 *   ]}
 * />
 * ```
 *
 * @example Permission-gated tab
 * ```tsx
 * <TabsPro
 *   items={[
 *     {
 *       id: 'admin',
 *       label: 'Admin',
 *       guard: async () => ({
 *         allowed: user.isAdmin,
 *         reason: 'not-admin',
 *       }),
 *       blockedFallback: <AdminBlockedMessage />,
 *       loadContent: async () => <AdminPanel />,
 *     },
 *   ]}
 * />
 * ```
 */
export const TabsPro = memo(
  forwardRef<HTMLDivElement, TabsProProps>(function TabsPro(
    {
      items,
      activeId: controlledActiveId,
      defaultActiveId,
      onActiveChange,
      keepMounted: _keepMounted = false,
      variant = 'tabs',
      orientation = 'horizontal',
      fill = false,
      justified = false,
      isDirty,
      dirtyConfirmMessage = 'You have unsaved changes. Leave without saving?',
      onDirtyLeave,
      onDirtyStay,
      className,
      style,
      id,
      defaultLoadingFallback,
      defaultBlockedFallback,
      defaultErrorFallback,
    },
    ref
  ) {
    // =========================================================================
    // FSM State
    // =========================================================================

    const tabIds = useMemo(() => items.map((item) => item.id), [items]);
    const initialActiveId = controlledActiveId ?? defaultActiveId ?? tabIds[0];

    const [fsmState, dispatch] = useReducer(
      tabsProFSMReducer,
      { tabIds, defaultActiveId: initialActiveId },
      (init) => createInitialTabsProFSMState(init.tabIds, init.defaultActiveId)
    );

    // Track items by ID for quick lookup
    const itemsMap = useMemo(() => {
      const map = new Map<string, TabsProItem>();
      for (const item of items) {
        map.set(item.id, item);
      }
      return map;
    }, [items]);

    // Track controlled mode
    const isControlled = controlledActiveId !== undefined;
    const [internalActiveId, setInternalActiveId] = useState(initialActiveId);
    const activeId = isControlled ? controlledActiveId : internalActiveId;

    // Ref to track loading promises to avoid race conditions
    const loadingPromises = useRef<Map<string, Promise<void>>>(new Map());

    // Generate unique ID for modal title
    const leaveConfirmTitleId = useId();

    // =========================================================================
    // Sync FSM with tab changes
    // =========================================================================

    useEffect(() => {
      dispatch(initializeTabsEvent(tabIds, activeId ?? undefined));
    }, [tabIds, activeId]);

    // =========================================================================
    // Guard and Load Logic
    // =========================================================================

    const executeGuardAndLoad = useCallback(
      async (tabId: string) => {
        const item = itemsMap.get(tabId);
        if (!item) {
          return;
        }

        // Check guard
        if (item.guard) {
          try {
            const result = await Promise.resolve(item.guard());

            if (!result.allowed) {
              dispatch(guardFailEvent(tabId, result));
              item.onGuardFail?.({ id: tabId, reason: result.reason });
              return;
            }

            dispatch(guardOkEvent(tabId));
          } catch {
            // Guard threw an error - treat as blocked
            const guardResult: GuardResult = {
              allowed: false,
              reason: 'guard-error',
            };
            dispatch(guardFailEvent(tabId, guardResult));
            item.onGuardFail?.({ id: tabId, reason: 'guard-error' });
            return;
          }
        } else {
          // No guard - proceed directly
          dispatch(guardOkEvent(tabId));
        }

        // Load content
        const loader = item.loadContent;
        if (loader) {
          // Check if already loading
          if (loadingPromises.current.has(tabId)) {
            return;
          }

          const loadPromise = (async () => {
            try {
              const content = await loader();
              dispatch(loadSuccessEvent(tabId, content));
              item.onViewed?.();
            } catch (error) {
              dispatch(loadErrorEvent(tabId, error));
              item.onError?.(error);
            } finally {
              loadingPromises.current.delete(tabId);
            }
          })();

          loadingPromises.current.set(tabId, loadPromise);
        } else {
          // No async loader - use static content, mark as ready
          dispatch(loadSuccessEvent(tabId, item.content ?? null));
          item.onViewed?.();
        }
      },
      [itemsMap]
    );

    // Create a Map for safe tab state lookup
    const tabsStateMap = useMemo(() => {
      const tabs = fsmState.tabs;
      const map = new Map<string, (typeof tabs)[string]>();
      for (const [key, value] of Object.entries(tabs)) {
        map.set(key, value);
      }
      return map;
    }, [fsmState.tabs]);

    // =========================================================================
    // Tab Change Handler
    // =========================================================================

    const handleTabChange = useCallback(
      (newTabId: string) => {
        const currentTabId = fsmState.activeTabId;

        // Check for dirty state
        if (currentTabId && isDirty?.(currentTabId)) {
          dispatch(leaveRequestEvent(currentTabId, newTabId));
          return;
        }

        // Activate tab
        const item = itemsMap.get(newTabId);
        item?.onActivate?.();

        dispatch(activateTabEvent(newTabId));

        if (!isControlled) {
          setInternalActiveId(newTabId);
        }
        onActiveChange?.(newTabId);

        // Start guard/load process
        // Safe access using Map
        const tabState = tabsStateMap.get(newTabId);
        if (tabState && (tabState.status === 'idle' || tabState.status === 'checkingGuard')) {
          executeGuardAndLoad(newTabId);
        }
      },
      [
        fsmState.activeTabId,
        isDirty,
        itemsMap,
        isControlled,
        onActiveChange,
        executeGuardAndLoad,
        tabsStateMap,
      ]
    );

    // =========================================================================
    // Leave Confirmation Handlers
    // =========================================================================

    const handleLeaveConfirm = useCallback(() => {
      const fromId = fsmState.previousTabId;
      const toId = fsmState.pendingActivationId;

      if (fromId && toId) {
        onDirtyLeave?.(fromId, toId);
      }

      dispatch(leaveConfirmedEvent());

      if (toId) {
        if (!isControlled) {
          setInternalActiveId(toId);
        }
        onActiveChange?.(toId);
        executeGuardAndLoad(toId);
      }
    }, [fsmState, isControlled, onActiveChange, onDirtyLeave, executeGuardAndLoad]);

    const handleLeaveCancel = useCallback(() => {
      if (fsmState.previousTabId) {
        onDirtyStay?.(fsmState.previousTabId);
      }
      dispatch(leaveCancelledEvent());
    }, [fsmState.previousTabId, onDirtyStay]);

    // =========================================================================
    // Retry Handler
    // =========================================================================

    const handleRetry = useCallback(
      (tabId: string) => {
        dispatch(retryEvent(tabId));
        executeGuardAndLoad(tabId);
      },
      [executeGuardAndLoad]
    );

    // =========================================================================
    // Initial Load Effect - Run once after mount
    // =========================================================================

    const hasInitializedRef = useRef(false);

    useEffect(() => {
      // Only run once - set immediately to prevent re-runs
      if (hasInitializedRef.current) {
        return;
      }
      hasInitializedRef.current = true;

      // Trigger guard/load for initial active tab
      if (activeId) {
        executeGuardAndLoad(activeId);
      }
    }, [activeId, executeGuardAndLoad]);

    // =========================================================================
    // Resolve Tab Content Based on FSM State
    // =========================================================================

    const resolvedItems = useMemo<ResolvedTabItem[]>(() => {
      return items.map((item) => {
        // Safe access using Map
        const tabState = tabsStateMap.get(item.id);
        const status = tabState?.status ?? 'idle';

        let content: React.ReactNode;

        switch (status) {
          case 'blocked': {
            const guardResult = tabState?.guardResult;
            if (item.blockedFallback) {
              content = item.blockedFallback;
            } else if (defaultBlockedFallback) {
              content = defaultBlockedFallback;
            } else {
              content = (
                <DefaultBlocked
                  title="Access Restricted"
                  description={
                    guardResult?.reason ?? 'You do not have permission to view this content.'
                  }
                  actionLabel={guardResult?.actionLabel}
                  onAction={guardResult?.onAction}
                />
              );
            }
            break;
          }

          case 'loading':
          case 'checkingGuard': {
            if (item.loadingFallback) {
              content = item.loadingFallback;
            } else if (defaultLoadingFallback) {
              content = defaultLoadingFallback;
            } else {
              content = <DefaultLoading message="Loading..." />;
            }
            break;
          }

          case 'error': {
            const error = tabState?.error;
            const retry = (): void => handleRetry(item.id);

            if (item.errorFallback) {
              content = item.errorFallback(error, retry);
            } else if (defaultErrorFallback) {
              content = defaultErrorFallback(error, retry);
            } else {
              content = (
                <DefaultError
                  message={error instanceof Error ? error.message : 'Failed to load content.'}
                  onRetry={retry}
                />
              );
            }
            break;
          }

          case 'ready': {
            content = tabState?.loadedContent ?? item.content ?? null;
            break;
          }
          default: {
            // Show loading for idle tabs when active (will trigger load)
            if (fsmState.activeTabId === item.id) {
              if (item.loadingFallback) {
                content = item.loadingFallback;
              } else if (defaultLoadingFallback) {
                content = defaultLoadingFallback;
              } else {
                content = <DefaultLoading message="Loading..." />;
              }
            } else {
              // Not active - show nothing or static content
              content = item.content ?? null;
            }
            break;
          }
        }

        return {
          id: item.id,
          label: item.label,
          icon: item.icon,
          disabled: item.disabled,
          content,
        };
      });
    }, [
      items,
      tabsStateMap,
      fsmState,
      handleRetry,
      defaultLoadingFallback,
      defaultBlockedFallback,
      defaultErrorFallback,
    ]);

    // =========================================================================
    // Convert to Tabs items format
    // =========================================================================

    const tabItems = useMemo<TabItem[]>(() => {
      return resolvedItems.map((item) => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        disabled: item.disabled,
        content: item.content,
      }));
    }, [resolvedItems]);

    // =========================================================================
    // Render
    // =========================================================================

    return (
      <>
        <Tabs
          ref={ref}
          items={tabItems}
          activeTab={activeId ?? undefined}
          onTabChange={handleTabChange}
          variant={variant}
          orientation={orientation}
          fill={fill}
          justified={justified}
          className={className}
          style={style}
          id={id}
        />

        <LeaveConfirmModal
          show={fsmState.pendingLeaveConfirmation}
          message={dirtyConfirmMessage}
          onConfirm={handleLeaveConfirm}
          onCancel={handleLeaveCancel}
          titleId={leaveConfirmTitleId}
        />
      </>
    );
  })
);

TabsPro.displayName = 'TabsPro';

// =============================================================================
// Exports
// =============================================================================

export type {
  AsyncLoader,
  DefaultBlockedProps,
  DefaultErrorProps,
  DefaultLoadingProps,
  GuardFn,
  GuardResult,
  ResolvedTabItem,
  TabsProItem,
  TabsProProps,
} from './TabsPro.types';
