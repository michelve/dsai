import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Carousel } from './Carousel';
import { CarouselCaption } from './CarouselCaption';
import { CarouselItem } from './CarouselItem';

expect.extend(toHaveNoViolations);

describe('Carousel Accessibility', () => {
  const renderAccessibleCarousel = (props = {}) => {
    return render(
      <Carousel aria-label="Image gallery" {...props}>
        <CarouselItem>
          <img src="slide1.jpg" alt="First slide showing a landscape" className="d-block w-100" />
          <CarouselCaption heading="First slide" description="Description of first slide" />
        </CarouselItem>
        <CarouselItem>
          <img src="slide2.jpg" alt="Second slide showing a cityscape" className="d-block w-100" />
          <CarouselCaption heading="Second slide" description="Description of second slide" />
        </CarouselItem>
        <CarouselItem>
          <img src="slide3.jpg" alt="Third slide showing a seascape" className="d-block w-100" />
          <CarouselCaption heading="Third slide" description="Description of third slide" />
        </CarouselItem>
      </Carousel>
    );
  };

  describe('WCAG 2.2 AA Compliance', () => {
    it('has no accessibility violations in default state', async () => {
      const { container } = renderAccessibleCarousel();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with autoplay enabled', async () => {
      const { container } = renderAccessibleCarousel({ autoPlay: true });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with dark variant', async () => {
      const { container } = renderAccessibleCarousel({ dark: true });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with fade animation', async () => {
      const { container } = renderAccessibleCarousel({ animation: 'fade' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations without controls', async () => {
      const { container } = renderAccessibleCarousel({ controls: false });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations without indicators', async () => {
      const { container } = renderAccessibleCarousel({ indicators: false });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes', () => {
    it('uses section element which has implicit role="region"', () => {
      const { container } = renderAccessibleCarousel();
      const carousel = container.querySelector('.carousel');
      // Section element has implicit role="region", so no explicit role attribute needed
      expect(carousel?.tagName).toBe('SECTION');
    });

    it('has aria-roledescription="carousel"', () => {
      const { container } = renderAccessibleCarousel();
      const carousel = container.querySelector('.carousel');
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    });

    it('has aria-label on container', () => {
      const { container } = renderAccessibleCarousel({ 'aria-label': 'Product showcase' });
      const carousel = container.querySelector('.carousel');
      expect(carousel).toHaveAttribute('aria-label', 'Product showcase');
    });

    it('supports aria-labelledby', () => {
      const { container } = render(
        <>
          <h2 id="carousel-title">My Carousel</h2>
          <Carousel aria-labelledby="carousel-title">
            <CarouselItem>
              <div>Slide 1</div>
            </CarouselItem>
          </Carousel>
        </>
      );
      const carousel = container.querySelector('.carousel');
      expect(carousel).toHaveAttribute('aria-labelledby', 'carousel-title');
    });

    it('has aria-live region for announcements', () => {
      const { container } = renderAccessibleCarousel();
      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });

    it('has visually hidden live region', () => {
      const { container } = renderAccessibleCarousel();
      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toHaveClass('visually-hidden');
    });

    it('announces current slide', () => {
      const { container } = renderAccessibleCarousel({ defaultActiveIndex: 1 });
      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion?.textContent).toContain('Slide 2');
      expect(liveRegion?.textContent).toContain('of 3');
    });
  });

  describe('Control Accessibility', () => {
    it('prev button has aria-label', () => {
      const { container } = renderAccessibleCarousel();
      const prevButton = container.querySelector('.carousel-control-prev');
      expect(prevButton).toHaveAttribute('aria-label', 'Previous slide');
    });

    it('next button has aria-label', () => {
      const { container } = renderAccessibleCarousel();
      const nextButton = container.querySelector('.carousel-control-next');
      expect(nextButton).toHaveAttribute('aria-label', 'Next slide');
    });

    it('control icons are hidden from screen readers', () => {
      const { container } = renderAccessibleCarousel();
      const icons = container.querySelectorAll(
        '.carousel-control-prev-icon, .carousel-control-next-icon'
      );
      icons.forEach((icon) => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('disabled controls have aria-disabled', () => {
      const { container } = renderAccessibleCarousel({ wrap: false, defaultActiveIndex: 0 });
      const prevButton = container.querySelector('.carousel-control-prev');
      expect(prevButton).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Indicator Accessibility', () => {
    it('each indicator has aria-label', () => {
      const { container } = renderAccessibleCarousel();
      const indicators = container.querySelectorAll('.carousel-indicators button');
      indicators.forEach((indicator, index) => {
        expect(indicator).toHaveAttribute('aria-label', `Slide ${index + 1}`);
      });
    });

    it('active indicator has aria-current', () => {
      const { container } = renderAccessibleCarousel({ defaultActiveIndex: 1 });
      const activeIndicator = container.querySelector('.carousel-indicators button.active');
      expect(activeIndicator).toHaveAttribute('aria-current', 'true');
    });

    it('uses custom labels for indicators', () => {
      const { container } = renderAccessibleCarousel({
        slideLabels: ['Intro', 'Features', 'Pricing'],
      });
      const indicators = container.querySelectorAll('.carousel-indicators button');
      expect(indicators[0]).toHaveAttribute('aria-label', 'Intro');
      expect(indicators[1]).toHaveAttribute('aria-label', 'Features');
      expect(indicators[2]).toHaveAttribute('aria-label', 'Pricing');
    });
  });

  describe('Pause Button Accessibility', () => {
    it('pause button has appropriate aria-label', () => {
      const { container } = renderAccessibleCarousel({ autoPlay: true });
      const pauseButton = container.querySelector('.carousel-pause-button');
      expect(pauseButton).toHaveAttribute('aria-label', 'Pause carousel');
    });

    it('pause button has aria-pressed state', () => {
      const { container } = renderAccessibleCarousel({ autoPlay: true });
      const pauseButton = container.querySelector('.carousel-pause-button');
      // When not paused, aria-pressed should be true (indicating autoplay is active)
      expect(pauseButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('pause button icon is hidden from screen readers', () => {
      const { container } = renderAccessibleCarousel({ autoPlay: true });
      const icon = container.querySelector('.carousel-pause-button svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Keyboard Navigation', () => {
    it('carousel is focusable for keyboard users', () => {
      const { container } = renderAccessibleCarousel();
      const carousel = container.querySelector('.carousel');
      expect(carousel).toHaveAttribute('tabIndex', '0');
    });

    it('controls are focusable buttons', () => {
      const { container } = renderAccessibleCarousel();
      const prevButton = container.querySelector('.carousel-control-prev');
      const nextButton = container.querySelector('.carousel-control-next');

      expect(prevButton?.tagName).toBe('BUTTON');
      expect(nextButton?.tagName).toBe('BUTTON');
    });

    it('indicators are focusable buttons', () => {
      const { container } = renderAccessibleCarousel();
      const indicators = container.querySelectorAll('.carousel-indicators button');

      indicators.forEach((indicator) => {
        expect(indicator.tagName).toBe('BUTTON');
      });
    });
  });
});
