# Bootstrap 5.0.2 Complete Token Analysis

## Overview

**Total Variables Discovered:** 849 unique SCSS variables across 1469 lines  
**Bootstrap Version:** 5.0.2 (Released 2021)  
**Dark Mode:** Not natively supported (introduced in 5.3)

## Source Files

1. **scss/\_variables.scss** - Main variables file (1469 lines, 849 unique variables)
2. **scss/\_functions.scss** - Sass helper functions (tint-color, shade-color, etc.)
3. **scss/\_mixins.scss** - Reusable mixins
4. **sample.json** - Target Figma Variables format

---

## 1. COLOR SYSTEM (119 Total Color Variables)

### Base Brand Colors (10)

| Variable  | Hex Value | RGB               | Description    |
| --------- | --------- | ----------------- | -------------- |
| `$blue`   | #0d6efd   | rgb(13, 110, 253) | Primary blue   |
| `$indigo` | #6610f2   | rgb(102, 16, 242) | Indigo         |
| `$purple` | #6f42c1   | rgb(111, 66, 193) | Purple         |
| `$pink`   | #d63384   | rgb(214, 51, 132) | Pink           |
| `$red`    | #dc3545   | rgb(220, 53, 69)  | Danger red     |
| `$orange` | #fd7e14   | rgb(253, 126, 20) | Orange         |
| `$yellow` | #ffc107   | rgb(255, 193, 7)  | Warning yellow |
| `$green`  | #198754   | rgb(25, 135, 84)  | Success green  |
| `$teal`   | #20c997   | rgb(32, 201, 151) | Teal           |
| `$cyan`   | #0dcaf0   | rgb(13, 202, 240) | Info cyan      |

### Extended Color Scales (90 Variables)

Each brand color has 9 scale variants (100-900) using tint-color() and shade-color() functions:

- **100-400**: Tints (80%, 60%, 40%, 20% lighter with white)
- **500**: Base color
- **600-900**: Shades (20%, 40%, 60%, 80% darker with black)

#### Blue Scale (9)

- `$blue-100`: tint-color($blue, 80%) = #cfe2ff (very light blue)
- `$blue-200`: tint-color($blue, 60%) = #9ec5fe (light blue)
- `$blue-300`: tint-color($blue, 40%) = #6ea8fe (medium-light blue)
- `$blue-400`: tint-color($blue, 20%) = #3d8bfd (light blue)
- `$blue-500`: $blue = #0d6efd (base blue)
- `$blue-600`: shade-color($blue, 20%) = #0a58ca (dark blue)
- `$blue-700`: shade-color($blue, 40%) = #084298 (darker blue)
- `$blue-800`: shade-color($blue, 60%) = #052c65 (very dark blue)
- `$blue-900`: shade-color($blue, 80%) = #031633 (darkest blue)

#### Indigo Scale (9)

- `$indigo-100`: tint-color($indigo, 80%) = #e0cffc (very light indigo)
- `$indigo-200`: tint-color($indigo, 60%) = #c29ffa (light indigo)
- `$indigo-300`: tint-color($indigo, 40%) = #a370f7 (medium-light indigo)
- `$indigo-400`: tint-color($indigo, 20%) = #8540f5 (light indigo)
- `$indigo-500`: $indigo = #6610f2 (base indigo)
- `$indigo-600`: shade-color($indigo, 20%) = #520dc2 (dark indigo)
- `$indigo-700`: shade-color($indigo, 40%) = #3d0a91 (darker indigo)
- `$indigo-800`: shade-color($indigo, 60%) = #290661 (very dark indigo)
- `$indigo-900`: shade-color($indigo, 80%) = #140330 (darkest indigo)

#### Purple Scale (9)

