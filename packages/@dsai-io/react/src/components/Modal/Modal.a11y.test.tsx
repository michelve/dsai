import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { useRef, useState } from 'react';

import { Modal } from './Modal';

expect.extend(toHaveNoViolations);

describe('Modal Accessibility', () => {
  describe('jest-axe Validations', () => {
    it('has no accessibility violations when open', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Modal Title</Modal.Header>
          <Modal.Body>Modal content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with all subcomponents', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Modal Title</Modal.Header>
          <Modal.Body>Modal body content here.</Modal.Body>
          <Modal.Footer>
            <button type="button">Cancel</button>
            <button type="button">Save</button>
          </Modal.Footer>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with different sizes', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} size="sm" animated={false} id="modal-sm">
          <Modal.Header>Small Modal</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with centered modal', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} centered animated={false}>
          <Modal.Header>Centered Modal</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with scrollable modal', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} scrollable animated={false}>
          <Modal.Header>Scrollable Modal</Modal.Header>
          <Modal.Body>Long content here...</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with fullscreen modal', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} size="fullscreen" animated={false}>
          <Modal.Header>Fullscreen Modal</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });

    it('has no violations without close button', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header closeButton={false}>No Close Button</Modal.Header>
          <Modal.Body>Content</Modal.Body>
          <Modal.Footer>
            <button type="button">Close via button</button>
          </Modal.Footer>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes', () => {
    it('has role="dialog"', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('has aria-modal="true"', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
      });
    });

    it('has aria-labelledby pointing to title', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} titleId="custom-title" animated={false}>
          <Modal.Header>Modal Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toHaveAttribute('aria-labelledby', 'custom-title');
        const title = document.getElementById('custom-title');
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Modal Title');
      });
    });

    it('has aria-describedby pointing to body', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} bodyId="custom-body" animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Description content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toHaveAttribute('aria-describedby', 'custom-body');
        const body = document.getElementById('custom-body');
        expect(body).toBeInTheDocument();
        expect(body).toHaveTextContent('Description content');
      });
    });

    it('generates unique IDs when not provided', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        const labelledBy = modal.getAttribute('aria-labelledby');
        const describedBy = modal.getAttribute('aria-describedby');
        expect(labelledBy).toBeTruthy();
        expect(describedBy).toBeTruthy();
        expect(labelledBy).not.toBe(describedBy);
      });
    });

    it('close button has aria-label="Close"', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: 'Close' });
        expect(closeButton).toHaveAttribute('aria-label', 'Close');
      });
    });

    it('backdrop has aria-hidden="true"', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const backdrop = baseElement.querySelector('.modal-backdrop');
        expect(backdrop).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('modal has tabIndex="-1"', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes on ESC key by default', async () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on ESC when closeOnEscape={false}', async () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} closeOnEscape={false} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('close button is keyboard accessible', async () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: 'Close' });
      closeButton.focus();
      expect(document.activeElement).toBe(closeButton);

      fireEvent.keyDown(closeButton, { key: 'Enter' });
      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('renders with focusable elements inside the modal', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>
            <button type="button" data-testid="btn1">
              Button 1
            </button>
            <button type="button" data-testid="btn2">
              Button 2
            </button>
          </Modal.Body>
        </Modal>
      );

      // Wait for modal to be in the DOM
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Verify the modal has the close button in header
      const closeButton = screen.getByRole('button', { name: 'Close' });
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveClass('btn-close');

      // Verify the buttons inside the modal body
      expect(screen.getByTestId('btn1')).toBeInTheDocument();
      expect(screen.getByTestId('btn2')).toBeInTheDocument();

      // Verify modal has tabindex for keyboard accessibility
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('tabindex', '-1');
    });

    it('focuses initial element when initialFocusRef is provided', async () => {
      const TestComponent = () => {
        const buttonRef = useRef<HTMLButtonElement>(null);
        return (
          <Modal isOpen={true} onClose={() => {}} initialFocusRef={buttonRef} animated={false}>
            <Modal.Header>Title</Modal.Header>
            <Modal.Body>
              <button type="button" ref={buttonRef} data-testid="initial-focus">
                Focus Me
              </button>
            </Modal.Body>
          </Modal>
        );
      };

      render(<TestComponent />);

      await waitFor(
        () => {
          expect(document.activeElement).toBe(screen.getByTestId('initial-focus'));
        },
        { timeout: 200 }
      );
    });

    it('returns focus to trigger element when modal closes', async () => {
      const TestComponent = () => {
        const [isOpen, setIsOpen] = useState(false);
        const triggerRef = useRef<HTMLButtonElement>(null);
        return (
          <>
            <button type="button" ref={triggerRef} onClick={() => setIsOpen(true)}>
              Open Modal
            </button>
            <Modal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              returnFocusRef={triggerRef}
              animated={false}
            >
              <Modal.Header>Title</Modal.Header>
              <Modal.Body>Content</Modal.Body>
            </Modal>
          </>
        );
      };

      render(<TestComponent />);

      // Focus trigger and open modal
      const trigger = screen.getByRole('button', { name: 'Open Modal' });
      trigger.focus();
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Close modal via ESC
      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(document.activeElement).toBe(trigger);
      });
    });
  });

  describe('Screen Reader Announcements', () => {
    it('modal title is accessible to screen readers', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Accessible Modal Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        const labelledById = dialog.getAttribute('aria-labelledby');
        expect(labelledById).toBeTruthy();
        if (labelledById) {
          const titleElement = document.getElementById(labelledById);
          expect(titleElement).toHaveTextContent('Accessible Modal Title');
        }
      });
    });

    it('modal description is accessible to screen readers', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>This is the modal description that screen readers will announce.</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        const describedById = dialog.getAttribute('aria-describedby');
        expect(describedById).toBeTruthy();
        if (describedById) {
          const bodyElement = document.getElementById(describedById);
          expect(bodyElement).toHaveTextContent(
            'This is the modal description that screen readers will announce.'
          );
        }
      });
    });
  });

  describe('Modal.Title Component', () => {
    it('renders with correct ID for aria-labelledby', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} titleId="test-title" animated={false}>
          <Modal.Header>
            <Modal.Title>Custom Title Component</Modal.Title>
          </Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const title = document.getElementById('test-title');
        expect(title).toHaveTextContent('Custom Title Component');
        expect(title).toHaveClass('modal-title');
      });
    });

    it('can render with custom heading level', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>
            <Modal.Title as="h2">H2 Title</Modal.Title>
          </Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('H2 Title');
      });
    });
  });

  describe('alertdialog Role', () => {
    it('has no accessibility violations with role="alertdialog"', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} role="alertdialog" animated={false}>
          <Modal.Header>Confirm Delete</Modal.Header>
          <Modal.Body>Are you sure you want to delete this?</Modal.Body>
          <Modal.Footer>
            <button type="button">Cancel</button>
            <button type="button">Delete</button>
          </Modal.Footer>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });

    it('alertdialog has proper ARIA attributes', async () => {
      render(
        <Modal
          isOpen={true}
          onClose={() => {}}
          role="alertdialog"
          titleId="alert-title"
          animated={false}
        >
          <Modal.Header>Warning</Modal.Header>
          <Modal.Body>This action cannot be undone.</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const alertDialog = screen.getByRole('alertdialog');
        expect(alertDialog).toHaveAttribute('aria-modal', 'true');
        expect(alertDialog).toHaveAttribute('aria-labelledby', 'alert-title');
      });
    });
  });

  describe('Modal.Description Accessibility', () => {
    it('has no violations with Modal.Description', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>
            <Modal.Description>Concise description for screen readers</Modal.Description>
            <p>Additional content here...</p>
          </Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });

    it('aria-describedby references Description element when present', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>
            <Modal.Description>Screen reader description</Modal.Description>
            <p>Other content</p>
          </Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        const describedById = dialog.getAttribute('aria-describedby');
        expect(describedById).toBeTruthy();
        if (describedById) {
          const descElement = document.getElementById(describedById);
          expect(descElement).toHaveTextContent('Screen reader description');
          expect(descElement).toHaveClass('modal-description');
        }
      });
    });

    it('aria-describedby falls back to body when no Description', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} bodyId="fallback-body" animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Body content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-describedby', 'fallback-body');
      });
    });
  });
});
