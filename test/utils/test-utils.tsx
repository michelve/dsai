/**
 * Custom test utilities for component testing
 * Re-exports everything from React Testing Library for convenience
 */

import { render as rtlRender, type RenderOptions, type RenderResult } from '@testing-library/react';
import { axe, type JestAxeConfigureOptions } from 'jest-axe';

import type { ReactElement } from 'react';

/**
 * Custom render function that wraps components with necessary providers
 * Add your app's providers here (Theme, Router, Redux, etc.)
 */
export function render(ui: ReactElement, options?: RenderOptions): RenderResult {
  // TODO: Add your providers as needed
  // const AllProviders = ({ children }: { children: React.ReactNode }) => {
  //   return (
  //     <ThemeProvider theme={theme}>
  //       <RouterProvider router={router}>
  //         {children}
  //       </RouterProvider>
  //     </ThemeProvider>
  //   );
  // };

  return rtlRender(ui, {
    // wrapper: AllProviders,
    ...options,
  });
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
