/** Shortens money figures for small dashboard tiles, e.g. "$284,500" -> "$285K". Browser-safe and pure. */
export function compactCurrency(amount: number, options: { signed?: boolean } = {}): string {
  const sign = amount < 0 ? "-" : options.signed && amount > 0 ? "+" : "";
  let abs = Math.abs(amount);
  const short = (value: number) => (value >= 100 ? String(Math.round(value)) : String(Number(value.toFixed(1))));
  if (abs >= 1000 && Math.round(abs / 1000) >= 1000) abs = Math.max(abs, 1_000_000);
  if (abs >= 1_000_000) return `${sign}$${short(abs / 1_000_000)}M`;
  if (abs >= 1000) return `${sign}$${short(abs / 1000)}K`;
  return `${sign}$${Math.round(abs)}`;
}

/** Abbreviates a display figure such as "+$142,800"; non-money values are returned unchanged. */
export function compactFigure(value: string): string {
  const match = /^([+-]?)\$([\d,]+(?:\.\d+)?)$/.exec(value.trim());
  if (!match) return value;
  const amount = Number((match[2] ?? "0").replace(/,/g, ""));
  const signed = match[1] === "+";
  return compactCurrency(match[1] === "-" ? -amount : amount, { signed });
}
