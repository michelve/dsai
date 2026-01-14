# Carousel Component Guidelines

The Carousel component provides a slideshow for cycling through elements.

## Import

```tsx
import { Carousel } from '@dsai/react';
```

## When to Use

Use Carousel when:

- Showcasing multiple images/content in limited space
- Featured content rotations
- Product image galleries
- Testimonial rotations

Do not use Carousel when:

- All content must be visible
- Content is critical (users miss slides)
- Mobile-primary (consider stacking)

## Basic Usage

```tsx
<Carousel>
  <Carousel.Item>
    <img src="/slide1.jpg" alt="Slide 1" />
  </Carousel.Item>
  <Carousel.Item>
    <img src="/slide2.jpg" alt="Slide 2" />
  </Carousel.Item>
  <Carousel.Item>
    <img src="/slide3.jpg" alt="Slide 3" />
  </Carousel.Item>
</Carousel>
```

## With Captions

```tsx
<Carousel>
  <Carousel.Item>
    <img src="/slide.jpg" alt="" />
    <Carousel.Caption>
      <h3>First Slide</h3>
      <p>Description text</p>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>
```

## Controls

```tsx
<Carousel showControls showIndicators>
  <Carousel.Item>...</Carousel.Item>
  <Carousel.Item>...</Carousel.Item>
</Carousel>
```

## Auto-play

```tsx
<Carousel autoPlay interval={5000}>
  <Carousel.Item>...</Carousel.Item>
  <Carousel.Item>...</Carousel.Item>
</Carousel>
```

## Accessibility

- Provide alt text for all images
- Pause auto-play on hover/focus
- Keyboard navigation support
- Announce slide changes

```tsx
<Carousel aria-label="Featured products" pauseOnHover>
  <Carousel.Item aria-label="Slide 1 of 3">
    <img src="/product.jpg" alt="Product name and description" />
  </Carousel.Item>
</Carousel>
```

## Do's and Don'ts

### Do

- Provide navigation controls
- Allow pausing auto-play
- Use meaningful alt text
- Limit number of slides

### Don't

- Don't put critical content only in carousel
- Don't auto-play too fast
- Don't use for primary navigation
