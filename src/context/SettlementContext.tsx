import { createContext, useContext } from 'react'
import { useDraftSettlement } from '@/hooks/useDraftSettlement'
import { useSettlement } from '@/hooks/useSettlement'
import type { Settlement } from '@/types'

type SettlementContextValue = {
  data: Settlement
  update: (partial: Partial<Settlement>) => Promise<void>
  settlementId: string | undefined
}

const SettlementContext = createContext<SettlementContextValue | null>(null)

export function DraftSettlementProvider({ children }: { children: React.ReactNode }) {
  const { draft, updateDraft } = useDraftSettlement()
  return (
    <SettlementContext.Provider
      value={{ data: draft, update: updateDraft, settlementId: undefined }}
    >
      {children}
    </SettlementContext.Provider>
  )
}

export function SavedSettlementProvider({
  settlementId,
  children,
  fallback = null,
}: {
  settlementId: string
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { settlement, updateSettlementPartial } = useSettlement(settlementId)
  if (!settlement) return <>{fallback}</>
  return (
    <SettlementContext.Provider
      value={{ data: settlement, update: updateSettlementPartial, settlementId }}
    >
      {children}
    </SettlementContext.Provider>
  )
}

export function useSettlementContext() {
  const ctx = useContext(SettlementContext)
  if (!ctx) throw new Error('useSettlementContext must be used within a SettlementProvider')
  return ctx
}
