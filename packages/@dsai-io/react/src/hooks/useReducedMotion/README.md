# useReducedMotion Hook

A React hook that detects if the user prefers reduced motion based on their system settings, enabling components to respect accessibility needs for motion sensitivity.

## Features

- **System Preference Detection**: Reads `prefers-reduced-motion` media query
- **Reactive Updates**: Automatically updates when user changes system preference
- **SSR-Safe**: Works safely in server-side rendering with configurable defaults
- **WCAG Compliant**: Respects WCAG 2.1 SC 2.3.3 (AAA) - Animation from Interactions
- **TypeScript**: Full type safety with exported interfaces
- **Zero Dependencies**: Uses native browser APIs only

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
import { useReducedMotion } from '@dsai-io/react';

function AnimatedButton() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <button
      style={{
        transition: prefersReducedMotion ? 'none' : 'all 0.3s ease',
      }}
    >
      Click me
    </button>
  );
}
```

## API

### Hook Signature

```typescript
function useReducedMotion(options?: UseReducedMotionOptions): boolean;
```

### Options

```typescript
interface UseReducedMotionOptions {
  /**
   * Default value to return during server-side rendering (SSR).
   * @default false
   */
  defaultValue?: boolean;
}
```

### Return Value

Returns `boolean`:

- `true` - User has enabled "reduce motion" in their system preferences
- `false` - User prefers normal animations (or hasn't set a preference)

## Examples

### Conditional Animations

```tsx
import { useReducedMotion } from '@dsai-io/react';

function Modal({ isOpen, children }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={cn('modal', isOpen && 'modal--open', !prefersReducedMotion && 'modal--animated')}
    >
      {children}
    </div>
  );
}
```

### Disable Auto-Play for Carousels

```tsx
import { useReducedMotion } from '@dsai-io/react';

function Carousel({ autoPlay = true, ...props }) {
  const prefersReducedMotion = useReducedMotion();

  // Disable auto-play when user prefers reduced motion
  const shouldAutoPlay = prefersReducedMotion ? false : autoPlay;

  return <CarouselInner autoPlay={shouldAutoPlay} {...props} />;
}
```

### Conditional Transition Duration

```tsx
import { useReducedMotion } from '@dsai-io/react';

function CollapsiblePanel({ isOpen, children }) {
  const prefersReducedMotion = useReducedMotion();

  // Use instant transition when reduced motion is preferred
  const transitionDuration = prefersReducedMotion ? 0 : 300;

  return (
    <div
      style={{
        maxHeight: isOpen ? '500px' : '0',
        transition: `max-height ${transitionDuration}ms ease`,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
```

### SSR with Custom Default

```tsx
import { useReducedMotion } from '@dsai-io/react';

function Hero() {
  // Default to no animations during SSR for better initial experience
  // Will update to actual preference after hydration
  const prefersReducedMotion = useReducedMotion({ defaultValue: true });

  return (
    <div className={prefersReducedMotion ? 'hero-static' : 'hero-animated'}>
      <h1>Welcome</h1>
    </div>
  );
}
```

### React Spring Integration

```tsx
import { useReducedMotion } from '@dsai-io/react';
import { useSpring, animated } from '@react-spring/web';

function AnimatedCard() {
  const prefersReducedMotion = useReducedMotion();

  const spring = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    // Disable spring animation when reduced motion is preferred
    immediate: prefersReducedMotion,
  });

  return <animated.div style={spring}>Card Content</animated.div>;
}
```

### Framer Motion Integration

```tsx
import { useReducedMotion } from '@dsai-io/react';
import { motion } from 'framer-motion';

function FadeInBox() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
      }}
    >
      Box Content
    </motion.div>
  );
}
```

## How It Works

### Browser Implementation

The hook uses the browser's native `matchMedia` API to detect the user's motion preference:

```typescript
window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### Media Query Values

- `prefers-reduced-motion: reduce` - User has enabled reduced motion → returns `true`
- `prefers-reduced-motion: no-preference` - User hasn't set preference → returns `false`

### System Settings

Users can enable reduced motion in their operating system:

- **macOS**: System Preferences → Accessibility → Display → Reduce motion
- **iOS**: Settings → Accessibility → Motion → Reduce Motion
- **Windows**: Settings → Ease of Access → Display → Show animations
- **Android**: Settings → Accessibility → Remove animations

### Reactive Updates

The hook automatically listens to changes in the user's preference:

```tsx
// User enables reduced motion in system settings
prefersReducedMotion: false → true

// Component automatically re-renders with new value
```

### SSR Behavior

During server-side rendering, `window.matchMedia` is not available. The hook:

1. Returns `defaultValue` (default: `false`) during SSR
2. Hydrates with actual preference on the client
3. Listens for changes after hydration

## Browser Support

Works in all modern browsers that support `matchMedia` and `prefers-reduced-motion`:

- ✅ Chrome 74+
- ✅ Firefox 63+
- ✅ Safari 10.1+
- ✅ Edge 79+
- ✅ iOS Safari 10.3+
- ✅ Chrome Android 74+

For older browsers, the hook safely returns `false` (animations enabled).

## Accessibility

### WCAG Compliance

This hook helps meet:

- **WCAG 2.1 SC 2.3.3 (AAA)**: Animation from Interactions
  - Users can disable motion triggered by interaction

### Best Practices

1. **Respect the preference**: Always disable animations when `prefersReducedMotion` is `true`
2. **Essential animations**: Some animations convey critical information (loading spinners, progress indicators) - consider keeping these but simplifying them
3. **Reduced ≠ None**: You can use simpler animations (fade instead of slide) rather than removing all motion
4. **Test thoroughly**: Test your application with reduced motion enabled in your OS

## Performance

- **Minimal overhead**: Single media query listener shared across all hook instances
- **No re-renders**: Only updates when preference actually changes
- **Automatic cleanup**: Removes event listeners on unmount

## TypeScript

Fully typed with TypeScript. Interfaces are exported:

```tsx
import type { UseReducedMotionOptions } from '@dsai-io/react';

const options: UseReducedMotionOptions = {
  defaultValue: true,
};
```

## Related Hooks

- [`useFocusTrap`](../useFocusTrap/README.md) - Trap focus within a container
- [`useScrollLock`](../useScrollLock/README.md) - Lock scrolling on overlays

## Common Use Cases

- **Modals & Dialogs**: Disable entry/exit animations
- **Carousels**: Disable auto-play and slide transitions
- **Collapse/Accordion**: Use instant expand/collapse
- **Page Transitions**: Remove or simplify route transitions
- **Parallax Effects**: Disable parallax scrolling
- **Scroll Animations**: Remove scroll-triggered animations
- **Loading Indicators**: Simplify spinner animations

## Troubleshooting

### Hook always returns false

- Check if your browser supports `prefers-reduced-motion`
- Verify OS setting is enabled
- Check browser compatibility

### Doesn't update when OS setting changes

- Verify browser supports media query change events
- Check if other event listeners are interfering
- Try unmounting and remounting the component

### SSR hydration mismatch

- Use `defaultValue` to match server and client initial render
- Consider using `useEffect` to defer animation until after hydration

## License

MIT © DSAi Team
