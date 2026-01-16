# Motion Utilities

Animation utilities for easing functions, interpolation, spring physics, and gestures.

## Overview

This module provides utilities for:

- Easing functions (in, out, in-out)
- Value interpolation
- Spring physics simulation
- Distance and angle calculations
- Velocity clamping

## Installation

```tsx
import {
  easeIn,
  easeOut,
  easeInOut,
  interpolate,
  createSpring,
  distance,
  angle,
  clampVelocity,
} from '@dsai-io/react';
```

---

## Easing Functions

### `easeIn`, `easeOut`, `easeInOut`

Standard easing curves for animations.

**Signature:**

```tsx
function easeIn(t: number): number;
function easeOut(t: number): number;
function easeInOut(t: number): number;
```

**Examples:**

```tsx
// t ranges from 0 to 1
const progress = easeInOut(0.5); // 0.5

// In animation loop
function animate(timestamp: number) {
  const elapsed = timestamp - startTime;
  const duration = 1000;
  const t = Math.min(elapsed / duration, 1);

  const easedProgress = easeOut(t);
  element.style.opacity = String(easedProgress);

  if (t < 1) requestAnimationFrame(animate);
}
```

---

## Interpolation

### `interpolate`

Map input range to output range with optional easing.

**Signature:**

```tsx
function interpolate(
  value: number,
  inputRange: [number, number],
  outputRange: [number, number],
  options?: InterpolateOptions
): number;

interface InterpolateOptions {
  easing?: EasingFunction;
  clamp?: boolean;
}
```

**Examples:**

```tsx
// Basic interpolation
const opacity = interpolate(scrollY, [0, 100], [1, 0]);

// With easing
const scale = interpolate(progress, [0, 1], [0.5, 1.5], { easing: easeOut });

// With clamping
const rotation = interpolate(
  angle,
  [0, 90],
  [0, 180],
  { clamp: true } // Never exceeds 180
);

// Multiple ranges
const color = interpolate(score, [0, 50, 100], [0, 128, 255]);
```

---

## Spring Physics

### `createSpring`

Create spring-based animation with physics.

**Signature:**

```tsx
function createSpring(config?: Partial<SpringConfig>): SpringState;

interface SpringConfig {
  mass: number;
  stiffness: number;
  damping: number;
  velocity: number;
}

interface SpringState {
  update(target: number, delta: number): number;
  reset(): void;
}
```

**Examples:**

```tsx
// Create spring
const spring = createSpring({
  stiffness: 170,
  damping: 26,
  mass: 1,
});

// In animation loop
let value = 0;
function animate(timestamp: number) {
  const delta = timestamp - lastTime;
  value = spring.update(targetValue, delta);

  element.style.transform = `translateX(${value}px)`;
  requestAnimationFrame(animate);
}

// Reset spring
spring.reset();
```

---

## Geometry

### `distance`

Calculate distance between two points.

**Signature:**

```tsx
function distance(p1: Point2D, p2: Point2D): number;

interface Point2D {
  x: number;
  y: number;
}
```

**Examples:**

```tsx
const dist = distance({ x: 0, y: 0 }, { x: 3, y: 4 }); // 5

// Gesture threshold
const swipeDistance = distance(touchStart, touchEnd);
if (swipeDistance > 50) {
  handleSwipe();
}
```

---

### `angle`

Calculate angle between two points in degrees.

**Signature:**

```tsx
function angle(p1: Point2D, p2: Point2D): number;
```

**Examples:**

```tsx
const deg = angle({ x: 0, y: 0 }, { x: 1, y: 1 }); // 45

// Rotation direction
const rotation = angle(center, pointer);
element.style.transform = `rotate(${rotation}deg)`;
```

---

### `clampVelocity`

Clamp velocity value to maximum.

**Signature:**

```tsx
function clampVelocity(velocity: number, maxVelocity: number): number;
```

**Examples:**

```tsx
const velocity = clampVelocity(calculated, 1000);
```

---

## Common Patterns

### Smooth Scroll

```tsx
function smoothScrollTo(targetY: number) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = 1000;
  const startTime = performance.now();

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOut(progress);

    const currentY = startY + distance * easedProgress;
    window.scrollTo(0, currentY);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}
```

### Parallax Effect

```tsx
function useParallax(ref: RefObject<HTMLElement>, speed = 0.5) {
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const scrollY = window.scrollY;
      const elementY = ref.current.offsetTop;
      const distance = scrollY - elementY;

      const offset =
        interpolate(distance, [-window.innerHeight, window.innerHeight], [100, -100]) * speed;

      ref.current.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, speed]);
}
```

### Spring Animation Hook

```tsx
function useSpring(target: number, config?: Partial<SpringConfig>) {
  const [value, setValue] = useState(target);
  const springRef = useRef(createSpring(config));

  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    function animate(currentTime: number) {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      const newValue = springRef.current.update(target, delta);
      setValue(newValue);

      if (Math.abs(newValue - target) > 0.01) {
        animationId = requestAnimationFrame(animate);
      }
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [target]);

  return value;
}
```

---

## Best Practices

1. **Use easing for natural motion:**

```tsx
const progress = easeOut(t);
```

1. **Clamp interpolated values when needed:**

```tsx
const value = interpolate(input, [0, 1], [0, 100], { clamp: true });
```

1. **Reset springs when target changes dramatically:**

```tsx
if (Math.abs(newTarget - oldTarget) > threshold) {
  spring.reset();
}
```

1. **Respect prefersReducedMotion:**

```tsx
import { prefersReducedMotion } from '../browser';

const duration = prefersReducedMotion() ? 0 : 300;
```

---

## Performance Notes

- Interpolation is O(1) with memoization
- Spring physics runs at 60fps
- Use requestAnimationFrame for smooth animations

---

## Related Documentation

- [Main Utils README](../README.md)
- [Layout Utilities](../layout/README.md)
- [Browser Utilities](../browser/README.md)

---

## License

Copyright © 2024 DSAi. All rights reserved.
