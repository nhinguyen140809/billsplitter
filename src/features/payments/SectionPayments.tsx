import { usePayments } from './hooks/usePayments'
import { useMembers } from '@/features/participants'
import { useBills } from '@/features/bill'
import { useCalculationWorker } from '@/workers/useCalculationWorker'
import Section from '@/components/shared/Section'
import PaymentItem from './components/PaymentItem'
import Overlay from '@/components/shared/Overlay'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Calculator } from 'lucide-react'

function SectionPayments() {
  const { sendPayments, receivePayments, updatePayments } = usePayments()
  const { members } = useMembers()
  const { bills } = useBills()

  const { calculate, isCalculating, calculationError } = useCalculationWorker(updatePayments)

  const handleCalculate = () => {
    if (members.length === 0 || bills.length === 0) return
    calculate(members, bills)
  }

  return (
    <>
      <Section title="Payments">
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            {calculationError && (
              <p className="text-destructive text-xs sm:text-sm">{calculationError}</p>
            )}
            <Button
              onClick={handleCalculate}
              variant="default"
              className="ml-auto"
              disabled={isCalculating || members.length === 0 || bills.length === 0}
            >
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
      {isCalculating && (
        <Overlay className="flex flex-col items-center gap-4">
          <Spinner className="size-10 sm:size-12" />
          Calculating ...
        </Overlay>
      )}
    </>
  )
}

export { SectionPayments }
