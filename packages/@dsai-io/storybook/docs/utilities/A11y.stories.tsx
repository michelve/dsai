import {
  Alert,
  announceToScreenReader,
  Button,
  CheckCircleFillIcon,
  generateId,
  getAnimationDuration,
  Heading,
  InfoCircleFillIcon,
  shouldAnimate,
  trapFocus,
  XCircleFillIcon,
} from '@dsai-io/react';
import { useEffect, useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { JSX } from 'react';

// =============================================================================
// Demo Components - Proper React components for hooks compliance
// =============================================================================

/** Demo component for GenerateId story */
function GenerateIdDemo(): JSX.Element {
  const [ids, setIds] = useState<string[]>([]);
  const emailId = useRef(generateId('email'));
  const errorId = useRef(generateId('error'));

  const handleGenerate = (): void => {
    const newId = generateId('field');
    setIds((prev) => [...prev, newId]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <div>
        <Heading level={3}>Generate SSR-Safe IDs</Heading>
        <p style={{ color: 'var(--bs-secondary)', marginTop: '0.5rem', marginBottom: 0 }}>
          Create unique, deterministic IDs that work in server-side rendering.
        </p>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--bs-gray-100)',
          borderRadius: '0.5rem',
          border: '1px solid var(--bs-border-color)',
        }}
      >
        <Heading level={4}>Interactive Demo</Heading>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={handleGenerate}>
            Generate New ID
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => setIds([])}
            disabled={ids.length === 0}
          >
            Clear All
          </Button>
        </div>

        {ids.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Generated IDs:</strong>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              {ids.map((id) => (
                <li key={id}>
                  <code style={{ color: 'var(--bs-primary)', fontFamily: 'monospace' }}>{id}</code>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--bs-white)',
          borderRadius: '0.5rem',
          border: '1px solid var(--bs-border-color)',
        }}
      >
        <Heading level={4}>Usage Example</Heading>
        <pre
          style={{
            backgroundColor: 'var(--bs-gray-100)',
            padding: '1rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            margin: '1rem 0 0 0',
            fontSize: '0.875rem',
          }}
        >
          {`import { generateId } from '@dsai-io/react';

function FormField() {
  // Generate IDs once - stable across renders
  const inputId = generateId('email');
  const errorId = generateId('error');

  return (
    <div>
      <label htmlFor={inputId}>Email Address</label>
      <input
        id={inputId}
        type="email"
        aria-describedby={errorId}
      />
      <span id={errorId} role="alert">
        Invalid email format
      </span>
    </div>
  );
}`}
        </pre>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--bs-white)',
          borderRadius: '0.5rem',
          border: '1px solid var(--bs-border-color)',
        }}
      >
        <Heading level={4}>Live Form Example</Heading>
        <div style={{ marginTop: '1rem' }}>
          <label
            htmlFor={emailId.current}
            style={{ display: 'block', fontWeight: 'var(--sb-typography-font-weight-medium)', marginBottom: '0.5rem' }}
          >
            Email Address
          </label>
          <input
            id={emailId.current}
            type="email"
            aria-describedby={errorId.current}
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--bs-border-color)',
              borderRadius: '0.375rem',
            }}
          />
          <small
            id={errorId.current}
            style={{ display: 'block', marginTop: '0.25rem', color: 'var(--bs-secondary)' }}
          >
            {"We'll never share your email with anyone else."}
          </small>
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--bs-secondary)' }}>
          <strong>Generated IDs:</strong>
          <br />
          <code>input: {emailId.current}</code>
          <br />
          <code>description: {errorId.current}</code>
        </div>
      </div>

      <Alert variant="info" dismissible={false}>
        <strong>SSR Safety:</strong> IDs are generated using an incrementing counter, ensuring
        consistency between server and client renders. This prevents hydration mismatches in
        Next.js, Remix, and other SSR frameworks.
      </Alert>
    </div>
  );
}

