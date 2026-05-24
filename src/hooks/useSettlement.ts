import { DEFAULT_SETTLEMENT } from '@/constants'
import { settlementRepo } from '@/repositories/settlementRepo'
import type { Settlement } from '@/types'
import { useLiveQuery } from 'dexie-react-hooks'

/**
 * Reactive hook for a single saved settlement identified by `settlementId`.
 * `settlement` is `undefined` while the Dexie query is loading, then the
 * live record thereafter — the `SavedSettlementProvider` uses this to guard
 * against rendering before data arrives.
 */
export function useSettlement(settlementId: string) {
  const settlement = useLiveQuery<Settlement | undefined>(
    () => settlementRepo.getSettlement(settlementId),
    [settlementId]
  )

  /** Replaces the settlement in full. */
  const updateSettlement = async (data: Settlement) => {
    await settlementRepo.updateSettlement(settlementId, data)
  }

  /** Merges `data` into the live settlement; no-op if not yet loaded. */
  const updateSettlementPartial = async (data: Partial<Settlement>) => {
    if (!settlement) return
    await settlementRepo.updateSettlement(settlementId, {
      ...settlement,
      ...data,
      updatedAt: new Date(),
    })
  }

  /** Permanently removes the settlement from the database. */
  const deleteSettlement = async () => {
    await settlementRepo.deleteSettlement(settlementId)
  }

  /**
   * Creates a copy of this settlement and returns the new ID.
   * @returns The duplicated settlement's ID.
   */
  const duplicateSettlement = async () => {
    const newSettlementId = await settlementRepo.duplicateSettlement(settlementId)
    return newSettlementId
  }

  /** Resets the settlement to its default state while preserving the ID. */
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
