import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function CalculatorDisplay({
  expression,
  errorMessage,
}: {
  expression: string
  errorMessage: string
}) {
  return (
    <Field className={`mb-2 flex flex-col gap-1 pt-2 pb-2 ${errorMessage ? 'data-invalid' : ''}`}>
      <Input
        type="text"
        className="rounded-full p-5 text-right text-base font-medium"
        value={expression}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? 'expression-error' : undefined}
      />
      {errorMessage && (
        <FieldLabel htmlFor="input-invalid" className="text-destructive text-xs sm:text-sm">
          {errorMessage}
        </FieldLabel>
      )}
    </Field>
  )
}
