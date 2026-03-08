import { useState } from "react";

export function useCalculator(onClose: () => void, onSave: (value: string) => void) {
    const [expression, setExpression] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const evalExpression = (expr: string) => {
        try {
            return eval(expr).toString();
        } catch (error) {
            console.error("Failed to eval expression:", error);
            setErrorMessage("Invalid Expression");
            return null;
        }
    };

    const handleClick = (value: string) => {
        if (value === "AC") {
            setExpression("");
            setErrorMessage("");
            return;
        } 
        
        if (value === "DEL") {
            setExpression(expression.slice(0, -1));
            setErrorMessage("");
            return;
        }

        if (value === "=") {
            const result = evalExpression(expression.trim());
            if (result !== null) {
                setExpression(result);
                setErrorMessage("");
            }
            return;
        }
        setExpression(expression + value);
        setErrorMessage("");
    };

    const handleSave = () => {
        const result = evalExpression(expression.trim());
        if (result !== null) {
            onSave(result);
            setExpression("");
            setErrorMessage("");
            onClose();
        }
    };

    return { expression, errorMessage, handleClick, handleSave };

}