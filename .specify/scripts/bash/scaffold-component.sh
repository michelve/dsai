#!/usr/bin/env bash

# Scaffold component files
#
# Usage: ./scaffold-component.sh <ComponentName> [OPTIONS]
#
# Creates the actual component file structure in packages/@dsai-io/react

set -e

#==============================================================================
# Parse Arguments
#==============================================================================

JSON_MODE=false
COMPONENT_NAME=""
FORCE=false

for arg in "$@"; do
    case "$arg" in
        --json)
            JSON_MODE=true
            ;;
        --force)
            FORCE=true
            ;;
        --help|-h)
            cat << 'EOF'
Usage: scaffold-component.sh <ComponentName> [OPTIONS]

Create component file structure in packages/@dsai-io/react.

ARGUMENTS:
  ComponentName     PascalCase component name (e.g., Button, CardList)

OPTIONS:
  --json           Output in JSON format
  --force          Overwrite existing files
  --help, -h       Show this help message

CREATES:
  packages/@dsai-io/react/src/components/{ComponentName}/
    - {ComponentName}.tsx
    - {ComponentName}.test.tsx
    - {ComponentName}.types.ts
    - {ComponentName}.figma.tsx
    - index.ts

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
    echo "Usage: $0 <ComponentName> [--json] [--force]" >&2
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

# Check if component already exists
if check_component_exists "$COMPONENT_NAME" && ! $FORCE; then
    log_error "Component already exists: $COMPONENT_DIR"
    log_info "Use --force to overwrite"
    exit 1
fi

#==============================================================================
# Create Component Files
#==============================================================================

log_info "Scaffolding component: $COMPONENT_NAME"

mkdir -p "$COMPONENT_DIR"

KEBAB_NAME=$(to_kebab_case "$COMPONENT_NAME")

# Types file
cat > "$COMPONENT_DIR/${COMPONENT_NAME}.types.ts" << EOF
import type { HTMLAttributes, ReactNode } from 'react';

export type ${COMPONENT_NAME}Variant = 'primary' | 'secondary' | 'danger';
export type ${COMPONENT_NAME}Size = 'sm' | 'md' | 'lg';

export interface ${COMPONENT_NAME}Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * The content to display inside the component
   */
  children: ReactNode;

  /**
   * Visual style variant
   * @default 'primary'
   */
  variant?: ${COMPONENT_NAME}Variant;

  /**
   * Component size
   * @default 'md'
   */
  size?: ${COMPONENT_NAME}Size;

  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;
}
EOF
log_success "Created: ${COMPONENT_NAME}.types.ts"

# Main component file
cat > "$COMPONENT_DIR/${COMPONENT_NAME}.tsx" << EOF
import { forwardRef } from 'react';
import type { ${COMPONENT_NAME}Props } from './${COMPONENT_NAME}.types';

/**
 * ${COMPONENT_NAME} component
 *
 * @example
 * \`\`\`tsx
 * <${COMPONENT_NAME} variant="primary" size="md">
 *   Content here
 * </${COMPONENT_NAME}>
 * \`\`\`
 */
