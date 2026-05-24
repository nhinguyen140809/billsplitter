import { Banknote } from 'lucide-react'
import { useCallback, useRef } from 'react'
import { useBillFormContext } from '../../../context/BillFormContext'
import { Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useMembers } from '@/features/participants'
import CalculatorButton from '../CalculatorButton'

function BanknoteIcon() {
  return (
    <div className="text-primary mr-3.5 flex h-7 w-6 items-center justify-center rounded-full sm:w-10">
      <Banknote size={20} />
    </div>
  )
}

function CheckboxItem({
  label,
  name,
  checked,
  onChange,
}: {
  label: string
  name: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="group relative flex cursor-pointer items-center gap-3 px-4 transition-all">
      <input
        type="checkbox"
        name={name}
        className="accent-primary peer hidden size-3.5 cursor-pointer rounded-lg transition-all group-hover:scale-120 focus:ring-0 sm:h-4 sm:w-4"
        onChange={onChange}
        checked={checked}
      />
      <span className="border-accent peer-checked:bg-accent peer-checked:border-accent text-card-foreground flex size-4 items-center justify-center rounded-full border-2 transition-all duration-200 sm:size-5 peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100">
        <Check
          strokeWidth={3.5}
          className="size-3 scale-75 opacity-0 transition-all duration-200 sm:size-3.5"
        />
      </span>

      <p className="text-card-foreground group-hover:text-primary text-sm break-all transition-colors duration-200 select-none">
        {label}
      </p>
    </label>
  )
}

function SelectAllCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <CheckboxItem
      key="select-all"
      name="select-all"
      checked={checked}
      label="All"
      onChange={onChange}
    />
  )
}

function EqualBillAmount() {
  const { formData, updateFormFieldWrapper, openCalculator } = useBillFormContext()
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="mb-2 flex w-full items-center justify-between">
      <BanknoteIcon />
      <Input
        variant="underline"
        size="sm"
        type="text"
        name="amount"
        placeholder="Total amount"
        autoComplete="off"
        className="mr-4 mb-2 flex-1"
        value={formData.amount}
        onChange={updateFormFieldWrapper}
        ref={inputRef}
      />
      <CalculatorButton onClick={() => openCalculator(inputRef.current)} />
    </div>
  )
}

function EqualBillParticipants() {
  const { formData, updateFormField, updateFormFieldWrapper, selectAll } = useBillFormContext()
  const { members } = useMembers()

  const participantCount = members.filter((m) => (parseFloat(formData.shares[m.name]) || 0) > 0).length

  const toggleAllShares = useCallback(
    (checked: boolean) => {
      const newShares: Record<string, string> = {}
      members.forEach((member) => {
        newShares[member.name] = checked ? '1' : '0'
      })
      updateFormField('shares', newShares)
    },
    [members, updateFormField]
  )

  return (
    <div className="mb-2">
      <div className="mb-2 flex items-center justify-between sm:mb-4">
        <p className="text-primary text-sm font-bold sm:text-base">Select Participants:</p>
        <p className="text-muted-foreground text-xs">
          {participantCount} / {members.length} selected
        </p>
      </div>
      <ScrollArea>
        <div className="flex max-h-[30vh] min-h-0 flex-1 flex-col gap-3">
          <SelectAllCheckbox
            checked={selectAll}
            onChange={(e) => toggleAllShares(e.target.checked)}
          />
          {members.map((member) => (
            <CheckboxItem
              key={member.id}
              name={`equal-share-${member.name}`}
              checked={Number(formData.shares[member.name]) > 0}
              label={member.name}
              onChange={updateFormFieldWrapper}
            />
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  )
}

export { EqualBillAmount, EqualBillParticipants }