- `$purple-100`: tint-color($purple, 80%) = #e2d9f3 (very light purple)
- `$purple-200`: tint-color($purple, 60%) = #c5b3e6 (light purple)
- `$purple-300`: tint-color($purple, 40%) = #a98eda (medium-light purple)
- `$purple-400`: tint-color($purple, 20%) = #8c68cd (light purple)
- `$purple-500`: $purple = #6f42c1 (base purple)
- `$purple-600`: shade-color($purple, 20%) = #59359a (dark purple)
- `$purple-700`: shade-color($purple, 40%) = #432874 (darker purple)
- `$purple-800`: shade-color($purple, 60%) = #2c1a4d (very dark purple)
- `$purple-900`: shade-color($purple, 80%) = #160d27 (darkest purple)

#### Pink Scale (9)

- `$pink-100`: tint-color($pink, 80%) = #f7d6e6 (very light pink)
- `$pink-200`: tint-color($pink, 60%) = #efadce (light pink)
- `$pink-300`: tint-color($pink, 40%) = #e685b5 (medium-light pink)
- `$pink-400`: tint-color($pink, 20%) = #de5c9d (light pink)
- `$pink-500`: $pink = #d63384 (base pink)
- `$pink-600`: shade-color($pink, 20%) = #ab296a (dark pink)
- `$pink-700`: shade-color($pink, 40%) = #801f4f (darker pink)
- `$pink-800`: shade-color($pink, 60%) = #561435 (very dark pink)
- `$pink-900`: shade-color($pink, 80%) = #2b0a1a (darkest pink)

#### Red Scale (9)

- `$red-100`: tint-color($red, 80%) = #f8d7da (very light red)
- `$red-200`: tint-color($red, 60%) = #f1aeb5 (light red)
- `$red-300`: tint-color($red, 40%) = #ea868f (medium-light red)
- `$red-400`: tint-color($red, 20%) = #e35d6a (light red)
- `$red-500`: $red = #dc3545 (base red)
- `$red-600`: shade-color($red, 20%) = #b02a37 (dark red)
- `$red-700`: shade-color($red, 40%) = #842029 (darker red)
- `$red-800`: shade-color($red, 60%) = #58151c (very dark red)
- `$red-900`: shade-color($red, 80%) = #2c0b0e (darkest red)

#### Orange Scale (9)

- `$orange-100`: tint-color($orange, 80%) = #ffe5d0 (very light orange)
- `$orange-200`: tint-color($orange, 60%) = #fecba1 (light orange)
- `$orange-300`: tint-color($orange, 40%) = #feb272 (medium-light orange)
- `$orange-400`: tint-color($orange, 20%) = #fd9843 (light orange)
- `$orange-500`: $orange = #fd7e14 (base orange)
- `$orange-600`: shade-color($orange, 20%) = #ca6510 (dark orange)
- `$orange-700`: shade-color($orange, 40%) = #984c0c (darker orange)
- `$orange-800`: shade-color($orange, 60%) = #653208 (very dark orange)
- `$orange-900`: shade-color($orange, 80%) = #331904 (darkest orange)

#### Yellow Scale (9)

- `$yellow-100`: tint-color($yellow, 80%) = #fff3cd (very light yellow)
- `$yellow-200`: tint-color($yellow, 60%) = #ffe69c (light yellow)
- `$yellow-300`: tint-color($yellow, 40%) = #ffda6a (medium-light yellow)
- `$yellow-400`: tint-color($yellow, 20%) = #ffcd39 (light yellow)
- `$yellow-500`: $yellow = #ffc107 (base yellow)
- `$yellow-600`: shade-color($yellow, 20%) = #cc9a06 (dark yellow)
- `$yellow-700`: shade-color($yellow, 40%) = #997404 (darker yellow)
- `$yellow-800`: shade-color($yellow, 60%) = #664d03 (very dark yellow)
- `$yellow-900`: shade-color($yellow, 80%) = #332701 (darkest yellow)

#### Green Scale (9)

