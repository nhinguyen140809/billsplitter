import { useState } from "react";
import { evaluate } from "math-js";

function Calculator({ openCalculator, onClose, onSave }) {
    const [expression, setExpression] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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
                setExpression(evaluate(expression).toString());
            } catch {
                setErrorMessage("Invalid Expression");
            }
        } else {
            setExpression(expression + value);
            setErrorMessage("");
        }
    };

    const handleSave = () => {
        try {
            const result = evaluate(expression);
            onSave(result);
            onClose();
        } catch {
            setErrorMessage("Invalid Expression");
        }
    };

    if (!openCalculator) return null;

    return (
        <div className="fixed inset-0 bg-rich-black/80 flex items-center justify-center z-60 px-4 sm:px-0 transition-opacity">
            <div className="section-container max-w-md sm:max-w-lg">
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
                <div className="grid grid-cols-4 gap-3 mb-4 mt-2">
                    {[
                        "AC",
                        "(",
                        ")",
                        "/",
                        "7",
                        "8",
                        "9",
                        "*",
                        "4",
                        "5",
                        "6",
                        "-",
                        "1",
                        "2",
                        "3",
                        "+",
                        ".",
                        "0",
                        "DEL",
                        "=",
                    ].map((btn) => (
                        <button
                            key={btn}
                            className={`text-xl font-bold py-3 rounded-2xl
                            ${
                                parseInt(btn) || btn === "." || btn === "0"
                                    ? "bg-columbia-blue/90 hover:bg-columbia-blue active:bg-columbia-blue/70 text-rich-black hover:scale-102 hover:shadow-sm hover:shadow-alice-blue/80 transition-all"
                                    : "bg-honolulu-blue/80 hover:bg-honolulu-blue active:bg-honolulu-blue/70 text-columbia-blue hover:scale-102 hover:shadow-sm hover:shadow-honolulu-blue/80 transition-all"
                            }`}
                            onClick={() => handleClick(btn)}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end space-x-6 mt-6">
                    <button
                        className="bg-honolulu-blue/40 text-alice-blue font-medium py-2 px-6 rounded-full hover:scale-105 hover:cursor-pointer active:bg-honolulu-blue/70 transition"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-columbia-blue text-oxford-blue font-medium py-2 px-6 rounded-full hover:scale-105 hover:cursor-pointer active:bg-columbia-blue/80 transition"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Calculator;
