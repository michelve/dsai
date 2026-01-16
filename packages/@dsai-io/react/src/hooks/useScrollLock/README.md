# useScrollLock Hook

A React hook that locks/unlocks scrolling on the document body or a custom element. Supports multiple overlays (stacking), scrollbar width compensation, and SSR.

## Features

- **Scroll Locking**: Prevents page scrolling when overlays are active
- **Scrollbar Compensation**: Automatically compensates for scrollbar width to prevent layout shift
- **Stacking Support**: Multiple overlays can use the hook simultaneously with reference counting
- **Custom Targets**: Lock scrolling on custom elements, not just `document.body`
- **Manual Control**: Provides `lock()` and `unlock()` methods for imperative control
- **SSR-Safe**: Works safely in server-side rendering environments
- **TypeScript**: Full type safety with comprehensive interfaces

## Installation

```bash
npm install @dsai-io/react
# or
pnpm add @dsai-io/react
# or
yarn add @dsai-io/react
```

## Basic Usage

```tsx
import { useScrollLock } from '@dsai-io/react';

function Modal({ isOpen }: { isOpen: boolean }) {
  useScrollLock({ enabled: isOpen });

  if (!isOpen) return null;

  return (
    <div className="modal">
      <h1>Modal Content</h1>
    </div>
  );
}
```

## API

### Options

```typescript
interface UseScrollLockOptions {
  /**
   * Whether scroll locking is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Whether to add padding to compensate for scrollbar width
   * This prevents layout shift when the scrollbar is hidden
   * @default true
   */
  reserveScrollBarGap?: boolean;

  /**
   * Custom element to lock scrolling on (instead of document.body)
   * Can be a direct HTMLElement reference or a React ref
   */
  target?: HTMLElement | React.RefObject<HTMLElement>;
}
```

### Return Value

```typescript
interface UseScrollLockReturn {
  /**
   * Manually lock scrolling
   * Useful for imperative control outside of the enabled prop
   */
  lock: () => void;

  /**
   * Manually unlock scrolling
   * Useful for imperative control outside of the enabled prop
   */
  unlock: () => void;

  /**
   * Whether scrolling is currently locked
   * Read-only getter that reflects the current lock state
   */
  isLocked: boolean;
}
```

## Examples

### Controlled by State

```tsx
import { useState } from 'react';
import { useScrollLock } from '@dsai-io/react';

function Drawer() {
  const [isOpen, setIsOpen] = useState(false);

  useScrollLock({ enabled: isOpen });

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Drawer</button>
      {isOpen && (
        <div className="drawer">
          <button onClick={() => setIsOpen(false)}>Close</button>
          <p>Drawer content</p>
        </div>
      )}
    </>
  );
}
```

### Manual Control

```tsx
import { useScrollLock } from '@dsai-io/react';

function CustomComponent() {
  const { lock, unlock, isLocked } = useScrollLock({ enabled: false });

  return (
    <div>
      <button onClick={lock}>Lock Scrolling</button>
      <button onClick={unlock}>Unlock Scrolling</button>
      <p>Scroll is {isLocked ? 'locked' : 'unlocked'}</p>
    </div>
  );
}
```

### Multiple Overlays (Stacking)

```tsx
import { useScrollLock } from '@dsai-io/react';

// Both modal and drawer can be open at the same time
// Scrolling is only unlocked when BOTH are closed
function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

function Modal({ isOpen, onClose }: ModalProps) {
  useScrollLock({ enabled: isOpen });
  // Modal implementation
}

function Drawer({ isOpen, onClose }: DrawerProps) {
  useScrollLock({ enabled: isOpen });
  // Drawer implementation
}
```

### Without Scrollbar Compensation

```tsx
import { useScrollLock } from '@dsai-io/react';

function FullscreenVideo() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Don't compensate for scrollbar - just lock scroll
  useScrollLock({
    enabled: isFullscreen,
    reserveScrollBarGap: false,
  });

  return (
    <video
      onClick={() => setIsFullscreen(true)}
      // video props
    />
  );
}
```

### Custom Target Element

```tsx
import { useRef } from 'react';
import { useScrollLock } from '@dsai-io/react';

function ScrollablePanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isPanelLocked, setIsPanelLocked] = useState(false);

  // Lock scrolling on the panel, not the body
  useScrollLock({
    enabled: isPanelLocked,
    target: panelRef,
  });

  return (
    <div ref={panelRef} className="scrollable-panel">
      <button onClick={() => setIsPanelLocked(!isPanelLocked)}>
        {isPanelLocked ? 'Unlock Panel' : 'Lock Panel'}
      </button>
      <div className="panel-content">{/* Long content */}</div>
    </div>
  );
}
```

## How It Works

### Reference Counting (Stacking)

The hook uses a global reference count to support multiple overlays:

1. **First lock**: Applies `overflow: hidden` and scrollbar compensation
2. **Additional locks**: Increments counter but doesn't change styles
3. **Unlocking**: Decrements counter; only restores styles when count reaches 0

This allows you to have multiple overlays (Modal + Drawer, nested modals, etc.) without conflicts.

### Scrollbar Compensation

When enabled, the hook:

1. Calculates scrollbar width: `window.innerWidth - document.documentElement.clientWidth`
2. Adds `padding-right` equal to the scrollbar width
3. Sets `overflow: hidden` to hide the scrollbar
4. Restores original styles on cleanup

This prevents layout shift when the scrollbar is hidden.

### SSR Safety

The hook checks for browser environment before accessing `window` or `document`, making it safe to use in Next.js, Remix, and other SSR frameworks.

## Browser Support

Works in all modern browsers. Uses:

- `window.getComputedStyle()` - All modern browsers
- `window.innerWidth` / `document.documentElement.clientWidth` - All modern browsers
- DOM style manipulation - All browsers

## TypeScript

Fully typed with TypeScript. All interfaces are exported for use in your code:

```tsx
import type { UseScrollLockOptions, UseScrollLockReturn, UseScrollLockTarget } from '@dsai-io/react';
```

## Related Hooks

- [`useFocusTrap`](../useFocusTrap/README.md) - Trap focus within a container (commonly used with scroll lock for modals)

## Common Use Cases

- **Modals and Dialogs**: Lock scrolling when modal is open
- **Drawers and Side Panels**: Prevent background scrolling
- **Fullscreen Overlays**: Lock scrolling for fullscreen experiences
- **Mobile Menus**: Prevent background scrolling on mobile navigation
- **Image Galleries**: Lock scrolling when viewing images fullscreen

## License

MIT © DSAi Team
