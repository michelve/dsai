# Task Template

**Task ID:** TASK-007
**Title:** Designer Task - Define Brand Color Palette (40-60 Colors)
**Priority:** Critical
**Status:** ⚪ Not Started
**Assigned To:** Designer Team (Lead Designer)
**Estimated Time:** 12 hours
**Phase:** Phase 0 - Foundation (Week 1-4)
**Created:** 2025-11-07
**Updated:** 2025-11-07

---

## 📋 Task Description

### Goal

Create a comprehensive, accessible color system with 40-60 carefully designed colors across multiple hues (neutral, brand, success, warning, danger, info) with 11 steps each, ensuring WCAG 2.1 AA compliance for all text/background combinations.

### Problem/Issue

Bootstrap's default color palette is:

- Limited in scale (not enough shades)
- Not optimized for accessibility
- Lacks semantic meaning
- Cannot support complex themes

Need a robust color ramp that supports:

- Light and dark modes
- Accessible contrast ratios
- Semantic color tokens
- Component-specific colors

### Expected Outcome

A scientifically designed color palette with 6 hues × 11 steps = 66 colors, all documented with hex values, accessibility ratings, and usage guidelines.

---

## 🎯 Acceptance Criteria

- [ ] 6 color hues defined with 11 steps each (66 colors total)
  - Neutral (gray scale)
  - Brand (primary brand color)
  - Success (green)
  - Warning (amber/yellow)
  - Danger (red)
  - Info (blue)
- [ ] All colors meet WCAG 2.1 AA contrast requirements
- [ ] Color ramp is perceptually uniform
- [ ] Each color documented with:
  - Hex value
  - RGB value
  - HSL value
  - Contrast ratio against white/black
  - Recommended usage
- [ ] Color palette tested for color blindness
- [ ] Figma swatches created
- [ ] Documentation created

---

## 📂 Files to Create

- `design/color-system/color-palette.md` - Documentation
- `design/color-system/color-swatches.fig` - Figma file with all colors
- `design/color-system/accessibility-matrix.xlsx` - Contrast ratio matrix
- `design/color-system/color-blindness-test.pdf` - Testing results

---

## 🔗 Dependencies

### Prerequisites

- [x] TASK-006: Bootstrap audit (understanding component needs)

### Blocks

- TASK-009: Create Figma file structure (needs colors)
- TASK-010: Create Figma Variables (needs color values)
- TASK-011: Design JSON token structure (needs color system)
- All component design tasks

---

## 🔄 Implementation Steps

### Step 1: Define Neutral Scale (Gray) - 3 hours

1. [ ] Choose base gray hue (blue-gray, warm gray, or pure gray)
2. [ ] Create 11 steps from white to black (50, 100, 200...900)
3. [ ] Ensure perceptual uniformity (use HSL lightness)
4. [ ] Test contrast ratios for text usage
5. [ ] Document usage for each step

**Example Neutral Scale:**

- neutral-50: `#f9fafb` (backgrounds)
- neutral-100: `#f3f4f6` (light backgrounds)
- neutral-200: `#e5e7eb` (borders)
- neutral-300: `#d1d5db` (subtle borders)
- neutral-400: `#9ca3af` (disabled text)
- neutral-500: `#6b7280` (secondary text)
- neutral-600: `#4b5563` (body text)
- neutral-700: `#374151` (headings)
- neutral-800: `#1f2937` (strong emphasis)
- neutral-900: `#111827` (black text)
- neutral-950: `#030712` (darkest)

### Step 2: Define Brand Color (Primary) - 2 hours

3. [ ] Select brand color (if not already defined)
4. [ ] Create 11-step scale maintaining hue
5. [ ] Ensure accessibility for button text
6. [ ] Test against neutral backgrounds
7. [ ] Document brand usage guidelines

### Step 3: Define Semantic Colors - 4 hours

8. [ ] Success (Green) - 11 steps
9. [ ] Warning (Amber) - 11 steps
10. [ ] Danger (Red) - 11 steps
11. [ ] Info (Blue) - 11 steps

For each:

- Choose base hue
- Create 11-step scale
- Test accessibility
- Document usage

### Step 4: Accessibility Testing - 2 hours

12. [ ] Create contrast ratio matrix
13. [ ] Test all text-on-background combinations
14. [ ] Verify WCAG 2.1 AA compliance (4.5:1 for text, 3:1 for large text)
15. [ ] Test with color blindness simulators:
    - Deuteranopia (red-green)
    - Protanopia (red-green)
    - Tritanopia (blue-yellow)
    - Monochromacy
16. [ ] Document accessible combinations

### Step 5: Documentation - 1 hour

17. [ ] Create color palette documentation
18. [ ] Document usage guidelines for each color
19. [ ] Create Figma swatches library
20. [ ] Share with team for feedback

---

## 📝 Notes

**Color System Requirements from Roadmap:**

```
PRIMITIVE TOKENS
├── Color Ramp (256 colors across 10 hues)
│   ├── Neutral (gray) - 11 steps
│   ├── Brand (primary) - 11 steps
│   ├── Success (green) - 11 steps
│   ├── Warning (amber) - 11 steps
│   ├── Danger (red) - 11 steps
│   └── Info (blue) - 11 steps
```

**WCAG 2.1 AA Requirements:**

- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio
- UI components: 3:1 contrast ratio
- Focus indicators: 3:1 contrast ratio

**Tools for Color Design:**

- Figma color plugins
- Coolors.co (palette generator)
- Contrast ratio checker: WebAIM
- Color blindness simulator: Coblis
- Accessible color palette builder: Colorable

**Best Practices:**

1. **Perceptual Uniformity**: Use HSL lightness for even steps
2. **Semantic Naming**: Use role-based names (not color names)
3. **Test Early**: Validate accessibility from the start
4. **Document Well**: Usage guidelines prevent misuse
5. **Stay Consistent**: Maintain consistent hue across scales

**Common Pitfalls to Avoid:**

- Uneven lightness steps (jarring transitions)
- Poor contrast on middle steps
- Colors that look similar to color-blind users
- Overly saturated middle tones
- Inconsistent hue shifts across scale

**Reference Color Systems:**

- Tailwind CSS: https://tailwindcss.com/docs/customizing-colors
- Material Design: https://m3.material.io/styles/color/system/overview
- Radix Colors: https://www.radix-ui.com/colors
- IBM Carbon: https://carbondesignsystem.com/guidelines/color/overview

**Estimated Effort:** 12 hours

- Neutral scale: 3 hours
- Brand scale: 2 hours
- Semantic scales: 4 hours
- Accessibility testing: 2 hours
- Documentation: 1 hour

---

## ✅ Definition of Done

- [ ] All 66 colors defined and documented
- [ ] All colors pass WCAG 2.1 AA
- [ ] Contrast ratio matrix complete
- [ ] Color blindness tested
- [ ] Figma swatches library created
- [ ] Usage guidelines documented
- [ ] Team review completed
- [ ] Ready for token generation (Phase 1)

