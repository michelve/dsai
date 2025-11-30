/**
 * Figma Code Connect - Alert Component
 *
 * Maps the DSAi Alert Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Alert/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Alert } from './Alert';

/**
 * DSAi Alert - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_ALERT>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - role="alert" for danger/warning variants (assertive)
 * - role="status" for info/success variants (polite)
 * - Escape key dismissal for dismissible alerts
 * - Decorative icons hidden with aria-hidden
 */
figma.connect(Alert, '<FIGMA_DSAI_ALERT>', {
  props: {
    /**
     * Alert color variant
     * Maps Figma "Variant" property to React variant prop
     * danger/warning = role="alert" (assertive)
     * others = role="status" (polite)
     */
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Danger: 'danger',
      Warning: 'warning',
      Info: 'info',
      Light: 'light',
      Dark: 'dark',
    }),

    /**
     * Dismissible state
     * Maps Figma "Dismissible" boolean property
     * When true, shows close button and enables Escape key dismissal
     */
    dismissible: figma.boolean('Dismissible'),

    /**
     * Alert title
     * Maps Figma "Title" text layer
     * Renders as Alert.Heading (h4 by default)
     */
    title: figma.string('Title'),

    /**
     * Alert message content
     * Maps Figma "Message" text layer to children prop
     */
    children: figma.string('Message'),

    /**
     * Has icon
     * Maps Figma "Has Icon" boolean property
     */
    hasIcon: figma.boolean('Has Icon'),

    /**
     * Render as section element
     * Maps Figma "As Section" boolean property
     * Use for landmark-worthy alerts
     */
    asSection: figma.boolean('As Section'),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   *
   * Notes:
   * - Dismissible alerts require onClose handler
   * - Icons are automatically aria-hidden
   * - role is automatically set based on variant
   */
  example: ({ variant, dismissible, title, children, hasIcon, asSection }) => {
    // Normalize optional strings
    const normalizedTitle = title && title.trim().length > 0 ? title.trim() : undefined;
    const normalizedChildren =
      children && children.trim().length > 0 ? children.trim() : 'Alert message';

    // Placeholder icon for Figma preview
    const iconPlaceholder = hasIcon ? <span>ℹ️</span> : undefined;

    return (
      <Alert
        variant={variant}
        title={normalizedTitle}
        dismissible={dismissible}
        onClose={dismissible ? () => {} : undefined}
        icon={iconPlaceholder}
        as={asSection ? 'section' : 'div'}
      >
        {normalizedChildren}
      </Alert>
    );
  },
});

/**
 * Alert Usage Patterns
 *
 * 1. Basic Alert:
 *    <Alert variant="info">
 *      This is an informational message.
 *    </Alert>
 *
 * 2. Alert with Title:
 *    <Alert variant="success" title="Success!">
 *      Your changes have been saved.
 *    </Alert>
 *
 * 3. Dismissible Alert:
 *    const [show, setShow] = useState(true);
 *    {show && (
 *      <Alert variant="warning" dismissible onClose={() => setShow(false)}>
 *        This alert can be dismissed with the X button or Escape key.
 *      </Alert>
 *    )}
 *
 * 4. Alert with Icon:
 *    <Alert variant="danger" icon={<WarningIcon />}>
 *      Something went wrong.
 *    </Alert>
 *
 * 5. Alert with Link:
 *    <Alert variant="info">
 *      Check out the <Alert.Link href="/docs">documentation</Alert.Link>.
 *    </Alert>
 *
 * 6. Alert with Heading (subcomponent):
 *    <Alert variant="success">
 *      <Alert.Heading>Well done!</Alert.Heading>
 *      <p>You successfully completed the task.</p>
 *      <hr />
 *      <p className="mb-0">Additional info here.</p>
 *    </Alert>
 *
 * Accessibility Notes:
 * - danger/warning variants use role="alert" (assertive announcement)
 * - other variants use role="status" (polite announcement)
 * - Icons are automatically aria-hidden
 * - Dismissible alerts can be closed with Escape key
 */
