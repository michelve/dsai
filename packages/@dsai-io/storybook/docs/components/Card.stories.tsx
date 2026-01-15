import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImage,
  CardImgOverlay,
  CardLink,
  CardText,
  CardTitle,
  Heading,
  ListGroup,
  ListGroupItem,
} from '@dsai/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Card component for displaying content in a flexible container.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
 *
 * **Security Features:**
 * - Automatic HREF validation blocks dangerous protocols (javascript:, data:, vbscript:, file:)
 * - External links automatically get rel=&quot;noopener noreferrer&quot; for protection
 * - XSS-safe rendering with protocol validation
 *
 * **Accessibility:**
 * - Interactive cards without href render as semantic buttons (not div with role=&quot;button&quot;)
 * - Keyboard navigation support with Enter/Space keys
 * - WCAG 2.2 AA compliant
 *
 * **Performance Optimizations:**
 * - React.memo wrapper prevents unnecessary re-renders
 * - useMemo caching for classes, styles, and render props
 * - useCallback for event handlers to prevent child re-renders
 */
const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible content container with multiple subcomponents ' +
          '(Header, Body, Footer, Image) supporting various layouts and interactions. ' +
          'Features automatic security validation, performance optimizations, and WCAG 2.2 AA compliance.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'ghost'],
      description: 'Card variant',
      table: {
        type: { summary: "'elevated' | 'outlined' | 'ghost'" },
        defaultValue: { summary: 'elevated' },
      },
    },
    color: {
      control: 'select',
      options: [
        undefined,
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
      ],
      description: 'Background color variant',
      table: {
        type: { summary: 'CardColor' },
      },
    },
    horizontal: {
      control: 'boolean',
      description: 'Horizontal layout',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample image from assets (Unsplash gradient)
const sampleImage = '/assets/card-sample.jpg';

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Basic card with body content
 */
export const Default: Story = {
  render: () => (
    <Card style={{ width: '18rem' }}>
      <CardBody>
        <CardTitle>Card Title</CardTitle>
        <CardText>
          Some quick example text to build on the card title and make up the bulk of the card&apos;s
          content.
        </CardText>
        <Button variant="primary">Go somewhere</Button>
      </CardBody>
    </Card>
  ),
};

/**
 * Card with image
 */
export const WithImage: Story = {
  render: () => (
    <Card style={{ width: '18rem' }}>
      <CardImage src={sampleImage} alt="Colorful gradient background" />
      <CardBody>
        <CardTitle>Card Title</CardTitle>
        <CardText>
          Some quick example text to build on the card title and make up the bulk of the card&apos;s
          content.
        </CardText>
        <Button variant="primary">Go somewhere</Button>
      </CardBody>
    </Card>
  ),
};

// =============================================================================
// Variants
// =============================================================================

/**
 * Card variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Card variant="elevated" style={{ width: '16rem' }}>
        <CardBody>
          <CardTitle>Elevated</CardTitle>
          <CardText>Card with shadow (default)</CardText>
        </CardBody>
      </Card>
      <Card variant="outlined" style={{ width: '16rem' }}>
        <CardBody>
          <CardTitle>Outlined</CardTitle>
          <CardText>Card with border</CardText>
        </CardBody>
      </Card>
      <Card variant="ghost" style={{ width: '16rem' }}>
        <CardBody>
          <CardTitle>Ghost</CardTitle>
          <CardText>Transparent background</CardText>
        </CardBody>
      </Card>
    </div>
  ),
};

// =============================================================================
// Color Variants
// =============================================================================

/**
 * Card color variants
 */
export const ColorVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
      {(
        ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const
      ).map((color) => (
        <Card key={color} color={color}>
          <CardBody>
            <CardTitle>{color.charAt(0).toUpperCase() + color.slice(1)}</CardTitle>
            <CardText>Card with {color} background</CardText>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

// =============================================================================
// Header and Footer
// =============================================================================

/**
 * Card with header and footer
 */
export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card style={{ width: '18rem' }}>
      <CardHeader>Featured</CardHeader>
      <CardBody>
        <CardTitle>Special title treatment</CardTitle>
        <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
        <Button variant="primary">Go somewhere</Button>
      </CardBody>
      <CardFooter className="text-body-secondary">2 days ago</CardFooter>
    </Card>
  ),
};

// =============================================================================
// Interactive Cards
// =============================================================================

/**
 * Interactive (clickable) cards
 */
export const Interactive: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Card href="#" style={{ width: '16rem' }}>
        <CardBody>
          <CardTitle>Link Card</CardTitle>
          <CardText>Click to navigate</CardText>
        </CardBody>
      </Card>
      <Card onClick={() => alert('Card clicked!')} style={{ width: '16rem' }}>
        <CardBody>
          <CardTitle>Clickable Card</CardTitle>
          <CardText>Click to trigger action</CardText>
        </CardBody>
      </Card>
    </div>
  ),
};

// =============================================================================
// Image Positions
// =============================================================================

/**
 * Card image positions
 */