/**
 * Accessibility (a11y) Utilities
 *
 * Production-ready accessibility utilities for building WCAG 2.2 Level AA compliant applications.
 * These utilities provide essential functionality for creating accessible user interfaces that work
 * seamlessly with assistive technologies like screen readers, keyboard navigation, and motion preferences.
 *
 * ## Available Utilities
 *
 * - **generateId** - SSR-safe unique ID generation for ARIA relationships
 * - **announceToScreenReader** - Dynamic announcements via ARIA live regions
 * - **trapFocus** - Keyboard focus management for modals and dialogs
 * - **shouldAnimate** - Respect user's motion preferences (prefers-reduced-motion)
 * - **getAnimationDuration** - Get animation duration based on user preferences
 * - **buildAriaLabel** - Programmatically construct accessible labels
 * - **combineAriaDescriptions** - Merge multiple ARIA descriptions
 * - **createRovingTabindex** - Implement roving tabindex for keyboard navigation
 * - **getArrowKeyHandler** - Handle arrow key navigation patterns
 * - **focusableSelectors** - Query selectors for focusable elements
 *
 * ## Design Principles
 *
 * 1. **WCAG 2.2 Level AA** - All utilities support achieving AA compliance
 * 2. **SSR-Safe** - Works in server-side rendering environments
 * 3. **Progressive Enhancement** - Degrades gracefully without JavaScript
 * 4. **User Preferences** - Respects system accessibility settings
 * 5. **Production-Tested** - Battle-tested in real applications
 */

