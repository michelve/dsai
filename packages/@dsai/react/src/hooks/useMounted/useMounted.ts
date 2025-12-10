import { useEffect, useRef } from 'react';

/**
 * Tracks whether the component is currently mounted.
 *
 * This hook is essential for preventing state updates on unmounted components,
 * a common source of React warnings and memory leaks. Use it to gate async
 * operations that may complete after the component unmounts.
 *
 * **Key Features**:
 * - Returns stable ref (doesn't cause re-renders)
 * - Automatically updates on mount/unmount
 * - SSR-safe (returns false on server)
 * - Zero dependencies
 *
 * **Use Cases**:
 * - Gating setState in async callbacks
 * - Conditional API calls
 * - Cleanup logic decisions
 * - Memory leak prevention
 *
 * @returns Ref object with current mounted state
 *
 * @example
 * ```tsx
 * function AsyncComponent() {
 *   const [data, setData] = useState(null);
 *   const isMounted = useMounted();
 *
 *   useEffect(() => {
 *     fetchData().then(result => {
 *       // Only update state if still mounted
 *       if (isMounted.current) {
 *         setData(result);
 *       }
 *     });
 *   }, []);
 *
 *   return <div>{data?.content}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With abort controller
 * function SearchComponent() {
 *   const [results, setResults] = useState([]);
 *   const isMounted = useMounted();
 *
 *   const search = async (query: string) => {
 *     const controller = new AbortController();
 *
 *     try {
 *       const data = await fetch(\`/api/search?q=\${query}\`, {
 *         signal: controller.signal
 *       });
 *
 *       if (isMounted.current) {
 *         setResults(await data.json());
 *       }
 *     } catch (error) {
 *       if (isMounted.current && error.name !== 'AbortError') {
 *         console.error(error);
 *       }
 *     }
 *   };
 *
 *   return <SearchInput onSearch={search} />;
 * }
 * ```
 */
export function useMounted(): React.RefObject<boolean> {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef;
}
