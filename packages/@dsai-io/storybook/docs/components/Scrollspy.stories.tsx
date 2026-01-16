import { Button, Heading, Scrollspy, ScrollspyProvider, useScrollspy } from '@dsai-io/react';
import { Fragment, type ReactElement, useMemo, useState } from 'react';

import type { ScrollspyItem } from '@dsai-io/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const baseItems: ScrollspyItem[] = [
  { id: 'intro', label: 'Introduction', target: 'intro' },
  { id: 'setup', label: 'Getting Started', target: 'setup' },
  { id: 'api', label: 'API', target: 'api' },
  { id: 'examples', label: 'Examples', target: 'examples' },
];

const nestedItems: ScrollspyItem[] = [
  {
    id: 'foundation',
    label: 'Foundation',
    target: 'foundation',
    children: [
      { id: 'found-colors', label: 'Colors', target: 'found-colors' },
      { id: 'found-typography', label: 'Typography', target: 'found-typography' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    target: 'components',
    children: [
      { id: 'comp-buttons', label: 'Buttons', target: 'comp-buttons' },
      { id: 'comp-forms', label: 'Forms', target: 'comp-forms' },
    ],
  },
  { id: 'tokens', label: 'Design Tokens', target: 'tokens' },
];

const meta: Meta<typeof Scrollspy> = {
  title: 'Components/Scrollspy',
  component: Scrollspy,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Accessible table-of-contents navigation that highlights the section currently in view. Relies on IntersectionObserver and exposes a ScrollspyProvider for advanced integrations.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Scrollspy>;

type ScrollspyStoryProps = Omit<React.ComponentProps<typeof Scrollspy>, 'items'>;

interface DemoPageProps {
  items: ScrollspyItem[];
  scrollspy?: ScrollspyStoryProps;
}

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
const SectionList = ({
  items,
  regionLabel = 'Scrollable sections',
  nested = false,
}: {
  items: ScrollspyItem[];
  regionLabel?: string;
  nested?: boolean;
}): ReactElement => {
  const content = (
    <>
      {items.map((item) => (
        <Fragment key={item.target}>
          <article
            id={item.target}
            style={{
              padding: '2rem 0',
              borderBottom: '1px solid var(--bs-border-color)',
              minHeight: '30vh',
            }}
          >
            <Heading level={2} visualSize="h4" className="mb-2 text-body">
              {item.label}
            </Heading>
            <p className="text-muted mb-0">
              Placeholder content for <code>#{item.target}</code>. Scroll to watch the navigation
              update.
            </p>
          </article>
          {item.children && <SectionList items={item.children} nested />}
        </Fragment>
      ))}
    </>
  );

  if (nested) {
    return content;
  }

  return (
    <section
      className="ps-lg-4"
      style={{ maxHeight: '70vh', overflowY: 'auto', backgroundColor: 'var(--bs-body-bg)' }}
      tabIndex={0}
      aria-label={regionLabel}
    >
      {content}
    </section>
  );
};
/* eslint-enable jsx-a11y/no-noninteractive-tabindex */

const DemoPage = ({ items, scrollspy }: DemoPageProps): ReactElement => {
  const regionLabel =
    (scrollspy &&
      (scrollspy as Record<string, unknown>)['aria-label'] &&
      `${(scrollspy as Record<string, string>)['aria-label']} content`) ||
    'Content sections';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem' }}>
      <Scrollspy items={items} {...scrollspy} />
      <SectionList items={items} regionLabel={regionLabel} />
    </div>
  );
};

const ControlledStory = (): ReactElement => {
  const [activeId, setActiveId] = useState<string | null>('intro');

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex gap-2 align-items-center">
        <span className="text-muted">Active section:</span>
        <code>{activeId ?? 'none'}</code>
        <Button size="sm" variant="outline-primary" onClick={() => setActiveId('api')}>
          Jump to API
        </Button>
      </div>
      <DemoPage
        items={baseItems}
        scrollspy={{
          'aria-label': 'Controlled navigation',
          activeId,
          onActiveChange: setActiveId,
          smoothScroll: false,
        }}
      />
    </div>
  );
};

export const Basic: Story = {
  name: 'Default navigation',
  render: () => (
    <DemoPage items={baseItems} scrollspy={{ 'aria-label': 'Documentation navigation' }} />
  ),
};

export const Sticky: Story = {
  name: 'Sticky with offset',
  render: () => (
    <DemoPage
      items={baseItems}
      scrollspy={{
        'aria-label': 'Sticky navigation',
        sticky: true,
        stickyTop: 80,
        offset: 80,
      }}
    />
  ),
};

export const NestedStructure: Story = {
  name: 'Nested sections',
  render: () => (
    <DemoPage
      items={nestedItems}
      scrollspy={{ 'aria-label': 'Foundation sections', smoothScroll: true }}
    />
  ),
};

export const Controlled: Story = {
  name: 'Controlled activeId',
  render: () => <ControlledStory />,
};

const CustomLinks = (): ReactElement => (
  <Scrollspy items={[]} aria-label="Custom list" className="nav flex-column gap-1">
    <Scrollspy.Link target="overview">Overview</Scrollspy.Link>
    <Scrollspy.Link target="architecture">Architecture</Scrollspy.Link>
    <Scrollspy.Link target="faq">FAQ</Scrollspy.Link>
  </Scrollspy>
);

export const CustomChildren: Story = {
  name: 'Custom markup via Scrollspy.Link',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem' }}>
      <CustomLinks />
      <SectionList
        items={[
          { id: 'overview', label: 'Overview', target: 'overview' },
          { id: 'architecture', label: 'Architecture', target: 'architecture' },
          { id: 'faq', label: 'FAQ', target: 'faq' },
        ]}
        regionLabel="Custom markup sections"
      />
    </div>
  ),
};

