import { createContext as createReactContext, useContext } from 'react';

import { invariant } from './invariant';

/**
 * Options for creating a context.
 */
export interface CreateContextOptions<T> {
  /** Name of the context for debugging */
  name: string;
  /** Default value (optional) */
  defaultValue?: T;
  /** Error message when context is used outside provider */
  errorMessage?: string;
  /** Whether to allow usage outside provider (requires defaultValue) */
  strict?: boolean;
}

/**
 * Return type of createContext.
 */
export interface ContextReturn<T> {
  /** The React Context object */
  Context: React.Context<T | undefined>;
  /** Hook to consume the context */
  useContext: () => T;
  /** Provider component */
  Provider: React.Provider<T | undefined>;
}

/**
 * Creates a type-safe React context with automatic provider validation.
 *
 * This eliminates the need for null checks when consuming context and
 * provides better error messages when context is used incorrectly.
 *
 * **Key Features**:
 * - Type-safe context consumption
 * - Automatic provider validation
 * - Custom error messages
 * - Named contexts for debugging
 * - Optional strict mode
 *
 * @param options - Context configuration
 * @returns Context object with Provider and hook
 *
 * @example
 * ```tsx
 * // Create theme context
 * interface ThemeContextValue {
 *   mode: 'light' | 'dark';
 *   toggleMode: () => void;
 * }
 *
 * const { Provider: ThemeProvider, useContext: useTheme } = createContext<ThemeContextValue>({
 *   name: 'Theme',
 *   errorMessage: 'useTheme must be used within ThemeProvider',
 * });
 *
 * function App() {
 *   const [mode, setMode] = useState<'light' | 'dark'>('light');
 *
 *   return (
 *     <ThemeProvider value={{ mode, toggleMode: () => setMode(m => m === 'light' ? 'dark' : 'light') }}>
 *       <Content />
 *     </ThemeProvider>
 *   );
 * }
 *
 * function Content() {
 *   const { mode, toggleMode } = useTheme(); // No null checks needed!
 *   return <button onClick={toggleMode}>{mode}</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With default value (non-strict mode)
 * const { Provider, useContext: useConfig } = createContext({
 *   name: 'Config',
 *   defaultValue: { apiUrl: '/api' },
 *   strict: false,
 * });
 *
 * // Can be used without provider
 * function Component() {
 *   const config = useConfig(); // Returns default value
 *   return <div>{config.apiUrl}</div>;
 * }
 * ```
 */
export function createContext<T>(options: CreateContextOptions<T>): ContextReturn<T> {
  const {
    name,
    defaultValue,
    errorMessage = `use${name} must be used within ${name}Provider`,
    strict = true,
  } = options;

  const Context = createReactContext<T | undefined>(defaultValue);
  Context.displayName = name;

  function useContextHook(): T {
    const context = useContext(Context);

    if (strict && context === undefined) {
      invariant(false, errorMessage);
    }

    // If not strict and context is undefined, use default value
    if (!strict && context === undefined) {
      invariant(
        defaultValue !== undefined,
        `${name} context: defaultValue must be provided when strict is false`
      );
      return defaultValue!;
    }

    return context!;
  }

  return {
    Context,
    useContext: useContextHook,
    Provider: Context.Provider,
  };
}
