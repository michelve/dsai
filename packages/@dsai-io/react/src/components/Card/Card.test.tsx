import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImage,
  CardImgOverlay,
  CardLink,
  CardText,
  CardTitle,
} from './Card';

expect.extend(toHaveNoViolations);

describe('Card', () => {
  // ===========================================================================
  // Basic Rendering
  // ===========================================================================
  describe('Basic Rendering', () => {
    it('renders card with children', () => {
      render(
        <Card>
          <CardBody>Card content</CardBody>
        </Card>
      );

      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders as article by default', () => {
      render(
        <Card>
          <CardBody>Content</CardBody>
        </Card>
      );

      expect(screen.getByRole('article')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Variants
  // ===========================================================================
  describe('Variants', () => {
    it('renders elevated variant with shadow', () => {
      const { container } = render(
        <Card variant="elevated">
          <CardBody>Elevated</CardBody>
        </Card>
      );

      expect(container.querySelector('.shadow-sm')).toBeInTheDocument();
    });

    it('renders outlined variant with border', () => {
      const { container } = render(
        <Card variant="outlined">
          <CardBody>Outlined</CardBody>
        </Card>
      );

      expect(container.querySelector('.border')).toBeInTheDocument();
    });

    it('renders ghost variant without background', () => {
      const { container } = render(
        <Card variant="ghost">
          <CardBody>Ghost</CardBody>
        </Card>
      );

      expect(container.querySelector('.bg-transparent')).toBeInTheDocument();
      expect(container.querySelector('.border-0')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Color Variants
  // ===========================================================================
  describe('Color Variants', () => {
    it('renders with color variant', () => {
      const { container } = render(
        <Card color="primary">
          <CardBody>Primary Card</CardBody>
        </Card>
      );

      expect(container.querySelector('.text-bg-primary')).toBeInTheDocument();
    });

    it('renders all color variants', () => {
      const colors = [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
      ] as const;

      colors.forEach((color) => {
        const { container } = render(
          <Card color={color}>
            <CardBody>{color}</CardBody>
          </Card>
        );

        expect(container.querySelector(`.text-bg-${color}`)).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Interactive Cards
  // ===========================================================================
  describe('Interactive Cards', () => {
    it('renders as link when href provided', () => {
      render(
        <Card href="/test">
          <CardBody>Link Card</CardBody>
        </Card>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('renders as clickable when onClick provided', () => {
      const handleClick = jest.fn();
      render(
        <Card onClick={handleClick}>
          <CardBody>Clickable Card</CardBody>
        </Card>
      );

      const card = screen.getByRole('button');
      expect(card).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn();
      render(
        <Card onClick={handleClick}>
          <CardBody>Clickable</CardBody>
        </Card>
      );

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalled();
    });

    it('calls onClick on Enter key', () => {
      const handleClick = jest.fn();
      render(
        <Card onClick={handleClick}>
          <CardBody>Clickable</CardBody>
        </Card>
      );

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });

      expect(handleClick).toHaveBeenCalled();
    });

    it('calls onClick on Space key', () => {
      const handleClick = jest.fn();
      render(
        <Card onClick={handleClick}>
          <CardBody>Clickable</CardBody>
        </Card>
      );

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ' });

      expect(handleClick).toHaveBeenCalled();
    });

    it('uses custom link component when provided', () => {
      const CustomLink = ({
        href,
        children,
        ...props
      }: {
        href: string;
        children: React.ReactNode;
      }): React.JSX.Element => (
        <a href={href} data-testid="custom-link" {...props}>
          {children}
        </a>
      );

      render(
        <Card href="/test" linkAs={CustomLink}>
          <CardBody>Custom Link</CardBody>
        </Card>
      );

      expect(screen.getByTestId('custom-link')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Horizontal Layout
  // ===========================================================================
  describe('Horizontal Layout', () => {
    it('renders horizontal layout', () => {
      const { container } = render(
        <Card horizontal>
          <CardImage src="test.jpg" alt="Test" />
          <CardBody>Content</CardBody>
        </Card>
      );

      expect(container.querySelector('.flex-row')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Subcomponents
  // ===========================================================================
  describe('Subcomponents', () => {
    describe('CardHeader', () => {
      it('renders header', () => {
        render(
          <Card>
            <CardHeader>Header Content</CardHeader>
          </Card>
        );

        expect(screen.getByText('Header Content')).toBeInTheDocument();
        expect(screen.getByText('Header Content').closest('div')).toHaveClass('card-header');
      });
    });

    describe('CardBody', () => {
      it('renders body', () => {
        render(
          <Card>
            <CardBody>Body Content</CardBody>
          </Card>
        );

        expect(screen.getByText('Body Content')).toBeInTheDocument();
        expect(screen.getByText('Body Content').closest('div')).toHaveClass('card-body');
      });
    });

    describe('CardFooter', () => {
      it('renders footer', () => {
        render(
          <Card>
            <CardFooter>Footer Content</CardFooter>
          </Card>
        );

        expect(screen.getByText('Footer Content')).toBeInTheDocument();
        expect(screen.getByText('Footer Content').closest('div')).toHaveClass('card-footer');
      });
    });

    describe('CardImage', () => {
      it('renders image with alt text', () => {
        render(
          <Card>
            <CardImage src="test.jpg" alt="Test image" />
          </Card>
        );

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'test.jpg');
        expect(img).toHaveAttribute('alt', 'Test image');
      });

      it('renders top position by default', () => {
        render(
          <Card>
            <CardImage src="test.jpg" alt="Test" />
          </Card>
        );

        expect(screen.getByRole('img')).toHaveClass('card-img-top');
      });

      it('renders bottom position', () => {
        render(
          <Card>
            <CardImage src="test.jpg" alt="Test" position="bottom" />
          </Card>
        );

        expect(screen.getByRole('img')).toHaveClass('card-img-bottom');
      });

      it('renders overlay position', () => {
        render(
          <Card>
            <CardImage src="test.jpg" alt="Test" position="overlay" />
          </Card>
        );

        expect(screen.getByRole('img')).toHaveClass('card-img');
      });

      it('uses lazy loading by default', () => {
        render(
          <Card>
            <CardImage src="test.jpg" alt="Test" />
          </Card>
        );

        expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
      });
    });

    describe('CardTitle', () => {
      it('renders as h5 by default', () => {
        render(
          <Card>
            <CardBody>
              <CardTitle>Title</CardTitle>
            </CardBody>
          </Card>
        );

        expect(screen.getByRole('heading', { level: 5 })).toBeInTheDocument();
        expect(screen.getByText('Title')).toHaveClass('card-title');
      });

      it('renders as custom heading level', () => {
        render(
          <Card>
            <CardBody>
              <CardTitle as="h3">Title</CardTitle>
            </CardBody>
          </Card>
        );

        expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      });
    });

    describe('CardText', () => {
      it('renders text', () => {
        render(
          <Card>
            <CardBody>
              <CardText>Text content</CardText>
            </CardBody>
          </Card>
        );

        expect(screen.getByText('Text content')).toHaveClass('card-text');
      });

      it('renders muted text', () => {
        render(
          <Card>
            <CardBody>
              <CardText muted>Muted text</CardText>
            </CardBody>
          </Card>
        );

        expect(screen.getByText('Muted text')).toHaveClass('text-body-secondary');
      });
    });

    describe('CardLink', () => {
      it('renders link', () => {
        render(
          <Card>
            <CardBody>
              <CardLink href="/test">Link</CardLink>
            </CardBody>
          </Card>
        );

        const link = screen.getByRole('link', { name: 'Link' });
        expect(link).toHaveAttribute('href', '/test');
        expect(link).toHaveClass('card-link');
      });
    });

    describe('CardImgOverlay', () => {
      it('renders overlay', () => {
        render(
          <Card>
            <CardImage src="test.jpg" alt="Test" position="overlay" />
            <CardImgOverlay>Overlay Content</CardImgOverlay>
          </Card>
        );

        expect(screen.getByText('Overlay Content').closest('div')).toHaveClass('card-img-overlay');
      });
    });
  });

  // ===========================================================================
  // Composition
  // ===========================================================================
  describe('Composition', () => {
    it('renders full card composition', () => {
      render(
        <Card>
          <CardHeader>Header</CardHeader>
          <CardImage src="test.jpg" alt="Test" />
          <CardBody>
            <CardTitle>Title</CardTitle>
            <CardText>Description</CardText>
            <CardLink href="/test">Learn more</CardLink>
          </CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================
  describe('Ref Forwarding', () => {
    it('forwards ref to Card', () => {
      const ref = createRef<HTMLElement>();
      render(
        <Card ref={ref}>
          <CardBody>Content</CardBody>
        </Card>
      );
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('forwards ref to CardHeader', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Card>
          <CardHeader ref={ref}>Header</CardHeader>
        </Card>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref to CardBody', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Card>
          <CardBody ref={ref}>Body</CardBody>
        </Card>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref to CardFooter', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Card>
          <CardFooter ref={ref}>Footer</CardFooter>
        </Card>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref to CardImage', () => {
      const ref = createRef<HTMLImageElement>();
      render(
        <Card>
          <CardImage ref={ref} src="test.jpg" alt="Test" />
        </Card>
      );
      expect(ref.current).toBeInstanceOf(HTMLImageElement);
    });
  });

  // ===========================================================================
  // Custom Styling
  // ===========================================================================
  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <Card className="custom-class">
          <CardBody>Content</CardBody>
        </Card>
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('accepts inline styles', () => {
      const { container } = render(
        <Card style={{ marginTop: '10px' }}>
          <CardBody>Content</CardBody>
        </Card>
      );

      expect(container.querySelector('.card')).toHaveStyle({ marginTop: '10px' });
    });

    it('accepts custom id', () => {
      render(
        <Card id="my-card">
          <CardBody>Content</CardBody>
        </Card>
      );

      expect(document.getElementById('my-card')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Accessibility (WCAG 2.2 AA)
  // ===========================================================================
  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Card>
          <CardBody>
            <CardTitle>Title</CardTitle>
            <CardText>Content</CardText>
          </CardBody>
        </Card>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with image', async () => {
      const { container } = render(
        <Card>
          <CardImage src="test.jpg" alt="Test image description" />
          <CardBody>
            <CardTitle>Title</CardTitle>
          </CardBody>
        </Card>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when interactive', async () => {
      const { container } = render(
        <Card onClick={jest.fn()} aria-label="Clickable card">
          <CardBody>
            <CardTitle>Title</CardTitle>
          </CardBody>
        </Card>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('accepts aria-label', () => {
      render(
        <Card aria-label="Card description">
          <CardBody>Content</CardBody>
        </Card>
      );

      expect(screen.getByRole('article')).toHaveAttribute('aria-label', 'Card description');
    });

    it('accepts aria-labelledby', () => {
      render(
        <>
          <h2 id="card-title">Card Title</h2>
          <Card aria-labelledby="card-title">
            <CardBody>Content</CardBody>
          </Card>
        </>
      );

      expect(screen.getByRole('article')).toHaveAttribute('aria-labelledby', 'card-title');
    });
  });

  // ===========================================================================
  // Display Names
  // ===========================================================================
  describe('Display Names', () => {
    it('Card has correct displayName', () => {
      expect(Card.displayName).toBe('Card');
    });

    it('CardHeader has correct displayName', () => {
      expect(CardHeader.displayName).toBe('CardHeader');
    });

    it('CardBody has correct displayName', () => {
      expect(CardBody.displayName).toBe('CardBody');
    });

    it('CardFooter has correct displayName', () => {
      expect(CardFooter.displayName).toBe('CardFooter');
    });

    it('CardImage has correct displayName', () => {
      expect(CardImage.displayName).toBe('CardImage');
    });

    it('CardTitle has correct displayName', () => {
      expect(CardTitle.displayName).toBe('CardTitle');
    });

    it('CardText has correct displayName', () => {
      expect(CardText.displayName).toBe('CardText');
    });

    it('CardLink has correct displayName', () => {
      expect(CardLink.displayName).toBe('CardLink');
    });

    it('CardImgOverlay has correct displayName', () => {
      expect(CardImgOverlay.displayName).toBe('CardImgOverlay');
    });
  });
});
