import { describe, it, expect } from 'vitest';
import { lookupOrder, RETURN_POLICY, SHIPPING, STORE, ACTIVITIES } from '../src/engine/data';

describe('order lookup (mock data — must match brief exactly)', () => {
  it('order 111 is shipped and arriving tomorrow', () => {
    const o = lookupOrder('111');
    expect(o?.status).toBe('Shipped');
    expect(o?.summary.toLowerCase()).toContain('tomorrow');
  });

  it('order 222 is processing and ships in 24 hours', () => {
    const o = lookupOrder('222');
    expect(o?.status).toBe('Processing');
    expect(o?.summary.toLowerCase()).toContain('24 hours');
  });

  it('order 333 is delivered', () => {
    const o = lookupOrder('333');
    expect(o?.status).toBe('Delivered');
  });

  it('any other order number is invalid', () => {
    expect(lookupOrder('444')).toBeNull();
    expect(lookupOrder('000')).toBeNull();
    expect(lookupOrder('12345')).toBeNull();
    expect(lookupOrder('')).toBeNull();
  });

  it('handles order numbers with surrounding formatting', () => {
    expect(lookupOrder('#111')?.status).toBe('Shipped');
    expect(lookupOrder(' 222 ')?.status).toBe('Processing');
  });
});

describe('return policy (from provided materials)', () => {
  it('states 30-day window, unused items, original packaging', () => {
    const text = RETURN_POLICY.rules.join(' ').toLowerCase();
    expect(text).toMatch(/30[- ]day/);
    expect(text).toContain('unused');
    expect(text).toContain('original packaging');
  });

  it('provides a returns link', () => {
    expect(STORE.returnsUrl).toMatch(/^https?:\/\//);
  });
});

describe('shipping info (from provided materials)', () => {
  it('standard shipping is 3-5 business days', () => {
    expect(SHIPPING.standard).toMatch(/3\s*[–-]\s*5 business days/);
  });

  it('expedited shipping is 1-2 business days', () => {
    expect(SHIPPING.expedited).toMatch(/1\s*[–-]\s*2 business days/);
  });
});

describe('recommendation matrix', () => {
  it('has activities, each with a follow-up question and category options', () => {
    expect(ACTIVITIES.length).toBeGreaterThanOrEqual(3);
    for (const a of ACTIVITIES) {
      expect(a.label.length).toBeGreaterThan(0);
      expect(a.question.length).toBeGreaterThan(0);
      expect(a.options.length).toBeGreaterThanOrEqual(2);
      for (const opt of a.options) {
        expect(opt.category.length).toBeGreaterThan(0);
      }
    }
  });
});
