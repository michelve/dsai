# TASK-041: Carousel Component

**Task ID:** TASK-041
**Title:** Carousel Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 12 hours
**Phase:** Phase 2C - Complex Components (Weeks 11-13)

---

## Description

Create accessible Carousel component for cycling through images or content. Support autoplay, touch gestures, keyboard navigation, and custom indicators.

---

## Acceptance Criteria

### Component Implementation
- [ ] Carousel container component
- [ ] CarouselItem (slide)
- [ ] CarouselControl (prev/next buttons)
- [ ] CarouselIndicators (dots)
- [ ] Controlled: `activeIndex` + `onSelect`
- [ ] Autoplay with interval
- [ ] Pause on hover
- [ ] Touch/swipe support (react-swipeable or similar)

### Styling
- [ ] Slide animations (slide, fade, custom)
- [ ] Control button styling
- [ ] Indicator dots styling
- [ ] Responsive sizing

### Accessibility
- [ ] `role="region"` on container
- [ ] `aria-label="carousel"`
- [ ] `aria-live="polite"` for announcements
- [ ] Prev/next buttons: `aria-label`
- [ ] Indicators: `aria-label` per slide
- [ ] Keyboard navigation (Arrow keys)
- [ ] Pause button for autoplay (required for WCAG)

### Testing
- [ ] Unit tests 90%+
- [ ] Autoplay tests
- [ ] Swipe gesture tests
- [ ] jest-axe tests

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template
- **TASK-021**: Button Component

---

**Estimated Effort:** 12 hours
