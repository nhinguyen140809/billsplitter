export default function CalculatorDisplay({
    expression,
    errorMessage,
}: {
    expression: string;
    errorMessage: string;
}) {
    return (
        <div className="mb-4">
            <input
                type="text"
                className="w-full p-2 border border-primary outline-primary rounded-lg text-right text-lg font-bold text-secondary"
                value={expression}
                readOnly
            />
            <p className="text-destructive text-sm mt-1">{errorMessage}</p>
        </div>
    );
}
