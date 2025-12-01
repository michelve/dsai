/**
 * Figma Code Connect - Tabs Component
 *
 * Maps the DSAi Tabs Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Tabs/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Tab, TabList, TabPanel, Tabs } from './Tabs';

/**
 * DSAi Tabs - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_TABS>` substitution variable defined in figma.config.json.
 *
 * Accessible tabbed interface with multiple variants and orientations.
 *
 * Accessibility goals:
 * - role="tablist" on container
 * - role="tab" on buttons with aria-selected
 * - role="tabpanel" on content with aria-labelledby
 * - Arrow key navigation between tabs
 * - Home/End for first/last tab
 */
figma.connect(Tabs, '<FIGMA_DSAI_TABS>', {
  props: {
    /**
     * Tab variant styling
     * Maps Figma "Variant" property
     */
    variant: figma.enum('Variant', {
      Tabs: 'tabs',
      Pills: 'pills',
      Underline: 'underline',
    }),

    /**
     * Orientation
     * Maps Figma "Orientation" property
     */
    orientation: figma.enum('Orientation', {
      Horizontal: 'horizontal',
      Vertical: 'vertical',
    }),

    /**
     * Fill available width
     * Maps Figma "Fill" boolean property
     */
    fill: figma.boolean('Fill'),

    /**
     * Justify tabs evenly
     * Maps Figma "Justified" boolean property
     */
    justified: figma.boolean('Justified'),

    /**
     * Number of tabs
     * Maps Figma "Tab Count" property
     */
    tabCount: figma.enum('Tab Count', {
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
    }),

    /**
     * Active tab index (0-based)
     * Maps Figma "Active Tab" property
     */
    activeTabIndex: figma.enum('Active Tab', {
      '1': 0,
      '2': 1,
      '3': 2,
      '4': 3,
      '5': 4,
    }),

    /**
     * Has disabled tab
     * Maps Figma "Has Disabled" boolean property
     */
    hasDisabled: figma.boolean('Has Disabled'),

    /**
     * Show icons
     * Maps Figma "Show Icons" boolean property
     */
    showIcons: figma.boolean('Show Icons'),
  },

  example: ({
    variant,
    orientation,
    fill,
    justified,
    tabCount,
    activeTabIndex,
    hasDisabled,
    showIcons,
  }) => {
    const count = tabCount || 3;
    const activeIndex = activeTabIndex || 0;

    const items = Array.from({ length: count }, (_, i) => ({
      id: `tab-${i + 1}`,
      label: `Tab ${i + 1}`,
      content: <p>Content for Tab {i + 1}</p>,
      icon: showIcons ? '•' : undefined,
      disabled: hasDisabled && i === count - 1,
    }));

    const activeTabItem = items.find((_, index) => index === activeIndex);
    const firstTabItem = items.find((_, index) => index === 0);
    const activeTab = activeTabItem?.id || firstTabItem?.id || 'tab-1';

    return (
      <Tabs
        items={items}
        variant={variant}
        orientation={orientation}
        fill={fill}
        justified={justified}
        defaultActiveTab={activeTab}
        onTabChange={() => {}}
      />
    );
  },
});

/**
 * DSAi TabList - Code Connect Mapping (Compound Component)
 */
figma.connect(TabList, '<FIGMA_DSAI_TAB_LIST>', {
  props: {
    /**
     * Accessible label
     * Maps Figma "Aria Label" text property
     */
    ariaLabel: figma.string('Aria Label'),
  },

  example: ({ ariaLabel }) => {
    const normalizedAriaLabel =
      ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : 'Navigation tabs';

    return (
      <TabList aria-label={normalizedAriaLabel}>
        <Tab id="tab1">Tab 1</Tab>
        <Tab id="tab2">Tab 2</Tab>
        <Tab id="tab3">Tab 3</Tab>
      </TabList>
    );
  },
});

/**
 * DSAi Tab - Code Connect Mapping (Individual Tab Button)
 */
figma.connect(Tab, '<FIGMA_DSAI_TAB>', {
  props: {
    /**
     * Tab label
     * Maps Figma "Label" text property
     */
    label: figma.string('Label'),

    /**
     * Active state
     * Maps Figma "Active" boolean property
     */
    active: figma.boolean('Active'),

    /**
     * Disabled state
     * Maps Figma "Disabled" boolean property
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Has icon
     * Maps Figma "Has Icon" boolean property
     */
    hasIcon: figma.boolean('Has Icon'),
  },

  example: ({ label, disabled, hasIcon }) => {
    const normalizedLabel = label && label.trim().length > 0 ? label.trim() : 'Tab';

    return (
      <Tab id="tab-id" disabled={disabled} icon={hasIcon ? '•' : undefined}>
        {normalizedLabel}
      </Tab>
    );
  },
});

/**
 * DSAi TabPanel - Code Connect Mapping (Tab Content Panel)
 */
figma.connect(TabPanel, '<FIGMA_DSAI_TAB_PANEL>', {
  props: {
    /**
     * Keep mounted when inactive
     * Maps Figma "Keep Mounted" boolean property
     */
    keepMounted: figma.boolean('Keep Mounted'),
  },

  example: ({ keepMounted }) => (
    <TabPanel id="tab-id" keepMounted={keepMounted}>
      <p>Tab panel content goes here.</p>
    </TabPanel>
  ),
});

/**
 * Tabs Usage Patterns
 *
 * 1. Using items prop (simple):
 *    <Tabs
 *      items={[
 *        { id: 'home', label: 'Home', content: <HomeContent /> },
 *        { id: 'profile', label: 'Profile', content: <ProfileContent /> },
 *        { id: 'settings', label: 'Settings', content: <SettingsContent /> },
 *      ]}
 *    />
 *
 * 2. Using compound components (flexible):
 *    <Tabs>
 *      <TabList aria-label="Main navigation">
 *        <Tab id="home">Home</Tab>
 *        <Tab id="profile">Profile</Tab>
 *        <Tab id="settings" disabled>Settings</Tab>
 *      </TabList>
 *      <TabPanel id="home">Home content</TabPanel>
 *      <TabPanel id="profile">Profile content</TabPanel>
 *      <TabPanel id="settings">Settings content</TabPanel>
 *    </Tabs>
 *
 * 3. Controlled:
 *    <Tabs
 *      activeTab={activeTab}
 *      onTabChange={setActiveTab}
 *      items={items}
 *    />
 *
 * 4. Vertical Orientation:
 *    <Tabs
 *      orientation="vertical"
 *      items={items}
 *    />
 *
 * 5. Pills Variant:
 *    <Tabs variant="pills" items={items} />
 *
 * 6. Underline Variant:
 *    <Tabs variant="underline" items={items} />
 *
 * 7. Fill Width:
 *    <Tabs fill items={items} />
 *
 * 8. Justified:
 *    <Tabs justified items={items} />
 *
 * 9. With Icons:
 *    <Tabs
 *      items={[
 *        { id: 'home', label: 'Home', icon: <HomeIcon />, content: ... },
 *        { id: 'profile', label: 'Profile', icon: <UserIcon />, content: ... },
 *      ]}
 *    />
 *
 * Accessibility Notes:
 * - role="tablist" on container with aria-orientation
 * - role="tab" on buttons with aria-selected
 * - role="tabpanel" on content with aria-labelledby
 * - Arrow keys navigate between tabs (respects orientation)
 * - Home/End jump to first/last tab
 * - Tab key moves focus out of tab list
 */
