/**
 * Figma Code Connect - Carousel Component
 *
 * Maps the DSAi Carousel Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Carousel/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Carousel } from './Carousel';
import { CarouselCaption } from './CarouselCaption';
import { CarouselItem } from './CarouselItem';

/**
 * DSAi Carousel - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_CAROUSEL>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - Ensure aria-label is provided for screen readers.
 * - Autoplay carousels must have pause controls visible.
 * - Keyboard navigation enabled by default.
 */
figma.connect(Carousel, '<FIGMA_DSAI_CAROUSEL>', {
  props: {
    /**
     * Animation type
     * Maps Figma "Animation" property to React animation prop
     */
    animation: figma.enum('Animation', {
      Slide: 'slide',
      Fade: 'fade',
    }),

    /**
     * Autoplay enabled
     * Maps Figma "Auto Play" boolean property
     */
    autoPlay: figma.boolean('Auto Play'),

    /**
     * Autoplay interval in milliseconds
     * Maps Figma "Interval" property
     */
    interval: figma.enum('Interval', {
      '3 seconds': 3000,
      '5 seconds': 5000,
      '10 seconds': 10000,
    }),

    /**
     * Show controls
     * Maps Figma "Controls" boolean property
     */
    controls: figma.boolean('Controls'),

    /**
     * Show indicators
     * Maps Figma "Indicators" boolean property
     */
    indicators: figma.boolean('Indicators'),

    /**
     * Dark variant for light backgrounds
     * Maps Figma "Dark" boolean property
     */
    dark: figma.boolean('Dark'),

    /**
     * Wrap from last to first
     * Maps Figma "Wrap" boolean property
     */
    wrap: figma.boolean('Wrap'),

    /**
     * Touch/swipe support
     * Maps Figma "Touch" boolean property
     */
    touch: figma.boolean('Touch'),

    /**
     * Keyboard navigation
     * Maps Figma "Keyboard" boolean property
     */
    keyboard: figma.boolean('Keyboard'),

    /**
     * Pause on hover
     * Maps Figma "Pause On Hover" boolean property
     */
    pauseOnHover: figma.boolean('Pause On Hover'),

    /**
     * Show pause button
     * Maps Figma "Show Pause Button" boolean property
     * Required for WCAG compliance when autoPlay is enabled
     */
    showPauseButton: figma.boolean('Show Pause Button'),

    /**
     * Accessible label
     * Maps Figma "Aria Label" property.
     *
     * This should describe the carousel purpose for screen readers.
     * Examples: "Product gallery", "Featured articles", "Testimonials"
     */
    ariaLabel: figma.string('Aria Label'),

    /**
     * Number of slides
     * Maps Figma "Slides" property to determine slide count
     */
    slideCount: figma.enum('Slides', {
      '2 slides': 2,
      '3 slides': 3,
      '4 slides': 4,
      '5 slides': 5,
    }),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   *
   * Notes:
   * - aria-label is required for accessibility.
   * - showPauseButton defaults to true when autoPlay is enabled.
   */
  example: ({
    animation,
    autoPlay,
    interval,
    controls,
    indicators,
    dark,
    wrap,
    touch,
    keyboard,
    pauseOnHover,
    showPauseButton,
    ariaLabel,
    slideCount,
  }) => {
    const normalizedAriaLabel =
      ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : 'Image gallery';

    // Generate placeholder slides based on count
    const slides = Array.from({ length: slideCount || 3 }, (_, i) => i + 1);

    return (
      <Carousel
        animation={animation}
        autoPlay={autoPlay}
        interval={interval}
        controls={controls}
        indicators={indicators}
        dark={dark}
        wrap={wrap}
        touch={touch}
        keyboard={keyboard}
        pauseOnHover={pauseOnHover}
        showPauseButton={showPauseButton}
        aria-label={normalizedAriaLabel}
      >
        {slides.map((num) => (
          <CarouselItem key={num}>
            <img
              src={`https://via.placeholder.com/800x400?text=Slide+${num}`}
              alt={`Slide ${num}`}
              className="d-block w-100"
            />
          </CarouselItem>
        ))}
      </Carousel>
    );
  },
});

/**
 * DSAi CarouselItem with Caption - Code Connect Mapping
 *
 * Maps the DSAi CarouselItem with caption Figma component variant.
 */
figma.connect(CarouselItem, '<FIGMA_DSAI_CAROUSEL_ITEM>', {
  props: {
    /**
     * Show caption
     * Maps Figma "Has Caption" boolean property
     */
    hasCaption: figma.boolean('Has Caption'),

    /**
     * Caption heading
     * Maps Figma "Caption Heading" text property
     */
    captionHeading: figma.string('Caption Heading'),

    /**
     * Caption description
     * Maps Figma "Caption Description" text property
     */
    captionDescription: figma.string('Caption Description'),

    /**
     * Image source
     * Maps Figma "Image" property
     */
    imageSrc: figma.string('Image Source'),

    /**
     * Image alt text
     * Maps Figma "Image Alt" property
     */
    imageAlt: figma.string('Image Alt'),
  },

  example: ({ hasCaption, captionHeading, captionDescription, imageSrc, imageAlt }) => {
    const normalizedImageAlt =
      imageAlt && imageAlt.trim().length > 0 ? imageAlt.trim() : 'Carousel slide';

    return (
      <CarouselItem>
        <img
          src={imageSrc || 'https://via.placeholder.com/800x400'}
          alt={normalizedImageAlt}
          className="d-block w-100"
        />
        {hasCaption && (
          <CarouselCaption heading={captionHeading} description={captionDescription} />
        )}
      </CarouselItem>
    );
  },
});
