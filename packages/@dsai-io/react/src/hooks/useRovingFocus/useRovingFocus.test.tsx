import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';

import { useRovingFocus } from './useRovingFocus';

function TestList({
  orientation = 'vertical',
  wrap = true,
  enabled = true,
}: {
  orientation?: 'vertical' | 'horizontal' | 'both';
  wrap?: boolean;
  enabled?: boolean;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const { containerProps } = useRovingFocus({
    containerRef: ref,
    orientation,
    wrap,
    homeEnd: true,
    itemSelector: '[role="option"]',
    disabledSelector: '[aria-disabled="true"]',
    enabled,
  });

  return (
    <div ref={ref} role="listbox" {...containerProps}>
      <div role="option" aria-selected={false} tabIndex={0}>
        Item 1
      </div>
      <div role="option" aria-selected={false} tabIndex={-1}>
        Item 2
      </div>
      <div role="option" aria-selected={false} tabIndex={-1}>
        Item 3
      </div>
      <div role="option" aria-selected={false} tabIndex={-1} aria-disabled="true">
        Disabled
      </div>
    </div>
  );
}

describe('useRovingFocus', () => {
  describe('Keyboard Navigation', () => {
    it('moves focus down with ArrowDown', async () => {
      render(<TestList />);
      const items = screen.getAllByRole('option');
      items[0].focus();

      await userEvent.keyboard('{ArrowDown}');
      expect(items[1]).toHaveFocus();
    });

    it('moves focus up with ArrowUp', async () => {
      render(<TestList />);
      const items = screen.getAllByRole('option');
      items[1].focus();

      await userEvent.keyboard('{ArrowUp}');
      expect(items[0]).toHaveFocus();
    });

    it('uses ArrowLeft/Right for horizontal orientation', async () => {
      render(<TestList orientation="horizontal" />);
      const items = screen.getAllByRole('option');
      items[0].focus();

      await userEvent.keyboard('{ArrowRight}');
      expect(items[1]).toHaveFocus();
    });

    it('moves focus left with ArrowLeft for horizontal orientation', async () => {
      render(<TestList orientation="horizontal" />);
      const items = screen.getAllByRole('option');
      items[1].focus();

      await userEvent.keyboard('{ArrowLeft}');
      expect(items[0]).toHaveFocus();
    });

    it('supports both orientation (ArrowDown and ArrowRight move forward)', async () => {
      render(<TestList orientation="both" />);
      const items = screen.getAllByRole('option');
      items[0].focus();

      await userEvent.keyboard('{ArrowDown}');
      expect(items[1]).toHaveFocus();

      await userEvent.keyboard('{ArrowLeft}');
      expect(items[0]).toHaveFocus();
    });
  });

  describe('Disabled Items', () => {
    it('skips disabled items', async () => {
      render(<TestList />);
      const items = screen.getAllByRole('option');
      items[2].focus(); // Item 3

      await userEvent.keyboard('{ArrowDown}');
      // Should skip Disabled and wrap to Item 1
      expect(items[0]).toHaveFocus();
    });
  });

  describe('Wrap Behavior', () => {
    it('wraps around at boundaries when wrap=true', async () => {
      render(<TestList wrap={true} />);
      const items = screen.getAllByRole('option');
      items[0].focus();

      await userEvent.keyboard('{ArrowUp}');
      // Should wrap to last non-disabled item (Item 3)
      expect(items[2]).toHaveFocus();
    });

    it('does not wrap when wrap=false', async () => {
      render(<TestList wrap={false} />);
      const items = screen.getAllByRole('option');
      items[0].focus();

      await userEvent.keyboard('{ArrowUp}');
      expect(items[0]).toHaveFocus(); // Should stay at first item
    });
  });

  describe('Home/End Keys', () => {
    it('jumps to first item on Home', async () => {
      render(<TestList />);
      const items = screen.getAllByRole('option');
      items[2].focus();

      await userEvent.keyboard('{Home}');
      expect(items[0]).toHaveFocus();
    });

    it('jumps to last non-disabled item on End', async () => {
      render(<TestList />);
      const items = screen.getAllByRole('option');
      items[0].focus();

      await userEvent.keyboard('{End}');
      expect(items[2]).toHaveFocus(); // Item 3 (skips Disabled)
    });

    it('ignores Home/End when homeEnd is false', async () => {
      function TestListNoHomeEnd() {
        const ref = useRef<HTMLUListElement>(null);
        const { containerProps } = useRovingFocus({
          containerRef: ref,
          homeEnd: false,
          itemSelector: '[role="option"]',
          enabled: true,
        });

        return (
          <div ref={ref} role="listbox" {...containerProps}>
            <div role="option" aria-selected={false} tabIndex={0}>Item 1</div>
            <div role="option" aria-selected={false} tabIndex={-1}>Item 2</div>
            <div role="option" aria-selected={false} tabIndex={-1}>Item 3</div>
          </div>
        );
      }

      render(<TestListNoHomeEnd />);
      const items = screen.getAllByRole('option');
      items[1].focus();

      await userEvent.keyboard('{Home}');
      expect(items[1]).toHaveFocus(); // Should stay
    });
  });

  describe('Configuration', () => {
    it('does nothing when disabled', async () => {
      render(<TestList enabled={false} />);
      const items = screen.getAllByRole('option');
      items[0].focus();

      await userEvent.keyboard('{ArrowDown}');
      expect(items[0]).toHaveFocus();
    });

    it('sets tabIndex correctly', async () => {
      render(<TestList />);
      const items = screen.getAllByRole('option');
      items[0].focus();

      await userEvent.keyboard('{ArrowDown}');
      expect(items[0]).toHaveAttribute('tabindex', '-1');
      expect(items[1]).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Imperative API', () => {
    it('setFocusedIndex moves focus programmatically', () => {
      function TestListWithRef() {
        const ref = useRef<HTMLUListElement>(null);
        const { containerProps, setFocusedIndex, focusedIndex } = useRovingFocus({
          containerRef: ref,
          itemSelector: '[role="option"]',
          enabled: true,
        });

        return (
          <>
            <div ref={ref} role="listbox" {...containerProps}>
              <div role="option" aria-selected={false} tabIndex={0}>Item 1</div>
              <div role="option" aria-selected={false} tabIndex={-1}>Item 2</div>
              <div role="option" aria-selected={false} tabIndex={-1}>Item 3</div>
            </div>
            <button onClick={() => setFocusedIndex(2)}>Focus Third</button>
            <span data-testid="index">{focusedIndex}</span>
          </>
        );
      }

      render(<TestListWithRef />);
      fireEvent.click(screen.getByText('Focus Third'));
      const items = screen.getAllByRole('option');
      expect(items[2]).toHaveFocus();
      expect(items[2]).toHaveAttribute('tabindex', '0');
      expect(screen.getByTestId('index')).toHaveTextContent('2');
    });
  });
});
