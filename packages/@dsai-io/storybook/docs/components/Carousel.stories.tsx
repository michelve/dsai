import { Button, Carousel, CarouselCaption, CarouselItem } from '@dsai-io/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Carousel component for cycling through images or content.
 * Supports autoplay, touch gestures, keyboard navigation, and custom indicators.
 *
 * Features:
 * - Slide and fade animations
 * - Autoplay with pause on hover/focus
 * - Touch/swipe gesture support
 * - Keyboard navigation (Arrow keys)
 * - WCAG 2.2 AA compliant with pause control
 * - Controlled and uncontrolled modes
 *
 * @see https://getbootstrap.com/docs/5.3/components/carousel/
 */
const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A fully accessible carousel for cycling through images or content. ' +
          'Supports autoplay, touch gestures, keyboard navigation, and custom indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    animation: {
      control: 'select',
      options: ['slide', 'fade'],
      description: 'Animation type for slide transitions',
      table: {
        type: { summary: 'CarouselAnimation' },
        defaultValue: { summary: 'slide' },
      },
    },
    autoPlay: {
      control: 'boolean',
      description: 'Enable automatic slide advancement',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    interval: {
      control: { type: 'number', min: 1000, max: 10000, step: 500 },
      description: 'Autoplay interval in milliseconds',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '5000' },
      },
    },
    controls: {
      control: 'boolean',
      description: 'Show prev/next navigation controls',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    indicators: {
      control: 'boolean',
      description: 'Show slide indicators',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    dark: {
      control: 'boolean',
      description: 'Dark variant for light backgrounds',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    wrap: {
      control: 'boolean',
      description: 'Wrap around from last to first slide',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    keyboard: {
      control: 'boolean',
      description: 'Enable keyboard navigation',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    touch: {
      control: 'boolean',
      description: 'Enable touch/swipe gestures',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Pause autoplay on hover',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pauseOnFocus: {
      control: 'boolean',
      description: 'Pause autoplay when carousel receives keyboard focus',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample slide images (using placeholder)
const slides = [
  {
    id: 'slide-1',
    src: 'https://picsum.photos/seed/slide1/800/400',
    alt: 'First slide - Mountain landscape',
    title: 'First Slide Label',
    description: 'Some representative placeholder content for the first slide.',
  },
  {
    id: 'slide-2',
    src: 'https://picsum.photos/seed/slide2/800/400',
    alt: 'Second slide - Ocean view',
    title: 'Second Slide Label',
    description: 'Some representative placeholder content for the second slide.',
  },
  {
    id: 'slide-3',
    src: 'https://picsum.photos/seed/slide3/800/400',
    alt: 'Third slide - Forest path',
    title: 'Third Slide Label',
    description: 'Some representative placeholder content for the third slide.',
  },
];

// =============================================================================
// Basic Carousel
// =============================================================================

/**
 * Basic carousel with slides only (no controls or indicators).
 */
export const SlidesOnly: Story = {
  render: function SlidesOnlyCarousel() {
    return (
      <Carousel controls={false} indicators={false} aria-label="Basic carousel">
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <img src={slide.src} alt={slide.alt} className="d-block w-100" />
          </CarouselItem>
        ))}
      </Carousel>
    );
  },
};

// =============================================================================
// With Controls
// =============================================================================

/**
 * Carousel with prev/next navigation controls.
 */
export const WithControls: Story = {
  render: function WithControlsCarousel() {
    return (
      <Carousel indicators={false} aria-label="Carousel with controls">
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <img src={slide.src} alt={slide.alt} className="d-block w-100" />
          </CarouselItem>
        ))}
      </Carousel>
    );
  },
};

// =============================================================================
// With Indicators
// =============================================================================

/**
 * Carousel with slide indicators (dots).
 */
export const WithIndicators: Story = {
  render: function WithIndicatorsCarousel() {
    return (
      <Carousel aria-label="Carousel with indicators">
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <img src={slide.src} alt={slide.alt} className="d-block w-100" />
          </CarouselItem>
        ))}
      </Carousel>
    );
  },
};

// =============================================================================
// With Captions
// =============================================================================

/**
 * Carousel with captions on each slide.
 */
export const WithCaptions: Story = {
  render: function WithCaptionsCarousel() {
    return (
      <Carousel aria-label="Carousel with captions">
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <img src={slide.src} alt={slide.alt} className="d-block w-100" />
            <CarouselCaption heading={slide.title} description={slide.description} />
          </CarouselItem>
        ))}
      </Carousel>
    );
  },
};

