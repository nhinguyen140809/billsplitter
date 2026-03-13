import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vn-VN", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
    }).format(amount);
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("vn-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
}
