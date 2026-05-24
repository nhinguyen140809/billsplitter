import Dexie from 'dexie'
import type { Table } from 'dexie'
import type { DraftSettlement, Settlement } from '@/types'

export class BillSplitterDB extends Dexie {
  settlements!: Table<Settlement>
  draftSettlement!: Table<DraftSettlement>

  constructor() {
    super('billSplitterDB')
    // v1: initial schema
    this.version(1).stores({
      settlements: 'id, updatedAt',
      draftSettlement: 'id',
    })
    // v2: remove status field from all settlement records
    this.version(2)
      .stores({
        settlements: 'id, updatedAt',
        draftSettlement: 'id',
      })
      .upgrade(async (tx) => {
        await tx
          .table('settlements')
          .toCollection()
          .modify((s: Record<string, unknown>) => {
            delete s.status
          })
        const draft = await tx.table('draftSettlement').get('draft')
        if (draft?.data) {
          delete draft.data.status
          await tx.table('draftSettlement').put(draft)
        }
      })
    // v3: remove computed paid/spent fields from stored members
    this.version(3)
      .stores({
        settlements: 'id, updatedAt',
        draftSettlement: 'id',
      })
      .upgrade(async (tx) => {
        type RawMember = { paid?: unknown; spent?: unknown }
        const stripMember = (m: RawMember) => {
          delete m.paid
          delete m.spent
        }
        await tx
          .table('settlements')
          .toCollection()
          .modify((s: { members?: RawMember[] }) => {
            s.members?.forEach(stripMember)
          })
        const draft = await tx.table('draftSettlement').get('draft')
        if (draft?.data?.members) {
          draft.data.members.forEach(stripMember)
          await tx.table('draftSettlement').put(draft)
        }
      })
  }
}

export const db = new BillSplitterDB()
