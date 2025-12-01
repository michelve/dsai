# TabsPro

Advanced tab component with FSM-based state management for async loading, permission gating, error handling, and analytics.

## Overview

TabsPro wraps the base `Tabs` component and adds enterprise-grade features:

- **Async lazy loading** - Load tab content on-demand with loading states
- **Permission/guard gating** - Check permissions before showing content
- **Error states** - Handle failures with retry functionality
- **Dirty state handling** - Confirm before leaving tabs with unsaved changes
- **Analytics hooks** - Track tab interactions and user behavior

## Installation

TabsPro is part of the `@dsai/react` package:

```tsx
import { TabsPro } from '@dsai/react';
import type { TabsProItem } from '@dsai/react';
```

## Basic Usage

### Static Content

```tsx
<TabsPro
  items={[
    { id: 'home', label: 'Home', content: <HomePanel /> },
    { id: 'profile', label: 'Profile', content: <ProfilePanel /> },
    { id: 'settings', label: 'Settings', content: <SettingsPanel /> },
  ]}
/>
```

### Async Loading

```tsx
<TabsPro
  items={[
    {
      id: 'reports',
      label: 'Reports',
      loadContent: async () => {
        const data = await fetchReports();
        return <ReportsPanel data={data} />;
      },
    },
    {
      id: 'analytics',
      label: 'Analytics',
      loadContent: async () => {
        const metrics = await fetchMetrics();
        return <AnalyticsPanel metrics={metrics} />;
      },
    },
  ]}
/>
```

### Permission Gating

```tsx
<TabsPro
  items={[
    {
      id: 'admin',
      label: 'Admin Panel',
      guard: async () => {
        const user = await getUser();
        return {
          allowed: user.isAdmin,
          reason: user.isAdmin ? undefined : 'admin-required',
          actionLabel: 'Request Access',
          onAction: () => requestAdminAccess(),
        };
      },
      loadContent: async () => <AdminPanel />,
    },
  ]}
/>
```

### Error Handling

```tsx
<TabsPro
  items={[
    {
      id: 'data',
      label: 'Data',
      loadContent: async () => {
        const data = await fetchData(); // May throw
        return <DataPanel data={data} />;
      },
      // Custom error fallback
      errorFallback: (error, retry) => (
        <div className="alert alert-danger">
          <p>Failed to load: {error.message}</p>
          <button onClick={retry}>Try Again</button>
        </div>
      ),
      onError: (error) => logError(error),
    },
  ]}
/>
```

### Dirty State Confirmation

```tsx
<TabsPro
  items={items}
  isDirty={(tabId) => tabId === 'form' && hasUnsavedChanges}
  dirtyConfirmMessage="You have unsaved changes. Leave without saving?"
  onDirtyLeave={(fromTab, toTab) => console.log(`Left ${fromTab} for ${toTab}`)}
  onDirtyStay={(tabId) => console.log(`Stayed on ${tabId}`)}
/>
```

## API Reference

### TabsProProps

| Prop                     | Type                                 | Default                         | Description                            |
| ------------------------ | ------------------------------------ | ------------------------------- | -------------------------------------- |
| `items`                  | `TabsProItem[]`                      | Required                        | Array of tab configurations            |
| `activeId`               | `string`                             | -                               | Active tab ID (controlled mode)        |
| `defaultActiveId`        | `string`                             | First tab                       | Initial active tab (uncontrolled mode) |
| `onActiveChange`         | `(id: string \| null) => void`       | -                               | Called when active tab changes         |
| `keepMounted`            | `boolean`                            | `false`                         | Keep inactive panels mounted           |
| `variant`                | `'tabs' \| 'pills' \| 'underline'`   | `'tabs'`                        | Visual variant                         |
| `orientation`            | `'horizontal' \| 'vertical'`         | `'horizontal'`                  | Tab orientation                        |
| `fill`                   | `boolean`                            | `false`                         | Fill available width                   |
| `justified`              | `boolean`                            | `false`                         | Justify tabs evenly                    |
| `isDirty`                | `(tabId: string) => boolean`         | -                               | Check if tab has unsaved changes       |
| `dirtyConfirmMessage`    | `string`                             | `"You have unsaved changes..."` | Leave confirmation message             |
| `onDirtyLeave`           | `(from: string, to: string) => void` | -                               | Called when leaving dirty tab          |
| `onDirtyStay`            | `(tabId: string) => void`            | -                               | Called when staying on dirty tab       |
| `defaultLoadingFallback` | `ReactNode`                          | Built-in spinner                | Default loading indicator              |
| `defaultBlockedFallback` | `ReactNode`                          | Built-in message                | Default blocked message                |
| `defaultErrorFallback`   | `(error, retry) => ReactNode`        | Built-in error UI               | Default error fallback                 |
| `className`              | `string`                             | -                               | Additional CSS classes                 |
| `style`                  | `CSSProperties`                      | -                               | Inline styles                          |
| `id`                     | `string`                             | -                               | HTML id attribute                      |

### TabsProItem

