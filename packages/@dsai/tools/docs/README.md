# @DSAi/tools Documentation

> Enterprise-grade build tools for design systems

## Quick Navigation

- [Getting Started](./getting-started.md) - Quick setup guide
- [Configuration Reference](./configuration.md) - Complete config options
- [CLI Reference](./cli.md) - Command-line interface
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions

### API Reference

- [Overview](./api/README.md)
- [Configuration API](./api/config.md)
- [Tokens API](./api/tokens.md)
- [Icons API](./api/icons.md)

### Guides

- [Overview](./guides/README.md)
- [Custom Transforms](./guides/custom-transforms.md)
- [Custom Formats](./guides/custom-formats.md)
- [Multi-Brand Setup](./guides/multi-brand.md)
- [CI/CD Integration](./guides/ci-cd.md)

### Migration

- [Overview](./migration/README.md)
- [From Style Dictionary](./migration/from-style-dictionary.md)
- [From Custom Systems](./migration/from-custom.md)

## What's Included

### Token Management

Build, validate, and transform design tokens:

- **Validation** - Validate tokens against DTCG spec
- **Transformation** - Convert Figma exports to token collections
- **Building** - Generate CSS, SCSS, JS, TS, JSON outputs
- **Syncing** - Keep token files synchronized
- **Theming** - Multi-theme support with mode detection

### Icon Generation

Generate icon components from SVG files:

- **React Components** - Fully typed React components
- **Optimization** - SVGO integration for smaller files
- **Accessibility** - Built-in ARIA support
- **Figma Integration** - Code Connect mappings

### Configuration System

Flexible, type-safe configuration:

- **Multiple Formats** - JS, TS, JSON, YAML support
- **Layered Config** - Extend and override configurations
- **Environment Aware** - Development/production modes
- **Validation** - Schema validation with helpful errors

## Version Compatibility

| @DSAi/tools | Node.js | Style Dictionary |
| ----------- | ------- | ---------------- |
| 1.x         | 18+     | 4.x              |
| 2.x         | 20+     | 5.x              |

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/michelve/dsai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/michelve/dsai/discussions)
