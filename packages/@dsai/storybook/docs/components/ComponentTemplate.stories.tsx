import { Heading } from '@dsai/react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Component Template
 *
 * This file serves as a template for creating new component stories.
 * Copy this file and replace with your component details.
 */

// Import your component
// import { YourComponent } from '@dsai/react';

// Placeholder component for template
const PlaceholderComponent = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
}): React.ReactElement => (
  <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }} {...props}>
    {children || 'Component Placeholder'}
  </div>
);

const meta: Meta<typeof PlaceholderComponent> = {
  title: 'Components/Template',
  component: PlaceholderComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Replace this with your component description. Explain what it does and when to use it.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define your prop controls here
    children: {
      control: 'text',
      description: 'Content to display inside the component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlaceholderComponent>;

/**
 * Default story - shows the component in its default state
 */
export const Default: Story = {
  args: {
    children: 'Default Component',
  },
};

/**
 * Example with different props
 */
export const WithCustomContent: Story = {
  args: {
    children: 'Custom content example',
  },
};

/**
 * Playground - allows users to interact with all props
 */
export const Playground: Story = {
  args: {
    children: 'Interactive playground',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Try modifying the props in the Controls panel below to see how the component responds.',
      },
    },
  },
};

/**
 * Usage example
 */
export const Usage: Story = {
  render: () => (
    <div style={{ maxWidth: '800px' }}>
      <Heading level={2}>Usage</Heading>
      <pre
        style={{
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
        }}
      >
        {`import { YourComponent } from '@dsai/react';

function Example() {
  return (
    <YourComponent prop1="value1" prop2="value2">
      Content
    </YourComponent>
  );
}`}
      </pre>
    </div>
  ),
};
