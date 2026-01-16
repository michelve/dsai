# DSAi Design System Constitution

> This document consolidates the non-negotiable rules governing DSAi development.
> All rules are extracted from existing codebase documentation, not invented.
> Source files: `tasks/chat-prompt.md`, `TESTING.md`, `Guidelines.md`

---

## Mission Statement

DSAi is an enterprise-grade design system built with React, Bootstrap 5, and TypeScript.
Every component must be accessible (WCAG 2.2 AA), secure, performant, and thoroughly tested.

---

## Part I: Security Requirements

### Rule 1: No Unrestricted Prop Spreading

**CRITICAL SECURITY VIOLATION**

```tsx
// ❌ FORBIDDEN - Security violation
<button {...rest} />
<input {...otherProps} />

// ✅ REQUIRED - Explicit whitelist
const safeProps = filterAllowedProps(rest, ALLOWED_BUTTON_ATTRS);
<button {...safeProps} />
```

**Reason:** Prevents injection of dangerous event handlers, form manipulation, and arbitrary attribute attacks.

### Rule 2: Event Handlers Must Be Explicit

- All event handlers explicitly defined in props interface
- No `on*` props accepted through spread operators
- TypeScript must validate each event handler type
- Document purpose and security implications of each handler

**Reason:** Prevents malicious code injection via event handler props.

### Rule 3: Validate All External Input

- Sanitize string props used in className, style, or data attributes
- Validate enum/union types match expected values
- Reject or escape unexpected input
- Never use `dangerouslySetInnerHTML` without explicit task approval

### Rule 15: Security Testing

**Required Tests:**

- Verify malicious props don't execute (event handlers through rest)
- Verify form manipulation props are blocked
- Verify XSS attempts through string props are sanitized
- Verify ref access doesn't expose dangerous methods

---

## Part II: Accessibility Requirements (WCAG 2.2 AA)

### Rule 4: Decorative Elements Must Be Hidden

- Icons next to text labels: `aria-hidden="true"`
- Purely visual elements: `aria-hidden="true"`
- Semantic icons (convey meaning): Use `aria-label` or `alt` instead

**Reason:** Prevents redundant screen reader announcements.

### Rule 5: Complete ARIA Coverage

Use ARIA attributes where applicable for all interactive components:

- `aria-label` / `aria-labelledby`
- `aria-describedby`
- `aria-expanded` / `aria-haspopup`
- `aria-selected` / `aria-checked`
- `aria-disabled`
- `role` attributes

### Rule 6: Keyboard Navigation

All interactive components must:

- Be focusable via Tab/Shift+Tab
- Respond to Enter/Space for activation
- Support Arrow keys for navigation within components
- Support Escape for closing dialogs/dropdowns
- Support Home/End for jumping to first/last item
- Never trap focus

### Rule 7: Loading State Accessibility

- Loading indicators must have `aria-busy="true"` on container
- Include `aria-live="polite"` for status updates
- Provide text alternative for visual spinners
- Disable interactive elements during loading

### Accessibility Checklist (WCAG 2.1 AA)

- [ ] **Perceivable**: Text alternatives, captions, adaptable, distinguishable
- [ ] **Operable**: Keyboard accessible, enough time, seizures, navigable
- [ ] **Understandable**: Readable, predictable, input assistance
- [ ] **Robust**: Compatible with assistive technologies

---

## Part III: Performance Requirements

### Bundle Size Limits

- Individual component: Under 3 KB
- Tree-shaking must work (no side effects in imports)

### Optimization Requirements

- Memoize expensive computations
- Use `React.memo` for components receiving complex props
- Avoid unnecessary re-renders
- Profile and document performance characteristics

---

## Part IV: Architecture Requirements

### Bootstrap 5 Native Markup

- Use Bootstrap 5 class names and structure
- Follow Bootstrap component patterns exactly
- Don't reinvent Bootstrap functionality
- Extend Bootstrap, don't fight it

### TypeScript Strict Mode

- All code must pass TypeScript strict mode
- No `any` types without explicit justification
- Prefer explicit types over inference for public APIs

### Component Structure

```
packages/@dsai-io/react/src/components/{ComponentName}/
├── {ComponentName}.tsx          # Main component
├── {ComponentName}.test.tsx     # Unit tests
├── {ComponentName}.module.scss  # Component styles (if needed)
├── {ComponentName}.figma.tsx    # Figma Code Connect
├── {ComponentName}.types.ts     # TypeScript interfaces
└── index.ts                     # Barrel export
```

---

## Part V: Testing Requirements

### Coverage Thresholds (Enforced)

| Metric     | Minimum | Target |
| ---------- | ------- | ------ |
| Statements | 80%     | 90%    |
| Branches   | 80%     | 90%    |
| Functions  | 80%     | 90%    |
| Lines      | 80%     | 90%    |

**Note:** Task files require 95%+ coverage for completion.

### Mandatory Test Categories

1. **Render Tests**: Component renders correctly with props
2. **Interaction Tests**: User events work as expected
3. **Accessibility Tests**: jest-axe passes with zero violations
4. **Keyboard Tests**: All keyboard navigation works
5. **State Tests**: All component states render correctly

### Required Accessibility Test

