# Typography - Figma Design Guide

> **Designer's Guide to Building 1:1 Matching Figma Components**

This document provides complete specifications for creating Typography components in Figma that match the React implementation exactly. Follow this guide to ensure design-to-code parity.

---

## 📋 Overview

The Typography system consists of **3 main components** + **2 specialized variants**:

| Component      | Purpose                                | Figma Frame Name             |
| -------------- | -------------------------------------- | ---------------------------- |
| **Heading**    | Semantic headings (h1-h6)              | `DSAi/Typography/Heading`    |
| **Display**    | Large hero headings                    | `DSAi/Typography/Display`    |
| **Text**       | Body copy, paragraphs, inline variants | `DSAi/Typography/Text`       |
| **Lead**       | Specialized lead paragraph             | `DSAi/Typography/Lead`       |
| **Blockquote** | Quote with citation                    | `DSAi/Typography/Blockquote` |

---

## 🎯 Component 1: Heading

### Structure

```
Heading (Frame - Auto Layout: Horizontal)
└── Text Layer (content)
```

### Variants

Create a **Component Set** with these variant properties:

| Property        | Type    | Values                                                                                                       | Default   |
| --------------- | ------- | ------------------------------------------------------------------------------------------------------------ | --------- |
| **Level**       | Variant | `H1`, `H2`, `H3`, `H4`, `H5`, `H6`                                                                           | `H1`      |
| **Visual Size** | Variant | `Auto`, `H1`, `H2`, `H3`, `H4`, `H5`, `H6`                                                                   | `Auto`    |
| **Color**       | Variant | `Default`, `Primary`, `Secondary`, `Success`, `Danger`, `Warning`, `Info`, `Light`, `Dark`, `Muted`, `White` | `Default` |
| **Align**       | Variant | `Auto`, `Start`, `Center`, `End`                                                                             | `Auto`    |
| **Weight**      | Variant | `Auto`, `Light`, `Normal`, `Semibold`, `Bold`                                                                | `Auto`    |
| **Transform**   | Variant | `None`, `Uppercase`, `Lowercase`, `Capitalize`                                                               | `None`    |
| **Truncate**    | Boolean | `true` / `false`                                                                                             | `false`   |
| **No Margin**   | Boolean | `true` / `false`                                                                                             | `false`   |

### Typography Styles

| Level | Font Size      | Line Height | Font Weight | Figma Style Name        |
| ----- | -------------- | ----------- | ----------- | ----------------------- |
| H1    | 40px (2.5rem)  | 1.2         | 500         | `Typography/Heading/H1` |
| H2    | 32px (2rem)    | 1.2         | 500         | `Typography/Heading/H2` |
| H3    | 28px (1.75rem) | 1.2         | 500         | `Typography/Heading/H3` |
| H4    | 24px (1.5rem)  | 1.2         | 500         | `Typography/Heading/H4` |
| H5    | 20px (1.25rem) | 1.2         | 500         | `Typography/Heading/H5` |
| H6    | 16px (1rem)    | 1.2         | 500         | `Typography/Heading/H6` |

### Boolean Properties

| Property      | When TRUE                                     | When FALSE            |
| ------------- | --------------------------------------------- | --------------------- |
| **Truncate**  | Text truncates with `...` (max-width applied) | Full text visible     |
| **No Margin** | `0` margin-bottom                             | Default margin-bottom |

### Figma Implementation Tips

1. **Auto Layout**: Set to `Horizontal`, `Fill Container` width
2. **Truncate**: Use text "..." overflow and set fixed max-width
3. **Visual Size**: When `Auto`, inherit font style from Level. Otherwise override.
4. **Color Mapping**: Use color variables from your DSAi token library

---

## 🎯 Component 2: Display

### Structure

```
Display (Frame - Auto Layout: Horizontal)
└── Text Layer (content)
```

### Variants

