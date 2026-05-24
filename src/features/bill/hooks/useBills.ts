import { useSettlementContext } from '@/context/SettlementContext'
import type { Bill } from '@/types'

export const useBills = () => {
  const { data, update } = useSettlementContext()
  const bills = data.bills

  const addBill = (bill: Bill) => {
    const newBill = bill.id === '' ? { ...bill, id: crypto.randomUUID() } : bill
    update({ bills: [...bills, newBill] })
  }

  const removeBill = (billId: string) => {
    update({ bills: bills.filter((bill) => bill.id !== billId) })
  }

  const updateBill = (updatedBill: Bill) => {
    update({ bills: bills.map((bill) => (bill.id === updatedBill.id ? updatedBill : bill)) })
  }

  const duplicateBill = (billId: string) => {
    const billToDuplicate = bills.find((bill) => bill.id === billId)
    if (billToDuplicate) {
      addBill({ ...billToDuplicate, id: crypto.randomUUID(), name: 'Copy of ' + billToDuplicate.name })
    }
  }

  const onSubmitBillForm = (bill: Bill) => {
    if (bill.id === '') {
      addBill(bill)
      return
    }
    updateBill(bill)
  }

  return { bills, addBill, removeBill, updateBill, duplicateBill, onSubmitBillForm }
}
