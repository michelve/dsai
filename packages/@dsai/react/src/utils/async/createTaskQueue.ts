/**
 * @file createTaskQueue - Task queue for animations/transitions
 * @module @dsai/react/utils/async
 *
 * Enterprise-grade task queue with:
 * - Sequential or concurrent execution
 * - Priority support
 * - Pause/resume functionality
 * - Task cancellation
 * - Progress tracking
 */

/**
 * Task function type
 */
export type TaskFunction<T = void> = () => Promise<T> | T;

/**
 * Task item in the queue
 */
export interface QueuedTask<T = void> {
  /** Unique task ID */
  id: string;
  /** Task function to execute */
  fn: TaskFunction<T>;
  /** Task priority (higher = earlier execution) */
  priority: number;
  /** Promise that resolves when task completes */
  promise: Promise<T>;
  /** Resolve function for the task promise */
  resolve: (value: T) => void;
  /** Reject function for the task promise */
  reject: (error: unknown) => void;
}

/**
 * Options for task queue
 */
export interface TaskQueueOptions {
  /** Maximum concurrent tasks (default: 1 for sequential) */
  concurrency?: number;
  /** Whether to auto-start processing (default: true) */
  autoStart?: boolean;
}

/**
 * Task queue state
 */
export interface TaskQueueState {
  /** Number of pending tasks */
  pending: number;
  /** Number of currently running tasks */
  running: number;
  /** Whether the queue is paused */
  paused: boolean;
  /** Whether the queue is processing */
  processing: boolean;
}

/**
 * Task queue instance
 */
export interface TaskQueue {
  /** Add a task to the queue */
  enqueue: <T>(fn: TaskFunction<T>, priority?: number) => Promise<T>;
  /** Pause queue processing */
  pause: () => void;
  /** Resume queue processing */
  resume: () => void;
  /** Clear all pending tasks */
  clear: () => void;
  /** Get current queue state */
  getState: () => TaskQueueState;
  /** Wait for all tasks to complete */
  drain: () => Promise<void>;
}

let taskIdCounter = 0;

/**
 * Create a task queue for managing async operations
 *
 * Useful for coordinating animations, transitions, or any
 * operations that need to run in a controlled sequence.
 *
 * @param options - Queue configuration options
 * @returns Task queue instance
 *
 * @example
 * ```tsx
 * // Sequential queue (default)
 * const queue = createTaskQueue();
 *
 * queue.enqueue(async () => {
 *   await animateIn(element1);
 * });
 *
 * queue.enqueue(async () => {
 *   await animateIn(element2);
 * });
 *
 * // Elements animate one after another
 *
 * // Concurrent queue
 * const parallelQueue = createTaskQueue({ concurrency: 3 });
 *
 * // Up to 3 tasks run simultaneously
 * urls.forEach(url => {
 *   parallelQueue.enqueue(() => fetch(url));
 * });
 *
 * // With priority
 * const queue = createTaskQueue();
 *
 * queue.enqueue(() => lowPriorityTask(), 1);
 * queue.enqueue(() => highPriorityTask(), 10); // Runs first
 * queue.enqueue(() => mediumPriorityTask(), 5);
 *
 * // Pause/resume
 * const queue = createTaskQueue();
 *
 * queue.enqueue(() => task1());
 * queue.pause();
 * queue.enqueue(() => task2()); // Queued but not executed
 * queue.resume(); // task2 starts
 *
 * // Wait for completion
 * await queue.drain();
 * console.log('All tasks complete');
 *
 * // In React component
 * const queueRef = useRef(createTaskQueue());
 *
 * const handleClick = () => {
 *   queueRef.current.enqueue(async () => {
 *     await animateButton();
 *   });
 * };
 * ```
 */
export function createTaskQueue(options: TaskQueueOptions = {}): TaskQueue {
  const { concurrency = 1, autoStart = true } = options;

  const queue: QueuedTask<unknown>[] = [];
  let running = 0;
  let paused = !autoStart;
  let drainResolvers: (() => void)[] = [];

  const processNext = async (): Promise<void> => {
    if (paused || running >= concurrency || queue.length === 0) {
      // Check if we should resolve drain promises
      if (running === 0 && queue.length === 0) {
        drainResolvers.forEach((resolve) => {
          resolve();
        });
        drainResolvers = [];
      }
      return;
    }

    // Sort by priority (higher first) and get next task
    queue.sort((a, b) => b.priority - a.priority);
    const task = queue.shift();

    if (!task) {
      return;
    }

    running++;

    try {
      const result = await task.fn();
      task.resolve(result);
    } catch (error) {
      task.reject(error);
    } finally {
      running--;
      // Process next task
      processNext();
    }
  };

  return {
    enqueue<T>(fn: TaskFunction<T>, priority = 0): Promise<T> {
      let resolve!: (value: T) => void;
      let reject!: (error: unknown) => void;

      const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
      });

      const task: QueuedTask<T> = {
        id: `task-${++taskIdCounter}`,
        fn,
        priority,
        promise,
        resolve,
        reject,
      };

      queue.push(task as QueuedTask<unknown>);

      // Start processing if not paused
      if (!paused) {
        processNext();
      }

      return promise;
    },

    pause(): void {
      paused = true;
    },

    resume(): void {
      paused = false;
      // Start processing any queued tasks
      for (let i = 0; i < concurrency; i++) {
        processNext();
      }
    },

    clear(): void {
      // Reject all pending tasks
      queue.forEach((task) => {
        task.reject(new Error('Task queue cleared'));
      });
      queue.length = 0;
    },

    getState(): TaskQueueState {
      return {
        pending: queue.length,
        running,
        paused,
        processing: running > 0,
      };
    },

    drain(): Promise<void> {
      if (running === 0 && queue.length === 0) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        drainResolvers.push(resolve);
      });
    },
  };
}
