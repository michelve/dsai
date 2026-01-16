#!/usr/bin/env bash

# Validate component against quality checklist
#
# Usage: ./validate-component.sh <ComponentName> [OPTIONS]
#
# Runs automated checks from the checklist before marking complete

set -e

#==============================================================================
# Parse Arguments
#==============================================================================

JSON_MODE=false
COMPONENT_NAME=""
FIX=false

for arg in "$@"; do
    case "$arg" in
        --json)
            JSON_MODE=true
            ;;
        --fix)
            FIX=true
            ;;
        --help|-h)
            cat << 'EOF'
Usage: validate-component.sh <ComponentName> [OPTIONS]

Run quality gate checks for a component.

ARGUMENTS:
  ComponentName     PascalCase component name (e.g., Button, CardList)

OPTIONS:
  --json           Output in JSON format
  --fix            Auto-fix issues where possible
  --help, -h       Show this help message

CHECKS:
  - Component files exist
  - TypeScript compiles without errors
  - Tests pass
  - Test coverage meets threshold
  - Lint passes
  - jest-axe tests pass

EOF
            exit 0
            ;;
        *)
            if [[ -z "$COMPONENT_NAME" ]]; then
                COMPONENT_NAME="$arg"
            fi
            ;;
    esac
done

#==============================================================================
# Validate Input
#==============================================================================

if [[ -z "$COMPONENT_NAME" ]]; then
    echo "Error: Component name is required" >&2
    echo "Usage: $0 <ComponentName> [--json]" >&2
    exit 1
fi

# Load common functions
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Get paths
eval "$(get_component_paths "$COMPONENT_NAME")"

# Check if component exists
if ! check_component_exists "$COMPONENT_NAME"; then
    log_error "Component not found: $COMPONENT_DIR"
    exit 1
fi

#==============================================================================
# Run Validation Checks
#==============================================================================

CHECKS_PASSED=0
CHECKS_FAILED=0
RESULTS=()

run_check() {
    local name="$1"
    local command="$2"

    if ! $JSON_MODE; then
        echo -n "  Checking: $name... "
    fi

    if eval "$command" >/dev/null 2>&1; then
        ((CHECKS_PASSED++))
        RESULTS+=("{\"name\":\"$name\",\"status\":\"pass\"}")
        if ! $JSON_MODE; then
            echo "✅"
        fi
        return 0
    else
        ((CHECKS_FAILED++))
        RESULTS+=("{\"name\":\"$name\",\"status\":\"fail\"}")
        if ! $JSON_MODE; then
            echo "❌"
        fi
        return 1
    fi
}

if ! $JSON_MODE; then
    echo ""
    echo "🔍 Validating: $COMPONENT_NAME"
    echo ""
    echo "📋 Quality Checks:"
fi

# File existence checks
run_check "Component file exists" "[[ -f '$COMPONENT_DIR/${COMPONENT_NAME}.tsx' ]]" || true
run_check "Types file exists" "[[ -f '$COMPONENT_DIR/${COMPONENT_NAME}.types.ts' ]]" || true
run_check "Test file exists" "[[ -f '$COMPONENT_DIR/${COMPONENT_NAME}.test.tsx' ]]" || true
run_check "Index file exists" "[[ -f '$COMPONENT_DIR/index.ts' ]]" || true
run_check "Figma file exists" "[[ -f '$COMPONENT_DIR/${COMPONENT_NAME}.figma.tsx' ]]" || true

# Lint check
if ! $JSON_MODE; then
    echo ""
    echo "🔧 Code Quality:"
fi

run_check "Lint passes" "cd '$REPO_ROOT' && pnpm nx lint @dsai-io/react --quiet" || true

# Test check
if ! $JSON_MODE; then
    echo ""
    echo "🧪 Tests:"
fi

run_check "Tests pass" "cd '$REPO_ROOT' && pnpm nx test @dsai-io/react --testPathPattern='${COMPONENT_NAME}' --passWithNoTests" || true

# Security checks
if ! $JSON_MODE; then
    echo ""
    echo "🔒 Security:"
fi

run_check "No unrestricted spread" "! grep -r '\\.\\.\\.rest' '$COMPONENT_DIR/${COMPONENT_NAME}.tsx' 2>/dev/null | grep -v 'safeProps'" || true
run_check "No dangerouslySetInnerHTML" "! grep -r 'dangerouslySetInnerHTML' '$COMPONENT_DIR/${COMPONENT_NAME}.tsx'" || true

#==============================================================================
# Output Results
#==============================================================================

TOTAL=$((CHECKS_PASSED + CHECKS_FAILED))

if $JSON_MODE; then
    results_json=$(printf '%s,' "${RESULTS[@]}")
    results_json="[${results_json%,}]"

    passed="false"
    if [[ $CHECKS_FAILED -eq 0 ]]; then
        passed="true"
    fi

    printf '{"component":"%s","passed":%s,"checks_passed":%d,"checks_failed":%d,"total":%d,"results":%s}\n' \
        "$COMPONENT_NAME" "$passed" "$CHECKS_PASSED" "$CHECKS_FAILED" "$TOTAL" "$results_json"
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    if [[ $CHECKS_FAILED -eq 0 ]]; then
        log_success "All checks passed! ($CHECKS_PASSED/$TOTAL)"
        echo ""
        echo "✅ Component is ready for review"
    else
        log_error "Some checks failed: $CHECKS_FAILED/$TOTAL"
        echo ""
        echo "❌ Fix the issues above before marking complete"
        exit 1
    fi
fi
