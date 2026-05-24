import { useEffect, useRef, useState } from 'react'
import type { StoredMember, Bill, PaymentData } from '@/types'

type WorkerOutput =
  | { sendPayments: PaymentData; receivePayments: PaymentData; error?: never }
  | { error: string; sendPayments?: never; receivePayments?: never }

export function useCalculationWorker(
  onResult: (sendPayments: PaymentData, receivePayments: PaymentData) => void
) {
  const workerRef = useRef<Worker | null>(null)
  const onResultRef = useRef(onResult)

  // Keep ref in sync without re-creating the worker on each render
  useEffect(() => {
    onResultRef.current = onResult
  })

  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationError, setCalculationError] = useState('')

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./settlementCalculator.worker.ts', import.meta.url),
      { type: 'module' }
    )

    workerRef.current.onmessage = ({ data }: MessageEvent<WorkerOutput>) => {
      setIsCalculating(false)
      if (data.error) {
        setCalculationError(data.error)
        return
      }
      setCalculationError('')
      onResultRef.current(data.sendPayments, data.receivePayments)
    }

    workerRef.current.onerror = (e) => {
      setIsCalculating(false)
      setCalculationError('Calculation failed: ' + e.message)
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  const calculate = (members: StoredMember[], bills: Bill[]) => {
    if (!workerRef.current) return
    setIsCalculating(true)
    setCalculationError('')
    workerRef.current.postMessage({ members, bills })
  }

  return { calculate, isCalculating, calculationError }
}
