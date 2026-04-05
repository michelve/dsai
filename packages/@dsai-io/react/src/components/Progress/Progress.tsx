import { useMemo } from 'react';

import { cn } from '../../utils';

import type {
  ProgressBarProps,
  ProgressCircleProps,
  ProgressGradient,
  ProgressProps,
} from './Progress.types';

const PROGRESS_BAR_CLASS = 'progress-bar';
const PROGRESS_BAR_STRIPED_CLASS = 'progress-bar-striped';
const PROGRESS_BAR_ANIMATED_CLASS = 'progress-bar-animated';

/** CSS class for the progress bar element */
const PROGRESS_BAR_CLASS = 'progress-bar';

const resolveHeightForSize = (size: ProgressProps['size'] = 'md'): string => {
  if (size === 'sm') {
    return '0.5rem';
  }
  if (size === 'lg') {
    return '1.5rem';
  }
  return '1rem';
};

// =============================================================================
// Shared helpers (extracted to reduce per-component complexity)
// =============================================================================

/** Clamp a value to [0, 100] */
function clampPercentage(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/** Build CSS gradient background string */
function buildGradientBackground(gradient: ProgressGradient): string {
  return `linear-gradient(${gradient.direction || 'to right'}, ${gradient.from}, ${gradient.to})`;
}

/** Build bar CSS classes shared by ProgressBar and ProgressBase */
function buildBarClasses(
  variant: string,
  gradient: ProgressGradient | undefined,
  striped: boolean,
  animated: boolean,
  extra?: string,
): string {
  const isWarning = variant === 'warning';
  return cn(
    PROGRESS_BAR_CLASS,
    !gradient && `bg-${variant}`,
    isWarning && !gradient && 'text-dark',
    striped && PROGRESS_BAR_STRIPED_CLASS,
    animated && PROGRESS_BAR_ANIMATED_CLASS,
    extra,
  );
}

/** Build bar inline style with optional gradient */
function buildBarStyle(
  widthPercent: string,
  gradient: ProgressGradient | undefined,
): React.CSSProperties {
  return {
    width: widthPercent,
    ...(gradient && { background: buildGradientBackground(gradient) }),
  };
}

/** Compute display value: formatValue > valueText > default percentage string */
function resolveDisplayValue(
  percentage: number,
  max: number,
  formatValue?: (value: number, max: number) => React.ReactNode,
  valueText?: string,
): React.ReactNode {
  if (formatValue) {
    return formatValue(percentage, max);
  }
  return valueText ?? `${percentage}%`;
}


// =============================================================================
// ProgressBar Component
// =============================================================================

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
  formatValue,
  gradient,
  striped = false,
  animated = false,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = false,
  'data-testid': dataTestId,
  'data-test': dataTest,
}: ProgressBarProps): React.JSX.Element {
  const percentage = Math.min(100, Math.max(0, value));
  const isWarning = variant === 'warning';

  const barClasses = cn(
    PROGRESS_BAR_CLASS,
    !gradient && `bg-${variant}`,
    isWarning && !gradient && 'text-dark',
    striped && 'progress-bar-striped',
    animated && 'progress-bar-animated',
    className
  );

  // Compute display value using formatValue (takes precedence) or valueText or default
  const displayValue = formatValue ? formatValue(percentage, 100) : valueText || `${percentage}%`;

  // Build bar style (gradient overrides variant bg)
  const barStyle: React.CSSProperties = {
    width: `${percentage}%`,
    ...(gradient && {
      background: `linear-gradient(${gradient.direction || 'to right'}, ${gradient.from}, ${gradient.to})`,
    }),
  };

  // Generate default aria-label from variant if not provided (and not hidden)
  const computedAriaLabel = ariaHidden
    ? undefined
    : ariaLabel || `${variant} progress: ${percentage}%`;

  // If aria-hidden, render as purely decorative (no ARIA attributes)
  if (ariaHidden) {
    return (
      <div
        className={barClasses}
        style={barStyle}
        aria-hidden="true"
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {showValue && displayValue}
      </div>
    );
  }

  return (
    <div
      className={barClasses}
      role="progressbar"
      style={barStyle}
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={computedAriaLabel}
      data-testid={dataTestId}
      data-test={dataTest}
    >
      {showValue && displayValue}
    </div>
  );
}

ProgressBar.displayName = 'Progress.Bar';

/**
 * Render discrete step segments for the progress bar (Ant Design-style)
 */
