# Migration Guides

Guides for migrating to `@dsai-io/tools` from other token systems.

## Available Guides

| Guide                                               | Description                       |
| --------------------------------------------------- | --------------------------------- |
| [From Style Dictionary](./from-style-dictionary.md) | Migrate from Style Dictionary     |
| [From Custom Systems](./from-custom.md)             | Migrate from custom token systems |

---

## Migration Overview

### Benefits of Migrating

`@dsai-io/tools` provides:

- **TypeScript-first** - Full type safety for configurations
- **Multi-brand support** - Built-in brand management
- **Modern tooling** - ESM, tree-shaking, fast builds
- **Integrated icons** - Icon generation alongside tokens
- **Enterprise features** - CI/CD integration, validation

### Migration Steps

1. **Audit** - Document current token structure
2. **Convert** - Transform tokens to DTCG format
3. **Configure** - Create `dsai.config.ts`
4. **Test** - Validate output matches expectations
5. **Deploy** - Update CI/CD pipelines

---

## Token Format

`@dsai-io/tools` uses the [Design Token Community Group (DTCG)](https://tr.designtokens.org/format/) format:

```json
{
  "color": {
    "primary": {
      "$value": "#007bff",
      "$type": "color",
      "$description": "Primary brand color"
    }
  }
}
```

Legacy format is also supported:

```json
{
  "color": {
    "primary": {
      "value": "#007bff",
      "type": "color"
    }
  }
}
```

---

## Getting Help

- [Troubleshooting](../troubleshooting.md)
- [Configuration Reference](../configuration.md)
- [GitHub Issues](https://github.com/michelve/dsai/issues)
