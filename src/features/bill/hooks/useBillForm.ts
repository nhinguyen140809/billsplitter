import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { billFormSchema, type BillFormValues } from '../schemas/billFormSchema'
import type { Bill, StoredMember } from '@/types'

const DEFAULT_VALUES: BillFormValues = {
  id: '',
  name: '',
  type: 'equal',
  payer: '',
  amount: '',
  shares: {},
}

/**
 * Manages all state for the bill add/edit form using react-hook-form and Zod.
 *
 * Responsibilities:
 * - Validation via `billFormSchema` (payer, amount, shares cross-field rules).
 * - Calculator overlay integration: tracks which input is active and writes
 *   the result back via `form.setValue`.
 * - `setSelectedBillForm` resets the form with an existing bill's data for editing.
 * - `selectAll` reflects whether every current member has a share > 0.
 *
 * @param members         - Current member list; used to compute `selectAll`.
 * @param onSubmitBillForm - Called with the validated `Bill` on successful submit.
 * @param onClose          - Called after submit or cancel to close the form.
 */
export function useBillForm(
  members: StoredMember[],
  onSubmitBillForm: (bill: Bill) => void,
  onClose: () => void
) {
  const form = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const [calculatorOpened, setCalculatorOpened] = useState(false)
  const activeInputRef = useRef<HTMLInputElement | null>(null)

  const openCalculator = (inputRef: HTMLInputElement | null) => {
    if (!inputRef) return
    activeInputRef.current = inputRef
    setCalculatorOpened(true)
  }

  const saveCalculator = (value: string) => {
    const name = activeInputRef.current?.name
    if (!name) return

    if (name === 'amount') {
      form.setValue('amount', value, { shouldValidate: true })
    } else if (name.startsWith('unequal-share-')) {
      const memberName = name.replace('unequal-share-', '')
      form.setValue(`shares.${memberName}`, value, { shouldValidate: true })
    }
    setCalculatorOpened(false)
  }

  const handleSubmitForm = form.handleSubmit((values) => {
    const sharesValues = Object.fromEntries(
      Object.entries(values.shares).map(([k, v]) => [k, parseFloat(v) || 0])
    )
    const totalShares = Object.values(sharesValues).reduce((sum, v) => sum + v, 0)

    let billName = values.name.trim()
    if (!billName) {
      billName = `Bill #${Math.floor(Math.random() * 1000)}`
    }

    onSubmitBillForm({
      id: values.id,
      name: billName,
      type: values.type,
      payer: values.payer,
      amount: values.type === 'equal' ? parseFloat(values.amount) : totalShares,
      shares: sharesValues,
    })

    form.reset(DEFAULT_VALUES)
    onClose()
  })

  const handleCloseForm = () => {
    form.reset(DEFAULT_VALUES)
    onClose()
  }

  const setSelectedBillForm = (bill: Bill | null) => {
    if (!bill) {
      form.reset(DEFAULT_VALUES)
      return
    }
    form.reset({
      id: bill.id,
      name: bill.name,
      type: bill.type,
      payer: bill.payer,
      amount: bill.amount.toString(),
      shares: Object.fromEntries(Object.entries(bill.shares).map(([k, v]) => [k, v.toString()])),
    })
  }

  // Reactive snapshot — causes re-render on any field change (needed for type-switch, controlled inputs)
  const formData = form.watch()

  // Derived: every current member has a share > 0
  const selectAll =
    members.length > 0 && members.every((m) => (parseFloat(formData.shares[m.name]) || 0) > 0)

  // Surface first validation error for display
  const errors = form.formState.errors
  const rawError =
    errors.payer?.message ??
    errors.amount?.message ??
    errors.shares?.root?.message ??
    errors.shares?.message
  const formErrorMessage = typeof rawError === 'string' ? rawError : ''

  return {
    formData,
    formErrorMessage,
    selectAll,
    calculatorOpened,
    updateFormField: <K extends keyof BillFormValues>(name: K, value: BillFormValues[K]) => {
      // react-hook-form's setValue has complex path-based generics incompatible with keyof
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue(name as any, value as any, { shouldValidate: false })
    },
    updateFormFieldWrapper: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target

      if (name.startsWith('unequal-share-')) {
        const member = name.replace('unequal-share-', '')
        form.setValue(`shares.${member}`, value, { shouldValidate: false })
        return
      }
      if (name.startsWith('equal-share-')) {
        const member = name.replace('equal-share-', '')
        form.setValue(`shares.${member}`, checked ? '1' : '0', { shouldValidate: false })
        return
      }
      const parsed = type === 'checkbox' ? String(checked) : value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue(name as any, parsed, { shouldValidate: false })
    },
    setFormErrorMessage: (_msg: string) => {}, // kept for interface compatibility; errors come from Zod
    openCalculator,
    saveCalculator,
    closeCalculator: () => setCalculatorOpened(false),
    handleSubmitForm,
    handleCloseForm,
    setSelectedBillForm,
  }
}
