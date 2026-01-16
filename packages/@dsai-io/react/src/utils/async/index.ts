/**
 * @file Async & Control Flow utilities
 * @module @dsai-io/react/utils/async
 *
 * Enterprise-grade async utilities including:
 * - Retry with exponential backoff
 * - Promise timeout wrapper
 * - Abortable promises
 * - Task queuing and scheduling
 */

// Backoff utilities
export { exponentialBackoff } from './exponentialBackoff';
export type { ExponentialBackoffOptions } from './exponentialBackoff';

// Retry utilities
export { retryWithBackoff } from './retryWithBackoff';
export type { RetryResult, RetryWithBackoffOptions } from './retryWithBackoff';

// Timeout utilities
export { TimeoutError, withTimeout } from './withTimeout';
export type { WithTimeoutOptions } from './withTimeout';

// Abort utilities
export { createAbortable } from './createAbortable';
export type { AbortablePromise } from './createAbortable';

// Task queue utilities
export { createTaskQueue } from './createTaskQueue';
export type {
  QueuedTask,
  TaskFunction,
  TaskQueue,
  TaskQueueOptions,
  TaskQueueState,
} from './createTaskQueue';

// Task scheduling utilities
export { queueTask } from './queueTask';
export type { QueueTaskOptions, QueuedTaskHandle, TaskSchedule } from './queueTask';