| Prop              | Type                                        | Default  | Description                   |
| ----------------- | ------------------------------------------- | -------- | ----------------------------- |
| `id`              | `string`                                    | Required | Unique tab identifier         |
| `label`           | `ReactNode`                                 | Required | Tab label                     |
| `icon`            | `ReactNode`                                 | -        | Icon before label             |
| `disabled`        | `boolean`                                   | `false`  | Disable the tab               |
| `content`         | `ReactNode`                                 | -        | Static tab content            |
| `loadContent`     | `() => Promise<ReactNode>`                  | -        | Async content loader          |
| `guard`           | `() => GuardResult \| Promise<GuardResult>` | -        | Permission check function     |
| `blockedFallback` | `ReactNode`                                 | -        | Custom blocked UI             |
| `loadingFallback` | `ReactNode`                                 | -        | Custom loading UI             |
| `errorFallback`   | `(error, retry) => ReactNode`               | -        | Custom error UI               |
| `preloadOnHover`  | `boolean`                                   | `false`  | Preload on hover              |
| `onViewed`        | `() => void`                                | -        | Called when tab is viewed     |
| `onError`         | `(error: unknown) => void`                  | -        | Called on load error          |
| `onActivate`      | `() => void`                                | -        | Called when activation starts |
| `onGuardFail`     | `(info: { id, reason }) => void`            | -        | Called when guard fails       |

### GuardResult

```typescript
interface GuardResult {
  allowed: boolean;
  reason?: string;
  actionLabel?: string; // CTA button text
  onAction?: () => void; // CTA button handler
}
```

## FSM State Machine

TabsPro uses a finite state machine for predictable state management:

```
                    ┌──────────────────────────────────────────┐
                    │                                          │
                    ▼                                          │
┌──────┐     ┌──────────────┐     ┌─────────┐     ┌─────────┐  │
│ idle │────▶│ checkingGuard│────▶│ loading │────▶│  ready  │  │
└──────┘     └──────────────┘     └─────────┘     └─────────┘  │
                    │                   │                      │
                    │                   │                      │
                    ▼                   ▼                      │
              ┌─────────┐         ┌─────────┐                  │
              │ blocked │         │  error  │──────────────────┘
              └─────────┘         └─────────┘    (retry)
```

### States

| State           | Description                          |
| --------------- | ------------------------------------ |
| `idle`          | Initial state, tab not yet activated |
| `checkingGuard` | Running guard/permission check       |
| `blocked`       | Guard denied access                  |
| `loading`       | Loading async content                |
| `ready`         | Content loaded and displayed         |
| `error`         | Loading failed                       |

### Events

| Event          | Description                 |
| -------------- | --------------------------- |
| `ACTIVATE_TAB` | User clicks a tab           |
| `GUARD_OK`     | Guard check passed          |
| `GUARD_FAIL`   | Guard check failed          |
| `LOAD_SUCCESS` | Content loaded successfully |
| `LOAD_ERROR`   | Content loading failed      |
| `RETRY`        | Retry after error           |
| `PRELOAD_TAB`  | Hover-triggered preload     |

## Accessibility

TabsPro maintains full WCAG 2.2 AA compliance:

- ✅ Proper ARIA roles (`tablist`, `tab`, `tabpanel`)
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Focus management
- ✅ Screen reader announcements for loading/error states
- ✅ `aria-live` regions for dynamic content
- ✅ Disabled state properly communicated

## Examples

### With Icons

```tsx
<TabsPro
  items={[
    {
      id: 'home',
      label: 'Home',
      icon: <HomeIcon />,
      content: <HomePanel />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      content: <SettingsPanel />,
    },
  ]}
/>
```

### Controlled Mode

```tsx
function ControlledTabs() {
  const [activeId, setActiveId] = useState('home');

  return <TabsPro items={items} activeId={activeId} onActiveChange={setActiveId} />;
}
```

### With Analytics

```tsx
<TabsPro
  items={[
    {
      id: 'dashboard',
      label: 'Dashboard',
      loadContent: async () => <Dashboard />,
      onActivate: () => analytics.track('tab_click', { tab: 'dashboard' }),
      onViewed: () => analytics.track('tab_view', { tab: 'dashboard' }),
      onError: (error) => analytics.track('tab_error', { tab: 'dashboard', error }),
    },
  ]}
/>
```

## Migration from Tabs

If you're using the basic `Tabs` component and want to upgrade:

```tsx
// Before (Tabs)
<Tabs
  items={[
    { id: 'home', label: 'Home', content: <Home /> },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>

// After (TabsPro) - same API for static content
<TabsPro
  items={[
    { id: 'home', label: 'Home', content: <Home /> },
  ]}
  activeId={activeTab}
  onActiveChange={setActiveTab}
/>
```

Add async loading incrementally:

```tsx
<TabsPro
  items={[
    // Existing static tab
    { id: 'home', label: 'Home', content: <Home /> },
    // New async tab
    {
      id: 'reports',
      label: 'Reports',
      loadContent: async () => {
        const data = await fetchReports();
        return <Reports data={data} />;
      },
    },
  ]}
/>
```

## Related

- [Tabs](../Tabs/README.md) - Base tabs component
- [Storybook](http://localhost:4400/?path=/docs/components-tabspro) - Interactive examples
