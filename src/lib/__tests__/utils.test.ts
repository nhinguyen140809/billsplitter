import { describe, it, expect } from 'vitest'
import { cn, formatCurrency } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
    expect(cn('a', undefined, 'c')).toBe('a c')
  })

  it('resolves tailwind conflicts, keeping the last class', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-sm', 'text-base')).toBe('text-base')
  })
})

describe('formatCurrency', () => {
  it('formats zero as "0"', () => {
    expect(formatCurrency(0)).toBe('0')
  })

  it('formats whole numbers without decimal places', () => {
    expect(formatCurrency(50)).toBe('50')
    expect(formatCurrency(100)).toBe('100')
  })

  it('preserves up to 3 decimal places', () => {
    const result = formatCurrency(1.5)
    // Numeric value must round-trip regardless of locale separator
    const numeric = parseFloat(result.replace(',', '.'))
    expect(numeric).toBeCloseTo(1.5)
  })
})
