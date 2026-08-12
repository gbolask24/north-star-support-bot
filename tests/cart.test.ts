import { describe, it, expect } from 'vitest';
import { add, remove, setQty, count, subtotal, CartLine } from '../src/store/cart';

const priceOf = (id: string) => ({ a: 100, b: 25 })[id as 'a' | 'b'] ?? 0;

describe('cart', () => {
  it('adds a new line with qty 1', () => {
    expect(add([], 'a')).toEqual([{ id: 'a', qty: 1 }]);
  });

  it('increments qty when the item is already in the cart', () => {
    const lines = add(add([], 'a'), 'a');
    expect(lines).toEqual([{ id: 'a', qty: 2 }]);
  });

  it('keeps separate lines per product', () => {
    const lines = add(add([], 'a'), 'b');
    expect(count(lines)).toBe(2);
    expect(lines).toHaveLength(2);
  });

  it('removes a line', () => {
    const lines = remove(add(add([], 'a'), 'b'), 'a');
    expect(lines).toEqual([{ id: 'b', qty: 1 }]);
  });

  it('setQty updates quantity', () => {
    const lines = setQty(add([], 'a'), 'a', 5);
    expect(lines).toEqual([{ id: 'a', qty: 5 }]);
  });

  it('setQty to zero or below removes the line', () => {
    expect(setQty(add([], 'a'), 'a', 0)).toEqual([]);
    expect(setQty(add([], 'a'), 'a', -3)).toEqual([]);
  });

  it('count sums quantities across lines', () => {
    const lines: CartLine[] = [
      { id: 'a', qty: 2 },
      { id: 'b', qty: 3 },
    ];
    expect(count(lines)).toBe(5);
  });

  it('subtotal multiplies qty by price', () => {
    const lines: CartLine[] = [
      { id: 'a', qty: 2 }, // 200
      { id: 'b', qty: 4 }, // 100
    ];
    expect(subtotal(lines, priceOf)).toBe(300);
  });

  it('does not mutate the input array', () => {
    const original: CartLine[] = [{ id: 'a', qty: 1 }];
    add(original, 'a');
    remove(original, 'a');
    setQty(original, 'a', 9);
    expect(original).toEqual([{ id: 'a', qty: 1 }]);
  });
});
