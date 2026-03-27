import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Display, Heading, Text, Typography } from './Typography';

import type { DisplaySize, HeadingLevel, TextVariant } from './Typography.types';

describe('Typography', () => {
  // ===========================================================================
  // Heading Component
  // ===========================================================================
  describe('Heading', () => {
    describe('Rendering', () => {
      it('renders without crashing', () => {
        render(<Heading level={1}>Test Heading</Heading>);
        expect(screen.getByRole('heading')).toBeInTheDocument();
      });

      it('renders children correctly', () => {
        render(<Heading level={1}>Page Title</Heading>);
        expect(screen.getByText('Page Title')).toBeInTheDocument();
      });

      it('renders complex children', () => {
        render(
          <Heading level={1}>
            <span>Icon</span> Title
          </Heading>
        );
        expect(screen.getByText('Icon')).toBeInTheDocument();
        expect(screen.getByText(/Title/)).toBeInTheDocument();
      });
    });

    describe('Semantic Levels', () => {
      const levels: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

      levels.forEach((level) => {
        it(`renders h${level} element for level=${level}`, () => {
          render(<Heading level={level}>Heading {level}</Heading>);
          const heading = screen.getByRole('heading', { level });
          expect(heading).toBeInTheDocument();
          expect(heading.tagName).toBe(`H${level}`);
        });
      });

      it('defaults to level 1', () => {
        render(<Heading>Default Heading</Heading>);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
      });
    });

    describe('Visual Size Override', () => {
      it('applies visual size class when different from semantic level', () => {
        render(
          <Heading level={2} visualSize="h4">
            Visual h4
          </Heading>
        );
        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading.tagName).toBe('H2'); // Semantic is h2
        expect(heading).toHaveClass('h4'); // Visual is h4
      });

      it('does not apply class when visualSize matches level', () => {
        render(
          <Heading level={2} visualSize="h2">
            Same size
          </Heading>
        );
        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).not.toHaveClass('h2');
      });

      it('does not apply class when visualSize is undefined', () => {
        render(<Heading level={3}>No override</Heading>);
        const heading = screen.getByRole('heading', { level: 3 });
        expect(heading).not.toHaveClass('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
      });
    });

    describe('Color', () => {
      it('applies text-primary class', () => {
        render(
          <Heading level={1} color="primary">
            Primary
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-primary');
      });

      it('applies text-muted class', () => {
        render(
          <Heading level={1} color="muted">
            Muted
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-muted');
      });

      it('handles body-secondary color', () => {
        render(
          <Heading level={1} color="body-secondary">
            Body Secondary
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-body-secondary');
      });

      it('handles body-tertiary color', () => {
        render(
          <Heading level={1} color="body-tertiary">
            Body Tertiary
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-body-tertiary');
      });
    });

    describe('Alignment', () => {
      it('applies text-start class', () => {
        render(
          <Heading level={1} align="start">
            Start
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-start');
      });

      it('applies text-center class', () => {
        render(
          <Heading level={1} align="center">
            Center
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-center');
      });

      it('applies text-end class', () => {
        render(
          <Heading level={1} align="end">
            End
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-end');
      });
    });

    describe('Font Weight', () => {
      it('applies fw-light class', () => {
        render(
          <Heading level={1} weight="light">
            Light
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('fw-light');
      });

      it('applies fw-semibold class', () => {
        render(
          <Heading level={1} weight="semibold">
            Semibold
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('fw-semibold');
      });

      it('applies fw-bold class', () => {
        render(
          <Heading level={1} weight="bold">
            Bold
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('fw-bold');
      });
    });

    describe('Text Transform', () => {
      it('applies text-uppercase class', () => {
        render(
          <Heading level={1} transform="uppercase">
            Uppercase
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-uppercase');
      });

      it('applies text-lowercase class', () => {
        render(
          <Heading level={1} transform="lowercase">
            Lowercase
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-lowercase');
      });

      it('applies text-capitalize class', () => {
        render(
          <Heading level={1} transform="capitalize">
            Capitalize
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-capitalize');
      });

      it('does not apply class for transform="none"', () => {
        render(
          <Heading level={1} transform="none">
            None
          </Heading>
        );
        const heading = screen.getByRole('heading');
        expect(heading).not.toHaveClass('text-none');
        expect(heading).not.toHaveClass('text-uppercase');
      });
    });

    describe('Margin', () => {
      it('applies mb-0 class when noMargin is true', () => {
        render(
          <Heading level={1} noMargin>
            No Margin
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('mb-0');
      });

      it('does not apply mb-0 class by default', () => {
        render(<Heading level={1}>With Margin</Heading>);
        expect(screen.getByRole('heading')).not.toHaveClass('mb-0');
      });
    });

    describe('Truncation', () => {
      it('applies text-truncate class when truncate is true', () => {
        render(
          <Heading level={1} truncate>
            Very long heading text that should be truncated
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-truncate');
      });

      it('does not apply text-truncate class by default', () => {
        render(<Heading level={1}>Normal heading</Heading>);
        expect(screen.getByRole('heading')).not.toHaveClass('text-truncate');
      });
    });

    describe('Custom Styling', () => {
      it('accepts custom className', () => {
        render(
          <Heading level={1} className="custom-heading">
            Custom
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveClass('custom-heading');
      });

      it('accepts inline styles', () => {
        render(
          <Heading level={1} style={{ marginTop: '10px' }}>
            Styled
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveStyle({ marginTop: '10px' });
      });
    });

    describe('HTML Attributes', () => {
      it('accepts id attribute', () => {
        render(
          <Heading level={1} id="page-title">
            Title
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveAttribute('id', 'page-title');
      });

      it('accepts data-testid attribute', () => {
        render(
          <Heading level={1} data-testid="main-heading">
            Title
          </Heading>
        );
        expect(screen.getByTestId('main-heading')).toBeInTheDocument();
      });

      it('accepts title attribute', () => {
        render(
          <Heading level={1} title="Full heading text">
            Truncated...
          </Heading>
        );
        expect(screen.getByRole('heading')).toHaveAttribute('title', 'Full heading text');
      });
    });

    describe('Ref Forwarding', () => {
      it('forwards ref to heading element', () => {
        const ref = createRef<HTMLHeadingElement>();
        render(
          <Heading level={1} ref={ref}>
            With Ref
          </Heading>
        );
        expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
        expect(ref.current?.tagName).toBe('H1');
      });
    });

    describe('Display Name', () => {
      it('has correct displayName', () => {
        expect(Heading.displayName).toBe('Heading');
      });
    });
  });

  // ===========================================================================
  // Display Component
  // ===========================================================================
  describe('Display', () => {
    describe('Rendering', () => {
      it('renders without crashing', () => {
        render(<Display size={1}>Display Heading</Display>);
        expect(screen.getByRole('heading')).toBeInTheDocument();
      });

      it('renders children correctly', () => {
        render(<Display size={1}>Hero Title</Display>);
        expect(screen.getByText('Hero Title')).toBeInTheDocument();
      });
    });

    describe('Display Sizes', () => {
      const sizes: DisplaySize[] = [1, 2, 3, 4, 5, 6];

      sizes.forEach((size) => {
        it(`applies display-${size} class for size=${size}`, () => {
          render(<Display size={size}>Display {size}</Display>);
          expect(screen.getByRole('heading')).toHaveClass(`display-${size}`);
        });
      });

      it('defaults to size 1', () => {
        render(<Display>Default Display</Display>);
        expect(screen.getByRole('heading')).toHaveClass('display-1');
      });
    });

    describe('Semantic Level Mapping', () => {
      it('maps display-1 to h1 by default', () => {
        render(<Display size={1}>Display 1</Display>);
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      });

      it('maps display-2 to h2 by default', () => {
        render(<Display size={2}>Display 2</Display>);
        expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      });

      it('maps display-3 to h2 by default', () => {
        render(<Display size={3}>Display 3</Display>);
        expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      });

      it('maps display-4 to h3 by default', () => {
        render(<Display size={4}>Display 4</Display>);
        expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      });

      it('maps display-5 to h3 by default', () => {
        render(<Display size={5}>Display 5</Display>);
        expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      });

      it('maps display-6 to h3 by default', () => {
        render(<Display size={6}>Display 6</Display>);
        expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      });
    });

    describe('Semantic Level Override', () => {
      it('allows overriding semantic level', () => {
        render(
          <Display size={1} level={2}>
            Visual display-1, semantic h2
          </Display>
        );
        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toHaveClass('display-1');
        expect(heading.tagName).toBe('H2');
      });
    });

    describe('Color', () => {
      it('applies color classes', () => {
        render(
          <Display size={1} color="primary">
            Primary
          </Display>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-primary');
      });
    });

    describe('Alignment', () => {
      it('applies alignment classes', () => {
        render(
          <Display size={1} align="center">
            Centered
          </Display>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-center');
      });
    });

    describe('Weight', () => {
      it('applies weight classes', () => {
        render(
          <Display size={1} weight="light">
            Light
          </Display>
        );
        expect(screen.getByRole('heading')).toHaveClass('fw-light');
      });
    });

    describe('Transform', () => {
      it('applies transform classes', () => {
        render(
          <Display size={1} transform="uppercase">
            Uppercase
          </Display>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-uppercase');
      });
    });

    describe('Margin', () => {
      it('applies mb-0 class when noMargin is true', () => {
        render(
          <Display size={1} noMargin>
            No Margin
          </Display>
        );
        expect(screen.getByRole('heading')).toHaveClass('mb-0');
      });
    });

    describe('Truncation', () => {
      it('applies text-truncate class when truncate is true', () => {
        render(
          <Display size={1} truncate>
            Very long display heading that should be truncated
          </Display>
        );
        expect(screen.getByRole('heading')).toHaveClass('text-truncate');
      });

      it('does not apply text-truncate class by default', () => {
        render(<Display size={1}>Normal display</Display>);
        expect(screen.getByRole('heading')).not.toHaveClass('text-truncate');
      });
    });

    describe('Ref Forwarding', () => {
      it('forwards ref to heading element', () => {
        const ref = createRef<HTMLHeadingElement>();
        render(
          <Display size={1} ref={ref}>
            With Ref
          </Display>
        );
        expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
      });
    });

    describe('Display Name', () => {
      it('has correct displayName', () => {
        expect(Display.displayName).toBe('Display');
      });
    });
  });

  // ===========================================================================
  // Text Component
  // ===========================================================================
  describe('Text', () => {
    describe('Rendering', () => {
      it('renders without crashing', () => {
        render(<Text>Body text</Text>);
        expect(screen.getByText('Body text')).toBeInTheDocument();
      });

      it('renders as paragraph by default', () => {
        const { container } = render(<Text>Paragraph</Text>);
        expect(container.querySelector('p')).toBeInTheDocument();
      });
    });

    describe('Variants', () => {
      const variantElementMap: Record<TextVariant, string> = {
        body: 'P',
        lead: 'P',
        small: 'SMALL',
        mark: 'MARK',
        del: 'DEL',
        ins: 'INS',
        strong: 'STRONG',
        em: 'EM',
        abbr: 'ABBR',
        blockquote: 'BLOCKQUOTE',
        code: 'CODE',
        kbd: 'KBD',
        pre: 'PRE',
      };

      Object.entries(variantElementMap).forEach(([variant, tag]) => {
        it(`renders correct element for variant="${variant}"`, () => {
          const { container } = render(<Text variant={variant as TextVariant}>Content</Text>);
          expect(container.querySelector(tag.toLowerCase())).toBeInTheDocument();
        });
      });

      it('applies lead class for lead variant', () => {
        const { container } = render(<Text variant="lead">Lead paragraph</Text>);
        expect(container.querySelector('p')).toHaveClass('lead');
      });

      it('applies blockquote class for blockquote variant', () => {
        const { container } = render(<Text variant="blockquote">Quote</Text>);
        expect(container.querySelector('blockquote')).toHaveClass('blockquote');
      });
    });

    describe('Element Override', () => {
      it('allows overriding element with as prop', () => {
        const { container } = render(
          <Text as="span" variant="body">
            Inline text
          </Text>
        );
        expect(container.querySelector('span')).toBeInTheDocument();
        expect(container.querySelector('p')).not.toBeInTheDocument();
      });
    });

    describe('Size', () => {
      it('applies small class for size="sm"', () => {
        const { container } = render(<Text size="sm">Small text</Text>);
        expect(container.querySelector('p')).toHaveClass('small');
      });

      it('applies fs-5 class for size="lg"', () => {
        const { container } = render(<Text size="lg">Large text</Text>);
        expect(container.querySelector('p')).toHaveClass('fs-5');
      });

      it('does not apply size class for lead variant', () => {
        const { container } = render(
          <Text variant="lead" size="sm">
            Lead
          </Text>
        );
        expect(container.querySelector('p')).not.toHaveClass('small');
      });
    });

    describe('Color', () => {
      it('applies color classes', () => {
        const { container } = render(<Text color="muted">Muted text</Text>);
        expect(container.querySelector('p')).toHaveClass('text-muted');
      });

      it('handles body-secondary color', () => {
        const { container } = render(<Text color="body-secondary">Secondary</Text>);
        expect(container.querySelector('p')).toHaveClass('text-body-secondary');
      });

      it('handles body-tertiary color', () => {
        const { container } = render(<Text color="body-tertiary">Tertiary</Text>);
        expect(container.querySelector('p')).toHaveClass('text-body-tertiary');
      });
    });

    describe('Alignment', () => {
      it('applies alignment classes', () => {
        const { container } = render(<Text align="center">Centered</Text>);
        expect(container.querySelector('p')).toHaveClass('text-center');
      });
    });

    describe('Weight', () => {
      it('applies weight classes', () => {
        const { container } = render(<Text weight="bold">Bold text</Text>);
        expect(container.querySelector('p')).toHaveClass('fw-bold');
      });
    });

    describe('Transform', () => {
      it('applies transform classes', () => {
        const { container } = render(<Text transform="uppercase">Uppercase</Text>);
        expect(container.querySelector('p')).toHaveClass('text-uppercase');
      });
    });

    describe('Margin', () => {
      it('applies mb-0 class when noMargin is true', () => {
        const { container } = render(<Text noMargin>No margin</Text>);
        expect(container.querySelector('p')).toHaveClass('mb-0');
      });
    });

    describe('Truncation', () => {
      it('applies text-truncate class for single-line truncation', () => {
        const { container } = render(<Text truncate>Truncated text</Text>);
        expect(container.querySelector('p')).toHaveClass('text-truncate');
      });

      it('applies multi-line clamp styles', () => {
        const { container } = render(
          <Text truncate lines={3}>
            Multi-line truncated text
          </Text>
        );
        const element = container.querySelector('p');
        expect(element).toHaveStyle({ display: '-webkit-box' });
        expect(element).toHaveStyle({ WebkitLineClamp: '3' });
        expect(element).toHaveStyle({ overflow: 'hidden' });
      });

      it('does not apply text-truncate for multi-line truncation', () => {
        const { container } = render(
          <Text truncate lines={2}>
            Multi-line
          </Text>
        );
        expect(container.querySelector('p')).not.toHaveClass('text-truncate');
      });
    });

    describe('Blockquote with Citation', () => {
      it('renders figure structure with citation', () => {
        const { container } = render(
          <Text variant="blockquote" citeAuthor="Author Name" cite="https://example.com">
            Quote text
          </Text>
        );

        expect(container.querySelector('figure')).toBeInTheDocument();
        expect(container.querySelector('blockquote')).toBeInTheDocument();
        expect(container.querySelector('figcaption')).toBeInTheDocument();
        expect(container.querySelector('.blockquote-footer')).toBeInTheDocument();
      });

      it('includes cite attribute on blockquote', () => {
        const { container } = render(
          <Text variant="blockquote" cite="https://example.com">
            Quote
          </Text>
        );
        expect(container.querySelector('blockquote')).toHaveAttribute(
          'cite',
          'https://example.com'
        );
      });

      it('renders author name in figcaption', () => {
        render(
          <Text variant="blockquote" citeAuthor="John Doe">
            Quote
          </Text>
        );
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      it('renders cite element when both cite and citeAuthor provided', () => {
        const { container } = render(
          <Text variant="blockquote" citeAuthor="Author" cite="https://example.com">
            Quote
          </Text>
        );
        expect(container.querySelector('cite')).toBeInTheDocument();
        expect(container.querySelector('cite')).toHaveAttribute('title', 'https://example.com');
      });

      it('applies noMargin to figure wrapper', () => {
        const { container } = render(
          <Text variant="blockquote" citeAuthor="Author" noMargin>
            Quote
          </Text>
        );
        expect(container.querySelector('figure')).toHaveClass('mb-0');
      });
    });

    describe('Abbreviation', () => {
      it('renders abbr element with title', () => {
        const { container } = render(
          <Text variant="abbr" title="HyperText Markup Language">
            HTML
          </Text>
        );
        const abbr = container.querySelector('abbr');
        expect(abbr).toBeInTheDocument();
        expect(abbr).toHaveAttribute('title', 'HyperText Markup Language');
      });
    });

    describe('Ref Forwarding', () => {
      it('forwards ref to text element', () => {
        const ref = createRef<HTMLElement>();
        render(<Text ref={ref}>With Ref</Text>);
        expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
      });
    });

    describe('Display Name', () => {
      it('has correct displayName', () => {
        expect(Text.displayName).toBe('Text');
      });
    });
  });

  // ===========================================================================
  // Typography Namespace
  // ===========================================================================
  describe('Typography Namespace', () => {
    it('exposes Heading component', () => {
      render(<Typography.Heading level={1}>Namespace Heading</Typography.Heading>);
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('exposes Display component', () => {
      render(<Typography.Display size={1}>Namespace Display</Typography.Display>);
      expect(screen.getByRole('heading')).toHaveClass('display-1');
    });

    it('exposes Text component', () => {
      render(<Typography.Text>Namespace Text</Typography.Text>);
      expect(screen.getByText('Namespace Text')).toBeInTheDocument();
    });
  });

  describe('Type Safety', () => {
    it('namespace components accept ref prop', () => {
      const headingRef = createRef<HTMLHeadingElement>();
      const displayRef = createRef<HTMLHeadingElement>();
      const textRef = createRef<HTMLElement>();

      render(
        <>
          <Typography.Heading level={1} ref={headingRef}>H</Typography.Heading>
          <Typography.Display size={1} ref={displayRef}>D</Typography.Display>
          <Typography.Text ref={textRef}>T</Typography.Text>
        </>
      );

      expect(headingRef.current).toBeInstanceOf(HTMLHeadingElement);
      expect(displayRef.current).toBeInstanceOf(HTMLHeadingElement);
      expect(textRef.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });
});
