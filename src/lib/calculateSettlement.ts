import solver from 'javascript-lp-solver'
import type { StoredMember, Member, Bill, PaymentData } from '@/types'
import { formatCurrency } from './utils'

type DebtParty = {
  name: string
  amount: number
}

type LPConstraint = { equal?: number; min?: number; max?: number }

type LPModel = {
  optimize: string
  opType: 'min' | 'max'
  constraints: Record<string, LPConstraint>
  variables: Record<string, Record<string, number>>
  ints: Record<string, 0 | 1>
}

type LPSolution = {
  feasible: boolean
  result: number
  [variable: string]: number | boolean
}

/**
 * Accumulates each member's total `paid` and `spent` amounts across all bills.
 * Equal-split bills divide the total evenly among participants with a positive share value;
 * unequal-split bills use the per-member share amounts directly.
 * @returns A new `Member[]` with `paid` and `spent` populated — originals are not mutated.
 */
const shareBillList = ({ members, bills }: { members: StoredMember[]; bills: Bill[] }) => {
  const updatedMembers: Member[] = members.map((member) => ({ ...member, paid: 0, spent: 0 }))

  for (const bill of bills) {
    const { payer, amount, shares } = bill

    if (bill.type === 'equal') {
      const shareCount = Object.values(shares).filter((share) => share > 0).length
      const shareAmount = amount / shareCount
      for (const memberName of Object.keys(shares)) {
        const member = updatedMembers.find((m) => m.name === memberName)
        if (member && shares[memberName] > 0) {
          member.spent += shareAmount
        }
      }
      const memberPaid = updatedMembers.find((m) => m.name === payer)
      if (memberPaid) {
        memberPaid.paid += amount
      }
    } else if (bill.type === 'unequal') {
      for (const memberName of Object.keys(shares)) {
        const member = updatedMembers.find((m) => m.name === memberName)
        if (member && shares[memberName] > 0) {
          member.spent += shares[memberName]
        }
      }
      const memberPaid = updatedMembers.find((m) => m.name === payer)
      if (memberPaid) {
        memberPaid.paid += amount
      }
    }
  }
  return updatedMembers
}

/**
 * Splits members into senders (net debt > 0) and receivers (net credit > 0)
 * based on `paid - spent`. Members who are exactly balanced are omitted.
 */
const createSendersAndReceivers = (members: Member[]) => {
  const senders: DebtParty[] = []
  const receivers: DebtParty[] = []

  for (const member of members) {
    const diff = member.paid - member.spent
    if (diff > 0) {
      receivers.push({ name: member.name, amount: Math.abs(diff) })
    } else if (diff < 0) {
      senders.push({ name: member.name, amount: Math.abs(diff) })
    }
  }

  return { senders, receivers }
}

/**
 * Returns the maximum debt amount across all senders.
 * Used as the big-M coefficient in the LP binary constraints.
 */
const getMaxSendAmount = (senders: DebtParty[]) => {
  if (senders.length == 0) return 0
  return Math.max(...senders.map((s) => s.amount))
}

/**
 * Builds a Mixed-Integer Linear Program (MILP) that minimises the total number
 * of transactions required to settle all debts.
 *
 * Variables:
 * - `x_ij` (`sender_send_receiver`): amount sender i pays receiver j.
 * - `w_ij` (`sender_receiver_bin`): binary indicator, 1 if i pays j.
 *
 * The big-M constraint (`x_ij - M·w_ij ≤ 0`) links continuous and binary vars.
 */
