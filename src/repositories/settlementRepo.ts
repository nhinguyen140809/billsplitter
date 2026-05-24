import { db } from '@/db/dexie'
import type { Settlement } from '@/types'
import { DEFAULT_SETTLEMENT } from '@/constants'

/** Data-access layer for all Dexie IndexedDB operations. */
export const settlementRepo = {
  /** Returns the current in-progress draft, or `null` if none exists. */
  async getDraft() {
    const draft = await db.draftSettlement.get('draft')
    return draft?.data || null
  },

  /** Overwrites the draft with the given settlement (full replace). */
  async saveDraft(settlement: Settlement) {
    await db.draftSettlement.put({ id: 'draft', data: settlement })
  },

  /** Deletes the draft record entirely. */
  async clearDraft() {
    await db.draftSettlement.delete('draft')
  },

  /**
   * Applies a partial update to the draft, upserting if no draft exists yet.
   * Falls back to `DEFAULT_SETTLEMENT` as the base when creating from scratch.
   */
  async updateDraft(partial: Partial<Settlement>) {
    const existing = await db.draftSettlement.get('draft')
    const base = existing?.data ?? DEFAULT_SETTLEMENT
    await db.draftSettlement.put({
      id: 'draft',
      data: { ...base, ...partial, updatedAt: new Date() },
    })
  },

  /**
   * Persists a new settlement, assigning a fresh UUID and current timestamp.
   * @returns The generated settlement ID.
   */
  async createSettlement(settlement: Settlement) {
    const id = crypto.randomUUID()
    await db.settlements.add({
      ...settlement,
      id,
      updatedAt: new Date(),
    })
    return id
  },

  /** Replaces a saved settlement in full, refreshing `updatedAt`. */
  async updateSettlement(id: string, settlement: Settlement) {
    await db.settlements.update(id, {
      ...settlement,
      updatedAt: new Date(),
    })
  },

  /** Retrieves a single saved settlement by ID, or `undefined` if not found. */
  async getSettlement(id: string) {
    return await db.settlements.get(id)
  },

  /** Returns all saved settlements ordered by `updatedAt` descending. */
  async getAllSettlements() {
    return await db.settlements.orderBy('updatedAt').reverse().toArray()
  },

  /** Permanently deletes a saved settlement. */
  async deleteSettlement(id: string) {
    await db.settlements.delete(id)
  },

  /**
   * Creates a copy of an existing settlement with a new ID and "Copy of …" name.
   * @throws If the source settlement does not exist.
   * @returns The new settlement's ID.
   */
  async duplicateSettlement(id: string) {
    const settlementToDuplicate = await db.settlements.get(id)
    if (!settlementToDuplicate) {
      throw new Error('Settlement not found')
    }
    const newId = crypto.randomUUID()
    const newSettlement = {
      ...settlementToDuplicate,
      id: newId,
      name: 'Copy of ' + (settlementToDuplicate.name || 'Untitled Settlement'),
      updatedAt: new Date(),
    }
    await db.settlements.add(newSettlement)
    return newId
  },
}