// =============================================================================
// Fade Animation
// =============================================================================

/**
 * Carousel with crossfade animation instead of slide.
 */
export const FadeAnimation: Story = {
  render: function FadeCarousel() {
    return (
      <Carousel animation="fade" aria-label="Carousel with fade animation">
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <img src={slide.src} alt={slide.alt} className="d-block w-100" />
          </CarouselItem>
        ))}
      </Carousel>
    );
  },
};

// =============================================================================
// Dark Variant
// =============================================================================

/**
 * Dark variant for use on light backgrounds.
 */
export const DarkVariant: Story = {
  render: function DarkCarousel() {
    return (
      <div style={{ backgroundColor: 'var(--bs-gray-100)', padding: '2rem' }}>
        <Carousel dark aria-label="Dark carousel variant">
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <img src={slide.src} alt={slide.alt} className="d-block w-100" />
              <CarouselCaption heading={slide.title} description={slide.description} />
            </CarouselItem>
          ))}
        </Carousel>
      </div>
    );
  },
};

// =============================================================================
// Autoplay
// =============================================================================

/**
 * Carousel with autoplay enabled. Includes pause/play button for WCAG compliance.
 */
export const Autoplay: Story = {
  render: function AutoplayCarousel() {
    return (
      <Carousel autoPlay interval={3000} aria-label="Auto-playing carousel">
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <img src={slide.src} alt={slide.alt} className="d-block w-100" />
          </CarouselItem>
        ))}
      </Carousel>
    );
  },
};

// =============================================================================
// Pause on Focus
// =============================================================================

/**
 * Carousel that pauses autoplay when it receives keyboard focus.
 * This is important for keyboard users who need time to interact with the content.
 * Tab into the carousel to pause, tab away to resume.
 */
export const PauseOnFocus: Story = {
  render: function PauseOnFocusCarousel() {
    return (
      <div>
        <div className="alert alert-info mb-3" role="alert">
          <strong>Focus Behavior:</strong> Tab into the carousel to pause autoplay. When you tab
          away, autoplay will resume. This ensures keyboard users have time to interact with the
          content.
        </div>

        <Carousel
          autoPlay
          interval={2000}
          pauseOnFocus
          pauseOnHover={false}
          aria-label="Carousel with pause on focus"
        >
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <img src={slide.src} alt={slide.alt} className="d-block w-100" />
              <CarouselCaption heading={slide.title} description={slide.description} />
            </CarouselItem>
          ))}
        </Carousel>

        <p className="text-muted text-center mt-2">
          <kbd>Tab</kbd> to focus carousel and pause • <kbd>Tab</kbd> away to resume
        </p>
      </div>
    );
  },
};

// =============================================================================
// Per-Slide Interval
// =============================================================================

/**
 * Different autoplay intervals for each slide.
 */
export const PerSlideInterval: Story = {
  render: function PerSlideIntervalCarousel() {
    return (
      <Carousel autoPlay aria-label="Carousel with per-slide intervals">
        <CarouselItem interval={2000}>
          <img src={slides[0].src} alt={slides[0].alt} className="d-block w-100" />
          <CarouselCaption heading="2 seconds" description="This slide advances after 2 seconds" />
        </CarouselItem>
        <CarouselItem interval={4000}>
          <img src={slides[1].src} alt={slides[1].alt} className="d-block w-100" />
          <CarouselCaption heading="4 seconds" description="This slide advances after 4 seconds" />
        </CarouselItem>
        <CarouselItem interval={1000}>
          <img src={slides[2].src} alt={slides[2].alt} className="d-block w-100" />
          <CarouselCaption heading="1 second" description="This slide advances after 1 second" />
        </CarouselItem>
      </Carousel>
    );
  },
};

// =============================================================================
// Controlled Carousel
// =============================================================================

/**
 * Controlled carousel with external state management.
 */
export const Controlled: Story = {
  render: function ControlledCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
      <div>
        <div className="mb-3 d-flex gap-2 justify-content-center">
          {slides.map((slide, index) => (
            <Button
              key={slide.id}
              size="sm"
              variant={activeIndex === index ? 'primary' : 'outline-primary'}
              onClick={() => setActiveIndex(index)}
            >
              Slide {index + 1}
            </Button>
          ))}
        </div>

        <Carousel
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          aria-label="Controlled carousel"
        >
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <img src={slide.src} alt={slide.alt} className="d-block w-100" />
            </CarouselItem>
          ))}
        </Carousel>

        <p className="text-center mt-2 text-muted">
          Current slide: {activeIndex + 1} of {slides.length}
        </p>
      </div>
    );
  },
};

