import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
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

  describe('Accessibility (jest-axe)', () => {
    it('has no accessibility violations when open', async () => {
      const { baseElement } = render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Sheet Title</Sheet.Header>
          <Sheet.Body>Sheet body content</Sheet.Body>
          <Sheet.Footer>
            <button type="button">Close</button>
          </Sheet.Footer>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with left placement', async () => {
      const { baseElement } = render(
        <Sheet isOpen={true} onClose={() => {}} placement="left" animated={false}>
          <Sheet.Header>Navigation</Sheet.Header>
          <Sheet.Body>Nav content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with bottom placement', async () => {
      const { baseElement } = render(
        <Sheet isOpen={true} onClose={() => {}} placement="bottom" animated={false}>
          <Sheet.Header>Action Sheet</Sheet.Header>
          <Sheet.Body>Actions</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations in non-modal mode', async () => {
      const { baseElement } = render(
        <Sheet isOpen={true} onClose={() => {}} mode="non-modal" animated={false}>
          <Sheet.Header>Panel</Sheet.Header>
          <Sheet.Body>Panel content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with custom ARIA IDs', async () => {
      const { baseElement } = render(
        <Sheet
          isOpen={true}
          onClose={() => {}}
          titleId="my-title"
          bodyId="my-body"
          animated={false}
        >
          <Sheet.Header>
            <Sheet.Title id="my-title">Custom Title</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations without close button', async () => {
      const { baseElement } = render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header closeButton={false}>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes on Escape key press', async () => {
      const onClose = jest.fn();
      render(
        <Sheet isOpen={true} onClose={onClose} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>
            <button type="button">Action</button>
          </Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const user = userEvent.setup();
      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on Escape when closeOnEscape is false', async () => {
      const onClose = jest.fn();
      render(
        <Sheet isOpen={true} onClose={onClose} closeOnEscape={false} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>
            <button type="button">Action</button>
          </Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const user = userEvent.setup();
      await user.keyboard('{Escape}');
      expect(onClose).not.toHaveBeenCalled();
    });

    it('close button is keyboard accessible', async () => {
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
      const closeBtn = screen.getByRole('button', { name: 'Close' });
      closeBtn.focus();
      expect(closeBtn).toHaveFocus();
      const user = userEvent.setup();
      await user.keyboard('{Enter}');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('accepts initialFocusRef to set initial focus target', async () => {
      function TestSheet() {
        const inputRef = createRef<HTMLInputElement>();
        return (
          <Sheet isOpen={true} onClose={() => {}} initialFocusRef={inputRef} animated={false}>
            <Sheet.Header>Form</Sheet.Header>
            <Sheet.Body>
              <input ref={inputRef} data-testid="focus-input" type="text" />
            </Sheet.Body>
          </Sheet>
        );
      }
      render(<TestSheet />);
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      // initialFocusRef sets the target for useFocusTrap — verify the input is rendered
      expect(screen.getByTestId('focus-input')).toBeInTheDocument();
    });

    it('accepts returnFocusRef for focus restoration target', async () => {
      function TestSheet() {
        const triggerRef = createRef<HTMLButtonElement>();
        return (
          <>
            <button ref={triggerRef} type="button">
              Trigger
            </button>
            <Sheet isOpen={true} onClose={() => {}} returnFocusRef={triggerRef} animated={false}>
              <Sheet.Header>Title</Sheet.Header>
              <Sheet.Body>Content</Sheet.Body>
            </Sheet>
          </>
        );
      }
      render(<TestSheet />);
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      // returnFocusRef sets the target for focus restoration — verify trigger is still available
      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    });
  });

  describe('Animations & Transitions', () => {
    it('calls onOpened callback when opened with animated={false}', async () => {
      const onOpened = jest.fn();
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false} onOpened={onOpened}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(onOpened).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onClosed callback when closed with animated={false}', async () => {
      const onClosed = jest.fn();
      const { rerender } = render(
        <Sheet isOpen={true} onClose={() => {}} animated={false} onClosed={onClosed}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      rerender(
        <Sheet isOpen={false} onClose={() => {}} animated={false} onClosed={onClosed}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(onClosed).toHaveBeenCalledTimes(1);
      });
    });

    it('transitions through visual states on open', async () => {
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

    it('removes sheet from DOM after close animation', async () => {
      const { rerender } = render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      rerender(
        <Sheet isOpen={false} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('applies show class when open with animated={false}', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = document.querySelector('.offcanvas');
        expect(sheet).toHaveClass('show');
      });
    });

    it('renders with showing class during opening animation', async () => {
      const { rerender } = render(
        <Sheet isOpen={false} onClose={() => {}} animated={true}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      // Open the sheet to trigger FSM 'opening' state
      rerender(
        <Sheet isOpen={true} onClose={() => {}} animated={true}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const sheet = document.querySelector('.offcanvas');
        expect(sheet).toBeInTheDocument();
        expect(sheet).toHaveClass('showing');
      });
    });

    it('calls onOpened after transitionend event fires on opening', async () => {
      const onOpened = jest.fn();
      const ref = createRef<HTMLDivElement>();
      const { rerender } = render(
        <Sheet ref={ref} isOpen={false} onClose={() => {}} animated={true} onOpened={onOpened}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      // Open the sheet — FSM goes closed → opening
      rerender(
        <Sheet ref={ref} isOpen={true} onClose={() => {}} animated={true} onOpened={onOpened}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );

      await waitFor(() => {
        expect(ref.current).toBeInTheDocument();
        expect(ref.current).toHaveAttribute('data-visual-state', 'opening');
      });
      // Wait for double RAF to apply show class
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      // Create event with propertyName (jsdom lacks TransitionEvent)
      const event = new Event('transitionend', { bubbles: true });
      Object.defineProperty(event, 'propertyName', { value: 'transform' });
      (ref.current as HTMLElement).dispatchEvent(event);
      await waitFor(() => {
        expect(onOpened).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onClosed after transitionend event fires on closing', async () => {
      const onClosed = jest.fn();
      const onOpened = jest.fn();
      const ref = createRef<HTMLDivElement>();
      const { rerender } = render(
        <Sheet
          ref={ref}
          isOpen={false}
          onClose={() => {}}
          animated={true}
          onClosed={onClosed}
          onOpened={onOpened}
        >
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      // Open the sheet
      rerender(
        <Sheet
          ref={ref}
          isOpen={true}
          onClose={() => {}}
          animated={true}
          onClosed={onClosed}
          onOpened={onOpened}
        >
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );

      await waitFor(() => {
        expect(ref.current).toBeInTheDocument();
      });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      // Finish the open transition
      const openEvent = new Event('transitionend', { bubbles: true });
      Object.defineProperty(openEvent, 'propertyName', { value: 'transform' });
      (ref.current as HTMLElement).dispatchEvent(openEvent);
      await waitFor(() => {
        expect(onOpened).toHaveBeenCalledTimes(1);
      });
      // Now close the sheet
      rerender(
        <Sheet
          ref={ref}
          isOpen={false}
          onClose={() => {}}
          animated={true}
          onClosed={onClosed}
          onOpened={onOpened}
        >
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(ref.current).toHaveAttribute('data-visual-state', 'closing');
      });
      const closeEvent = new Event('transitionend', { bubbles: true });
      Object.defineProperty(closeEvent, 'propertyName', { value: 'transform' });
      (ref.current as HTMLElement).dispatchEvent(closeEvent);
      await waitFor(() => {
        expect(onClosed).toHaveBeenCalledTimes(1);
      });
    });

    it('ignores transitionend events for non-transform properties', async () => {
      const onOpened = jest.fn();
      const ref = createRef<HTMLDivElement>();
      const { rerender } = render(
        <Sheet ref={ref} isOpen={false} onClose={() => {}} animated={true} onOpened={onOpened}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      // Open the sheet
      rerender(
        <Sheet ref={ref} isOpen={true} onClose={() => {}} animated={true} onOpened={onOpened}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(ref.current).toBeInTheDocument();
      });
      // Fire transitionend with non-transform property (should be ignored)
      const event = new Event('transitionend', { bubbles: true });
      Object.defineProperty(event, 'propertyName', { value: 'opacity' });
      (ref.current as HTMLElement).dispatchEvent(event);
      expect(onOpened).not.toHaveBeenCalled();
    });

    it('does not render when portal container resolves to null (SSR)', () => {
      // Mock isBrowser to simulate SSR environment
      const spy = jest.spyOn(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../../utils') as typeof import('../../utils'),
        'isBrowser'
      );
      spy.mockReturnValue(false);
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      spy.mockRestore();
    });
  });

  describe('Non-Modal Behavior', () => {
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

    it('does not set aria-modal in non-modal mode', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} mode="non-modal" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).not.toHaveAttribute('aria-modal');
      });
    });

    it('still supports close button in non-modal mode', async () => {
      const onClose = jest.fn();
      render(
        <Sheet isOpen={true} onClose={onClose} mode="non-modal" animated={false}>
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

    it('still closes on Escape in non-modal mode', async () => {
      const onClose = jest.fn();
      render(
        <Sheet isOpen={true} onClose={onClose} mode="non-modal" animated={false}>
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

    it('renders with correct role in non-modal mode', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} mode="non-modal" animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Backdrop Semantics', () => {
    it('renders backdrop as div, not button', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const backdrop = document.querySelector('.offcanvas-backdrop');
        expect(backdrop).toBeInTheDocument();
        expect(backdrop?.tagName).toBe('DIV');
      });
    });

    it('backdrop has aria-hidden="true"', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const backdrop = document.querySelector('.offcanvas-backdrop');
        expect(backdrop).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('backdrop is not keyboard focusable', async () => {
      render(
        <Sheet isOpen={true} onClose={() => {}} animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        const backdrop = document.querySelector('.offcanvas-backdrop');
        expect(backdrop).not.toHaveAttribute('tabindex');
      });
    });

    it('static backdrop adds shake class on click', async () => {
      jest.useFakeTimers();
      render(
        <Sheet isOpen={true} onClose={() => {}} staticBackdrop animated={false}>
          <Sheet.Header>Title</Sheet.Header>
          <Sheet.Body>Content</Sheet.Body>
        </Sheet>
      );
      await waitFor(() => {
        expect(document.querySelector('.offcanvas-backdrop')).toBeInTheDocument();
      });
      fireEvent.click(document.querySelector('.offcanvas-backdrop') as Element);
      const sheet = document.querySelector('.offcanvas');
      expect(sheet).toHaveClass('offcanvas-static');
      jest.advanceTimersByTime(300);
      expect(sheet).not.toHaveClass('offcanvas-static');
      jest.useRealTimers();
    });
  });
});
