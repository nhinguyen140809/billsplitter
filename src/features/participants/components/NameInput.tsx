import { useEffect, useRef } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'

export default function NameInput({
  name,
  setName,
  onAdd,
  inputError,
}: {
  name: string
  setName: (name: string) => void
  onAdd: () => void
  inputError: string | false
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAdd()
    }
  }

  return (
    <Field className={`mb-2 flex flex-col gap-1 pt-2 pb-2 ${inputError ? 'data-invalid' : ''}`}>
      <div className="mb-1 flex items-center gap-2 sm:mb-2">
        <Input
          type="text"
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter participant name"
          className="mr-2 p-4 py-4.5 font-medium sm:p-5"
          aria-invalid={!!inputError}
          aria-describedby={inputError ? 'name-error' : undefined}
        />
        <Button variant="outline" size="icon-lg" onClick={onAdd}>
          <Plus className="size-4 sm:size-5" />
        </Button>
      </div>
      {inputError && (
        <FieldLabel htmlFor="input-invalid" className="text-destructive">
          {inputError}
        </FieldLabel>
      )}
    </Field>
  )
}
