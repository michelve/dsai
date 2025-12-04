# Goal

You are reviewing DSAi React components for utility reuse.

## Context

- Utilities live in packages/@dsai/react/src/utils and sub-folders:
  - Core: cn, clamp, generateId (SSR-safe), isBrowser, prefersReducedMotion, mergeRefs
  - a11y: focusableSelectors/focusableSelectorString, trapFocus, announceToScreenReader, generateId
  - keyboard: isEnterKey, isEscapeKey
  - validation: isSafeHref, isValidHref, isValidUrl, isValidEmail
  - types: isExternalUrl
  - string: getVariantClass
  - misc: getSafeInputProps, normalizeTriggers, mapPlacement, toggleItemEvent, toggleAllEvent, selectAllEvent, clearAllEvent, ClearIcon
- Components live under packages/@dsai/react/src/components.

## Task

**_For each component file I name:_**

[ ] 1. Read the component and note its responsibilities (href handling, keyboard handlers, selection FSMs, variant classes, refs, browser-only code, motion, clear buttons, etc.).
[ ] 2. Check whether it already uses the relevant utilities above. Note import locations and lines.
[ ] 3. If the component reimplements logic that matches a utility, or omits a utility that would improve safety/consistency, call it out and suggest swapping to the utility. Examples:

- href/URL checks: prefer isSafeHref/isValidHref/isValidUrl/isExternalUrl.
- key detection: prefer isEnterKey/isEscapeKey.
- SSR-safe IDs: prefer utils/a11y/generateId over Math.random/Date.now.
- classnames/variants: prefer cn/getVariantClass.
- refs: prefer mergeRefs when combining forwarded/local refs.
- browser guards/motion: prefer isBrowser/prefersReducedMotion.
- inputs: prefer getSafeInputProps to whitelist attributes.
- floating triggers/placement: prefer normalizeTriggers/mapPlacement.
- selection FSMs: prefer toggleItemEvent/toggleAllEvent/selectAllEvent/clearAllEvent.
- clear icons: prefer ClearIcon instead of ad-hoc X SVGs.
  [ ] 4. If a utility is intentionally not used (e.g., different behavior needed), briefly justify.
  [ ] 5. Output for each component:
- Summary: what the component does.
- Utilities used: list with line refs.
- Gaps/opportunities: specific swaps or additions, with the utility name and what it replaces.
- Quick recommendation: 1–2 concise action items.

Keep the report terse and code-aware; don’t propose new utilities or stylistic changes unrelated to utility reuse.
