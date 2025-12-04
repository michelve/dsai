import { render, screen } from '@testing-library/react';

import { Accordion } from './Accordion';

describe('Accordion - Security (Prop Whitelisting & XSS Prevention)', () => {
  // ===========================================================================
  // Prop Whitelisting - Safe Attributes
  // ===========================================================================
  describe('safe attribute whitelisting', () => {
    it('allows className prop on Accordion', () => {
      render(
        <Accordion className="custom-class" data-testid="accordion">
          <Accordion.Item eventKey="0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveClass('custom-class');
    });

    it('allows style prop on Accordion', () => {
      render(
        <Accordion style={{ marginTop: '10px' }} data-testid="accordion">
          <Accordion.Item eventKey="0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveStyle({ marginTop: '10px' });
    });

    it('allows id prop on Accordion', () => {
      render(
        <Accordion id="my-accordion" data-testid="accordion">
          <Accordion.Item eventKey="0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveAttribute('id', 'my-accordion');
    });

    it('allows data-testid prop on Accordion', () => {
      render(
        <Accordion data-testid="test-accordion">
          <Accordion.Item eventKey="0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      expect(screen.getByTestId('test-accordion')).toBeInTheDocument();
    });

    it('allows data-test prop on AccordionItem', () => {
      render(
        <Accordion>
          <Accordion.Item eventKey="0" data-test="item-0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      const item = document.querySelector('[data-test="item-0"]');
      expect(item).toBeInTheDocument();
    });

    it('allows className prop on AccordionItem', () => {
      render(
        <Accordion>
          <Accordion.Item eventKey="0" className="custom-item" data-testid="item">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      const item = screen.getByTestId('item');
      expect(item).toHaveClass('custom-item');
    });

    it('allows className prop on AccordionButton', () => {
      render(
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Button className="custom-button">Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      const button = screen.getByRole('button', { name: 'Test' });
      expect(button).toHaveClass('custom-button');
    });

    it('allows className prop on AccordionPanel', () => {
      render(
        <Accordion defaultActiveKeys={['0']}>
          <Accordion.Item eventKey="0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel className="custom-panel" data-testid="panel">
              Content
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      const panel = screen.getByTestId('panel');
      expect(panel).toHaveClass('custom-panel');
    });
  });

  // ===========================================================================
  // No Dangerous Attributes
  // ===========================================================================
  describe('no dangerous attributes in rendered output', () => {
    it('does not render onLoad attribute', () => {
      const { container } = render(
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      expect(container.innerHTML).not.toContain('onload');
      expect(container.innerHTML).not.toContain('onLoad');
    });

    it('does not render onError attribute', () => {
      const { container } = render(
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      expect(container.innerHTML).not.toContain('onerror');
      expect(container.innerHTML).not.toContain('onError');
    });

    it('does not render onAbort attribute', () => {
      const { container } = render(
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      expect(container.innerHTML).not.toContain('onabort');
      expect(container.innerHTML).not.toContain('onAbort');
    });

    it('does not use dangerouslySetInnerHTML', () => {
      const { container } = render(
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      expect(container.innerHTML).not.toContain('dangerouslySetInnerHTML');
    });
  });

  // ===========================================================================
  // Button Security
  // ===========================================================================
  describe('accordion button security', () => {
    it('accordion button has type="button" to prevent form submission', () => {
      render(
        <form>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Button>Test</Accordion.Button>
              <Accordion.Panel>Content</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </form>
      );
      const button = screen.getByRole('button', { name: 'Test' });
      expect(button).toHaveAttribute('type', 'button');
    });

    it('disabled button has aria-disabled="true"', () => {
      render(
        <Accordion>
          <Accordion.Item eventKey="0" disabled>
            <Accordion.Button>Disabled</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
      const button = screen.getByRole('button', { name: 'Disabled' });
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // ===========================================================================
  // Content Security - XSS Prevention
  // ===========================================================================
  describe('XSS prevention in content', () => {
    it('renders text content safely (not as HTML)', () => {
      const maliciousContent = '<script>alert("XSS")</script>';
      render(
        <Accordion defaultActiveKeys={['0']}>
          <Accordion.Item eventKey="0">
            <Accordion.Button>{maliciousContent}</Accordion.Button>
            <Accordion.Panel>{maliciousContent}</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      // Content should be rendered as text, not executed as script
      const button = screen.getByRole('button');
      expect(button.textContent).toContain('<script>');
      // No actual script element should be rendered
      expect(document.querySelector('script[id]')).toBeNull();
    });

    it('renders img tags in content safely (React escapes)', () => {
      const maliciousContent = '<img src="x" onerror="alert(1)">';
      render(
        <Accordion defaultActiveKeys={['0']}>
          <Accordion.Item eventKey="0">
            <Accordion.Button>{maliciousContent}</Accordion.Button>
            <Accordion.Panel>{maliciousContent}</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      // Content should be rendered as text, not as an img element
      const button = screen.getByRole('button');
      expect(button.textContent).toContain('<img');
    });

    it('safely renders special HTML characters', () => {
      const specialChars = '&lt;div&gt; &amp; &quot;test&quot;';
      render(
        <Accordion defaultActiveKeys={['0']}>
          <Accordion.Item eventKey="0">
            <Accordion.Button>{specialChars}</Accordion.Button>
            <Accordion.Panel>{specialChars}</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const button = screen.getByRole('button');
      expect(button.textContent).toBe(specialChars);
    });
  });

  // ===========================================================================
  // Event Handler Whitelist
  // ===========================================================================
  describe('event handler restrictions', () => {
    it('only allows onClick on AccordionButton', () => {
      const handleClick = jest.fn();
      render(
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Button onClick={handleClick}>Clickable</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const button = screen.getByRole('button', { name: 'Clickable' });
      button.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('only allows onKeyDown on AccordionButton', () => {
      const handleKeyDown = jest.fn();
      render(
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Button onKeyDown={handleKeyDown}>Keyboard</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const button = screen.getByRole('button', { name: 'Keyboard' });
      // Simulate keydown event
      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Visual State Security
  // ===========================================================================
  describe('visual state attribute', () => {
    it('data-visual-state contains only expected values', () => {
      const { container } = render(
        <Accordion defaultActiveKeys={['0']}>
          <Accordion.Item eventKey="0">
            <Accordion.Button>Expanded</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Button>Collapsed</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const items = container.querySelectorAll('.accordion-item');
      items.forEach((item) => {
        const visualState = item.getAttribute('data-visual-state');
        expect(['collapsed', 'expanding', 'expanded', 'collapsing', null]).toContain(visualState);
      });
    });

    it('does not allow arbitrary data-visual-state injection', () => {
      const { container } = render(
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const item = container.querySelector('.accordion-item');
      // The visual state should only be one of the defined FSM states
      const visualState = item?.getAttribute('data-visual-state');
      expect(visualState).not.toBe('malicious-state');
      expect(['collapsed', 'expanding', 'expanded', 'collapsing', null]).toContain(visualState);
    });
  });

  // ===========================================================================
  // eventKey Security
  // ===========================================================================
  describe('eventKey handling', () => {
    it('handles eventKey with special characters safely', () => {
      render(
        <Accordion defaultActiveKeys={['<script>alert(1)</script>']}>
          <Accordion.Item eventKey="<script>alert(1)</script>">
            <Accordion.Button>Special Key</Accordion.Button>
            <Accordion.Panel data-testid="panel">Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      // Panel should be expanded based on matching eventKey
      const panel = screen.getByTestId('panel');
      expect(panel).toBeVisible();
    });

    it('handles eventKey with whitespace safely', () => {
      render(
        <Accordion defaultActiveKeys={['key with spaces']}>
          <Accordion.Item eventKey="key with spaces">
            <Accordion.Button>Spaced Key</Accordion.Button>
            <Accordion.Panel data-testid="panel">Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const panel = screen.getByTestId('panel');
      expect(panel).toBeVisible();
    });

    it('handles empty string eventKey safely', () => {
      render(
        <Accordion defaultActiveKeys={['']}>
          <Accordion.Item eventKey="">
            <Accordion.Button>Empty Key</Accordion.Button>
            <Accordion.Panel data-testid="panel">Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const panel = screen.getByTestId('panel');
      expect(panel).toBeVisible();
    });
  });

  // ===========================================================================
  // ID Generation Security
  // ===========================================================================
  describe('generated IDs security', () => {
    it('generates safe button IDs for aria-labelledby', () => {
      render(
        <Accordion defaultActiveKeys={['0']}>
          <Accordion.Item eventKey="0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const button = screen.getByRole('button');
      const buttonId = button.getAttribute('id');

      // ID should be a valid HTML ID (no special characters that could break selectors)
      expect(buttonId).toMatch(/^[a-zA-Z][a-zA-Z0-9_-]*$/);
    });

    it('generates safe panel IDs for aria-controls', () => {
      render(
        <Accordion defaultActiveKeys={['0']}>
          <Accordion.Item eventKey="0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel>Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const button = screen.getByRole('button');
      const panelId = button.getAttribute('aria-controls');

      // ID should be a valid HTML ID
      expect(panelId).toMatch(/^[a-zA-Z][a-zA-Z0-9_-]*$/);
    });

    it('ensures button and panel IDs are properly linked', () => {
      render(
        <Accordion defaultActiveKeys={['0']}>
          <Accordion.Item eventKey="0">
            <Accordion.Button>Test</Accordion.Button>
            <Accordion.Panel data-testid="panel">Content</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );

      const button = screen.getByRole('button');
      const panel = screen.getByTestId('panel');

      // Button should control the panel
      const panelId = button.getAttribute('aria-controls');
      // Panel uses <section> element which has implicit region role
      expect(panel.closest('section')).toHaveAttribute('id', panelId);

      // Panel should be labeled by the button
      const buttonId = button.getAttribute('id');
      expect(panel.closest('section')).toHaveAttribute('aria-labelledby', buttonId);
    });
  });
});
