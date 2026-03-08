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
                className="w-full p-2 border border-columbia-blue outline-columbia-blue rounded-lg text-right text-2xl font-bold text-alice-blue"
                value={expression}
                readOnly
            />
            <p className="text-tea-rose mt-4">{errorMessage}</p>
        </div>
    );
}
