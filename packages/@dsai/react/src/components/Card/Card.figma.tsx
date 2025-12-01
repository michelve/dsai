/**
 * Figma Code Connect - Card Component
 *
 * Maps the DSAi Card Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Card/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Card, CardBody, CardFooter, CardHeader, CardImage, CardText, CardTitle } from './Card';

/**
 * DSAi Card - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_CARD>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - Interactive cards render as appropriate semantic elements (button/link)
 * - Images always require alt text
 * - Link cards include security attributes (rel="noopener noreferrer")
 */
figma.connect(Card, '<FIGMA_DSAI_CARD>', {
  props: {
    /**
     * Card visual variant
     * Maps Figma "Variant" property to React variant prop
     */
    variant: figma.enum('Variant', {
      Elevated: 'elevated',
      Outlined: 'outlined',
      Ghost: 'ghost',
    }),

    /**
     * Background color variant
     * Maps Figma "Color" property to React color prop
     */
    color: figma.enum('Color', {
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Danger: 'danger',
      Warning: 'warning',
      Info: 'info',
      Light: 'light',
      Dark: 'dark',
      None: undefined,
    }),

    /**
     * Horizontal layout (image on side)
     * Maps Figma "Horizontal" boolean property
     */
    horizontal: figma.boolean('Horizontal'),

    /**
     * Interactive state (clickable)
     * Maps Figma "Interactive" boolean property
     */
    interactive: figma.boolean('Interactive'),

    /**
     * Link URL for clickable cards
     * Maps Figma "Href" property
     */
    href: figma.string('Href'),

    /**
     * Accessible label for interactive cards
     * Maps Figma "Aria Label" property
     *
     * Use this when:
     * - The card is interactive but has no clear title
     * - The card title alone doesn't describe the action
     */
    ariaLabel: figma.string('Aria Label'),

    /**
     * Has header section
     * Maps Figma "Has Header" boolean property
     */
    hasHeader: figma.boolean('Has Header'),

    /**
     * Header text
     * Maps Figma "Header" text layer
     */
    headerText: figma.string('Header'),

    /**
     * Has image
     * Maps Figma "Has Image" boolean property
     */
    hasImage: figma.boolean('Has Image'),

    /**
     * Image source URL
     * Maps Figma "Image Src" property
     */
    imageSrc: figma.string('Image Src'),

    /**
     * Image alt text (required for accessibility)
     * Maps Figma "Image Alt" property
     */
    imageAlt: figma.string('Image Alt'),

    /**
     * Image position
     * Maps Figma "Image Position" property
     */
    imagePosition: figma.enum('Image Position', {
      Top: 'top',
      Bottom: 'bottom',
      Overlay: 'overlay',
    }),

    /**
     * Card title
     * Maps Figma "Title" text layer
     */
    title: figma.string('Title'),

    /**
     * Title heading level
     * Maps Figma "Title Level" property
     */
    titleAs: figma.enum('Title Level', {
      H1: 'h1',
      H2: 'h2',
      H3: 'h3',
      H4: 'h4',
      H5: 'h5',
      H6: 'h6',
    }),

    /**
     * Card body text
     * Maps Figma "Text" text layer
     */
    text: figma.string('Text'),

    /**
     * Has footer section
     * Maps Figma "Has Footer" boolean property
     */
    hasFooter: figma.boolean('Has Footer'),

    /**
     * Footer text
     * Maps Figma "Footer" text layer
     */
    footerText: figma.string('Footer'),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   *
   * Notes:
   * - Interactive cards without href render as buttons
   * - Interactive cards with href render as links
   * - Image alt is required for accessibility
   */
  example: ({
    variant,
    color,
    horizontal,
    interactive,
    href,
    ariaLabel,
    hasHeader,
    headerText,
    hasImage,
    imageSrc,
    imageAlt,
    imagePosition,
    title,
    titleAs,
    text,
    hasFooter,
    footerText,
  }) => {
    // Normalize optional strings
    const normalizedAriaLabel =
      ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : undefined;
    const normalizedHref = href && href.trim().length > 0 ? href.trim() : undefined;
    const normalizedTitle = title && title.trim().length > 0 ? title.trim() : undefined;
    const normalizedText = text && text.trim().length > 0 ? text.trim() : undefined;
    const normalizedHeaderText =
      headerText && headerText.trim().length > 0 ? headerText.trim() : undefined;
    const normalizedFooterText =
      footerText && footerText.trim().length > 0 ? footerText.trim() : undefined;
    const normalizedImageSrc = imageSrc && imageSrc.trim().length > 0 ? imageSrc.trim() : undefined;
    const normalizedImageAlt =
      imageAlt && imageAlt.trim().length > 0 ? imageAlt.trim() : 'Card image';

    return (
      <Card
        variant={variant}
        color={color}
        horizontal={horizontal}
        interactive={interactive}
        href={normalizedHref}
        aria-label={normalizedAriaLabel}
      >
        {hasImage && normalizedImageSrc && (
          <CardImage src={normalizedImageSrc} alt={normalizedImageAlt} position={imagePosition} />
        )}
        {hasHeader && normalizedHeaderText && <CardHeader>{normalizedHeaderText}</CardHeader>}
        <CardBody>
          {normalizedTitle && <CardTitle as={titleAs}>{normalizedTitle}</CardTitle>}
          {normalizedText && <CardText>{normalizedText}</CardText>}
        </CardBody>
        {hasFooter && normalizedFooterText && <CardFooter>{normalizedFooterText}</CardFooter>}
      </Card>
    );
  },
});

/**
 * Card Usage Patterns
 *
 * 1. Basic Card:
 *    <Card>
 *      <CardBody>
 *        <CardTitle>Title</CardTitle>
 *        <CardText>Content</CardText>
 *      </CardBody>
 *    </Card>
 *
 * 2. Card with Image:
 *    <Card>
 *      <CardImage src="image.jpg" alt="Description" position="top" />
 *      <CardBody>
 *        <CardTitle>Title</CardTitle>
 *        <CardText>Content</CardText>
 *      </CardBody>
 *    </Card>
 *
 * 3. Interactive Card (Link):
 *    <Card href="/page" aria-label="Go to page">
 *      <CardBody>
 *        <CardTitle>Clickable Card</CardTitle>
 *      </CardBody>
 *    </Card>
 *
 * 4. Interactive Card (Button):
 *    <Card interactive onClick={handleClick} aria-label="Perform action">
 *      <CardBody>
 *        <CardTitle>Action Card</CardTitle>
 *      </CardBody>
 *    </Card>
 *
 * 5. Full Card:
 *    <Card variant="outlined">
 *      <CardHeader>Header</CardHeader>
 *      <CardImage src="image.jpg" alt="Description" />
 *      <CardBody>
 *        <CardTitle>Title</CardTitle>
 *        <CardText>Content</CardText>
 *      </CardBody>
 *      <CardFooter>Footer</CardFooter>
 *    </Card>
 */
