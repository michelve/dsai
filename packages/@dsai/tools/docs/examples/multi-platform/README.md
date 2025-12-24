# Multi-Platform Example

Generate tokens for web, iOS, and Android platforms.

## Structure

```text
multi-platform/
├── dsai.config.ts
├── tokens/
│   └── tokens.json
└── dist/
    ├── web/
    │   └── tokens.css
    ├── ios/
    │   └── Tokens.swift
    └── android/
        └── tokens.xml
```

## Configuration

### Configuration File

```typescript
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    sources: ['./tokens/**/*.json'],
  },
  platforms: {
    web: {
      transformGroup: 'web-css',
      buildPath: './dist/web/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
        },
        {
          destination: 'tokens.scss',
          format: 'scss/variables',
        },
      ],
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: './dist/ios/',
      files: [
        {
          destination: 'Tokens.swift',
          format: 'ios/swift',
          options: {
            className: 'DesignTokens',
          },
        },
      ],
    },
    android: {
      transformGroup: 'android-kotlin',
      buildPath: './dist/android/',
      files: [
        {
          destination: 'tokens.xml',
          format: 'android/xml',
        },
        {
          destination: 'Tokens.kt',
          format: 'android/compose',
          options: {
            packageName: 'com.example.design',
          },
        },
      ],
    },
  },
});
```

## Token File

### tokens/tokens.json

```json
{
  "color": {
    "primary": {
      "$value": "#007bff",
      "$type": "color",
      "$description": "Primary brand color"
    },
    "secondary": {
      "$value": "#6c757d",
      "$type": "color"
    },
    "background": {
      "$value": "#ffffff",
      "$type": "color"
    },
    "text": {
      "$value": "#212529",
      "$type": "color"
    }
  },
  "fontSize": {
    "sm": { "$value": "14", "$type": "fontSize" },
    "base": { "$value": "16", "$type": "fontSize" },
    "lg": { "$value": "18", "$type": "fontSize" },
    "xl": { "$value": "24", "$type": "fontSize" }
  },
  "spacing": {
    "xs": { "$value": "4", "$type": "dimension" },
    "sm": { "$value": "8", "$type": "dimension" },
    "md": { "$value": "16", "$type": "dimension" },
    "lg": { "$value": "24", "$type": "dimension" },
    "xl": { "$value": "32", "$type": "dimension" }
  },
  "borderRadius": {
    "sm": { "$value": "4", "$type": "dimension" },
    "md": { "$value": "8", "$type": "dimension" },
    "lg": { "$value": "16", "$type": "dimension" },
    "full": { "$value": "9999", "$type": "dimension" }
  }
}
```

## Output

### dist/web/tokens.css

```css
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-background: #ffffff;
  --color-text: #212529;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.5rem;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  --border-radius-full: 9999px;
}
```

### dist/ios/Tokens.swift

```swift
import UIKit

public struct DesignTokens {
    // MARK: - Colors
    public static let colorPrimary = UIColor(red: 0.00, green: 0.48, blue: 1.00, alpha: 1.0)
    public static let colorSecondary = UIColor(red: 0.42, green: 0.46, blue: 0.49, alpha: 1.0)
    public static let colorBackground = UIColor(red: 1.00, green: 1.00, blue: 1.00, alpha: 1.0)
    public static let colorText = UIColor(red: 0.13, green: 0.15, blue: 0.16, alpha: 1.0)

    // MARK: - Font Sizes
    public static let fontSizeSm: CGFloat = 14
    public static let fontSizeBase: CGFloat = 16
    public static let fontSizeLg: CGFloat = 18
    public static let fontSizeXl: CGFloat = 24

    // MARK: - Spacing
    public static let spacingXs: CGFloat = 4
    public static let spacingSm: CGFloat = 8
    public static let spacingMd: CGFloat = 16
    public static let spacingLg: CGFloat = 24
    public static let spacingXl: CGFloat = 32

    // MARK: - Border Radius
    public static let borderRadiusSm: CGFloat = 4
    public static let borderRadiusMd: CGFloat = 8
    public static let borderRadiusLg: CGFloat = 16
    public static let borderRadiusFull: CGFloat = 9999
}
```

### dist/android/tokens.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Colors -->
    <color name="color_primary">#007bff</color>
    <color name="color_secondary">#6c757d</color>
    <color name="color_background">#ffffff</color>
    <color name="color_text">#212529</color>

    <!-- Font Sizes -->
    <dimen name="font_size_sm">14sp</dimen>
    <dimen name="font_size_base">16sp</dimen>
    <dimen name="font_size_lg">18sp</dimen>
    <dimen name="font_size_xl">24sp</dimen>

    <!-- Spacing -->
    <dimen name="spacing_xs">4dp</dimen>
    <dimen name="spacing_sm">8dp</dimen>
    <dimen name="spacing_md">16dp</dimen>
    <dimen name="spacing_lg">24dp</dimen>
    <dimen name="spacing_xl">32dp</dimen>

    <!-- Border Radius -->
    <dimen name="border_radius_sm">4dp</dimen>
    <dimen name="border_radius_md">8dp</dimen>
    <dimen name="border_radius_lg">16dp</dimen>
    <dimen name="border_radius_full">9999dp</dimen>
</resources>
```

### dist/android/Tokens.kt

```kotlin
package com.example.design

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

object DesignTokens {
    // Colors
    val colorPrimary = Color(0xFF007BFF)
    val colorSecondary = Color(0xFF6C757D)
    val colorBackground = Color(0xFFFFFFFF)
    val colorText = Color(0xFF212529)

    // Font Sizes
    val fontSizeSm = 14.sp
    val fontSizeBase = 16.sp
    val fontSizeLg = 18.sp
    val fontSizeXl = 24.sp

    // Spacing
    val spacingXs = 4.dp
    val spacingSm = 8.dp
    val spacingMd = 16.dp
    val spacingLg = 24.dp
    val spacingXl = 32.dp

    // Border Radius
    val borderRadiusSm = 4.dp
    val borderRadiusMd = 8.dp
    val borderRadiusLg = 16.dp
    val borderRadiusFull = 9999.dp
}
```

## Usage

```bash
# Build all platforms
dsai tokens build

# Build specific platform
dsai tokens build --platform web
dsai tokens build --platform ios
dsai tokens build --platform android
```
