import { Banknote, CalculatorIcon } from 'lucide-react'
import type { BillShareValue } from '@/types'
import { useRef } from 'react'
import { useBillFormContext } from '../../../context/BillFormContext'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useMembers } from '@/features/participants'
import { useParams } from 'react-router-dom'

function AmountInput({
  value,
  onChange,
  inputRef,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <input
      type="string"
      name="amount"
      placeholder="Total amount"
      className="text-card-foreground focus:border-b-primary border-b-accent mr-4 mb-2 flex-1 border-b-2 p-1 text-sm transition duration-200 outline-none sm:text-base"
      value={value}
      onChange={onChange}
      min="0"
      ref={inputRef}
    />
  )
}

function EqualBillAmount() {
  const { formData, updateFormFieldWrapper, openCalculator } = useBillFormContext()
  let inputRef = useRef<HTMLInputElement | null>(null)

  function BanknoteIcon() {
    return (
      <div className="text-primary mr-3.5 flex h-7 w-6 items-center justify-center rounded-full sm:w-10">
        <Banknote size={20} />
      </div>
    )
  }

  function CalculatorButton({ handleClick }: { handleClick: () => void }) {
    return (
      <Button className="rounded-full" variant="ghost" size="icon-lg" onClick={handleClick}>
        <CalculatorIcon className="size-5" />
      </Button>
    )
  }
  return (
    <div className="mb-2 flex w-full items-center justify-between">
      <BanknoteIcon />
      <AmountInput value={formData.amount} onChange={updateFormFieldWrapper} inputRef={inputRef} />
      <CalculatorButton handleClick={() => openCalculator(inputRef.current)} />
    </div>
  )
}

function EqualBillParticipants() {
  const { formData, updateFormField, updateFormFieldWrapper, selectAll } = useBillFormContext()
  const { id: settlementId } = useParams()
  const { members } = useMembers(settlementId)

  const participantCount = members.filter(
    (m) => (parseFloat(formData.shares[m.name]) || 0) > 0
  ).length

  const toggleAllShares = (checked: boolean) => {
    // For "Select All" checkbox
    if (checked) {
      const newShares: BillShareValue = {}
      members.forEach((member) => {
        newShares[member.name] = checked ? 1 : 0
      })
      updateFormField('shares', newShares)
    } else {
      const newShares: BillShareValue = {}
      members.forEach((member) => {
        newShares[member.name] = 0
      })
      updateFormField('shares', newShares)
    }
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

  return (
    <div className="mb-2">
      <div className="mb-2 flex items-center justify-between sm:mb-4">
        <p className="text-primary text-sm font-bold sm:text-base">Select Participants:</p>
        <p className="text-muted-foreground text-xs">
          {participantCount} / {members.length} selected
        </p>
      </div>
      <ScrollArea className="">
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
