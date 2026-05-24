import { useState } from 'react'
import BillList from './components/BillIList'
import BillFormPopup from './components/billform/BillForm'
import { Plus } from 'lucide-react'
import Section from '@/components/shared/Section'
import { Button } from '@/components/ui/button'
import { useBills } from './hooks/useBills'
import type { Bill } from '@/types'
import { useParams } from 'react-router-dom'

function SectionBill() {
  const { id: settlementId } = useParams()
  const { bills, onSubmitBillForm, removeBill, duplicateBill } = useBills(settlementId)

  const [showForm, setShowForm] = useState<boolean>(false)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)

  const handleEditBillClick = (bill: Bill) => {
    setSelectedBill(bill)
    setShowForm(true)
  }

  return (
    <>
      <Section title="Bills">
        <div className="flex justify-end py-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(true)
              setSelectedBill(null)
            }}
          >
            <Plus />
            New bill
          </Button>
        </div>

        <BillList
          bills={bills}
          onDelete={removeBill}
          onEdit={handleEditBillClick}
          onDuplicate={duplicateBill}
        />
      </Section>
      {showForm && (
        <BillFormPopup
          selectedBill={selectedBill}
          onSubmitBillForm={onSubmitBillForm}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  )
}

export { SectionBill }
