import { useSettlementContext } from '@/context/SettlementContext'
import type { PaymentData } from '@/types'

export function usePayments() {
  const { data, update } = useSettlementContext()

  const updatePayments = (newSendPayments: PaymentData, newReceivePayments: PaymentData) => {
    update({ sendPayments: newSendPayments, receivePayments: newReceivePayments })
  }

  return {
    sendPayments: data.sendPayments,
    receivePayments: data.receivePayments,
    updatePayments,
  }
}
