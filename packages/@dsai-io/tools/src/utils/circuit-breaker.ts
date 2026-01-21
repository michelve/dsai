/**
 * @fileoverview Circuit Breaker pattern implementation
 * Prevents cascade failures by tracking error rates and temporarily blocking requests
 */

/**
 * Circuit breaker states
 */
export enum CircuitState {
  /** Normal operation - requests are allowed */
  CLOSED = 'CLOSED',
  /** Failing - all requests are rejected immediately */
  OPEN = 'OPEN',
  /** Testing recovery - limited requests are allowed */
  HALF_OPEN = 'HALF_OPEN',
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  /** Number of failures before opening circuit */
  failureThreshold?: number;
  /** Time in ms before attempting to close circuit */
  cooldownMs?: number;
  /** Request timeout in ms */
  timeout?: number;
  /** Name for logging */
  name?: string;
}

/**
 * Circuit breaker statistics
 */
export interface CircuitBreakerStats {
  /** Current state */
  state: CircuitState;
  /** Total failures */
  failures: number;
  /** Total successes */
  successes: number;
  /** Total calls */
  totalCalls: number;
  /** Time circuit opened (if open) */
  openedAt?: Date;
  /** Time circuit will attempt to close */
  resetAt?: Date;
  /** Last error */
  lastError?: string;
}

/**
 * Circuit breaker error thrown when circuit is open
 */
export class CircuitBreakerOpenError extends Error {
  constructor(
    public readonly circuitName: string,
    public readonly resetAt: Date
  ) {
    super(`Circuit breaker "${circuitName}" is open. Will retry at ${resetAt.toISOString()}`);
    this.name = 'CircuitBreakerOpenError';
  }
}

/**
 * Circuit breaker implementation
 * Tracks failures and opens circuit to prevent cascade failures
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures = 0;
  private successes = 0;
  private totalCalls = 0;
  private openedAt?: Date;
  private resetAt?: Date;
  private lastError?: string;

  private readonly failureThreshold: number;
  private readonly cooldownMs: number;
  private readonly timeout: number;
  private readonly name: string;

  constructor(config: CircuitBreakerConfig = {}) {
    this.failureThreshold = config.failureThreshold ?? 5;
    this.cooldownMs = config.cooldownMs ?? 30000; // 30 seconds
    this.timeout = config.timeout ?? 10000; // 10 seconds
    this.name = config.name ?? 'CircuitBreaker';
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.totalCalls++;

    // Check if circuit should transition from OPEN to HALF_OPEN
    if (this.state === CircuitState.OPEN && this.canAttemptReset()) {
      this.state = CircuitState.HALF_OPEN;
      this.failures = 0; // Reset failure count for half-open state
    }

    // Reject immediately if circuit is open
    if (this.state === CircuitState.OPEN) {
      if (!this.resetAt) {
        throw new Error(`Circuit breaker "${this.name}" is open but has no reset time`);
      }
      throw new CircuitBreakerOpenError(this.name, this.resetAt);
    }

    try {
      // Execute with timeout
      const result = await this.executeWithTimeout(fn);

      // Record success
      this.onSuccess();

      return result;
    } catch (error) {
      // Record failure
      this.onFailure(error);
      throw error;
    }
  }

  /**
   * Execute function with timeout
   */
  private async executeWithTimeout<T>(fn: () => Promise<T>): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Circuit breaker timeout after ${this.timeout}ms`));
        }, this.timeout);
      }),
    ]);
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.successes++;

    if (this.state === CircuitState.HALF_OPEN) {
      // Successful call in HALF_OPEN state closes the circuit
      this.state = CircuitState.CLOSED;
      this.failures = 0;
      this.openedAt = undefined;
      this.resetAt = undefined;
      this.lastError = undefined;
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(error: unknown): void {
    this.failures++;
    this.lastError = error instanceof Error ? error.message : String(error);

    if (this.state === CircuitState.HALF_OPEN) {
      // Failure in HALF_OPEN state immediately reopens circuit
      this.openCircuit();
    } else if (this.failures >= this.failureThreshold) {
      // Threshold reached, open circuit
      this.openCircuit();
    }
  }

  /**
   * Open the circuit
   */
  private openCircuit(): void {
    this.state = CircuitState.OPEN;
    this.openedAt = new Date();
    this.resetAt = new Date(Date.now() + this.cooldownMs);
  }

  /**
   * Check if circuit can attempt reset
   */
  private canAttemptReset(): boolean {
    if (!this.resetAt) {
      return false;
    }
    return Date.now() >= this.resetAt.getTime();
  }

  /**
   * Get current circuit breaker state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Get circuit breaker statistics
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      totalCalls: this.totalCalls,
      openedAt: this.openedAt,
      resetAt: this.resetAt,
      lastError: this.lastError,
    };
  }

  /**
   * Manually reset circuit breaker
   */
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    this.successes = 0;
    this.totalCalls = 0;
    this.openedAt = undefined;
    this.resetAt = undefined;
    this.lastError = undefined;
  }

  /**
   * Check if circuit is open
   */
  isOpen(): boolean {
    return this.state === CircuitState.OPEN;
  }

  /**
   * Check if circuit is closed
   */
  isClosed(): boolean {
    return this.state === CircuitState.CLOSED;
  }

  /**
   * Check if circuit is half-open
   */
  isHalfOpen(): boolean {
    return this.state === CircuitState.HALF_OPEN;
  }
}
