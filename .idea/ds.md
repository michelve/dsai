Role

You are a senior React + TypeScript + Design System engineer.
You have full read/write access to my monorepo.

Your task is to:

Scan the codebase and understand the current design system structure.

Design and implement a Button component that uses:

a finite state machine (FSM) for visual states

design tokens for styling

my existing patterns (tokens, CSS, Bootstrap, etc.)

Keep the existing API compatible (or provide a clear migration path).

Add tests and stories following the current project standards.

Do not invent fake tokens or patterns. Reuse what exists.

Phase 1 – Discover the Current Design System

Find the design system packages and components

Search the repo for:

Button.tsx, button.tsx, Button/index.tsx

Checkbox.tsx, Input.tsx, Switch.tsx

@dsai/ packages or any DS packages

Identify:

the main React DS package (for example packages/dsai-react or similar)

the main tokens package (for example packages/@dsai/tokens or similar)

Inspect the existing Button (if present)

For each Button component you find:

Record:

file path

current props interface

supported variants, sizes, and states (disabled, loading, etc.)

how CSS classes are applied (Bootstrap, utility classes, custom CSS)

how tokens or CSS variables are used

Check for:

tests (_.test.tsx / _.spec.tsx)

Storybook stories (\*.stories.tsx)

MD/MDX docs for the Button

Inspect token structure

Search for the tokens package, likely in:

packages/@dsai/tokens/

or any tokens directory

Identify:

global color tokens

component tokens (especially for button, if any)

how tokens are exported (TS, JSON, CSS variables)

Note:

if there is a useTokens, useTheme, or similar hook/context in the React DS package

any existing button token definitions (names, shape, variants, sizes, motion)

Inspect DS patterns via another component

Pick one or two components as a reference, for example:

Checkbox

Input

Switch

Extract:

how props are defined and typed

how error, helper text, disabled states are handled

how tokens are integrated (CSS variables, classes, inline styles)

how testing and stories are structured for these components

Use these as conventions to follow for the new Button.

Report

Produce a short internal summary (not for docs) that includes:

main DS package path

tokens package path

current Button component path and API (if exists)

token shape for buttons (if exists)

common patterns used in other components (Checkbox/Input)

Use this summary to drive the next phases.

Phase 2 – Design the Button API and FSM

Based on the existing codebase and patterns, do NOT invent new naming schemes.
Follow the current conventions as much as possible.

Define visual states for the button

Use a union type similar to:

type ButtonVisualState =
| "idle"
| "hovered"
| "focused"
| "pressed"
| "disabled"
| "loading"
| "error";

Adjust the exact values to match any existing state naming patterns if they exist.

Define Button props

Extend the existing Button props if a Button already exists.

Otherwise, create ButtonProps and BaseButtonProps that follow:

existing design system prop naming

existing variant and size names

Include at least:

variant (e.g. primary, secondary, ghost, danger or the existing ones)

size (e.g. sm, md, lg or the existing ones)

disabled

loading

error

type ("button" | "submit" | "reset")

children

Design the FSM reducer

Create a pure reducer that manages ButtonVisualState based on events:

Events: HOVER, BLUR, FOCUS, PRESS, RELEASE, DISABLE, ENABLE, LOADING, ERROR.

Rules:

DISABLE → always “disabled”

LOADING(true) → “loading”

ERROR(true) → “error”

Hover/press/focus do nothing when disabled or loading

Keep the reducer small, deterministic, and fully tested.

Phase 3 – Implement BaseButton (Presentational, Token-Driven)

Location and file structure

In the React DS package (the one you identified), create or update:

src/button/button.types.ts

src/button/button.fsm.ts

src/button/BaseButton.tsx

src/button/Button.tsx

Adjust paths to match the repo’s existing patterns.

BaseButton responsibilities

Receives:

layout and styling props

data-visual-state (the visual state from the FSM)

Uses:

design tokens from the existing tokens package or theme context

Applies:

background color, text color, border color

height, padding, radius, font size

transitions and press scale based on tokens

Renders:

a native <button> element

a spinner element when loading is true (use existing spinner if available)

