// Cart state: pure functions (unit tested) + a small localStorage adapter.
// Demo store only, no real checkout.

export interface CartLine {
  id: string;
  qty: number;
}

export function add(lines: CartLine[], id: string): CartLine[] {
  const existing = lines.find((l) => l.id === id);
  if (!existing) return [...lines, { id, qty: 1 }];
  return lines.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
}

export function remove(lines: CartLine[], id: string): CartLine[] {
  return lines.filter((l) => l.id !== id);
}

export function setQty(lines: CartLine[], id: string, qty: number): CartLine[] {
  if (qty <= 0) return remove(lines, id);
  return lines.map((l) => (l.id === id ? { ...l, qty } : l));
}

export function count(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

export function subtotal(
  lines: CartLine[],
  priceOf: (id: string) => number,
): number {
  return lines.reduce((sum, l) => sum + l.qty * priceOf(l.id), 0);
}

// ---- persistence ----------------------------------------------------------

const KEY = 'nso-cart';

export function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        typeof l === 'object' && l !== null && typeof l.id === 'string' && typeof l.qty === 'number' && l.qty > 0,
    );
  } catch {
    return [];
  }
}

export function saveCart(lines: CartLine[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Storage unavailable (private mode etc.) - cart just won't persist.
  }
}
