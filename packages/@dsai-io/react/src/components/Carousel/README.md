# Carousel

A fully accessible carousel component for cycling through images or content. Supports autoplay, touch gestures, keyboard navigation, and custom indicators.

## Features

- **Slide and fade animations**: Choose between slide or crossfade transitions
- **Autoplay with pause controls**: Auto-advance slides with WCAG-compliant pause button
- **Touch/swipe support**: Native touch gestures for mobile devices
- **Keyboard navigation**: Arrow keys to navigate between slides
- **Controlled and uncontrolled modes**: Flexible state management options
- **FSM-based state management**: Predictable state transitions
- **WCAG 2.2 AA compliant**: Full accessibility support
- **Compound component pattern**: `Carousel.Item`, `Carousel.Caption`, etc.
- **Transition callbacks**: `onSlideChanged(index, direction)` for analytics/sync
- **Reduced motion support**: Respects `prefers-reduced-motion` system setting
- **W3C Carousel ARIA pattern**: `role="group"`, `aria-roledescription="slide"` on each slide

## Installation

Add the Carousel component to your project using the DSAi CLI:

```bash
dsai add carousel
```

This copies the component source files into your project and automatically resolves all dependencies.

> **First time?** Install the CLI and generate your design tokens first:
>
> ```bash
> pnpm add @dsai-io/tools
> npx dsai tokens build
> ```

## Basic Usage

```tsx
<Carousel aria-label="Image gallery">
  <CarouselItem>
    <img src="slide1.jpg" alt="First slide" className="d-block w-100" />
  </CarouselItem>
  <CarouselItem>
    <img src="slide2.jpg" alt="Second slide" className="d-block w-100" />
  </CarouselItem>
  <CarouselItem>
    <img src="slide3.jpg" alt="Third slide" className="d-block w-100" />
  </CarouselItem>
</Carousel>
```

## Props

### Carousel

| Prop                 | Type                      | Default                | Description                                |
| -------------------- | ------------------------- | ---------------------- | ------------------------------------------ |
| `children`           | `ReactNode`               | Required               | CarouselItem components                    |
| `activeIndex`        | `number`                  | `undefined`            | Controlled active slide index              |
| `defaultActiveIndex` | `number`                  | `0`                    | Default active slide for uncontrolled mode |
| `onSelect`           | `(index: number) => void` | `undefined`            | Callback when slide changes                |
| `animation`          | `'slide' \| 'fade'`       | `'slide'`              | Animation type                             |
| `autoPlay`           | `boolean`                 | `false`                | Enable automatic slide advancement         |
| `interval`           | `number`                  | `5000`                 | Autoplay interval in milliseconds          |
| `pauseOnHover`       | `boolean`                 | `true`                 | Pause autoplay on mouse hover              |
| `pauseOnFocus`       | `boolean`                 | `true`                 | Pause autoplay on keyboard focus           |
| `keyboard`           | `boolean`                 | `true`                 | Enable arrow key navigation                |
| `touch`              | `boolean`                 | `true`                 | Enable touch/swipe gestures                |
| `wrap`               | `boolean`                 | `true`                 | Wrap from last to first slide              |
| `controls`           | `boolean`                 | `true`                 | Show prev/next buttons                     |
| `indicators`         | `boolean`                 | `true`                 | Show slide indicators                      |
| `dark`               | `boolean`                 | `false`                | Dark variant for light backgrounds         |
| `showPauseButton`    | `boolean`                 | `true` when `autoPlay` | Show pause/play button                     |
| `swipeThreshold`     | `number`                  | `50`                   | Minimum swipe distance in pixels           |
| `slideLabels`        | `string[]`                | `undefined`            | Custom labels for screen readers           |
| `onSlideChanged`     | `(index: number, direction: 'next' \| 'prev') => void` | `undefined` | Callback after slide changes |
| `aria-label`         | `string`                  | `'Carousel'`           | Accessible label                           |
| `aria-labelledby`    | `string`                  | `undefined`            | ID of labelling element                    |

### CarouselItem

| Prop        | Type            | Default     | Description                 |
| ----------- | --------------- | ----------- | --------------------------- |
| `children`  | `ReactNode`     | Required    | Slide content               |
| `interval`  | `number`        | `undefined` | Per-slide autoplay interval |
| `className` | `string`        | `undefined` | Additional CSS classes      |
| `style`     | `CSSProperties` | `undefined` | Inline styles               |

