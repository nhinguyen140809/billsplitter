import { describe, it, expect } from 'vitest'
import { calculateSettlement } from '@/lib/calculateSettlement'
import type { StoredMember, Bill, PaymentData } from '@/types'

// --- Helpers ---

let memberIdCounter = 0
const member = (name: string): StoredMember => ({ id: String(++memberIdCounter), name })

let billIdCounter = 0
const equalBill = (payer: string, amount: number, participants: string[]): Bill => ({
  id: String(++billIdCounter),
  type: 'equal',
  name: `Bill ${billIdCounter}`,
  payer,
  amount,
  shares: Object.fromEntries(participants.map((p) => [p, 1])),
})

const unequalBill = (payer: string, amount: number, shares: Record<string, number>): Bill => ({
  id: String(++billIdCounter),
  type: 'unequal',
  name: `Bill ${billIdCounter}`,
  payer,
  amount,
  shares,
})

/** Parses a formatted currency string to a number, handling both locale formats. */
const parseAmount = (formatted: string): number =>
  parseFloat(formatted.replace(/[^0-9,.-]/g, '').replace(',', '.'))

/** Returns the numeric payment amount from sender to receiver, or 0 if no such payment. */
const getPayment = (data: PaymentData, from: string, to: string): number => {
  const raw = data[from]?.[to]
  return raw ? parseAmount(raw) : 0
}

/** Sums all payment amounts across the entire PaymentData map. */
const sumAllPayments = (data: PaymentData): number =>
  Object.values(data)
    .flatMap(Object.values)
    .reduce((acc, v) => acc + parseAmount(v), 0)

// --- Tests ---

describe('calculateSettlement', () => {
  describe('equal split', () => {
    it('two members: payer recovers half from the other', () => {
      const [A, B] = [member('Alice'), member('Bob')]
      const { sendPayments, receivePayments } = calculateSettlement(
        [A, B],
        [equalBill('Alice', 100, ['Alice', 'Bob'])]
      )

      expect(getPayment(sendPayments, 'Bob', 'Alice')).toBeCloseTo(50)
      expect(getPayment(receivePayments, 'Alice', 'Bob')).toBeCloseTo(50)
    })

    it('three members: payer recovers one-third from each other member', () => {
      const members = [member('A'), member('B'), member('C')]
      const { sendPayments } = calculateSettlement(members, [equalBill('A', 90, ['A', 'B', 'C'])])

      expect(getPayment(sendPayments, 'B', 'A')).toBeCloseTo(30)
      expect(getPayment(sendPayments, 'C', 'A')).toBeCloseTo(30)
    })
  })

  describe('unequal split', () => {
    it('sender pays the exact share assigned to them', () => {
      const [A, B] = [member('A'), member('B')]
      const { sendPayments } = calculateSettlement(
        [A, B],
        [unequalBill('A', 100, { A: 20, B: 80 })]
      )

      expect(getPayment(sendPayments, 'B', 'A')).toBeCloseTo(80)
    })

    it('member with zero share owes nothing', () => {
      const [A, B, C] = [member('A'), member('B'), member('C')]
      const { sendPayments } = calculateSettlement(
        [A, B, C],
        [unequalBill('A', 90, { A: 0, B: 90, C: 0 })]
      )

      expect(getPayment(sendPayments, 'B', 'A')).toBeCloseTo(90)
      expect(getPayment(sendPayments, 'C', 'A')).toBeCloseTo(0)
    })
  })

  describe('multi-bill netting', () => {
    it('opposite bills net down to a single payment', () => {
      const [A, B] = [member('A'), member('B')]
      // A pays 100 for both → B owes 50; B pays 60 for both → A owes 30; net: B owes A 20
      const bills = [equalBill('A', 100, ['A', 'B']), equalBill('B', 60, ['A', 'B'])]
      const { sendPayments } = calculateSettlement([A, B], bills)

      expect(getPayment(sendPayments, 'B', 'A')).toBeCloseTo(20)
      expect(Object.keys(sendPayments).length).toBe(1)
    })

    it('three members: verifies minimum transaction count', () => {
      const [A, B, C] = [member('A'), member('B'), member('C')]
      // A pays for all three twice → B and C each owe A 60
      const bills = [equalBill('A', 90, ['A', 'B', 'C']), equalBill('A', 90, ['A', 'B', 'C'])]
      const { sendPayments } = calculateSettlement([A, B, C], bills)

      const totalTransactions = Object.values(sendPayments).reduce(
        (acc, txMap) => acc + Object.keys(txMap).length,
        0
      )
      // Optimal: B→A and C→A = 2 transactions, not 3
      expect(totalTransactions).toBeLessThanOrEqual(2)
    })
  })

  describe('balanced / edge cases', () => {
    it('returns empty maps when everyone is balanced', () => {
      const [A, B] = [member('A'), member('B')]
      // Each person pays exactly what they owe
      const bills = [equalBill('A', 50, ['A']), equalBill('B', 50, ['B'])]
      const { sendPayments, receivePayments } = calculateSettlement([A, B], bills)

      expect(Object.keys(sendPayments)).toHaveLength(0)
      expect(Object.keys(receivePayments)).toHaveLength(0)
    })

    it('returns empty maps for a single member', () => {
      const { sendPayments, receivePayments } = calculateSettlement(
        [member('Solo')],
        [equalBill('Solo', 100, ['Solo'])]
      )
      expect(Object.keys(sendPayments)).toHaveLength(0)
      expect(Object.keys(receivePayments)).toHaveLength(0)
    })

    it('returns empty maps when there are no bills', () => {
      const { sendPayments, receivePayments } = calculateSettlement([member('A'), member('B')], [])
      expect(Object.keys(sendPayments)).toHaveLength(0)
      expect(Object.keys(receivePayments)).toHaveLength(0)
    })
  })

  describe('output validity invariants', () => {
    it('all payment amounts are positive', () => {
      const members = [member('A'), member('B'), member('C')]
      const bills = [equalBill('A', 90, ['A', 'B', 'C']), equalBill('B', 60, ['A', 'B'])]
      const { sendPayments } = calculateSettlement(members, bills)

      for (const txMap of Object.values(sendPayments)) {
        for (const formatted of Object.values(txMap)) {
          expect(parseAmount(formatted)).toBeGreaterThan(0)
        }
      }
    })

    it('total sent equals total received across all members', () => {
      const members = [member('A'), member('B'), member('C')]
      const bills = [
        equalBill('A', 90, ['A', 'B', 'C']),
        equalBill('B', 60, ['A', 'B']),
        unequalBill('C', 80, { A: 20, B: 30, C: 30 }),
      ]
      const { sendPayments, receivePayments } = calculateSettlement(members, bills)

      expect(sumAllPayments(sendPayments)).toBeCloseTo(sumAllPayments(receivePayments))
    })

    it('sendPayments and receivePayments are mirror maps of each other', () => {
      const [A, B] = [member('A'), member('B')]
      const { sendPayments, receivePayments } = calculateSettlement(
        [A, B],
        [equalBill('A', 100, ['A', 'B'])]
      )

      // Every send entry must have a corresponding receive entry
      for (const [sender, txMap] of Object.entries(sendPayments)) {
        for (const [receiver, amount] of Object.entries(txMap)) {
          expect(receivePayments[receiver]?.[sender]).toBe(amount)
        }
      }
    })
  })
})
