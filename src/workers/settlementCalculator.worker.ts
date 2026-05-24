import { calculateSettlement } from '@/lib/calculateSettlement'
import type { StoredMember, Bill, PaymentData } from '@/types'

type WorkerInput = {
  members: StoredMember[]
  bills: Bill[]
}

type WorkerOutput =
  | { sendPayments: PaymentData; receivePayments: PaymentData; error?: never }
  | { error: string; sendPayments?: never; receivePayments?: never }

self.onmessage = ({ data }: MessageEvent<WorkerInput>) => {
  try {
    const result = calculateSettlement(data.members, data.bills)
    self.postMessage(result satisfies WorkerOutput)
  } catch (err) {
    self.postMessage({ error: (err as Error).message } satisfies WorkerOutput)
  }
}