| Property           | Type    | Values                                                                                                       | Default     |
| ------------------ | ------- | ------------------------------------------------------------------------------------------------------------ | ----------- |
| **Size**           | Variant | `Display 1`, `Display 2`, `Display 3`, `Display 4`, `Display 5`, `Display 6`                                 | `Display 1` |
| **Semantic Level** | Variant | `Auto`, `H1`, `H2`, `H3`                                                                                     | `Auto`      |
| **Color**          | Variant | `Default`, `Primary`, `Secondary`, `Success`, `Danger`, `Warning`, `Info`, `Light`, `Dark`, `Muted`, `White` | `Default`   |
| **Align**          | Variant | `Auto`, `Start`, `Center`, `End`                                                                             | `Auto`      |
| **Weight**         | Variant | `Auto`, `Light`, `Normal`, `Semibold`, `Bold`                                                                | `Auto`      |
| **Transform**      | Variant | `None`, `Uppercase`, `Lowercase`, `Capitalize`                                                               | `None`      |
| **No Margin**      | Boolean | `true` / `false`                                                                                             | `false`     |

### Typography Styles

| Size      | Font Size     | Line Height | Font Weight | Figma Style Name       |
| --------- | ------------- | ----------- | ----------- | ---------------------- |
| Display 1 | 80px (5rem)   | 1.2         | 300         | `Typography/Display/1` |
| Display 2 | 72px (4.5rem) | 1.2         | 300         | `Typography/Display/2` |
| Display 3 | 64px (4rem)   | 1.2         | 300         | `Typography/Display/3` |
| Display 4 | 56px (3.5rem) | 1.2         | 300         | `Typography/Display/4` |
| Display 5 | 48px (3rem)   | 1.2         | 300         | `Typography/Display/5` |
| Display 6 | 40px (2.5rem) | 1.2         | 300         | `Typography/Display/6` |

### Semantic Level Auto Mapping

When **Semantic Level = Auto**:
| Size | Default Semantic |
| ---------- | ---------------- |
| Display 1 | H1 |
| Display 2 | H2 |
| Display 3 | H2 |
| Display 4 | H3 |
| Display 5 | H3 |
| Display 6 | H3 |

---

## 🎯 Component 3: Text

### Structure

```
Text (Frame - Auto Layout: Vertical)
└── Text Layer (content)
```

### Variants

| Property      | Type    | Values                                                                                                                                          | Default   |
| ------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **Variant**   | Variant | `Body`, `Lead`, `Small`, `Strong`, `Emphasis`, `Mark`, `Deleted`, `Inserted`, `Code`, `Keyboard`, `Blockquote`                                  | `Body`    |
| **Size**      | Variant | `Auto`, `Small`, `Base`, `Large`                                                                                                                | `Auto`    |
| **Color**     | Variant | `Default`, `Primary`, `Secondary`, `Success`, `Danger`, `Warning`, `Info`, `Light`, `Dark`, `Muted`, `Body Secondary`, `Body Tertiary`, `White` | `Default` |
| **Align**     | Variant | `Auto`, `Start`, `Center`, `End`                                                                                                                | `Auto`    |
| **Weight**    | Variant | `Auto`, `Light`, `Normal`, `Semibold`, `Bold`                                                                                                   | `Auto`    |
| **Transform** | Variant | `None`, `Uppercase`, `Lowercase`, `Capitalize`                                                                                                  | `None`    |
| **Truncate**  | Boolean | `true` / `false`                                                                                                                                | `false`   |
| **Lines**     | Variant | `Auto`, `1`, `2`, `3`, `4` (only visible when Truncate = true)                                                                                  | `Auto`    |
| **No Margin** | Boolean | `true` / `false`                                                                                                                                | `false`   |

### Typography Styles by Variant

| Variant    | Font Size       | Line Height | Font Weight | Style             | Figma Style Name         |
| ---------- | --------------- | ----------- | ----------- | ----------------- | ------------------------ |
| Body       | 16px (1rem)     | 1.5         | 400         | Normal            | `Typography/Text/Body`   |
| Lead       | 20px (1.25rem)  | 1.5         | 300         | Normal            | `Typography/Text/Lead`   |
| Small      | 14px (0.875rem) | 1.5         | 400         | Normal            | `Typography/Text/Small`  |
| Strong     | 16px (1rem)     | 1.5         | 700         | **Bold**          | `Typography/Text/Strong` |
| Emphasis   | 16px (1rem)     | 1.5         | 400         | _Italic_          | `Typography/Text/Em`     |
| Mark       | 16px (1rem)     | 1.5         | 400         | Yellow BG         | `Typography/Text/Mark`   |
| Deleted    | 16px (1rem)     | 1.5         | 400         | ~~Strikethrough~~ | `Typography/Text/Del`    |
| Inserted   | 16px (1rem)     | 1.5         | 400         | Underline         | `Typography/Text/Ins`    |
| Code       | 14px (0.875rem) | 1.5         | 400         | Mono, Pink BG     | `Typography/Text/Code`   |
| Keyboard   | 14px (0.875rem) | 1.5         | 400         | Mono, Dark BG     | `Typography/Text/Kbd`    |
| Blockquote | 20px (1.25rem)  | 1.5         | 400         | Left border       | `Typography/Text/Quote`  |

