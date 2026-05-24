import { db } from '@/db/dexie'
import type { Settlement } from '@/types'
import { DEFAULT_SETTLEMENT } from '@/constants'

export const settlementRepo = {
  async getDraft() {
    const draft = await db.draftSettlement.get('draft')
    return draft?.data || null
  },

  async saveDraft(settlement: Settlement) {
    await db.draftSettlement.put({ id: 'draft', data: settlement })
  },

  async clearDraft() {
    await db.draftSettlement.delete('draft')
  },

  async updateDraft(partial: Partial<Settlement>) {
    const existing = await db.draftSettlement.get('draft')
    const base = existing?.data ?? DEFAULT_SETTLEMENT
    await db.draftSettlement.put({
      id: 'draft',
      data: { ...base, ...partial, updatedAt: new Date() },
    })
  },

  async createSettlement(settlement: Settlement) {
    const id = crypto.randomUUID()
    await db.settlements.add({
      ...settlement,
      id,
      updatedAt: new Date(),
    })
    return id
  },

  async updateSettlement(id: string, settlement: Settlement) {
    await db.settlements.update(id, {
      ...settlement,
      updatedAt: new Date(),
    })
  },

  async getSettlement(id: string) {
    return await db.settlements.get(id)
  },

  async getAllSettlements() {
    return await db.settlements.orderBy('updatedAt').reverse().toArray()
  },

  async deleteSettlement(id: string) {
    await db.settlements.delete(id)
  },

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