function renderSteps(
  steps: number,
  percentage: number,
  barClasses: string,
  _barStyle: React.CSSProperties,
  gradient?: { from: string; to: string; direction?: string }
): React.JSX.Element {
  const filledSteps = Math.round((percentage / 100) * steps);
  const gapSize = 2; // px gap between segments

  return (
    <>
      {Array.from({ length: steps }, (_, i) => {
        const isFilled = i < filledSteps;
        // For gradient, interpolate color per segment
        const segmentStyle: React.CSSProperties = {
          width: `calc(${100 / steps}% - ${gapSize}px)`,
          marginRight: i < steps - 1 ? `${gapSize}px` : undefined,
          opacity: isFilled ? 1 : 0.2,
          ...(isFilled &&
            gradient && {
              background: `linear-gradient(${gradient.direction || 'to right'}, ${gradient.from}, ${gradient.to})`,
            }),
        };

        return (
          <div
            key={i}
            className={isFilled ? barClasses : PROGRESS_BAR_CLASS}
            style={segmentStyle}
            aria-hidden="true"
            data-step={i + 1}
          />
        );
      })}
    </>
  );
}

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
/** Build gradient background style */
function buildGradientStyle(gradient?: { from: string; to: string; direction?: string }): React.CSSProperties {
  if (!gradient) { return {}; }
  return {
    background: `linear-gradient(${gradient.direction || 'to right'}, ${gradient.from}, ${gradient.to})`,
  };
}

/** Build bar classes for the progress bar */
function buildBarClasses(
  variant: string,
  gradient: ProgressProps['gradient'],
  striped: boolean,
  animated: boolean,
  indeterminate: boolean,
): string {
  const isWarning = variant === 'warning';
  return cn(
    PROGRESS_BAR_CLASS,
    !gradient && `bg-${variant}`,
    isWarning && !gradient && 'text-dark',
    striped && 'progress-bar-striped',
    (animated || indeterminate) && 'progress-bar-animated',
    indeterminate && 'progress-bar-striped',
  );
}

/** Build the main bar style */
function buildMainBarStyle(
  percentage: number,
  indeterminate: boolean,
  gradient?: ProgressProps['gradient'],
): React.CSSProperties {
  return {
    width: indeterminate ? '100%' : `${percentage}%`,
    ...(indeterminate && { animation: 'progress-bar-stripes 1s linear infinite' }),
    ...buildGradientStyle(gradient),
  };
}

/** Compute the display value text */
function computeDisplayValue(
  percentage: number,
  max: number,
  formatValue?: (value: number, max: number) => React.ReactNode,
  valueText?: string,
): React.ReactNode {
  if (formatValue) { return formatValue(percentage, max); }
  return valueText || `${percentage}%`;
}

/** Compute aria-valuetext for accessibility */
function computeAriaValueText(
  indeterminate: boolean,
  displayValue: React.ReactNode,
  valueText?: string,
  percentage = 0,
): string {
  if (indeterminate) { return 'Loading'; }
  if (typeof displayValue === 'string') { return displayValue; }
  return valueText || `${percentage}%`;
}

/** Render the buffer bar (MUI-style lighter background) */
function renderBufferBar(
  bufferPercentage: number,
  variant: string,
  gradient: ProgressProps['gradient'],
  dataTestId?: string,
): React.JSX.Element {
  return (
    <div
      className={cn(PROGRESS_BAR_CLASS, !gradient && `bg-${variant}`)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: `${bufferPercentage}%`,
        opacity: 0.3,
        ...buildGradientStyle(gradient),
      }}
      aria-hidden="true"
      data-testid={dataTestId ? `${dataTestId}-buffer` : undefined}
    />
  );
}

