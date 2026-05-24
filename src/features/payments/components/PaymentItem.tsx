import type { PaymentItemData, DebtPartyType, TransactionMap } from '@/types'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

function PaymentItemHeader({ name, type }: { name: string; type: DebtPartyType }) {
  return (
    <div className="flex flex-row gap-4 overflow-visible @[250px]:flex-col">
      <div>
        <p className="text-primary text-base font-bold break-all sm:text-lg">{name}</p>
      </div>
      <div>
        <p
          className={`text-sm font-bold ${
            type === 'sender' ? 'bg-chart-3/20 text-chart-3' : 'bg-chart-2/20 text-chart-2'
          } w-fit rounded-full px-3 py-1 sm:px-4`}
        >
          {type === 'sender' ? 'Sender' : 'Receiver'}
        </p>
      </div>
    </div>
  )
}

function TransactionItem({
  name,
  amount,
  type,
}: {
  name: string
  amount: string
  type: DebtPartyType
}) {
  return (
    <div key={name} className="flex flex-wrap items-center gap-2 text-sm">
      {type === 'sender' ? (
        <div className="bg-chart-3/20 text-chart-3 flex size-5 items-center justify-center rounded-full sm:size-6">
          <ArrowUpRight strokeWidth={2.5} className="size-4 sm:size-5" />
        </div>
      ) : (
        <div className="bg-chart-2/20 text-chart-2 flex size-5 items-center justify-center rounded-full sm:size-6">
          <ArrowDownLeft strokeWidth={2.5} className="size-4 sm:size-5" />
        </div>
      )}
      <p className="text-muted-foreground break-all">{name}:</p>
      <p className="text-primary font-medium break-all">{amount}</p>
    </div>
  )
}

function TransactionList({
  transactions,
  type,
}: {
  transactions: TransactionMap
  type: DebtPartyType
}) {
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(transactions).map(([name, amount]) => (
        <TransactionItem key={name} name={name} amount={amount} type={type} />
      ))}
    </div>
  )
}

export default function PaymentItem({ name, transactions, type }: PaymentItemData) {
  return (
    <div className="border-primary hover:shadow-primary/40 @container flex flex-wrap justify-start gap-4 rounded-2xl border p-4 transition duration-400 hover:scale-102 hover:shadow-lg sm:px-6">
      <PaymentItemHeader name={name} type={type} />
      <TransactionList transactions={transactions} type={type} />
    </div>
  )
}
