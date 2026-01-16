import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { ListGroup, ListGroupItem } from './ListGroup';

expect.extend(toHaveNoViolations);

describe('ListGroup Security', () => {
  // ===========================================================================
  // HREF Sanitization
  // ===========================================================================
  describe('HREF Sanitization', () => {
    it('blocks javascript: protocol', () => {
      render(
        <ListGroup>
          <ListGroupItem href="javascript:alert('XSS')">Dangerous Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'Dangerous Link' });
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks data: protocol', () => {
      render(
        <ListGroup>
          <ListGroupItem href="data:text/html,<script>alert('XSS')</script>">
            Data Link
          </ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'Data Link' });
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks vbscript: protocol', () => {
      render(
        <ListGroup>
          <ListGroupItem href="vbscript:msgbox('XSS')">VBScript Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'VBScript Link' });
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks file: protocol', () => {
      render(
        <ListGroup>
          <ListGroupItem href="file:///etc/passwd">File Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'File Link' });
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks javascript: with whitespace padding', () => {
      render(
        <ListGroup>
          <ListGroupItem href="  javascript:alert('XSS')">Padded Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'Padded Link' });
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks JAVASCRIPT: (case insensitive)', () => {
      render(
        <ListGroup>
          <ListGroupItem href="JAVASCRIPT:alert('XSS')">Uppercase Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'Uppercase Link' });
      expect(link).toHaveAttribute('href', '#');
    });
  });

  // ===========================================================================
  // Safe URLs
  // ===========================================================================
  describe('Safe URLs', () => {
    it('allows https: protocol', () => {
      render(
        <ListGroup>
          <ListGroupItem href="https://example.com">HTTPS Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'HTTPS Link' });
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('allows http: protocol', () => {
      render(
        <ListGroup>
          <ListGroupItem href="http://example.com">HTTP Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'HTTP Link' });
      expect(link).toHaveAttribute('href', 'http://example.com');
    });

    it('allows relative URLs', () => {
      render(
        <ListGroup>
          <ListGroupItem href="/path/to/page">Relative Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'Relative Link' });
      expect(link).toHaveAttribute('href', '/path/to/page');
    });

    it('allows anchor URLs', () => {
      render(
        <ListGroup>
          <ListGroupItem href="#section">Anchor Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'Anchor Link' });
      expect(link).toHaveAttribute('href', '#section');
    });

    it('allows mailto: protocol', () => {
      render(
        <ListGroup>
          <ListGroupItem href="mailto:test@example.com">Email Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'Email Link' });
      expect(link).toHaveAttribute('href', 'mailto:test@example.com');
    });

    it('allows tel: protocol', () => {
      render(
        <ListGroup>
          <ListGroupItem href="tel:+1234567890">Phone Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'Phone Link' });
      expect(link).toHaveAttribute('href', 'tel:+1234567890');
    });
  });

  // ===========================================================================
  // External Link Security
  // ===========================================================================
  describe('External Link Security', () => {
    it('adds rel="noopener noreferrer" to external https links', () => {
      render(
        <ListGroup>
          <ListGroupItem href="https://external.com">External Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'External Link' });
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('adds rel="noopener noreferrer" to external http links', () => {
      render(
        <ListGroup>
          <ListGroupItem href="http://external.com">HTTP External</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'HTTP External' });
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not add rel to internal links', () => {
      render(
        <ListGroup>
          <ListGroupItem href="/internal/path">Internal Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'Internal Link' });
      expect(link).not.toHaveAttribute('rel');
    });

    it('does not add rel to anchor links', () => {
      render(
        <ListGroup>
          <ListGroupItem href="#section">Anchor Link</ListGroupItem>
        </ListGroup>
      );

      const link = screen.getByRole('link', { name: 'Anchor Link' });
      expect(link).not.toHaveAttribute('rel');
    });
  });

  // ===========================================================================
  // Items Mode Security
  // ===========================================================================
  describe('Items Mode Security', () => {
    it('sanitizes href in items mode', () => {
      render(
        <ListGroup
          items={[
            { id: '1', content: 'Safe Link', href: 'https://safe.com' },
            { id: '2', content: 'Dangerous Link', href: "javascript:alert('XSS')" },
          ]}
        />
      );

      const safeLink = screen.getByRole('link', { name: 'Safe Link' });
      const dangerousLink = screen.getByRole('link', { name: 'Dangerous Link' });

      expect(safeLink).toHaveAttribute('href', 'https://safe.com');
      expect(dangerousLink).toHaveAttribute('href', '#');
    });
  });

  // ===========================================================================
  // Accessibility with Security
  // ===========================================================================
  describe('Accessibility with Security', () => {
    it('maintains accessibility when href is sanitized', async () => {
      const { container } = render(
        <ListGroup>
          <ListGroupItem href="javascript:alert('XSS')">Sanitized Link</ListGroupItem>
        </ListGroup>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with mixed safe and unsafe hrefs', async () => {
      const { container } = render(
        <ListGroup>
          <ListGroupItem href="https://safe.com">Safe</ListGroupItem>
          <ListGroupItem href="javascript:void(0)">Unsafe</ListGroupItem>
          <ListGroupItem href="/relative">Relative</ListGroupItem>
        </ListGroup>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
