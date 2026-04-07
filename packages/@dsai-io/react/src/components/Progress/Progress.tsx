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

/** Build bar CSS classes shared by ProgressBar and ProgressBase */
function buildBarClasses(
  variant: string,
  gradient: ProgressGradient | undefined,
  striped: boolean,
  animated: boolean,
  extra?: string
): string {
  const isWarning = variant === 'warning';
  return cn(
    PROGRESS_BAR_CLASS,
    !gradient && `bg-${variant}`,
    isWarning && !gradient && 'text-dark',
    striped && PROGRESS_BAR_STRIPED_CLASS,
    animated && PROGRESS_BAR_ANIMATED_CLASS,
    extra
  );
}

/** Compute aria-label for a progress bar segment */
function computeBarAriaLabel(
  ariaHidden: boolean,
  ariaLabel: string | undefined,
  variant: string,
  percentage: number
): string | undefined {
  if (ariaHidden) {
    return undefined;
  }
  return ariaLabel || `${variant} progress: ${percentage}%`;
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
}: Readonly<ProgressBarProps>): React.JSX.Element {
  const percentage = Math.min(100, Math.max(0, value));
  const barClasses = buildBarClasses(variant, gradient, striped, animated, className);
  const displayValue = computeDisplayValue(percentage, 100, formatValue, valueText);
  const barStyle: React.CSSProperties = {
    width: `${percentage}%`,
    ...buildGradientStyle(gradient),
  };
  const computedAriaLabel = computeBarAriaLabel(ariaHidden, ariaLabel, variant, percentage);

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
function buildGradientStyle(gradient?: {
  from: string;
  to: string;
  direction?: string;
}): React.CSSProperties {
  if (!gradient) {
    return {};
  }
  return {
    background: `linear-gradient(${gradient.direction || 'to right'}, ${gradient.from}, ${gradient.to})`,
  };
}

/** Build the main bar style */
function buildMainBarStyle(
  percentage: number,
  indeterminate: boolean,
  gradient?: ProgressProps['gradient']
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
  valueText?: string
): React.ReactNode {
  if (formatValue) {
    return formatValue(percentage, max);
  }
  return valueText || `${percentage}%`;
}

/** Compute aria-valuetext for accessibility */
function computeAriaValueText(
  indeterminate: boolean,
  displayValue: React.ReactNode,
  valueText?: string,
  percentage = 0
): string {
  if (indeterminate) {
    return 'Loading';
  }
  if (typeof displayValue === 'string') {
    return displayValue;
  }
  return valueText || `${percentage}%`;
}

/** Render the buffer bar (MUI-style lighter background) */
function renderBufferBar(
  bufferPercentage: number,
  variant: string,
  gradient: ProgressProps['gradient'],
  dataTestId?: string
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

/** Build ARIA attributes for the progress container (non-stacked mode) */
function buildProgressAriaProps(
  ariaLabel: string | undefined,
  ariaLabelledBy: string | undefined,
  indeterminate: boolean,
  percentage: number,
  min: number,
  max: number,
  computedValueText: string
): Record<string, unknown> {
  return {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-valuenow': indeterminate ? undefined : percentage,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-valuetext': computedValueText,
    'aria-busy': indeterminate,
  };
}

/** Options for renderDefaultBar */
interface DefaultBarOptions {
  barClasses: string;
  barStyle: React.CSSProperties;
  bufferPercentage: number | undefined;
  variant: string;
  gradient: ProgressProps['gradient'];
  showValue: boolean;
  indeterminate: boolean;
  label: React.ReactNode | undefined;
  displayValue: React.ReactNode;
  dataTestId: string | undefined;
}

/** Render the inner bar content (default single-bar mode) */
function renderDefaultBar(opts: DefaultBarOptions): React.JSX.Element {
  return (
    <>
      {opts.bufferPercentage != null &&
        renderBufferBar(opts.bufferPercentage, opts.variant, opts.gradient, opts.dataTestId)}
      <div
        className={opts.barClasses}
        style={{
          ...opts.barStyle,
          ...(opts.bufferPercentage != null && { position: 'relative' as const, zIndex: 1 }),
        }}
      >
        {opts.showValue && !opts.indeterminate && !opts.label && opts.displayValue}
      </div>
    </>
  );
}

/** Render the label row above the progress bar */
function renderProgressLabel(
  label: React.ReactNode | undefined,
  showValue: boolean,
  indeterminate: boolean,
  hasChildren: boolean,
  displayValue: React.ReactNode
): React.ReactNode {
  if (!label) {
    return null;
  }
  return (
    <div className="d-flex justify-content-between align-items-center">
      <span className="small text-body-secondary">{label}</span>
      {showValue && !indeterminate && !hasChildren && (
        <span className="small fw-medium">{displayValue}</span>
      )}
    </div>
  );
}

/** Determine the inner content of the progress bar container */
function resolveProgressContent(
  hasChildren: boolean,
  children: React.ReactNode,
  steps: number | undefined,
  opts: {
    percentage: number;
    barClasses: string;
    barStyle: React.CSSProperties;
    gradient: ProgressProps['gradient'];
    defaultBarOpts: DefaultBarOptions;
  }
): React.ReactNode {
  if (hasChildren) {
    return children;
  }
  if (steps != null && steps > 0) {
    return renderSteps(steps, opts.percentage, opts.barClasses, opts.barStyle, opts.gradient);
  }
  return renderDefaultBar(opts.defaultBarOpts);
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
}: Readonly<ProgressProps>): React.JSX.Element {
  const percentage = indeterminate ? 0 : Math.min(100, Math.max(0, value ?? 0));
  const hasChildren = Boolean(children);
  const progressClasses = cn('progress', className);
  const barClasses = buildBarClasses(
    variant,
    gradient,
    striped || indeterminate,
    animated || indeterminate
  );
  const displayValue = computeDisplayValue(percentage, max, formatValue, valueText);
  const computedValueText = computeAriaValueText(
    indeterminate,
    displayValue,
    valueText,
    percentage
  );
  const bufferPercentage =
    bufferValue == null ? undefined : Math.min(100, Math.max(0, bufferValue));
  const barStyle = buildMainBarStyle(percentage, indeterminate, gradient);

  const defaultBarOpts: DefaultBarOptions = {
    barClasses,
    barStyle,
    bufferPercentage,
    variant,
    gradient,
    showValue,
    indeterminate,
    label,
    displayValue,
    dataTestId,
  };

  const content = resolveProgressContent(hasChildren, children, steps, {
    percentage,
    barClasses,
    barStyle,
    gradient,
    defaultBarOpts: defaultBarOpts,
  });

  return (
    <div className="d-flex flex-column gap-1">
      {renderProgressLabel(label, showValue, indeterminate, hasChildren, displayValue)}

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
        {...(!hasChildren &&
          buildProgressAriaProps(
            ariaLabel,
            ariaLabelledBy,
            indeterminate,
            percentage,
            min,
            max,
            computedValueText
          ))}
      >
        {content}
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

/** Compute SVG circle geometry */
function computeCircleGeometry(
  size: number,
  strokeWidth: number,
  percentage: number
): { radius: number; circumference: number; strokeDashoffset: number } {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return { radius, circumference, strokeDashoffset };
}

/** Resolve stroke color from gradient or variant */
function resolveStrokeColor(
  gradient: ProgressGradient | undefined,
  gradientId: string,
  variant: string
): string {
  return gradient ? `url(#${gradientId})` : `var(--bs-${variant})`;
}

/** Render the SVG ring for circular progress */
function renderCircleSvg(
  geo: { radius: number; circumference: number; strokeDashoffset: number },
  opts: {
    size: number;
    strokeWidth: number;
    strokeColor: string;
    gradient?: ProgressGradient;
    gradientId: string;
    indeterminate: boolean;
  }
): React.JSX.Element {
  return (
    <svg
      width={opts.size}
      height={opts.size}
      viewBox={`0 0 ${opts.size} ${opts.size}`}
      aria-hidden="true"
      style={{
        transform: 'rotate(-90deg)',
        ...(opts.indeterminate && {
          animation: 'dsai-circle-spin 1.4s linear infinite',
        }),
      }}
    >
      {opts.gradient && (
        <defs>
          <linearGradient id={opts.gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={opts.gradient.from} />
            <stop offset="100%" stopColor={opts.gradient.to} />
          </linearGradient>
        </defs>
      )}
      <circle
        cx={opts.size / 2}
        cy={opts.size / 2}
        r={geo.radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={opts.strokeWidth}
        opacity={0.15}
      />
      <circle
        cx={opts.size / 2}
        cy={opts.size / 2}
        r={geo.radius}
        fill="none"
        stroke={opts.strokeColor}
        strokeWidth={opts.strokeWidth}
        strokeDasharray={geo.circumference}
        strokeDashoffset={opts.indeterminate ? geo.circumference * 0.75 : geo.strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: opts.indeterminate ? 'none' : 'stroke-dashoffset 0.3s ease' }}
      />
    </svg>
  );
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
}: Readonly<ProgressCircleProps>): React.JSX.Element {
  const percentage = indeterminate ? 0 : Math.min(100, Math.max(0, value ?? 0));
  const geo = computeCircleGeometry(size, strokeWidth, percentage);
  const displayValue = computeDisplayValue(percentage, max, formatValue, valueText);
  const computedValueText = computeAriaValueText(
    indeterminate,
    displayValue,
    valueText,
    percentage
  );

  // Unique gradient ID per instance — stable per component mount

  const gradientIdRef = useMemo(() => `dsai-circle-gradient-${getNextGradientId()}`, []);

  const strokeColor = resolveStrokeColor(gradient, gradientIdRef, variant);

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
      {renderCircleSvg(geo, {
        size,
        strokeWidth,
        strokeColor,
        gradient,
        gradientId: gradientIdRef,
        indeterminate,
      })}

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
