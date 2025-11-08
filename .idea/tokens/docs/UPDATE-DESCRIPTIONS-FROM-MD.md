# Update Descriptions from Markdown

This script updates token descriptions in JSON files from corresponding markdown files.

## Usage

### Update a specific collection:

```bash
node scripts/update-descriptions-from-md.js colors
```

### Update all collections:

```bash
node scripts/update-descriptions-from-md.js
```

## Markdown Format

Create a `.md` file with the same name as your `.json` collection file in the `collections/` directory.

### Format:

```
path.to.token.$description
    description=Your description text here

next.token.path.$description
    description=Another description
```

### Example (`colors.md`):

```
light.colors.brand.blue.100.$description
    description=Lightest tint (90% lighter) of primary brand color. Use for subtle backgrounds.

light.colors.brand.blue.500.$description
    description=Base primary blue. Main brand color for primary actions and emphasis.

dark.colors.brand.blue.100.$description
    description=Lightest tint in dark mode. Use for subtle elevated surfaces.
```

## Path Mapping

The script automatically converts markdown paths to JSON structure:

- `light.colors.brand.blue.100` → `Colors.modes.Light.colors.brand.blue.100`
- `dark.colors.theme.primary` → `Colors.modes.Dark.colors.theme.primary`

## Benefits

1. **Separation of Concerns**: Keep long descriptions in readable markdown files
2. **Version Control**: Easier to review description changes in PRs
3. **Reusable**: Same script works for all token collections (colors, typography, spacing, etc.)
4. **Bulk Updates**: Update hundreds of descriptions at once
5. **Documentation Source**: Markdown files can serve as documentation

## Workflow

1. Edit descriptions in `collections/colors.md`
2. Run `node scripts/update-descriptions-from-md.js colors`
3. Descriptions are updated in `collections/colors.json`
4. Import to Figma with the plugin

## Future Use Cases

This script can be used for other collections:

```bash
# Typography descriptions
node scripts/update-descriptions-from-md.js typography

# Spacing descriptions
node scripts/update-descriptions-from-md.js spacing

# Component descriptions
node scripts/update-descriptions-from-md.js components-button
```

Just create a matching `.md` file with the same naming pattern!
