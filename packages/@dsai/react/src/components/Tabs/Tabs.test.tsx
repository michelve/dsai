import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';

import { Tab, TabList, TabPanel, Tabs } from './Tabs';

expect.extend(toHaveNoViolations);

// Sample tab items for testing
const sampleItems = [
  { id: 'home', label: 'Home', content: <p>Home content</p> },
  { id: 'profile', label: 'Profile', content: <p>Profile content</p> },
  { id: 'settings', label: 'Settings', content: <p>Settings content</p> },
];

describe('Tabs', () => {
  // ===========================================================================
  // Rendering - Items Mode
  // ===========================================================================
  describe('Rendering - Items Mode', () => {
    it('renders tabs with items prop', () => {
      render(<Tabs items={sampleItems} />);

      expect(screen.getByRole('tab', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Profile' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument();
    });

    it('renders first tab as active by default', () => {
      render(<Tabs items={sampleItems} />);

      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Home content')).toBeInTheDocument();
    });

    it('renders defaultActiveTab as active', () => {
      render(<Tabs items={sampleItems} defaultActiveTab="profile" />);

      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Profile content')).toBeInTheDocument();
    });

    it('renders tab panels', () => {
      render(<Tabs items={sampleItems} />);

      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
      expect(screen.getByText('Home content')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Rendering - Compound Mode
  // ===========================================================================
  describe('Rendering - Compound Mode', () => {
    it('renders tabs with compound components', () => {
      render(
        <Tabs defaultActiveTab="tab1">
          <TabList aria-label="Test tabs">
            <Tab id="tab1">Tab 1</Tab>
            <Tab id="tab2">Tab 2</Tab>
          </TabList>
          <TabPanel id="tab1">Content 1</TabPanel>
          <TabPanel id="tab2">Content 2</TabPanel>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('throws error when compound components used outside Tabs', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Tab id="test">Test</Tab>);
      }).toThrow('Tabs compound components must be used within a Tabs component');

      consoleSpy.mockRestore();
    });
  });

  // ===========================================================================
  // Variants
  // ===========================================================================
  describe('Variants', () => {
    it('renders tabs variant by default', () => {
      const { container } = render(<Tabs items={sampleItems} />);
      expect(container.querySelector('.nav-tabs')).toBeInTheDocument();
    });

    it('renders pills variant', () => {
      const { container } = render(<Tabs items={sampleItems} variant="pills" />);
      expect(container.querySelector('.nav-pills')).toBeInTheDocument();
    });

    it('renders underline variant', () => {
      const { container } = render(<Tabs items={sampleItems} variant="underline" />);
      expect(container.querySelector('.nav-underline')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Orientation
  // ===========================================================================
  describe('Orientation', () => {
    it('renders horizontal orientation by default', () => {
      const { container } = render(<Tabs items={sampleItems} />);
      expect(container.querySelector('.flex-column')).not.toBeInTheDocument();
    });

    it('renders vertical orientation', () => {
      const { container } = render(<Tabs items={sampleItems} orientation="vertical" />);
      expect(container.querySelector('.flex-column')).toBeInTheDocument();
      expect(container.querySelector('.d-flex')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Fill and Justified
  // ===========================================================================
  describe('Fill and Justified', () => {
    it('renders fill tabs', () => {
      const { container } = render(<Tabs items={sampleItems} fill />);
      expect(container.querySelector('.nav-fill')).toBeInTheDocument();
    });

    it('renders justified tabs', () => {
      const { container } = render(<Tabs items={sampleItems} justified />);
      expect(container.querySelector('.nav-justified')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Controlled Mode
  // ===========================================================================
  describe('Controlled Mode', () => {
    it('respects controlled activeTab', () => {
      render(<Tabs items={sampleItems} activeTab="profile" />);

      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
    });

    it('calls onTabChange when tab is clicked', async () => {
      const handleChange = jest.fn();
      render(<Tabs items={sampleItems} activeTab="home" onTabChange={handleChange} />);

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      expect(handleChange).toHaveBeenCalledWith('profile');
    });

    it('does not change tab internally when controlled', async () => {
      const handleChange = jest.fn();
      render(<Tabs items={sampleItems} activeTab="home" onTabChange={handleChange} />);

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      // Home should still be selected because it's controlled
      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  // ===========================================================================
  // Uncontrolled Mode
  // ===========================================================================
  describe('Uncontrolled Mode', () => {
    it('changes tab when clicked in uncontrolled mode', async () => {
      render(<Tabs items={sampleItems} />);

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Profile content')).toBeInTheDocument();
    });

    it('calls onTabChange in uncontrolled mode', async () => {
      const handleChange = jest.fn();
      render(<Tabs items={sampleItems} onTabChange={handleChange} />);

      await userEvent.click(screen.getByRole('tab', { name: 'Profile' }));

      expect(handleChange).toHaveBeenCalledWith('profile');
    });
  });

  // ===========================================================================
  // Disabled Tabs
  // ===========================================================================
  describe('Disabled Tabs', () => {
    it('renders disabled tab', () => {
      const itemsWithDisabled = [
        ...sampleItems,
        { id: 'disabled', label: 'Disabled', content: <p>Disabled</p>, disabled: true },
      ];
      render(<Tabs items={itemsWithDisabled} />);

      const disabledTab = screen.getByRole('tab', { name: 'Disabled' });
      expect(disabledTab).toBeDisabled();
      expect(disabledTab).toHaveClass('disabled');
    });

    it('does not activate disabled tab on click', async () => {
      const itemsWithDisabled = [
        ...sampleItems,
        { id: 'disabled', label: 'Disabled', content: <p>Disabled</p>, disabled: true },
      ];
      render(<Tabs items={itemsWithDisabled} />);

      await userEvent.click(screen.getByRole('tab', { name: 'Disabled' }));

      // Home should still be active
      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  // ===========================================================================
  // Icons
  // ===========================================================================
  describe('Icons', () => {
    it('renders tabs with icons', () => {
      const itemsWithIcons = [
        {
          id: 'home',
          label: 'Home',
          content: <p>Home</p>,
          icon: <span data-testid="home-icon">🏠</span>,
        },
      ];
      render(<Tabs items={itemsWithIcons} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Keyboard Navigation
  // ===========================================================================
  describe('Keyboard Navigation', () => {
    it('navigates with ArrowRight in horizontal mode', async () => {
      render(<Tabs items={sampleItems} />);

      const homeTab = screen.getByRole('tab', { name: 'Home' });
      homeTab.focus();

      fireEvent.keyDown(homeTab, { key: 'ArrowRight' });

      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates with ArrowLeft in horizontal mode', async () => {
      render(<Tabs items={sampleItems} defaultActiveTab="profile" />);

      const profileTab = screen.getByRole('tab', { name: 'Profile' });
      profileTab.focus();

      fireEvent.keyDown(profileTab, { key: 'ArrowLeft' });

      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
    });

    it('wraps to last tab with ArrowLeft on first tab', async () => {
      render(<Tabs items={sampleItems} />);

      const homeTab = screen.getByRole('tab', { name: 'Home' });
      homeTab.focus();

      fireEvent.keyDown(homeTab, { key: 'ArrowLeft' });

      expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    it('wraps to first tab with ArrowRight on last tab', async () => {
      render(<Tabs items={sampleItems} defaultActiveTab="settings" />);

      const settingsTab = screen.getByRole('tab', { name: 'Settings' });
      settingsTab.focus();

      fireEvent.keyDown(settingsTab, { key: 'ArrowRight' });

      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates to first tab with Home key', async () => {
      render(<Tabs items={sampleItems} defaultActiveTab="settings" />);

      const settingsTab = screen.getByRole('tab', { name: 'Settings' });
      settingsTab.focus();

      fireEvent.keyDown(settingsTab, { key: 'Home' });

      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates to last tab with End key', async () => {
      render(<Tabs items={sampleItems} />);

      const homeTab = screen.getByRole('tab', { name: 'Home' });
      homeTab.focus();

      fireEvent.keyDown(homeTab, { key: 'End' });

      expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    it('navigates with ArrowDown in vertical mode', async () => {
      render(<Tabs items={sampleItems} orientation="vertical" />);

      const homeTab = screen.getByRole('tab', { name: 'Home' });
      homeTab.focus();

      fireEvent.keyDown(homeTab, { key: 'ArrowDown' });

      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates with ArrowUp in vertical mode', async () => {
      render(<Tabs items={sampleItems} orientation="vertical" defaultActiveTab="profile" />);

      const profileTab = screen.getByRole('tab', { name: 'Profile' });
      profileTab.focus();

      fireEvent.keyDown(profileTab, { key: 'ArrowUp' });

      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
    });

    it('skips disabled tabs during keyboard navigation', async () => {
      const itemsWithDisabled = [
        { id: 'home', label: 'Home', content: <p>Home</p> },
        { id: 'disabled', label: 'Disabled', content: <p>Disabled</p>, disabled: true },
        { id: 'settings', label: 'Settings', content: <p>Settings</p> },
      ];
      render(<Tabs items={itemsWithDisabled} />);

      const homeTab = screen.getByRole('tab', { name: 'Home' });
      homeTab.focus();

      fireEvent.keyDown(homeTab, { key: 'ArrowRight' });

      // Should skip disabled and go to settings
      expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });
  });

  // ===========================================================================
  // TabPanel keepMounted
  // ===========================================================================
  describe('TabPanel keepMounted', () => {
    it('keeps panel mounted when keepMounted is true', () => {
      render(
        <Tabs defaultActiveTab="tab1">
          <TabList aria-label="Test">
            <Tab id="tab1">Tab 1</Tab>
            <Tab id="tab2">Tab 2</Tab>
          </TabList>
          <TabPanel id="tab1">Content 1</TabPanel>
          <TabPanel id="tab2" keepMounted>
            Content 2
          </TabPanel>
        </Tabs>
      );

      // Content 2 should be in DOM but hidden
      const panel2 = screen.getByText('Content 2').closest('[role="tabpanel"]');
      expect(panel2).toHaveAttribute('hidden');
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================
  describe('Ref Forwarding', () => {
    it('forwards ref to Tabs container', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Tabs ref={ref} items={sampleItems} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref to TabList', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Tabs defaultActiveTab="tab1">
          <TabList ref={ref} aria-label="Test">
            <Tab id="tab1">Tab 1</Tab>
          </TabList>
          <TabPanel id="tab1">Content</TabPanel>
        </Tabs>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref to Tab', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <Tabs defaultActiveTab="tab1">
          <TabList aria-label="Test">
            <Tab ref={ref} id="tab1">
              Tab 1
            </Tab>
          </TabList>
          <TabPanel id="tab1">Content</TabPanel>
        </Tabs>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('forwards ref to TabPanel', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Tabs defaultActiveTab="tab1">
          <TabList aria-label="Test">
            <Tab id="tab1">Tab 1</Tab>
          </TabList>
          <TabPanel ref={ref} id="tab1">
            Content
          </TabPanel>
        </Tabs>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // ===========================================================================
  // Custom Styling
  // ===========================================================================
  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(<Tabs items={sampleItems} className="custom-tabs" />);
      expect(container.querySelector('.custom-tabs')).toBeInTheDocument();
    });

    it('accepts custom id', () => {
      render(<Tabs items={sampleItems} id="my-tabs" />);
      expect(document.getElementById('my-tabs')).toBeInTheDocument();
    });

    it('accepts inline styles', () => {
      const { container } = render(<Tabs items={sampleItems} style={{ marginTop: '10px' }} />);
      expect(container.firstChild).toHaveStyle({ marginTop: '10px' });
    });
  });

  // ===========================================================================
  // Accessibility (WCAG 2.2 AA)
  // ===========================================================================
  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Tabs items={sampleItems} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with pills variant', async () => {
      const { container } = render(<Tabs items={sampleItems} variant="pills" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with vertical orientation', async () => {
      const { container } = render(<Tabs items={sampleItems} orientation="vertical" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has role="tablist" on container', () => {
      render(<Tabs items={sampleItems} />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('has role="tab" on tab buttons', () => {
      render(<Tabs items={sampleItems} />);
      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('has role="tabpanel" on content', () => {
      render(<Tabs items={sampleItems} />);
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('has aria-selected on tabs', () => {
      render(<Tabs items={sampleItems} />);
      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute(
        'aria-selected',
        'false'
      );
    });

    it('has aria-controls linking tab to panel', () => {
      render(<Tabs items={sampleItems} id="test" />);
      const homeTab = screen.getByRole('tab', { name: 'Home' });
      expect(homeTab).toHaveAttribute('aria-controls', 'test-panel-home');
    });

    it('has aria-labelledby linking panel to tab', () => {
      render(<Tabs items={sampleItems} id="test" />);
      const panel = screen.getByRole('tabpanel');
      expect(panel).toHaveAttribute('aria-labelledby', 'test-tab-home');
    });

    it('has aria-orientation on tablist', () => {
      render(<Tabs items={sampleItems} orientation="vertical" />);
      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('active tab has tabIndex 0, inactive tabs have tabIndex -1', () => {
      render(<Tabs items={sampleItems} />);
      expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('tabIndex', '0');
      expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('tabIndex', '-1');
    });
  });

  // ===========================================================================
  // Display Names
  // ===========================================================================
  describe('Display Names', () => {
    it('Tabs has correct displayName', () => {
      expect(Tabs.displayName).toBe('Tabs');
    });

    it('TabList has correct displayName', () => {
      expect(TabList.displayName).toBe('TabList');
    });

    it('Tab has correct displayName', () => {
      expect(Tab.displayName).toBe('Tab');
    });

    it('TabPanel has correct displayName', () => {
      expect(TabPanel.displayName).toBe('TabPanel');
    });
  });
});
