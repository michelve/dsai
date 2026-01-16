/**
 * Sheet Component
 *
 * An accessible slide-out panel component for navigation, forms, and secondary content.
 * Supports all four placement positions (left, right, top, bottom) with smooth animations.
 *
 * @example
 * ```tsx
 * import { Sheet } from '@dsai-io/react';
 *
 * function App() {
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setIsOpen(true)}>Open Sheet</Button>
 *       <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} placement="right">
 *         <Sheet.Header>Settings</Sheet.Header>
 *         <Sheet.Body>Sheet content...</Sheet.Body>
 *         <Sheet.Footer>
 *           <Button onClick={() => setIsOpen(false)}>Close</Button>
 *         </Sheet.Footer>
 *       </Sheet>
 *     </>
 *   );
 * }
 * ```
 *
 * @packageDocumentation
 */

export { Sheet } from './Sheet';
export type {
  SheetBodyProps,
  SheetContextValue,
  SheetFooterProps,
  SheetHeaderProps,
  SheetMode,
  SheetPlacement,
  SheetProps,
  SheetSize,
  SheetSurface,
  SheetTitleProps,
} from './Sheet.types';