function ProgressBase({
  value,
  variant = 'primary',
  size = 'md',
  label,
  showValue = false,
  valueText,
  formatValue,
  bufferValue,
  steps,
  gradient,
  indeterminate = false,
  striped = false,
  animated = false,
  min = 0,
  max = 100,
  children,
  className,
  style,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'data-testid': dataTestId,
  'data-test': dataTest,
}: ProgressProps): React.JSX.Element {
  const percentage = indeterminate ? 0 : Math.min(100, Math.max(0, value ?? 0));
  const hasChildren = Boolean(children);
  const progressClasses = cn('progress', className);
  const barClasses = buildBarClasses(variant, gradient, striped, animated, indeterminate);
  const displayValue = computeDisplayValue(percentage, max, formatValue, valueText);
  const computedValueText = computeAriaValueText(indeterminate, displayValue, valueText, percentage);
  const bufferPercentage =
    bufferValue != null ? Math.min(100, Math.max(0, bufferValue)) : undefined;
  const barStyle = buildMainBarStyle(percentage, indeterminate, gradient);

  return (
    <div className="d-flex flex-column gap-1">
      {label && (
        <div className="d-flex justify-content-between align-items-center">
          <span className="small text-body-secondary">{label}</span>
          {showValue && !indeterminate && !hasChildren && (
            <span className="small fw-medium">{displayValue}</span>
          )}
        </div>
      )}

      <div
        className={progressClasses}
        style={{
          height: resolveHeightForSize(size),
          ...(bufferPercentage != null && { position: 'relative' as const }),
          ...style,
        }}
        id={id}
        role={hasChildren ? 'group' : 'progressbar'}
        data-testid={dataTestId}
        data-test={dataTest}
        {...(!hasChildren && {
          'aria-label': ariaLabel,
          'aria-labelledby': ariaLabelledBy,
          'aria-valuenow': indeterminate ? undefined : percentage,
          'aria-valuemin': min,
          'aria-valuemax': max,
          'aria-valuetext': computedValueText,
          'aria-busy': indeterminate,
        })}
      >
        {hasChildren ? (
          children
        ) : steps != null && steps > 0 ? (
          renderSteps(steps, percentage, barClasses, barStyle, gradient)
        ) : (
          <>
            {bufferPercentage != null && renderBufferBar(bufferPercentage, variant, gradient, dataTestId)}
            <div
              className={barClasses}
              style={{
                ...barStyle,
                ...(bufferPercentage != null && { position: 'relative' as const, zIndex: 1 }),
              }}
            >
              {showValue && !indeterminate && !label && displayValue}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

ProgressBase.displayName = 'Progress';

let circleGradientId = 0;

function getNextGradientId(): number {
  circleGradientId += 1;
  return circleGradientId;
}

/**
 * Circular Progress indicator (MUI/Ant Design-style)
 *
 * SVG-based ring progress for dashboards and compact displays.
 *
 * @example
 * ```tsx
 * <Progress.Circle value={75} showValue />
 * <Progress.Circle indeterminate variant="info" />
 * ```
 */
function ProgressCircle({
  value,
  variant = 'primary',
  size = 80,
  strokeWidth = 6,
  showValue = false,
  valueText,
  formatValue,
  gradient,
  indeterminate = false,
  min = 0,
  max = 100,
  className,
  style,
  id,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
  'data-test': dataTest,
}: ProgressCircleProps): React.JSX.Element {
  const percentage = indeterminate ? 0 : Math.min(100, Math.max(0, value ?? 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Compute display value
  const displayValue = formatValue ? formatValue(percentage, max) : valueText ?? `${percentage}%`;

  // Compute aria-valuetext (must be string)
  let computedValueText: string;
  if (indeterminate) {
    computedValueText = 'Loading';
  } else if (typeof displayValue === 'string') {
    computedValueText = displayValue;
  } else {
    computedValueText = valueText ?? `${percentage}%`;
  }

  // Unique gradient ID per instance — stable per component mount
   
  const gradientIdRef = useMemo(() => `dsai-circle-gradient-${getNextGradientId()}`, []);

  // Use Bootstrap 5 CSS custom properties for variant colors (no hardcoded hex)
  const strokeColor = gradient ? `url(#${gradientIdRef})` : `var(--bs-${variant})`;

  return (
    <div
      className={cn('dsai-progress-circle', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: size,
        height: size,
        ...style,
      }}
      id={id}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : percentage}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={computedValueText}
      aria-label={ariaLabel}
      aria-busy={indeterminate || undefined}
      data-testid={dataTestId}
      data-test={dataTest}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        style={{
          transform: 'rotate(-90deg)',
          ...(indeterminate && {
            animation: 'dsai-circle-spin 1.4s linear infinite',
          }),
        }}
      >
        {/* Gradient definition */}
        {gradient && (
          <defs>
            <linearGradient id={gradientIdRef} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradient.from} />
              <stop offset="100%" stopColor={gradient.to} />
            </linearGradient>
          </defs>
        )}

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity={0.15}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={indeterminate ? circumference * 0.75 : strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: indeterminate ? 'none' : 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>

      {/* Center value display */}
      {showValue && !indeterminate && (
        <span
          style={{
            position: 'absolute',
            fontSize: size * 0.22,
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {displayValue}
        </span>
      )}

      {/* Indeterminate animation styles (injected once) */}
      {indeterminate && (
        <style>{`
          @keyframes dsai-circle-spin {
            0% { transform: rotate(-90deg); }
            100% { transform: rotate(270deg); }
          }
        `}</style>
      )}
    </div>
  );
}

ProgressCircle.displayName = 'Progress.Circle';

// Create compound component
type ProgressComponent = typeof ProgressBase & {
  Bar: typeof ProgressBar;
  Circle: typeof ProgressCircle;
};

export const Progress = ProgressBase as ProgressComponent;
Progress.Bar = ProgressBar;
Progress.Circle = ProgressCircle;
