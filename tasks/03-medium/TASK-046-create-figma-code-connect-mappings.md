# TASK-046: Create Figma Code Connect Mappings

**Task ID:** TASK-046
**Title:** Create Figma Code Connect Mappings
**Priority:** Medium
**Status:** Not Started
**Assigned To:** Developer + Designer
**Estimated Time:** 16 hours
**Phase:** Phase 3 - Figma Integration (Weeks 14-15)

---

## Description

Map Figma components to React components using Figma's Code Connect feature. Create `.figma.tsx` files for priority components (Button, Alert, Badge, Card, Modal) to enable code generation from Figma designs.

---

## Acceptance Criteria

### Code Connect Setup
- [ ] Install `@figma/code-connect` package
- [ ] Configure Code Connect in package.json
- [ ] Authentication with Figma API token

### Component Mappings (5 priority components)
- [ ] Button.figma.tsx: Map all variants, sizes, states
- [ ] Alert.figma.tsx: Map variants, icon, closeable
- [ ] Badge.figma.tsx: Map variants, sizes, dot, pill
- [ ] Card.figma.tsx: Map header/body/footer composition
- [ ] Modal.figma.tsx: Map sizes, header/body/footer

### Variant Mappings
- [ ] Map Figma component properties to React props
- [ ] Map Figma variants to prop values
- [ ] Map boolean properties correctly
- [ ] Handle nested instances

### Documentation Links
- [ ] Add Storybook links in Code Connect files
- [ ] Add component README links
- [ ] Test in Figma Dev Mode (Inspect panel shows code)

### Testing
- [ ] Verify mappings in Figma Dev Mode
- [ ] Test code generation accuracy
- [ ] Validate prop values match

---

## Dependencies

### Requires:
- **TASK-018**: Populate Figma Variables
- **TASK-021**: Button Component
- **TASK-022**: Badge Component
- **TASK-023**: Alert Component
- **TASK-034**: Card Component
- **TASK-037**: Modal Component

---

**Estimated Effort:** 16 hours
