import { useSettlementContext } from '@/context/SettlementContext'
import type { StoredMember } from '@/types'

export function useMembers() {
  const { data, update } = useSettlementContext()
  const members = data.members

  const addMember = (name: string) => {
    if (!name) {
      throw new Error('Name cannot be empty')
    }
    if (members.some((member) => member.name === name)) {
      throw new Error('Name already exists')
    }
    const newMembers: StoredMember[] = [...members, { id: crypto.randomUUID(), name }]
    update({ members: newMembers })
  }

  const removeMember = (id: string) => {
    update({ members: members.filter((member) => member.id !== id) })
  }

  return { members, addMember, removeMember }
}
