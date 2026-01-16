#!/usr/bin/env bash
# Common functions and variables for DSAi SpecKit scripts

set -e

#==============================================================================
# Repository Detection
#==============================================================================

get_repo_root() {
    if git rev-parse --show-toplevel >/dev/null 2>&1; then
        git rev-parse --show-toplevel
    else
        # Fall back to script location for non-git repos
        local script_dir
        script_dir="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        (cd "$script_dir/../../.." && pwd)
    fi
}

get_current_branch() {
    if git rev-parse --abbrev-ref HEAD >/dev/null 2>&1; then
        git rev-parse --abbrev-ref HEAD
    else
        echo "main"
    fi
}

has_git() {
    git rev-parse --show-toplevel >/dev/null 2>&1
}

#==============================================================================
# Path Resolution
#==============================================================================

get_component_paths() {
    local repo_root
    repo_root=$(get_repo_root)
    local component_name="$1"

    cat <<EOF
REPO_ROOT='$repo_root'
COMPONENT_NAME='$component_name'
COMPONENT_DIR='$repo_root/packages/@dsai-io/react/src/components/$component_name'
STORYBOOK_DIR='$repo_root/packages/@dsai-io/storybook/docs/components/$component_name'
SPECS_DIR='$repo_root/.specify/specs/$component_name'
TASKS_DIR='$repo_root/tasks'
TEMPLATES_DIR='$repo_root/.specify/templates'
EOF
}

get_specs_dir() {
    local repo_root
    repo_root=$(get_repo_root)
    echo "$repo_root/.specify/specs"
}

#==============================================================================
# Logging
#==============================================================================

log_info() {
    echo "ℹ️  $1"
}

log_success() {
    echo "✅ $1"
}

log_error() {
    echo "❌ $1" >&2
}

log_warning() {
    echo "⚠️  $1" >&2
}

#==============================================================================
# Validation
#==============================================================================

validate_component_name() {
    local name="$1"

    # Must be PascalCase
    if ! echo "$name" | grep -qE '^[A-Z][a-zA-Z0-9]*$'; then
        log_error "Component name must be PascalCase (e.g., Button, CardList, DatePicker)"
        return 1
    fi

    return 0
}

check_component_exists() {
    local repo_root
    repo_root=$(get_repo_root)
    local component_name="$1"
    local component_dir="$repo_root/packages/@dsai-io/react/src/components/$component_name"

    if [[ -d "$component_dir" ]]; then
        return 0
    fi
    return 1
}

#==============================================================================
# File Helpers
#==============================================================================

check_file() {
    [[ -f "$1" ]] && echo "  ✅ $2" || echo "  ❌ $2"
}

check_dir() {
    [[ -d "$1" && -n $(ls -A "$1" 2>/dev/null) ]] && echo "  ✅ $2" || echo "  ❌ $2"
}

#==============================================================================
# Date Helpers
#==============================================================================

get_current_date() {
    date +%Y-%m-%d
}

#==============================================================================
# Component Name Helpers
#==============================================================================

to_kebab_case() {
    local name="$1"
    echo "$name" | sed 's/\([A-Z]\)/-\1/g' | sed 's/^-//' | tr '[:upper:]' '[:lower:]'
}

to_pascal_case() {
    local name="$1"
    echo "$name" | sed -r 's/(^|-)([a-z])/\U\2/g'
}
