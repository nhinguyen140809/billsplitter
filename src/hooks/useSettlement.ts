import { DEFAULT_SETTLEMENT } from '@/constants'
import { settlementRepo } from '@/repositories/settlementRepo'
import type { Settlement } from '@/types'
import { useLiveQuery } from 'dexie-react-hooks'

export function useSettlement(settlementId: string) {
  const settlement = useLiveQuery<Settlement | undefined>(
    () => settlementRepo.getSettlement(settlementId),
    [settlementId]
  )

  const updateSettlement = async (data: Settlement) => {
    await settlementRepo.updateSettlement(settlementId, data)
  }

  const updateSettlementPartial = async (data: Partial<Settlement>) => {
    if (!settlement) return
    await settlementRepo.updateSettlement(settlementId, {
      ...settlement,
      ...data,
      updatedAt: new Date(),
    })
  }

  const deleteSettlement = async () => {
    await settlementRepo.deleteSettlement(settlementId)
  }

  const duplicateSettlement = async () => {
    const newSettlementId = await settlementRepo.duplicateSettlement(settlementId)
    return newSettlementId
  }

  const clearSettlement = async () => {
    if (!settlement) return
    await settlementRepo.updateSettlement(settlementId, {
      ...DEFAULT_SETTLEMENT,
      id: settlementId,
      updatedAt: new Date(),
    })
  }

  return {
    settlement,
    updateSettlement,
    updateSettlementPartial,
    clearSettlement,
    deleteSettlement,
    duplicateSettlement,
  }
}
