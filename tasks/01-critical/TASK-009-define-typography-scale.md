# TASK-009: Define Typography Scale

**Task ID:** TASK-009
**Title:** Define Typography Scale
**Priority:** Critical
**Status:** Not Started
**Assigned To:** Designer
**Estimated Time:** 6 hours
**Phase:** Phase 0 - Foundation (Weeks 1-2)

---

## Description

Define a comprehensive typography scale that establishes font families, sizes, weights, line heights, and letter spacing for the entire design system. This scale must support responsive design across mobile, tablet, and desktop viewports while maintaining accessibility and readability standards.

The typography system will use Poppins for headings and Inter for body text, with a modular scale approach for sizes.

---

## Acceptance Criteria

### Font Families
- [ ] Primary heading font: Poppins (all weights: 400, 500, 600, 700)
- [ ] Body text font: Inter (all weights: 400, 500, 600, 700)
- [ ] Monospace font: Fira Code or JetBrains Mono (for code samples)
- [ ] Font files sourced from Google Fonts or Adobe Fonts
- [ ] Fallback stack defined for each font family

### Type Scale Definition
- [ ] Minimum 8 type scale levels defined:
  - [ ] **Display**: 48px / 60px line-height (1.25 ratio)
  - [ ] **Heading 1**: 40px / 52px line-height
  - [ ] **Heading 2**: 32px / 44px line-height
  - [ ] **Heading 3**: 24px / 36px line-height
  - [ ] **Heading 4**: 20px / 32px line-height
  - [ ] **Body Large**: 18px / 32px line-height
  - [ ] **Body Regular**: 16px / 28px line-height
  - [ ] **Body Small**: 14px / 24px line-height
  - [ ] **Caption**: 12px / 20px line-height

### Responsive Typography
- [ ] Mobile scale defined (14px base, adjusted sizes)
- [ ] Tablet scale defined (15px base, adjusted sizes)
- [ ] Desktop scale defined (16px base, adjusted sizes)
- [ ] Fluid typography approach documented (optional clamp() values)

### Typography Tokens
- [ ] Font family tokens created
- [ ] Font size tokens created (px and rem values)
- [ ] Line height tokens created (relative values)
- [ ] Font weight tokens created (numeric values)
- [ ] Letter spacing tokens created (if needed)

### Accessibility Compliance
- [ ] All body text is minimum 16px on desktop
- [ ] Minimum contrast ratio 4.5:1 for body text
- [ ] Minimum contrast ratio 3:1 for large text (18px+ or 14px bold)
- [ ] Line height is 1.5+ for body text
- [ ] Paragraph spacing is adequate (0.5-1em)

### Figma Implementation
- [ ] Text styles created in Figma for each scale level
- [ ] Text styles named following convention: `Typography/Heading/H1`
- [ ] Responsive styles created for mobile/tablet/desktop
- [ ] Character styles created for inline formatting (bold, italic, code)
- [ ] Text style descriptions added in Figma

### Documentation
- [ ] Typography usage guidelines created:
  - [ ] When to use each heading level (semantic HTML)
  - [ ] Maximum line length (45-75 characters)
  - [ ] Heading hierarchy rules
  - [ ] Body text usage
  - [ ] Do's and don'ts with examples
- [ ] Type scale visualized in Figma
- [ ] Contrast testing results documented

---

## Dependencies

### Requires:
- **TASK-007**: Designer Define Color Palette (for contrast testing)
- **TASK-008**: Create Figma File Structure (to add text styles)

### Blocks:
- **TASK-010**: Create Figma Variables Collection (typography variables)
- **TASK-011**: Design JSON Token Structure (typography tokens)
- **TASK-019**: Create Semantic Token Definitions (semantic typography)
- All component tasks (need typography for text content)

---

## Testing Requirements

### Design Review Checklist:
- [ ] Type scale is visually harmonious (good proportion between levels)
- [ ] Scale works well at all viewport sizes
- [ ] Font pairing (Poppins + Inter) looks cohesive
- [ ] Line heights provide comfortable reading experience
- [ ] Letter spacing is appropriate (not too tight/loose)

### Accessibility Testing:
- [ ] Test with contrast checker (WebAIM, Stark)
- [ ] Verify minimum font sizes meet WCAG guidelines
- [ ] Test readability with different zoom levels (200% zoom)
- [ ] Review with screen reader to ensure semantic structure

### Technical Validation:
- [ ] Font files are licensed appropriately (check Google Fonts license)
- [ ] Font loading performance is acceptable (<100KB total)
- [ ] Fallback fonts are appropriate (similar x-height, width)
- [ ] Text styles are exportable from Figma to tokens

---

## Implementation Steps

### Step 1: Research and Planning (1 hour)
1. Review Bootstrap 5 typography system for reference
2. Analyze competitor design systems (Material, Ant Design, Chakra)
3. Research modular scale approaches (1.25 ratio, 1.333 ratio)
4. Determine base font size (16px for desktop)
5. Document typography requirements from roadmap

### Step 2: Define Font Families and Weights (1 hour)
1. Select Poppins for headings:
   - Regular (400) for default
   - Medium (500) for emphasis
   - SemiBold (600) for strong emphasis
   - Bold (700) for extra strong emphasis
2. Select Inter for body text:
   - Regular (400) for body
   - Medium (500) for slight emphasis
   - SemiBold (600) for strong text
   - Bold (700) for extra bold
