import { useSettlements } from '@/hooks/useSettlements'
import { useNavigate } from 'react-router-dom'
import type { Settlement } from '@/types'
import { Button } from '@/components/ui/button'
import { Copy, Home, Pencil, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'
import AppHeader from '@/components/shared/AppHeader'
import AppFooter from '@/components/shared/AppFooter'
import Section from '@/components/shared/Section'
import { ChevronLeft } from 'lucide-react'

function SettlementItemHeader({ settlement }: { settlement: Settlement }) {
  return (
    <h3 className="text-primary py-1 text-base font-bold break-all hyphens-auto sm:text-lg">
      {settlement.name || 'Untitled Settlement'}
    </h3>
  )
}

function SettlementItemContent({ settlement }: { settlement: Settlement }) {
  return (
    <div className="justify-top mb-2 flex flex-col items-start gap-2">
      <p className="text-muted-foreground text-xs font-medium wrap-break-word sm:text-sm">
        Updated at: {formatDate(settlement.updatedAt)}
      </p>
    </div>
  )
}

function SettlementItemButtons({
  onEdit,
  onDelete,
  onDuplicate,
}: {
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const buttonList: { icon: React.ReactNode; onClick: () => void }[] = [
    { icon: <X />, onClick: onDelete },
    { icon: <Copy />, onClick: onDuplicate },
    { icon: <Pencil />, onClick: onEdit },
  ]
  return (
    <div className="justify-top mb-4 flex flex-col items-center gap-1">
      {buttonList.map((button, index) => (
        <Button
          key={index}
          variant="ghost"
          size="icon"
          className="sm:size-10"
          onClick={button.onClick}
        >
          {button.icon}
        </Button>
      ))}
    </div>
  )
}

function SettlementItem({
  settlement,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  settlement: Settlement
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  return (
    <div className="border-primary hover:shadow-primary/40 flex h-full flex-row rounded-2xl border p-4 pl-6 transition duration-400 hover:scale-102 hover:shadow-lg">
      <div className="w-auto flex-1">
        <SettlementItemHeader settlement={settlement} />
        <SettlementItemContent settlement={settlement} />
      </div>
      <SettlementItemButtons onEdit={onEdit} onDelete={onDelete} onDuplicate={onDuplicate} />
    </div>
  )
}

export default function SettlementsPage() {
  const { settlementList, deleteSettlement, duplicateSettlement } = useSettlements()
  const navigate = useNavigate()

  return (
    <>
      <AppHeader>
        <div className="flex flex-col items-start justify-start gap-4 sm:flex-row">
          <Button
            variant="ghost"
            className="transition-all duration-200 hover:gap-3"
            onClick={() => navigate('/')}
          >
            <ChevronLeft data-icon="inline-start" className="size-6 sm:size-7" />
            <span className="hidden sm:inline">Home</span>
            <Home className="size-5 sm:hidden" />
          </Button>
        </div>
      </AppHeader>

      <Section title="My Settlements">
        <motion.div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {settlementList.length === 0 && (
            <p className="text-muted-foreground col-span-full my-4 text-center text-sm sm:text-base">
              No settlements found. Create a new one from the home page!
            </p>
          )}
          {settlementList.map((settlement) => (
            <motion.div
              key={settlement.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full flex-col"
            >
              <SettlementItem
                key={settlement.id}
                settlement={settlement}
                onEdit={() => navigate(`/settlements/${settlement.id}`)}
                onDelete={() => deleteSettlement(settlement.id)}
                onDuplicate={() => duplicateSettlement(settlement.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </Section>
      <AppFooter />
    </>
  )
}
