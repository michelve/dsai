import { render, screen } from '@testing-library/react';

import { Alert } from './Alert';

describe('Alert Security Tests', () => {
  describe('Security (Alert.Link - XSS Prevention)', () => {
    it('blocks javascript: protocol', () => {
      render(
        <Alert>
          <Alert.Link href="javascript:alert('XSS')">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks data: protocol', () => {
      render(
        <Alert>
          <Alert.Link href="data:text/html,<script>alert('XSS')</script>">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks text/html protocol', () => {
      render(
        <Alert>
          <Alert.Link href="text/html,<img src=x onerror='alert(1)'>">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks vbscript: protocol', () => {
      render(
        <Alert>
          <Alert.Link href="vbscript:alert('XSS')">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '#');
    });

    it('allows safe http URLs', () => {
      render(
        <Alert>
          <Alert.Link href="http://example.com">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', 'http://example.com');
    });

    it('allows safe https URLs', () => {
      render(
        <Alert>
          <Alert.Link href="https://example.com">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('allows relative URLs', () => {
      render(
        <Alert>
          <Alert.Link href="/docs">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '/docs');
    });

    it('allows mailto: protocol', () => {
      render(
        <Alert>
          <Alert.Link href="mailto:test@example.com">email</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('email');
      expect(link).toHaveAttribute('href', 'mailto:test@example.com');
    });

    it('allows tel: protocol', () => {
      render(
        <Alert>
          <Alert.Link href="tel:+1234567890">call</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('call');
      expect(link).toHaveAttribute('href', 'tel:+1234567890');
    });

    it('defaults to # for missing href', () => {
      render(
        <Alert>
          <Alert.Link href="">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '#');
    });

    it('case-insensitive protocol blocking', () => {
      render(
        <Alert>
          <Alert.Link href="JAVASCRIPT:alert('XSS')">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '#');
    });

    it('trims whitespace from href before validation', () => {
      render(
        <Alert>
          <Alert.Link href="  /safe-url  ">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '  /safe-url  ');
    });
  });

  describe('Security (External Link Protection)', () => {
    it('adds rel="noopener noreferrer" for external links', () => {
      render(
        <Alert>
          <Alert.Link href="https://example.com" target="_blank">
            external
          </Alert.Link>
        </Alert>
      );
      const link = screen.getByText('external');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not add rel for same-window links', () => {
      render(
        <Alert>
          <Alert.Link href="/page" target="_self">
            internal
          </Alert.Link>
        </Alert>
      );
      const link = screen.getByText('internal');
      expect(link).not.toHaveAttribute('rel');
    });

    it('uses custom rel when provided and not external', () => {
      render(
        <Alert>
          <Alert.Link href="/page" rel="custom">
            link
          </Alert.Link>
        </Alert>
      );
      const link = screen.getByText('link');
      expect(link).toHaveAttribute('rel', 'custom');
    });

    it('overrides custom rel with noopener noreferrer for external links', () => {
      render(
        <Alert>
          <Alert.Link href="https://example.com" target="_blank" rel="author">
            external
          </Alert.Link>
        </Alert>
      );
      const link = screen.getByText('external');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Security (Prop Whitelisting)', () => {
    it('accepts whitelisted data-testid attribute', () => {
      render(
        <Alert data-testid="alert-test">
          <Alert.Link href="/test" data-testid="link-test">
            link
          </Alert.Link>
        </Alert>
      );
      expect(screen.getByTestId('alert-test')).toBeInTheDocument();
      expect(screen.getByTestId('link-test')).toBeInTheDocument();
    });

    it('accepts whitelisted data-test attribute', () => {
      render(
        <Alert data-test="alert-test">
          <Alert.Link href="/test" data-test="link-test">
            link
          </Alert.Link>
        </Alert>
      );
      const alert = screen.getByRole('status');
      const link = screen.getByText('link');
      expect(alert).toHaveAttribute('data-test', 'alert-test');
      expect(link).toHaveAttribute('data-test', 'link-test');
    });

    it('accepts title attribute for tooltips', () => {
      render(
        <Alert title="Alert tooltip">
          <Alert.Link href="/test" title="Link tooltip">
            link
          </Alert.Link>
        </Alert>
      );
      const alert = screen.getByRole('status');
      const link = screen.getByText('link');
      expect(alert).toHaveAttribute('title', 'Alert tooltip');
      expect(link).toHaveAttribute('title', 'Link tooltip');
    });
  });
});
