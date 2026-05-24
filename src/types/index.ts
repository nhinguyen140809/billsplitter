export interface Member {
  id: string
  name: string
  paid: number
  spent: number
}

export interface Bill {
  id: string
  type: BillType
  name: string
  payer: string
  amount: number
  shares: BillShareValue
}

export type BillShareValue = Record<string, number>

export type TransactionMap = Record<string, string>

export type PaymentData = Record<string, TransactionMap>

export type PaymentItemData = {
  name: string
  transactions: TransactionMap
  type: DebtPartyType
}

export interface Settlement {
  id: string
  name: string
  members: Member[]
  bills: Bill[]
  sendPayments: PaymentData
  receivePayments: PaymentData
  updatedAt: Date
}

export type BillFormData = {
  id: string
  type: BillType
  name: string
  payer: string
  amount: string
  shares: Record<string, string>
}

export type BillType = 'equal' | 'unequal'

export type DebtPartyType = 'sender' | 'receiver'

export interface DraftSettlement {
  id: 'draft'
  data: Settlement
}
