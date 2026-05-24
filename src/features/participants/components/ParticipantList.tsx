import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Member } from '@/types'
import { motion } from 'framer-motion'

function ParticipantItem({
  member,
  onRemove,
  isLocked,
}: {
  member: Member
  onRemove: (id: string) => void
  isLocked: boolean
}) {
  return (
    <div className="bg-primary text-primary-foreground shadow-primary/40 flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition hover:scale-105 hover:shadow-md has-[button]:py-1.5 has-[button]:pr-2 has-[button]:pl-4 sm:text-base sm:has-[button]:py-2 [&>svg]:size-4">
      <span className="break-all">{member.name}</span>
      {!isLocked && (
        <Button
          onClick={() => onRemove(member.id)}
          variant="ghost"
          size="icon-xs"
          className="rounded-full"
        >
          <X />
        </Button>
      )}
    </div>
  )
}

export default function ParticipantList({
  members,
  onRemove,
  isLocked,
}: {
  members: Member[]
  onRemove: (id: string) => void
  isLocked: boolean
}) {
  return (
    <motion.div className="mt-1 flex flex-wrap gap-4 transition-all duration-200 sm:mt-4">
      {members.map((member) => (
        <motion.div
          key={member.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ParticipantItem
            key={member.id}
            member={member}
            onRemove={onRemove}
            isLocked={isLocked}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
