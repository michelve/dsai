# CLI Reference

Complete reference for @DSAi/tools CLI commands.

## Installation

The CLI is included with the `@dsai/tools` package:

```bash
npm install @dsai/tools
```

Run commands with `npx dsai` or add scripts to your `package.json`.

## Global Options

These options work with all commands:

| Option            | Alias | Description         |
| ----------------- | ----- | ------------------- |
| `--config <path>` | `-c`  | Path to config file |
| `--cwd <dir>`     |       | Working directory   |
| `--debug`         |       | Enable debug output |
| `--quiet`         | `-q`  | Minimal output      |
| `--dry-run`       |       | Don't write files   |
| `--help`          | `-h`  | Show help           |
| `--version`       | `-v`  | Show version        |

## Commands

### `dsai init`

Initialize configuration in the current directory.

```bash
dsai init [options]
```

**Options:**

| Option              | Description                                 |
| ------------------- | ------------------------------------------- |
| `--yes`, `-y`       | Skip prompts, use defaults                  |
| `--template <name>` | Config template (minimal, full, enterprise) |

**Examples:**

```bash
# Interactive setup
dsai init

# Quick setup with defaults
dsai init --yes

# Enterprise template
dsai init --template enterprise
```

---

### `dsai tokens build`

Build design tokens from source files.

```bash
dsai tokens build [options]
```

**Options:**

| Option               | Description                             |
| -------------------- | --------------------------------------- |
| `--platforms <list>` | Comma-separated platforms (css,js,scss) |
| `--watch`, `-w`      | Watch mode                              |
| `--clean`            | Clean output before build               |

**Examples:**

```bash
# Build all platforms
dsai tokens build

# Build specific platforms
dsai tokens build --platforms css,js

# Watch mode
dsai tokens build --watch

# Clean build
dsai tokens build --clean
```

---

### `dsai tokens validate`

Validate token files for errors and warnings.

```bash
dsai tokens validate [options]
```

**Options:**

| Option     | Description            |
| ---------- | ---------------------- |
| `--fix`    | Attempt to fix issues  |
| `--strict` | Strict validation mode |

**Examples:**

```bash
# Validate
dsai tokens validate

# Validate and fix
dsai tokens validate --fix

# Strict mode
dsai tokens validate --strict
```

---

### `dsai tokens sync`

Sync tokens flat file for IDE autocomplete.

```bash
dsai tokens sync [options]
```

**Options:**

| Option              | Description                  |
| ------------------- | ---------------------------- |
| `--format <format>` | Output format (flat, nested) |

**Examples:**

```bash
# Sync with default format
dsai tokens sync

# Sync as nested
dsai tokens sync --format nested
```

---

### `dsai tokens postprocess`

Post-process CSS theme files.

```bash
dsai tokens postprocess [options]
```

Replaces Bootstrap theme attributes with DSAi theme attributes in generated CSS files.

**Examples:**

```bash
# Post-process CSS files
dsai tokens postprocess
```

---

### `dsai icons build`

Generate icon components from SVG files.

```bash
dsai icons build [options]
```

**Options:**

| Option              | Description                            |
| ------------------- | -------------------------------------- |
| `--format <format>` | Output format (react, vue, svg-sprite) |
| `--watch`, `-w`     | Watch mode                             |
| `--no-optimize`     | Skip SVGO optimization                 |

**Examples:**

```bash
# Build React icons
dsai icons build --format react

# Build Vue icons
dsai icons build --format vue

# Build SVG sprite
dsai icons build --format svg-sprite

# Watch mode
dsai icons build --watch
```

---

### `dsai config`

Display resolved configuration.

```bash
dsai config [options]
```

**Options:**

| Option   | Description    |
| -------- | -------------- |
| `--json` | Output as JSON |

**Examples:**

```bash
# Show config
dsai config

# Output as JSON
dsai config --json
```

## Exit Codes

| Code | Meaning             |
| ---- | ------------------- |
| 0    | Success             |
| 1    | General error       |
| 2    | Configuration error |
| 3    | Validation error    |
| 4    | Build error         |
| 5    | I/O error           |

## Scripting Examples

### CI/CD Pipeline

```bash
#!/bin/bash
set -e

# Validate first
dsai tokens validate --strict || exit 1

# Build tokens
dsai tokens build --quiet

# Build icons
dsai icons build --format react --quiet

echo "Build complete!"
```

### Package.json Scripts

```json
{
  "scripts": {
    "tokens:build": "dsai tokens build",
    "tokens:validate": "dsai tokens validate",
    "tokens:watch": "dsai tokens build --watch",
    "icons:build": "dsai icons build --format react",
    "build": "npm run tokens:build && npm run icons:build",
    "prebuild": "dsai tokens validate"
  }
}
```

## Environment Variables

| Variable                    | Description                       |
| --------------------------- | --------------------------------- |
| `DSAI_CONFIG`               | Path to config file               |
| `DSAI_DEBUG`                | Enable debug mode (`1` or `true`) |
| `DSAI_PREFIX`               | CSS variable prefix               |
| `DSAI_OUTPUT_DIR`           | Output directory                  |
| `DSAI_SOURCE_DIR`           | Source directory                  |
| `DSAI_THEME_DEFAULT`        | Default theme name                |
| `DSAI_ADDITIONAL_SCSS_DIRS` | Comma-separated SCSS directories  |
| `DSAI_ADDITIONAL_CSS_DIRS`  | Comma-separated CSS directories   |
| `DSAI_CREATE_BUNDLE`        | Create bundle files               |
| `NO_COLOR`                  | Disable colored output            |
| `FORCE_COLOR`               | Force colored output              |

## Config Resolution Order

Configuration is resolved in layers (later overrides earlier):

1. **Defaults** - Built-in defaults
2. **Extends** - Extended configuration files
3. **File** - Your `dsai.config.mjs`
4. **Environment** - Environment variables
5. **CLI** - Command line flags