const meta: Meta = {
  title: 'Utilities/Accessibility (a11y)',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Enterprise-grade accessibility utilities for WCAG 2.2 Level AA compliant applications. ' +
          'Provides focus management, screen reader support, SSR-safe ID generation, and motion preference detection.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

/**
 * ## generateId
 *
 * Generate unique, SSR-safe IDs for form inputs, labels, and ARIA relationships.
 * IDs are deterministic and consistent between server and client renders, preventing hydration mismatches.
 *
 * ### Use Cases
 * - Linking `<label>` to `<input>` via htmlFor/id
 * - ARIA relationships (aria-labelledby, aria-describedby, aria-controls)
 * - Unique component identifiers
 * - Accessibility annotations
 *
 * ### API
 * ```typescript
 * function generateId(prefix?: string): string
 * ```
 *
 * **Parameters:**
 * - `prefix` - Optional prefix for the ID (default: 'id')
 *
 * **Returns:** Unique ID string in format `${prefix}-${counter}`
 */
export const GenerateId: Story = {
  render: () => <GenerateIdDemo />,
};

/**
 * ## announceToScreenReader
 *
 * Dynamically announce messages to screen reader users via ARIA live regions.
 * Essential for communicating asynchronous updates, form validation errors, and state changes.
 *
 * ### Use Cases
 * - Notify users of async operations (saving, loading, errors)
 * - Announce form validation results
 * - Communicate dynamic content changes
 * - Status updates and notifications
 *
 * ### API
 * ```typescript
 * interface AnnounceOptions {
 *   politeness?: 'polite' | 'assertive';
 *   id?: string;
 *   timeoutMs?: number;
 * }
 *
 * function announceToScreenReader(
 *   message: string,
 *   options?: AnnounceOptions
 * ): () => void
 * ```
 *
 * **Parameters:**
 * - `message` - Text to announce to screen readers
 * - `options.politeness` - 'polite' (waits) or 'assertive' (interrupts) - default: 'polite'
 * - `options.id` - Custom live region ID - default: 'dsai-live-region'
 * - `options.timeoutMs` - Auto-clear timeout in ms - default: 2000
 *
 * **Returns:** Cleanup function to immediately clear the announcement
 */
export const AnnounceToScreenReader: Story = {
  render: (): JSX.Element => {
    const [lastMessage, setLastMessage] = useState<string>('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const announce = (message: string, assertive = false): void => {
      announceToScreenReader(message, { politeness: assertive ? 'assertive' : 'polite' });
      setLastMessage(message);
    };

    const handleSave = async (): Promise<void> => {
      setStatus('loading');
      announce('Saving your changes...');

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStatus('success');
      announce('Changes saved successfully!');

      setTimeout(() => setStatus('idle'), 3000);
    };

    const handleError = async (): Promise<void> => {
      setStatus('loading');
      announce('Processing your request...');

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStatus('error');
      announce('Error: Operation failed. Please try again.', true); // Assertive

      setTimeout(() => setStatus('idle'), 3000);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        <div>
          <Heading level={3}>Screen Reader Announcements</Heading>
          <p style={{ color: 'var(--bs-secondary)', marginTop: '0.5rem', marginBottom: 0 }}>
            Test dynamic announcements to assistive technologies. Enable a screen reader (NVDA,
            JAWS, VoiceOver) to hear the announcements.
          </p>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>Interactive Demo</Heading>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Button
              variant="success"
              onClick={handleSave}
              disabled={status === 'loading'}
              loading={status === 'loading'}
              startIcon={status === 'success' ? <CheckCircleFillIcon /> : undefined}
            >
              {status === 'success' ? 'Saved!' : 'Save Changes'}
            </Button>
            <Button
              variant="danger"
              onClick={handleError}
              disabled={status === 'loading'}
              loading={status === 'loading'}
              startIcon={status === 'error' ? <XCircleFillIcon /> : undefined}
            >
              {status === 'error' ? 'Failed!' : 'Trigger Error'}
            </Button>
          </div>

          {lastMessage && (
            <Alert
              variant={status === 'success' ? 'success' : status === 'error' ? 'danger' : 'info'}
              icon={
                status === 'success' ? (
                  <CheckCircleFillIcon />
                ) : status === 'error' ? (
                  <XCircleFillIcon />
                ) : (
                  <InfoCircleFillIcon />
                )
              }
              style={{ marginTop: '1rem' }}
              dismissible={false}
            >
              <strong>Last Announcement:</strong> {lastMessage}
            </Alert>
          )}
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-white)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>Usage Example</Heading>
          <pre
            style={{
              backgroundColor: 'var(--bs-gray-100)',
              padding: '1rem',
              borderRadius: '0.375rem',
              overflow: 'auto',
              margin: '1rem 0 0 0',
              fontSize: '0.875rem',
            }}
          >
            {`import { announceToScreenReader } from '@dsai-io/react';

function SaveButton() {
  const handleSave = async () => {
    // Polite announcement (waits for current speech to finish)
    announceToScreenReader('Saving your changes...');

    await saveData();

    // Success announcement
    announceToScreenReader('Changes saved successfully!');
  };

  const handleError = () => {
    // Assertive announcement (interrupts current speech)
    announceToScreenReader('Error: Please check your input', {
      politeness: 'assertive'
    });
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleError}>Cancel</button>
    </>
  );
}

// With cleanup
function Component() {
  const cleanup = announceToScreenReader('Loading...');

  // Later: manually clear the announcement
  cleanup();
}`}
          </pre>
        </div>

        <Alert variant="warning" dismissible={false}>
          <strong>Politeness Levels:</strong>
          <ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem' }}>
            <li>
              <strong>polite</strong> (default) - Waits for current speech to finish before
              announcing. Use for non-critical updates.
            </li>
            <li>
              <strong>assertive</strong> - Interrupts current speech immediately. Use sparingly for
              critical errors or urgent notifications.
            </li>
          </ul>
        </Alert>
      </div>
    );
  },
};

