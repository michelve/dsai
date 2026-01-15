# Platform Utilities

Platform and device detection utilities for cross-platform compatibility.

## Overview

This module provides utilities for:

- Browser detection
- Operating system detection
- Device type detection (mobile, tablet, desktop)
- Touch and hover capability detection
- Text direction detection

## Installation

```tsx
import {
  getBrowser,
  getOS,
  isMobile,
  isTablet,
  isDesktop,
  isTouchDevice,
  hasHover,
  isRTL,
  getTextDirection,
  getDevicePixelRatio,
} from '@dsai/react';
```

---

## Browser Detection

### `getBrowser`

Detect current browser.

**Signature:**

```tsx
function getBrowser(): Browser;

type Browser = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'ie' | 'unknown';
```

**Examples:**

```tsx
const browser = getBrowser();

if (browser === 'safari') {
  // Safari-specific workaround
}
```

---

## Operating System

### `getOS`

Detect operating system.

**Signature:**

```tsx
function getOS(): OperatingSystem;

type OperatingSystem = 'windows' | 'macos' | 'linux' | 'ios' | 'android' | 'unknown';
```

**Examples:**

```tsx
const os = getOS();

const modifier = os === 'macos' ? '⌘' : 'Ctrl';
```

---

## Device Detection

### `isMobile`

Check if device is mobile.

**Signature:**

```tsx
function isMobile(): boolean;
```

**Examples:**

```tsx
if (isMobile()) {
  // Mobile-optimized UI
}
```

---

### `isTablet`

Check if device is tablet.

**Signature:**

```tsx
function isTablet(): boolean;
```

---

### `isDesktop`

Check if device is desktop.

**Signature:**

```tsx
function isDesktop(): boolean;
```

**Examples:**

```tsx
const deviceType: DeviceType = isMobile() ? 'mobile' : isTablet() ? 'tablet' : 'desktop';
```

---

## Capabilities

### `isTouchDevice`

Check if device supports touch.

**Signature:**

```tsx
function isTouchDevice(): boolean;
```

**Examples:**

```tsx
const eventType = isTouchDevice() ? 'touchstart' : 'mousedown';
```

---

### `hasHover`

Check if device has hover capability.

**Signature:**

```tsx
function hasHover(): boolean;
```

**Examples:**

```tsx
if (hasHover()) {
  // Enable hover effects
}
```

---

## Text Direction

### `isRTL`

Check if current text direction is RTL.

**Signature:**

```tsx
function isRTL(): boolean;
```

**Examples:**

```tsx
const marginProp = isRTL() ? 'marginLeft' : 'marginRight';
```

---

### `getTextDirection`

Get current text direction.

**Signature:**

```tsx
function getTextDirection(): TextDirection;

type TextDirection = 'ltr' | 'rtl';
```

---

## Display

### `getDevicePixelRatio`

Get device pixel ratio.

**Signature:**

```tsx
function getDevicePixelRatio(): number;
```

**Examples:**

```tsx
const dpr = getDevicePixelRatio();
const imageSize = baseSize * dpr;
```

---

## Common Patterns

### Responsive Navigation

```tsx
function Navigation() {
  const mobile = isMobile();

  return mobile ? <MobileNav /> : <DesktopNav />;
}
```

### Touch/Mouse Events

```tsx
function useDragEvents() {
  const isTouch = isTouchDevice();

  return {
    start: isTouch ? 'touchstart' : 'mousedown',
    move: isTouch ? 'touchmove' : 'mousemove',
    end: isTouch ? 'touchend' : 'mouseup',
  };
}
```

### Keyboard Shortcuts

```tsx
function KeyboardShortcut({ children }: Props) {
  const os = getOS();
  const modifier = os === 'macos' ? '⌘' : 'Ctrl';

  return <kbd>{modifier}+S</kbd>;
}
```

### RTL-Aware Styling

```tsx
function Box({ children }: Props) {
  const direction = getTextDirection();

  return (
    <div
      style={{
        textAlign: direction === 'rtl' ? 'right' : 'left',
      }}
    >
      {children}
    </div>
  );
}
```

### High-DPI Images

```tsx
function ResponsiveImage({ src }: Props) {
  const dpr = getDevicePixelRatio();
  const imageSrc = dpr > 1 ? `${src}@2x.png` : `${src}.png`;

  return <img src={imageSrc} />;
}
```

---

## Best Practices

1. **Cache detection results:**

```tsx
const deviceInfo = useMemo(
  () => ({
    isMobile: isMobile(),
    isTouch: isTouchDevice(),
    os: getOS(),
  }),
  []
);
```

1. **Use feature detection over browser detection:**

```tsx
if ('serviceWorker' in navigator) {
  // Use service worker
}
```

1. **Respect device capabilities:**

```tsx
if (!hasHover()) {
  // Disable hover-dependent UI
}
```

1. **Support both RTL and LTR:**

```tsx
const margin = isRTL() ? { marginLeft: spacing } : { marginRight: spacing };
```

---

## SSR Considerations

All detection functions return default values during SSR. Use in `useEffect` for accurate client-side detection:

```tsx
useEffect(() => {
  if (isMobile()) {
    // Client-side only
  }
}, []);
```

---

## Related Documentation

- [Main Utils README](../README.md)
- [Browser Utilities](../browser/README.md)
- [Responsive Utilities](../responsive/README.md)

---

## License

Copyright © 2024 DSAi. All rights reserved.
