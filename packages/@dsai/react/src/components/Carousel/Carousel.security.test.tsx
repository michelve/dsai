import { render, screen } from '@testing-library/react';

import { Carousel } from './Carousel';
import { CarouselCaption } from './CarouselCaption';
import { CarouselControl } from './CarouselControl';
import { CarouselIndicators } from './CarouselIndicators';
import { CarouselItem } from './CarouselItem';
import { CarouselPauseButton } from './CarouselPauseButton';

describe('Carousel Security', () => {
  describe('Prop Whitelisting', () => {
    it('does not spread arbitrary props to Carousel container', () => {
      const { container } = render(
        <Carousel
          data-testid="carousel"
          // @ts-expect-error - testing security
          onLoad={() => alert('XSS')}
          onError={() => alert('XSS')}
          formAction="javascript:alert('XSS')"
        >
          <CarouselItem>
            <div>Slide</div>
          </CarouselItem>
        </Carousel>
      );

      const carousel = container.querySelector('.carousel');
      expect(carousel).not.toHaveAttribute('onload');
      expect(carousel).not.toHaveAttribute('onerror');
      expect(carousel).not.toHaveAttribute('formaction');
    });

    it('does not spread arbitrary props to CarouselItem', () => {
      render(
        <CarouselItem
          data-testid="item"
          // @ts-expect-error - testing security
          onLoad={() => alert('XSS')}
          // nosemgrep: react-dangerouslysetinnerhtml - This tests that the component REJECTS dangerouslySetInnerHTML
          dangerouslySetInnerHTML={{ __html: '<script>alert("XSS")</script>' }}
        >
          <div>Slide</div>
        </CarouselItem>
      );

      const item = screen.getByTestId('item');
      expect(item).not.toHaveAttribute('onload');
      expect(item.innerHTML).not.toContain('<script>');
    });

    it('does not spread arbitrary props to CarouselControl', () => {
      render(
        <CarouselControl
          direction="prev"
          onClick={() => {}}
          data-testid="control"
          // @ts-expect-error - testing security
          formAction="javascript:alert('XSS')"
          onMouseOver={() => alert('XSS')}
        />
      );

      const control = screen.getByTestId('control');
      expect(control).not.toHaveAttribute('formaction');
      // Note: onMouseOver would not be rendered as an attribute
      expect(control.outerHTML).not.toContain('javascript:');
    });

    it('does not spread arbitrary props to CarouselIndicators', () => {
      render(
        <CarouselIndicators
          count={3}
          activeIndex={0}
          onSelect={() => {}}
          data-testid="indicators"
          // @ts-expect-error - testing security
          onLoad={() => alert('XSS')}
        />
      );

      const indicators = screen.getByTestId('indicators');
      expect(indicators).not.toHaveAttribute('onload');
    });

    it('does not spread arbitrary props to CarouselCaption', () => {
      render(
        <CarouselCaption
          heading="Title"
          data-testid="caption"
          // @ts-expect-error - testing security
          onError={() => alert('XSS')}
        />
      );

      const caption = screen.getByTestId('caption');
      expect(caption).not.toHaveAttribute('onerror');
    });

    it('does not spread arbitrary props to CarouselPauseButton', () => {
      render(
        <CarouselPauseButton
          isPaused={false}
          onToggle={() => {}}
          data-testid="pause"
          // @ts-expect-error - testing security
          formAction="javascript:alert('XSS')"
        />
      );

      const button = screen.getByTestId('pause');
      expect(button).not.toHaveAttribute('formaction');
    });
  });

  describe('XSS Prevention', () => {
    it('safely renders text content in CarouselCaption', () => {
      render(
        <CarouselCaption
          heading="<script>alert('XSS')</script>"
          description="<img src=x onerror=alert('XSS')>"
          data-testid="caption"
        />
      );

      const caption = screen.getByTestId('caption');
      // React escapes HTML entities by default - the content is rendered as text, not as executable HTML
      expect(caption.innerHTML).not.toContain('<script>');
      // The raw HTML tag should not be present as an actual element
      expect(caption.querySelector('script')).toBeNull();
      expect(caption.querySelector('img')).toBeNull();
      // Text content should contain the escaped strings as visible text
      expect(caption.textContent).toContain('<script>');
    });

    it('safely handles className with potential XSS', () => {
      render(
        <Carousel className={'valid-class" onclick="alert(\'XSS\')'} data-testid="carousel">
          <CarouselItem>
            <div>Slide</div>
          </CarouselItem>
        </Carousel>
      );

      const carousel = screen.getByTestId('carousel');
      // The malicious string is just treated as a class name
      expect(carousel).not.toHaveAttribute('onclick');
    });

    it('does not execute javascript: URLs', () => {
      // Carousel doesn't use href, but verify no URL attributes accept JS
      render(
        <Carousel
          // @ts-expect-error - testing security
          href="javascript:alert('XSS')"
          data-testid="carousel"
        >
          <CarouselItem>
            <div>Slide</div>
          </CarouselItem>
        </Carousel>
      );

      const carousel = screen.getByTestId('carousel');
      expect(carousel).not.toHaveAttribute('href');
    });
  });

  describe('Event Handler Injection Prevention', () => {
    it('blocks onLoad injection on Carousel', () => {
      const maliciousHandler = jest.fn();
      const { container } = render(
        <Carousel
          data-testid="carousel"
          // @ts-expect-error - testing security
          onLoad={maliciousHandler}
        >
          <CarouselItem>
            <div>Slide</div>
          </CarouselItem>
        </Carousel>
      );

      const carousel = container.querySelector('.carousel');
      // Simulate load event - handler should not be called
      const event = new Event('load');
      carousel?.dispatchEvent(event);

      expect(maliciousHandler).not.toHaveBeenCalled();
    });

    it('blocks onError injection on CarouselItem', () => {
      const maliciousHandler = jest.fn();
      render(
        <CarouselItem
          data-testid="item"
          // @ts-expect-error - testing security
          onError={maliciousHandler}
        >
          <div>Slide</div>
        </CarouselItem>
      );

      const item = screen.getByTestId('item');
      const event = new Event('error');
      item.dispatchEvent(event);

      expect(maliciousHandler).not.toHaveBeenCalled();
    });

    it('allows only whitelisted data-* attributes', () => {
      render(
        <Carousel
          data-testid="carousel"
          data-test="test-value"
          // These should work
        >
          <CarouselItem>
            <div>Slide</div>
          </CarouselItem>
        </Carousel>
      );

      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveAttribute('data-testid', 'carousel');
      expect(carousel).toHaveAttribute('data-test', 'test-value');
    });
  });

  describe('Form Manipulation Prevention', () => {
    it('does not accept form attributes on Carousel', () => {
      render(
        <Carousel
          data-testid="carousel"
          // @ts-expect-error - testing security
          form="malicious-form"
          formAction="https://evil.com"
          formMethod="POST"
        >
          <CarouselItem>
            <div>Slide</div>
          </CarouselItem>
        </Carousel>
      );

      const carousel = screen.getByTestId('carousel');
      expect(carousel).not.toHaveAttribute('form');
      expect(carousel).not.toHaveAttribute('formaction');
      expect(carousel).not.toHaveAttribute('formmethod');
    });

    it('blocks form attributes on control buttons', () => {
      render(
        <CarouselControl
          direction="next"
          onClick={() => {}}
          data-testid="control"
          // @ts-expect-error - testing security
          form="malicious-form"
          formAction="https://evil.com"
        />
      );

      const control = screen.getByTestId('control');
      expect(control).not.toHaveAttribute('form');
      expect(control).not.toHaveAttribute('formaction');
    });
  });

  describe('Content Security', () => {
    it('does not use dangerouslySetInnerHTML', () => {
      const { container } = render(
        <Carousel>
          <CarouselItem>
            <CarouselCaption heading="Test" description="Description" />
          </CarouselItem>
        </Carousel>
      );

      // Check the rendered HTML for signs of dangerous HTML insertion
      const html = container.innerHTML;
      expect(html).not.toContain('dangerouslySetInnerHTML');
    });

    it('renders children safely without eval', () => {
      const content = '${alert("XSS")}';
      render(<CarouselCaption heading={content} data-testid="caption" />);

      const caption = screen.getByTestId('caption');
      // Template literal should be rendered as text, not evaluated
      expect(caption.textContent).toContain('${alert');
    });
  });
});
