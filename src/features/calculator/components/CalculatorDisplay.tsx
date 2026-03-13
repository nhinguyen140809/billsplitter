import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function CalculatorDisplay({
    expression,
    errorMessage,
}: {
    expression: string;
    errorMessage: string;
}) {
    return (
        <Field
            className={`flex flex-col gap-1 mb-2 pt-2 pb-2 ${errorMessage ? "data-invalid" : ""}`}
        >
            <Input
                type="text"
                className="rounded-full p-5 text-right font-medium text-base"
                value={expression}
                aria-invalid={!!errorMessage}
                aria-describedby={errorMessage ? "expression-error" : undefined}
            />
            {errorMessage && (
                <FieldLabel
                    htmlFor="input-invalid"
                    className="text-destructive sm:text-sm text-xs"
                >
                    {errorMessage}
                </FieldLabel>
            )}
        </Field>
    );
}
