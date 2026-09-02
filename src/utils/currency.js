export function formatRs(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Rs 0";
  return `Rs ${Math.round(amount).toLocaleString()}`;
}