### CarouselCaption

| Prop           | Type        | Default     | Description            |
| -------------- | ----------- | ----------- | ---------------------- |
| `heading`      | `ReactNode` | `undefined` | Caption heading        |
| `description`  | `ReactNode` | `undefined` | Caption description    |
| `headingLevel` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h5'` | Heading element level |
| `className`    | `string`    | `undefined` | Additional CSS classes |

### CarouselControl

| Prop         | Type               | Default  | Description             |
| ------------ | ------------------ | -------- | ----------------------- |
| `direction`  | `'prev' \| 'next'` | Required | Control direction       |
| `onClick`    | `() => void`       | Required | Click handler           |
| `disabled`   | `boolean`          | `false`  | Disabled state          |
| `aria-label` | `string`           | Auto     | Custom accessible label |

### CarouselIndicators

| Prop          | Type                      | Default  | Description               |
| ------------- | ------------------------- | -------- | ------------------------- |
| `count`       | `number`                  | Required | Total number of slides    |
| `activeIndex` | `number`                  | Required | Currently active slide    |
| `onSelect`    | `(index: number) => void` | Required | Selection callback        |
| `labels`      | `string[]`                | Auto     | Labels for each indicator |

### CarouselPauseButton

| Prop         | Type         | Default            | Description           |
| ------------ | ------------ | ------------------ | --------------------- |
| `isPaused`   | `boolean`    | Required           | Current pause state   |
| `onToggle`   | `() => void` | Required           | Toggle callback       |
| `pauseLabel` | `string`     | `'Pause carousel'` | Label for pause state |
| `playLabel`  | `string`     | `'Play carousel'`  | Label for play state  |

## Examples

### With Captions

```tsx
<Carousel aria-label="Product showcase">
  <CarouselItem>
    <img src="product1.jpg" alt="Product 1" className="d-block w-100" />
    <CarouselCaption heading="Product Name" description="Description of the product features." />
  </CarouselItem>
</Carousel>
```

### Fade Animation

```tsx
<Carousel animation="fade" aria-label="Image gallery">
  <CarouselItem>
    <img src="1.jpg" alt="Slide 1" className="d-block w-100" />
  </CarouselItem>
  <CarouselItem>
    <img src="2.jpg" alt="Slide 2" className="d-block w-100" />
  </CarouselItem>
</Carousel>
```

### Autoplay

```tsx
<Carousel autoPlay interval={3000} aria-label="Auto-playing gallery">
  <CarouselItem>
    <img src="1.jpg" alt="Slide 1" className="d-block w-100" />
  </CarouselItem>
  <CarouselItem>
    <img src="2.jpg" alt="Slide 2" className="d-block w-100" />
  </CarouselItem>
</Carousel>
```

### Per-Slide Interval

```tsx
<Carousel autoPlay aria-label="Gallery">
  <CarouselItem interval={2000}>
    <img src="1.jpg" alt="Quick" />
  </CarouselItem>
  <CarouselItem interval={5000}>
    <img src="2.jpg" alt="Slow" />
  </CarouselItem>
</Carousel>
```

### Controlled Mode

```tsx
function ControlledCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Carousel activeIndex={activeIndex} onSelect={setActiveIndex}>
      <CarouselItem>
        <img src="1.jpg" alt="Slide 1" />
      </CarouselItem>
      <CarouselItem>
        <img src="2.jpg" alt="Slide 2" />
      </CarouselItem>
    </Carousel>
  );
}
```

### No Wrap

```tsx
<Carousel wrap={false} aria-label="Gallery">
  <CarouselItem>
    <img src="1.jpg" alt="Slide 1" />
  </CarouselItem>
  <CarouselItem>
    <img src="2.jpg" alt="Slide 2" />
  </CarouselItem>
</Carousel>
```

### Compound Component Pattern

```tsx
<Carousel aria-label="Gallery">
  <Carousel.Item>
    <img src="1.jpg" alt="Slide 1" className="d-block w-100" />
    <Carousel.Caption heading="Title" description="Description" headingLevel="h3" />
  </Carousel.Item>
  <Carousel.Item>
    <img src="2.jpg" alt="Slide 2" className="d-block w-100" />
  </Carousel.Item>
</Carousel>
```

### onSlideChanged Callback

