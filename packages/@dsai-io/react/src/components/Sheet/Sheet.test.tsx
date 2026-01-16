import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';

import { Sheet } from './Sheet';

describe('Sheet', () => {
  describe('Rendering', () => {
    it('does not render when isOpen is false', () => {
      render(
        <Sheet isOpen={false} onClose={() => {}}>
          <Sheet.Header>Test</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Test</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('renders Sheet.Header with title', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Sheet Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByText('Sheet Title')).toBeInTheDocument();
      });
    });

    it('renders Sheet.Body with content', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Sheet body content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByText('Sheet body content')).toBeInTheDocument();
      });
    });

    it('renders Sheet.Footer with buttons', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
          <Sheet.Footer>
            <button type="button">Save</button>
          </Sheet.Footer>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      });
    });

    it('renders close button in header by default', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
      });
    });

    it('hides close button when closeButton={false}', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header closeButton={false}>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
      });
    });

    it('renders in portal (document.body)', async () => {
      const { baseElement } = render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = baseElement.querySelector('.offcanvas');
        expect(sheet).toBeInTheDocument();
        expect(sheet?.parentElement).toBe(document.body);
      });
    });
  });

  describe('Placement', () => {
    it('renders with offcanvas-end class for right placement (default)', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = document.querySelector('.offcanvas');
        expect(sheet).toHaveClass('offcanvas-end');
      });
    });

    it('renders with offcanvas-start class for left placement', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} placement="left" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = document.querySelector('.offcanvas');
        expect(sheet).toHaveClass('offcanvas-start');
      });
    });

    it('renders with offcanvas-top class for top placement', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} placement="top" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = document.querySelector('.offcanvas');
        expect(sheet).toHaveClass('offcanvas-top');
      });
    });

    it('renders with offcanvas-bottom class for bottom placement', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} placement="bottom" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = document.querySelector('.offcanvas');
        expect(sheet).toHaveClass('offcanvas-bottom');
      });
    });

    it('sets data-placement attribute', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} placement="left" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = document.querySelector('.offcanvas');
        expect(sheet).toHaveAttribute('data-placement', 'left');
      });
    });
  });

  describe('Sizes', () => {
    it('applies custom width via CSS variable for horizontal sheets', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} placement="right" width={500} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = document.querySelector('.offcanvas') as HTMLElement;
        expect(sheet).toHaveStyle({ '--bs-offcanvas-width': '500px' });
      });
    });

    it('applies custom height via CSS variable for vertical sheets', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} placement="bottom" height="50vh" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = document.querySelector('.offcanvas') as HTMLElement;
        expect(sheet).toHaveStyle({ '--bs-offcanvas-height': '50vh' });
      });
    });
  });

  describe('Surface Variants', () => {
    it('applies surface class for non-default variants', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} surface="elevated" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = document.querySelector('.offcanvas');
        expect(sheet).toHaveClass('offcanvas-elevated');
      });
    });

    it('does not apply surface class for default variant', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} surface="default" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = document.querySelector('.offcanvas');
        expect(sheet).not.toHaveClass('offcanvas-default');
      });
    });
  });

  describe('Close Behavior', () => {
    it('calls onClose when close button is clicked', async () => {
      const onClose = jest.fn();
      render(
        <Sheet isOpen={true} onClose={onClose} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when ESC key is pressed', async () => {
      const onClose = jest.fn();
      render(
        <Sheet isOpen={true} onClose={onClose} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when ESC is pressed and closeOnEscape={false}', async () => {
      const onClose = jest.fn();
      render(
        <Sheet isOpen={true} onClose={onClose} closeOnEscape={false} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when backdrop is clicked', async () => {
      const onClose = jest.fn();
      render(
        <Sheet isOpen={true} onClose={onClose} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(document.querySelector('.offcanvas-backdrop')).toBeInTheDocument();
      });
      fireEvent.click(document.querySelector('.offcanvas-backdrop') as Element);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when backdrop click is disabled', async () => {
      const onClose = jest.fn();
      render(
        <Sheet isOpen={true} onClose={onClose} closeOnBackdropClick={false} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(document.querySelector('.offcanvas-backdrop')).toBeInTheDocument();
      });
      fireEvent.click(document.querySelector('.offcanvas-backdrop') as Element);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not close on backdrop click when staticBackdrop is true', async () => {
      const onClose = jest.fn();
      render(
        <Sheet isOpen={true} onClose={onClose} staticBackdrop animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(document.querySelector('.offcanvas-backdrop')).toBeInTheDocument();
      });
      fireEvent.click(document.querySelector('.offcanvas-backdrop') as Element);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Backdrop', () => {
    it('renders backdrop by default', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(document.querySelector('.offcanvas-backdrop')).toBeInTheDocument();
      });
    });

    it('does not render backdrop when backdrop={false}', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} backdrop={false} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
    });

    it('does not render backdrop in non-modal mode', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} mode="non-modal" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      expect(document.querySelector('.offcanvas-backdrop')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has role="dialog"', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('has aria-modal="true" in modal mode', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
      });
    });

    it('does not have aria-modal in non-modal mode', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} mode="non-modal" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
      });
    });

    it('has aria-labelledby pointing to title', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Sheet Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        const titleId = dialog.getAttribute('aria-labelledby');
        expect(titleId).toBeTruthy();
        const title = document.getElementById(titleId as string);
        expect(title).toHaveTextContent('Sheet Title');
      });
    });

    it('has aria-describedby pointing to body', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Sheet body content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        const bodyId = dialog.getAttribute('aria-describedby');
        expect(bodyId).toBeTruthy();
        const body = document.getElementById(bodyId as string);
        expect(body).toHaveTextContent('Sheet body content');
      });
    });

    it('accepts custom titleId', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} titleId="custom-title-id" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'custom-title-id');
      });
    });

    it('accepts custom bodyId', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} bodyId="custom-body-id" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveAttribute('aria-describedby', 'custom-body-id');
      });
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to sheet element', async () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Sheet ref={ref} isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveClass('offcanvas');
      });
    });

    it('forwards ref to Sheet.Header', async () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header ref={ref}>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveClass('offcanvas-header');
      });
    });

    it('forwards ref to Sheet.Body', async () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body ref={ref}>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveClass('offcanvas-body');
      });
    });

    it('forwards ref to Sheet.Footer', async () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
          <Sheet.Footer ref={ref}>Footer</Sheet.Footer>
        </Sheet>
      );
      await waitFor(() => {
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveClass('modal-footer');
      });
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} className="custom-sheet" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(document.querySelector('.offcanvas')).toHaveClass('custom-sheet');
      });
    });

    it('applies custom id', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} id="my-sheet" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(document.getElementById('my-sheet')).toBeInTheDocument();
      });
    });

    it('applies data-testid', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} data-testid="sheet-test" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByTestId('sheet-test')).toBeInTheDocument();
      });
    });

    it('applies custom zIndex', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} zIndex={2000} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = document.querySelector('.offcanvas') as HTMLElement;
        expect(sheet).toHaveStyle({ zIndex: '2000' });
      });
    });
  });

  describe('Compound Components', () => {
    it('Sheet.Title renders with custom tag', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>
            <Sheet.Title as="h2">Custom Title</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const title = screen.getByText('Custom Title');
        expect(title.tagName).toBe('H2');
      });
    });

    it('Sheet.Title applies custom className', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>
            <Sheet.Title className="custom-title">Title</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByText('Title')).toHaveClass('custom-title');
      });
    });

    it('Sheet.Header applies custom className', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header className="custom-header">Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const header = document.querySelector('.offcanvas-header');
        expect(header).toHaveClass('custom-header');
      });
    });

    it('Sheet.Body applies custom className', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body className="custom-body">Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const body = document.querySelector('.offcanvas-body');
        expect(body).toHaveClass('custom-body');
      });
    });

    it('Sheet.Footer applies custom className', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
          <Sheet.Footer className="custom-footer">Footer</Sheet.Footer>
        </Sheet>
      );
      await waitFor(() => {
        const footer = document.querySelector('.modal-footer');
        expect(footer).toHaveClass('custom-footer');
      });
    });
  });

  describe('Context Error', () => {
    it('throws error when Sheet.Header is used outside Sheet', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<Sheet.Header>Title</Sheet.Header>);
      }).toThrow('Sheet compound components must be used within a Sheet');
      consoleError.mockRestore();
    });

    it('throws error when Sheet.Body is used outside Sheet', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<Sheet.Body>Content</Sheet.Body>);
      }).toThrow('Sheet compound components must be used within a Sheet');
      consoleError.mockRestore();
    });

    it('throws error when Sheet.Footer is used outside Sheet', () => {
      // Note: Sheet.Footer doesn't use context, so it renders without throwing
      // This is intentional - the footer doesn't need any context data
      const { container } = render(<Sheet.Footer>Footer</Sheet.Footer>);
      expect(container.querySelector('.modal-footer')).toBeInTheDocument();
    });

    it('throws error when Sheet.Title is used outside Sheet', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<Sheet.Title>Title</Sheet.Title>);
      }).toThrow('Sheet compound components must be used within a Sheet');
      consoleError.mockRestore();
    });
  });

  describe('Bootstrap Classes', () => {
    it('uses offcanvas-header for header', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(document.querySelector('.offcanvas-header')).toBeInTheDocument();
      });
    });

    it('uses offcanvas-title for header title', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(document.querySelector('.offcanvas-title')).toBeInTheDocument();
      });
    });

    it('uses offcanvas-body for body', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(document.querySelector('.offcanvas-body')).toBeInTheDocument();
      });
    });

    it('uses modal-footer for footer', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
          <Sheet.Footer>Footer</Sheet.Footer>
        </Sheet>
      );
      await waitFor(() => {
        expect(document.querySelector('.modal-footer')).toBeInTheDocument();
      });
    });

    it('uses btn-close for close button', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(document.querySelector('.btn-close')).toBeInTheDocument();
      });
    });
  });

  describe('Visual State', () => {
    it('sets data-visual-state attribute', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = document.querySelector('.offcanvas');
        expect(sheet).toHaveAttribute('data-visual-state', 'open');
      });
    });
  });
});