### Size Modifier

| Size  | Font Size Multiplier |
| ----- | -------------------- |
| Small | 0.875em (14px)       |
| Base  | 1em (16px)           |
| Large | 1.25em (20px)        |

### Multi-line Truncation

When **Truncate = true** and **Lines > 1**:

- Set text to truncate after specified number of lines
- Use Figma's "Max Lines" property (or simulate with fixed height)

---

## 🎯 Component 4: Lead (Specialized)

A simpler variant of Text specifically for lead paragraphs.

### Structure

```
Lead (Frame - Auto Layout: Horizontal)
└── Text Layer (content)
```

### Variants

| Property  | Type    | Values                               | Default   |
| --------- | ------- | ------------------------------------ | --------- |
| **Color** | Variant | `Default`, `Muted`, `Body Secondary` | `Default` |
| **Align** | Variant | `Auto`, `Start`, `Center`, `End`     | `Auto`    |

### Typography Style

- **Font Size**: 20px (1.25rem)
- **Line Height**: 1.5
- **Font Weight**: 300

---

## 🎯 Component 5: Blockquote (Specialized)

### Structure

```
Blockquote (Frame - Auto Layout: Vertical)
├── Quote Text (text layer)
└── Citation (Frame - Auto Layout: Horizontal)
    ├── "—" (separator)
    └── Author Text (text layer)
```

### Variants

| Property   | Type   | Description                            |
| ---------- | ------ | -------------------------------------- |
| Text       | String | The quote content (instance swap text) |
| Author     | String | Citation author name                   |
| Source URL | String | Citation source (hidden, for code)     |

### Styling

- **Left Border**: 4px solid `$gray-300`
- **Padding Left**: 16px
- **Quote Font**: 20px, 1.5 line-height
- **Citation**: 14px, muted color, prefix with "—"

---

## 🎨 Color Token Reference

Map these Figma color variables to the `Color` property:

| Figma Property Value | Color Token            | Hex Value            |
| -------------------- | ---------------------- | -------------------- |
| Default              | `--bs-body-color`      | `#212529`            |
| Primary              | `--bs-primary`         | `#0a58ca`            |
| Secondary            | `--bs-secondary`       | `#6c757d`            |
| Success              | `--bs-success`         | `#0f5132`            |
| Danger               | `--bs-danger`          | `#842029`            |
| Warning              | `--bs-warning`         | `#664d03`            |
| Info                 | `--bs-info`            | `#055160`            |
| Light                | `--bs-light`           | `#f8f9fa`            |
| Dark                 | `--bs-dark`            | `#212529`            |
| Muted                | `--bs-secondary`       | `#6c757d`            |
| Body Secondary       | `--bs-secondary-color` | `rgba(33,37,41,.75)` |
| Body Tertiary        | `--bs-tertiary-color`  | `rgba(33,37,41,.5)`  |
| White                | `--bs-white`           | `#ffffff`            |

---

## 📐 Font Weight Reference

| Weight Property | CSS Value | Figma Weight |
| --------------- | --------- | ------------ |
| Light           | 300       | Light        |
| Normal          | 400       | Regular      |
| Semibold        | 600       | Semi Bold    |
| Bold            | 700       | Bold         |

---

## 🔤 Font Family

**Primary Font**: Inter (or system-ui fallback stack)

Ensure your Figma file uses the **Inter** font family to match the code implementation.

---

## ✅ Code Connect Property Mapping

This table shows the exact mapping between Figma properties and React props (from `Typography.figma.tsx`):

### Heading