const ProviderDemo = (): ReactElement => {
  const { activeId, visibleIds, scrollToSection } = useScrollspy();
  const visible = useMemo(() => (visibleIds.length ? visibleIds.join(', ') : 'none'), [visibleIds]);

  return (
    <div className="alert alert-info d-flex flex-column gap-2">
      <div>
        <strong>Active:</strong> {activeId ?? '—'}
      </div>
      <div>
        <strong>Visible IDs:</strong> {visible}
      </div>
      <Button size="sm" variant="outline-secondary" onClick={() => scrollToSection('examples')}>
        Scroll to Examples
      </Button>
    </div>
  );
};

export const ProviderIntegration: Story = {
  name: 'Sharing state with ScrollspyProvider',
  render: () => (
    <ScrollspyProvider items={baseItems}>
      <div className="d-flex flex-column gap-3">
        <ProviderDemo />
        <DemoPage items={baseItems} scrollspy={{ 'aria-label': 'Provider navigation' }} />
      </div>
    </ScrollspyProvider>
  ),
};

export const SecurityAndA11y: Story = {
  name: 'Security & accessibility notes',
  parameters: {
    docs: {
      description: {
        story:
          'Scrollspy sanitizes dangerous protocols (javascript:, data:, vbscript:, file:) before rendering hrefs, uses semantic <nav> landmarks, and applies aria-current="location" to the active link. Keyboard navigation mirrors native anchors and sticky mode simply toggles Bootstrap utility classes.',
      },
    },
  },
  render: () => (
    <div className="d-grid gap-3">
      <Heading id="toc-heading" level={2} visualSize="h4" className="mb-1">
        Table of contents
      </Heading>
      <DemoPage
        items={baseItems}
        scrollspy={{
          'aria-labelledby': 'toc-heading',
          id: 'scrollspy-story',
          'data-testid': 'scrollspy-demo',
        }}
      />
    </div>
  ),
};
