# TASK-057: Refactor Stories to Use DSAi Components

## Status: Not Started

## Priority: High

## Description

Refactor Storybook stories to use `@dsai/react` components instead of hardcoded HTML elements. This ensures consistency, demonstrates proper component usage, and validates component APIs.

## Audit Results

After auditing all 23 story files in `/packages/@dsai/storybook/docs/components/*.stories.tsx`, **13 files** contain hardcoded HTML elements that should be replaced.

### Summary Statistics

| Category                           | Count |
| ---------------------------------- | ----- |
| Total files audited                | 23    |
| Files with issues                  | 13    |
| Files clean                        | 10    |
| Hardcoded `<button>` occurrences   | ~45+  |
| Hardcoded `<input>` occurrences    | ~10+  |
| Hardcoded `<select>` occurrences   | ~3    |
| Hardcoded `<textarea>` occurrences | ~3    |
| Hardcoded `<label>` occurrences    | ~8+   |

---

## Files Requiring Updates

### 1. Alert.stories.tsx

| Line(s)  | Hardcoded Element                   | Recommended Replacement |
| -------- | ----------------------------------- | ----------------------- |
| ~128     | `<button>`                          | `Button` component      |
| ~140-150 | `<button>`                          | `Button` component      |
| ~176     | `<button className="btn...">`       | `Button`                |
| ~191-203 | Multiple `<button>` with BS classes | `Button` component      |

### 2. Button.stories.tsx

| Line(s)  | Hardcoded Element | Recommended Replacement |
| -------- | ----------------- | ----------------------- |
| ~128     | `<button>`        | `Button`                |
| ~155     | `<button>`        | `Button`                |
| ~185-193 | `<button>`        | `Button`                |
| ~234     | `<button>`        | `Button`                |
| ~256     | `<button>`        | `Button`                |
| ~279-281 | `<button>`        | `Button`                |

### 3. Checkbox.stories.tsx

| Line(s) | Hardcoded Element | Recommended Replacement |
| ------- | ----------------- | ----------------------- |
| ~266    | `<button>`        | `Button`                |

### 4. CheckboxGroup.stories.tsx

| Line(s)            | Hardcoded Element | Recommended Replacement |
| ------------------ | ----------------- | ----------------------- |
| Multiple locations | `<button>`        | `Button`                |
| Multiple locations | `<input>`         | `Input`                 |

### 5. Input.stories.tsx

| Line(s)       | Hardcoded Element | Recommended Replacement |
| ------------- | ----------------- | ----------------------- |
| Form examples | `<button>`        | `Button`                |

### 6. ListGroup.stories.tsx

| Line(s)                     | Hardcoded Element                       | Recommended Replacement            |
| --------------------------- | --------------------------------------- | ---------------------------------- |
| ~200-250 (DataTableExample) | `<input type="text">`                   | `Input` component                  |
| ~200-250                    | `<select>`, `<option>`, `<button>`, etc | `Select` with `Input` and `Button` |

### 7. Pagination.stories.tsx

| Line(s)                   | Hardcoded Element | Recommended Replacement |
| ------------------------- | ----------------- | ----------------------- |
| ~290 (FormExample)        | `<input>`         | `Input`                 |
| ~315-330 (SurveyQuestion) | `<button>`        | `Button`                |

### 8. Progress.stories.tsx

| Line(s)                     | Hardcoded Element | Recommended Replacement |
| --------------------------- | ----------------- | ----------------------- |
| ~235-244 (Controlled story) | `<button>`        | `Button`                |
| ~235-244                    | `<input>`         | `Input`                 |
| ~550-600 (InteractiveDemo)  | `<input>`         | `Input` component       |
| ~550-600                    | `<select>`        | `Select` component      |

### 9. Radio.stories.tsx

| Line(s)            | Hardcoded Element | Recommended Replacement |
| ------------------ | ----------------- | ----------------------- |
| ~295 (FormExample) | `<button>`        | `Button`                |

### 10. Table.stories.tsx

| Line(s)                       | Hardcoded Element   | Recommended Replacement |
| ----------------------------- | ------------------- | ----------------------- |
| ~185 (ControlledSorting)      | `<button>`          | `Button`                |
| ~305-325 (CustomEmptyContent) | `<button>`          | `Button`                |
| ~440-460 (ActionColumn)       | `<button>`          | `Button`                |
| ~440-460                      | `<select>`          | `Select`                |
| ~505-530 (VisualStates)       | Multiple `<button>` | `Button`                |

### 11. Tabs.stories.tsx

| Line(s)           | Hardcoded Element | Recommended Replacement |
| ----------------- | ----------------- | ----------------------- |
| ~130 (Controlled) | `<button>`        | `Button`                |

### 12. TabsPro.stories.tsx

| Line(s)                       | Hardcoded Element     | Recommended Replacement               |
| ----------------------------- | --------------------- | ------------------------------------- |
| ~195-205 (PermissionGating)   | `<input checkbox>`    | `Checkbox` or `Switch` component      |
| ~195-205                      | `<label>`             | Label integrated with Checkbox/Switch |
| ~370-400 (DirtyStateHandling) | `<textarea>`          | `Input` component (multiline)         |
| ~370-400                      | `<button>`            | `Button`                              |
| ~370-400                      | `<label>`             | Input's `label` prop                  |
| ~595-610 (CompleteShowcase)   | `<input checkbox>`    | `Checkbox` or `Switch` component      |
| ~125-150                      | `<form>`              | Consider form pattern                 |
| ~125-150                      | `<input>`, `<select>` | `Input`, `Select`                     |

### 13. Typography.stories.tsx

| Line(s)  | Hardcoded Element      | Recommended Replacement |
| -------- | ---------------------- | ----------------------- |
| ~125-150 | `<input>`              | `Input` component       |
| ~125-150 | `<button>`, `<select>` | `Button`, `Select`      |

---

## Files Already Clean ✅

These files properly use `@dsai/react` components:

1. ✅ Badge.stories.tsx
2. ✅ Breadcrumb.stories.tsx
3. ✅ Card.stories.tsx
4. ✅ CardList.stories.tsx
5. ✅ ComponentTemplate.stories.tsx
6. ✅ Modal.stories.tsx (recently fixed)
7. ✅ Select.stories.tsx
8. ✅ SelectableCard.stories.tsx
9. ✅ Spinner.stories.tsx
10. ✅ Switch.stories.tsx

---

## Implementation Plan

### Phase 1: High Priority (Form Controls)

Replace all hardcoded form elements:

- `<input>` → `Input`
- `<select>` → `Select`
- `<textarea>` → `Input` with multiline support
- `<button>` → `Button`

### Phase 2: Medium Priority (Interactive Demos)

Update interactive demo/showcase stories:

- Progress.stories.tsx InteractiveDemo
- ListGroup.stories.tsx DataTableExample
- Table.stories.tsx action columns

### Phase 3: Lower Priority (Labels/Forms)

- Replace hardcoded `<label>` elements with component's `label` prop
- Standardize form patterns across stories

---

## Acceptance Criteria

- [ ] All `<input>` elements replaced with `Input` component
- [ ] All `<select>` elements replaced with `Select` component
- [ ] All `<button>` elements replaced with `Button` component
- [ ] All `<textarea>` elements replaced with appropriate component
- [ ] ESLint passes with no warnings
- [ ] Storybook builds successfully
- [ ] Visual appearance matches original
- [ ] All stories render correctly

---

## Notes

- Some hardcoded elements in demo stories show state control outside the component being documented
- Consider creating utility patterns for story controls
- Ensure changes don't break existing story functionality
