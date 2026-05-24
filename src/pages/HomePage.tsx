import { SectionBill } from '@/features/bill'
import { SectionParticipant } from '@/features/participants'
import { SectionPayments } from '@/features/payments'
import AppHeader from '@/components/shared/AppHeader'
import AppFooter from '@/components/shared/AppFooter'
import { useDraftSettlement } from '@/hooks/useDraftSettlement'
import { DraftSettlementProvider } from '@/context/SettlementContext'
import { Button } from '@/components/ui/button'
import { ChevronRight, RotateCcw, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Section from '@/components/shared/Section'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/ui/field'

function SaveSettlementDialog({ onSave }: { onSave: (name: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSaveClick = () => {
    if (inputRef.current) {
      const name = inputRef.current.value
      onSave(name)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Save data-icon="inline-start" /> Save
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left">Save settlement</DialogTitle>
        </DialogHeader>
        <Field>
          <Input
            placeholder="Settlement name"
            ref={inputRef}
            className="focus-visible:ring-primary/50 focus-visible:ring-offset-background my-2 text-sm font-medium focus-visible:ring-1 focus-visible:ring-offset-0"
          />
        </Field>
        <DialogFooter className="flex flex-row justify-end">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSaveClick} size="sm">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function HomePage() {
  const { draft, clearDraft, createSettlementFromDraft } = useDraftSettlement()
  const navigate = useNavigate()

  const handleCreatSettlementFromDraft = async (name: string) => {
    const newSettlementId = await createSettlementFromDraft({ ...draft, name })
    navigate('/settlements/' + newSettlementId)
  }

  return (
    <>
      <AppHeader>
        <div className="flex items-end justify-end">
          <Button
            variant="ghost"
            className="transition-all duration-200 hover:gap-3"
            onClick={() => navigate('/settlements')}
          >
            Settlements
            <ChevronRight data-icon="inline-end" className="size-6 sm:size-7" />
          </Button>
        </div>
      </AppHeader>
      <Section className="border-border py-6!">
        <div className="flex flex-row items-center justify-between gap-4">
          <Button variant="secondary" onClick={clearDraft}>
            <RotateCcw data-icon="inline-start" strokeWidth={2.5} /> Clear
          </Button>
          <SaveSettlementDialog onSave={handleCreatSettlementFromDraft} />
        </div>
      </Section>

      <DraftSettlementProvider>
        <SectionParticipant />
        <SectionBill />
        <SectionPayments />
      </DraftSettlementProvider>

      <AppFooter />
    </>
  )
}
