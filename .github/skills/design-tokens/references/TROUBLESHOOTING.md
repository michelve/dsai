# Troubleshooting Design Tokens

Common issues and solutions when working with DSAi design tokens.

## Transform Issues

### Transform produces empty output

**Symptoms:**

- No files written to `collections/`
- "Transformed 0 files" message

**Solutions:**

1. **Check source directory:**

   ```bash
   ls -la src/figma-exports/
   ```

   Verify `theme.json` or `foundation.json` exists.

2. **Check configuration:**

   ```javascript
   // dsai.config.mjs
   tokens: {
     sourceDir: './src/figma-exports',  // Must point to Figma exports
   }
   ```

3. **Run with dry-run to debug:**

   ```bash
   dsai tokens transform --dry-run
   ```

4. **Enable debug mode:**

   ```bash
   DEBUG=true dsai tokens transform
   ```

### Transform ignores some tokens

**Symptoms:**

- Some tokens not appearing in output
- Specific modes missing

**Solutions:**

1. **Check ignore-modes setting:**

   ```bash
   # Don't ignore the mode you need
   dsai tokens transform --ignore-modes "High Contrast"
   ```

2. **Check default mode:**

   ```bash
   dsai tokens transform --default-mode Light
   ```

3. **Verify Figma export structure:**

   ```json
   {
     "modes": {
       "Light": { ... },
       "Dark": { ... }
     }
   }
   ```

## Validation Issues

### Validation fails on references

**Symptoms:**

- "Reference not found" errors
- Invalid token path errors

**Solutions:**

1. **Check reference syntax:**

   ```json
   // ✅ Correct
   "$value": "{color.blue.500}"

   // ❌ Wrong - missing braces
   "$value": "color.blue.500"

   // ❌ Wrong - wrong path separator
   "$value": "{color/blue/500}"
   ```

2. **Verify referenced token exists:**

   ```bash
   grep -r "blue.500" src/collections/
   ```

3. **Check file load order:**
   - Primitive tokens must be defined before semantic tokens
   - Check your config's source patterns

### Invalid token type errors

**Symptoms:**

- "Invalid token type" validation errors

**Solutions:**

1. **Use valid DTCG types:**

   ```json
   // Valid types:
   "color", "dimension", "fontFamily", "fontWeight",
   "duration", "cubicBezier", "number", "shadow", "border"
   ```

2. **Check type matches value:**

   ```json
   // ✅ Correct
   { "$value": "#0a58ca", "$type": "color" }

   // ❌ Wrong - type doesn't match value
   { "$value": "16px", "$type": "color" }
   ```

### Duplicate token path errors

**Symptoms:**

- "Duplicate token path" errors

**Solutions:**

1. **Search for duplicates:**

   ```bash
   grep -rh '\$value' src/collections/ | sort | uniq -d
   ```

2. **Check nested paths:**

   ```json
   // Both define color.blue.500 - duplicate!
   // File 1: primitive.json
   { "color": { "blue": { "500": { "$value": "#0a58ca" }}}}

   // File 2: theme.json
   { "color": { "blue": { "500": { "$value": "#0066cc" }}}}
   ```

## Build Issues

### CSS variables not updating

**Symptoms:**

- Changes to tokens not reflected in output
- Stale CSS files

**Solutions:**

1. **Clean and rebuild:**

   ```bash
   dsai tokens build --clean
   ```

2. **Check output directory:**

   ```bash
   ls -la src/generated/
   ```

3. **Verify import in app:**

   ```typescript
   // Make sure you're importing the right file
   import './generated/tokens.css';
   ```

4. **Clear browser cache:**
   - Hard refresh: `Cmd+Shift+R` / `Ctrl+Shift+R`
   - Clear cache in DevTools

### Build step fails

**Symptoms:**

- Build exits with error code
- Specific step fails

**Solutions:**

1. **Run individual steps:**

   ```bash
   dsai tokens validate  # Check validation first
   dsai tokens transform # Then transform
   dsai tokens build     # Then build
   ```

