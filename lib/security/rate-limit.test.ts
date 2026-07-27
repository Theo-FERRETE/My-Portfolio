import { describe, it, expect, afterEach, vi } from 'vitest';
import { checkRateLimit, resetRateLimit, getClientIp, RATE_LIMITS } from '@/lib/security/rate-limit';

let counter = 0;
function uniqueId() {
  counter += 1;
  return `test-identifier-${counter}`;
}

afterEach(() => {
  vi.useRealTimers();
});

describe('checkRateLimit', () => {
  it('allows the first request under the limit', () => {
    const id = uniqueId();
    const result = checkRateLimit(id, { windowMs: 1000, maxRequests: 3 });

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('denies requests once maxRequests is exceeded within the window', () => {
    const id = uniqueId();
    const config = { windowMs: 1000, maxRequests: 2 };

    checkRateLimit(id, config);
    checkRateLimit(id, config);
    const third = checkRateLimit(id, config);

    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it('resets the counter once the window has expired', () => {
    vi.useFakeTimers();
    const id = uniqueId();
    const config = { windowMs: 1000, maxRequests: 1 };

    expect(checkRateLimit(id, config).allowed).toBe(true);
    expect(checkRateLimit(id, config).allowed).toBe(false);

    vi.advanceTimersByTime(1001);

    expect(checkRateLimit(id, config).allowed).toBe(true);
  });

  it('defaults to the RATE_LIMITS.api config when none is provided', () => {
    const id = uniqueId();
    const result = checkRateLimit(id);

    expect(result.remaining).toBe(RATE_LIMITS.api.maxRequests - 1);
  });
});

describe('resetRateLimit', () => {
  it('clears the entry for a given identifier', () => {
    const id = uniqueId();
    const config = { windowMs: 1000, maxRequests: 1 };

    checkRateLimit(id, config);
    expect(checkRateLimit(id, config).allowed).toBe(false);

    resetRateLimit(id);

    expect(checkRateLimit(id, config).allowed).toBe(true);
  });
});

describe('getClientIp', () => {
  it('returns "local-client" when not behind a trusted proxy, regardless of headers', () => {
    delete process.env.TRUSTED_PROXY;

    const request = new Request('http://localhost/api/test', {
      headers: { 'x-forwarded-for': '1.2.3.4', 'x-real-ip': '5.6.7.8' },
    });

    expect(getClientIp(request)).toBe('local-client');
  });

  it('uses x-forwarded-for (first IP) when behind a trusted proxy', () => {
    process.env.TRUSTED_PROXY = 'true';

    const request = new Request('http://localhost/api/test', {
      headers: { 'x-forwarded-for': '1.2.3.4, 9.9.9.9' },
    });

    expect(getClientIp(request)).toBe('1.2.3.4');

    delete process.env.TRUSTED_PROXY;
  });

  it('falls back to x-real-ip when x-forwarded-for is absent and trusted', () => {
    process.env.TRUSTED_PROXY = 'true';

    const request = new Request('http://localhost/api/test', {
      headers: { 'x-real-ip': '5.6.7.8' },
    });

    expect(getClientIp(request)).toBe('5.6.7.8');

    delete process.env.TRUSTED_PROXY;
  });
});
