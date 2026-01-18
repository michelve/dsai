/**
 * Custom test utilities for component testing
 * Re-exports everything from React Testing Library for convenience
 */

import { type RenderOptions, type RenderResult, render as rtlRender } from '@testing-library/react';
import { axe, type JestAxeConfigureOptions } from 'jest-axe';

import type { ReactElement } from 'react';

/**
 * Custom render function for component testing
 *
 * DSAi components use CSS variables for theming (via data-dsai-theme attribute)
 * so no React context providers are needed. Components are tested in isolation.
 *
 * @example
 * ```tsx
 * // Basic render
 * const { getByRole } = render(<Button>Click me</Button>);
 *
 * // With theme attribute on container
 * const { container } = render(<Button>Click me</Button>);
 * container.setAttribute('data-dsai-theme', 'dark');
 * ```
 */
export function render(ui: ReactElement, options?: RenderOptions): RenderResult {
  return rtlRender(ui, options);
}

/**
 * Test accessibility of a component
 * All components should pass this test
 *
 * @example
 * it('should have no accessibility violations', async () => {
 *   const { container } = render(<MyComponent />);
 *   expect(await testA11y(container)).toHaveNoViolations();
 * });
 */
export async function testA11y(
  container: Element,
  options?: JestAxeConfigureOptions
): Promise<ReturnType<typeof axe>> {
  return axe(container, options);
}

/**
 * Default axe options for testing
 * Configure rules to match WCAG 2.1 AA requirements
 */
export const defaultAxeOptions: JestAxeConfigureOptions = {
  rules: {
    // Example: Disable specific rules if needed
    // 'color-contrast': { enabled: false },
  },
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
