import { useCallback } from 'react'
import { useSettlementContext } from '@/context/SettlementContext'
import type { StoredMember } from '@/types'

export function useMembers() {
  const { data, update } = useSettlementContext()
  const members = data.members

  const addMember = useCallback(
    (name: string) => {
      if (!name) throw new Error('Name cannot be empty')
      if (members.some((member) => member.name === name)) throw new Error('Name already exists')
      const newMembers: StoredMember[] = [...members, { id: crypto.randomUUID(), name }]
      update({ members: newMembers })
    },
    [members, update]
  )

  const removeMember = useCallback(
    (id: string) => {
      update({ members: members.filter((member) => member.id !== id) })
    },
    [members, update]
  )

  return { members, addMember, removeMember }
}
