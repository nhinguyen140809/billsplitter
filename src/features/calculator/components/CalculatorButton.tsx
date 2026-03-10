import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CalculatorButton({
    label,
    value,
    className,
    onClick,
}: {
    label: string;
    value: string;
    className?: string;
    onClick: (value: string) => void;
}) {
    const isNumber = /^[0-9.]$/.test(value);
    const baseClasses =
        "flex items-center justify-center text-lg font-mono font-bold py-5 rounded-2xl";
    const numberClasses = "bg-background/60 hover:bg-primary/30 text-secondary";
    const operatorClasses = "bg-accent/30 hover:bg-accent/50 text-primary";
    const combinedClasses = cn(
        baseClasses,
        isNumber ? numberClasses : operatorClasses,
        className,
    );

    return (
        <Button
            className={combinedClasses}
            onClick={() => onClick(value)}
        >
            {label}
        </Button>
    );
}