export const ImagePositions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Card style={{ width: '16rem' }}>
        <CardImage src={sampleImage} alt="Top image" position="top" />
        <CardBody>
          <CardTitle>Image Top</CardTitle>
          <CardText>Default position</CardText>
        </CardBody>
      </Card>
      <Card style={{ width: '16rem' }}>
        <CardBody>
          <CardTitle>Image Bottom</CardTitle>
          <CardText>Image below content</CardText>
        </CardBody>
        <CardImage src={sampleImage} alt="Bottom image" position="bottom" />
      </Card>
    </div>
  ),
};

// =============================================================================
// Image Overlay
// =============================================================================

/**
 * Card with image overlay
 */
export const ImageOverlay: Story = {
  render: () => (
    <Card style={{ width: '20rem' }}>
      <CardImage src={sampleImage} alt="Card background" position="overlay" height="200px" />
      <CardImgOverlay className="d-flex flex-column justify-content-end text-white">
        <CardTitle>Card Title</CardTitle>
        <CardText>This is a wider card with supporting text below.</CardText>
        <CardText muted>Last updated 3 mins ago</CardText>
      </CardImgOverlay>
    </Card>
  ),
};

// =============================================================================
// Horizontal Layout
// =============================================================================

/**
 * Horizontal card layout
 */
export const Horizontal: Story = {
  render: () => (
    <Card horizontal style={{ maxWidth: '540px' }}>
      <CardImage
        src={sampleImage}
        alt="Side image"
        style={{ width: '180px', objectFit: 'cover' }}
      />
      <CardBody>
        <CardTitle>Horizontal Card</CardTitle>
        <CardText>This is a horizontal card with content beside the image.</CardText>
        <CardText muted>Last updated 3 mins ago</CardText>
      </CardBody>
    </Card>
  ),
};

// =============================================================================
// Card with Links
// =============================================================================

/**
 * Card with links
 */
export const WithLinks: Story = {
  render: () => (
    <Card style={{ width: '18rem' }}>
      <CardBody>
        <CardTitle>Card Title</CardTitle>
        <CardText>Some example text to build on the card title.</CardText>
        <CardLink href="#">Card link</CardLink>
        <CardLink href="#">Another link</CardLink>
      </CardBody>
    </Card>
  ),
};

// =============================================================================
// Kitchen Sink (Bootstrap parity)
// =============================================================================

/**
 * Kitchen sink card layout matching Bootstrap example:
 * image, body, flush list group, and link section.
 */
export const KitchenSink: Story = {
  render: () => (
    <Card style={{ width: '18rem' }}>
      <CardImage src={sampleImage} alt="Card top" />
      <CardBody>
        <CardTitle>Kitchen Sink</CardTitle>
        <CardText>
          Some quick example text to build on the card title and make up the bulk of the card&apos;s
          content.
        </CardText>
      </CardBody>
      <ListGroup variant="flush">
        <ListGroupItem>First item</ListGroupItem>
        <ListGroupItem>Second item</ListGroupItem>
        <ListGroupItem>Third item</ListGroupItem>
      </ListGroup>
      <CardBody>
        <CardLink href="#">Card link</CardLink>
        <CardLink href="#">Another link</CardLink>
      </CardBody>
    </Card>
  ),
};

// =============================================================================
// Card Group
// =============================================================================

/**
 * Multiple cards in a grid
 */
export const CardGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardImage src={sampleImage} alt={`Card ${i} image`} />
          <CardBody>
            <CardTitle>Card {i}</CardTitle>
            <CardText>Some quick example text.</CardText>
            <Button variant="primary" size="sm">
              View
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

// =============================================================================
// Complete Showcase
// =============================================================================

// =============================================================================
// Security: HREF Validation
// =============================================================================

/**
 * Demonstrates security validation - dangerous protocols are blocked
 * and converted to safe '#' fallback
 */
export const SecurityHREFValidation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <small className="text-muted d-block mb-1">
          ✅ Safe: HTTP/HTTPS links and internal paths work
        </small>
        <Card href="https://example.com" style={{ width: '18rem' }}>
          <CardBody>
            <CardTitle>External Link</CardTitle>
            <CardText>This is a safe external link.</CardText>
          </CardBody>
        </Card>
      </div>
      <div>
        <small className="text-muted d-block mb-1">
          🛡️ Blocked: Dangerous protocols (javascript:, data:, vbscript:) are safely converted to
          &apos;#&apos;
        </small>
        <Card href="#" style={{ width: '18rem' }}>
          <CardBody>
            <CardTitle>Dangerous Protocol Blocked</CardTitle>
            <CardText>javascript:, data:, vbscript: protocols are blocked for security.</CardText>
          </CardBody>
        </Card>
      </div>
    </div>
  ),
};

/**
 * Demonstrates automatic rel attribute for external links
 */
