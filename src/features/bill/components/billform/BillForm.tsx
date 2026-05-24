import { useBillForm } from '../../hooks/useBillForm'
import BillFormContext from '../../context/BillFormContext'
import UnequalBillShares from './split/UnequalBillSplit'
import { EqualBillAmount, EqualBillParticipants } from './split/EqualBillSplit'
import { Calculator } from '@/features/calculator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { UserRound } from 'lucide-react'
import Overlay from '@/components/shared/Overlay'
import Popup from '@/components/shared/Popup'
import { useMembers } from '@/features/participants'
import { useBillFormContext } from '../../context/BillFormContext'
import type { Bill, BillType } from '@/types'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

function BillNameInput() {
  const { formData, updateFormFieldWrapper } = useBillFormContext()
  return (
    <Input
      variant="underline"
      size="lg"
      type="text"
      name="name"
      placeholder="Bill name"
      autoComplete="off"
      data-testid="bill-name-input"
      className="mb-3 font-bold sm:mb-4 sm:text-xl"
      value={formData.name}
      onChange={updateFormFieldWrapper}
    />
  )
}

function BillPayerSelector() {
  const { formData, updateFormField } = useBillFormContext()
  const { members } = useMembers()
  return (
    <div className="flex items-center justify-between">
      <div className="text-primary mr-4 flex h-7 w-6 items-center justify-center rounded-full sm:w-10">
        <UserRound className="size-5" />
      </div>
      <Select
        name="payer"
        value={formData.payer}
        defaultValue="Select payer"
        onValueChange={(value) => updateFormField('payer', value)}
      >
        <SelectTrigger
          className="text-card-foreground focus:border-primary mb-1 w-full border-0 transition duration-200 outline-none"
          data-testid="bill-payer-select"
        >
          <SelectValue placeholder="Paid by..." className="text-muted" />
        </SelectTrigger>
        <SelectContent side="bottom" position="popper" className="w-(--radix-select-trigger-width)">
          <option value="" disabled hidden>
            Paid by...
          </option>
          {members.map((member) => (
            <SelectItem className="break-all" key={member.id} value={member.name}>
              <span> {member.name} </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function BillTypeButtons() {
  const { formData, updateFormField } = useBillFormContext()
  const isEqual = formData.type === 'equal'
  return (
    <div className="mb-4 flex gap-4 transition-colors duration-1000">
      {(['Equal', 'Unequal'] as const).map((label) => (
        <Button
          key={label}
          variant={isEqual === (label === 'Equal') ? 'default' : 'outline'}
          onClick={() => updateFormField('type', label === 'Equal' ? 'equal' : 'unequal')}
          size="sm"
          data-testid={`bill-type-${label.toLowerCase()}`}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}

function BillFormFooterButtons({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <div className="mt-2 flex justify-end gap-4">
      <Button onClick={onClose} variant="outline" size="sm" data-testid="bill-cancel-btn">
        Cancel
      </Button>
      <Button onClick={onSave} variant="default" size="sm" data-testid="bill-save-btn">
        Save
      </Button>
    </div>
  )
}

function BillSplit({ type }: { type: BillType }) {
  return (
    <div className="grid w-full">
      <div
        className={cn(
          'col-start-1 row-start-1 min-w-0 transition-opacity duration-300',
          type === 'equal' ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <EqualBillAmount />
        <EqualBillParticipants />
      </div>

      <div
        className={cn(
          'col-start-1 row-start-1 min-w-0 transition-opacity duration-300',
          type === 'unequal' ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <UnequalBillShares />
      </div>
    </div>
  )
}

export default function BillFormPopup({
  selectedBill,
  onSubmitBillForm,
  onClose,
}: {
  selectedBill: Bill | null
  onSubmitBillForm: (bill: Bill) => void
  onClose: () => void
}) {
  const { members } = useMembers()
  const billForm = useBillForm(members, onSubmitBillForm, onClose)

  useEffect(() => {
    billForm.setSelectedBillForm(selectedBill)
  }, [selectedBill])

  return (
    <BillFormContext.Provider value={billForm}>
      <Overlay data-testid="bill-form">
        <Popup title="Bill Details">
          <BillNameInput />
          <BillTypeButtons />
          <BillPayerSelector />
          <BillSplit type={billForm.formData.type} />
          {billForm.formErrorMessage && (
            <p className="text-destructive text-xs font-medium sm:text-sm">
              {billForm.formErrorMessage}
            </p>
          )}
          <BillFormFooterButtons
            onClose={billForm.handleCloseForm}
            onSave={billForm.handleSubmitForm}
          />
        </Popup>
      </Overlay>
      <Calculator
        openCalculator={billForm.calculatorOpened}
        onClose={billForm.closeCalculator}
        onSave={billForm.saveCalculator}
      />
    </BillFormContext.Provider>
  )
}
