/**
 * BadgeWrapper Coverage Tests
 *
 * Tests conditional class branches: placement variants,
 * overlap modes, single vs multiple children, prototype pollution guard.
 */

import { createRef } from 'react';

import { render, screen } from '@testing-library/react';

import { BadgeWrapper } from './BadgeWrapper';

describe('BadgeWrapper', () => {
  describe('Placement variants', () => {
    it('defaults to top-end placement', () => {
      const { container } = render(
        <BadgeWrapper>
          <span>icon</span>
          <span>badge</span>
        </BadgeWrapper>
      );
      expect(container.firstElementChild).toHaveAttribute('data-placement', 'top-end');
    });

    it.each(['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const)(
      'renders with placement=%s',
      (placement) => {
        const { container } = render(
          <BadgeWrapper placement={placement}>
            <span>icon</span>
            <span>badge</span>
          </BadgeWrapper>
        );
        expect(container.firstElementChild).toHaveAttribute('data-placement', placement);
      }
    );
  });

  describe('Overlap modes', () => {
    it('defaults to rectangular overlap', () => {
      const { container } = render(
        <BadgeWrapper>
          <span>icon</span>
          <span>badge</span>
        </BadgeWrapper>
      );
      expect(container.firstElementChild).toHaveAttribute('data-overlap', 'rectangular');
    });

    it('applies circular overlap', () => {
      const { container } = render(
        <BadgeWrapper overlap="circular">
          <span>icon</span>
          <span>badge</span>
        </BadgeWrapper>
      );
      expect(container.firstElementChild).toHaveAttribute('data-overlap', 'circular');
    });

    it('applies circular offset styles for circular overlap', () => {
      const { container } = render(
        <BadgeWrapper overlap="circular" placement="top-end">
          <span>icon</span>
          <span>badge</span>
        </BadgeWrapper>
      );
      const overlay = container.querySelector('.dsai-badge-wrapper-badge');
      expect(overlay).toBeInTheDocument();
      // Circular offset for top-end has top: 14%
      expect(overlay?.getAttribute('style')).toContain('14%');
    });
  });

  describe('Children handling', () => {
    it('wraps last child (badge) in a positioned span', () => {
      const { container } = render(
        <BadgeWrapper>
          <span data-testid="icon">icon</span>
          <span data-testid="badge">4</span>
        </BadgeWrapper>
      );
      const overlay = container.querySelector('.dsai-badge-wrapper-badge');
      expect(overlay).toBeInTheDocument();
      expect(overlay?.tagName).toBe('SPAN');
      expect(overlay?.querySelector('[data-testid="badge"]')).toBeInTheDocument();
    });

    it('renders single child without overlay wrapping', () => {
      const { container } = render(
        <BadgeWrapper>
          <span>only child</span>
        </BadgeWrapper>
      );
      // Single (non-array) child goes through the else branch, rendered as-is
      const overlay = container.querySelector('.dsai-badge-wrapper-badge');
      expect(overlay).not.toBeInTheDocument();
      expect(screen.getByText('only child')).toBeInTheDocument();
    });

    it('handles non-array children (single element)', () => {
      const { container } = render(
        <BadgeWrapper>
          <span>single</span>
        </BadgeWrapper>
      );
      // Non-array children path - should not throw
      expect(container.firstElementChild).toBeInTheDocument();
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the wrapper div', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <BadgeWrapper ref={ref}>
          <span>icon</span>
          <span>badge</span>
        </BadgeWrapper>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('dsai-badge-wrapper');
    });
  });

  describe('Custom className and style', () => {
    it('merges custom className', () => {
      const { container } = render(
        <BadgeWrapper className="my-wrapper">
          <span>icon</span>
          <span>badge</span>
        </BadgeWrapper>
      );
      expect(container.firstElementChild).toHaveClass(
        'dsai-badge-wrapper',
        'd-inline-flex',
        'position-relative',
        'my-wrapper'
      );
    });

    it('passes custom style', () => {
      const { container } = render(
        <BadgeWrapper style={{ margin: '8px' }}>
          <span>icon</span>
          <span>badge</span>
        </BadgeWrapper>
      );
      expect((container.firstElementChild as HTMLElement).style.margin).toBe('8px');
    });
  });

  describe('Security - prototype pollution guard', () => {
    it('returns empty fallback for blocked keys like __proto__', () => {
      // Using a blocked placement key should not crash
      const { container } = render(
        <BadgeWrapper placement={'__proto__' as 'top-end'}>
          <span>icon</span>
          <span>badge</span>
        </BadgeWrapper>
      );
      expect(container.firstElementChild).toBeInTheDocument();
    });

    it('returns empty fallback for constructor key', () => {
      const { container } = render(
        <BadgeWrapper placement={'constructor' as 'top-end'}>
          <span>icon</span>
          <span>badge</span>
        </BadgeWrapper>
      );
      expect(container.firstElementChild).toBeInTheDocument();
    });
  });
});