3. Select monospace font for code: Fira Code or JetBrains Mono
4. Define fallback stacks:
   - Poppins: `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
   - Inter: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
   - Mono: `'Fira Code', 'Courier New', monospace`

### Step 3: Create Desktop Type Scale (1 hour)
1. Define base size: 16px (1rem)
2. Create scale using 1.25 ratio (major third):
   - Display: 48px (3rem) / 60px line-height
   - H1: 40px (2.5rem) / 52px line-height
   - H2: 32px (2rem) / 44px line-height
   - H3: 24px (1.5rem) / 36px line-height
   - H4: 20px (1.25rem) / 32px line-height
   - Body Large: 18px (1.125rem) / 32px line-height
   - Body Regular: 16px (1rem) / 28px line-height
   - Body Small: 14px (0.875rem) / 24px line-height
   - Caption: 12px (0.75rem) / 20px line-height
3. Assign font families (Poppins for headings, Inter for body)
4. Assign font weights (default weights for each level)

### Step 4: Create Responsive Scales (1 hour)
1. Define mobile scale (base: 14px):
   - Reduce heading sizes by ~10-20%
   - Keep body text at 14px minimum
   - Adjust line heights for mobile (slightly tighter)
2. Define tablet scale (base: 15px):
   - Scale between mobile and desktop
   - Use fluid typography (optional)
3. Document breakpoints for each scale:
   - Mobile: 0-767px
   - Tablet: 768px-1023px
   - Desktop: 1024px+

### Step 5: Test Accessibility and Readability (1 hour)
1. Test all text colors against background colors:
   - Body text (teal-950) on white: verify 4.5:1 minimum
   - Body text on teal-50 background: verify 4.5:1 minimum
   - Headings on various backgrounds: verify 3:1 minimum
2. Test line heights for readability:
   - Ensure body text is 1.5+ line height
   - Headings can be tighter (1.2-1.3)
3. Test maximum line length:
   - Ensure 45-75 characters per line at desktop
4. Document all test results

### Step 6: Implement in Figma (1 hour)
1. Open Figma file (from TASK-008)
2. Navigate to Foundation page
3. Create text style for each scale level:
   - Name: `Typography/Heading/Display`
   - Font: Poppins Bold
   - Size: 48px
   - Line height: 60px
   - (Repeat for all levels)
4. Create responsive variants (mobile/tablet/desktop)
5. Add descriptions to each text style
6. Create character styles for inline formatting

### Step 7: Document Typography System (1 hour)
1. Create typography showcase in Figma:
   - Display all scale levels side by side
   - Show font families, sizes, line heights, weights
   - Add visual examples with real content
2. Create usage guidelines:
   - Semantic HTML mapping (H1-H6)
   - When to use Display vs H1
   - Body text usage (long-form, short-form)
   - Maximum line length examples
   - Do's and don'ts
3. Document contrast ratios and accessibility compliance
4. Add notes about responsive behavior

---

## Definition of Done

- [ ] All 9 type scale levels are defined with precise sizes and line heights
- [ ] Font families selected and documented (Poppins, Inter, monospace)
- [ ] Responsive scales created for mobile, tablet, desktop
- [ ] Typography tokens are ready for export to JSON
- [ ] Figma text styles created for all scale levels
- [ ] Accessibility testing completed (contrast, readability)
- [ ] Typography documentation page created in Figma
- [ ] Usage guidelines are clear and comprehensive
- [ ] Type scale reviewed and approved by lead designer
- [ ] Type scale reviewed by development team for feasibility

---

## Notes

### Modular Scale Approach:
- Using 1.25 ratio (major third) for harmonious progression
- Base size: 16px aligns with browser defaults
- All sizes are divisible by 4px for 8px grid system

### Font Loading Strategy:
- Use Google Fonts for easy integration
- Implement font-display: swap for better performance
- Subset fonts to include only needed weights/characters
- Consider self-hosting for production (better caching)

### Responsive Typography:
- Fluid typography (clamp) can smooth responsive transitions
- Consider using CSS custom properties for easy theme switching
- Test on real devices (not just browser resize)

### Semantic HTML:
- H1 should be used once per page (page title)
- Heading hierarchy should not skip levels (no H1 → H3)
- Body text should use <p> tags
- Display text is for marketing/hero sections (not semantic)

### Integration with Tokens:
- Typography tokens will be exported to Style Dictionary
- Token names: `typography.heading.h1.fontSize`, etc.
- Figma text styles should match token names for easy sync

---

## Related Tasks

- **TASK-007**: Designer Define Color Palette
- **TASK-008**: Create Figma File Structure
- **TASK-010**: Create Figma Variables Collection
- **TASK-011**: Design JSON Token Structure
- **TASK-019**: Create Semantic Token Definitions

---

## Risks and Mitigations

**Risk:** Type scale doesn't work well across all viewport sizes
- **Mitigation:** Test early on real devices, use fluid typography if needed

**Risk:** Font files are too large (slow loading)
- **Mitigation:** Subset fonts, use font-display: swap, consider variable fonts

**Risk:** Contrast ratios fail accessibility standards
- **Mitigation:** Test early with contrast checker, adjust colors if needed

**Risk:** Font pairing (Poppins + Inter) doesn't look cohesive
- **Mitigation:** Create mockups early, get design team feedback

---

**Estimated Effort Breakdown:**
- Research and planning: 1 hour
- Font families and weights: 1 hour
- Desktop type scale: 1 hour
- Responsive scales: 1 hour
- Accessibility testing: 1 hour
- Figma implementation: 1 hour
- Documentation: 1 hour

**Total: 6 hours**