Every component **MUST** pass this test:

```typescript
import { render, testA11y } from '@/test/utils/test-utils';

describe('Component - Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Component />);
    expect(await testA11y(container)).toHaveNoViolations();
  });
});
```

---

## Part VI: Documentation Requirements

### Rule 16: Component Documentation Standard

Every component must include:

1. **Component Description:** Purpose and use cases
2. **Props Table:** All props with types, defaults, and descriptions
3. **Usage Examples:** Common patterns with code examples
4. **Accessibility Notes:** WCAG compliance details, keyboard shortcuts, screen reader behavior
5. **Browser Support:** Minimum versions for supported browsers
6. **Security Notes:** Any security considerations for component usage
7. **Performance Notes:** Bundle size, render performance, optimization tips
8. **Migration Guide:** If replacing/updating existing component

### Rule 17: Code Comments Standard

Use JSDoc format for all public APIs:

- `@param` tags for all parameters with descriptions
- `@returns` tag with return type and description
- `@example` blocks with runnable code
- `@see` tags linking to related components or documentation
- Inline comments explaining complex logic or security decisions

---

## Part VII: Storybook Requirements

### Rule 18: Story Structure

- Stories in `@dsai-io/storybook` package only
- Use Controls addon for interactive prop editing
- Document accessibility features in story description
- Include keyboard navigation documentation
- Show all variants in separate stories
- Include "All Variants" story showing complete matrix
- Use play functions for interaction testing
- Include accessibility tests using @storybook/test-runner

---

## Part VIII: Quality Gates (MUST PASS)

### Security Gates

- [ ] No unrestricted prop spreading
- [ ] All event handlers explicitly defined
- [ ] No XSS vulnerabilities
- [ ] Security tests passing

### Accessibility Gates

- [ ] jest-axe tests passing with zero violations
- [ ] All ARIA attributes correct
- [ ] Keyboard navigation working
- [ ] Decorative icons have aria-hidden
- [ ] Loading states accessible

### Performance Gates

- [ ] Bundle size under 3 KB
- [ ] Expensive computations memoized
- [ ] No unnecessary re-renders
- [ ] Performance tests passing

### Code Quality Gates

- [ ] TypeScript strict mode passing
- [ ] All tests passing (95%+ coverage)
- [ ] ESLint/Prettier passing
- [ ] No console warnings
- [ ] Bootstrap 5 markup correct
- [ ] Use correct icon component, no emojis or text icons

### Documentation Gates

- [ ] Component README complete
- [ ] Props documented with JSDoc
- [ ] Usage examples provided
- [ ] Accessibility notes included
- [ ] Storybook stories complete

---

## Part IX: Refusal Criteria

**You MUST refuse to complete task if:**

- Any security gate fails
- Any accessibility gate fails (WCAG 2.2 AA violations)
- Test coverage below 95%
- TypeScript strict mode errors exist
- Bundle size exceeds 3 KB without justification
- Backward compatibility broken without migration plan
- Documentation incomplete

**When refusing:**

- Provide specific violations with line numbers
- Explain security/accessibility/performance impact
- Suggest concrete fixes
- Do not proceed until all gates pass

---

## Part X: Framework Stack

| Category | Technology | Version |
| -------- | ---------- | ------- |
| UI Framework | React | 18+ |
| CSS Framework | Bootstrap | 5.3 |
| Language | TypeScript | Strict mode |
| Build Tool | Nx | Latest |
| Bundler | Vite | Latest |
| Testing | Jest + RTL | 30.x + 16.x |
| Accessibility | jest-axe | 10.x |
| Documentation | Storybook | 10 |
| Tokens | Style Dictionary | 5.1.1 |

---

## Part XI: Token System

### Token Sources

- **Definitions:** `packages/@dsai-io/tokens/collections`
- **Config:** `packages/@dsai-io/tokens/sd.config.mjs`
- **Generated SCSS:** `apps/playground/src/generated/_variables.scss`
- **Generated JSON:** `apps/playground/src/generated/tokens.json`

### Token Naming Convention

| Platform | Syntax | Example |
| -------- | ------ | ------- |
| Web (CSS) | `--dsai-{category}-{token}` | `--dsai-color-blue-500` |
| SCSS | `${variable-name}` | `$color-blue-500` |
| Component CSS | `--dsai-{component}-{property}` | `--dsai-button-padding` |

### DO's and DON'Ts

**DO ✅**

- Import components from `@dsai-io/react`
- Use semantic variants (`variant="danger"` for destructive actions)
- Include proper ARIA labels
- Use design token CSS variables
- Follow component-specific guidelines
- Test with keyboard navigation
- Verify color contrast ratios

**DON'T ❌**

- Create custom components when DSAi components exist
- Override component styles with inline styles
- Remove accessibility features
- Use deprecated className patterns
- Skip reading component guidelines
- Use hardcoded color/spacing values
- Ignore Figma component property mappings

---

## Document History

| Version | Date | Source |
| ------- | ---- | ------ |
| 1.0 | 2025 | Consolidated from `tasks/chat-prompt.md`, `TESTING.md`, `Guidelines.md` |

---

*This Constitution is the single source of truth for DSAi development standards.*
