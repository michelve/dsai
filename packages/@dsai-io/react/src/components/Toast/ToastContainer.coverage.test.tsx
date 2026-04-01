/**
 * ToastContainer Coverage Tests
 *
 * Tests all 9 position variants, portal rendering, gap prop,
 * ref forwarding, className/style merging, and default branch.
 */

import { render, screen } from '@testing-library/react';
import { createRef } from 'react';


import { ToastContainer } from './ToastContainer';

import type { ToastPosition } from './Toast.types';

describe('ToastContainer', () => {
  describe('Position Variants', () => {
    const positionCases: Array<{ position: ToastPosition; expectedClasses: string[] }> = [
      { position: 'top-start', expectedClasses: ['top-0', 'start-0'] },
      { position: 'top-center', expectedClasses: ['top-0', 'start-50', 'translate-middle-x'] },
      { position: 'top-end', expectedClasses: ['top-0', 'end-0'] },
      { position: 'middle-start', expectedClasses: ['top-50', 'start-0', 'translate-middle-y'] },
      { position: 'middle-center', expectedClasses: ['top-50', 'start-50', 'translate-middle'] },
      { position: 'middle-end', expectedClasses: ['top-50', 'end-0', 'translate-middle-y'] },
      { position: 'bottom-start', expectedClasses: ['bottom-0', 'start-0'] },
      {
        position: 'bottom-center',
        expectedClasses: ['bottom-0', 'start-50', 'translate-middle-x'],
      },
      { position: 'bottom-end', expectedClasses: ['bottom-0', 'end-0'] },
    ];

    it.each(positionCases)(
      'renders $position with correct classes',
      ({ position, expectedClasses }) => {
        render(
          <ToastContainer position={position} data-testid="container">
            <div>toast</div>
          </ToastContainer>
        );

        const container = screen.getByTestId('container');
        expect(container).toHaveClass('toast-container', 'position-fixed', 'p-3');
        for (const cls of expectedClasses) {
          expect(container).toHaveClass(cls);
        }
      }
    );

    it('defaults to top-end position', () => {
      render(
        <ToastContainer data-testid="container">
          <div>toast</div>
        </ToastContainer>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('top-0', 'end-0');
    });

    it('uses default fallback for unknown position value', () => {
      render(
        <ToastContainer position={'unknown-position' as ToastPosition} data-testid="container">
          <div>toast</div>
        </ToastContainer>
      );

      const container = screen.getByTestId('container');
      // default branch returns top-0 end-0
      expect(container).toHaveClass('top-0', 'end-0');
    });
  });

  describe('Portal Rendering', () => {
    it('renders as portal into document.body', () => {
      render(
        <ToastContainer data-testid="container">
          <div>toast content</div>
        </ToastContainer>
      );

      const container = screen.getByTestId('container');
      expect(container.parentElement).toBe(document.body);
    });
  });

  describe('Gap Prop', () => {
    it('applies default gap (12px) as CSS custom property and style', () => {
      render(
        <ToastContainer data-testid="container">
          <div>toast</div>
        </ToastContainer>
      );

      const container = screen.getByTestId('container');
      expect(container.style.gap).toBe('12px');
    });

    it('applies custom gap value', () => {
      render(
        <ToastContainer gap={24} data-testid="container">
          <div>toast</div>
        </ToastContainer>
      );

      const container = screen.getByTestId('container');
      expect(container.style.gap).toBe('24px');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the container div', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <ToastContainer ref={ref} data-testid="container">
          <div>toast</div>
        </ToastContainer>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toBe(screen.getByTestId('container'));
    });
  });

  describe('className and style Merging', () => {
    it('merges custom className', () => {
      render(
        <ToastContainer className="custom-class" data-testid="container">
          <div>toast</div>
        </ToastContainer>
      );

      expect(screen.getByTestId('container')).toHaveClass('toast-container', 'custom-class');
    });

    it('merges custom style with container styles', () => {
      render(
        <ToastContainer style={{ backgroundColor: 'red' }} data-testid="container">
          <div>toast</div>
        </ToastContainer>
      );

      const container = screen.getByTestId('container');
      expect(container.style.backgroundColor).toBe('red');
      expect(container.style.display).toBe('flex');
    });
  });

  describe('HTML Attributes', () => {
    it('passes id, tabIndex, aria-label, data-testid, and data-test', () => {
      render(
        <ToastContainer
          id="my-container"
          tabIndex={0}
          aria-label="Notifications"
          data-testid="container"
          data-test="toast-container"
        >
          <div>toast</div>
        </ToastContainer>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveAttribute('id', 'my-container');
      expect(container).toHaveAttribute('tabindex', '0');
      expect(container).toHaveAttribute('aria-label', 'Notifications');
      expect(container).toHaveAttribute('data-test', 'toast-container');
    });
  });
});
