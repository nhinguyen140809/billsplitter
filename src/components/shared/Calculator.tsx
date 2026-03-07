import { useState } from "react";

function Calculator({ openCalculator, onClose, onSave }) {
    const [expression, setExpression] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const buttons = [
        { label: "AC", value: "AC", className: "text-tea-rose" },
        { label: "(", value: "(" },
        { label: ")", value: ")" },
        { label: "÷", value: "/" },
        { label: "7", value: "7" },
        { label: "8", value: "8" },
        { label: "9", value: "9" },
        { label: "×", value: "*" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
        { label: "-", value: "-" },
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "+", value: "+" },
        { label: ".", value: "." },
        { label: "0", value: "0" },
        { label: "DEL", value: "DEL", className: "text-light-orange" },
        { label: "=", value: "=" },
    ];
    const handleClick = (value) => {
        if (value === "AC") {
            // Clear toàn bộ expression và reset lỗi
            setExpression("");
            setErrorMessage("");
        } else if (value === "DEL") {
            // Xóa ký tự cuối
            setExpression(expression.slice(0, -1));
            setErrorMessage("");
        } else if (value === "=") {
            try {
                const expr = expression.trim();
                setExpression(eval(expr).toString());
                setErrorMessage("");
            } catch (error) {
                console.error("Failed to eval expression:", error);
                setErrorMessage("Invalid Expression");
            }
        } else {
            setExpression(expression + value);
            setErrorMessage("");
        }
    };

    const handleSave = () => {
        try {
            const expr = expression.trim();
            const result = eval(expr).toString();
            onSave(result);
            setExpression("");
            setErrorMessage("");
            onClose();
        } catch (error) {
            console.error("Failed to eval expression on save:", error);
            setErrorMessage("Invalid Expression");
        }
    };

    if (!openCalculator) return null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-rich-black/60 flex items-center justify-center z-60 px-4 sm:px-0 transition-opacity">
            <div className="section-container popup-container">
                <h2 className="text-2xl font-extrabold text-columbia-blue mb-8">
                    Calculator
                </h2>
                <div className="mb-4">
                    <input
                        type="text"
                        className="w-full p-2 border border-columbia-blue outline-columbia-blue rounded-lg text-right text-2xl font-bold text-alice-blue"
                        value={expression}
                        readOnly
                    />
                    <p className="text-tea-rose mt-4">{errorMessage}</p>
                </div>
                <div className="grid grid-cols-4 gap-3 gap-x-4 mb-4 mt-2">
                    {buttons.map(({ label, value, className }) => (
                        <button
                            key={value}
                            className={`flex items-center justify-center text-center text-2xl font-mono font-bold py-3 rounded-2xl
                            ${
                                parseInt(value) ||
                                value === "." ||
                                value === "0"
                                    ? "bg-oxford-blue hover:bg-columbia-blue/30 active:bg-columbia-blue/20 text-alice-blue hover:scale-102 transition-all"
                                    : "bg-honolulu-blue/30 hover:bg-honolulu-blue/50 active:bg-honolulu-blue/40 text-columbia-blue hover:scale-102 transition-all"
                            }
                            ${className || ""}`}
                            onClick={() => handleClick(value)}
                        >
                            {label}
                        </button>
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
