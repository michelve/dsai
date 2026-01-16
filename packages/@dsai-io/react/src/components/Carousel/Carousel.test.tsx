import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Carousel } from './Carousel';
import { CarouselCaption } from './CarouselCaption';
import { CarouselItem } from './CarouselItem';

describe('Carousel', () => {
  // Helper to create slide content
  const renderBasicCarousel = (props = {}) => {
    return render(
      <Carousel data-testid="carousel" {...props}>
        <CarouselItem data-testid="slide-1">
          <div>Slide 1 Content</div>
        </CarouselItem>
        <CarouselItem data-testid="slide-2">
          <div>Slide 2 Content</div>
        </CarouselItem>
        <CarouselItem data-testid="slide-3">
          <div>Slide 3 Content</div>
        </CarouselItem>
      </Carousel>
    );
  };

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderBasicCarousel();
      expect(screen.getByTestId('carousel')).toBeInTheDocument();
    });

    it('renders all slides', () => {
      renderBasicCarousel();
      expect(screen.getByTestId('slide-1')).toBeInTheDocument();
      expect(screen.getByTestId('slide-2')).toBeInTheDocument();
      expect(screen.getByTestId('slide-3')).toBeInTheDocument();
    });

    it('renders with correct Bootstrap classes', () => {
      renderBasicCarousel();
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveClass('carousel', 'slide');
    });

    it('renders fade animation variant', () => {
      renderBasicCarousel({ animation: 'fade' });
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveClass('carousel', 'carousel-fade');
    });

    it('renders dark variant', () => {
      renderBasicCarousel({ dark: true });
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveClass('carousel-dark');
    });

    it('applies custom className', () => {
      renderBasicCarousel({ className: 'custom-carousel' });
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveClass('custom-carousel');
    });

    it('applies custom style', () => {
      renderBasicCarousel({ style: { maxWidth: '500px' } });
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveStyle({ maxWidth: '500px' });
    });

    it('renders with custom id', () => {
      renderBasicCarousel({ id: 'my-carousel' });
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveAttribute('id', 'my-carousel');
    });
  });

  describe('Controls', () => {
    it('renders prev/next controls by default', () => {
      renderBasicCarousel();
      expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
      expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
    });

    it('hides controls when controls=false', () => {
      renderBasicCarousel({ controls: false });
      expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument();
    });

    it('navigates to next slide on next click', async () => {
      const onSelect = jest.fn();
      renderBasicCarousel({ onSelect });

      const nextButton = screen.getByLabelText('Next slide');
      await userEvent.click(nextButton);

      expect(onSelect).toHaveBeenCalledWith(1);
    });

    it('navigates to previous slide on prev click', async () => {
      const onSelect = jest.fn();
      renderBasicCarousel({ defaultActiveIndex: 1, onSelect });

      const prevButton = screen.getByLabelText('Previous slide');
      await userEvent.click(prevButton);

      expect(onSelect).toHaveBeenCalledWith(0);
    });

    it('disables prev control at first slide when wrap=false', () => {
      renderBasicCarousel({ wrap: false });
      const prevButton = screen.getByLabelText('Previous slide');
      expect(prevButton).toBeDisabled();
    });

    it('disables next control at last slide when wrap=false', () => {
      renderBasicCarousel({ defaultActiveIndex: 2, wrap: false });
      const nextButton = screen.getByLabelText('Next slide');
      expect(nextButton).toBeDisabled();
    });

    it('wraps from last to first slide by default', async () => {
      const onSelect = jest.fn();
      renderBasicCarousel({ defaultActiveIndex: 2, onSelect });

      const nextButton = screen.getByLabelText('Next slide');
      await userEvent.click(nextButton);

      expect(onSelect).toHaveBeenCalledWith(0);
    });
  });

  describe('Indicators', () => {
    it('renders indicators by default', () => {
      renderBasicCarousel();
      const indicators = screen
        .getAllByRole('button')
        .filter(
          (btn) => btn.classList.contains('active') || btn.getAttribute('data-bs-slide-to') !== null
        );
      // 3 slides + 2 controls = at least 3 indicator buttons
      expect(indicators.length).toBeGreaterThanOrEqual(3);
    });

    it('hides indicators when indicators=false', () => {
      renderBasicCarousel({ indicators: false });
      // Should only have control buttons, not indicator buttons
      const allButtons = screen.getAllByRole('button');
      const indicatorButtons = allButtons.filter(
        (btn) => btn.getAttribute('data-bs-slide-to') !== null
      );
      expect(indicatorButtons).toHaveLength(0);
    });

    it('navigates to slide on indicator click', async () => {
      const onSelect = jest.fn();
      renderBasicCarousel({ onSelect });

      const indicator = screen.getByLabelText('Slide 3');
      await userEvent.click(indicator);

      expect(onSelect).toHaveBeenCalledWith(2);
    });

    it('uses custom slide labels for indicators', () => {
      renderBasicCarousel({ slideLabels: ['Intro', 'Features', 'Contact'] });
      expect(screen.getByLabelText('Intro')).toBeInTheDocument();
      expect(screen.getByLabelText('Features')).toBeInTheDocument();
      expect(screen.getByLabelText('Contact')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates with arrow keys', async () => {
      const onSelect = jest.fn();
      renderBasicCarousel({ onSelect });

      const carousel = screen.getByTestId('carousel');
      carousel.focus();

      await userEvent.keyboard('{ArrowRight}');
      expect(onSelect).toHaveBeenCalledWith(1);

      await userEvent.keyboard('{ArrowLeft}');
      expect(onSelect).toHaveBeenCalledWith(0);
    });

    it('disables keyboard navigation when keyboard=false', async () => {
      const onSelect = jest.fn();
      renderBasicCarousel({ keyboard: false, onSelect });

      const carousel = screen.getByTestId('carousel');
      carousel.focus();

      await userEvent.keyboard('{ArrowRight}');
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('has tabIndex for keyboard focus', () => {
      renderBasicCarousel();
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveAttribute('tabIndex', '0');
    });

    it('removes tabIndex when keyboard=false', () => {
      renderBasicCarousel({ keyboard: false });
      const carousel = screen.getByTestId('carousel');
      expect(carousel).not.toHaveAttribute('tabIndex');
    });
  });

  describe('Controlled Mode', () => {
    it('respects controlled activeIndex', () => {
      const { rerender } = render(
        <Carousel activeIndex={1} data-testid="carousel">
          <CarouselItem data-testid="slide-1">
            <div>1</div>
          </CarouselItem>
          <CarouselItem data-testid="slide-2">
            <div>2</div>
          </CarouselItem>
          <CarouselItem data-testid="slide-3">
            <div>3</div>
          </CarouselItem>
        </Carousel>
      );

      const slide2 = screen.getByTestId('slide-2');
      expect(slide2).toHaveClass('active');

      rerender(
        <Carousel activeIndex={2} data-testid="carousel">
          <CarouselItem data-testid="slide-1">
            <div>1</div>
          </CarouselItem>
          <CarouselItem data-testid="slide-2">
            <div>2</div>
          </CarouselItem>
          <CarouselItem data-testid="slide-3">
            <div>3</div>
          </CarouselItem>
        </Carousel>
      );

      const slide3 = screen.getByTestId('slide-3');
      expect(slide3).toHaveClass('active');
    });

    it('calls onSelect when slide changes', async () => {
      const onSelect = jest.fn();
      render(
        <Carousel activeIndex={0} onSelect={onSelect} data-testid="carousel">
          <CarouselItem>
            <div>1</div>
          </CarouselItem>
          <CarouselItem>
            <div>2</div>
          </CarouselItem>
        </Carousel>
      );

      await userEvent.click(screen.getByLabelText('Next slide'));
      expect(onSelect).toHaveBeenCalledWith(1);
    });
  });

  describe('Uncontrolled Mode', () => {
    it('uses defaultActiveIndex', () => {
      renderBasicCarousel({ defaultActiveIndex: 1 });
      const slide2 = screen.getByTestId('slide-2');
      expect(slide2).toHaveClass('active');
    });
  });

  describe('Autoplay', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('shows pause button when autoPlay is enabled', () => {
      renderBasicCarousel({ autoPlay: true });
      expect(screen.getByLabelText('Pause carousel')).toBeInTheDocument();
    });

    it('hides pause button when autoPlay is disabled', () => {
      renderBasicCarousel({ autoPlay: false });
      expect(screen.queryByLabelText('Pause carousel')).not.toBeInTheDocument();
    });

    it('toggles pause state on button click', () => {
      renderBasicCarousel({ autoPlay: true });

      const pauseButton = screen.getByLabelText('Pause carousel');
      fireEvent.click(pauseButton);

      expect(screen.getByLabelText('Play carousel')).toBeInTheDocument();
    });

    it('auto-advances slides at interval', () => {
      const onSelect = jest.fn();
      renderBasicCarousel({ autoPlay: true, interval: 1000, onSelect });

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(onSelect).toHaveBeenCalledWith(1);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(onSelect).toHaveBeenCalledWith(2);
    });

    it('pauses on hover when pauseOnHover=true', async () => {
      const onSelect = jest.fn();
      renderBasicCarousel({ autoPlay: true, interval: 1000, pauseOnHover: true, onSelect });

      const carousel = screen.getByTestId('carousel');
      fireEvent.mouseEnter(carousel);

      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('resumes on mouse leave', async () => {
      const onSelect = jest.fn();
      renderBasicCarousel({ autoPlay: true, interval: 1000, pauseOnHover: true, onSelect });

      const carousel = screen.getByTestId('carousel');
      fireEvent.mouseEnter(carousel);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      fireEvent.mouseLeave(carousel);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(onSelect).toHaveBeenCalled();
    });
  });

  describe('Touch/Swipe', () => {
    it('navigates on swipe left', () => {
      const onSelect = jest.fn();
      renderBasicCarousel({ touch: true, onSelect });

      const carousel = screen.getByTestId('carousel');

      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 200, clientY: 100 }],
      });
      fireEvent.touchEnd(carousel, {
        changedTouches: [{ clientX: 50, clientY: 100 }],
      });

      expect(onSelect).toHaveBeenCalledWith(1);
    });

    it('navigates on swipe right', () => {
      const onSelect = jest.fn();
      renderBasicCarousel({ touch: true, defaultActiveIndex: 1, onSelect });

      const carousel = screen.getByTestId('carousel');

      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 50, clientY: 100 }],
      });
      fireEvent.touchEnd(carousel, {
        changedTouches: [{ clientX: 200, clientY: 100 }],
      });

      expect(onSelect).toHaveBeenCalledWith(0);
    });

    it('ignores swipe when touch=false', () => {
      const onSelect = jest.fn();
      renderBasicCarousel({ touch: false, onSelect });

      const carousel = screen.getByTestId('carousel');

      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 200, clientY: 100 }],
      });
      fireEvent.touchEnd(carousel, {
        changedTouches: [{ clientX: 50, clientY: 100 }],
      });

      expect(onSelect).not.toHaveBeenCalled();
    });

    it('ignores small swipes below threshold', () => {
      const onSelect = jest.fn();
      renderBasicCarousel({ touch: true, swipeThreshold: 100, onSelect });

      const carousel = screen.getByTestId('carousel');

      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 200, clientY: 100 }],
      });
      fireEvent.touchEnd(carousel, {
        changedTouches: [{ clientX: 150, clientY: 100 }],
      });

      expect(onSelect).not.toHaveBeenCalled();
    });
  });
});

