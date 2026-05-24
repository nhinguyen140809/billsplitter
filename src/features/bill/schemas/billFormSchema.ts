import { z } from 'zod'

export const billFormSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['equal', 'unequal']),
    payer: z.string().min(1, 'Please select a payer.'),
    amount: z.string(),
    shares: z.record(z.string(), z.string()),
  })
  .superRefine((data, ctx) => {
    const sharesValues = Object.fromEntries(
      Object.entries(data.shares).map(([k, v]) => [k, parseFloat(v) || 0])
    )
    const selectedParticipants = Object.values(sharesValues).filter((v) => v > 0)

    if (selectedParticipants.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select at least one participant.',
        path: ['shares'],
      })
    }

    const hasNegative = Object.values(sharesValues).some((v) => v < 0)
    if (hasNegative) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid amount: shares cannot be negative.',
        path: ['shares'],
      })
    }

    if (data.type === 'equal') {
      const amount = parseFloat(data.amount)
      if (isNaN(amount) || amount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid amount.',
          path: ['amount'],
        })
      }
    }

    if (data.type === 'unequal') {
      const total = Object.values(sharesValues).reduce((sum, v) => sum + v, 0)
      if (isNaN(total) || total <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Total shares must be greater than zero.',
          path: ['shares'],
        })
      }
    }
  })

export type BillFormValues = z.infer<typeof billFormSchema>
