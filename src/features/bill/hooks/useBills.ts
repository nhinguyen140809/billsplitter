import { useCallback } from 'react'
import { useSettlementContext } from '@/context/SettlementContext'
import type { Bill } from '@/types'

/**
 * CRUD operations for bills within the current settlement context.
 * Reads and writes through `SettlementContext` so the same hook works for both
 * the draft (home page) and saved settlements (detail page).
 */
export const useBills = () => {
  const { data, update } = useSettlementContext()
  const bills = data.bills

  const addBill = useCallback(
    (bill: Bill) => {
      const newBill = bill.id === '' ? { ...bill, id: crypto.randomUUID() } : bill
      update({ bills: [...bills, newBill] })
    },
    [bills, update]
  )

  const removeBill = useCallback(
    (billId: string) => {
      update({ bills: bills.filter((bill) => bill.id !== billId) })
    },
    [bills, update]
  )

  const updateBill = useCallback(
    (updatedBill: Bill) => {
      update({ bills: bills.map((bill) => (bill.id === updatedBill.id ? updatedBill : bill)) })
    },
    [bills, update]
  )

  const duplicateBill = useCallback(
    (billId: string) => {
      const billToDuplicate = bills.find((bill) => bill.id === billId)
      if (billToDuplicate) {
        const newBill = { ...billToDuplicate, id: crypto.randomUUID(), name: 'Copy of ' + billToDuplicate.name }
        update({ bills: [...bills, newBill] })
      }
    },
    [bills, update]
  )

  const onSubmitBillForm = useCallback(
    (bill: Bill) => {
      if (bill.id === '') {
        const newBill = { ...bill, id: crypto.randomUUID() }
        update({ bills: [...bills, newBill] })
        return
      }
      update({ bills: bills.map((b) => (b.id === bill.id ? bill : b)) })
    },
    [bills, update]
  )

  return { bills, addBill, removeBill, updateBill, duplicateBill, onSubmitBillForm }
}
