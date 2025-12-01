import type { ProgressBarProps, ProgressProps } from './Progress.types';

/**
 * Progress Bar - individual bar for stacked progress
 *
 * @example
 * ```tsx
 * <Progress>
 *   <Progress.Bar value={15} variant="success" />
 *   <Progress.Bar value={30} variant="warning" />
 *   <Progress.Bar value={20} variant="danger" />
 * </Progress>
 * ```
 */
function ProgressBar({
  value,
  variant = 'primary',
  showValue = false,
  valueText,
  striped = false,
  animated = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = false,
}: ProgressBarProps): React.JSX.Element {
  const percentage = Math.min(100, Math.max(0, value));

  const barClasses = [
    'progress-bar',
    `bg-${variant}`,
    striped && 'progress-bar-striped',
    animated && 'progress-bar-animated',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Generate default aria-label from variant if not provided (and not hidden)
  const computedAriaLabel = ariaHidden
    ? undefined
    : ariaLabel || `${variant} progress: ${percentage}%`;

  // If aria-hidden, render as purely decorative (no ARIA attributes)
  if (ariaHidden) {
    return (
      <div className={barClasses} style={{ width: `${percentage}%` }} aria-hidden="true">
        {showValue && (valueText || `${percentage}%`)}
      </div>
    );
  }

  return (
    <div
      className={barClasses}
      role="progressbar"
      style={{ width: `${percentage}%` }}
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={computedAriaLabel}
    >
      {showValue && (valueText || `${percentage}%`)}
    </div>
  );
}

ProgressBar.displayName = 'Progress.Bar';

/**
 * Progress Component
 *
 * A Bootstrap 5 progress bar component for showing progress or loading states.
 * Supports determinate (with value) and indeterminate (loading) modes.
 *
 * @see https://getbootstrap.com/docs/5.3/components/progress/
 *
 * @example
 * ```tsx
 * // Basic progress bar
 * <Progress value={75} />
 *
 * // With label and value display
 * <Progress value={50} label="Uploading files..." showValue />
 *
 * // Indeterminate loading state
 * <Progress indeterminate variant="info" />
 *
 * // Striped and animated
 * <Progress value={60} striped animated variant="success" />
 *
 * // Different sizes
 * <Progress value={40} size="sm" />
 * <Progress value={40} size="lg" />
 *
 * // Stacked progress bars
 * <Progress>
 *   <Progress.Bar value={15} variant="success" />
 *   <Progress.Bar value={30} variant="warning" />
 *   <Progress.Bar value={20} variant="danger" />
 * </Progress>
 * ```
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - `role="progressbar"` for screen readers
 * - `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for progress state
 * - `aria-valuetext` for custom value descriptions
 * - `aria-busy="true"` for indeterminate state
 * - `aria-label` support for accessible naming
 */
function ProgressBase({
  value,
  variant = 'primary',
  size = 'md',
  label,
  showValue = false,
  valueText,
  indeterminate = false,
  striped = false,
  animated = false,
  min = 0,
  max = 100,
  children,
  className = '',
  style,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: ProgressProps): React.JSX.Element {
  const percentage = indeterminate ? 0 : Math.min(100, Math.max(0, value ?? 0));
  const hasChildren = Boolean(children);

  // Height classes for different sizes
  const heightStyle: Record<string, string> = {
    sm: '0.5rem', // 8px
    md: '1rem', // 16px (Bootstrap default)
    lg: '1.5rem', // 24px
  };

  // Build progress container classes
  const progressClasses = ['progress', className].filter(Boolean).join(' ');

  // Build progress bar classes (for single bar mode)
  const barClasses = [
    'progress-bar',
    `bg-${variant}`,
    striped && 'progress-bar-striped',
    (animated || indeterminate) && 'progress-bar-animated',
    indeterminate && 'progress-bar-striped', // Indeterminate uses striped animation
  ]
    .filter(Boolean)
    .join(' ');

  // Calculate aria-valuetext
  const computedValueText = indeterminate ? 'Loading' : valueText || `${percentage}%`;

  return (
    <div className="d-flex flex-column gap-1">
      {/* Optional label */}
      {label && (
        <div className="d-flex justify-content-between align-items-center">
          <span className="small text-body-secondary">{label}</span>
          {showValue && !indeterminate && !hasChildren && (
            <span className="small fw-medium">{valueText || `${percentage}%`}</span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div
        className={progressClasses}
        style={{ height: heightStyle[size], ...style }}
        id={id}
        role={hasChildren ? 'group' : 'progressbar'}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...(!hasChildren && {
          'aria-valuenow': indeterminate ? undefined : percentage,
          'aria-valuemin': min,
          'aria-valuemax': max,
          'aria-valuetext': computedValueText,
          'aria-busy': indeterminate,
        })}
      >
        {hasChildren ? (
          // Stacked progress bars
          children
        ) : (
          // Single progress bar
          <div
            className={barClasses}
            style={{
              width: indeterminate ? '100%' : `${percentage}%`,
              ...(indeterminate && {
                // Indeterminate animation override
                animation: 'progress-bar-stripes 1s linear infinite',
              }),
            }}
          >
            {showValue && !indeterminate && !label && (valueText || `${percentage}%`)}
          </div>
        )}
      </div>
    </div>
  );
}

ProgressBase.displayName = 'Progress';

// Create compound component
type ProgressComponent = typeof ProgressBase & {
  Bar: typeof ProgressBar;
};

export const Progress = ProgressBase as ProgressComponent;
Progress.Bar = ProgressBar;
