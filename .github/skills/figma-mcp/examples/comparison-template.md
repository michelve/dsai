# Component Comparison: {COMPONENT_NAME}

> Figma: {FIGMA_URL}
> Analyzed: {TIMESTAMP}

---

## Differences

### 📁 {Component}.tsx

#### 1. {PROPERTY_NAME}

- **Figma:** {FIGMA_VALUE} (`{dsai_token}` = {css_value})
- **Code:** {CODE_VALUE} (`{current_token}` = {css_value})
- **SCSS Variable:** `$spacing-{n}` or `$theme-{name}` (from `_variables.scss`)
- **Bootstrap Class:** `{new_class}` vs `{current_class}`
- **Impact:** Low | Medium | High

**Decision:**

- [ ] 🔧 IMPLEMENT
- [ ] ✅ ACCEPT - Reason:
- [ ] ⏭️ SKIP

---

#### 2. {PROPERTY_NAME}

- **Figma:** {FIGMA_VALUE}
- **Code:** {CODE_VALUE}
- **SCSS Variable:** `$spacing-{n}` or `$border-radius-{size}` (from `_variables.scss`)
- **Bootstrap Class:** `{class}`
- **Impact:** Low | Medium | High

**Decision:**

- [ ] 🔧 IMPLEMENT
- [ ] ✅ ACCEPT - Reason:
- [ ] ⏭️ SKIP

---

### 📁 {Dependency}.tsx (dependency)

⚠️ Changes affect all components using {Dependency}

#### 1. {PROPERTY_NAME}

- **Figma:** {FIGMA_VALUE}
- **Code:** {CODE_VALUE}
- **SCSS Variable:** `$theme-{name}` or `$shadow-{size}` (from `_variables.scss`)
- **Bootstrap Class:** `{class}`
- **Impact:** Low | Medium | High

**Decision:**

- [ ] 🔧 IMPLEMENT
- [ ] ✅ ACCEPT - Reason:
- [ ] ⏭️ SKIP

---

## Previously Accepted

| Category | Figma       | Code     | SCSS Variable                    | File         | Reason                |
| -------- | ----------- | -------- | -------------------------------- | ------------ | --------------------- |
| Width    | Fixed 200px | `w-100`  | N/A (Bootstrap utility)          | Button.tsx   | Container flexibility |
| Gap      | 0px         | `gap-1`  | `$spacing-1` (0.25rem)           | Card.tsx     | Visual breathing room |
| Radius   | 8px         | 6px      | `$border-radius-default`         | BaseCard.tsx | Subtle corners        |

---

## Summary

| File             | Differences | IMPLEMENT | ACCEPT | SKIP |
| ---------------- | ----------- | --------- | ------ | ---- |
| {Component}.tsx  | 0           | 0         | 0      | 0    |
| {Dependency}.tsx | 0           | 0         | 0      | 0    |
| **Total**        | **0**       | **0**     | **0**  | **0**|

---

## DSAi Token Quick Reference

| Category | Tokens                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------- |
| Spacing  | `spacing0`="0", `spacing1`="0.25rem", `spacing2`="0.5rem", `spacing3`="1rem", `spacing4`="1.5rem", `spacing5`="3rem" |
| Radius   | `borderRadiusSm`="0.25rem", `borderRadiusDefault`="0.375rem", `borderRadiusLg`="0.5rem", `borderRadiusXl`="1rem" |
| Colors   | `themePrimary`="#0a58ca", `themeSecondary`="#a8adb7", `themeDanger`="#842029", `themeSuccess`="#0f5132" |
| Shadows  | `shadowSm`="0 0.125rem 0.25rem rgba(0,0,0,0.075)", `shadowDefault`="0 0.5rem 1rem rgba(0,0,0,0.15)" |
