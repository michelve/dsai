#!/usr/bin/env bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Storybook Build Verification"
echo "================================"
echo ""

# Step 1: Check if tokens are built
echo "📦 Step 1: Checking design tokens..."
if [ -f "packages/@dsai-io/tools/dist/css/variables.css" ]; then
  TOKEN_SIZE=$(wc -c < packages/@dsai-io/tools/dist/css/variables.css)
  echo -e "${GREEN}✓${NC} CSS variables exist (${TOKEN_SIZE} bytes)"
else
  echo -e "${RED}✗${NC} CSS variables not found!"
  echo "   Run: pnpm tokens:build"
  exit 1
fi

# Step 2: Check token count
TOKEN_COUNT=$(grep -c "var(--dsai-" packages/@dsai-io/tools/dist/css/variables.css || true)
echo -e "${GREEN}✓${NC} Found ${TOKEN_COUNT} CSS variables"

# Step 3: Verify color tokens
BLUE_50=$(grep -c "color-blue-50" packages/@dsai-io/tools/dist/css/variables.css || true)
if [ "$BLUE_50" -gt 0 ]; then
  echo -e "${GREEN}✓${NC} Color tokens validated (blue.50 found)"
else
  echo -e "${YELLOW}⚠${NC} Color tokens may be incomplete"
fi

# Step 4: Check Storybook config
echo ""
echo "⚙️  Step 2: Checking Storybook configuration..."
if [ -f "packages/@dsai-io/storybook/.storybook/main.ts" ]; then
  echo -e "${GREEN}✓${NC} main.ts exists"

  # Check for viteFinal
  if grep -q "viteFinal" packages/@dsai-io/storybook/.storybook/main.ts; then
    echo -e "${GREEN}✓${NC} Vite configuration found"
  else
    echo -e "${YELLOW}⚠${NC} No Vite configuration found"
  fi
else
  echo -e "${RED}✗${NC} main.ts not found!"
  exit 1
fi

# Step 5: Check preview.ts
if [ -f "packages/@dsai-io/storybook/.storybook/preview.ts" ]; then
  echo -e "${GREEN}✓${NC} preview.ts exists"

  # Check for CSS import
  if grep -q "@dsai-io/tools/css" packages/@dsai-io/storybook/.storybook/preview.ts; then
    echo -e "${GREEN}✓${NC} CSS import uses Vite alias"
  else
    echo -e "${YELLOW}⚠${NC} CSS import may not use alias"
  fi
else
  echo -e "${RED}✗${NC} preview.ts not found!"
  exit 1
fi

# Step 6: Check stories
echo ""
echo "📖 Step 3: Checking story files..."
STORY_COUNT=$(find packages/@dsai-io/storybook/docs -name "*.stories.tsx" -o -name "*.stories.ts" | wc -l)
MDX_COUNT=$(find packages/@dsai-io/storybook/docs -name "*.mdx" | wc -l)
echo -e "${GREEN}✓${NC} Found ${STORY_COUNT} story files and ${MDX_COUNT} MDX files"

# Step 7: Check if Storybook is running
echo ""
echo "🚀 Step 4: Checking Storybook server..."
if curl -s http://localhost:6006 > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} Storybook is running at http://localhost:6006"
else
  echo -e "${YELLOW}⚠${NC} Storybook not running"
  echo "   To start: pnpm nx storybook storybook"
fi

# Summary
echo ""
echo "================================"
echo -e "${GREEN}✓ Verification complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Open http://localhost:6006 (if running)"
echo "  2. Navigate to: Foundation > Colors > All Color Hues"
echo "  3. Verify colors display correctly (not gray)"
echo ""