export const ${COMPONENT_NAME} = forwardRef<HTMLDivElement, ${COMPONENT_NAME}Props>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    // Filter allowed props to prevent injection
    const safeProps = {
      'data-testid': props['data-testid'],
      'aria-label': props['aria-label'],
      'aria-describedby': props['aria-describedby'],
    };

    const classes = [
      '${KEBAB_NAME}',
      \`${KEBAB_NAME}--\${variant}\`,
      \`${KEBAB_NAME}--\${size}\`,
      disabled && '${KEBAB_NAME}--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        aria-disabled={disabled}
        {...safeProps}
      >
        {children}
      </div>
    );
  }
);

${COMPONENT_NAME}.displayName = '${COMPONENT_NAME}';
EOF
log_success "Created: ${COMPONENT_NAME}.tsx"

# Test file
cat > "$COMPONENT_DIR/${COMPONENT_NAME}.test.tsx" << EOF
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ${COMPONENT_NAME} } from './${COMPONENT_NAME}';

expect.extend(toHaveNoViolations);

describe('${COMPONENT_NAME}', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<${COMPONENT_NAME}>Test content</${COMPONENT_NAME}>);
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('applies default variant class', () => {
      render(<${COMPONENT_NAME} data-testid="${KEBAB_NAME}">Content</${COMPONENT_NAME}>);
      expect(screen.getByTestId('${KEBAB_NAME}')).toHaveClass('${KEBAB_NAME}--primary');
    });

    it('applies custom variant class', () => {
      render(<${COMPONENT_NAME} variant="secondary" data-testid="${KEBAB_NAME}">Content</${COMPONENT_NAME}>);
      expect(screen.getByTestId('${KEBAB_NAME}')).toHaveClass('${KEBAB_NAME}--secondary');
    });

    it('applies size class', () => {
      render(<${COMPONENT_NAME} size="lg" data-testid="${KEBAB_NAME}">Content</${COMPONENT_NAME}>);
      expect(screen.getByTestId('${KEBAB_NAME}')).toHaveClass('${KEBAB_NAME}--lg');
    });

    it('applies disabled class when disabled', () => {
      render(<${COMPONENT_NAME} disabled data-testid="${KEBAB_NAME}">Content</${COMPONENT_NAME}>);
      expect(screen.getByTestId('${KEBAB_NAME}')).toHaveClass('${KEBAB_NAME}--disabled');
      expect(screen.getByTestId('${KEBAB_NAME}')).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<${COMPONENT_NAME}>Accessible content</${COMPONENT_NAME}>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<${COMPONENT_NAME} disabled>Disabled content</${COMPONENT_NAME}>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
EOF
log_success "Created: ${COMPONENT_NAME}.test.tsx"

# Figma Code Connect file
cat > "$COMPONENT_DIR/${COMPONENT_NAME}.figma.tsx" << EOF
import figma from '@figma/code-connect';
import { ${COMPONENT_NAME} } from './${COMPONENT_NAME}';

figma.connect(${COMPONENT_NAME}, 'FIGMA_URL_HERE', {
  props: {
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Danger: 'danger',
    }),
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),
    disabled: figma.boolean('Disabled'),
    children: figma.string('Label'),
  },
  example: (props) => (
    <${COMPONENT_NAME}
      variant={props.variant}
      size={props.size}
      disabled={props.disabled}
    >
      {props.children}
    </${COMPONENT_NAME}>
  ),
});
EOF
log_success "Created: ${COMPONENT_NAME}.figma.tsx"

# Index file
cat > "$COMPONENT_DIR/index.ts" << EOF
export { ${COMPONENT_NAME} } from './${COMPONENT_NAME}';
export type {
  ${COMPONENT_NAME}Props,
  ${COMPONENT_NAME}Variant,
  ${COMPONENT_NAME}Size,
} from './${COMPONENT_NAME}.types';
EOF
log_success "Created: index.ts"

#==============================================================================
# Output Results
#==============================================================================

if $JSON_MODE; then
    printf '{"component":"%s","directory":"%s","files":["%s.tsx","%s.test.tsx","%s.types.ts","%s.figma.tsx","index.ts"]}\n' \
        "$COMPONENT_NAME" "$COMPONENT_DIR" "$COMPONENT_NAME" "$COMPONENT_NAME" "$COMPONENT_NAME" "$COMPONENT_NAME"
else
    echo ""
    log_success "Component scaffolded!"
    echo ""
    echo "📁 Location: $COMPONENT_DIR"
    echo ""
    echo "📄 Files created:"
    echo "   - ${COMPONENT_NAME}.tsx          Main component"
    echo "   - ${COMPONENT_NAME}.test.tsx     Unit tests"
    echo "   - ${COMPONENT_NAME}.types.ts     TypeScript types"
    echo "   - ${COMPONENT_NAME}.figma.tsx    Figma Code Connect"
    echo "   - index.ts                       Barrel export"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Update the component barrel export:"
    echo "      packages/@dsai-io/react/src/components/index.ts"
    echo "   2. Implement the component logic"
    echo "   3. Run tests: nx test @dsai-io/react --testFile=${COMPONENT_NAME}"
    echo ""
fi