2. **Check pipeline config:**

   ```javascript
   tokens: {
     pipeline: {
       steps: ['validate', 'transform', 'style-dictionary'],
     },
   }
   ```

3. **Check Style Dictionary config:**

   ```bash
   cat sd.config.mjs
   ```

### Wrong output format

**Symptoms:**

- Missing output files
- Wrong file extensions

**Solutions:**

1. **Check formats configuration:**

   ```javascript
   tokens: {
     formats: ['css', 'js', 'ts', 'scss', 'json'],
   }
   ```

2. **Verify Style Dictionary config:**
   - Check `sd.config.mjs` for platform configurations

## Theme Issues

### Dark mode not working

**Symptoms:**

- Dark mode styles not applying
- Theme switching broken

**Solutions:**

1. **Check CSS import order:**

   ```css
   /* tokens.css must come before tokens-dark.css */
   @import './generated/tokens.css';
   @import './generated/tokens-dark.css';
   ```

2. **Check theme selector:**

   ```css
   /* Default selector */
   [data-theme="dark"] { ... }

   /* If using data-dsai-theme */
   [data-dsai-theme="dark"] { ... }
   ```

3. **Run postprocess:**

   ```bash
   dsai tokens postprocess
   ```

4. **Verify HTML attribute:**

   ```html
   <html data-theme="dark"></html>
   ```

### Theme selector mismatch

**Symptoms:**

- Styles generated with wrong selector

**Solutions:**

1. **Check postprocess configuration:**
   - The postprocess step replaces `data-bs-theme` with `data-dsai-theme`

2. **Update your HTML:**

   ```html
   <!-- Use the selector that matches your CSS -->
   <html data-dsai-theme="dark"></html>
   ```

## Figma Sync Issues

### Figma fetch fails

**Symptoms:**

- Authentication errors
- File not found errors

**Solutions:**

1. **Check Figma token:**

   ```bash
   echo $FIGMA_TOKEN
   # Should start with figd_
   ```

2. **Verify file ID:**

   ```bash
   # Extract from Figma URL:
   # https://www.figma.com/file/ABC123xyz/Design-System
   #                           ^^^^^^^^^^^ this is the file ID
   ```

3. **Check network access:**

   ```bash
   curl -H "X-Figma-Token: $FIGMA_TOKEN" \
     https://api.figma.com/v1/me
   ```

### Token values differ from Figma

**Symptoms:**

- Exported values don't match Figma
- Missing tokens in export

**Solutions:**

1. **Re-fetch from Figma:**

   ```bash
   dsai-figma fetch
   ```

2. **Check Figma variable collections:**
   - Verify the collection is published
   - Check variable modes are correct

3. **Validate against Figma:**

   ```bash
   dsai-figma validate
   ```

## Performance Issues

### Slow build times

**Symptoms:**

- Build takes > 30 seconds
- Watch mode is laggy

**Solutions:**

1. **Reduce source patterns:**

   ```javascript
   tokens: {
     // Be specific instead of using **
     source: ['./src/collections/color/*.json'],
   }
   ```

2. **Skip unnecessary steps:**

   ```javascript
   pipeline: {
     steps: ['style-dictionary'], // Minimal pipeline
   }
   ```

3. **Use incremental builds:**

   ```bash
   dsai tokens build --watch
   ```

### Out of memory errors

**Symptoms:**

- Node.js heap out of memory
- Build crashes

**Solutions:**

1. **Increase Node.js memory:**

   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" dsai tokens build
   ```

2. **Split token files:**
   - Break large files into smaller category files

## Getting Help

### Debug output

```bash
# Enable verbose logging
DEBUG=true LOG_LEVEL=debug dsai tokens build
```

### Validate configuration

```bash
# Check config is valid
dsai config validate
```

### Check version

```bash
# Ensure you're on the latest version
pnpm list @dsai-io/tools
```
