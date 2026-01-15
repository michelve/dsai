# Examples

Example configurations and token setups for `@dsai/tools`.

## Available Examples

| Example                             | Description                   |
| ----------------------------------- | ----------------------------- |
| [Basic](./basic/)                   | Simple single-brand setup     |
| [Enterprise](./enterprise/)         | Multi-brand with themes       |
| [Multi-Platform](./multi-platform/) | Web, iOS, and Android outputs |

---

## Running Examples

```bash
# Clone the repository
git clone https://github.com/michelve/dsai.git

# Navigate to examples
cd packages/@dsai/tools/docs/examples/basic

# Install dependencies
pnpm install

# Build tokens
pnpm dsai tokens build
```

---

## Example Structure

Each example includes:

- `dsai.config.ts` - Configuration file
- `tokens/` - Token source files
- `README.md` - Example-specific documentation
