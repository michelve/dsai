#!/usr/bin/env bash
# scan-utils-usage.sh
# Wrapper that invokes the Node-based utility scanner.
# Run: chmod +x tools/scripts/react-utils/scan-utils-usage.sh \
#      && ./tools/scripts/react-utils/scan-utils-usage.sh

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/../../.." && pwd)"

COMPONENT_DIR="${1:-packages/@dsai/react/src/components}"
OUTPUT_FILE="${2:-/tmp/utils-inventory.json}"
TSCONFIG_PATH="${3:-tsconfig.base.json}"

cd "$REPO_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is required to run the scanner." >&2
  exit 1
fi

node "$SCRIPT_DIR/scan-utils-usage.mjs" \
  --components "$COMPONENT_DIR" \
  --output "$OUTPUT_FILE" \
  --tsconfig "$TSCONFIG_PATH"
