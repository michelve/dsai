import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';

import { Modal } from './Modal';

describe('Modal', () => {
  describe('Rendering', () => {
    it('does not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={() => {}}>
          <Modal.Header>Test</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Test</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('renders Modal.Header with title', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Modal Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByText('Modal Title')).toBeInTheDocument();
      });
    });

    it('renders Modal.Body with content', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Modal body content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByText('Modal body content')).toBeInTheDocument();
      });
    });

    it('renders Modal.Footer with buttons', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
          <Modal.Footer>
            <button type="button">Save</button>
          </Modal.Footer>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      });
    });

    it('renders close button in header by default', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
      });
    });

    it('hides close button when closeButton={false}', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header closeButton={false}>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
      });
    });

    it('renders in portal (document.body)', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        const modal = baseElement.querySelector('.modal');
        expect(modal).toBeInTheDocument();
        expect(modal?.parentElement).toBe(document.body);
      });
    });
  });

  describe('Sizes', () => {
    it('renders without size class for default (md) size', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} size="md" animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        const dialog = document.querySelector('.modal-dialog');
        expect(dialog).not.toHaveClass('modal-sm');
        expect(dialog).not.toHaveClass('modal-lg');
        expect(dialog).not.toHaveClass('modal-xl');
      });
    });

    it('renders with modal-sm class for small size', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} size="sm" animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        const dialog = document.querySelector('.modal-dialog');
        expect(dialog).toHaveClass('modal-sm');
      });
    });

    it('renders with modal-lg class for large size', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} size="lg" animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        const dialog = document.querySelector('.modal-dialog');
        expect(dialog).toHaveClass('modal-lg');
      });
    });

    it('renders with modal-xl class for extra large size', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} size="xl" animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        const dialog = document.querySelector('.modal-dialog');
        expect(dialog).toHaveClass('modal-xl');
      });
    });

    it('renders with modal-fullscreen class for fullscreen size', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} size="fullscreen" animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        const dialog = document.querySelector('.modal-dialog');
        expect(dialog).toHaveClass('modal-fullscreen');
      });
    });

    it('renders with responsive fullscreen class', async () => {
      render(
        <Modal
          isOpen={true}
          onClose={() => {}}
          size="fullscreen"
          fullscreenBreakpoint="md-down"
          animated={false}
        >
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        const dialog = document.querySelector('.modal-dialog');
        expect(dialog).toHaveClass('modal-fullscreen-md-down');
      });
    });
  });

  describe('Centered and Scrollable', () => {
    it('renders with modal-dialog-centered when centered={true}', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} centered animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        const dialog = document.querySelector('.modal-dialog');
        expect(dialog).toHaveClass('modal-dialog-centered');
      });
    });

    it('renders with modal-dialog-scrollable when scrollable={true}', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} scrollable animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        const dialog = document.querySelector('.modal-dialog');
        expect(dialog).toHaveClass('modal-dialog-scrollable');
      });
    });
  });

  describe('Backdrop', () => {
    it('renders backdrop by default', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        const backdrop = baseElement.querySelector('.modal-backdrop');
        expect(backdrop).toBeInTheDocument();
      });
    });

    it('does not render backdrop when backdrop={false}', async () => {
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} backdrop={false} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        const backdrop = baseElement.querySelector('.modal-backdrop');
        expect(backdrop).not.toBeInTheDocument();
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
  });

  describe('Close Behavior', () => {
    it('calls onClose when close button is clicked', async () => {
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
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when ESC key is pressed', async () => {
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

    it('does not call onClose when ESC is disabled', async () => {
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

    it('calls onClose when backdrop is clicked', async () => {
      const handleClose = jest.fn();
      const { baseElement } = render(
        <Modal isOpen={true} onClose={handleClose} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const modal = baseElement.querySelector('.modal');
      expect(modal).toBeInTheDocument();
      if (modal) {
        fireEvent.click(modal);
      }
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when backdrop click is disabled', async () => {
      const handleClose = jest.fn();
      const { baseElement } = render(
        <Modal isOpen={true} onClose={handleClose} closeOnBackdropClick={false} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const modal = baseElement.querySelector('.modal');
      expect(modal).toBeInTheDocument();
      if (modal) {
        fireEvent.click(modal);
      }
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('does not call onClose when clicking inside modal content', async () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Content'));
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Static Backdrop', () => {
    it('does not close on backdrop click when staticBackdrop={true}', async () => {
      const handleClose = jest.fn();
      const { baseElement } = render(
        <Modal isOpen={true} onClose={handleClose} staticBackdrop animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const modal = baseElement.querySelector('.modal');
      expect(modal).toBeInTheDocument();
      if (modal) {
        fireEvent.click(modal);
      }
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('adds modal-static class briefly on backdrop click with staticBackdrop', async () => {
      jest.useFakeTimers();
      const { baseElement } = render(
        <Modal isOpen={true} onClose={() => {}} staticBackdrop animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const modal = baseElement.querySelector('.modal');
      const dialog = baseElement.querySelector('.modal-dialog');
      expect(modal).toBeInTheDocument();
      if (modal) {
        fireEvent.click(modal);
      }
      expect(dialog).toHaveClass('modal-static');
      jest.advanceTimersByTime(300);
      expect(dialog).not.toHaveClass('modal-static');
      jest.useRealTimers();
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} className="custom-modal" animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveClass('custom-modal');
      });
    });

    it('accepts inline styles', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} style={{ marginTop: '20px' }} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveStyle({ marginTop: '20px' });
      });
    });

    it('accepts custom zIndex', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} zIndex={2000} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveStyle({ zIndex: 2000 });
      });
    });
  });

  describe('HTML Attributes', () => {
    it('accepts id attribute', async () => {
      const testId = 'test-modal-id';
      render(
        <Modal isOpen={true} onClose={() => {}} id={testId} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveAttribute('id', testId);
      });
    });

    it('accepts data-testid attribute', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} data-testid="modal-test" animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByTestId('modal-test')).toBeInTheDocument();
      });
    });

    it('accepts data-test attribute on Modal.Header', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header data-test="header-test">Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        const header = document.querySelector('[data-test="header-test"]');
        expect(header).toBeInTheDocument();
      });
    });

    it('accepts data-test attribute on Modal.Body', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body data-test="body-test">Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        const body = document.querySelector('[data-test="body-test"]');
        expect(body).toBeInTheDocument();
      });
    });

    it('accepts data-test attribute on Modal.Footer', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
          <Modal.Footer data-test="footer-test">Footer</Modal.Footer>
        </Modal>
      );
      await waitFor(() => {
        const footer = document.querySelector('[data-test="footer-test"]');
        expect(footer).toBeInTheDocument();
      });
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the modal element', async () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Modal ref={ref} isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveClass('modal');
      });
    });
  });

  describe('Display Names', () => {
    it('has correct displayName for Modal', () => {
      expect(Modal.displayName).toBe('Modal');
    });

    it('has correct displayName for Modal.Header', () => {
      expect(Modal.Header.displayName).toBe('Modal.Header');
    });

    it('has correct displayName for Modal.Title', () => {
      expect(Modal.Title.displayName).toBe('Modal.Title');
    });

    it('has correct displayName for Modal.Body', () => {
      expect(Modal.Body.displayName).toBe('Modal.Body');
    });

    it('has correct displayName for Modal.Footer', () => {
      expect(Modal.Footer.displayName).toBe('Modal.Footer');
    });
  });

  describe('Controlled Behavior', () => {
    it('opens when isOpen changes from false to true', async () => {
      const { rerender } = render(
        <Modal isOpen={false} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('closes when isOpen changes from true to false', async () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      rerender(
        <Modal isOpen={false} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('FSM Integration', () => {
    it('exposes data-visual-state attribute', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveAttribute('data-visual-state', 'open');
      });
    });
  });

  describe('Animation Classes', () => {
    it('has fade class when animated={true}', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={true}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveClass('fade');
      });
    });

    it('does not have fade class when animated={false}', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).not.toHaveClass('fade');
      });
    });
  });

  describe('Callbacks', () => {
    it('calls onOpened when modal finishes opening (without animation)', async () => {
      const handleOpened = jest.fn();
      render(
        <Modal isOpen={true} onClose={() => {}} onOpened={handleOpened} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(handleOpened).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onClosed when modal finishes closing (without animation)', async () => {
      const handleClosed = jest.fn();
      const { rerender } = render(
        <Modal isOpen={true} onClose={() => {}} onClosed={handleClosed} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      rerender(
        <Modal isOpen={false} onClose={() => {}} onClosed={handleClosed} animated={false}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      );
      await waitFor(() => {
        expect(handleClosed).toHaveBeenCalledTimes(1);
      });
    });
  });
});
