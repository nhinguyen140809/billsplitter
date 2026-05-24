import { useRef } from 'react'
import { useBillFormContext } from '../../../context/BillFormContext'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { useMembers } from '@/features/participants'
import type { StoredMember } from '@/types'
import CalculatorButton from '../CalculatorButton'

function UnequalShareInput({
  member,
  value,
  onChange,
}: {
  member: StoredMember
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { openCalculator } = useBillFormContext()
  return (
    <div key={member.id} className="mt-1 flex items-end justify-between gap-2 pr-3 sm:gap-4">
      <p className="text-card-foreground mb-2 w-1/2 break-all">{member.name}:</p>
      <div className="flex items-center justify-end gap-2 sm:gap-4">
        <Input
          variant="underline"
          size="sm"
          type="number"
          name={`unequal-share-${member.name}`}
          autoComplete="off"
          className="ml-2"
          min="0"
          onChange={onChange}
          value={value}
          ref={inputRef}
        />
        <CalculatorButton onClick={() => openCalculator(inputRef.current)} />
      </div>
    </div>
  )
}

function UnequalBillShares() {
  const { formData, updateFormFieldWrapper } = useBillFormContext()
  const { members } = useMembers()

  const participantCount = members.filter((m) => (parseFloat(formData.shares[m.name]) || 0) > 0).length

  return (
    <div className="mt-2 mb-2">
      <div className="mb-2 flex items-center justify-between sm:mb-4">
        <p className="text-primary text-sm font-bold sm:text-base">Assign shares:</p>
        <p className="text-muted-foreground text-xs">
          {participantCount} / {members.length} selected
        </p>
      </div>
      <ScrollArea className="flex max-h-[38vh] min-h-0 flex-1 flex-col text-sm">
        {members.map((member) => (
          <UnequalShareInput
            key={member.id}
            member={member}
            value={formData.shares[member.name] || ''}
            onChange={updateFormFieldWrapper}
          />
        ))}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  )
}

export default UnequalBillShares