/**
 * ## trapFocus
 *
 * Create a focus trap within a container element to keep keyboard focus contained.
 * Essential for accessible modal dialogs per WCAG 2.1 Success Criterion 2.4.3 (Focus Order).
 *
 * ### Use Cases
 * - Modal dialogs
 * - Dropdown menus
 * - Popovers and tooltips
 * - Lightboxes and overlays
 *
 * ### API
 * ```typescript
 * interface TrapFocusOptions {
 *   focusableSelectors?: readonly string[];
 *   onWrap?: () => void;
 *   onEscape?: () => void;
 *   initialFocus?: boolean;
 * }
 *
 * function trapFocus(
 *   container: HTMLElement,
 *   options?: TrapFocusOptions
 * ): () => void
 * ```
 *
 * **Parameters:**
 * - `container` - DOM element to trap focus within
 * - `options.focusableSelectors` - Custom CSS selectors for focusable elements
 * - `options.onWrap` - Callback when focus wraps (first↔last)
 * - `options.onEscape` - Callback when Escape key is pressed
 * - `options.initialFocus` - Auto-focus first element on mount - default: false
 *
 * **Returns:** Cleanup function to release the focus trap
 */
export const TrapFocus: Story = {
  render: (): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (isOpen && modalRef.current) {
        const cleanup = trapFocus(modalRef.current, {
          initialFocus: true,
          onEscape: () => setIsOpen(false),
        });

        return cleanup;
      }
    }, [isOpen]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        <div>
          <Heading level={3}>Focus Trap for Modals</Heading>
          <p style={{ color: 'var(--bs-secondary)', marginTop: '0.5rem', marginBottom: 0 }}>
            Open the modal and press Tab to cycle through focusable elements. Focus stays trapped
            until the modal is closed.
          </p>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>Interactive Demo</Heading>
          <Button
            variant="primary"
            onClick={() => setIsOpen(true)}
            ref={triggerRef}
            style={{ marginTop: '1rem' }}
          >
            Open Modal with Focus Trap
          </Button>
        </div>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1040,
              }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Modal */}
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'var(--bs-white)',
                padding: '2rem',
                borderRadius: '0.5rem',
                boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
                zIndex: 1050,
                minWidth: '500px',
                maxWidth: '90vw',
              }}
            >
              <Heading level={3} id="modal-title">
                Focus Trap Example
              </Heading>
              <p style={{ marginTop: '1rem', color: 'var(--bs-secondary)' }}>
                Press <kbd>Tab</kbd> to move forward, <kbd>Shift + Tab</kbd> to move backward. Focus
                cycles between elements in this modal. Press <kbd>Escape</kbd> to close.
              </p>

              <div
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div>
                  <label
                    htmlFor="modal-input-1"
                    style={{ display: 'block', fontWeight: 'var(--sb-typography-font-weight-medium)', marginBottom: '0.5rem' }}
                  >
                    First Input
                  </label>
                  <input
                    id="modal-input-1"
                    type="text"
                    placeholder="First focusable element"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid var(--bs-border-color)',
                      borderRadius: '0.375rem',
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="modal-input-2"
                    style={{ display: 'block', fontWeight: 'var(--sb-typography-font-weight-medium)', marginBottom: '0.5rem' }}
                  >
                    Second Input
                  </label>
                  <input
                    id="modal-input-2"
                    type="text"
                    placeholder="Second focusable element"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid var(--bs-border-color)',
                      borderRadius: '0.375rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <Button variant="primary">Confirm</Button>
                <Button variant="outline-secondary" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-white)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>Usage Example</Heading>
          <pre
            style={{
              backgroundColor: 'var(--bs-gray-100)',
              padding: '1rem',
              borderRadius: '0.375rem',
              overflow: 'auto',
              margin: '1rem 0 0 0',
              fontSize: '0.875rem',
            }}
          >
            {`import { trapFocus } from '@dsai-io/react';
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Trap focus when modal opens
      const cleanup = trapFocus(modalRef.current, {
        initialFocus: true,
        onEscape: onClose,
      });

      // Cleanup releases focus trap when modal closes
      return cleanup;
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      <h2>Modal Title</h2>
      <input type="text" />
      <button onClick={onClose}>Close</button>
    </div>
  );
}`}
          </pre>
        </div>

        <Alert variant="info" dismissible={false}>
          <strong>Best Practices:</strong>
          <ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem' }}>
            <li>Always provide an Escape key handler to close the trap</li>
            <li>Return focus to the trigger element when closing</li>
            <li>Include at least one focusable element (preferably a close button)</li>
            <li>
              Use <code>aria-modal="true"</code> and <code>role="dialog"</code>
            </li>
          </ul>
        </Alert>
      </div>
    );
  },
};

