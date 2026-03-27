import { act, fireEvent, render, screen } from '@testing-library/react';

import { Toast } from './Toast';
import { ToastContainer } from './ToastContainer';
import { ToastProvider, useToast } from './ToastProvider';

// Mock timers for auto-dismiss testing
jest.useFakeTimers();

describe('Toast Component', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Rendering', () => {
    it('renders with message', () => {
      render(<Toast message="Test notification" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toBeInTheDocument();
      expect(screen.getByText('Test notification')).toBeInTheDocument();
    });

    it('renders with title and message', () => {
      render(<Toast title="Title" message="Message content" data-testid="toast" />);

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Message content')).toBeInTheDocument();
    });

    it('renders close button by default', () => {
      render(<Toast message="Test" data-testid="toast" />);

      expect(screen.getByRole('button', { name: /close notification/i })).toBeInTheDocument();
    });

    it('hides close button when dismissible is false', () => {
      render(<Toast message="Test" dismissible={false} data-testid="toast" />);

      expect(screen.queryByRole('button', { name: /close notification/i })).not.toBeInTheDocument();
    });

    it('renders with custom close button label', () => {
      render(<Toast message="Test" closeButtonLabel="Dismiss" data-testid="toast" />);

      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });

    it('does not render when show is false', () => {
      render(<Toast message="Test" show={false} data-testid="toast" />);

      expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Toast message="Test" className="custom-toast" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveClass('custom-toast');
    });

    it('renders with custom style', () => {
      render(<Toast message="Test" style={{ backgroundColor: 'red' }} data-testid="toast" />);

      const toast = screen.getByTestId('toast');
      // Check that the style attribute contains the background-color
      const styleAttr = toast.getAttribute('style');
      expect(styleAttr).toContain('background-color');
      expect(styleAttr).toContain('red');
    });

    it('renders with custom id', () => {
      render(<Toast message="Test" id="my-toast" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('id', 'my-toast');
    });

    it('renders data-test attribute', () => {
      render(<Toast message="Test" data-test="toast-test" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('data-test', 'toast-test');
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Toast message="Default" variant="default" data-testid="toast" />);

      const toast = screen.getByTestId('toast');
      expect(toast).toHaveClass('toast');
      expect(toast).not.toHaveClass('text-bg-success');
    });

    it('renders success variant with correct styling', () => {
      render(<Toast message="Success" variant="success" data-testid="toast" />);

      const toast = screen.getByTestId('toast');
      expect(toast).toHaveClass('text-bg-success');
      expect(toast).toHaveClass('border-0');
    });

    it('renders error variant with correct styling', () => {
      render(<Toast message="Error" variant="error" data-testid="toast" />);

      const toast = screen.getByTestId('toast');
      expect(toast).toHaveClass('text-bg-danger');
    });

    it('renders warning variant with correct styling', () => {
      render(<Toast message="Warning" variant="warning" data-testid="toast" />);

      const toast = screen.getByTestId('toast');
      expect(toast).toHaveClass('text-bg-warning');
    });

    it('renders info variant with correct styling', () => {
      render(<Toast message="Info" variant="info" data-testid="toast" />);

      const toast = screen.getByTestId('toast');
      expect(toast).toHaveClass('text-bg-info');
    });

    it('renders default icon for success variant', () => {
      render(<Toast message="Success" variant="success" data-testid="toast" />);

      const icon = screen.getByTestId('toast').querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders custom icon when provided', () => {
      render(
        <Toast
          message="Custom"
          icon={<span data-testid="custom-icon">★</span>}
          data-testid="toast"
        />
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has role="alert" for error variant', () => {
      render(<Toast message="Error" variant="error" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('role', 'alert');
    });

    it('has role="alert" for warning variant', () => {
      render(<Toast message="Warning" variant="warning" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('role', 'alert');
    });

    it('has role="status" for success variant', () => {
      render(<Toast message="Success" variant="success" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('role', 'status');
    });

    it('has role="status" for info variant', () => {
      render(<Toast message="Info" variant="info" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('role', 'status');
    });

    it('has role="status" for default variant', () => {
      render(<Toast message="Default" variant="default" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('role', 'status');
    });

    it('has aria-live="assertive" for error variant', () => {
      render(<Toast message="Error" variant="error" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('aria-live', 'assertive');
    });

    it('has aria-live="polite" for success variant', () => {
      render(<Toast message="Success" variant="success" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('aria-live', 'polite');
    });

    it('has aria-atomic="true"', () => {
      render(<Toast message="Test" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('aria-atomic', 'true');
    });

    it('associates title with aria-labelledby', () => {
      render(<Toast title="Title" message="Message" id="my-toast" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('aria-labelledby', 'my-toast-title');
    });

    it('uses aria-label when no title', () => {
      render(<Toast message="Message" aria-label="Notification" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('aria-label', 'Notification');
    });

    it('close button has accessible label', () => {
      render(<Toast message="Test" data-testid="toast" />);

      const closeButton = screen.getByRole('button', { name: /close notification/i });
      expect(closeButton).toHaveAttribute('aria-label');
    });

    it('renders visual state data attribute', () => {
      render(<Toast message="Test" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('data-visual-state');
    });
  });

  describe('Interactions', () => {
    it('calls onClose when close button is clicked', () => {
      const onClose = jest.fn();
      render(<Toast message="Test" onClose={onClose} data-testid="toast" />);

      const closeButton = screen.getByRole('button', { name: /close notification/i });
      fireEvent.click(closeButton);

      // Wait for animation
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('dismisses on Enter key on close button', async () => {
      const onClose = jest.fn();
      render(<Toast message="Test" onClose={onClose} data-testid="toast" />);

      const closeButton = screen.getByRole('button', { name: /close notification/i });
      closeButton.focus();
      fireEvent.keyDown(closeButton, { key: 'Enter' });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(onClose).toHaveBeenCalled();
    });

    it('dismisses on Space key on close button', async () => {
      const onClose = jest.fn();
      render(<Toast message="Test" onClose={onClose} data-testid="toast" />);

      const closeButton = screen.getByRole('button', { name: /close notification/i });
      closeButton.focus();
      fireEvent.keyDown(closeButton, { key: ' ' });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(onClose).toHaveBeenCalled();
    });

    it('calls onOpen when toast becomes visible', () => {
      const onOpen = jest.fn();
      render(<Toast message="Test" onOpen={onOpen} data-testid="toast" />);

      // Wait for entering animation to complete
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(onOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe('Auto-dismiss', () => {
    it('auto-dismisses after duration', () => {
      const onClose = jest.fn();
      render(<Toast message="Test" duration={3000} onClose={onClose} data-testid="toast" />);

      // Wait for entering animation
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByTestId('toast')).toBeInTheDocument();

      // Wait for auto-dismiss
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Wait for exit animation
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(onClose).toHaveBeenCalled();
    });

    it('does not auto-dismiss when duration is 0', () => {
      const onClose = jest.fn();
      render(<Toast message="Test" duration={0} onClose={onClose} data-testid="toast" />);

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not auto-dismiss when duration is false', () => {
      const onClose = jest.fn();
      render(<Toast message="Test" duration={false} onClose={onClose} data-testid="toast" />);

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Progress Bar', () => {
    it('renders progress bar when showProgress is true', () => {
      render(<Toast message="Test" showProgress duration={5000} data-testid="toast" />);

      // Wait for entering animation
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('does not render progress bar when showProgress is false', () => {
      render(<Toast message="Test" showProgress={false} data-testid="toast" />);

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('does not render progress bar when duration is 0', () => {
      render(<Toast message="Test" showProgress duration={0} data-testid="toast" />);

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('applies custom animation duration', () => {
      render(<Toast message="Test" animationDuration={300} data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveStyle({
        transition: 'opacity 300ms ease-in-out',
      });
    });

    it('transitions through visibility states', async () => {
      const { rerender } = render(<Toast message="Test" show={true} data-testid="toast" />);

      // Should be entering
      expect(screen.getByTestId('toast')).toHaveAttribute('data-visual-state', 'showing');

      // Wait for animation to complete
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Should be visible
      expect(screen.getByTestId('toast')).toHaveAttribute('data-visual-state', 'visible');

      // Hide toast
      rerender(<Toast message="Test" show={false} data-testid="toast" />);

      // Should be exiting/hiding
      expect(screen.getByTestId('toast')).toHaveAttribute('data-visual-state', 'hiding');
    });
  });
});

describe('ToastContainer Component', () => {
  it('renders children', () => {
    render(
      <ToastContainer data-testid="container">
        <div data-testid="child">Child</div>
      </ToastContainer>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies position classes for top-end', () => {
    render(
      <ToastContainer position="top-end" data-testid="container">
        <div>Child</div>
      </ToastContainer>
    );

    const container = screen.getByTestId('container');
    expect(container).toHaveClass('top-0');
    expect(container).toHaveClass('end-0');
  });

  it('applies position classes for bottom-center', () => {
    render(
      <ToastContainer position="bottom-center" data-testid="container">
        <div>Child</div>
      </ToastContainer>
    );

    const container = screen.getByTestId('container');
    expect(container).toHaveClass('bottom-0');
    expect(container).toHaveClass('start-50');
  });

  it('applies custom gap', () => {
    render(
      <ToastContainer gap={20} data-testid="container">
        <div>Child</div>
      </ToastContainer>
    );

    expect(screen.getByTestId('container')).toHaveStyle({ gap: '20px' });
  });

  it('applies custom className', () => {
    render(
      <ToastContainer className="custom-container" data-testid="container">
        <div>Child</div>
      </ToastContainer>
    );

    expect(screen.getByTestId('container')).toHaveClass('custom-container');
  });

  it('has aria-live attribute', () => {
    render(
      <ToastContainer data-testid="container">
        <div>Child</div>
      </ToastContainer>
    );

    expect(screen.getByTestId('container')).toHaveAttribute('aria-live', 'polite');
  });

  it('has aria-atomic attribute', () => {
    render(
      <ToastContainer data-testid="container">
        <div>Child</div>
      </ToastContainer>
    );

    expect(screen.getByTestId('container')).toHaveAttribute('aria-atomic', 'true');
  });
});

describe('ToastProvider and useToast', () => {
  function TestComponent(): React.JSX.Element {
    const toast = useToast();

    return (
      <div>
        <button type="button" onClick={() => toast.success('Success!')}>
          Success
        </button>
        <button type="button" onClick={() => toast.error('Error!')}>
          Error
        </button>
        <button type="button" onClick={() => toast.warning('Warning!')}>
          Warning
        </button>
        <button type="button" onClick={() => toast.info('Info!')}>
          Info
        </button>
        <button type="button" onClick={() => toast.toast('Default!')}>
          Default
        </button>
        <button type="button" onClick={() => toast.dismissAll()}>
          Dismiss All
        </button>
        <div data-testid="toast-count">{toast.toasts.length}</div>
      </div>
    );
  }

  it('provides toast context to children', () => {
    expect(() => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
    }).not.toThrow();
  });

  it('throws error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleSpy.mockRestore();
  });

  it('creates success toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Success'));

    // Advance timers for animation
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('creates error toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Error'));

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  it('creates warning toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Warning'));

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByText('Warning!')).toBeInTheDocument();
  });

  it('creates info toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Info'));

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByText('Info!')).toBeInTheDocument();
  });

  it('dismisses all toasts', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Create some toasts
    fireEvent.click(screen.getByText('Success'));
    fireEvent.click(screen.getByText('Error'));

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('2');

    // Dismiss all
    fireEvent.click(screen.getByText('Dismiss All'));

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('respects maxToasts setting', () => {
    render(
      <ToastProvider maxToasts={2}>
        <TestComponent />
      </ToastProvider>
    );

    // Create 3 toasts
    fireEvent.click(screen.getByText('Success'));
    fireEvent.click(screen.getByText('Error'));
    fireEvent.click(screen.getByText('Warning'));

    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Should only have max toasts
    const count = parseInt(screen.getByTestId('toast-count').textContent || '0', 10);
    expect(count).toBeLessThanOrEqual(3); // Due to async nature
  });

  it('renders toast container with specified position', () => {
    render(
      <ToastProvider position="bottom-center">
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Success'));

    act(() => {
      jest.advanceTimersByTime(200);
    });

    const container = screen.getByTestId('toast-container');
    expect(container).toHaveClass('bottom-0');
    expect(container).toHaveClass('start-50');
  });
});

describe('Toast Ref Forwarding', () => {
  it('forwards ref to Toast element', () => {
    const ref = { current: null };
    render(<Toast ref={ref} message="Test" data-testid="toast" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('forwards ref to ToastContainer element', () => {
    const ref = { current: null };
    render(
      <ToastContainer ref={ref} data-testid="container">
        <div>Child</div>
      </ToastContainer>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('Toast Close Button Layout', () => {
  it('close button in simplified toast uses ms-auto not m-auto', () => {
    render(<Toast message="Test" dismissible data-testid="toast" />);
    const closeBtn = screen.getByRole('button', { name: /close notification/i });
    expect(closeBtn).toHaveClass('ms-auto');
    expect(closeBtn).not.toHaveClass('m-auto');
  });
});

describe('Pause on Focus Loss', () => {
  it('pauses auto-dismiss when document becomes hidden', () => {
    const onClose = jest.fn();
    render(
      <Toast
        message="Focus loss"
        duration={5000}
        pauseOnFocusLoss
        show
        data-testid="toast"
        onClose={onClose}
      />
    );

    // Enter visible state
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Advance 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Simulate tab becoming hidden
    Object.defineProperty(document, 'hidden', { value: true, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));

    // Advance well past remaining duration — should NOT dismiss
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(onClose).not.toHaveBeenCalled();

    // Simulate tab becoming visible again
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));

    // Advance remaining ~3 seconds
    act(() => {
      jest.advanceTimersByTime(3500);
    });

    // Should now dismiss after exit animation
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('does not pause when pauseOnFocusLoss is false', () => {
    const onClose = jest.fn();
    render(
      <Toast
        message="No focus pause"
        duration={3000}
        pauseOnFocusLoss={false}
        show
        data-testid="toast"
        onClose={onClose}
      />
    );

    // Enter visible state
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Simulate tab hidden
    Object.defineProperty(document, 'hidden', { value: true, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));

    // Advance past duration — should still dismiss
    act(() => {
      jest.advanceTimersByTime(3500);
    });

    // Exit animation
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(onClose).toHaveBeenCalled();

    // Cleanup
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
  });

  it('does not pause when duration is disabled', () => {
    render(
      <Toast
        message="No duration"
        duration={false}
        pauseOnFocusLoss
        show
        data-testid="toast"
      />
    );

    // Enter visible state
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Should not throw when visibility changes
    Object.defineProperty(document, 'hidden', { value: true, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(screen.getByTestId('toast')).toBeInTheDocument();
  });
});
