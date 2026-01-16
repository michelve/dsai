/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef, useState } from 'react';

import { CardList } from './CardList';

import type { CardListItem } from './CardList.types';

expect.extend(toHaveNoViolations);

// Test data
const defaultItems: CardListItem[] = [
  { value: 'basic', title: 'Basic Plan', description: '$9/month' },
  { value: 'pro', title: 'Pro Plan', description: '$29/month' },
  { value: 'enterprise', title: 'Enterprise', description: 'Custom pricing' },
];

const itemsWithDisabled: CardListItem[] = [
  { value: 'basic', title: 'Basic Plan', description: '$9/month' },
  { value: 'pro', title: 'Pro Plan', description: '$29/month', disabled: true },
  { value: 'enterprise', title: 'Enterprise', description: 'Custom pricing' },
];

const itemsWithMedia: CardListItem[] = [
  {
    value: 'photo',
    title: 'Photo',
    description: 'Upload photos',
    media: <img src="/photo.png" alt="Camera icon" />,
  },
  {
    value: 'video',
    title: 'Video',
    description: 'Upload videos',
    media: <img src="/video.png" alt="Camcorder icon" />,
  },
];

describe('CardList', () => {
  // ===========================================================================
  // Basic Rendering
  // ===========================================================================

  describe('Basic Rendering', () => {
    it('renders with label and items', () => {
      render(<CardList label="Choose a plan" items={defaultItems} />);

      expect(screen.getByText('Choose a plan')).toBeInTheDocument();
      expect(screen.getByText('Basic Plan')).toBeInTheDocument();
      expect(screen.getByText('Pro Plan')).toBeInTheDocument();
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
    });

    it('renders as fieldset', () => {
      const { container } = render(<CardList label="Choose a plan" items={defaultItems} />);

      expect(container.querySelector('fieldset')).toBeInTheDocument();
      expect(container.querySelector('legend')).toBeInTheDocument();
    });

    it('renders helper text', () => {
      render(
        <CardList
          label="Choose a plan"
          helperText="Select the plan that works for you"
          items={defaultItems}
        />
      );

      expect(screen.getByText('Select the plan that works for you')).toBeInTheDocument();
    });

    it('renders required indicator when selectionMode is not none', () => {
      const { container } = render(
        <CardList label="Choose a plan" items={defaultItems} selectionMode="single" required />
      );

      // The legend should have the required indicator
      const legend = container.querySelector('legend');
      expect(legend).toBeInTheDocument();
      expect(legend?.querySelector('.text-danger')).toBeInTheDocument();
    });

    it('does not render required indicator when selectionMode is none', () => {
      render(<CardList label="Choose a plan" items={defaultItems} selectionMode="none" required />);

      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('renders error message', () => {
      render(
        <CardList
          label="Choose a plan"
          items={defaultItems}
          error
          errorMessage="Please select a plan"
        />
      );

      expect(screen.getByText('Please select a plan')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <CardList label="Choose a plan" items={defaultItems} className="custom-class" />
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('applies custom style', () => {
      const { container } = render(
        <CardList label="Choose a plan" items={defaultItems} style={{ marginTop: '20px' }} />
      );

      expect(container.querySelector('fieldset')).toHaveStyle({ marginTop: '20px' });
    });

    it('renders item descriptions', () => {
      render(<CardList label="Plans" items={defaultItems} />);

      expect(screen.getByText('$9/month')).toBeInTheDocument();
      expect(screen.getByText('$29/month')).toBeInTheDocument();
      expect(screen.getByText('Custom pricing')).toBeInTheDocument();
    });

    it('renders items with media', () => {
      render(<CardList label="Upload type" items={itemsWithMedia} />);

      expect(screen.getByAltText('Camera icon')).toBeInTheDocument();
      expect(screen.getByAltText('Camcorder icon')).toBeInTheDocument();
    });

    it('renders items with custom children', () => {
      const itemsWithChildren: CardListItem[] = [
        {
          value: 'custom',
          title: 'Custom',
          children: <span data-testid="custom-child">Custom content</span>,
        },
      ];

      render(<CardList label="Options" items={itemsWithChildren} />);

      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Selection Mode: None (Display Only)
  // ===========================================================================

  describe('Selection Mode: None', () => {
    it('renders cards without inputs when selectionMode is none', () => {
      const { container } = render(
        <CardList label="Plans" items={defaultItems} selectionMode="none" />
      );

      expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(0);
      expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(0);
    });

    it('renders cards as articles when selectionMode is none', () => {
      const { container } = render(
        <CardList label="Plans" items={defaultItems} selectionMode="none" />
      );

      expect(container.querySelectorAll('article.card')).toHaveLength(3);
    });
  });

  // ===========================================================================
  // Selection Mode: Single (Radio-like)
  // ===========================================================================

  describe('Selection Mode: Single', () => {
    it('renders radio inputs for each item', () => {
      const { container } = render(
        <CardList label="Plans" items={defaultItems} selectionMode="single" />
      );

      expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(3);
    });

    it('allows selecting a single item', async () => {
      const handleChange = jest.fn();
      render(
        <CardList
          label="Plans"
          items={defaultItems}
          selectionMode="single"
          onChange={handleChange}
        />
      );

      const basicRadio = screen.getByRole('radio', { name: /basic plan/i });
      await userEvent.click(basicRadio);

      expect(handleChange).toHaveBeenCalledWith('basic');
    });

    it('switches selection when different item is clicked', async () => {
      const handleChange = jest.fn();
      render(
        <CardList
          label="Plans"
          items={defaultItems}
          selectionMode="single"
          value="basic"
          onChange={handleChange}
        />
      );

      const proRadio = screen.getByRole('radio', { name: /pro plan/i });
      await userEvent.click(proRadio);

      expect(handleChange).toHaveBeenCalledWith('pro');
    });

    it('applies name attribute to radio inputs', () => {
      const { container } = render(
        <CardList label="Plans" items={defaultItems} selectionMode="single" name="selected-plan" />
      );

      const radios = container.querySelectorAll('input[type="radio"]');
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute('name', 'selected-plan');
      });
    });

    it('derives a radio name when none is provided', () => {
      const { container } = render(
        <CardList id="pricing" label="Plans" items={defaultItems} selectionMode="single" />
      );

      const radios = container.querySelectorAll('input[type="radio"]');
      expect(radios).toHaveLength(3);
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute('name', 'pricing-group');
      });
    });
  });

  // ===========================================================================
  // Selection Mode: Multiple (Checkbox-like)
  // ===========================================================================

  describe('Selection Mode: Multiple', () => {
    it('renders checkbox inputs for each item', () => {
      const { container } = render(
        <CardList label="Features" items={defaultItems} selectionMode="multiple" />
      );

      expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(3);
    });

    it('allows selecting multiple items', async () => {
      const handleChange = jest.fn();
      render(
        <CardList
          label="Features"
          items={defaultItems}
          selectionMode="multiple"
          value={[]}
          onChange={handleChange}
        />
      );

      const basicCheckbox = screen.getByRole('checkbox', { name: /basic plan/i });
      await userEvent.click(basicCheckbox);

      expect(handleChange).toHaveBeenCalledWith(['basic']);
    });

    it('allows toggling items', async () => {
      const handleChange = jest.fn();
      render(
        <CardList
          label="Features"
          items={defaultItems}
          selectionMode="multiple"
          value={['basic']}
          onChange={handleChange}
        />
      );

      const proCheckbox = screen.getByRole('checkbox', { name: /pro plan/i });
      await userEvent.click(proCheckbox);

      expect(handleChange).toHaveBeenCalledWith(['basic', 'pro']);
    });

    it('allows deselecting items', async () => {
      const handleChange = jest.fn();
      render(
        <CardList
          label="Features"
          items={defaultItems}
          selectionMode="multiple"
          value={['basic', 'pro']}
          onChange={handleChange}
        />
      );

      const basicCheckbox = screen.getByRole('checkbox', { name: /basic plan/i });
      await userEvent.click(basicCheckbox);

      expect(handleChange).toHaveBeenCalledWith(['pro']);
    });
  });

  // ===========================================================================
  // Controlled Mode
  // ===========================================================================

  describe('Controlled Mode', () => {
    it('reflects controlled value in single mode', () => {
      render(<CardList label="Plans" items={defaultItems} selectionMode="single" value="pro" />);

      expect(screen.getByRole('radio', { name: /pro plan/i })).toBeChecked();
      expect(screen.getByRole('radio', { name: /basic plan/i })).not.toBeChecked();
    });

    it('reflects controlled value in multiple mode', () => {
      render(
        <CardList
          label="Features"
          items={defaultItems}
          selectionMode="multiple"
          value={['basic', 'enterprise']}
        />
      );

      expect(screen.getByRole('checkbox', { name: /basic plan/i })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /enterprise/i })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /pro plan/i })).not.toBeChecked();
    });

    it('updates when value prop changes', () => {
      const { rerender } = render(
        <CardList label="Plans" items={defaultItems} selectionMode="single" value="basic" />
      );

      expect(screen.getByRole('radio', { name: /basic plan/i })).toBeChecked();

      rerender(<CardList label="Plans" items={defaultItems} selectionMode="single" value="pro" />);

      expect(screen.getByRole('radio', { name: /pro plan/i })).toBeChecked();
      expect(screen.getByRole('radio', { name: /basic plan/i })).not.toBeChecked();
    });

    it('works with useState in single mode', async () => {
      function ControlledSingleList() {
        const [selected, setSelected] = useState<string | undefined>(undefined);
        return (
          <CardList
            label="Plans"
            items={defaultItems}
            selectionMode="single"
            value={selected}
            onChange={(val) => setSelected(val as string | undefined)}
          />
        );
      }

      render(<ControlledSingleList />);

      expect(screen.getByRole('radio', { name: /basic plan/i })).not.toBeChecked();

      await userEvent.click(screen.getByRole('radio', { name: /basic plan/i }));
      expect(screen.getByRole('radio', { name: /basic plan/i })).toBeChecked();

      await userEvent.click(screen.getByRole('radio', { name: /pro plan/i }));
      expect(screen.getByRole('radio', { name: /pro plan/i })).toBeChecked();
      expect(screen.getByRole('radio', { name: /basic plan/i })).not.toBeChecked();
    });

    it('works with useState in multiple mode', async () => {
      function ControlledMultipleList() {
        const [selected, setSelected] = useState<string[]>([]);
        return (
          <CardList
            label="Features"
            items={defaultItems}
            selectionMode="multiple"
            value={selected}
            onChange={(val) => setSelected(val as string[])}
          />
        );
      }

      render(<ControlledMultipleList />);

      await userEvent.click(screen.getByRole('checkbox', { name: /basic plan/i }));
      expect(screen.getByRole('checkbox', { name: /basic plan/i })).toBeChecked();

      await userEvent.click(screen.getByRole('checkbox', { name: /pro plan/i }));
      expect(screen.getByRole('checkbox', { name: /pro plan/i })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /basic plan/i })).toBeChecked();

      await userEvent.click(screen.getByRole('checkbox', { name: /basic plan/i }));
      expect(screen.getByRole('checkbox', { name: /basic plan/i })).not.toBeChecked();
    });
  });

  // ===========================================================================
  // Uncontrolled Mode
  // ===========================================================================

  describe('Uncontrolled Mode', () => {
    it('uses defaultValue for initial state in single mode', () => {
      render(
        <CardList
          label="Plans"
          items={defaultItems}
          selectionMode="single"
          defaultValue="enterprise"
        />
      );

      expect(screen.getByRole('radio', { name: /enterprise/i })).toBeChecked();
    });

    it('uses defaultValue for initial state in multiple mode', () => {
      render(
        <CardList
          label="Features"
          items={defaultItems}
          selectionMode="multiple"
          defaultValue={['basic', 'pro']}
        />
      );

      expect(screen.getByRole('checkbox', { name: /basic plan/i })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /pro plan/i })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /enterprise/i })).not.toBeChecked();
    });

    it('toggles items in uncontrolled multiple mode', async () => {
      render(
        <CardList
          label="Features"
          items={defaultItems}
          selectionMode="multiple"
          defaultValue={[]}
        />
      );

      await userEvent.click(screen.getByRole('checkbox', { name: /basic plan/i }));
      expect(screen.getByRole('checkbox', { name: /basic plan/i })).toBeChecked();

      await userEvent.click(screen.getByRole('checkbox', { name: /basic plan/i }));
      expect(screen.getByRole('checkbox', { name: /basic plan/i })).not.toBeChecked();
    });

    it('calls onChange in uncontrolled mode', async () => {
      const handleChange = jest.fn();
      render(
        <CardList
          label="Plans"
          items={defaultItems}
          selectionMode="single"
          defaultValue={undefined}
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByRole('radio', { name: /basic plan/i }));

      expect(handleChange).toHaveBeenCalledWith('basic');
    });
  });

  // ===========================================================================
  // Disabled State
  // ===========================================================================

  describe('Disabled State', () => {
    it('disables all inputs when disabled prop is true', () => {
      render(<CardList label="Plans" items={defaultItems} selectionMode="single" disabled />);

      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    it('disables fieldset when disabled prop is true', () => {
      const { container } = render(
        <CardList label="Plans" items={defaultItems} selectionMode="single" disabled />
      );

      expect(container.querySelector('fieldset')).toBeDisabled();
    });

    it('disables individual items', () => {
      render(<CardList label="Plans" items={itemsWithDisabled} selectionMode="single" />);

      expect(screen.getByRole('radio', { name: /basic plan/i })).not.toBeDisabled();
      expect(screen.getByRole('radio', { name: /pro plan/i })).toBeDisabled();
      expect(screen.getByRole('radio', { name: /enterprise/i })).not.toBeDisabled();
    });

    it('does not call onChange for disabled items', async () => {
      const handleChange = jest.fn();
      render(
        <CardList
          label="Plans"
          items={itemsWithDisabled}
          selectionMode="single"
          onChange={handleChange}
        />
      );

      const proRadio = screen.getByRole('radio', { name: /pro plan/i });
      await userEvent.click(proRadio);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // FSM Integration
  // ===========================================================================

  describe('FSM Integration', () => {
    it('exposes data-visual-state attribute', () => {
      const { container } = render(
        <CardList
          label="Features"
          items={defaultItems}
          selectionMode="multiple"
          value={['basic']}
        />
      );

      const cardsContainer = container.querySelector('[data-visual-state]');
      expect(cardsContainer).toHaveAttribute('data-visual-state', 'one');
    });

    it('data-visual-state is "none" when nothing selected', () => {
      const { container } = render(
        <CardList label="Features" items={defaultItems} selectionMode="multiple" value={[]} />
      );

      const cardsContainer = container.querySelector('[data-visual-state]');
      expect(cardsContainer).toHaveAttribute('data-visual-state', 'none');
    });

    it('data-visual-state is "some" when some selected', () => {
      const { container } = render(
        <CardList
          label="Features"
          items={defaultItems}
          selectionMode="multiple"
          value={['basic', 'pro']}
        />
      );

      const cardsContainer = container.querySelector('[data-visual-state]');
      expect(cardsContainer).toHaveAttribute('data-visual-state', 'some');
    });

    it('data-visual-state is "all" when all selected', () => {
      const { container } = render(
        <CardList
          label="Features"
          items={defaultItems}
          selectionMode="multiple"
          value={['basic', 'pro', 'enterprise']}
        />
      );

      const cardsContainer = container.querySelector('[data-visual-state]');
      expect(cardsContainer).toHaveAttribute('data-visual-state', 'all');
    });

    it('transitions from none to one to some to all', async () => {
      const { container } = render(
        <CardList
          label="Features"
          items={defaultItems}
          selectionMode="multiple"
          defaultValue={[]}
        />
      );

      const cardsContainer = container.querySelector('[data-visual-state]');

      expect(cardsContainer).toHaveAttribute('data-visual-state', 'none');

      await userEvent.click(screen.getByRole('checkbox', { name: /basic plan/i }));
      expect(cardsContainer).toHaveAttribute('data-visual-state', 'one');

      await userEvent.click(screen.getByRole('checkbox', { name: /pro plan/i }));
      expect(cardsContainer).toHaveAttribute('data-visual-state', 'some');

      await userEvent.click(screen.getByRole('checkbox', { name: /enterprise/i }));
      expect(cardsContainer).toHaveAttribute('data-visual-state', 'all');
    });

    it('data-visual-state is "one" in single mode with selection', () => {
      const { container } = render(
        <CardList label="Plans" items={defaultItems} selectionMode="single" value="basic" />
      );

      const cardsContainer = container.querySelector('[data-visual-state]');
      expect(cardsContainer).toHaveAttribute('data-visual-state', 'one');
    });
  });

  // ===========================================================================
  // Layout Options
  // ===========================================================================

  describe('Layout Options', () => {
    it('renders with vertical orientation by default', () => {
      const { container } = render(<CardList label="Plans" items={defaultItems} />);

      const cardsContainer = container.querySelector('.card-list-container');
      expect(cardsContainer).toHaveStyle({ flexDirection: 'column' });
    });

    it('renders with horizontal orientation', () => {
      const { container } = render(
        <CardList label="Plans" items={defaultItems} orientation="horizontal" />
      );

      const cardsContainer = container.querySelector('.card-list-container');
      expect(cardsContainer).toHaveStyle({ display: 'flex', flexWrap: 'wrap' });
    });

    it('renders with grid columns', () => {
      const { container } = render(<CardList label="Plans" items={defaultItems} columns={2} />);

      const cardsContainer = container.querySelector('.card-list-container');
      expect(cardsContainer).toHaveStyle({
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
      });
    });

    it('applies custom gap', () => {
      const { container } = render(<CardList label="Plans" items={defaultItems} gap="1rem" />);

      const cardsContainer = container.querySelector('.card-list-container');
      expect(cardsContainer).toHaveStyle({ gap: '1rem' });
    });
  });

  // ===========================================================================
  // Card Variant
  // ===========================================================================

  describe('Card Variant', () => {
    it('passes variant prop to SelectableCards', () => {
      const { container } = render(
        <CardList label="Plans" items={defaultItems} variant="elevated" />
      );

      const cards = container.querySelectorAll('.card');
      cards.forEach((card) => {
        expect(card).toHaveClass('shadow-sm');
      });
    });
  });

  // ===========================================================================
  // Accessibility (WCAG 2.2 AA)
  // ===========================================================================

  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations with label', async () => {
      const { container } = render(<CardList label="Choose a plan" items={defaultItems} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations in single selection mode', async () => {
      const { container } = render(
        <CardList label="Choose a plan" items={defaultItems} selectionMode="single" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations in multiple selection mode', async () => {
      const { container } = render(
        <CardList label="Select features" items={defaultItems} selectionMode="multiple" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with error state', async () => {
      const { container } = render(
        <CardList
          label="Choose a plan"
          items={defaultItems}
          selectionMode="single"
          error
          errorMessage="Please select a plan"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with disabled items', async () => {
      const { container } = render(
        <CardList label="Choose a plan" items={itemsWithDisabled} selectionMode="single" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with aria-label only', async () => {
      const { container } = render(
        <CardList aria-label="Plan selection" items={defaultItems} selectionMode="single" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('sets aria-invalid when error', () => {
      const { container } = render(<CardList label="Plans" items={defaultItems} error />);

      expect(container.querySelector('fieldset')).toHaveAttribute('aria-invalid', 'true');
    });

    it('links helper text via aria-describedby', () => {
      const { container } = render(
        <CardList label="Plans" items={defaultItems} helperText="Choose the best option" />
      );

      const fieldset = container.querySelector('fieldset');
      const describedby = fieldset?.getAttribute('aria-describedby');
      expect(describedby).toBeTruthy();
      const helperElement = describedby ? document.getElementById(describedby) : null;
      expect(helperElement).toHaveTextContent('Choose the best option');
    });

    it('links error message via aria-describedby', () => {
      const { container } = render(
        <CardList label="Plans" items={defaultItems} error errorMessage="Selection required" />
      );

      const fieldset = container.querySelector('fieldset');
      const describedby = fieldset?.getAttribute('aria-describedby');
      expect(describedby).toBeTruthy();
      const errorElement = describedby ? document.getElementById(describedby) : null;
      expect(errorElement).toHaveTextContent('Selection required');
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================

  describe('Ref Forwarding', () => {
    it('forwards ref to fieldset element', () => {
      const ref = createRef<HTMLFieldSetElement>();
      render(<CardList ref={ref} label="Plans" items={defaultItems} />);

      expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
    });
  });

  // ===========================================================================
  // Display Name
  // ===========================================================================

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(CardList.displayName).toBe('CardList');
    });
  });

  // ===========================================================================
  // Dev Warnings
  // ===========================================================================

  describe('Dev Warnings', () => {
    it('warns when no accessible label is provided', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(<CardList items={defaultItems} />);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DSAi CardList] Missing accessible label')
      );

      consoleSpy.mockRestore();
    });

    it('does not warn when label is provided', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(<CardList label="Plans" items={defaultItems} />);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('does not warn when aria-label is provided', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(<CardList aria-label="Plan selection" items={defaultItems} />);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