a label wrapper around children

Token integration

Do NOT invent new token names if button tokens already exist. Use them.

If button tokens do not exist:

create a minimal button token entry that fits the current token design

expose it from the tokens package

Use tokens through:

an existing token hook/context (for example useTokens, useTheme, useDsaiTokens)

or direct imports if that’s how the repo works

CSS / class handling

Reuse the existing class naming scheme (e.g. btn, dsai-btn, etc.).

If Bootstrap is used:

combine tokens with Bootstrap classes instead of replacing them.

Ensure:

focus-visible is styled according to a11y expectations

disabled state uses the correct cursor and visual style

Phase 4 – Implement Button (FSM + Events)

Button responsibilities

Wraps BaseButton.

Owns the FSM state (ButtonVisualState).

Syncs FSM with external props:

when disabled changes, dispatch DISABLE/ENABLE

when loading changes, dispatch LOADING

when error changes, dispatch ERROR

Hooks DOM events:

onMouseEnter → HOVER

onMouseLeave → BLUR

onMouseDown → PRESS (for left click)

onMouseUp → RELEASE

onFocus → FOCUS

onBlur → BLUR

For each event:

dispatch the FSM event

call the user’s original handler (if provided)

Click behavior

If disabled or loading is true, prevent click (do nothing).

Otherwise, call onClick normally.

Prop compatibility

Preserve the existing Button API as much as possible.

If you need to rename or add props:

maintain backward compatibility where reasonable

or note the required changes clearly in JSDoc or comments

Exports

Ensure that the main DS entry point continues to export Button in the same way as before.

If you introduce Button and BaseButton, decide:

which one is the default export for external consumers (most likely Button)

how to expose BaseButton for advanced internal use, if needed.

Phase 5 – Tests and Stories

Unit tests

Add or update tests under the existing test directory, for example:

tests/button/Button.test.tsx

Use the same test framework (Jest / Vitest) and helpers (RTL) already used.

Cover at least:

renders with children

disabled prevents onClick

loading shows spinner and sets aria-busy="true"

FSM updates data-visual-state for hover, press, etc. (smoke tests)

tokens are applied (basic assertion on style or className)

Storybook stories (if used)

Add or update stories, e.g. Button.stories.tsx.

Provide stories for:

primary/secondary variants

sizes

disabled

loading

with icon, with only icon (ensure a11y label)

error state (if visually distinct)

A11y checks

Ensure:

Button has type default set sensibly (usually "button").

Icon-only buttons require aria-label or aria-labelledby.

Loading state uses aria-busy and does not break screen readers.

Phase 6 – Optional: AI/Analyzer Integration (Lint-Style)

If the repo already has tooling (Node scripts, CLI, ESLint rules), do this:

Create a small analyzer utility

New folder, e.g. tools/dsai-analyzer/.

Implement a script that:

scans TSX files

finds <Button /> / <Button /> usages

extracts props (variant, size, disabled, loading, children)

prints warnings for:

icon-only buttons without accessible name

buttons using “danger” variant without clear copy (e.g. “Delete”)

missing type on form buttons if that’s a rule

No magic

This analyzer can be simple at first.

Later, I will connect it to an LLM, but for now, just structure the code and CLI.

Add a package.json script

Add something like:

"dsai:analyze:buttons": "node tools/dsai-analyzer/dist/cli.js"

Phase 7 – Validation and Summary

Run the existing project checks:

lint

typecheck

tests

Storybook build (if configured)

Fix any regressions or type issues.

Produce a short summary in a Markdown file inside the repo, e.g.:

docs/design-system/button-smart-fsm.md

Summarize:

where the new Button lives

how its API looks (props table)

how the FSM works

how tokens are applied

how to migrate from old Button usage (if needed)

Very Important Constraints

Do not invent fake token names or random design decisions.

Always read the existing code and follow its patterns.

Keep changes minimal and aligned with the current design system.

If there are multiple button implementations, pick the main shared design system one, not random app-local buttons.

When you finish, output:

A list of files you created or modified.

The final Button API (props list).

Any breaking changes or migration notes in clear, concise bullet points.
