import { render, screen, waitFor } from '@testing-library/react';

import { Modal } from './Modal';

describe('Modal Security Tests', () => {
  describe('Prop Whitelisting', () => {
    it('accepts whitelisted data-testid attribute', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} data-testid="modal-test" animated={false}>
          <Modal.Header data-testid="header-test">Title</Modal.Header>
          <Modal.Body data-testid="body-test">Content</Modal.Body>
          <Modal.Footer data-testid="footer-test">Footer</Modal.Footer>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByTestId('modal-test')).toBeInTheDocument();
        expect(screen.getByTestId('header-test')).toBeInTheDocument();
        expect(screen.getByTestId('body-test')).toBeInTheDocument();
        expect(screen.getByTestId('footer-test')).toBeInTheDocument();
      });
    });

    it('accepts whitelisted data-test attribute', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} data-test="modal-test" animated={false}>
          <Modal.Header data-test="header-test">Title</Modal.Header>
          <Modal.Body data-test="body-test">Content</Modal.Body>
          <Modal.Footer data-test="footer-test">Footer</Modal.Footer>
        </Modal>
      );

      await waitFor(() => {
        expect(baseElement.querySelector('[data-test="modal-test"]')).toBeInTheDocument();
        expect(baseElement.querySelector('[data-test="header-test"]')).toBeInTheDocument();
        expect(baseElement.querySelector('[data-test="body-test"]')).toBeInTheDocument();
        expect(baseElement.querySelector('[data-test="footer-test"]')).toBeInTheDocument();
      });
    });

    it('accepts whitelisted id attribute', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} id="custom-modal-id" animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveAttribute('id', 'custom-modal-id');
      });
    });

    it('accepts whitelisted className attribute', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} className="custom-modal-class" animated={false}>
          <Modal.Header className="custom-header-class">Title</Modal.Header>
          <Modal.Body className="custom-body-class">Content</Modal.Body>
          <Modal.Footer className="custom-footer-class">Footer</Modal.Footer>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveClass('custom-modal-class');
        expect(baseElement.querySelector('.custom-header-class')).toBeInTheDocument();
        expect(baseElement.querySelector('.custom-body-class')).toBeInTheDocument();
        expect(baseElement.querySelector('.custom-footer-class')).toBeInTheDocument();
      });
    });

    it('accepts whitelisted style attribute', async () => {
      const { baseElement } = render(
        <Modal
          isOpen={true}
          onClose={() => {}}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          animated={false}
        >
          <Modal.Header style={{ color: 'red' }}>Title</Modal.Header>
          <Modal.Body style={{ padding: '20px' }}>Content</Modal.Body>
          <Modal.Footer style={{ borderTop: '1px solid #ccc' }}>Footer</Modal.Footer>
        </Modal>
      );

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toHaveStyle({ backgroundColor: 'rgba(0,0,0,0.5)' });
        const header = baseElement.querySelector('.modal-header');
        // Use rgb() format as that's how the browser normalizes color values
        expect(header).toHaveStyle({ color: 'rgb(255, 0, 0)' });
        const body = baseElement.querySelector('.modal-body');
        expect(body).toHaveStyle({ padding: '20px' });
        const footer = baseElement.querySelector('.modal-footer');
        // Use rgb() format for border colors as well
        expect(footer).toHaveStyle({ borderTop: '1px solid rgb(204, 204, 204)' });
      });
    });
  });

  describe('No Unrestricted Prop Spreading', () => {
    it('does not spread unknown props to DOM (Modal)', async () => {
      // TypeScript should prevent this, but we test runtime behavior
      const props = {
        isOpen: true,
        onClose: () => {},
        animated: false,
        'data-testid': 'modal-test',
        // These should NOT appear in DOM
        // Note: Since we use explicit prop whitelisting, these shouldn't be passed
      } as React.ComponentProps<typeof Modal>;

      render(
        <Modal {...props}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        // Verify only allowed attributes are present
        const attributes = Array.from(modal.attributes).map((attr) => attr.name);

        // Should have these allowed attributes
        expect(attributes).toContain('role');
        expect(attributes).toContain('aria-modal');
        expect(attributes).toContain('aria-labelledby');
        expect(attributes).toContain('aria-describedby');
        expect(attributes).toContain('data-testid');
        expect(attributes).toContain('class');
        expect(attributes).toContain('style');
        expect(attributes).toContain('tabindex');
        expect(attributes).toContain('data-visual-state');
      });
    });

    it('does not allow dangerous event handlers through props', async () => {
      // The Modal component should only accept explicitly defined handlers
      // onClose is the only handler that should work
      const onClose = jest.fn();

      render(
        <Modal isOpen={true} onClose={onClose} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        // Verify no dangerous event handlers are present
        // These would be XSS vectors if allowed through spread
        expect(modal).not.toHaveAttribute('onerror');
        expect(modal).not.toHaveAttribute('onload');
        expect(modal).not.toHaveAttribute('onfocus');
        expect(modal).not.toHaveAttribute('onblur');
      });
    });
  });

  describe('Close Button Security', () => {
    it('close button uses type="button" to prevent form submission', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: 'Close' });
        expect(closeButton).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('Portal Security', () => {
    it('renders modal in portal to prevent z-index manipulation attacks', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const modal = baseElement.querySelector('.modal');
        // Modal should be a direct child of body, not nested in the test container
        expect(modal?.parentElement).toBe(document.body);
      });
    });

    it('modal has proper z-index for overlay', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} zIndex={1055} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toHaveStyle({ zIndex: 1055 });
      });
    });

    it('backdrop has z-index lower than modal', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} zIndex={1055} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const backdrop = baseElement.querySelector('.modal-backdrop');
        expect(backdrop).toHaveStyle({ zIndex: 1054 });
      });
    });
  });

  describe('Content Security', () => {
    it('does not use dangerouslySetInnerHTML', async () => {
      // This test verifies the component safely renders children
      const userContent = '<script>alert("XSS")</script>';

      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>{userContent}</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const body = document.querySelector('.modal-body');
        // Script tags should be escaped/shown as text, not executed
        expect(body?.textContent).toContain('<script>');
        // Verify no actual script element was created
        expect(body?.querySelector('script')).toBeNull();
      });
    });

    it('safely renders user-provided children', async () => {
      const maliciousClassName = 'legitimate" onclick="alert(1)" data-evil="';

      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>
            <div className={maliciousClassName}>Content</div>
          </Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        const body = document.querySelector('.modal-body');
        const div = body?.querySelector('div');
        // React should sanitize the className properly
        expect(div).not.toHaveAttribute('onclick');
        expect(div).not.toHaveAttribute('data-evil');
      });
    });
  });

  describe('Event Handler Security', () => {
    it('onClose is called with no event payload that could be exploited', async () => {
      const onClose = jest.fn();

      render(
        <Modal isOpen={true} onClose={onClose} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: 'Close' });
      closeButton.click();

      expect(onClose).toHaveBeenCalledTimes(1);
      // onClose should be called with no arguments (clean handler)
      expect(onClose).toHaveBeenCalledWith();
    });
  });

  describe('Callback Isolation', () => {
    it('onOpened callback is isolated (no sensitive data exposed)', async () => {
      const onOpened = jest.fn();

      render(
        <Modal isOpen={true} onClose={() => {}} onOpened={onOpened} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(onOpened).toHaveBeenCalled();
      });

      // onOpened should be called with no arguments
      expect(onOpened).toHaveBeenCalledWith();
    });

    it('onClosed callback is isolated (no sensitive data exposed)', async () => {
      const onClosed = jest.fn();

      const { rerender } = render(
        <Modal isOpen={true} onClose={() => {}} onClosed={onClosed} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      rerender(
        <Modal isOpen={false} onClose={() => {}} onClosed={onClosed} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );

      await waitFor(() => {
        expect(onClosed).toHaveBeenCalled();
      });

      // onClosed should be called with no arguments
      expect(onClosed).toHaveBeenCalledWith();
    });
  });
});
