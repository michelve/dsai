# Accessibility — Code Examples

This project requires WCAG 2.1 AA compliance. Semantic HTML is the foundation.

## S6819 — Semantic HTML over ARIA roles

See `references/react.md` for the full element mapping table.

## S6840 — ARIA properties must have valid values

```typescript
// BAD
<div aria-hidden="yes">...</div>
<input aria-required="maybe" />

// GOOD
<div aria-hidden="true">...</div>
<input aria-required="true" />
```

## S6841 — ARIA roles must be valid and non-abstract

```typescript
// BAD — abstract role
<div role="widget">...</div>
<div role="roletype">...</div>

// GOOD — concrete role
<div role="slider">...</div>
<div role="tabpanel">...</div>
```

## S6842 — Elements with ARIA roles must have required properties

```typescript
// BAD — checkbox requires aria-checked
<div role="checkbox">Option</div>

// GOOD
<div role="checkbox" aria-checked="false">Option</div>
// Or better: use native HTML
<input type="checkbox" />
```

## S6825 — Images must have alt text

```typescript
// BAD
<img src="logo.png" />

// GOOD — descriptive alt
<img src="logo.png" alt="DSAi company logo" />

// GOOD — decorative image (empty alt)
<img src="divider.png" alt="" />
```

## S6826 — Non-redundant alt text

```typescript
// BAD — redundant with context
<img src="photo.jpg" alt="image of photo" />
<img src="icon.svg" alt="icon" />

// GOOD
<img src="photo.jpg" alt="Team meeting in conference room" />
<img src="icon.svg" alt="Settings" />
```

## S6827 — Anchors should contain accessible content

```typescript
// BAD — empty or non-descriptive
<a href="/settings"></a>
<a href="/settings"><div /></a>

// GOOD
<a href="/settings">Settings</a>
<a href="/settings" aria-label="Settings"><SettingsIcon /></a>
```

## S6829 — Headings should have accessible content

```typescript
// BAD
<h2></h2>
<h2><span /></h2>

// GOOD
<h2>Dashboard Overview</h2>
<h2><span>Dashboard Overview</span></h2>
```

## S6833 — Tables should have headers

```typescript
// BAD
<table>
  <tr><td>Name</td><td>Age</td></tr>
</table>

// GOOD
<table>
  <thead>
    <tr><th>Name</th><th>Age</th></tr>
  </thead>
  <tbody>
    <tr><td>Alice</td><td>30</td></tr>
  </tbody>
</table>
```

## S6834 — Table cells should reference headers

```typescript
// GOOD — for complex tables with merged cells
<table>
  <tr>
    <th id="name">Name</th>
    <th id="age">Age</th>
  </tr>
  <tr>
    <td headers="name">Alice</td>
    <td headers="age">30</td>
  </tr>
</table>
```

## S6844 — tabIndex 0 or -1 only

```typescript
// BAD — positive values disrupt tab order
<div tabIndex={3}>...</div>

// GOOD
<div tabIndex={0}>...</div>   // natural tab order
<div tabIndex={-1}>...</div>  // programmatic focus only
```

## S6855 — No aria-hidden on focusable elements

```typescript
// BAD
<button aria-hidden="true">Hidden button</button>
<a href="/page" aria-hidden="true">Hidden link</a>

// GOOD — remove focusability or aria-hidden
<button aria-hidden="true" tabIndex={-1}>Hidden button</button>
// Or remove aria-hidden if it should be accessible
<button>Visible button</button>
```

## S6859 — Labels must have text and associated control

```typescript
// BAD
<label><input type="text" /></label>
<label htmlFor="name"></label>

// GOOD
<label htmlFor="name">Full Name</label>
<input id="name" type="text" />

// Or wrapping with visible text
<label>
  Full Name
  <input type="text" />
</label>
```

## S6860 — Mouse events need keyboard equivalents

```typescript
// BAD — mouse only
<div onMouseDown={handleStart} onMouseUp={handleEnd}>
  Drag me
</div>

// GOOD — add keyboard support
<div
  onMouseDown={handleStart}
  onMouseUp={handleEnd}
  onKeyDown={(e) => { if (e.key === 'Enter') handleStart(); }}
  onKeyUp={(e) => { if (e.key === 'Enter') handleEnd(); }}
  tabIndex={0}
  role="button"
>
  Drag me
</div>
```

## S6848 / S6849 — Interactive/non-interactive role mismatch

```typescript
// BAD — button is interactive, given non-interactive role
<button role="presentation">Click</button>

// BAD — div is non-interactive, given interactive role
<div role="button" onClick={handleClick}>Click</div>

// GOOD
<button onClick={handleClick}>Click</button>
```

## S1827 — No accesskey property

```typescript
// BAD — accesskeys conflict across browsers/assistive tech
<button accessKey="s">Save</button>

// GOOD — use visible keyboard shortcuts with aria-keyshortcuts
<button aria-keyshortcuts="Control+S">Save (Ctrl+S)</button>
```

## S6863 — iFrames must have title

```typescript
// BAD
<iframe src="https://example.com" />

// GOOD
<iframe src="https://example.com" title="External content preview" />
```