describe('CarouselItem', () => {
  it('renders with carousel-item class', () => {
    render(
      <CarouselItem data-testid="item">
        <div>Content</div>
      </CarouselItem>
    );

    expect(screen.getByTestId('item')).toHaveClass('carousel-item');
  });

  it('renders children', () => {
    render(
      <CarouselItem>
        <div data-testid="content">Content</div>
      </CarouselItem>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <CarouselItem className="custom-item" data-testid="item">
        <div>Content</div>
      </CarouselItem>
    );

    expect(screen.getByTestId('item')).toHaveClass('custom-item');
  });

  it('sets data-bs-interval for custom interval', () => {
    render(
      <CarouselItem interval={3000} data-testid="item">
        <div>Content</div>
      </CarouselItem>
    );

    expect(screen.getByTestId('item')).toHaveAttribute('data-bs-interval', '3000');
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <CarouselItem ref={ref}>
        <div>Content</div>
      </CarouselItem>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CarouselCaption', () => {
  it('renders heading and description', () => {
    render(
      <CarouselCaption heading="Test Title" description="Test description" data-testid="caption" />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders with carousel-caption class', () => {
    render(<CarouselCaption heading="Title" data-testid="caption" />);

    expect(screen.getByTestId('caption')).toHaveClass('carousel-caption');
  });

  it('returns null when no content', () => {
    const { container } = render(<CarouselCaption />);
    expect(container.firstChild).toBeNull();
  });

  it('renders heading only', () => {
    render(<CarouselCaption heading="Only Title" data-testid="caption" />);

    expect(screen.getByText('Only Title')).toBeInTheDocument();
  });

  it('renders description only', () => {
    render(<CarouselCaption description="Only Description" data-testid="caption" />);

    expect(screen.getByText('Only Description')).toBeInTheDocument();
  });
});