/**
 * ## shouldAnimate & getAnimationDuration
 *
 * Respect user's motion preferences to support users with vestibular disorders.
 * Critical for WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions).
 *
 * ### Use Cases
 * - Conditionally apply CSS transitions
 * - Adjust animation timing
 * - Skip animations for users with vestibular disorders
 * - Reduce motion for battery savings
 *
 * ### API
 * ```typescript
 * function shouldAnimate(): boolean
 *
 * type AnimationDuration = 'fast' | 'normal' | 'slow' | 'standard';
 * function getAnimationDuration(type: AnimationDuration): number
 * ```
 *
 * **shouldAnimate()** - Returns `false` if user prefers reduced motion
 *
 * **getAnimationDuration(type):**
 * - `'fast'` - 150ms (or 0ms if reduced motion)
 * - `'normal'` - 300ms (or 0ms if reduced motion)
 * - `'slow'` - 500ms (or 0ms if reduced motion)
 * - `'standard'` - 300ms (or 0ms if reduced motion)
 */
export const AnimationPreferences: Story = {
  render: (): JSX.Element => {
    const [animate, setAnimate] = useState(shouldAnimate());
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handler = (): void => setAnimate(shouldAnimate());

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const handleAnimate = (): void => {
      if (!shouldAnimate()) {
        // Skip animation if user prefers reduced motion
        return;
      }

      setIsAnimating(true);
      const duration = getAnimationDuration('normal');
      setTimeout(() => setIsAnimating(false), duration);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        <div>
          <Heading level={3}>Motion Preferences</Heading>
          <p style={{ color: 'var(--bs-secondary)', marginTop: '0.5rem', marginBottom: 0 }}>
            Automatically respect user's <code>prefers-reduced-motion</code> setting. Enable it in
            your OS accessibility settings to test.
          </p>
        </div>

        <Alert
          variant={animate ? 'success' : 'warning'}
          icon={animate ? <CheckCircleFillIcon /> : <InfoCircleFillIcon />}
          dismissible={false}
        >
          <strong>Current Setting:</strong>{' '}
          {animate ? 'Animations enabled' : 'Reduced motion (animations disabled)'}
        </Alert>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>Interactive Demo</Heading>
          <Button variant="primary" onClick={handleAnimate} style={{ marginTop: '1rem' }}>
            Test Animation
          </Button>

          <div
            style={{
              marginTop: '1.5rem',
              height: '120px',
              backgroundColor: 'var(--bs-primary)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--bs-white)',
              fontWeight: 'var(--sb-typography-font-weight-bold)',
              fontSize: '1.125rem',
              transform: isAnimating ? 'scale(1.1) rotate(2deg)' : 'scale(1) rotate(0deg)',
              transition: animate ? 'all 0.3s ease' : 'none',
            }}
          >
            {isAnimating ? '🎉 Animating!' : 'Click button above'}
          </div>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-white)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>Usage Example</Heading>
          <pre
            style={{
              backgroundColor: 'var(--bs-gray-100)',
              padding: '1rem',
              borderRadius: '0.375rem',
              overflow: 'auto',
              margin: '1rem 0 0 0',
              fontSize: '0.875rem',
            }}
          >
            {`import { shouldAnimate, getAnimationDuration } from '@dsai-io/react';

function AnimatedCard() {
  const handleClick = () => {
    if (!shouldAnimate()) {
      // Skip animation - user prefers reduced motion
      updateState();
      return;
    }

    // Get duration (returns 0ms if reduced motion)
    const duration = getAnimationDuration('normal'); // 300ms or 0ms
    animate(duration);
  };

  return (
    <div
      style={{
        // Conditionally apply transition
        transition: shouldAnimate() ? 'transform 0.3s ease' : 'none',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      Card Content
    </div>
  );
}

// CSS-in-JS example
const styles = {
  card: {
    transition: shouldAnimate()
      ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'none',
  },
};`}
          </pre>
        </div>

        <Alert variant="info" dismissible={false}>
          <strong>Testing:</strong> Enable "Reduce motion" in your OS accessibility settings:
          <ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem' }}>
            <li>
              <strong>macOS:</strong> System Settings → Accessibility → Display → Reduce motion
            </li>
            <li>
              <strong>Windows:</strong> Settings → Accessibility → Visual effects → Animation
              effects
            </li>
            <li>
              <strong>iOS:</strong> Settings → Accessibility → Motion → Reduce Motion
            </li>
            <li>
              <strong>Android:</strong> Settings → Accessibility → Remove animations
            </li>
          </ul>
        </Alert>
      </div>
    );
  },
};

