import { isBrowser } from '../browser';

/**
 * Gets the device pixel ratio for high-DPI displays.
 *
 * Returns the ratio of physical pixels to CSS pixels. Useful for
 * loading appropriate image resolutions or canvas scaling.
 *
 * **Key Features**:
 * - Returns window.devicePixelRatio
 * - Defaults to 1 if unavailable
 * - SSR-safe
 *
 * @returns Device pixel ratio (1 in SSR)
 *
 * @example
 * ```tsx
 * function HiDPIImage({ src }: { src: string }) {
 *   const dpr = getDevicePixelRatio();
 *   const imageSrc = dpr && dpr >= 2 ? `${src}@2x.png` : `${src}.png`;
 *
 *   return <img src={imageSrc} alt="High DPI aware" />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Canvas scaling for Retina displays
 * function CanvasDrawing() {
 *   const canvasRef = useRef<HTMLCanvasElement>(null);
 *
 *   useEffect(() => {
 *     const canvas = canvasRef.current;
 *     if (!canvas) return;
 *
 *     const ctx = canvas.getContext('2d');
 *     const dpr = getDevicePixelRatio() || 1;
 *
 *     // Scale canvas for high DPI
 *     canvas.width = canvas.offsetWidth * dpr;
 *     canvas.height = canvas.offsetHeight * dpr;
 *     ctx?.scale(dpr, dpr);
 *   }, []);
 *
 *   return <canvas ref={canvasRef} />;
 * }
 * ```
 */
export function getDevicePixelRatio(): number | null {
  if (!isBrowser()) {
    return null;
  }

  return window.devicePixelRatio || 1;
}
