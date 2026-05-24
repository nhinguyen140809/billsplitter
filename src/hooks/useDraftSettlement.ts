import { settlementRepo } from '@/repositories/settlementRepo'
import type { Settlement } from '@/types'
import { useLiveQuery } from 'dexie-react-hooks'
import { DEFAULT_SETTLEMENT } from '@/constants'

/**
 * Reactive hook for the single in-progress draft settlement stored under the
 * fixed key `"draft"` in the `draftSettlement` Dexie table.
 * Falls back to `DEFAULT_SETTLEMENT` while the query is loading or when no
 * draft exists yet, so consumers always receive a valid settlement object.
 */
export function useDraftSettlement() {
  const draftQuery = useLiveQuery<Settlement | null>(() => settlementRepo.getDraft(), [])

  const draft = draftQuery || DEFAULT_SETTLEMENT

  /** Replaces the draft with a full settlement object. */
  const saveDraft = async (data: Settlement) => {
    await settlementRepo.saveDraft(data)
  }

  /** Merges a partial update into the draft, creating it if it doesn't exist yet. */
  const updateDraft = async (data: Partial<Settlement>) => {
    await settlementRepo.updateDraft(data)
  }

  /** Deletes the draft record from the database. */
  const clearDraft = async () => {
    await settlementRepo.clearDraft()
  }

  /**
   * Saves the draft as a new permanent settlement, then clears the draft.
   * @returns The new settlement's ID.
   */
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
