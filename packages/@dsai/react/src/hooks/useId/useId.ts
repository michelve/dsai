import { useId as useReactId } from 'react';

/**
 * Generates a unique ID for accessibility and form elements.
 *
 * This is a re-export of React's built-in `useId` hook (React 18+).
 * It generates stable, unique IDs that are safe to use in SSR and
 * hydration scenarios.
 *
 * **Key Features**:
 * - Stable across renders
 * - SSR-safe (same ID on server and client)
 * - Unique across component instances
 * - Suitable for accessibility attributes
 * - Type-safe
 *
 * **Use Cases**:
 * - `htmlFor` and `id` attributes
 * - `aria-labelledby` and `aria-describedby`
 * - Form field associations
 * - Any element that needs a unique ID
 *
 * @returns A unique ID string
 *
 * @example
 * ```tsx
 * // Basic form field
 * function TextField({ label }: { label: string }) {
 *   const id = useId();
 *
 *   return (
 *     <div>
 *       <label htmlFor={id}>{label}</label>
 *       <input id={id} type="text" />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Multiple related IDs
 * function FormField({ label, hint }: { label: string; hint: string }) {
 *   const baseId = useId();
 *   const inputId = `${baseId}-input`;
 *   const hintId = `${baseId}-hint`;
 *
 *   return (
 *     <div>
 *       <label htmlFor={inputId}>{label}</label>
 *       <input
 *         id={inputId}
 *         type="text"
 *         aria-describedby={hintId}
 *       />
 *       <span id={hintId}>{hint}</span>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Accessible combobox
 * function Combobox({ label, options }: ComboboxProps) {
 *   const id = useId();
 *   const inputId = `${id}-input`;
 *   const listboxId = `${id}-listbox`;
 *   const [value, setValue] = useState('');
 *
 *   return (
 *     <div>
 *       <label htmlFor={inputId}>{label}</label>
 *       <input
 *         id={inputId}
 *         role="combobox"
 *         aria-controls={listboxId}
 *         aria-expanded={true}
 *         value={value}
 *         onChange={(e) => setValue(e.target.value)}
 *       />
 *       <ul id={listboxId} role="listbox">
 *         {options.map((option) => (
 *           <li key={option.value} role="option">
 *             {option.label}
 *           </li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useId(): string {
  return useReactId();
}
