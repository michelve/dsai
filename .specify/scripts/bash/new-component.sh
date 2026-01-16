#!/usr/bin/env bash

# Create a new component specification
#
# Usage: ./new-component.sh <ComponentName> [--json]
#
# This script:
# 1. Creates a spec directory in .specify/specs/{ComponentName}/
# 2. Copies templates for spec.md, plan.md, tasks.md, checklist.md
# 3. Replaces placeholders with component name
# 4. Optionally creates the git branch

set -e

#==============================================================================
# Parse Arguments
#==============================================================================

JSON_MODE=false
COMPONENT_NAME=""
CREATE_BRANCH=false

for arg in "$@"; do
    case "$arg" in
        --json)
            JSON_MODE=true
            ;;
        --branch)
            CREATE_BRANCH=true
            ;;
        --help|-h)
            cat << 'EOF'
Usage: new-component.sh <ComponentName> [OPTIONS]

Create a new component specification with all required documents.

ARGUMENTS:
  ComponentName     PascalCase component name (e.g., Button, CardList)

OPTIONS:
  --json           Output in JSON format
  --branch         Create a git branch for the component
  --help, -h       Show this help message

EXAMPLES:
  ./new-component.sh Button
  ./new-component.sh DatePicker --branch
  ./new-component.sh CardList --json

OUTPUT:
  Creates .specify/specs/{ComponentName}/ with:
    - spec.md       Component specification
    - plan.md       Implementation plan
    - tasks.md      Task breakdown
    - checklist.md  Quality checklist

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
    echo "Usage: $0 <ComponentName> [--json] [--branch]" >&2
    exit 1
fi

# Load common functions
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Validate component name
if ! validate_component_name "$COMPONENT_NAME"; then
    exit 1
fi

# Get paths
eval "$(get_component_paths "$COMPONENT_NAME")"

# Check if spec already exists
if [[ -d "$SPECS_DIR" ]]; then
    log_error "Spec directory already exists: $SPECS_DIR"
    exit 1
fi

#==============================================================================
# Create Spec Directory
#==============================================================================

log_info "Creating component specification for: $COMPONENT_NAME"

mkdir -p "$SPECS_DIR"

CURRENT_DATE=$(get_current_date)
KEBAB_NAME=$(to_kebab_case "$COMPONENT_NAME")

#==============================================================================
# Copy and Process Templates
#==============================================================================

process_template() {
    local src="$1"
    local dest="$2"

    if [[ -f "$src" ]]; then
        sed \
            -e "s/\[COMPONENT_NAME\]/$COMPONENT_NAME/g" \
            -e "s/\[ComponentName\]/$COMPONENT_NAME/g" \
            -e "s/\[component-name\]/$KEBAB_NAME/g" \
            -e "s/\[DATE\]/$CURRENT_DATE/g" \
            "$src" > "$dest"
        log_success "Created: $dest"
    else
        log_warning "Template not found: $src"
        touch "$dest"
    fi
}

process_template "$TEMPLATES_DIR/component-spec.md" "$SPECS_DIR/spec.md"
process_template "$TEMPLATES_DIR/component-plan.md" "$SPECS_DIR/plan.md"
process_template "$TEMPLATES_DIR/component-tasks.md" "$SPECS_DIR/tasks.md"
process_template "$TEMPLATES_DIR/component-checklist.md" "$SPECS_DIR/checklist.md"

#==============================================================================
# Create Git Branch (Optional)
#==============================================================================

if $CREATE_BRANCH && has_git; then
    BRANCH_NAME="component/$KEBAB_NAME"
    git checkout -b "$BRANCH_NAME" 2>/dev/null || {
        log_warning "Branch $BRANCH_NAME already exists or could not be created"
    }
    log_success "Created branch: $BRANCH_NAME"
fi

#==============================================================================
# Output Results
#==============================================================================

if $JSON_MODE; then
    printf '{"component":"%s","specs_dir":"%s","files":["spec.md","plan.md","tasks.md","checklist.md"]}\n' \
        "$COMPONENT_NAME" "$SPECS_DIR"
else
    echo ""
    log_success "Component specification created!"
    echo ""
    echo "📁 Location: $SPECS_DIR"
    echo ""
    echo "📄 Files created:"
    echo "   - spec.md       Define requirements and acceptance criteria"
    echo "   - plan.md       Technical approach and phases"
    echo "   - tasks.md      Detailed task breakdown"
    echo "   - checklist.md  Quality gates for sign-off"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Edit spec.md to define component requirements"
    echo "   2. Review plan.md for implementation approach"
    echo "   3. Use tasks.md to track progress"
    echo "   4. Complete checklist.md before marking done"
    echo ""
fi
