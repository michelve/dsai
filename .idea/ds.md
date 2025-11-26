ou are a senior React + TypeScript + Design System engineer.
You have full read/write access to my monorepo.

Your job is to:

Analyze the existing Alert implementation and its tests.

Introduce a small, explicit Finite State Machine (FSM) for alert visibility/dismissal that reflects the existing behavior (show, dismissible, onClose, Escape).

Preserve all current semantics:

Bootstrap 5 styling (alert-\*).

Security guarantees (href validation, external link protection, prop whitelisting).

Accessibility (roles, aria-live, aria-atomic, icon handling, keyboard behavior).

Keep the public API compatible (or provide a clear migration note).

Do not invent new features such as auto-dismiss timers unless the codebase already uses them. FSM is for structuring the existing behavior, not adding speculative behavior.

Phase 1 – Discover and Summarize the Current Alert

Locate the Alert files (in the DS package):

Alert.tsx (core implementation).

Alert.types.ts (types).

Alert.test.tsx (behavior + a11y tests for Alert, Alert.Link, Alert.Heading).

Alert.security.test.tsx (href + title security tests).

index.ts where Alert is exported (if applicable).

Any README or docs for Alert; if none exist, note that.

Summarize current props and behavior

From Alert.types.ts and tests, identify:

AlertProps:

children (content).

variant (primary | secondary | success | danger | warning | info | light | dark).

title (string, rendered as heading using Alert.Heading).

dismissible (boolean).

onClose (required when dismissible is true).

icon (ReactNode, optional).

show (boolean, controls whether the alert is rendered).

as (element type, defaults to div).

aria-atomic (defaults to true).

id, className, style, data-testid, data-test, title attribute, and other safe HTML attributes from SafeAlertHTMLAttributes.

Alert.Link props:

href (validated URL).

onClick, className, target, rel, data-testid, data-test, title.

Alert.Heading props:

children.

as (h1–h6, default h4).

className.

Summarize current behavior (from Alert.tsx and tests)

Confirm:

Rendering:

Default: <div class="alert alert-primary" role="status" aria-live="polite" aria-atomic="true">.

show={false} → returns null (no DOM).

as="section" → <section class="alert …">.

Variants:

All 8 variants map to alert-{variant} and base alert class.

Default variant is primary.

Dismissible:

dismissible + onClose:

adds alert-dismissible, fade, show classes.

renders a close button with class="btn-close" and aria-label="Close".

clicking close calls onClose once.

Escape key:

when dismissible && onClose, keydown on document with key === 'Escape' calls onClose.

when not dismissible, Escape does not call onClose.

Title & Heading:

title prop renders an AlertHeading with alert-heading class and default heading level.

<Alert.Heading> can override as.

If no title, no .alert-heading exists.

Icons:

When icon is provided: wrapper <span class="me-2 d-inline-flex align-items-center" aria-hidden="true">.

When no icon, no [aria-hidden="true"] wrapper.

ARIA:

role is:

'alert' for danger and warning.

'status' for other variants.

aria-live is:

'assertive' for danger.

'polite' for others.

aria-atomic defaults to true, can be overridden via aria-atomic={false}.

Summarize security behavior

From Alert.tsx and Alert.security.test.tsx:

isSafeHref:

blocks javascript:, data:, text/html, vbscript:, file:, about:blank, etc.

Alert.Link:

invalid or unsafe href → uses '#'.

target="\_blank" → forces rel="noopener noreferrer".

Title attribute:

Alert and Alert.Link titles are independent: alert title attr does not override link title, and vice versa.

Produce a short internal summary for yourself and use it as the source of truth before introducing an FSM.

Phase 2 – Design the Alert FSM (Visibility / Dismissal)

Introduce a minimal FSM that models the visibility lifecycle of an alert, respecting the existing show, dismissible, and onClose semantics.

Define state type

Start with something like:

type AlertVisibilityState = "visible" | "hidden";

You may optionally add dismissing if you need a future animation hook, but do not change external behavior while introducing it.

Define events

Map events directly from current behavior:

SHOW – external request to show (e.g. show prop becomes true).

HIDE – external request to hide (e.g. show prop becomes false).

DISMISS_CLICK – close button click.

DISMISS_ESCAPE – Escape key press when dismissible.

Define transitions

Start from the current logic:

From "visible":

HIDE → "hidden".

DISMISS_CLICK → "hidden".

DISMISS_ESCAPE (only when dismissible) → "hidden".

From "hidden":

SHOW → "visible".

Dismiss events → stay "hidden" (no-op).

The FSM should not attempt to manage variant or icons; only visibility/dismissal, because that is what exists today.

FSM shape

In a new module Alert.fsm.ts:

export type AlertFSMState = { visibility: AlertVisibilityState }.

export type AlertFSMEvent = { type: "SHOW" | "HIDE" | "DISMISS_CLICK" | "DISMISS_ESCAPE" }.

