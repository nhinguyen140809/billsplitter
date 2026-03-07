import { useState, useRef } from "react";
import type { BillFormData } from "../types";
import type { Bill } from "@/types";

export function useBillForm(
    setEqualBills: React.Dispatch<React.SetStateAction<Bill[]>>,
    setUnequalBills: React.Dispatch<React.SetStateAction<Bill[]>>,
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>,
) {
    const [formData, setFormData] = useState<BillFormData>({
        id: "",
        name: "",
        payer: "",
        amount: 0,
        shares: {},
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [selectAll, setSelectAll] = useState(false);
    const activeInputRef = useRef<HTMLInputElement | null>(null);
    const [openCalculator, setOpenCalculator] = useState<boolean>(false);
    const [isEqual, setIsEqual] = useState(true);

    const handleOpenCalculator = (inputRef: HTMLInputElement | null) => {
        if (!inputRef || !activeInputRef.current) return;
        activeInputRef.current = inputRef;
        setOpenCalculator(true);
    };

    const handleSaveCalculator = (value: string) => {
        console.log("Calculator returned value:", value);
        console.log("Active input ref:", activeInputRef.current);

        if (activeInputRef.current) {
            const inputName = activeInputRef.current.name;

            setFormData((prev) => {
                // If input of amount
                if (inputName === "amount") {
                    return {
                        ...prev,
                        amount: value,
                    };
                }

                // If input of share of member
                if (inputName.startsWith("share-")) {
                    const memberName = inputName.replace("share-", "");
                    return {
                        ...prev,
                        shares: {
                            ...prev.shares,
                            [memberName]: value,
                        },
                    };
                }
                return prev;
            });
        }

        setOpenCalculator(false);
    };

    const resetForm = () => {
        setFormData({
            id: "",
            name: "",
            payer: "",
            amount: 0,
            shares: {},
        });
        setErrorMessage("");
        setIsEqual(true);
    };

    // Update form data based on input changes
    const updateFormDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith("share-")) {
            // For unequal shares input
            const memberName = name.replace("share-", "");
            setFormData((prev) => ({
                ...prev,
                shares: {
                    ...prev.shares,
                    [memberName]: parseFloat(value) || 0,
                },
            }));
        } else if (name.startsWith("participant-")) {
            // For equal participants checkbox
            const memberName = name.replace("participant-", "");
            setFormData((prev) => ({
                ...prev,
                shares: { ...prev.shares, [memberName]: checked ? 1 : 0 },
            }));
            if (!checked) setSelectAll(false);
        } else {
            // For other inputs
            setFormData((prev) => ({
                ...prev,
                [name]: type === "number" ? parseFloat(value) : value,
            }));
        }
    };

    
}
