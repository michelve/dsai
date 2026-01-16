#!/usr/bin/env bash

# Check prerequisites for component implementation
#
# Usage: ./check-prerequisites.sh <ComponentName> [OPTIONS]
#
# Validates that all required documents exist and are populated
# before starting implementation.

set -e

#==============================================================================
# Parse Arguments
#==============================================================================

JSON_MODE=false
COMPONENT_NAME=""

for arg in "$@"; do
    case "$arg" in
        --json)
            JSON_MODE=true
            ;;
        --help|-h)
            cat << 'EOF'
Usage: check-prerequisites.sh <ComponentName> [OPTIONS]

Validate component spec documents before implementation.

ARGUMENTS:
  ComponentName     PascalCase component name (e.g., Button, CardList)

OPTIONS:
  --json           Output in JSON format
  --help, -h       Show this help message

CHECKS:
  - spec.md exists and has content
  - plan.md exists and has content
  - tasks.md exists and has content
  - Constitution gates are checked in plan.md

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

#==============================================================================
# Check Files
#==============================================================================

ERRORS=()
WARNINGS=()

# Check spec.md
SPEC_FILE="$SPECS_DIR/spec.md"
if [[ ! -f "$SPEC_FILE" ]]; then
    ERRORS+=("spec.md not found - run new-component.sh first")
elif [[ $(wc -l < "$SPEC_FILE") -lt 20 ]]; then
    WARNINGS+=("spec.md appears incomplete (less than 20 lines)")
fi

# Check plan.md
PLAN_FILE="$SPECS_DIR/plan.md"
if [[ ! -f "$PLAN_FILE" ]]; then
    ERRORS+=("plan.md not found - run new-component.sh first")
elif [[ $(wc -l < "$PLAN_FILE") -lt 20 ]]; then
    WARNINGS+=("plan.md appears incomplete (less than 20 lines)")
fi

# Check tasks.md
TASKS_FILE="$SPECS_DIR/tasks.md"
if [[ ! -f "$TASKS_FILE" ]]; then
    ERRORS+=("tasks.md not found - run new-component.sh first")
fi

# Check Constitution gates in plan.md
if [[ -f "$PLAN_FILE" ]]; then
    if ! grep -q "Constitution Check" "$PLAN_FILE"; then
        WARNINGS+=("plan.md missing Constitution Check section")
    fi

    # Check for unchecked critical gates
    UNCHECKED_SECURITY=$(grep -c '\- \[ \].*SEC' "$PLAN_FILE" 2>/dev/null || echo "0")
    if [[ "$UNCHECKED_SECURITY" -gt 0 ]]; then
        WARNINGS+=("$UNCHECKED_SECURITY security gates unchecked in plan.md")
    fi
fi

#==============================================================================
# Output Results
#==============================================================================

if $JSON_MODE; then
    # Build JSON output
    error_json="[]"
    if [[ ${#ERRORS[@]} -gt 0 ]]; then
        error_json=$(printf '"%s",' "${ERRORS[@]}")
        error_json="[${error_json%,}]"
    fi

    warning_json="[]"
    if [[ ${#WARNINGS[@]} -gt 0 ]]; then
        warning_json=$(printf '"%s",' "${WARNINGS[@]}")
        warning_json="[${warning_json%,}]"
    fi

    ready="true"
    if [[ ${#ERRORS[@]} -gt 0 ]]; then
        ready="false"
    fi

    printf '{"component":"%s","ready":%s,"errors":%s,"warnings":%s}\n' \
        "$COMPONENT_NAME" "$ready" "$error_json" "$warning_json"
else
    echo ""
    echo "🔍 Checking prerequisites for: $COMPONENT_NAME"
    echo ""

    echo "📄 Documents:"
    check_file "$SPEC_FILE" "spec.md"
    check_file "$PLAN_FILE" "plan.md"
    check_file "$TASKS_FILE" "tasks.md"
    check_file "$SPECS_DIR/checklist.md" "checklist.md"
    echo ""

    if [[ ${#ERRORS[@]} -gt 0 ]]; then
        echo "❌ Errors:"
        for error in "${ERRORS[@]}"; do
            echo "   - $error"
        done
        echo ""
    fi

    if [[ ${#WARNINGS[@]} -gt 0 ]]; then
        echo "⚠️  Warnings:"
        for warning in "${WARNINGS[@]}"; do
            echo "   - $warning"
        done
        echo ""
    fi

    if [[ ${#ERRORS[@]} -eq 0 ]]; then
        log_success "Ready to implement $COMPONENT_NAME!"
    else
        log_error "Fix errors before implementing"
        exit 1
    fi
fi
