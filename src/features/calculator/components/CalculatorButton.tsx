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
    const isNumber = !isNaN(Number(value)) || value === ".";
    const baseClasses =
        "flex items-center justify-center text-2xl font-mono font-bold py-3 rounded-2xl";
    const numberClasses =
        "bg-oxford-blue hover:bg-columbia-blue/30 text-alice-blue";
    const operatorClasses =
        "bg-honolulu-blue/30 hover:bg-honolulu-blue/50 text-columbia-blue";
    const combinedClasses = `${baseClasses} ${isNumber ? numberClasses : operatorClasses} ${className || ""}`;

    return (
        <button className={combinedClasses} onClick={() => onClick(value)}>
            {label}
        </button>
    );
}