const createModel = (senders: DebtParty[], receivers: DebtParty[]) => {
  const model: LPModel = {
    optimize: 'total_transactions',
    opType: 'min',
    constraints: {},
    variables: {
      max_number_of_transactions: {
        total_transactions: 1000,
      },
    },
    ints: {},
  }

  const maxSendAmount = getMaxSendAmount(senders)

  for (const sender of senders) {
    const senderName = sender.name

    // Amount of money that sender must send
    model.constraints[senderName] = { equal: sender.amount }

    // Number of transaction of sender
    model.constraints[`${senderName}_transactions`] = { max: 0 }

    for (const receiver of receivers) {
      const receiverName = receiver.name

      // Amount of money that receiver must receive
      model.constraints[receiverName] = model.constraints[receiverName] || {
        equal: receiver.amount,
      }

      // Amount of money in a transaction must be non-negative
      model.constraints[`${senderName}_send_${receiverName}`] = {
        min: 0,
      }

      // Constraint binary (x_ij - M*w_ij <= 0)
      model.constraints[`${senderName}_${receiverName}`] = { max: 0 }

      // x_ij variable, which represents the amount of money that sender i sends to receiver j
      model.variables[`${senderName}_send_${receiverName}`] = {
        [senderName]: 1, // Coefficient of x_ij in sum of money sent by sender i
        [receiverName]: 1, // Coefficient of x_ij in sum of money received by receiver j
        [`${senderName}_${receiverName}`]: 1, // Coefficient of x_ij in binary constraint
      }

      // w_ij variable, which is 1 if sender i sends money to receiver j, and 0 otherwise
      model.variables[`${senderName}_${receiverName}_bin`] = {
        [`${senderName}_${receiverName}`]: -maxSendAmount, // Coefficient of w_ij in binary constraint
        [`${senderName}_total`]: 1, // Coefficient of w_ij in total transactions for sender i
        total_transactions: 1, // Coefficient of w_ij in total transactions
      }
      model.ints[`${senderName}_${receiverName}_bin`] = 1
    }

    // Constraint total transactions for sender i
    model.variables.max_number_of_transactions[`${senderName}_total`] = -1 // Coefficient of total transactions for sender i in max_number_of_transactions variable
  }

  return model
}

/**
 * Runs the LP solver against the given model.
 * @throws If the solver cannot find a feasible solution.
 */
const solveModel = (model: LPModel) => {
  const results: LPSolution = solver.Solve(model) as LPSolution
  if (!results.feasible) {
    throw new Error('No feasible solution found')
  }
  // console.log('LP Solver Results:', results)
  return results
}

/**
 * Converts raw LP solver output into the `PaymentData` maps used by the UI.
 * Only non-zero `x_ij` values are included; amounts are formatted via `formatCurrency`.
 * @returns `sendPayments[sender][receiver]` and `receivePayments[receiver][sender]`.
 */
const createPaymentData = (
  senders: DebtParty[],
  receivers: DebtParty[],
  solverResult: LPSolution
) => {
  const send: PaymentData = {}
  const receive: PaymentData = {}

  for (const sender of senders) {
    send[sender.name] = {}
  }
  for (const receiver of receivers) {
    receive[receiver.name] = {}
  }

  for (const sender of senders) {
    for (const receiver of receivers) {
      const key = `${sender.name}_send_${receiver.name}`
      const amount = Number(solverResult[key] || 0)

      if (amount > 0) {
        send[sender.name][receiver.name] = formatCurrency(amount)
        receive[receiver.name][sender.name] = formatCurrency(amount)
      }
    }
  }

  return { sendPayments: send, receivePayments: receive }
}

/**
 * Calculates the optimal payment plan that settles all debts with the fewest transactions.
 *
 * Pipeline:
 * 1. `shareBillList` — compute each member's net paid/spent.
 * 2. `createSendersAndReceivers` — split into debtors and creditors.
 * 3. `createModel` / `solveModel` — solve the MILP via javascript-lp-solver.
 * 4. `createPaymentData` — map solver variables back to named payments.
 *
 * @param members - Current settlement members (id + name only).
 * @param bills   - All bills belonging to the settlement.
 * @returns `sendPayments` and `receivePayments` maps, both empty when everyone is balanced.
 */
export const calculateSettlement = (members: StoredMember[], bills: Bill[]) => {
  const membersWithBills = shareBillList({ members, bills })

  const { senders, receivers } = createSendersAndReceivers(membersWithBills)

  if (senders.length === 0 || receivers.length === 0) {
    return { sendPayments: {} as PaymentData, receivePayments: {} as PaymentData }
  }

  const model = createModel(senders, receivers)
  const results = solveModel(model)

  return createPaymentData(senders, receivers, results)
}