/**
 * ## API Reference
 *
 * Complete TypeScript API documentation for all a11y utilities.
 */
export const APIReference: Story = {
  render: (): JSX.Element => (
    <div style={{ maxWidth: '1000px' }}>
      <Heading level={2}>API Reference</Heading>
      <p style={{ color: 'var(--bs-secondary)', marginTop: '0.5rem' }}>
        Complete TypeScript signatures and parameters for all accessibility utilities.
      </p>

      {/* generateId */}
      <div style={{ marginTop: '2.5rem' }}>
        <Heading level={3}>
          <code style={{ fontSize: '1.25rem' }}>generateId</code>
        </Heading>
        <p style={{ marginTop: '0.5rem', color: 'var(--bs-secondary)' }}>
          Generate unique, SSR-safe IDs for form inputs and ARIA relationships.
        </p>

        <pre
          style={{
            backgroundColor: 'var(--bs-gray-100)',
            padding: '1rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            marginTop: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {`function generateId(prefix?: string): string`}
        </pre>

        <table
          style={{
            width: '100%',
            marginTop: '1rem',
            borderCollapse: 'collapse',
            border: '1px solid var(--bs-border-color)',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: 'var(--bs-gray-100)' }}>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Parameter
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Type
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Default
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>prefix</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>string</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>'id'</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                Optional prefix for the generated ID
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
          <strong>Returns:</strong> <code>string</code> - Unique ID in format{' '}
          <code>{`\${prefix}-\${counter}`}</code>
        </div>
      </div>

      {/* announceToScreenReader */}
      <div style={{ marginTop: '2.5rem' }}>
        <Heading level={3}>
          <code style={{ fontSize: '1.25rem' }}>announceToScreenReader</code>
        </Heading>
        <p style={{ marginTop: '0.5rem', color: 'var(--bs-secondary)' }}>
          Announce messages to screen readers via ARIA live regions.
        </p>

        <pre
          style={{
            backgroundColor: 'var(--bs-gray-100)',
            padding: '1rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            marginTop: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {`interface AnnounceOptions {
  readonly politeness?: 'polite' | 'assertive';
  readonly id?: string;
  readonly timeoutMs?: number;
}

function announceToScreenReader(
  message: string,
  options?: AnnounceOptions
): () => void`}
        </pre>

        <table
          style={{
            width: '100%',
            marginTop: '1rem',
            borderCollapse: 'collapse',
            border: '1px solid var(--bs-border-color)',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: 'var(--bs-gray-100)' }}>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Parameter
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Type
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Default
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>message</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>string</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>-</td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                Message to announce
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>options.politeness</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>'polite' | 'assertive'</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>'polite'</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                Announcement priority
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>options.id</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>string</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>'dsai-live-region'</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                Custom live region ID
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>options.timeoutMs</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>number</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>2000</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                Auto-clear timeout
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
          <strong>Returns:</strong> <code>() =&gt; void</code> - Cleanup function
        </div>
      </div>

      {/* trapFocus */}
      <div style={{ marginTop: '2.5rem' }}>
        <Heading level={3}>
          <code style={{ fontSize: '1.25rem' }}>trapFocus</code>
        </Heading>
        <p style={{ marginTop: '0.5rem', color: 'var(--bs-secondary)' }}>
          Trap keyboard focus within a container element.
        </p>

        <pre
          style={{
            backgroundColor: 'var(--bs-gray-100)',
            padding: '1rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            marginTop: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {`interface TrapFocusOptions {
  readonly focusableSelectors?: readonly string[];
  readonly onWrap?: () => void;
  readonly onEscape?: () => void;
  readonly initialFocus?: boolean;
}

function trapFocus(
  container: HTMLElement,
  options?: TrapFocusOptions
): () => void`}
        </pre>

        <table
          style={{
            width: '100%',
            marginTop: '1rem',
            borderCollapse: 'collapse',
            border: '1px solid var(--bs-border-color)',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: 'var(--bs-gray-100)' }}>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Parameter
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Type
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Default
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>container</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>HTMLElement</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>-</td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                Element to trap focus within
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>options.focusableSelectors</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>string[]</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>default selectors</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                Custom focusable selectors
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>options.onWrap</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>() =&gt; void</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>-</td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                Called when focus wraps
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>options.onEscape</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>() =&gt; void</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>-</td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                Called on Escape key press
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>options.initialFocus</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>boolean</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>false</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                Auto-focus first element
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
          <strong>Returns:</strong> <code>() =&gt; void</code> - Cleanup function
        </div>
      </div>

      {/* shouldAnimate */}
      <div style={{ marginTop: '2.5rem' }}>
        <Heading level={3}>
          <code style={{ fontSize: '1.25rem' }}>shouldAnimate</code>
        </Heading>
        <p style={{ marginTop: '0.5rem', color: 'var(--bs-secondary)' }}>
          Check if animations should be enabled based on user preferences.
        </p>

        <pre
          style={{
            backgroundColor: 'var(--bs-gray-100)',
            padding: '1rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            marginTop: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {`function shouldAnimate(): boolean`}
        </pre>

        <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
          <strong>Returns:</strong> <code>boolean</code> - <code>true</code> if animations should
          run, <code>false</code> if user prefers reduced motion
        </div>
      </div>

      {/* getAnimationDuration */}
      <div style={{ marginTop: '2.5rem' }}>
        <Heading level={3}>
          <code style={{ fontSize: '1.25rem' }}>getAnimationDuration</code>
        </Heading>
        <p style={{ marginTop: '0.5rem', color: 'var(--bs-secondary)' }}>
          Get animation duration respecting user's motion preferences.
        </p>

        <pre
          style={{
            backgroundColor: 'var(--bs-gray-100)',
            padding: '1rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            marginTop: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {`type AnimationDuration = 'fast' | 'normal' | 'slow' | 'standard';

function getAnimationDuration(type: AnimationDuration): number`}
        </pre>

        <table
          style={{
            width: '100%',
            marginTop: '1rem',
            borderCollapse: 'collapse',
            border: '1px solid var(--bs-border-color)',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: 'var(--bs-gray-100)' }}>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Type
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Duration (normal)
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  border: '1px solid var(--bs-border-color)',
                }}
              >
                Duration (reduced motion)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>'fast'</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                150ms
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                0ms
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>'normal'</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                300ms
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                0ms
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>'slow'</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                500ms
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                0ms
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                <code>'standard'</code>
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                300ms
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid var(--bs-border-color)' }}>
                0ms
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
          <strong>Returns:</strong> <code>number</code> - Duration in milliseconds (0 if reduced
          motion)
        </div>
      </div>
    </div>
  ),
};
