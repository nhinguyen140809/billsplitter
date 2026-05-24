import { Copy, Pencil, X } from 'lucide-react'
import type { Bill, BillType, BillShareValue } from '@/types'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

function BillItemName({ name }: { name: string }) {
  return <h3 className="text-primary py-1 text-base font-bold break-all sm:text-lg">{name}</h3>
}

function BillItemType({ type }: { type: BillType }) {
  return (
    <p
      className={`text-sm font-bold ${
        type === 'equal' ? 'bg-chart-2/20 text-chart-2' : 'bg-chart-3/20 text-chart-3'
      } w-fit rounded-full px-3 py-1 sm:px-4`}
    >
      {type === 'equal' ? 'Equal' : 'Unequal'}
    </p>
  )
}

function BillItemHeader({ bill }: { bill: Bill }) {
  return (
    <div className="justify-top mb-2 flex flex-col items-start gap-2">
      <BillItemName name={bill.name} />
      <BillItemType type={bill.type} />
    </div>
  )
}

function BillItemButtons({
  onEdit,
  onDelete,
  onDuplicate,
}: {
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const buttonList: { icon: React.ReactNode; onClick: () => void; testId: string }[] = [
    { icon: <Pencil />, onClick: onEdit, testId: 'bill-edit-btn' },
    { icon: <Copy />, onClick: onDuplicate, testId: 'bill-duplicate-btn' },
    { icon: <X />, onClick: onDelete, testId: 'bill-delete-btn' },
  ]

  return (
    <div className="justify-top mb-4 flex flex-col-reverse items-center gap-1 @[300px]:flex-row">
      {buttonList.map((button) => (
        <Button
          key={button.testId}
          variant="ghost"
          size="icon"
          className="sm:size-10"
          onClick={button.onClick}
          data-testid={button.testId}
        >
          {button.icon}
        </Button>
      ))}
    </div>
  )
}

function BillItemPayer({ bill }: { bill: Bill }) {
  return (
    <div className="flex items-start gap-2">
      <p className="text-muted-foreground">Payer:</p>
      <p className="text-primary font-medium break-all">{bill.payer}</p>
    </div>
  )
}

function BillAmount({ amount }: { amount: number }) {
  return (
    <div className="mt-2 flex gap-2">
      <p className="text-muted-foreground">Amount:</p>
      <p className="text-primary font-medium">{formatCurrency(amount)}</p>
    </div>
  )
}

function BillParticipants({ shares }: { shares: BillShareValue }) {
  const participants = Object.keys(shares).filter((member) => shares[member] > 0)

  return (
    <div className="mt-2 flex gap-2">
      <p className="text-muted-foreground">Participants:</p>
      <p className="text-primary font-medium break-all">{participants.join(', ')}</p>
    </div>
  )
}

function BillShares({ shares }: { shares: BillShareValue }) {
  return (
    <div className="mt-2">
      <p className="text-muted-foreground mb-1">Shares:</p>
      <div className="grid grid-cols-[max-content_max-content] gap-x-5 pl-4">
        {Object.entries(shares).map(([member, share]) => (
          <>
            <span className="text-primary max-w-[60cqw] font-medium break-all" key={member}>
              {member}
            </span>
            <span
              className="text-primary max-w-[30cqw] text-right font-medium break-all"
              key={`${member}_${share}`}
            >
              {formatCurrency(share)}
            </span>
          </>
        ))}
      </div>
    </div>
  )
}

function EqualBillContent({ bill }: { bill: Bill }) {
  return (
    <>
      <BillAmount amount={bill.amount} />
      <BillParticipants shares={bill.shares} />
    </>
  )
}

function UnequalBillContent({ bill }: { bill: Bill }) {
  return (
    <>
      <BillAmount key={`amount-${bill.id}`} amount={bill.amount} />
      <BillShares key={`shares-${bill.id}`} shares={bill.shares} />
    </>
  )
}

function BillItemContainer({ children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className="border-primary hover:shadow-primary/40 @container relative flex h-full flex-col rounded-2xl border p-4 pl-6 transition duration-400 hover:scale-102 hover:shadow-lg"
      {...props}
    >
      {children}
    </div>
  )
}

function BillItem({
  bill,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  bill: Bill
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  return (
    <BillItemContainer data-testid={`bill-item-${bill.name}`}>
      <div className="flex flex-col items-start justify-between gap-2">
        <BillItemHeader bill={bill} />
        <div className="flex flex-col text-sm">
          <BillItemPayer bill={bill}></BillItemPayer>
          {bill.type === 'equal' && <EqualBillContent key={bill.id} bill={bill} />}
          {bill.type === 'unequal' && <UnequalBillContent key={bill.id} bill={bill} />}
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <BillItemButtons onEdit={onEdit} onDelete={onDelete} onDuplicate={onDuplicate} />
      </div>
    </BillItemContainer>
  )
}

function BillList({
  bills,
  onDelete,
  onEdit,
  onDuplicate,
}: {
  bills: Bill[]
  onDelete: (billId: string) => void
  onEdit: (bill: Bill) => void
  onDuplicate: (billId: string) => void
}) {
  return (
    <motion.div className="mt-4 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
      {bills.map((bill) => (
        <motion.div
          key={bill.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-full flex-col"
        >
          <BillItem
            key={bill.id}
            bill={bill}
            onEdit={() => onEdit(bill)}
            onDelete={() => onDelete(bill.id)}
            onDuplicate={() => onDuplicate(bill.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default BillList
