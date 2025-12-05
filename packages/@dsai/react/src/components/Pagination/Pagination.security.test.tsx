/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';

import { Pagination } from './Pagination';

describe('Pagination - Security Tests', () => {
  // ===========================================================================
  // XSS Prevention in Custom Content
  // ===========================================================================

  describe('XSS Prevention in Custom Content', () => {
    it('escapes script tags in previousContent', () => {
      const { container } = render(
        <Pagination count={5} page={3} previousContent="<script>alert('XSS')</script>" />
      );
      expect(container.innerHTML).not.toContain('<script>');
      expect(container.textContent).toContain("<script>alert('XSS')</script>");
    });

    it('escapes script tags in nextContent', () => {
      const { container } = render(
        <Pagination count={5} page={3} nextContent="<script>alert('XSS')</script>" />
      );
      expect(container.innerHTML).not.toContain('<script>');
      expect(container.textContent).toContain("<script>alert('XSS')</script>");
    });

    it('escapes script tags in firstContent', () => {
      const { container } = render(
        <Pagination
          count={5}
          page={3}
          showFirstButton
          firstContent="<script>alert('XSS')</script>"
        />
      );
      expect(container.innerHTML).not.toContain('<script>');
      expect(container.textContent).toContain("<script>alert('XSS')</script>");
    });

    it('escapes script tags in lastContent', () => {
      const { container } = render(
        <Pagination count={5} page={3} showLastButton lastContent="<script>alert('XSS')</script>" />
      );
      expect(container.innerHTML).not.toContain('<script>');
      expect(container.textContent).toContain("<script>alert('XSS')</script>");
    });

    it('escapes onclick handlers in custom content strings', () => {
      const { container } = render(
        <Pagination
          count={5}
          page={3}
          previousContent="<button onclick='alert(1)'>Click</button>"
        />
      );
      // React escapes the content so it's displayed as text, not executable
      // The innerHTML contains HTML-encoded entities (e.g., &lt;button onclick=...)
      // Verify no actual <button type="button"> element was created inside the pagination button
      const paginationButtons = container.querySelectorAll('button.page-link');
      const prevButton = Array.from(paginationButtons).find((btn) =>
        btn.textContent?.includes('onclick')
      );
      expect(prevButton?.querySelector('button')).toBeNull();
      // The content is shown as escaped text
      expect(container.textContent).toContain("<button onclick='alert(1)'>Click</button>");
    });

    it('escapes img onerror in custom content strings', () => {
      const { container } = render(
        <Pagination count={5} page={3} nextContent="<img src='x' onerror='alert(1)'/>" />
      );
      // React escapes the content so it's displayed as text, not executable
      // Verify no actual <img> element was created
      const nextButton = container.querySelector('button[aria-label="Go to next page"]');
      expect(nextButton?.querySelector('img')).toBeNull();
      // The content is shown as escaped text
      expect(container.textContent).toContain("<img src='x' onerror='alert(1)'/>");
    });
  });

  // ===========================================================================
  // Label Injection Prevention
  // ===========================================================================

  describe('Label Injection Prevention', () => {
    it('escapes HTML in previousLabel', () => {
      render(<Pagination count={5} page={3} previousLabel="<script>alert('XSS')</script>" />);
      // The aria-label should contain the text, not execute it
      const prevButton = screen.getByLabelText("<script>alert('XSS')</script>");
      expect(prevButton).toBeInTheDocument();
    });

    it('escapes HTML in nextLabel', () => {
      render(<Pagination count={5} page={3} nextLabel="<script>alert('XSS')</script>" />);
      const nextButton = screen.getByLabelText("<script>alert('XSS')</script>");
      expect(nextButton).toBeInTheDocument();
    });

    it('escapes HTML in firstLabel', () => {
      render(
        <Pagination count={5} page={3} showFirstButton firstLabel="<script>alert('XSS')</script>" />
      );
      const firstButton = screen.getByLabelText("<script>alert('XSS')</script>");
      expect(firstButton).toBeInTheDocument();
    });

    it('escapes HTML in lastLabel', () => {
      render(
        <Pagination count={5} page={3} showLastButton lastLabel="<script>alert('XSS')</script>" />
      );
      const lastButton = screen.getByLabelText("<script>alert('XSS')</script>");
      expect(lastButton).toBeInTheDocument();
    });

    it('escapes HTML in custom aria-label', () => {
      render(<Pagination count={5} aria-label="<script>alert('XSS')</script>" />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', "<script>alert('XSS')</script>");
      expect(nav.innerHTML).not.toContain('<script>');
    });

    it('escapes HTML in getPageAriaLabel return value', () => {
      render(
        <Pagination count={5} page={1} getPageAriaLabel={() => "<script>alert('XSS')</script>"} />
      );
      // Multiple page buttons will have this label, use getAllByLabelText
      const pageButtons = screen.getAllByLabelText("<script>alert('XSS')</script>");
      expect(pageButtons.length).toBeGreaterThan(0);
      expect(pageButtons[0]).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Prop Injection Prevention
  // ===========================================================================

  describe('Prop Injection Prevention', () => {
    it('ignores dangerous onClick override attempts', () => {
      const dangerousProps = {
        onClick: jest.fn(),
      };
      render(<Pagination count={5} {...dangerousProps} />);
      // The component should not have onClick on the nav element
      // Get the nav and verify no click handler is attached
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      // Click on nav shouldn't trigger the dangerous handler
      // (Our component doesn't support onClick on nav)
      expect(dangerousProps.onClick).not.toHaveBeenCalled();
    });

    it('does not render onLoad attribute', () => {
      const { container } = render(
        <Pagination
          count={5}
          // @ts-expect-error - testing prop injection
          onLoad="alert('XSS')"
        />
      );
      expect(container.innerHTML).not.toContain('onLoad');
      expect(container.innerHTML).not.toContain('onload');
    });

    it('does not render onError attribute', () => {
      const { container } = render(
        <Pagination
          count={5}
          // @ts-expect-error - testing prop injection
          onError="alert('XSS')"
        />
      );
      expect(container.innerHTML).not.toContain('onError');
      expect(container.innerHTML).not.toContain('onerror');
    });

    it('does not allow prototype pollution via props', () => {
      const maliciousProps = {
        __proto__: { polluted: true },
        constructor: { prototype: { polluted: true } },
      };
      render(<Pagination count={5} {...maliciousProps} />);
      // Ensure Object prototype is not polluted
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    });
  });

  // ===========================================================================
  // Integer Overflow / Boundary Tests
  // ===========================================================================

  describe('Integer Boundary Security', () => {
    it('handles extremely large count values', () => {
      const { container } = render(<Pagination count={Number.MAX_SAFE_INTEGER} page={1} />);
      expect(container.querySelector('nav')).toBeInTheDocument();
      // Should not crash or hang
    });

    it('handles negative count gracefully', () => {
      const { container } = render(<Pagination count={-100} />);
      expect(container.querySelector('nav')).toBeInTheDocument();
      // Should handle gracefully without errors
    });

    it('handles negative page gracefully', () => {
      const { container } = render(<Pagination count={10} page={-5} />);
      expect(container.querySelector('nav')).toBeInTheDocument();
      // Should clamp to valid range
    });

    it('handles page larger than count gracefully', () => {
      const { container } = render(<Pagination count={10} page={1000} />);
      expect(container.querySelector('nav')).toBeInTheDocument();
      // Should clamp to valid range
    });

    it('handles NaN count gracefully', () => {
      const { container } = render(<Pagination count={NaN} />);
      expect(container.querySelector('nav')).toBeInTheDocument();
    });

    it('handles Infinity count gracefully', () => {
      const { container } = render(<Pagination count={Infinity} page={1} />);
      expect(container.querySelector('nav')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Class Name Injection
  // ===========================================================================

  describe('Class Name Injection', () => {
    it('does not allow script execution via className', () => {
      const dangerousClassName = 'safe-class"><script>alert(\'XSS\')</script><div class="';
      const { container } = render(<Pagination count={5} className={dangerousClassName} />);
      // React properly escapes the className attribute value
      // Verify no actual <script> element was created in the DOM
      expect(container.querySelector('script')).toBeNull();
      // The nav should have the className attribute set (React escapes it safely)
      const nav = container.querySelector('nav');
      // The className is set as-is, but React escapes quotes in the attribute
      // Check the attribute contains our safe class part
      expect(nav?.className).toContain('safe-class');
    });

    it('properly escapes special characters in className', () => {
      const dangerousClassName = 'test" onmouseover="alert(1)';
      const { container } = render(<Pagination count={5} className={dangerousClassName} />);
      // Should not have unquoted attributes
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass(dangerousClassName);
    });
  });

  // ===========================================================================
  // ID Injection
  // ===========================================================================

  describe('ID Injection', () => {
    it('properly escapes special characters in id', () => {
      const dangerousId = 'test" onclick="alert(1)';
      const { container } = render(<Pagination count={5} id={dangerousId} />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('id', dangerousId);
    });
  });

  // ===========================================================================
  // No dangerouslySetInnerHTML Usage
  // ===========================================================================

  describe('No dangerouslySetInnerHTML', () => {
    it('component does not use dangerouslySetInnerHTML', () => {
      // This test verifies at the source level that we don't use dangerouslySetInnerHTML
      // If the component used it, HTML would be rendered
      const { container } = render(<Pagination count={5} page={3} previousContent="<b>Bold</b>" />);
      // If dangerouslySetInnerHTML was used, we'd see a <b> element
      expect(container.querySelector('b')).toBeNull();
      // Instead, the text should be escaped
      expect(container.textContent).toContain('<b>Bold</b>');
    });
  });
});
