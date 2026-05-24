import { useCallback, useEffect, useRef, useState } from 'react'
import type { StoredMember, Bill, PaymentData } from '@/types'

type WorkerOutput =
  | { sendPayments: PaymentData; receivePayments: PaymentData; error?: never }
  | { error: string; sendPayments?: never; receivePayments?: never }

/**
 * Manages the lifecycle of the settlement calculator Web Worker.
 * The worker is created on mount and terminated on unmount; a stable ref pattern
 * keeps `onResult` current without recreating the worker on each render.
 *
 * @param onResult - Callback invoked with the payment maps when calculation succeeds.
 */
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
      new URL('../workers/settlementCalculator.worker.ts', import.meta.url),
      { type: 'module' }
    )

    workerRef.current.onmessage = ({ data }: MessageEvent<WorkerOutput>) => {
      setIsCalculating(false)
      if (data.error) {
        setCalculationError(data.error)
        return
      }
      setCalculationError('')
      onResultRef.current(data.sendPayments!, data.receivePayments!)
    }

    workerRef.current.onerror = (e) => {
      setIsCalculating(false)
      setCalculationError('Calculation failed: ' + e.message)
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  /**
   * Sends members and bills to the worker to begin an async calculation.
   * Sets `isCalculating` to `true` until the worker responds.
   */
  const calculate = useCallback((members: StoredMember[], bills: Bill[]) => {
    if (!workerRef.current) return
    setIsCalculating(true)
    setCalculationError('')
    workerRef.current.postMessage({ members, bills })
  }, [])

  return { calculate, isCalculating, calculationError }
}
