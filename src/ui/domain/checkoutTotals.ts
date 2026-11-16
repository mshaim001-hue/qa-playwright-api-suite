/**
 * Swag Labs tax: 8% of the item total, rounded to cents, then added.
 * The overview page uses the same order of operations.
 */
export function checkoutTotals(prices: readonly number[]): {
  subtotal: string;
  tax: string;
  total: string;
} {
  const subtotal = prices.reduce((sum, price) => sum + price, 0);
  const tax = (subtotal * 0.08).toFixed(2);
  const total = (subtotal + Number(tax)).toFixed(2);

  return {
    subtotal: subtotal.toFixed(2),
    tax,
    total,
  };
}

export function parsePrice(text: string): number {
  const value = Number(text.replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(value)) {
    throw new Error(`Could not parse a price from "${text}"`);
  }
  return value;
}