export function createInitialAlertFSMState(show: boolean): AlertFSMState.

export function alertFSMReducer(state: AlertFSMState, event: AlertFSMEvent): AlertFSMState.

Phase 3 – Implement and Test the FSM in Isolation

FSM tests

Create Alert.fsm.test.ts:

Initial state:

createInitialAlertFSMState(true) → visibility: "visible".

createInitialAlertFSMState(false) → visibility: "hidden".

Transitions:

visible + HIDE → hidden.

visible + DISMISS_CLICK → hidden.

visible + DISMISS_ESCAPE (dismissible) → hidden; for FSM, you can treat this as just a DISMISS event.

hidden + SHOW → visible.

Idempotency:

hidden + DISMISS\_\* → stays hidden.

visible + SHOW → stays visible.

Keep it pure and well-typed.

Phase 4 – Integrate FSM into Alert.tsx

Adapt the existing AlertBase to use the FSM for visibility, without changing the public API.

Introduce useReducer

Inside AlertBase:

Initialize FSM state from show prop:

const [fsmState, dispatch] = useReducer(
alertFSMReducer,
createInitialAlertFSMState(show)
);

Synchronize external show prop with FSM:

useEffect(() => {
dispatch({ type: show ? "SHOW" : "HIDE" });
}, [show]);

Wire dismiss triggers to FSM

Close button onClick:

Dispatch DISMISS_CLICK.

Call onClose if provided (to keep current behavior).

Escape key handler:

When dismissible && onClose:

Dispatch DISMISS_ESCAPE.

Call onClose.

Preserve the existing document-level keydown registration pattern, but move the visibility decision through the FSM instead of directly.

Rendering based on FSM

Replace if (!show) return null; with:

if (fsmState.visibility === "hidden") {
return null;
}

This ensures all visibility/dismiss logic flows through the FSM.

Optional: data-visual-state attribute

For debugging and analytics (similar to Button), you may add:

data-visual-state={fsmState.visibility}

to the root <Component> so tests or consumers can inspect the state. Use a non-breaking default.

Keep everything else as-is

Do not change:

role / aria-live / aria-atomic logic.

icon wrapper behavior.

Alert.Link and Alert.Heading implementations and memoization.

Bootstrap classes computation (alert, alert-${variant}, alert-dismissible, fade show).

prop whitelist and security behavior.

Phase 5 – Re-run and Extend Tests

Existing tests must pass untouched

All of Alert.test.tsx must still pass without modification, including:

variants, titles, dismissible behavior, Escape key behavior, icons, Alert.Link, Alert.Heading, custom styling, HTML attributes, aria-live, aria-atomic, ref forwarding.

All of Alert.security.test.tsx must still pass unchanged.

If any tests break after FSM integration, fix the implementation first rather than relaxing tests.

Add FSM-specific integration tests

Extend Alert.test.tsx minimally:

Confirm that show={false} → DOM is empty, both initially and after toggling.

Confirm that:

initial show={true}, click close → no alert in DOM.

initial show={true}, Escape → no alert in DOM when dismissible.

show toggled from false to true after mount → alert appears (FSM handles SHOW).

If you added data-visual-state, you can assert:

visible → data-visual-state="visible".

after dismissal → no element or data-visual-state="hidden" if you choose to keep the node for animations later.

Phase 6 – Documentation and Exports

Export FSM utilities (optional but preferred)

In the Alert module index (e.g. index.ts under the Alert folder, or the central DS index if that’s where you aggregate):

Export alertFSMReducer, createInitialAlertFSMState, AlertFSMState, AlertFSMEvent, to align with how Button FSM utilities are exported.

Documentation

If there is an Alert README already:

Add a short “Internal FSM” section explaining that:

visibility is modeled as an FSM,

show, dismissible, and Escape/close integrate with it.

If no Alert README exists:

Create README.md for Alert with:

props table (Alert, Alert.Link, Alert.Heading),

behavior descriptions (variants, role/aria-live, dismissible, Escape),

security guarantees (href validation, external link protection),

one short paragraph about FSM-based visibility.

Phase 7 – Final Validation

Run the usual project checks:

lint

typecheck

unit tests

any a11y tests (jest-axe) if configured at the suite level

Output a short summary with:

Files created/modified (Alert.fsm.ts, Alert.fsm.test.ts, updated Alert.tsx, index/docs).

Final AlertFSMState and AlertFSMEvent shapes.

Confirmation that existing tests passed unchanged.

New tests added and what they guarantee.

Important constraints

Do not add speculative features (auto-dismiss timers, new props) unless they already exist.

Do not change public Alert props shape without a clear migration note.

Use tests and current behavior as the canonical spec.

Keep Alert’s FSM as focused and small as possible: it is there for predictability and testability, not to complicate the API.
