import { CalculatorIcon } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { useBillFormContext } from '../../../context/BillFormContext'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useMembers } from '@/features/participants'
import type { StoredMember } from '@/types'

function UnequalShareInput({
  member,
  value,
  onChange,
}: {
  member: StoredMember
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const inputRef = useRef(null)
  const { openCalculator } = useBillFormContext()
  return (
    <div key={member.id} className="mt-1 flex items-end justify-between gap-2 pr-3 sm:gap-4">
      <p className="text-card-foreground mb-2 w-1/2 break-all">{member.name}:</p>
      <div className="flex items-center justify-end gap-2 sm:gap-4">
        <input
          type="number"
          name={`unequal-share-${member.name}`}
          className="text-card-foreground focus:border-b-primary border-b-accent ml-2 w-full border-b-2 p-1 transition duration-200 outline-none"
          min="0"
          onChange={onChange}
          value={value}
          ref={inputRef}
        />
        <Button
          tabIndex={-1}
          variant="ghost"
          size="icon-lg"
          onClick={() => openCalculator(inputRef.current)}
        >
          <CalculatorIcon className="size-5" />
        </Button>
      </div>
    </div>
  )
}

function UnequalBillShares() {
  const { formData, updateFormFieldWrapper } = useBillFormContext()
  const { members } = useMembers()

  const participantCount = useMemo(
    () => members.filter((m) => (parseFloat(formData.shares[m.name]) || 0) > 0).length,
    [formData.shares, members]
  )

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
