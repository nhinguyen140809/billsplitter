import { settlementRepo } from '@/repositories/settlementRepo'
import type { Settlement } from '@/types'
import { useLiveQuery } from 'dexie-react-hooks'
import { DEFAULT_SETTLEMENT } from '@/constants'

export function useDraftSettlement() {
  const draftQuery = useLiveQuery<Settlement | null>(() => settlementRepo.getDraft(), [])

  const draft = draftQuery || DEFAULT_SETTLEMENT

  const saveDraft = async (data: Settlement) => {
    await settlementRepo.saveDraft(data)
  }

  const updateDraft = async (data: Partial<Settlement>) => {
    await settlementRepo.updateDraft(data)
  }

  const clearDraft = async () => {
    await settlementRepo.clearDraft()
  }

  const createSettlementFromDraft = async (settlement: Settlement) => {
    const newSettlementId = await settlementRepo.createSettlement(settlement)
    clearDraft()
    return newSettlementId
  }

  return {
    draft,
    saveDraft,
    updateDraft,
    clearDraft,
    createSettlementFromDraft,
  }
}