// =============================================================================
// No Wrap
// =============================================================================

/**
 * Carousel that stops at the first/last slide instead of wrapping.
 */
export const NoWrap: Story = {
  render: function NoWrapCarousel() {
    return (
      <Carousel wrap={false} aria-label="Carousel without wrap">
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <img src={slide.src} alt={slide.alt} className="d-block w-100" />
          </CarouselItem>
        ))}
      </Carousel>
    );
  },
};

// =============================================================================
// Custom Slide Labels
// =============================================================================

/**
 * Carousel with custom labels for accessibility.
 */
export const CustomLabels: Story = {
  render: function CustomLabelsCarousel() {
    return (
      <Carousel slideLabels={['Mountains', 'Ocean', 'Forest']} aria-label="Nature gallery">
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <img src={slide.src} alt={slide.alt} className="d-block w-100" />
          </CarouselItem>
        ))}
      </Carousel>
    );
  },
};

// =============================================================================
// Touch Disabled
// =============================================================================

/**
 * Carousel with touch/swipe gestures disabled.
 */
export const TouchDisabled: Story = {
  render: function TouchDisabledCarousel() {
    return (
      <Carousel touch={false} aria-label="Carousel without touch">
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <img src={slide.src} alt={slide.alt} className="d-block w-100" />
          </CarouselItem>
        ))}
      </Carousel>
    );
  },
};

// =============================================================================
// Accessibility Demo
// =============================================================================

/**
 * Demonstrates accessibility features of the Carousel.
 */
export const AccessibilityDemo: Story = {
  render: function AccessibilityDemoCarousel() {
    return (
      <div>
        <div className="alert alert-info mb-3" role="alert">
          <strong>Accessibility Features:</strong>
          <ul className="mb-0">
            <li>
              <code>&lt;section&gt;</code> element provides implicit{' '}
              <code>role=&quot;region&quot;</code> with{' '}
              <code>aria-roledescription=&quot;carousel&quot;</code>
            </li>
            <li>
              <code>aria-label</code> for carousel identification
            </li>
            <li>
              <code>aria-live=&quot;polite&quot;</code> for slide change announcements
            </li>
            <li>Keyboard navigation with Arrow keys</li>
            <li>Pause/Play button for autoplay (WCAG requirement)</li>
            <li>Each control and indicator has proper labels</li>
          </ul>
        </div>

        <Carousel
          autoPlay
          interval={5000}
          aria-label="Accessible image gallery"
          slideLabels={['Mountain landscape', 'Ocean sunset', 'Forest trail']}
        >
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <img src={slide.src} alt={slide.alt} className="d-block w-100" />
              <CarouselCaption heading={slide.title} description={slide.description} />
            </CarouselItem>
          ))}
        </Carousel>

        <p className="text-muted text-center mt-2">
          <kbd>←</kbd> <kbd>→</kbd> to navigate • Focus carousel and use arrow keys
        </p>
      </div>
    );
  },
};

// =============================================================================
// Content Carousel
// =============================================================================

/**
 * Carousel with custom content (not just images).
 */
export const ContentCarousel: Story = {
  render: function ContentCarouselDemo() {
    return (
      <Carousel aria-label="Testimonials carousel" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <CarouselItem>
          <div className="p-5 bg-primary text-white text-center">
            <blockquote className="blockquote">
              <p>&ldquo;This design system has transformed our workflow!&rdquo;</p>
            </blockquote>
            <figcaption className="blockquote-footer text-white-50">
              Jane Doe, <cite>Product Manager</cite>
            </figcaption>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-5 bg-success text-white text-center">
            <blockquote className="blockquote">
              <p>&ldquo;Accessibility built-in from the start. Amazing!&rdquo;</p>
            </blockquote>
            <figcaption className="blockquote-footer text-white-50">
              John Smith, <cite>Developer</cite>
            </figcaption>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-5 bg-info text-white text-center">
            <blockquote className="blockquote">
              <p>&ldquo;The FSM-based state management is brilliant.&rdquo;</p>
            </blockquote>
            <figcaption className="blockquote-footer text-white-50">
              Alice Johnson, <cite>Tech Lead</cite>
            </figcaption>
          </div>
        </CarouselItem>
      </Carousel>
    );
  },
};
