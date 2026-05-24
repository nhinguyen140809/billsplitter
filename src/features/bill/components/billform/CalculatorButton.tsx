import { CalculatorIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CalculatorButton({ onClick }: { onClick: () => void }) {
  return (
    <Button tabIndex={-1} variant="ghost" size="icon-lg" onClick={onClick}>
      <CalculatorIcon className="size-5" />
    </Button>
  )
}
