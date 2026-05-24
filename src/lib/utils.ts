import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merges Tailwind class names, resolving conflicts via tailwind-merge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as a Vietnamese-locale decimal string (up to 3 decimal places).
 * @param amount - The numeric value to format.
 * @returns Formatted string, e.g. `"1.234,567"`.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vn-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(amount)
}

/**
 * Formats a Date as a Vietnamese-locale long date string.
 * @param date - The date to format.
 * @returns Formatted string, e.g. `"ngày 24 tháng 5 năm 2026"`.
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vn-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
