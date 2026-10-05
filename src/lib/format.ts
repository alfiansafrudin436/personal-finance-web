import { AccountType, CategoryType } from '@/types';

/**
 * Amounts arrive from the API as decimal strings, because they come from
 * NUMERIC(15,2) columns. They are parsed only here, at the display boundary,
 * and never used for arithmetic that is then sent back.
 */

const DEFAULT_CURRENCY = 'IDR';

export const toNumber = (
  amount: string | number | null | undefined,
): number => {
  if (typeof amount === 'number') return Number.isFinite(amount) ? amount : 0;
  if (!amount) return 0;
  const parsed = Number(amount);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatCurrency = (
  amount: string | number | null | undefined,
  currency = DEFAULT_CURRENCY,
): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(toNumber(amount));

/** Compact form for chart axes and tight stat tiles, e.g. "Rp 1,2 jt". */
export const formatCurrencyCompact = (
  amount: string | number | null | undefined,
  currency = DEFAULT_CURRENCY,
): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(toNumber(amount));

export const formatNumber = (
  value: string | number | null | undefined,
): string => new Intl.NumberFormat('id-ID').format(toNumber(value));

/** Signs an amount by transaction type: expenses read as negative. */
export const formatSignedCurrency = (
  amount: string | number | null | undefined,
  type: CategoryType,
  currency = DEFAULT_CURRENCY,
): string => {
  const formatted = formatCurrency(amount, currency);
  if (type === 'expense') return `-${formatted}`;
  if (type === 'income') return `+${formatted}`;
  return formatted;
};

export const formatDate = (value: string | Date): string => {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatMonth = (period: string): string => {
  const date = new Date(`${period}-01T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return period;
  return new Intl.DateTimeFormat('id-ID', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

/** `YYYY-MM-DD` in local time, the wire format for every date field. */
export const toDateInput = (value: Date = new Date()): string => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** `YYYY-MM`, the wire format for a budget period. */
export const toMonthInput = (value: Date = new Date()): string =>
  toDateInput(value).slice(0, 7);

export const startOfMonthInput = (value: Date = new Date()): string =>
  toDateInput(new Date(value.getFullYear(), value.getMonth(), 1));

export const endOfMonthInput = (value: Date = new Date()): string =>
  toDateInput(new Date(value.getFullYear(), value.getMonth() + 1, 0));

export const percentage = (
  part: string | number,
  whole: string | number,
): number => {
  const total = toNumber(whole);
  if (total === 0) return 0;
  return Math.round((toNumber(part) / total) * 100);
};

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: 'Tunai',
  bank: 'Bank',
  e_wallet: 'E-Wallet',
  credit_card: 'Kartu Kredit',
  investment: 'Investasi',
};

export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  income: 'Pemasukan',
  expense: 'Pengeluaran',
  transfer: 'Transfer',
};

export const ACCOUNT_TYPE_OPTIONS = (
  Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]
).map((value) => ({ value, label: ACCOUNT_TYPE_LABELS[value] }));

export const CATEGORY_TYPE_OPTIONS = (
  Object.keys(CATEGORY_TYPE_LABELS) as CategoryType[]
).map((value) => ({ value, label: CATEGORY_TYPE_LABELS[value] }));