| Figma Property | React Prop   | Type                           |
| -------------- | ------------ | ------------------------------ |
| Level          | `level`      | `1-6`                          |
| Visual Size    | `visualSize` | `'h1'-'h6'`                    |
| Color          | `color`      | `TextColor`                    |
| Align          | `align`      | `'start' \| 'center' \| 'end'` |
| Weight         | `weight`     | `FontWeight`                   |
| Transform      | `transform`  | `TextTransform`                |
| Truncate       | `truncate`   | `boolean`                      |
| No Margin      | `noMargin`   | `boolean`                      |
| Text           | `children`   | `ReactNode`                    |

### Display

| Figma Property | React Prop  | Type                           |
| -------------- | ----------- | ------------------------------ |
| Size           | `size`      | `1-6`                          |
| Semantic Level | `level`     | `1-3`                          |
| Color          | `color`     | `TextColor`                    |
| Align          | `align`     | `'start' \| 'center' \| 'end'` |
| Weight         | `weight`    | `FontWeight`                   |
| Transform      | `transform` | `TextTransform`                |
| No Margin      | `noMargin`  | `boolean`                      |
| Text           | `children`  | `ReactNode`                    |

### Text

| Figma Property | React Prop  | Type                           |
| -------------- | ----------- | ------------------------------ |
| Variant        | `variant`   | `TextVariant`                  |
| Size           | `size`      | `'sm' \| 'base' \| 'lg'`       |
| Color          | `color`     | `TextColor`                    |
| Align          | `align`     | `'start' \| 'center' \| 'end'` |
| Weight         | `weight`    | `FontWeight`                   |
| Transform      | `transform` | `TextTransform`                |
| Truncate       | `truncate`  | `boolean`                      |
| Lines          | `lines`     | `1-4`                          |
| No Margin      | `noMargin`  | `boolean`                      |
| Text           | `children`  | `ReactNode`                    |

---

## 🧩 Figma Component Checklist

### Before Publishing

- [ ] All variants created with correct property names
- [ ] Typography styles linked to design tokens
- [ ] Color styles linked to color variables
- [ ] Default variant set correctly
- [ ] Component descriptions added
- [ ] Auto layout configured properly
- [ ] Truncation behavior tested
- [ ] Text content is editable (not locked)

### Naming Convention

```
DSAi/Typography/Heading
DSAi/Typography/Display
DSAi/Typography/Text
DSAi/Typography/Lead
DSAi/Typography/Blockquote
```

---

## 📦 Variant Matrix

### Heading Total Variants

```
Level (6) × Visual Size (7) × Color (11) × Align (4) × Weight (5) × Transform (4) × Truncate (2) × No Margin (2)
= 6 × 7 × 11 × 4 × 5 × 4 × 2 × 2 = 147,840 combinations
```

> ⚠️ **Recommendation**: Use Figma's component properties instead of creating all variant permutations. Use nested booleans and dropdowns.

### Simplified Structure (Recommended)

Create **6 base variants** (one per Level), then use **Component Properties** for:

- Visual Size (dropdown)
- Color (dropdown)
- Align (dropdown)
- Weight (dropdown)
- Transform (dropdown)
- Truncate (boolean)
- No Margin (boolean)

---

## 🔗 Related Resources

- **React Component**: `packages/@dsai/react/src/components/Typography/Typography.tsx`
- **TypeScript Types**: `packages/@dsai/react/src/components/Typography/Typography.types.ts`
- **Code Connect**: `packages/@dsai/react/src/components/Typography/Typography.figma.tsx`
- **Storybook**: `http://localhost:4400/?path=/docs/foundation-typography`
- **Bootstrap Docs**: https://getbootstrap.com/docs/5.3/content/typography/

---

## 📝 Notes for Code Connect Integration

When linking your Figma components to code:

1. Replace `<FIGMA_DSAI_HEADING>` with your actual Figma component URL
2. Replace `<FIGMA_DSAI_DISPLAY>` with your actual Figma component URL
3. Replace `<FIGMA_DSAI_TEXT>` with your actual Figma component URL
4. Replace `<FIGMA_DSAI_LEAD>` with your actual Figma component URL
5. Replace `<FIGMA_DSAI_BLOCKQUOTE>` with your actual Figma component URL

The URLs follow this format:

```
https://www.figma.com/design/<FILE_KEY>/<FILE_NAME>?node-id=<NODE_ID>
```

---

_Last Updated: December 2024_
_Design System: DSAi_
_Version: 1.0.0_
