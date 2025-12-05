# Goal

You are reviewing DSAi React components to optimize utility reuse. Apply all required changes carefully, ensuring no functionality is lost during this migration. Maintain enterprise-level engineering standards and preserve all existing behavior.

## Context

Utilities live in `packages/@dsai/react/src/utils` and sub-folders:

- **Core:**  
  `cn`, `clamp`, `generateId` (SSR-safe), `isBrowser`, `prefersReducedMotion`, `mergeRefs`
- **a11y:**  
  `focusableSelectors`, `focusableSelectorString`, `trapFocus`, `announceToScreenReader`, `generateId`
- **keyboard:**  
  `isEnterKey`, `isEscapeKey`
- **validation:**  
  `isSafeHref`, `isValidHref`, `isValidUrl`, `isValidEmail`
- **types:**  
  `isExternalUrl`
- **string:**  
  `getVariantClass`
- **misc:**  
  `getSafeInputProps`, `normalizeTriggers`, `mapPlacement`,  
  `toggleItemEvent`, `toggleAllEvent`, `selectAllEvent`, `clearAllEvent`, `ClearIcon`

Components live under:  
`packages/@dsai/react/src/components`.

---

## Task

_For each component file you name:_

### 1. Component Responsibilities (Checklist)

**Identify whether the component handles any of the following responsibilities:**

- [ ] Href or URL validation
- [ ] Keyboard event handling
- [ ] Selection or toggle state machines (FSMs)
- [ ] Variant class generation
- [ ] Merging refs (forwarded/local)
- [ ] Browser-only logic or guards
- [ ] Motion or reduced-motion logic
- [ ] Clear button or reset icon
- [ ] Input props safety
- [ ] Floating triggers or placement mapping
- [ ] Typography headings (`h1–h6`, Display 1–6)

---

### 2. Utility Usage Review

- [ ] Check if the component already imports utilities from `/utils`
- [ ] Record import paths and line numbers
- [ ] Document any custom logic that duplicates utility functionality

---

### 3. Utility Swap Evaluation

If the component reimplements logic that already exists in utilities, recommend replacing it.

**Expected utility preferences:**

- Href checks → `isSafeHref`, `isValidHref`, `isValidUrl`, `isExternalUrl`
- Keyboard detection → `isEnterKey`, `isEscapeKey`
- SSR IDs → `generateId`
- Classnames/variants → `cn`, `getVariantClass`
- Refs → `mergeRefs`
- Browser-only → `isBrowser`, `prefersReducedMotion`
- Inputs → `getSafeInputProps`
- Floating UI → `normalizeTriggers`, `mapPlacement`
- FSM events → `toggleItemEvent`, `toggleAllEvent`, `selectAllEvent`, `clearAllEvent`
- Clear button → `ClearIcon`

---

### 4. Exceptions

- [ ] If a utility is intentionally not used, add a short justification.

---

### 5. Output Format (Per Component)

Produce the following:

- **Summary**  
  Short description of what the component does.

- **Utilities Used**  
  List of utilities with import paths and line references.

- **Gaps / Opportunities**  
  What can be replaced with which utility, and why.

- **Quick Recommendations**  
  1–2 concise action items.

- **Test Adjustments**  
  Identify tests that must change due to new imports or functional updates.

- **Typography Review**  
  Confirm any heading usage is replaced with DSAi typography components.

---

Keep the report concise, technical, and focused on utility optimization.  
Do not propose new utilities or unrelated style changes.
