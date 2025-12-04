#!/usr/bin/env bash
# scan-utils-usage.sh
# Quick AST-based scan of component utilities
# Run: chmod +x scan-utils-usage.sh && ./scan-utils-usage.sh

set -e

COMPONENT_DIR="${1:-packages/@dsai/react/src/components}"
OUTPUT_FILE="${2:-/tmp/utils-inventory.txt}"

echo "🔍 Scanning components for utility usage..."
echo "📁 Component directory: $COMPONENT_DIR"
echo ""

# Step 1: Find all local imports
echo "Step 1/3: Extracting local imports..."
grep -r "from ['\"]\.\./" "$COMPONENT_DIR" \
  --include="*.tsx" \
  --include="*.ts" 2>/dev/null \
  | sed "s/.*from ['\"]\.\.\/\(.*\)['\"].*/\1/" \
  | sort | uniq -c | sort -rn > "$OUTPUT_FILE.imports"

# Step 2: Parse into structured format
echo "Step 2/3: Building inventory..."

cat > "$OUTPUT_FILE.temp" <<'EOF'
# Utility Usage Inventory
# Format: USAGE_COUNT | UTILITY_NAME | CATEGORY

EOF

declare -A category_map
category_map["string"]="string utilities"
category_map["array"]="array utilities"
category_map["object"]="object utilities"
category_map["types"]="type guards"
category_map["keyboard"]="keyboard handling"
category_map["a11y"]="accessibility"
category_map["number"]="number utilities"
category_map["memo"]="memoization"
category_map["assert"]="assertions"

while IFS= read -r count path; do
  if [ -z "$count" ] || [ "$count" = "0" ]; then
    continue
  fi

  # Extract category from path (e.g., "utils/string/cn" -> "string")
  category=$(echo "$path" | grep -oP 'utils/\K[^/]+' || echo "misc")
  
  # Extract function/file name
  name=$(basename "$path" .ts)

  # Only include if used 1+ times
  if [ "$count" -ge 1 ]; then
    echo "$count | $name | $category | $path" >> "$OUTPUT_FILE.temp"
  fi
done < "$OUTPUT_FILE.imports"

# Step 3: Sort and format output
echo "Step 3/3: Formatting output..."

sort -rn "$OUTPUT_FILE.temp" > "$OUTPUT_FILE"

# Display summary
echo ""
echo "✅ Scan Complete!"
echo ""
echo "📊 Summary:"
echo "─────────────────────────────────"

# Count by category
echo ""
echo "Usage by Category:"
awk -F'|' '{print $3}' "$OUTPUT_FILE" | sort | uniq -c | sort -rn | \
  awk '{printf "  %-20s %3d utilities\n", $2, $1}'

# Top 10 most used
echo ""
echo "Top 10 Most Used Utilities:"
head -10 "$OUTPUT_FILE" | awk -F'|' '{printf "  %3d usages: %s (%s)\n", $1, $2, $3}'

echo ""
echo "📁 Full inventory saved to: $OUTPUT_FILE"
echo ""
echo "💡 Next steps:"
echo "  1. Review the inventory (cat $OUTPUT_FILE)"
echo "  2. Identify enterprise gaps (mergeDeep, clamp, assert, etc.)"
echo "  3. Run code generation script (scripts/generate-utils-scaffold.ts)"
echo ""

# Cleanup
rm -f "$OUTPUT_FILE.imports" "$OUTPUT_FILE.temp"
