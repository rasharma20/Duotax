export function formatMoney(value) {
  return `$${Number(value).toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
}
