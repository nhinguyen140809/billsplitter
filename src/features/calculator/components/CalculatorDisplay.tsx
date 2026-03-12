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
                className="rounded-full p-5 mr-2 text-right font-medium text-md focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0 focus-visible:ring-offset-background"
                value={expression}
                aria-invalid={!!errorMessage}
                aria-describedby={errorMessage ? "expression-error" : undefined}
            />
            {errorMessage && (
                <FieldLabel
                    htmlFor="input-invalid"
                    className="text-destructive"
                >
                    {errorMessage}
                </FieldLabel>
            )}
        </Field>
    );
}
