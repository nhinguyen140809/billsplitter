import { useBillForm } from '../../hooks/useBillForm'
import BillPayerSelector from './info/BillPayerSelector'
import BillFormContext from '../../context/BillFormContext'
import BillNameInput from './info/BillNameInput'
import BillTypeButtons from './info/BillTypeButtons'
import UnequalBillShares from './split/UnequalBillSplit'
import { EqualBillAmount, EqualBillParticipants } from './split/EqualBillSplit'
import { Calculator } from '@/features/calculator'
import { Button } from '@/components/ui/button'
import Overlay from '@/components/shared/Overlay'
import Popup from '@/components/shared/Popup'
import { useMembers } from '@/features/participants'
import type { Bill, BillType } from '@/types'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

function BillFormFooterButtons({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <div className="mt-2 flex justify-end gap-4">
      <Button onClick={onClose} variant="outline" size="sm">
        Cancel
      </Button>
      <Button onClick={onSave} variant="default" size="sm">
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
    if (selectedBill) {
      billForm.setSelectedBillForm(selectedBill)
    } else {
      billForm.setSelectedBillForm(null)
    }
  }, [selectedBill])

  return (
    <BillFormContext.Provider value={billForm}>
      <Overlay>
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