- `$green-100`: tint-color($green, 80%) = #d1e7dd (very light green)
- `$green-200`: tint-color($green, 60%) = #a3cfbb (light green)
- `$green-300`: tint-color($green, 40%) = #75b798 (medium-light green)
- `$green-400`: tint-color($green, 20%) = #479f76 (light green)
- `$green-500`: $green = #198754 (base green)
- `$green-600`: shade-color($green, 20%) = #146c43 (dark green)
- `$green-700`: shade-color($green, 40%) = #0f5132 (darker green)
- `$green-800`: shade-color($green, 60%) = #0a3622 (very dark green)
- `$green-900`: shade-color($green, 80%) = #051b11 (darkest green)

#### Teal Scale (9)

- `$teal-100`: tint-color($teal, 80%) = #d2f4ea (very light teal)
- `$teal-200`: tint-color($teal, 60%) = #a6e9d5 (light teal)
- `$teal-300`: tint-color($teal, 40%) = #79dfc1 (medium-light teal)
- `$teal-400`: tint-color($teal, 20%) = #4dd4ac (light teal)
- `$teal-500`: $teal = #20c997 (base teal)
- `$teal-600`: shade-color($teal, 20%) = #1aa179 (dark teal)
- `$teal-700`: shade-color($teal, 40%) = #13795b (darker teal)
- `$teal-800`: shade-color($teal, 60%) = #0d503c (very dark teal)
- `$teal-900`: shade-color($teal, 80%) = #06281e (darkest teal)

#### Cyan Scale (9)

- `$cyan-100`: tint-color($cyan, 80%) = #cff4fc (very light cyan)
- `$cyan-200`: tint-color($cyan, 60%) = #9eeaf9 (light cyan)
- `$cyan-300`: tint-color($cyan, 40%) = #6edff6 (medium-light cyan)
- `$cyan-400`: tint-color($cyan, 20%) = #3dd5f3 (light cyan)
- `$cyan-500`: $cyan = #0dcaf0 (base cyan)
- `$cyan-600`: shade-color($cyan, 20%) = #0aa2c0 (dark cyan)
- `$cyan-700`: shade-color($cyan, 40%) = #087990 (darker cyan)
- `$cyan-800`: shade-color($cyan, 60%) = #055160 (very dark cyan)
- `$cyan-900`: shade-color($cyan, 80%) = #032830 (darkest cyan)

### Neutral/Grayscale Colors (11)

| Variable    | Hex Value | Description       |
| ----------- | --------- | ----------------- |
| `$white`    | #ffffff   | Pure white        |
| `$gray-100` | #f8f9fa   | Lightest gray     |
| `$gray-200` | #e9ecef   | Very light gray   |
| `$gray-300` | #dee2e6   | Light gray        |
| `$gray-400` | #ced4da   | Medium-light gray |
| `$gray-500` | #adb5bd   | Medium gray       |
| `$gray-600` | #6c757d   | Medium-dark gray  |
| `$gray-700` | #495057   | Dark gray         |
| `$gray-800` | #343a40   | Very dark gray    |
| `$gray-900` | #212529   | Darkest gray      |
| `$black`    | #000000   | Pure black        |

### Theme/Semantic Colors (8)

