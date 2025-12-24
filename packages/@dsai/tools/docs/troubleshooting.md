# Troubleshooting

Common issues and solutions when using @DSAi/tools.

## Configuration Issues

### Config file not found

**Error:**

```plaintext
Error: No configuration file found
```

**Solution:**
Run `dsai init` to create a configuration file, or create `dsai.config.mjs` manually.

### Invalid configuration

**Error:**

```plaintext
Error: Invalid configuration at tokens.prefix
Expected string, received number
```

**Solution:**
Check your configuration against the [Configuration Reference](./configuration.md). The error message indicates which field is invalid.

---

## Token Build Issues

### No token files found

**Error:**

```plaintext
Warning: No token files found in ./collections
```

**Solution:**

1. Check that your `sourceDir` path is correct
2. Ensure token files have `.json` extension
3. Verify file structure matches expected format

### Invalid token format

**Error:**

```plaintext
Error: Invalid token at color.blue.500
Missing $value property
```

**Solution:**
Tokens must follow the DTCG format with `$value`:

```json
{
  "color": {
    "blue": {
      "500": {
        "$value": "#3b82f6",
        "$type": "color"
      }
    }
  }
}
```

### Unresolved references

**Error:**

```plaintext
Error: Unresolved reference {color.primary}
```

**Solution:**

1. Check that the referenced token exists
2. Verify the reference path is correct
3. Ensure referenced token is in the source files

---

## Style Dictionary Issues

### Transform not registered

**Error:**

```plaintext
Error: Transform 'custom/my-transform' is not registered
```

**Solution:**
Register custom transforms before building:

```javascript
export default defineConfig({
  tokens: {
    transforms: [
      {
        name: 'custom/my-transform',
        type: 'value',
        transform: (token) => token.value,
      },
    ],
  },
});
```

### Format not found

**Error:**

```plaintext
Error: Unknown format 'custom/my-format'
```

**Solution:**
Register custom formats in configuration:

```javascript
export default defineConfig({
  tokens: {
    customFormats: [
      {
        name: 'custom/my-format',
        format: ({ dictionary }) => {
          return dictionary.allTokens.map((t) => t.name).join('\n');
        },
      },
    ],
  },
});
```

---

## Icon Build Issues

### SVG parse error

**Error:**

```plaintext
Error: Failed to parse icon.svg: Invalid SVG format
```

**Solution:**

1. Validate SVG file is well-formed XML
2. Check for unclosed tags
3. Remove unsupported elements (scripts, foreign objects)

### SVGO optimization failed

**Error:**

```plaintext
Error: SVGO optimization failed for icon.svg
```

**Solution:**

1. Check SVG for invalid content
2. Try disabling specific SVGO plugins
3. Set `optimize: false` temporarily to debug

---

## CLI Issues

### Command not found

**Error:**

```plaintext
bash: dsai: command not found
```

**Solution:**

1. For global install: `npm install -g @dsai/tools`
2. For local use: `npx dsai` or add to package.json scripts
3. Check that `node_modules/.bin` is in your PATH

### Permission denied

**Error:**

```plaintext
Error: EACCES: permission denied, open './dist/tokens.css'
```

**Solution:**

1. Check write permissions on output directory
2. Run with appropriate user permissions
3. Avoid running as root

---

## Performance Issues

### Slow builds

**Symptoms:**

- Build takes more than 30 seconds
- High memory usage

**Solutions:**

1. Reduce number of token files
2. Disable unused platforms with `--platforms css,js`
3. Use `--quiet` flag in CI
4. Consider splitting into multiple packages

### Watch mode not detecting changes

**Symptoms:**

- File changes not triggering rebuild

**Solutions:**

1. Check file system events (especially in Docker/WSL)
2. Verify source directory path is correct
3. Add directories to `watchDirectories` config
4. Try restarting the watch process

---

## Build Output Issues

### CSS variables have wrong prefix

**Symptoms:**

- Variables use `--dsai-` instead of custom prefix

**Solution:**
Check your configuration has the correct `prefix`:

```javascript
export default defineConfig({
  tokens: {
    prefix: '--mycompany-', // Include trailing dash
  },
});
```

### Missing theme variants

**Symptoms:**

- Only light theme generated
- Dark mode variables missing

**Solution:**

1. Check `themes.autoDetect` is enabled
2. Verify Figma export includes mode information
3. Check `themes.ignoreModes` doesn't exclude your theme

```javascript
export default defineConfig({
  tokens: {
    themes: {
      autoDetect: true,
      ignoreModes: [], // Ensure your mode isn't here
    },
  },
});
```

---

## Getting Help

### Debug Mode

Enable debug output for more information:

```bash
dsai tokens build --debug
```

Or set environment variable:

```bash
DSAI_DEBUG=true dsai tokens build
```

### Verbose Output

For even more detail:

```bash
dsai tokens build --debug 2>&1 | tee debug.log
```

### Check Version

Ensure you're on the latest version:

```bash
dsai --version
npm view @dsai/tools version
```

### File an Issue

If you can't resolve the issue:

1. Gather debug output
2. Note your Node.js version: `node --version`
3. Note @DSAi/tools version: `dsai --version`
4. Create a minimal reproduction
5. [File an issue](https://github.com/michelve/dsai/issues/new)

Include:

- Operating system
- Node.js version
- @DSAi/tools version
- Configuration file
- Full error output
- Steps to reproduce
