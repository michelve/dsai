/**
 * @fileoverview Tests for Circuit Breaker implementation
 */

import { CircuitBreaker, CircuitBreakerOpenError, CircuitState } from '../circuit-breaker.js';

describe('CircuitBreaker', () => {
  describe('initialization', () => {
    it('starts in CLOSED state', () => {
      const breaker = new CircuitBreaker();
      expect(breaker.getState()).toBe(CircuitState.CLOSED);
      expect(breaker.isClosed()).toBe(true);
      expect(breaker.isOpen()).toBe(false);
      expect(breaker.isHalfOpen()).toBe(false);
    });

    it('accepts custom configuration', () => {
      const breaker = new CircuitBreaker({
        failureThreshold: 3,
        cooldownMs: 5000,
        timeout: 2000,
        name: 'TestBreaker',
      });

      const stats = breaker.getStats();
      expect(stats.state).toBe(CircuitState.CLOSED);
    });
  });

  describe('successful execution', () => {
    it('executes function and returns result', async () => {
      const breaker = new CircuitBreaker();
      const fn = jest.fn(async () => 'success');

      const result = await breaker.execute(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(breaker.getState()).toBe(CircuitState.CLOSED);
    });

    it('tracks successful calls', async () => {
      const breaker = new CircuitBreaker();

      await breaker.execute(async () => 'result1');
      await breaker.execute(async () => 'result2');
      await breaker.execute(async () => 'result3');

      const stats = breaker.getStats();
      expect(stats.successes).toBe(3);
      expect(stats.totalCalls).toBe(3);
      expect(stats.failures).toBe(0);
    });
  });

  describe('failure handling', () => {
    it('tracks failures', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 10 });

      try {
        await breaker.execute(async () => {
          throw new Error('Test error');
        });
      } catch {
        // Expected error
      }

      const stats = breaker.getStats();
      expect(stats.failures).toBe(1);
      expect(stats.lastError).toBe('Test error');
    });

    it('opens circuit after threshold failures', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 3 });
      const failingFn = jest.fn(async () => {
        throw new Error('Failure');
      });

      // Execute 3 failing calls
      for (let i = 0; i < 3; i++) {
        try {
          await breaker.execute(failingFn);
        } catch {
          // Expected
        }
      }

      expect(breaker.getState()).toBe(CircuitState.OPEN);
      expect(breaker.isOpen()).toBe(true);
    });

    it('rejects calls immediately when circuit is open', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 2 });

      // Fail twice to open circuit
      for (let i = 0; i < 2; i++) {
        try {
          await breaker.execute(async () => {
            throw new Error('Failure');
          });
        } catch {
          // Expected
        }
      }

      // Next call should be rejected immediately
      await expect(breaker.execute(async () => 'success')).rejects.toThrow(CircuitBreakerOpenError);
    });

    it('includes reset time in open error', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 1, cooldownMs: 5000 });

      try {
        await breaker.execute(async () => {
          throw new Error('Failure');
        });
      } catch {
        // Expected
      }

      try {
        await breaker.execute(async () => 'success');
        throw new Error('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CircuitBreakerOpenError);
        if (error instanceof CircuitBreakerOpenError) {
          expect(error.resetAt).toBeInstanceOf(Date);
        }
      }
    });
  });

  describe('timeout handling', () => {
    it('times out long-running operations', async () => {
      const breaker = new CircuitBreaker({ timeout: 100 });

      await expect(
        breaker.execute(async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return 'success';
        })
      ).rejects.toThrow('timeout');

      const stats = breaker.getStats();
      expect(stats.failures).toBe(1);
    });
  });

  describe('half-open state', () => {
    it('transitions to HALF_OPEN after cooldown', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 1, cooldownMs: 50 });

      // Open circuit
      try {
        await breaker.execute(async () => {
          throw new Error('Failure');
        });
      } catch {
        // Expected
      }

      expect(breaker.getState()).toBe(CircuitState.OPEN);

      // Wait for cooldown
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Next call should transition to HALF_OPEN
      try {
        await breaker.execute(async () => {
          throw new Error('Still failing');
        });
      } catch {
        // Expected
      }

      expect(breaker.getState()).toBe(CircuitState.OPEN);
    });

    it('closes circuit on successful HALF_OPEN call', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 1, cooldownMs: 50 });

      // Open circuit
      try {
        await breaker.execute(async () => {
          throw new Error('Failure');
        });
      } catch {
        // Expected
      }

      expect(breaker.getState()).toBe(CircuitState.OPEN);

      // Wait for cooldown
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Successful call should close circuit
      await breaker.execute(async () => 'success');

      expect(breaker.getState()).toBe(CircuitState.CLOSED);
      expect(breaker.isClosed()).toBe(true);
    });

    it('reopens circuit on failed HALF_OPEN call', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 1, cooldownMs: 50 });

      // Open circuit
      try {
        await breaker.execute(async () => {
          throw new Error('Failure');
        });
      } catch {
        // Expected
      }

      expect(breaker.getState()).toBe(CircuitState.OPEN);

      // Wait for cooldown
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Failed call should reopen circuit
      try {
        await breaker.execute(async () => {
          throw new Error('Still failing');
        });
      } catch {
        // Expected
      }

      expect(breaker.getState()).toBe(CircuitState.OPEN);
    });
  });

  describe('manual reset', () => {
    it('resets all statistics', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 10 });

      // Execute some calls
      await breaker.execute(async () => 'success');
      try {
        await breaker.execute(async () => {
          throw new Error('Failure');
        });
      } catch {
        // Expected
      }

      let stats = breaker.getStats();
      expect(stats.successes).toBe(1);
      expect(stats.failures).toBe(1);
      expect(stats.totalCalls).toBe(2);

      // Reset
      breaker.reset();

      stats = breaker.getStats();
      expect(stats.successes).toBe(0);
      expect(stats.failures).toBe(0);
      expect(stats.totalCalls).toBe(0);
      expect(stats.state).toBe(CircuitState.CLOSED);
    });
  });

  describe('statistics', () => {
    it('provides comprehensive stats', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 2, name: 'TestCircuit' });

      await breaker.execute(async () => 'success');

      try {
        await breaker.execute(async () => {
          throw new Error('Test failure');
        });
      } catch {
        // Expected
      }

      const stats = breaker.getStats();
      expect(stats.state).toBe(CircuitState.CLOSED);
      expect(stats.successes).toBe(1);
      expect(stats.failures).toBe(1);
      expect(stats.totalCalls).toBe(2);
      expect(stats.lastError).toBe('Test failure');
    });

    it('includes open/reset times when circuit is open', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 1, cooldownMs: 5000 });

      try {
        await breaker.execute(async () => {
          throw new Error('Failure');
        });
      } catch {
        // Expected
      }

      const stats = breaker.getStats();
      expect(stats.state).toBe(CircuitState.OPEN);
      expect(stats.openedAt).toBeInstanceOf(Date);
      expect(stats.resetAt).toBeInstanceOf(Date);
    });
  });

  describe('edge cases', () => {
    it('handles synchronous errors', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 5 });

      await expect(
        breaker.execute(async () => {
          throw new Error('Sync error');
        })
      ).rejects.toThrow('Sync error');

      const stats = breaker.getStats();
      expect(stats.failures).toBe(1);
    });

    it('handles non-Error objects', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 5 });

      await expect(
        breaker.execute(async () => {
          throw 'string error';
        })
      ).rejects.toBe('string error');

      const stats = breaker.getStats();
      expect(stats.lastError).toBe('string error');
    });

    it('handles zero threshold gracefully', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 0 });

      // Should immediately open on first failure
      try {
        await breaker.execute(async () => {
          throw new Error('Failure');
        });
      } catch {
        // Expected
      }

      expect(breaker.getState()).toBe(CircuitState.OPEN);
    });
  });
});
