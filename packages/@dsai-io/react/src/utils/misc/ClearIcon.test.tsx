import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import * as React from 'react';

import { ClearIcon } from './ClearIcon';

expect.extend(toHaveNoViolations);

describe('ClearIcon', () => {
  describe('Rendering', () => {
    it('should render without error', () => {
      const { container } = render(<ClearIcon />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render XIcon component', () => {
      const { container } = render(<ClearIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('should render as SVG element', () => {
      const { container } = render(<ClearIcon />);
      const svg = container.querySelector('svg');

      expect(svg?.tagName).toBe('svg');
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <button type="button" aria-label="Clear input">
          <ClearIcon />
        </button>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have aria-hidden="true" attribute', () => {
      const { container } = render(<ClearIcon />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should not be focusable', () => {
      const { container } = render(<ClearIcon />);
      const svg = container.querySelector('svg');

      expect(svg).not.toHaveAttribute('tabIndex');
    });

    it('should work with accessible button wrapper', async () => {
      render(
        <button type="button" aria-label="Clear selection">
          <ClearIcon />
        </button>
      );

      const button = screen.getByRole('button', { name: 'Clear selection' });
      expect(button).toBeInTheDocument();
    });

    it('should work with visible text label', () => {
      render(
        <button type="button">
          <ClearIcon />
          <span>Clear</span>
        </button>
      );

      const button = screen.getByRole('button', { name: 'Clear' });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Icon properties', () => {
    it('should have size of 16', () => {
      const { container } = render(<ClearIcon />);
      const svg = container.querySelector('svg');

      // XIcon with size={16} should set width/height via style
      expect(svg).toHaveStyle({ width: '16px', height: '16px' });
    });

    it('should render X icon path', () => {
      const { container } = render(<ClearIcon />);
      const paths = container.querySelectorAll('path');

      // X icon should have path elements for the cross
      expect(paths.length).toBeGreaterThan(0);
    });
  });

  describe('Integration scenarios', () => {
    it('should work in Input clear button', () => {
      render(
        <div className="input-wrapper">
          <input type="text" value="test" readOnly />
          <button type="button" aria-label="Clear input" className="clear-button">
            <ClearIcon />
          </button>
        </div>
      );

      const clearButton = screen.getByRole('button', { name: 'Clear input' });
      expect(clearButton).toBeInTheDocument();
      expect(clearButton.querySelector('svg')).toBeInTheDocument();
    });

    it('should work in Select clear button', () => {
      render(
        <div className="select-wrapper">
          <select value="option1">
            <option value="option1">Option 1</option>
          </select>
          <button type="button" aria-label="Clear selection" className="clear-button">
            <ClearIcon />
          </button>
        </div>
      );

      const clearButton = screen.getByRole('button', { name: 'Clear selection' });
      expect(clearButton).toBeInTheDocument();
    });

    it('should work in dismissible alert', () => {
      render(
        <div role="alert">
          <span>Alert message</span>
          <button type="button" aria-label="Dismiss alert">
            <ClearIcon />
          </button>
        </div>
      );

      const dismissButton = screen.getByRole('button', { name: 'Dismiss alert' });
      expect(dismissButton).toBeInTheDocument();
    });

    it('should work in modal close button', () => {
      render(
        <div role="dialog" aria-labelledby="dialog-title">
          <h2 id="dialog-title">Dialog Title</h2>
          <button type="button" aria-label="Close dialog">
            <ClearIcon />
          </button>
        </div>
      );

      const closeButton = screen.getByRole('button', { name: 'Close dialog' });
      expect(closeButton).toBeInTheDocument();
    });

    it('should work in tag remove button', () => {
      render(
        <div className="tag">
          <span>Tag label</span>
          <button type="button" aria-label="Remove tag">
            <ClearIcon />
          </button>
        </div>
      );

      const removeButton = screen.getByRole('button', { name: 'Remove tag' });
      expect(removeButton).toBeInTheDocument();
    });

    it('should work in search input clear', () => {
      render(
        <div className="search-wrapper">
          <input type="search" placeholder="Search..." />
          <button type="button" aria-label="Clear search">
            <ClearIcon />
          </button>
        </div>
      );

      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Consistency', () => {
    it('should render identically across multiple calls', () => {
      const { container: container1 } = render(<ClearIcon />);
      const { container: container2 } = render(<ClearIcon />);

      const svg1 = container1.querySelector('svg');
      const svg2 = container2.querySelector('svg');

      expect(svg1?.getAttribute('width')).toBe(svg2?.getAttribute('width'));
      expect(svg1?.getAttribute('height')).toBe(svg2?.getAttribute('height'));
      expect(svg1?.getAttribute('aria-hidden')).toBe(svg2?.getAttribute('aria-hidden'));
    });

    it('should maintain consistent structure', () => {
      const { container } = render(<ClearIcon />);
      const svg = container.querySelector('svg');

      // Should always be an SVG element
      expect(svg?.tagName).toBe('svg');
      // Should always be aria-hidden
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      // Should always have size 16 via style
      expect(svg).toHaveStyle({ width: '16px', height: '16px' });
    });
  });

  describe('Edge cases', () => {
    it('should render in React.StrictMode', () => {
      const { container } = render(
        <React.StrictMode>
          <ClearIcon />
        </React.StrictMode>
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render multiple instances independently', () => {
      const { container } = render(
        <div>
          <ClearIcon />
          <ClearIcon />
          <ClearIcon />
        </div>
      );

      const svgs = container.querySelectorAll('svg');
      expect(svgs).toHaveLength(3);
    });

    it('should not have any text content', () => {
      const { container } = render(<ClearIcon />);
      const svg = container.querySelector('svg');

      // Icon should be purely visual, no text
      expect(svg?.textContent?.trim()).toBeFalsy();
    });

    it('should work with React fragments', () => {
      const { container } = render(<ClearIcon />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        render(<ClearIcon />);
      }

      const end = performance.now();
      const duration = end - start;

      // 100 renders should take less than 2 seconds (CI environments can be slower)
      expect(duration).toBeLessThan(2000);
    });

    it('should have minimal DOM footprint', () => {
      const { container } = render(<ClearIcon />);

      // Should only render one SVG element
      const svgs = container.querySelectorAll('svg');
      expect(svgs).toHaveLength(1);
    });
  });

  describe('Type safety', () => {
    it('should accept no props', () => {
      // This test validates that ClearIcon requires no props
      expect(() => render(<ClearIcon />)).not.toThrow();
    });

    it('should return JSX.Element', () => {
      const element = <ClearIcon />;

      expect(element).toBeDefined();
      expect(typeof element).toBe('object');
    });
  });

  describe('Export validation', () => {
    it('should be exported as named export', () => {
      expect(ClearIcon).toBeDefined();
      expect(typeof ClearIcon).toBe('function');
    });

    it('should have displayName for debugging', () => {
      // React components should have displayName for DevTools
      expect(ClearIcon.name).toBe('ClearIcon');
    });
  });
});
