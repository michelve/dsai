# DSAi Core Types

Centralized type primitives for components. Highlights:

- **Primitives:** `SemanticColorVariant`, `ComponentSize`, `ExtendedSize`, `FeedbackVariant`, `Alignment`, `Orientation`
- **A11y:** `SafeHTMLAttributes`, `ARIAProps` (security-first whitelist)
- **State:** `FSMStateBase`, `FSMEventBase`, `FSMReducer`, `FSMConfig`
- **Polymorphism:** `PolymorphicProps`, `PolymorphicComponentProps`, `PolymorphicRef`
- **Responsive:** `Breakpoint`, `ResponsiveValue`, `ResponsiveProp`

## Usage

- Prefer importing from `@dsai-io/react/types` for type-only usage, or `@dsai-io/react` for public API exposure.
- Runtime responsive helpers should be imported from `@dsai-io/react/utils/responsive` to keep the types barrel type-only:
  - `import { getResponsiveValue, isResponsiveValue } from '@dsai-io/react/utils/responsive';`
- Polymorphic patterns mirror MUI/Radix: start by typing components with `PolymorphicComponentProps<Element, OwnProps>` and `PolymorphicRef<Element>` for ref support.
- FSM helpers are base contracts; reuse `FSMStateBase` / `FSMEventBase` / `FSMReducer` in reducers to keep event/state shapes discriminated and consistent. Add `@ts-expect-error` cases in tests to catch invalid events.
- Responsive option bags: partial breakpoint objects fall back to `xs` (when present); otherwise `undefined`. Prefer providing an `xs` base to avoid surprises.

## Testing

- Type assertions live in `packages/@dsai-io/react/src/types/types.test.ts` and include negative cases (`@ts-expect-error`) to prevent regressions. Extend these when adopting polymorphic or responsive patterns in components.
