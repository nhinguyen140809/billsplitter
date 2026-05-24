import { SectionBill } from '@/features/bill'
import { SectionParticipant } from '@/features/participants'
import { SectionPayments } from '@/features/payments'
import AppHeader from '@/components/shared/AppHeader'
import AppFooter from '@/components/shared/AppFooter'
import { useSettlement } from '@/hooks/useSettlement'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, RotateCcw, Copy, Trash, Home } from 'lucide-react'
import { useState } from 'react'
import Section from '@/components/shared/Section'
import { Field, FieldLabel } from '@/components/ui/field'
import Overlay from '@/components/shared/Overlay'
import { Spinner } from '@/components/ui/spinner'

function ButtonsSection({
  onDelete,
  onClear,
  onDuplicate,
}: {
  onDelete: () => void
  onClear: () => void
  onDuplicate: () => void
}) {
  type ButtonInfo = {
    icon: React.ReactNode
    label: string
    onClick: () => void
    variant: 'outline' | 'ghost' | 'destructive' | 'secondary'
  }
  const buttonLeft: ButtonInfo[] = [
    {
      icon: <RotateCcw />,
      label: 'Clear',
      onClick: onClear,
      variant: 'secondary',
    },
    {
      icon: <Copy />,
      label: 'Duplicate',
      onClick: onDuplicate,
      variant: 'secondary',
    },
  ]
  const buttonRight: ButtonInfo[] = [
    {
      icon: <Trash />,
      label: 'Delete',
      onClick: onDelete,
      variant: 'destructive',
    },
  ]
  return (
    <Section className="border-border py-6!">
      <div className="flex justify-between">
        <div className="flex items-start gap-2">
          {buttonLeft.map((button, index) => (
            <Button key={index} variant={button.variant} onClick={button.onClick} size="sm">
              {button.icon}
              {button.label}
            </Button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          {buttonRight.map((button, index) => (
            <Button key={index} variant={button.variant} onClick={button.onClick} size="sm">
              {button.icon}
              {button.label}
            </Button>
          ))}
        </div>
      </div>
    </Section>
  )
}

function NameSection() {
  const { id: settlementId = '' } = useParams()
  const { settlement, updateSettlementPartial } = useSettlement(settlementId)

  return (
    <Section>
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-8">
        <Field className="w-full gap-1 sm:gap-3 md:max-w-4/7">
          <FieldLabel htmlFor="input-settlement-name">Settlement name</FieldLabel>
          <input
            type="text"
            placeholder="Untitled settlement"
            id="input-settlement-name"
            value={settlement?.name || ''}
            onChange={(e) => updateSettlementPartial({ name: e.target.value })}
            className="text-primary focus:border-b-primary border-b-accent w-full border-b-2 p-2 text-lg font-bold transition duration-200 outline-none md:text-xl"
          />
        </Field>
      </div>
    </Section>
  )
}

export default function SettlementDetailPage() {
  const navigate = useNavigate()
  const { id: settlementId } = useParams()

  const {
    settlement,
    updateSettlementPartial,
    deleteSettlement,
    duplicateSettlement,
    clearSettlement,
  } = useSettlement(settlementId ?? '')

  const [calculationState, setCalculationState] = useState<number>(0)

  const handleDuplication = async () => {
    const newSettlementId = await duplicateSettlement()
    navigate(`/settlements/${newSettlementId}`)
  }

  const isLoading = settlement === undefined

  return (
    <>
      <AppHeader>
        <div className="flex items-start justify-between">
          <Button
            variant="ghost"
            className="pr-6! pl-2! transition-all duration-200 hover:gap-3"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="size-6 sm:size-7" />
            <span className="hidden sm:inline">Home</span>
            <Home className="size-5 sm:hidden" />
          </Button>
          <Button
            variant="ghost"
            className="pr-2! pl-6! transition-all duration-200 hover:gap-3"
            onClick={() => navigate('/settlements')}
          >
            Settlements
            <ChevronRight className="size-6 sm:size-7" />
          </Button>
        </div>
      </AppHeader>
      {settlement && (
        <>
          <ButtonsSection
            onDelete={async () => {
              await deleteSettlement()
              navigate('/')
            }}
            onClear={clearSettlement}
            onDuplicate={handleDuplication}
          />
          <NameSection />

          <SectionParticipant
            onDone={async () => await updateSettlementPartial({ status: 'bill' })}
            status={settlement.status === 'member' ? 'enabled' : 'disabled'}
          />

          <SectionBill
            onDone={async () => {
              await updateSettlementPartial({
                status: 'payment',
              })
              setCalculationState((prev) => prev + 1)
            }}
            status={settlement.status !== 'member' ? 'enabled' : 'disabled'}
          />

          <SectionPayments
            status={settlement.status === 'payment' ? 'enabled' : 'disabled'}
            calculationState={calculationState}
          />
        </>
      )}

      {isLoading && (
        <Overlay className="flex-col gap-4">
          <Spinner className="size-12" />
          Loading ...
        </Overlay>
      )}

      {settlement === null && (
        <Section className="border-border py-6! text-center">
          <p className="text-muted-foreground text-base">Settlement not found</p>
        </Section>
      )}

      <AppFooter />
    </>
  )
}
