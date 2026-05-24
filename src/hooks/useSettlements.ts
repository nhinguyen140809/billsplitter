import { useLiveQuery } from 'dexie-react-hooks'
import { settlementRepo } from '@/repositories/settlementRepo'
import type { Settlement } from '@/types'

/**
 * Reactive hook that returns all saved settlements ordered by most-recently
 * updated. Used on the home/list page; falls back to `[]` during initial load.
 */
export function useSettlements() {
  const settlementsQuery = useLiveQuery<Settlement[]>(() => settlementRepo.getAllSettlements(), [])

  const settlementList = settlementsQuery || []

  /** Permanently removes a settlement by ID. */
  const deleteSettlement = async (settlementId: string) => {
    await settlementRepo.deleteSettlement(settlementId)
  }

  /**
   * Creates a copy of a settlement with a new ID and "Copy of …" prefix.
   * @returns The new settlement's ID.
   */
  const duplicateSettlement = async (settlementId: string) => {
    const newSettlementId = await settlementRepo.duplicateSettlement(settlementId)
    return newSettlementId
  }

  return { settlementList, deleteSettlement, duplicateSettlement }
}
