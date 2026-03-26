import { useCalculator } from "./hooks/useCalculator";
import CalulatorDisplay from "./components/CalculatorDisplay";
import CalculatorButton from "./components/CalculatorButton";
import { CALCULATOR_BUTTONS } from "./constants";
import Overlay from "@/components/shared/Overlay";
import Popup from "@/components/shared/Popup";
import { Button } from "@/components/ui/button";

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
        <Overlay>
            <Popup title="Calculator" className="w-full max-w-md min-w-75">
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
                            className={button.className}
                        />
                    ))}
                </div>
                <div className="flex justify-end space-x-6 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </div>
            </Popup>
        </Overlay>
    );
}

export { Calculator };
