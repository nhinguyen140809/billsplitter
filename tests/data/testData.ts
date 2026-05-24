export type EqualBill = {
  name: string
  payer: string
  amount: string
  participants: string[]
}

export type UnequalBill = {
  name: string
  payer: string
  shares: Record<string, string>
}

export const PARTICIPANTS = ['Alice', 'Bob', 'Charlie']

export const EQUAL_BILLS: EqualBill[] = [
  { name: 'Dinner', payer: 'Alice', amount: '90', participants: ['Alice', 'Bob', 'Charlie'] },
  { name: 'Movie', payer: 'Bob', amount: '45', participants: ['Alice', 'Bob'] },
  { name: 'Taxi', payer: 'Charlie', amount: '30', participants: ['Bob', 'Charlie'] },
]

export const UNEQUAL_BILLS: UnequalBill[] = [
  { name: 'Hotel', payer: 'Alice', shares: { Alice: '100', Bob: '200', Charlie: '150' } },
  { name: 'Groceries', payer: 'Bob', shares: { Alice: '50', Bob: '75', Charlie: '25' } },
]

export const SETTLEMENT_NAMES = ['Weekend Trip', 'Birthday Party', 'Office Lunch']

/** Names that should be rejected by participant validation. */
export const INVALID_PARTICIPANT_NAMES = [{ input: '', description: 'empty string' }]
