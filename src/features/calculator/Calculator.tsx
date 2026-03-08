import { useCalculator } from "./hooks/useCalculator";
import CalulatorDisplay from "./components/CalculatorDisplay";
import CalculatorButton from "./components/CalculatorButton";
import { CALCULATOR_BUTTONS } from "./constants";

function Calculator({
    openCalculator,
    onClose,
    onSave,
}: {
    openCalculator: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
}) {
    const { expression, errorMessage, handleClick, handleSave } = useCalculator(
        onClose,
        onSave,
    );

    if (!openCalculator) return null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-rich-black/60 flex items-center justify-center z-60 px-4 sm:px-0 transition-opacity">
            <div className="section-container popup-container">
                <h2 className="text-2xl font-extrabold text-columbia-blue mb-8">
                    Calculator
                </h2>
                <CalulatorDisplay
                    expression={expression}
                    errorMessage={errorMessage}
                />
                <div className="grid grid-cols-4 gap-3 gap-x-4 mb-4 mt-2">
                    {CALCULATOR_BUTTONS.map((button) => (
                        <CalculatorButton
                            label={button.label}
                            key={button.value}
                            value={button.value}
                            onClick={handleClick}
                        />
                    ))}
                </div>
                <div className="flex justify-end space-x-6 mt-6">
                    <button className="tonal-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="fill-button" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Calculator;
