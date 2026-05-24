import { useState } from 'react'
import { calculateSettlement } from '@/lib/calculateSettlement'
import { usePayments } from './hooks/usePayments'
import { useMembers } from '@/features/participants'
import { useBills } from '@/features/bill'
import Section from '@/components/shared/Section'
import PaymentItem from './components/PaymentItem'
import { Button } from '@/components/ui/button'
import { Calculator } from 'lucide-react'
import { useParams } from 'react-router-dom'

function SectionPayments() {
  const { id: settlementId } = useParams()
  const { sendPayments, receivePayments, updatePayments } = usePayments(settlementId)
  const { members } = useMembers(settlementId)
  const { bills } = useBills(settlementId)

  const [calculationError, setCalculationError] = useState<string>('')

  const handleCalculate = () => {
    if (members.length === 0 || bills.length === 0) {
      setCalculationError('Please add members and bills first.')
      return
    }
    try {
      const { sendPayments: send, receivePayments: receive } = calculateSettlement(members, bills)
      updatePayments(send, receive)
      setCalculationError('')
    } catch (error) {
      console.error('Error calculating settlement:', error)
      setCalculationError('Failed to calculate settlements. Please check your bills and members.')
    }
  }

  return (
    <Section title="Payments">
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          {calculationError && (
            <p className="text-destructive text-xs sm:text-sm">{calculationError}</p>
          )}
          <Button onClick={handleCalculate} variant="default" className="ml-auto">
            <Calculator />
            Calculate Payments
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.entries(sendPayments).map(([name, transactionMap]) => (
            <PaymentItem key={name} name={name} transactions={transactionMap} type="sender" />
          ))}
          {Object.entries(receivePayments).map(([name, transactionMap]) => (
            <PaymentItem key={name} name={name} transactions={transactionMap} type="receiver" />
          ))}
        </div>
      </div>
    </Section>
  )
}

export { SectionPayments }