| Variable     | Value               | Description          |
| ------------ | ------------------- | -------------------- |
| `$primary`   | $blue (#0d6efd)     | Primary action color |
| `$secondary` | $gray-600 (#6c757d) | Secondary color      |
| `$success`   | $green (#198754)    | Success state        |
| `$info`      | $cyan (#0dcaf0)     | Info state           |
| `$warning`   | $yellow (#ffc107)   | Warning state        |
| `$danger`    | $red (#dc3545)      | Danger/error state   |
| `$light`     | $gray-100 (#f8f9fa) | Light variant        |
| `$dark`      | $gray-900 (#212529) | Dark variant         |

- `--bs-dark`: #212529

#### RGB Variants (8)

- `--bs-primary-rgb`: 13, 110, 253
- `--bs-secondary-rgb`: 108, 117, 125
- `--bs-success-rgb`: 25, 135, 84
- `--bs-info-rgb`: 13, 202, 240
- `--bs-warning-rgb`: 255, 193, 7
- `--bs-danger-rgb`: 220, 53, 69
- `--bs-light-rgb`: 248, 249, 250
- `--bs-dark-rgb`: 33, 37, 41

#### Text Emphasis Colors - Light Mode (8)

- `--bs-primary-text-emphasis`: #052c65
- `--bs-secondary-text-emphasis`: #2b2f32
- `--bs-success-text-emphasis`: #0a3622
- `--bs-info-text-emphasis`: #055160
- `--bs-warning-text-emphasis`: #664d03
- `--bs-danger-text-emphasis`: #58151c
- `--bs-light-text-emphasis`: #495057
- `--bs-dark-text-emphasis`: #495057

#### Text Emphasis Colors - Dark Mode (8)

- `--bs-primary-text-emphasis`: #6ea8fe
- `--bs-secondary-text-emphasis`: #a7acb1
- `--bs-success-text-emphasis`: #75b798
- `--bs-info-text-emphasis`: #6edff6
- `--bs-warning-text-emphasis`: #ffda6a
- `--bs-danger-text-emphasis`: #ea868f
- `--bs-light-text-emphasis`: #f8f9fa
- `--bs-dark-text-emphasis`: #dee2e6

#### Background Subtle Colors - Light Mode (8)

- `--bs-primary-bg-subtle`: #cfe2ff
- `--bs-secondary-bg-subtle`: #e2e3e5
- `--bs-success-bg-subtle`: #d1e7dd
- `--bs-info-bg-subtle`: #cff4fc
- `--bs-warning-bg-subtle`: #fff3cd
- `--bs-danger-bg-subtle`: #f8d7da
- `--bs-light-bg-subtle`: #fcfcfd
- `--bs-dark-bg-subtle`: #ced4da

#### Background Subtle Colors - Dark Mode (8)

- `--bs-primary-bg-subtle`: #031633
- `--bs-secondary-bg-subtle`: #161719
- `--bs-success-bg-subtle`: #051b11
- `--bs-info-bg-subtle`: #032830
- `--bs-warning-bg-subtle`: #332701
- `--bs-danger-bg-subtle`: #2c0b0e
- `--bs-light-bg-subtle`: #343a40
- `--bs-dark-bg-subtle`: #1a1d20

#### Border Subtle Colors - Light Mode (8)

- `--bs-primary-border-subtle`: #9ec5fe
- `--bs-secondary-border-subtle`: #c4c8cb
- `--bs-success-border-subtle`: #a3cfbb
- `--bs-info-border-subtle`: #9eeaf9
- `--bs-warning-border-subtle`: #ffe69c
- `--bs-danger-border-subtle`: #f1aeb5
- `--bs-light-border-subtle`: #e9ecef
- `--bs-dark-border-subtle`: #adb5bd

#### Border Subtle Colors - Dark Mode (8)

- `--bs-primary-border-subtle`: #084298
- `--bs-secondary-border-subtle`: #41464b
- `--bs-success-border-subtle`: #0f5132
- `--bs-info-border-subtle`: #087990
- `--bs-warning-border-subtle`: #997404
- `--bs-danger-border-subtle`: #842029
- `--bs-light-border-subtle`: #495057
- `--bs-dark-border-subtle`: #343a40

#### Semantic Colors - Light Mode (13)

- `--bs-body-color`: #212529
- `--bs-body-bg`: #fff
- `--bs-emphasis-color`: #000
- `--bs-secondary-color`: rgba(33, 37, 41, 0.75)
- `--bs-secondary-bg`: #e9ecef
- `--bs-tertiary-color`: rgba(33, 37, 41, 0.5)
- `--bs-tertiary-bg`: #f8f9fa
- `--bs-heading-color`: inherit
- `--bs-link-color`: #0d6efd
- `--bs-link-hover-color`: #0a58ca
- `--bs-code-color`: #d63384
- `--bs-highlight-color`: #212529
- `--bs-highlight-bg`: #fff3cd

#### Semantic Colors - Dark Mode (13)

- `--bs-body-color`: #dee2e6
- `--bs-body-bg`: #212529
- `--bs-emphasis-color`: #fff
- `--bs-secondary-color`: rgba(222, 226, 230, 0.75)
- `--bs-secondary-bg`: #343a40
- `--bs-tertiary-color`: rgba(222, 226, 230, 0.5)
- `--bs-tertiary-bg`: #2b3035
- `--bs-heading-color`: inherit
- `--bs-link-color`: #6ea8fe
- `--bs-link-hover-color`: #8bb9fe
- `--bs-code-color`: #e685b5
- `--bs-highlight-color`: #dee2e6
- `--bs-highlight-bg`: #664d03

## 2. TYPOGRAPHY SYSTEM (50+ Typography Variables)

### Font Families (4)

| Variable                  | Value                                                                                                                                                                                           | Description             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `$font-family-sans-serif` | system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" | Native font stack       |
| `$font-family-monospace`  | SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace                                                                                                            | Monospace font stack    |
| `$font-family-base`       | var(--bs-font-sans-serif)                                                                                                                                                                       | Base font for body text |
| `$font-family-code`       | var(--bs-font-monospace)                                                                                                                                                                        | Font for code elements  |

### Font Sizes (9 Variables)

#### Base Font Sizes (3)

| Variable          | Value                   | Computed        | Description                   |
| ----------------- | ----------------------- | --------------- | ----------------------------- |
| `$font-size-root` | null                    | 16px            | Browser default (affects rem) |
| `$font-size-base` | 1rem                    | 16px            | Body text base size           |
| `$font-size-sm`   | $font-size-base \* .875 | 0.875rem (14px) | Small text                    |
| `$font-size-lg`   | $font-size-base \* 1.25 | 1.25rem (20px)  | Large text                    |

#### Heading Font Sizes (6)

| Variable        | Value                   | Computed | Rendered Size |
| --------------- | ----------------------- | -------- | ------------- |
| `$h1-font-size` | $font-size-base \* 2.5  | 2.5rem   | 40px          |
| `$h2-font-size` | $font-size-base \* 2    | 2rem     | 32px          |
| `$h3-font-size` | $font-size-base \* 1.75 | 1.75rem  | 28px          |
| `$h4-font-size` | $font-size-base \* 1.5  | 1.5rem   | 24px          |
| `$h5-font-size` | $font-size-base \* 1.25 | 1.25rem  | 20px          |
| `$h6-font-size` | $font-size-base         | 1rem     | 16px          |

**Font Size Map:**

```scss
$font-sizes: (
  1: $h1-font-size,
  // 2.5rem (40px)
  2: $h2-font-size,
  // 2rem (32px)
  3: $h3-font-size,
  // 1.75rem (28px)
  4: $h4-font-size,
  // 1.5rem (24px)
  5: $h5-font-size,
  // 1.25rem (20px)
  6: $h6-font-size, // 1rem (16px)
);
```

### Heading Properties (6)

| Variable                  | Value         | Description                      |
| ------------------------- | ------------- | -------------------------------- |
| `$headings-margin-bottom` | $spacer \* .5 | 0.5rem (8px) - bottom margin     |
| `$headings-font-family`   | null          | Inherits from body               |
| `$headings-font-style`    | null          | Normal style                     |
| `$headings-font-weight`   | 500           | Medium weight for all headings   |
| `$headings-line-height`   | 1.2           | Tighter line height for headings |
| `$headings-color`         | null          | Inherits from body text color    |

### Display Headings (8 Variables)

Display headings are larger, more opinionated heading styles for standout titles.

#### Display Font Sizes (6)

| Variable  | Value  | Size | Description        |
| --------- | ------ | ---- | ------------------ |
| Display 1 | 5rem   | 80px | Largest display    |
| Display 2 | 4.5rem | 72px | Very large display |
| Display 3 | 4rem   | 64px | Large display      |
| Display 4 | 3.5rem | 56px | Medium display     |
| Display 5 | 3rem   | 48px | Small display      |
| Display 6 | 2.5rem | 40px | Smallest display   |

**Display Font Sizes Map:**

```scss
$display-font-sizes: (
  1: 5rem,
  // 80px
  2: 4.5rem,
  // 72px
  3: 4rem,
  // 64px
  4: 3.5rem,
  // 56px
  5: 3rem,
  // 48px
  6: 2.5rem, // 40px
);
```

#### Display Properties (2)

| Variable               | Value                       | Description                                |
| ---------------------- | --------------------------- | ------------------------------------------ |
| `$display-font-weight` | 300                         | Light weight for display headings          |
| `$display-line-height` | $headings-line-height (1.2) | Same tight line height as regular headings |

### Font Weights (7)

| Variable               | Value               | CSS Value | Description               |
| ---------------------- | ------------------- | --------- | ------------------------- |
| `$font-weight-lighter` | lighter             | 100-300   | Relative lighter weight   |
| `$font-weight-light`   | 300                 | 300       | Light weight              |
| `$font-weight-normal`  | 400                 | 400       | Normal/regular weight     |
| `$font-weight-bold`    | 700                 | 700       | Bold weight               |
| `$font-weight-bolder`  | bolder              | 700-900   | Relative bolder weight    |
| `$font-weight-base`    | $font-weight-normal | 400       | Base weight for body text |

### Line Heights (3)

| Variable            | Value | Description                    |
| ------------------- | ----- | ------------------------------ |
| `$line-height-base` | 1.5   | Base line height for body text |
| `$line-height-sm`   | 1.25  | Compact line height            |
| `$line-height-lg`   | 2     | Relaxed line height            |

### Typography Elements (13 Variables)

#### Lead Paragraph (2)

| Variable            | Value                   | Computed       | Description                     |
| ------------------- | ----------------------- | -------------- | ------------------------------- |
| `$lead-font-size`   | $font-size-base \* 1.25 | 1.25rem (20px) | Larger font for lead paragraphs |
| `$lead-font-weight` | 300                     | 300            | Light weight for emphasis       |

#### Small Text (1)

| Variable           | Value  | Description                                |
| ------------------ | ------ | ------------------------------------------ |
| `$small-font-size` | .875em | 87.5% of parent font size (14px typically) |

#### Subscript/Superscript (1)

| Variable             | Value | Description                    |
| -------------------- | ----- | ------------------------------ |
| `$sub-sup-font-size` | .75em | 75% of parent size for sub/sup |

#### Text Muted (1)

| Variable      | Value     | Computed | Description      |
| ------------- | --------- | -------- | ---------------- |
| `$text-muted` | $gray-600 | #6c757d  | Muted text color |

#### Abbreviations/Initialism (1)

| Variable                | Value            | Description                  |
| ----------------------- | ---------------- | ---------------------------- |
| `$initialism-font-size` | $small-font-size | Small caps abbreviation size |

#### Blockquotes (4)

| Variable                       | Value                   | Computed       | Description           |
| ------------------------------ | ----------------------- | -------------- | --------------------- |
| `$blockquote-margin-y`         | $spacer                 | 1rem (16px)    | Vertical margin       |
| `$blockquote-font-size`        | $font-size-base \* 1.25 | 1.25rem (20px) | Larger quote text     |
| `$blockquote-footer-color`     | $gray-600               | #6c757d        | Footer/citation color |
| `$blockquote-footer-font-size` | $small-font-size        | .875em         | Smaller footer text   |

#### Horizontal Rule (3)

| Variable       | Value   | Description           |
| -------------- | ------- | --------------------- |
| `$hr-margin-y` | $spacer | 1rem (16px) vertical  |
| `$hr-color`    | inherit | Inherits text color   |
| `$hr-opacity`  | .25     | 25% opacity separator |

#### Mark/Highlight (1)

| Variable        | Value   | Computed | Description                 |
| --------------- | ------- | -------- | --------------------------- |
| `$mark-bg`      | #fcf8e3 | #fcf8e3  | Yellow highlight background |
| `$mark-padding` | .2em    | .2em     | Padding around marked text  |

#### Other Typography Elements (4)

| Variable                  | Value                   | Description                    |
| ------------------------- | ----------------------- | ------------------------------ |
| `$legend-margin-bottom`   | .5rem                   | Form legend bottom margin      |
| `$legend-font-size`       | 1.5rem                  | Form legend size               |
| `$legend-font-weight`     | null                    | Inherits weight                |
| `$dt-font-weight`         | $font-weight-bold (700) | Definition term weight         |
| `$list-inline-padding`    | .5rem                   | Inline list item padding       |
| `$nested-kbd-font-weight` | $font-weight-bold (700) | Nested keyboard element weight |

### 3. SPACING TOKENS (6)

- 0: 0
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 1rem (16px)
- 4: 1.5rem (24px)
- 5: 3rem (48px)

### 4. BORDER TOKENS

#### Border Widths (4)

- `--bs-border-width`: 1px
- Border width sm: 0.5px
- Border width lg: 2px

#### Border Colors (2 + Dark Mode variants)

- `--bs-border-color`: #dee2e6 (Light) / #495057 (Dark)
- `--bs-border-color-translucent`: rgba(0, 0, 0, 0.175) (Light) / rgba(255, 255, 255, 0.15) (Dark)

#### Border Radius (7)

- `--bs-border-radius`: 0.375rem (6px)
- `--bs-border-radius-sm`: 0.25rem (4px)
- `--bs-border-radius-lg`: 0.5rem (8px)
- `--bs-border-radius-xl`: 1rem (16px)
- `--bs-border-radius-xxl`: 2rem (32px)
- `--bs-border-radius-pill`: 50rem (9999px)
- none: 0

### 5. SHADOW TOKENS (5)

- `--bs-box-shadow`: 0 0.5rem 1rem rgba(0, 0, 0, 0.15)
- `--bs-box-shadow-sm`: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)
- `--bs-box-shadow-lg`: 0 1rem 3rem rgba(0, 0, 0, 0.175)
- `--bs-box-shadow-inset`: inset 0 1px 2px rgba(0, 0, 0, 0.075)
- none: none

### 6. FOCUS RING TOKENS (4)

- `--bs-focus-ring-width`: 0.25rem
- `--bs-focus-ring-opacity`: 0.25
- `--bs-focus-ring-color`: rgba(13, 110, 253, 0.25)
- blur: 0

### 7. FORM VALIDATION TOKENS

#### Light Mode (4)

- `--bs-form-valid-color`: #198754
- `--bs-form-valid-border-color`: #198754
- `--bs-form-invalid-color`: #dc3545
- `--bs-form-invalid-border-color`: #dc3545

#### Dark Mode (4)

- `--bs-form-valid-color`: #75b798
- `--bs-form-valid-border-color`: #75b798
- `--bs-form-invalid-color`: #ea868f
- `--bs-form-invalid-border-color`: #ea868f

### 8. BREAKPOINTS (6)

- xs: 0
- sm: 576px
- md: 768px
- lg: 992px
- xl: 1200px
- xxl: 1400px

### 9. GRID TOKENS (2)

- columns: 12
- gutter-width: 1.5rem (24px)

### 10. CONTAINER MAX-WIDTHS (5)

- sm: 540px
- md: 720px
- lg: 960px
- xl: 1140px
- xxl: 1320px

## Total Token Count

- **Light Mode**: ~140 unique tokens
- **Dark Mode**: ~140 tokens (with ~50 semantic overrides)
- **Total Variables**: ~190 unique CSS variables

## Dark Mode Overrides (41 variables)

Only these variables change in Dark Mode:

1. Body/Text colors (13)
2. Text emphasis colors (8)
3. Background subtle colors (8)
4. Border subtle colors (8)
5. Form validation colors (4)
