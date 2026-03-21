import { randomUUID } from 'node:crypto';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';

import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

expect.extend(toHaveNoViolations);

// Sample items for testing
const sampleItems = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'products', label: 'Products', href: '/products' },
  { id: 'category', label: 'Category', href: '/category' },
  { id: 'item', label: 'Item', active: true },
];

describe('Breadcrumb', () => {
  // ===========================================================================
  // Rendering - Items Mode
  // ===========================================================================
  describe('Rendering - Items Mode', () => {
    it('renders breadcrumb with items prop', () => {
      render(<Breadcrumb items={sampleItems} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Item')).toBeInTheDocument();
    });

    it('renders links for items with href', () => {
      render(<Breadcrumb items={sampleItems} />);

      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
    });

    it('renders last item as active by default', () => {
      render(<Breadcrumb items={sampleItems} />);

      const activeItem = screen.getByText('Item').closest('li');
      expect(activeItem).toHaveClass('active');
      expect(activeItem).toHaveAttribute('aria-current', 'page');
    });

    it('renders empty when no items', () => {
      const { container } = render(<Breadcrumb items={[]} />);
      // When items is empty, renderWithItems returns null, so no ol is rendered
      expect(container.querySelector('ol')).toBeNull();
    });
  });

  // ===========================================================================
  // Rendering - Compound Mode
  // ===========================================================================
  describe('Rendering - Compound Mode', () => {
    it('renders breadcrumb with compound components', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem active>Category</BreadcrumbItem>
        </Breadcrumb>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('renders active item without link', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem active>Current</BreadcrumbItem>
        </Breadcrumb>
      );

      const currentItem = screen.getByText('Current');
      expect(currentItem.closest('a')).toBeNull();
    });
  });

  // ===========================================================================
  // Custom Separator
  // ===========================================================================
  describe('Custom Separator', () => {
    it('uses default separator /', () => {
      const { container } = render(<Breadcrumb items={sampleItems} />);
      const ol = container.querySelector('ol');
      // Default separator doesn't set custom CSS variable
      expect(ol).not.toHaveStyle({ '--bs-breadcrumb-divider': "'>'" });
    });

    it('applies custom separator', () => {
      const { container } = render(<Breadcrumb items={sampleItems} separator=">" />);
      const ol = container.querySelector('ol');
      expect(ol).toHaveStyle({ '--bs-breadcrumb-divider': "'>'" });
    });
  });

  // ===========================================================================
  // Collapse Functionality
  // ===========================================================================
  describe('Collapse Functionality', () => {
    const manyItems = [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'Level 1', href: '/1' },
      { id: '3', label: 'Level 2', href: '/2' },
      { id: '4', label: 'Level 3', href: '/3' },
      { id: '5', label: 'Level 4', href: '/4' },
      { id: '6', label: 'Current', active: true },
    ];

    it('shows all items when maxItems is not set', () => {
      render(<Breadcrumb items={manyItems} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('Level 2')).toBeInTheDocument();
      expect(screen.getByText('Level 3')).toBeInTheDocument();
      expect(screen.getByText('Level 4')).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
    });

    it('collapses items when exceeding maxItems', () => {
      render(<Breadcrumb items={manyItems} maxItems={3} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('…')).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
      expect(screen.queryByText('Level 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Level 2')).not.toBeInTheDocument();
    });

    it('shows correct items before and after collapse', () => {
      render(
        <Breadcrumb items={manyItems} maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={1} />
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('…')).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
      expect(screen.queryByText('Level 2')).not.toBeInTheDocument();
    });

    it('expands when ellipsis is clicked (uncontrolled)', async () => {
      render(<Breadcrumb items={manyItems} maxItems={3} />);

      expect(screen.queryByText('Level 1')).not.toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Show hidden breadcrumbs' }));

      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('Level 2')).toBeInTheDocument();
    });

    it('calls onExpand when ellipsis is clicked', async () => {
      const handleExpand = jest.fn();
      render(<Breadcrumb items={manyItems} maxItems={3} onExpand={handleExpand} />);

      await userEvent.click(screen.getByRole('button', { name: 'Show hidden breadcrumbs' }));

      expect(handleExpand).toHaveBeenCalled();
    });

    it('respects controlled expanded state', () => {
      render(<Breadcrumb items={manyItems} maxItems={3} expanded={false} />);

      expect(screen.queryByText('Level 1')).not.toBeInTheDocument();
      expect(screen.getByText('…')).toBeInTheDocument();
    });

    it('shows all items when expanded is true', () => {
      render(<Breadcrumb items={manyItems} maxItems={3} expanded />);

      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('Level 2')).toBeInTheDocument();
      expect(screen.queryByText('…')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Icons
  // ===========================================================================
  describe('Icons', () => {
    it('renders items with icons', () => {
      const itemsWithIcons = [
        {
          id: 'home',
          label: 'Home',
          href: '/',
          icon: <span data-testid="home-icon">🏠</span>,
        },
        { id: 'current', label: 'Current', active: true },
      ];
      render(<Breadcrumb items={itemsWithIcons} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('renders icon in compound component', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/" icon={<span data-testid="icon">🏠</span>}>
            Home
          </BreadcrumbItem>
        </Breadcrumb>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Click Handler
  // ===========================================================================
  describe('Click Handler', () => {
    it('calls onClick when item is clicked', async () => {
      const handleClick = jest.fn();
      render(
        <Breadcrumb>
          <BreadcrumbItem onClick={handleClick}>Clickable</BreadcrumbItem>
        </Breadcrumb>
      );

      await userEvent.click(screen.getByRole('link', { name: 'Clickable' }));

      expect(handleClick).toHaveBeenCalled();
    });

    it('prevents default when onClick is provided', async () => {
      const handleClick = jest.fn();
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/test" onClick={handleClick}>
            Clickable
          </BreadcrumbItem>
        </Breadcrumb>
      );

      const link = screen.getByRole('link', { name: 'Clickable' });
      fireEvent.click(link);

      expect(handleClick).toHaveBeenCalled();
    });

    it('calls onClick from items prop', async () => {
      const handleClick = jest.fn();
      render(
        <Breadcrumb
          items={[
            { id: '1', label: 'Clickable', onClick: handleClick },
            { id: '2', label: 'Current', active: true },
          ]}
        />
      );

      await userEvent.click(screen.getByRole('link', { name: 'Clickable' }));

      expect(handleClick).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Custom Link Component
  // ===========================================================================
  describe('Custom Link Component', () => {
    it('uses custom link component when provided', () => {
      const CustomLink = ({
        href,
        children,
      }: {
        href?: string;
        children: React.ReactNode;
      }): React.JSX.Element => (
        <a href={href} data-testid="custom-link">
          {children}
        </a>
      );

      render(
        <Breadcrumb
          linkAs={CustomLink}
          items={[
            { id: '1', label: 'Home', href: '/' },
            { id: '2', label: 'Current', active: true },
          ]}
        />
      );

      expect(screen.getByTestId('custom-link')).toBeInTheDocument();
    });

    it('uses linkAs on individual item', () => {
      const CustomLink = ({
        href,
        children,
      }: {
        href?: string;
        children: React.ReactNode;
      }): React.JSX.Element => (
        <a href={href} data-testid="custom-link">
          {children}
        </a>
      );

      render(
        <Breadcrumb>
          <BreadcrumbItem linkAs={CustomLink} href="/">
            Home
          </BreadcrumbItem>
          <BreadcrumbItem active>Current</BreadcrumbItem>
        </Breadcrumb>
      );

      expect(screen.getByTestId('custom-link')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================
  describe('Ref Forwarding', () => {
    it('forwards ref to Breadcrumb nav element', () => {
      const ref = createRef<HTMLElement>();
      render(<Breadcrumb ref={ref} items={sampleItems} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('NAV');
    });

    it('forwards ref to BreadcrumbItem li element', () => {
      const ref = createRef<HTMLLIElement>();
      render(
        <Breadcrumb>
          <BreadcrumbItem ref={ref} active>
            Test
          </BreadcrumbItem>
        </Breadcrumb>
      );
      expect(ref.current).toBeInstanceOf(HTMLLIElement);
    });
  });

  // ===========================================================================
  // Custom Styling
  // ===========================================================================
  describe('Custom Styling', () => {
    it('accepts custom className on Breadcrumb', () => {
      const { container } = render(<Breadcrumb items={sampleItems} className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('accepts custom className on BreadcrumbItem', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem className="custom-item" active>
            Test
          </BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('Test').closest('li')).toHaveClass('custom-item');
    });

    it('accepts inline styles on Breadcrumb', () => {
      const { container } = render(
        <Breadcrumb items={sampleItems} style={{ marginTop: '10px' }} />
      );
      expect(container.querySelector('nav')).toHaveStyle({ marginTop: '10px' });
    });

    it('accepts custom id', () => {
      const testId = `breadcrumb-${randomUUID()}`;
      render(<Breadcrumb items={sampleItems} id={testId} />);
      expect(document.getElementById(testId)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Accessibility (WCAG 2.2 AA)
  // ===========================================================================
  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Breadcrumb items={sampleItems} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with collapsed items', async () => {
      const manyItems = [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'Level 1', href: '/1' },
        { id: '3', label: 'Level 2', href: '/2' },
        { id: '4', label: 'Current', active: true },
      ];
      const { container } = render(<Breadcrumb items={manyItems} maxItems={3} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has nav element with aria-label', () => {
      render(<Breadcrumb items={sampleItems} />);
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb');
    });

    it('derives aria-label from id when provided without explicit label', () => {
      render(<Breadcrumb items={sampleItems} id="primary-breadcrumb" />);
      expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'Breadcrumb primary-breadcrumb'
      );
    });

    it('accepts custom aria-label', () => {
      render(<Breadcrumb items={sampleItems} aria-label="Site navigation" />);
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Site navigation');
    });

    it('accepts aria-labelledby to describe the navigation', () => {
      render(
        <>
          <h2 id="breadcrumb-heading">Page trail</h2>
          <Breadcrumb items={sampleItems} aria-labelledby="breadcrumb-heading" />
        </>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-labelledby', 'breadcrumb-heading');
      expect(nav).not.toHaveAttribute('aria-label');
    });

    it('uses ol list structure', () => {
      render(<Breadcrumb items={sampleItems} />);
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('has aria-current="page" on active item', () => {
      render(<Breadcrumb items={sampleItems} />);
      const activeItem = screen.getByText('Item').closest('li');
      expect(activeItem).toHaveAttribute('aria-current', 'page');
    });

    it('uses semantic link elements', () => {
      render(<Breadcrumb items={sampleItems} />);
      expect(screen.getAllByRole('link')).toHaveLength(3); // All except active
    });
  });

  // ===========================================================================
  // Display Names
  // ===========================================================================
  describe('Display Names', () => {
    it('Breadcrumb has correct displayName', () => {
      expect(Breadcrumb.displayName).toBe('Breadcrumb');
    });

    it('BreadcrumbItem has correct displayName', () => {
      expect(BreadcrumbItem.displayName).toBe('BreadcrumbItem');
    });
  });

  // ===========================================================================
  // ReactNode Separator
  // ===========================================================================
  describe('ReactNode Separator', () => {
    it('renders inline ReactNode separators between items', () => {
      const { container } = render(
        <Breadcrumb items={sampleItems} separator={<span data-testid="sep">›</span>} />
      );
      const separators = container.querySelectorAll('.breadcrumb-separator');
      // 4 items = 3 separators
      expect(separators.length).toBe(3);
      expect(screen.getAllByTestId('sep')).toHaveLength(3);
    });

    it('hides separators from screen readers', () => {
      const { container } = render(
        <Breadcrumb items={sampleItems} separator={<span>›</span>} />
      );
      const separators = container.querySelectorAll('.breadcrumb-separator');
      for (const sep of separators) {
        expect(sep).toHaveAttribute('aria-hidden', 'true');
        expect(sep).toHaveAttribute('role', 'presentation');
      }
    });

    it('uses CSS variable for string separators', () => {
      const { container } = render(
        <Breadcrumb items={sampleItems} separator=">" />
      );
      const ol = container.querySelector('.breadcrumb');
      expect(ol).toHaveStyle({ '--bs-breadcrumb-divider': "'>" + "'" });
      // No inline separators for string mode
      expect(container.querySelectorAll('.breadcrumb-separator').length).toBe(0);
    });

    it('does not add separator style for default "/"', () => {
      const { container } = render(<Breadcrumb items={sampleItems} />);
      const ol = container.querySelector('.breadcrumb');
      expect(ol).not.toHaveAttribute('style');
    });
  });

  // ===========================================================================
  // Configurable expandText
  // ===========================================================================
  describe('Expand Text', () => {
    const manyItems = [
      { id: '1', label: 'Root', href: '/' },
      { id: '2', label: 'A', href: '/a' },
      { id: '3', label: 'B', href: '/b' },
      { id: '4', label: 'C', href: '/c' },
      { id: '5', label: 'D', href: '/d' },
      { id: '6', label: 'Current', active: true },
    ];

    it('uses default expandText on ellipsis button', () => {
      render(<Breadcrumb items={manyItems} maxItems={3} />);
      expect(screen.getByRole('button', { name: 'Show hidden breadcrumbs' })).toBeInTheDocument();
    });

    it('uses custom expandText', () => {
      render(<Breadcrumb items={manyItems} maxItems={3} expandText="Show full path" />);
      expect(screen.getByRole('button', { name: 'Show full path' })).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Schema.org JSON-LD Structured Data
  // ===========================================================================
  describe('Structured Data (JSON-LD)', () => {
    it('renders JSON-LD script tag when structuredData=true', () => {
      const { container } = render(
        <Breadcrumb items={sampleItems} structuredData />
      );
      const script = container.parentElement?.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
    });

    it('generates valid Schema.org BreadcrumbList', () => {
      const { container } = render(
        <Breadcrumb items={sampleItems} structuredData />
      );
      const script = container.parentElement?.querySelector('script[type="application/ld+json"]');
      const data = JSON.parse(script?.innerHTML ?? '{}');
      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBe('BreadcrumbList');
      expect(data.itemListElement).toHaveLength(4);
      expect(data.itemListElement[0]).toMatchObject({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: '/',
      });
    });

    it('omits item URL when href is not provided', () => {
      const { container } = render(
        <Breadcrumb items={sampleItems} structuredData />
      );
      const script = container.parentElement?.querySelector('script[type="application/ld+json"]');
      const data = JSON.parse(script?.innerHTML ?? '{}');
      // Last item (active) has no href
      expect(data.itemListElement[3]).not.toHaveProperty('item');
    });

    it('does not render JSON-LD when structuredData=false', () => {
      const { container } = render(
        <Breadcrumb items={sampleItems} />
      );
      const script = container.parentElement?.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeInTheDocument();
    });

    it('does not render JSON-LD without items prop', () => {
      const { container } = render(
        <Breadcrumb structuredData>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
        </Breadcrumb>
      );
      const script = container.parentElement?.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Label Truncation
  // ===========================================================================
  describe('Label Truncation', () => {
    it('applies truncation styles on BreadcrumbItem when maxLabelWidth is set', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/" maxLabelWidth="100px">
            Very Long Breadcrumb Label That Should Be Truncated
          </BreadcrumbItem>
        </Breadcrumb>
      );
      const span = screen.getByText('Very Long Breadcrumb Label That Should Be Truncated');
      expect(span).toHaveStyle({ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' });
    });

    it('applies truncation from Breadcrumb maxLabelWidth to all items', () => {
      const items = [
        { id: '1', label: 'Short', href: '/' },
        { id: '2', label: 'A Very Long Label', active: true },
      ];
      const { container } = render(
        <Breadcrumb items={items} maxLabelWidth="80px" />
      );
      const spans = container.querySelectorAll('span[style*="max-width"]');
      expect(spans.length).toBe(2);
    });

    it('adds title attribute for truncated string labels', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/" maxLabelWidth="100px">
            Long Label
          </BreadcrumbItem>
        </Breadcrumb>
      );
      const span = screen.getByText('Long Label');
      expect(span).toHaveAttribute('title', 'Long Label');
    });
  });

  // ===========================================================================
  // Collapsed Items Render Prop
  // ===========================================================================
  describe('Collapsed Items Render Prop', () => {
    const manyItems = [
      { id: '1', label: 'Root', href: '/' },
      { id: '2', label: 'A', href: '/a' },
      { id: '3', label: 'B', href: '/b' },
      { id: '4', label: 'C', href: '/c' },
      { id: '5', label: 'Current', active: true },
    ];

    it('renders custom content for collapsed items', () => {
      render(
        <Breadcrumb
          items={manyItems}
          maxItems={3}
          renderCollapsedItems={(hidden) => (
            <span data-testid="custom-collapse">{hidden.length} hidden</span>
          )}
        />
      );
      expect(screen.getByTestId('custom-collapse')).toHaveTextContent('3 hidden');
    });

    it('passes correct hidden items to render prop', () => {
      const renderSpy = jest.fn(() => <span>collapsed</span>);
      render(
        <Breadcrumb
          items={manyItems}
          maxItems={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={1}
          renderCollapsedItems={renderSpy}
        />
      );
      expect(renderSpy).toHaveBeenCalledTimes(1);
      const hiddenItems = renderSpy.mock.calls[0][0];
      expect(hiddenItems).toHaveLength(3);
      expect(hiddenItems[0].label).toBe('A');
      expect(hiddenItems[2].label).toBe('C');
    });

    it('does not render default ellipsis button when renderCollapsedItems is provided', () => {
      render(
        <Breadcrumb
          items={manyItems}
          maxItems={3}
          renderCollapsedItems={() => <span>custom</span>}
        />
      );
      expect(screen.queryByRole('button', { name: 'Show hidden breadcrumbs' })).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Data Attributes
  // ===========================================================================
  describe('Data Attributes', () => {
    it('passes data-testid to Breadcrumb nav', () => {
      render(<Breadcrumb items={sampleItems} data-testid="bc-nav" />);
      expect(screen.getByTestId('bc-nav')).toBeInTheDocument();
      expect(screen.getByTestId('bc-nav').tagName).toBe('NAV');
    });

    it('passes data-testid to BreadcrumbItem', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/" data-testid="bc-item">Home</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByTestId('bc-item')).toBeInTheDocument();
      expect(screen.getByTestId('bc-item').tagName).toBe('LI');
    });

    it('passes data-test to nav and items', () => {
      const { container } = render(
        <Breadcrumb items={sampleItems} data-test="bc" />
      );
      expect(container.querySelector('[data-test="bc"]')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Accessibility with New Features
  // ===========================================================================
  describe('Accessibility with New Features', () => {
    it('has no violations with ReactNode separator', async () => {
      const { container } = render(
        <Breadcrumb items={sampleItems} separator={<span>›</span>} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with structured data', async () => {
      const { container } = render(
        <Breadcrumb items={sampleItems} structuredData />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with truncated labels', async () => {
      const { container } = render(
        <Breadcrumb items={sampleItems} maxLabelWidth="100px" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
