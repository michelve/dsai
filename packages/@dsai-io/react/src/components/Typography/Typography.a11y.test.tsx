import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Display, Heading, Text, Typography } from './Typography';

expect.extend(toHaveNoViolations);

/**
 * Typography Accessibility Tests (WCAG 2.2 AA)
 *
 * These tests verify the Typography components meet accessibility requirements:
 * - Proper semantic HTML elements
 * - Correct heading hierarchy
 * - Screen reader support
 * - Blockquote and abbreviation semantics
 */
describe('Typography Accessibility (WCAG 2.2 AA)', () => {
  // ===========================================================================
  // Heading Accessibility
  // ===========================================================================
  describe('Heading', () => {
    describe('Axe Violations', () => {
      it('has no accessibility violations for basic heading', async () => {
        const { container } = render(<Heading level={1}>Page Title</Heading>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no violations for all heading levels', async () => {
        const { container } = render(
          <>
            <Heading level={1}>Heading 1</Heading>
            <Heading level={2}>Heading 2</Heading>
            <Heading level={3}>Heading 3</Heading>
            <Heading level={4}>Heading 4</Heading>
            <Heading level={5}>Heading 5</Heading>
            <Heading level={6}>Heading 6</Heading>
          </>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no violations with visual size override', async () => {
        const { container } = render(
          <Heading level={2} visualSize="h4">
            Semantic h2, Visual h4
          </Heading>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no violations with styling props', async () => {
        const { container } = render(
          <Heading level={1} color="primary" align="center" weight="bold">
            Styled Heading
          </Heading>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    describe('Semantic Structure', () => {
      it('renders correct semantic element regardless of visual size', () => {
        render(
          <Heading level={2} visualSize="h5">
            Content
          </Heading>
        );
        // Should be findable as h2, not h5
        expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      });

      it('maintains document outline with proper heading levels', () => {
        render(
          <article>
            <Heading level={1}>Article Title</Heading>
            <Heading level={2}>Section 1</Heading>
            <Heading level={3}>Subsection 1.1</Heading>
            <Heading level={2}>Section 2</Heading>
          </article>
        );

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Article Title');
        expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Subsection 1.1');
      });
    });
  });

  // ===========================================================================
  // Display Accessibility
  // ===========================================================================
  describe('Display', () => {
    describe('Axe Violations', () => {
      it('has no accessibility violations', async () => {
        const { container } = render(<Display size={1}>Hero Title</Display>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no violations for all display sizes', async () => {
        const { container } = render(
          <>
            <Display size={1}>Display 1</Display>
            <Display size={2}>Display 2</Display>
            <Display size={3}>Display 3</Display>
            <Display size={4}>Display 4</Display>
            <Display size={5}>Display 5</Display>
            <Display size={6}>Display 6</Display>
          </>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no violations with semantic level override', async () => {
        const { container } = render(
          <Display size={1} level={2}>
            Display 1 as h2
          </Display>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    describe('Semantic Mapping', () => {
      it('maps display sizes to appropriate heading levels', () => {
        const { rerender } = render(<Display size={1}>Display 1</Display>);
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

        rerender(<Display size={2}>Display 2</Display>);
        expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();

        rerender(<Display size={4}>Display 4</Display>);
        expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      });

      it('allows semantic level override for document outline control', () => {
        render(
          <Display size={1} level={2}>
            Big Visual, h2 Semantic
          </Display>
        );
        expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Text Accessibility
  // ===========================================================================
  describe('Text', () => {
    describe('Axe Violations', () => {
      it('has no accessibility violations for body text', async () => {
        const { container } = render(<Text>Body paragraph content.</Text>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no violations for lead text', async () => {
        const { container } = render(<Text variant="lead">Lead paragraph content.</Text>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no violations for inline variants', async () => {
        const { container } = render(
          <p>
            <Text as="span" variant="strong">
              Bold
            </Text>{' '}
            and{' '}
            <Text as="span" variant="em">
              italic
            </Text>{' '}
            and{' '}
            <Text as="span" variant="mark">
              highlighted
            </Text>{' '}
            text.
          </p>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no violations for code variants', async () => {
        const { container } = render(
          <>
            <Text variant="code">inline code</Text>
            <Text variant="kbd">Ctrl+C</Text>
            <Text variant="pre">{'const x = 1;'}</Text>
          </>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    describe('Blockquote Semantics', () => {
      it('renders proper blockquote structure without citation', async () => {
        const { container } = render(
          <Text variant="blockquote">A simple quote without citation.</Text>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('renders proper figure/blockquote/figcaption structure with citation', async () => {
        const { container } = render(
          <Text variant="blockquote" citeAuthor="Albert Einstein" cite="https://example.com">
            Imagination is more important than knowledge.
          </Text>
        );

        // Verify structure
        expect(container.querySelector('figure')).toBeInTheDocument();
        expect(container.querySelector('blockquote')).toBeInTheDocument();
        expect(container.querySelector('figcaption.blockquote-footer')).toBeInTheDocument();

        // Verify no a11y violations
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('includes cite attribute for source URL', () => {
        const { container } = render(
          <Text variant="blockquote" citeAuthor="Author" cite="https://source.example.com">
            Quote content
          </Text>
        );

        expect(container.querySelector('blockquote')).toHaveAttribute(
          'cite',
          'https://source.example.com'
        );
      });
    });

    describe('Abbreviation Accessibility', () => {
      it('renders abbr with title attribute for screen readers', async () => {
        const { container } = render(
          <Text variant="abbr" title="HyperText Markup Language">
            HTML
          </Text>
        );

        const abbr = container.querySelector('abbr');
        expect(abbr).toHaveAttribute('title', 'HyperText Markup Language');

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('provides tooltip information via title', () => {
        const { container } = render(
          <p>
            The{' '}
            <Text as="span" variant="abbr" title="World Wide Web">
              WWW
            </Text>{' '}
            changed everything.
          </p>
        );

        expect(container.querySelector('abbr')).toHaveAttribute('title', 'World Wide Web');
      });
    });

    describe('Semantic Elements', () => {
      it('uses strong for important text', () => {
        const { container } = render(<Text variant="strong">Important</Text>);
        expect(container.querySelector('strong')).toBeInTheDocument();
      });

      it('uses em for emphasized text', () => {
        const { container } = render(<Text variant="em">Emphasized</Text>);
        expect(container.querySelector('em')).toBeInTheDocument();
      });

      it('uses del for deleted text', () => {
        const { container } = render(<Text variant="del">Deleted</Text>);
        expect(container.querySelector('del')).toBeInTheDocument();
      });

      it('uses ins for inserted text', () => {
        const { container } = render(<Text variant="ins">Inserted</Text>);
        expect(container.querySelector('ins')).toBeInTheDocument();
      });

      it('uses mark for highlighted text', () => {
        const { container } = render(<Text variant="mark">Highlighted</Text>);
        expect(container.querySelector('mark')).toBeInTheDocument();
      });

      it('uses small for fine print', () => {
        const { container } = render(<Text variant="small">Fine print</Text>);
        expect(container.querySelector('small')).toBeInTheDocument();
      });
    });
  });

  // ===========================================================================
  // Typography Namespace Accessibility
  // ===========================================================================
  describe('Typography Namespace', () => {
    it('has no violations with all components used together', async () => {
      const { container } = render(
        <article>
          <Typography.Display size={1}>Hero Title</Typography.Display>
          <Typography.Text variant="lead">Introduction paragraph.</Typography.Text>
          <Typography.Heading level={2}>Section Title</Typography.Heading>
          <Typography.Text>
            Body text with{' '}
            <Typography.Text as="span" variant="strong">
              important
            </Typography.Text>{' '}
            information.
          </Typography.Text>
          <Typography.Text variant="blockquote" citeAuthor="Expert">
            A notable quote.
          </Typography.Text>
        </article>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // High Contrast Mode
  // ===========================================================================
  describe('High Contrast Mode', () => {
    it('has no violations with highContrast on heading', async () => {
      const { container } = render(
        <Heading level={1} highContrast>
          High Contrast Heading
        </Heading>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with highContrast on text', async () => {
      const { container } = render(
        <Text highContrast>High Contrast Body Text</Text>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Color Contrast (Documentation)
  // ===========================================================================
  describe('Color Contrast Guidelines', () => {
    // Note: These tests document expected color usage patterns
    // Actual contrast ratios are verified at the design token level

    it('muted color is intended for supplementary text only', () => {
      render(
        <Text color="muted" data-testid="muted-text">
          Supplementary information
        </Text>
      );
      expect(screen.getByTestId('muted-text')).toHaveClass('text-muted');
    });

    it('body-secondary maintains sufficient contrast on light backgrounds', () => {
      render(
        <Text color="body-secondary" data-testid="secondary-text">
          Secondary body text
        </Text>
      );
      expect(screen.getByTestId('secondary-text')).toHaveClass('text-body-secondary');
    });

    it('white/light colors are for dark backgrounds', () => {
      render(
        <div className="bg-dark p-3">
          <Heading level={1} color="white">
            White on dark
          </Heading>
          <Text color="light">Light on dark</Text>
        </div>
      );
      expect(screen.getByRole('heading')).toHaveClass('text-white');
    });
  });
});
