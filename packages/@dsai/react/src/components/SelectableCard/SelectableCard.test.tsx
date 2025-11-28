/**
 * @jest-environment jsdom
 */

/**
 * SelectableCard Component Tests
 *
 * Tests for the SelectableCard component covering:
 * - Selection modes (none, checkbox, radio)
 * - Controlled and uncontrolled behavior
 * - Click and keyboard interactions
 * - Disabled and error states
 * - Accessibility compliance
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { useState } from 'react';

import { SelectableCard } from './SelectableCard';

expect.extend(toHaveNoViolations);

/**
 * Helper to get the card container element.
 * - For selectionMode='none', the card is an article element
 * - For selectionMode='checkbox' or 'radio', the card is a label element
 */
function getCard(container: HTMLElement): HTMLElement {
  // First try to find the article (selectionMode='none')
  const article = container.querySelector('article');
  if (article) return article;

  // Otherwise find the label (selectionMode='checkbox' or 'radio')
  const label = container.querySelector('label.card');
  if (label) return label as HTMLElement;

  throw new Error('Could not find card element');
}

describe('SelectableCard', () => {
  // ===========================================================================
  // Basic Rendering
  // ===========================================================================

  describe('Basic Rendering', () => {
    it('renders with title and description', () => {
      render(<SelectableCard title="Premium Plan" description="$29/month billed annually" />);

      expect(screen.getByText('Premium Plan')).toBeInTheDocument();
      expect(screen.getByText('$29/month billed annually')).toBeInTheDocument();
    });

    it('renders with subtitle', () => {
      render(
        <SelectableCard title="Premium Plan" subtitle="Most popular" description="$29/month" />
      );

      expect(screen.getByText('Most popular')).toBeInTheDocument();
    });

    it('renders with custom children', () => {
      render(
        <SelectableCard>
          <div data-testid="custom-content">Custom content</div>
        </SelectableCard>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('renders with media', () => {
      render(
        <SelectableCard
          title="Plan"
          media={<img src="icon.png" alt="plan icon" data-testid="media" />}
        />
      );

      expect(screen.getByTestId('media')).toBeInTheDocument();
    });

    it('renders with footer', () => {
      render(<SelectableCard title="Plan" footer={<button type="button">Learn more</button>} />);

      expect(screen.getByRole('button', { name: 'Learn more' })).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Selection Mode: None
  // ===========================================================================

  describe('Selection Mode: None (default)', () => {
    it('renders without selection control by default', () => {
      render(<SelectableCard title="Info Card" />);

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
      expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    });

    it('renders as article when selectionMode is none', () => {
      const { container } = render(<SelectableCard selectionMode="none" title="Info Card" />);

      const card = getCard(container);
      expect(card.tagName).toBe('ARTICLE');
      expect(card).not.toHaveClass('selectable-card--interactive');
    });
  });

  // ===========================================================================
  // Selection Mode: Checkbox
  // ===========================================================================

  describe('Selection Mode: Checkbox', () => {
    it('renders checkbox when selectionMode is checkbox', () => {
      render(<SelectableCard selectionMode="checkbox" value="plan1" title="Premium Plan" />);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('checkbox is unchecked by default', () => {
      render(<SelectableCard selectionMode="checkbox" value="plan1" title="Premium Plan" />);

      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('checkbox respects defaultChecked (uncontrolled)', () => {
      render(
        <SelectableCard
          selectionMode="checkbox"
          value="plan1"
          title="Premium Plan"
          defaultChecked
        />
      );

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('toggles checkbox on click', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <SelectableCard selectionMode="checkbox" value="plan1" title="Premium Plan" />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      // Click on the card (label)
      const card = getCard(container);
      await user.click(card);

      expect(checkbox).toBeChecked();

      // Click again to uncheck
      await user.click(card);
      expect(checkbox).not.toBeChecked();
    });

    it('calls onChange when toggled', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      const { container } = render(
        <SelectableCard
          selectionMode="checkbox"
          value="plan1"
          title="Premium Plan"
          onChange={handleChange}
        />
      );

      const card = getCard(container);
      await user.click(card);

      expect(handleChange).toHaveBeenCalledWith(true);

      await user.click(card);
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('works in controlled mode', async () => {
      function ControlledTest() {
        const [checked, setChecked] = useState(false);
        return (
          <SelectableCard
            selectionMode="checkbox"
            value="plan1"
            title="Premium Plan"
            checked={checked}
            onChange={setChecked}
          />
        );
      }

      const user = userEvent.setup();
      const { container } = render(<ControlledTest />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      const card = getCard(container);
      await user.click(card);

      expect(checkbox).toBeChecked();
    });

    it('clicking directly on checkbox toggles selection', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <SelectableCard
          selectionMode="checkbox"
          value="plan1"
          title="Premium Plan"
          onChange={handleChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  // ===========================================================================
  // Selection Mode: Radio
  // ===========================================================================

  describe('Selection Mode: Radio', () => {
    it('renders radio when selectionMode is radio', () => {
      render(
        <SelectableCard selectionMode="radio" value="plan1" name="plans" title="Premium Plan" />
      );

      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('radio is unchecked by default', () => {
      render(
        <SelectableCard selectionMode="radio" value="plan1" name="plans" title="Premium Plan" />
      );

      expect(screen.getByRole('radio')).not.toBeChecked();
    });

    it('selects on click (cannot deselect)', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      const { container } = render(
        <SelectableCard
          selectionMode="radio"
          value="plan1"
          name="plans"
          title="Premium Plan"
          onChange={handleChange}
        />
      );

      const card = getCard(container);
      await user.click(card);

      expect(handleChange).toHaveBeenCalledWith(true);
      handleChange.mockClear();

      // Click again - should not call onChange (already selected)
      await user.click(card);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('radio group behavior works correctly', () => {
      render(
        <div>
          <SelectableCard
            selectionMode="radio"
            value="plan1"
            name="plans"
            title="Basic"
            defaultChecked
          />
          <SelectableCard selectionMode="radio" value="plan2" name="plans" title="Premium" />
        </div>
      );

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });
  });

  // ===========================================================================
  // Disabled State
  // ===========================================================================

  describe('Disabled State', () => {
    it('checkbox is disabled when disabled prop is true', () => {
      render(
        <SelectableCard selectionMode="checkbox" value="plan1" title="Premium Plan" disabled />
      );

      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('radio is disabled when disabled prop is true', () => {
      render(
        <SelectableCard
          selectionMode="radio"
          value="plan1"
          name="plans"
          title="Premium Plan"
          disabled
        />
      );

      expect(screen.getByRole('radio')).toBeDisabled();
    });

    it('does not toggle when disabled', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      const { container } = render(
        <SelectableCard
          selectionMode="checkbox"
          value="plan1"
          title="Premium Plan"
          onChange={handleChange}
          disabled
        />
      );

      const card = getCard(container);
      await user.click(card);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('adds disabled class to card', () => {
      const { container } = render(
        <SelectableCard selectionMode="checkbox" value="plan1" title="Premium Plan" disabled />
      );

      const card = getCard(container);
      expect(card).toHaveClass('selectable-card--disabled');
    });
  });

  // ===========================================================================
  // Error State
  // ===========================================================================

  describe('Error State', () => {
    it('adds error class when error prop is true', () => {
      const { container } = render(
        <SelectableCard selectionMode="checkbox" value="plan1" title="Premium Plan" error />
      );

      const card = getCard(container);
      expect(card).toHaveClass('selectable-card--error');
    });
  });

  // ===========================================================================
  // Required State
  // ===========================================================================

  describe('Required State', () => {
    it('shows required indicator when required', () => {
      render(
        <SelectableCard selectionMode="checkbox" value="plan1" title="Premium Plan" required />
      );

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('checkbox has required attribute', () => {
      render(
        <SelectableCard selectionMode="checkbox" value="plan1" title="Premium Plan" required />
      );

      expect(screen.getByRole('checkbox')).toHaveAttribute('required');
    });
  });

  // ===========================================================================
  // Visual States
  // ===========================================================================

  describe('Visual States', () => {
    it('adds selected class when checked', () => {
      const { container } = render(
        <SelectableCard
          selectionMode="checkbox"
          value="plan1"
          title="Premium Plan"
          defaultChecked
        />
      );

      const card = getCard(container);
      expect(card).toHaveClass('selectable-card--selected');
    });

    it('adds interactive class when selectionMode is not none', () => {
      const { container } = render(
        <SelectableCard selectionMode="checkbox" value="plan1" title="Premium Plan" />
      );

      const card = getCard(container);
      expect(card).toHaveClass('selectable-card--interactive');
    });
  });

  // ===========================================================================
  // Callbacks
  // ===========================================================================

  describe('Callbacks', () => {
    it('calls onCardClick after selection toggle', async () => {
      const handleCardClick = jest.fn();
      const handleChange = jest.fn();
      const user = userEvent.setup();

      const { container } = render(
        <SelectableCard
          selectionMode="checkbox"
          value="plan1"
          title="Premium Plan"
          onChange={handleChange}
          onCardClick={handleCardClick}
        />
      );

      const card = getCard(container);
      await user.click(card);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleCardClick).toHaveBeenCalledTimes(1);
    });
  });

  // ===========================================================================
  // Accessibility
  // ===========================================================================

  describe('Accessibility', () => {
    it('has no axe violations (checkbox mode)', async () => {
      const { container } = render(
        <SelectableCard
          selectionMode="checkbox"
          value="plan1"
          title="Premium Plan"
          description="$29/month"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations (radio mode)', async () => {
      const { container } = render(
        <SelectableCard
          selectionMode="radio"
          value="plan1"
          name="plans"
          title="Premium Plan"
          description="$29/month"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations (disabled)', async () => {
      const { container } = render(
        <SelectableCard selectionMode="checkbox" value="plan1" title="Premium Plan" disabled />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports aria-label when no title', () => {
      const { container } = render(
        <SelectableCard selectionMode="checkbox" value="plan1" aria-label="Select premium plan" />
      );

      const card = getCard(container);
      expect(card).toHaveAttribute('aria-label', 'Select premium plan');
    });

    it('checkbox is accessible by label', () => {
      render(<SelectableCard selectionMode="checkbox" value="plan1" title="Premium Plan" />);

      // The checkbox should be associated with the card's content
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Development Warnings
  // ===========================================================================

  describe('Development Warnings', () => {
    const originalWarn = console.warn;

    beforeEach(() => {
      console.warn = jest.fn();
    });

    afterEach(() => {
      console.warn = originalWarn;
    });

    it('warns when checkbox mode has no value', () => {
      render(<SelectableCard selectionMode="checkbox" title="Plan" />);

      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('no "value" prop'));
    });

    it('warns when radio mode has no name', () => {
      render(<SelectableCard selectionMode="radio" value="plan1" title="Plan" />);

      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('no "name" prop'));
    });
  });
});