```tsx
<Carousel
  onSlideChanged={(index, direction) => {
    console.log(`Navigated to slide ${index}, direction: ${direction}`);
  }}
  aria-label="Gallery"
>
  {slides}
</Carousel>
```

### Custom Content

```tsx
<Carousel aria-label="Testimonials">
  <CarouselItem>
    <div className="p-5 bg-primary text-white text-center">
      <blockquote className="blockquote">
        <p>"Great product!"</p>
      </blockquote>
      <figcaption>— Customer Name</figcaption>
    </div>
  </CarouselItem>
</Carousel>
```

## Accessibility

### WCAG 2.2 AA Compliance

The Carousel component is fully accessible:

- **`<section>` element** provides implicit `role="region"` with **aria-roledescription="carousel"**
- **W3C Carousel ARIA pattern**: Each slide has `role="group"`, `aria-roledescription="slide"`, and `aria-label` with position
- **aria-label** for screen reader identification
- **aria-live="polite"** announces slide changes
- **Keyboard navigation** with Arrow keys
- **Pause/Play button** for autoplay (WCAG 2.2.2 requirement)
- **Labeled controls** and indicators
- **Focus management** during navigation
- **Reduced motion**: Animations are disabled and autoplay stops when `prefers-reduced-motion: reduce` is active

### Screen Reader Behavior

When navigating the carousel:

1. The carousel is announced as a region with "carousel" role description
2. Controls announce their purpose ("Previous slide", "Next slide")
3. Indicators announce slide labels and current position
4. Slide changes are announced via live region

### Keyboard Navigation

| Key              | Action                                   |
| ---------------- | ---------------------------------------- |
| `←` (ArrowLeft)  | Go to previous slide                     |
| `→` (ArrowRight) | Go to next slide                         |
| `Tab`            | Focus controls, indicators, pause button |
| `Enter/Space`    | Activate focused control                 |

### Pause Button (WCAG Requirement)

When autoplay is enabled, a pause/play button is automatically shown. This is required by WCAG 2.2.2 (Pause, Stop, Hide) to allow users to stop automatically advancing content.

```tsx
// Pause button is shown automatically with autoPlay
<Carousel autoPlay>...</Carousel>

// Hide it explicitly if needed (not recommended)
<Carousel autoPlay showPauseButton={false}>...</Carousel>
```

## State Management

The Carousel uses a Finite State Machine (FSM) for predictable state management.

### Visual States

| State           | Description                  |
| --------------- | ---------------------------- |
| `idle`          | Default state, not playing   |
| `playing`       | Autoplay is active           |
| `paused`        | Autoplay paused by user      |
| `transitioning` | Slide transition in progress |
| `dragging`      | User is swiping/dragging     |

### FSM Events

| Event              | Description                |
| ------------------ | -------------------------- |
| `NEXT`             | Advance to next slide      |
| `PREV`             | Go to previous slide       |
| `GO_TO`            | Navigate to specific slide |
| `PLAY`             | Start autoplay             |
| `PAUSE`            | Pause autoplay             |
| `TOGGLE_PAUSE`     | Toggle pause state         |
| `TRANSITION_START` | Begin slide transition     |
| `TRANSITION_END`   | End slide transition       |
| `DRAG_START`       | Begin touch/swipe gesture  |
| `DRAG_END`         | End touch/swipe gesture    |

### Using the FSM Directly

```tsx
import { carouselFSMReducer, createInitialCarouselFSMState } from '@dsai-io/react';

const initialState = createInitialCarouselFSMState(0, 5, false);
const nextState = carouselFSMReducer(initialState, { type: 'NEXT' });
```

## Security

### Prop Whitelisting

Only safe HTML attributes are accepted:

- `className`, `style`, `id`
- `data-testid`, `data-test`
- `aria-*` accessibility attributes

### No XSS Vulnerabilities

- Content is rendered safely via React
- No `dangerouslySetInnerHTML` usage
- Event handlers are explicitly defined

## Performance

### Optimizations

- Memoized class name and style computations
- FSM prevents unnecessary re-renders
- Touch handlers use refs to avoid closures
- Slides only render active class changes

### Bundle Size

- Carousel component: ~4 KB (minified + gzipped)
- Includes FSM state management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers with touch support

## Related Components

- [Modal](./Modal.md) - For overlay content
- [Tabs](./Tabs.md) - For tabbed content navigation
