import { useCallback } from 'react'
import { useSettlementContext } from '@/context/SettlementContext'
import type { PaymentData } from '@/types'

export function usePayments() {
  const { data, update } = useSettlementContext()

  const updatePayments = useCallback(
    (newSendPayments: PaymentData, newReceivePayments: PaymentData) => {
      update({ sendPayments: newSendPayments, receivePayments: newReceivePayments })
    },
    [update]
  )

  return {
    sendPayments: data.sendPayments,
    receivePayments: data.receivePayments,
    updatePayments,
  }
}
