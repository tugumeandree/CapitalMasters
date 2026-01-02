// Currency utilities: primary = UGX, secondary = USD
export const PRIMARY = 'UGX';
export const SECONDARY = 'USD';

export function getExchangeRate(): number {
  // Number of UGX per 1 USD
  const env = process.env.EXCHANGE_UGX_PER_USD;
  const rate = env ? Number(env) : NaN;
  return isFinite(rate) && rate > 0 ? rate : 3700; // sensible default
}

export function convert(amount: number, from: string, to: string): number {
  const rate = getExchangeRate();
  if (from === to) return amount;
  if (from === PRIMARY && to === SECONDARY) {
    return amount / rate;
  }
  if (from === SECONDARY && to === PRIMARY) {
    return amount * rate;
  }
  // unsupported conversion, return original
  return amount;
}

export function formatCurrency(amount: number, currency: string): string {
  try {
    const opts: Intl.NumberFormatOptions = {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'UGX' ? 0 : 2,
    };
    // Use en-UG for UGX for proper grouping, en-US for USD
    const locale = currency === 'UGX' ? 'en-UG' : 'en-US';
    return new Intl.NumberFormat(locale, opts).format(amount);
  } catch {
    // Fallback
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatPrimaryAndSecondary(amount: number, primary = PRIMARY, secondary = SECONDARY) {
  const primaryStr = formatCurrency(amount, primary);
  const converted = convert(amount, primary, secondary);
  const secondaryStr = formatCurrency(converted, secondary);
  return { primary: primaryStr, secondary: secondaryStr };
}