export const SecurityExternalLinks: Story = {
  render: () => (
    <div>
      <small className="text-muted d-block mb-2">
        External links automatically get rel=&quot;noopener noreferrer&quot; for security
      </small>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Card href="https://external.com" style={{ width: '18rem' }}>
          <CardBody>
            <CardTitle>External Site</CardTitle>
            <CardText>Opens external link safely with rel attribute.</CardText>
          </CardBody>
        </Card>
        <Card href="/internal" style={{ width: '18rem' }}>
          <CardBody>
            <CardTitle>Internal Link</CardTitle>
            <CardText>Internal links don&apos;t get rel attribute.</CardText>
          </CardBody>
        </Card>
      </div>
      <div className="alert alert-info mt-3">
        <small>
          <strong>Security:</strong> All external links automatically include rel=&quot;noopener
          noreferrer&quot; to prevent:
          <ul className="mb-0 mt-1">
            <li>window.opener access from target page</li>
            <li>Referrer information leakage</li>
            <li>Performance issues</li>
          </ul>
        </small>
      </div>
    </div>
  ),
};

// =============================================================================
// Accessibility: Interactive Cards
// =============================================================================

/**
 * Demonstrates interactive cards with keyboard support
 */
export const AccessibilityInteractive: Story = {
  render: () => (
    <div>
      <small className="text-muted d-block mb-2">
        Interactive cards render as semantic buttons with full keyboard support
      </small>
      <Card interactive onClick={() => alert('Card clicked!')} style={{ width: '18rem' }}>
        <CardBody>
          <CardTitle>Interactive Card</CardTitle>
          <CardText>
            Click me or press Enter/Space. Renders as &lt;button&gt; not &lt;div&gt;.
          </CardText>
        </CardBody>
      </Card>
      <div className="alert alert-info mt-3">
        <small>
          <strong>Accessibility:</strong> Interactive cards without href:
          <ul className="mb-0 mt-1">
            <li>Render as semantic &lt;button&gt; elements</li>
            <li>Support keyboard navigation (Enter/Space keys)</li>
            <li>Properly announced by screen readers</li>
            <li>Full WCAG 2.2 AA compliance</li>
          </ul>
        </small>
      </div>
    </div>
  ),
};

// =============================================================================
// Performance: Memoization
// =============================================================================

/**
 * Demonstrates performance optimizations through memoization
 */
export const PerformanceMemoization: Story = {
  render: function PerformanceCard() {
    const [counter, setCounter] = useState(0);

    return (
      <div>
        <small className="text-muted d-block mb-2">
          Component re-renders: {counter}
          <br />
          Card and subcomponents use React.memo + useMemo to prevent unnecessary renders
        </small>
        <Card style={{ width: '18rem' }}>
          <CardBody>
            <CardTitle>Optimized Card</CardTitle>
            <CardText>This card uses memoization for performance.</CardText>
            <Button variant="primary" onClick={() => setCounter(counter + 1)}>
              Force Parent Re-render ({counter})
            </Button>
          </CardBody>
        </Card>
        <div className="alert alert-info mt-3">
          <small>
            <strong>Performance:</strong> The card component uses React.memo and useMemo hooks to:
            <ul className="mb-0 mt-1">
              <li>Skip re-renders when props haven&apos;t changed</li>
              <li>Cache className and style computations</li>
              <li>Memoize render functions with useCallback</li>
              <li>All 9 subcomponents memoized for optimal performance</li>
            </ul>
          </small>
        </div>
      </div>
    );
  },
};

// =============================================================================

/**
 * Complete card showcase
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Basic */}
      <section>
        <Heading level={5} className="mb-2">
          Basic Card
        </Heading>
        <Card style={{ width: '18rem' }}>
          <CardBody>
            <CardTitle>Card Title</CardTitle>
            <CardText>Card content goes here.</CardText>
          </CardBody>
        </Card>
      </section>

      {/* Variants */}
      <section>
        <Heading level={5} className="mb-2">
          Variants
        </Heading>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Card variant="elevated" style={{ width: '14rem' }}>
            <CardBody>
              <CardTitle>Elevated</CardTitle>
            </CardBody>
          </Card>
          <Card variant="outlined" style={{ width: '14rem' }}>
            <CardBody>
              <CardTitle>Outlined</CardTitle>
            </CardBody>
          </Card>
          <Card variant="ghost" style={{ width: '14rem' }}>
            <CardBody>
              <CardTitle>Ghost</CardTitle>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* With Header/Footer */}
      <section>
        <Heading level={5} className="mb-2">
          With Header and Footer
        </Heading>
        <Card style={{ width: '18rem' }}>
          <CardHeader>Header</CardHeader>
          <CardBody>
            <CardTitle>Title</CardTitle>
            <CardText>Content</CardText>
          </CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      </section>

      {/* Colors */}
      <section>
        <Heading level={5} className="mb-2">
          Color Variants
        </Heading>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['primary', 'success', 'danger', 'warning'] as const).map((color) => (
            <Card key={color} color={color} style={{ width: '10rem' }}>
              <CardBody>
                <CardTitle>{color}</CardTitle>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  ),
};
