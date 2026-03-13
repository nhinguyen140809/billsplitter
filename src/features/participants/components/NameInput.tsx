import { useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";

export default function NameInput({
    name,
    setName,
    onAdd,
    inputError,
}: {
    name: string;
    setName: (name: string) => void;
    onAdd: () => void;
    inputError: string | false;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onAdd();
        }
    };

    return (
        <Field
            className={`flex flex-col gap-1 mb-2 pt-2 pb-2 ${inputError ? "data-invalid" : ""}`}
        >
            <div className="flex items-center gap-2 mb-2">
                <Input
                    type="text"
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter participant name"
                    className="rounded-full p-5 mr-2 font-medium text-md"
                    aria-invalid={!!inputError}
                    aria-describedby={inputError ? "name-error" : undefined}
                />
                <Button
                    variant="default"
                    size="icon-lg"
                    className="rounded-full [&_svg]:size-10 [&_svg]:shrink-0"
                    onClick={onAdd}
                >
                    <Plus size={24} strokeWidth={3} />
                </Button>
            </div>
            {inputError && (
                <FieldLabel
                    htmlFor="input-invalid"
                    className="text-destructive"
                >
                    {inputError}
                </FieldLabel>
            )}
        </Field>
    );
}
