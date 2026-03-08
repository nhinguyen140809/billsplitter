import { useState, useRef } from "react";
import type { Bill, BillType } from "@/types";

export function useBillForm(
    onSubmitBillForm: (bill: Bill, type: BillType) => void,
    onClose: () => void,
) {
    const [formData, setFormData] = useState<Bill>({
        id: "",
        name: "",
        payer: "",
        amount: 0,
        shares: {},
    });
    const [formErrorMessage, setFormErrorMessage] = useState<string>("");
    const [calculatorOpened, setCalculatorOpened] = useState<boolean>(false);
    const [isEqual, setIsEqual] = useState<boolean>(true);
    
    const selectAll = Object.values(formData.shares).every(v => v > 0);

    const activeInputRef = useRef<HTMLInputElement | null>(null);

    const openCalculator = (inputRef: HTMLInputElement | null) => {
        if (!inputRef || !activeInputRef.current) return;
        activeInputRef.current = inputRef;
        setCalculatorOpened(true);
    };

    const saveCalculator = (value: string) => {
        console.log("Calculator returned value:", value);
        console.log("Active input ref:", activeInputRef.current);

        if (activeInputRef.current) {
            const inputName = activeInputRef.current.name;

            setFormData((prev: Bill) => {
                // If input of amount
                if (inputName === "amount") {
                    return {
                        ...prev,
                        amount: parseFloat(value),
                    } as Bill;
                }

                // If input of share of member
                if (inputName.startsWith("unequal-share-")) {
                    const memberName = inputName.replace("unequal-share-", "");
                    return {
                        ...prev,
                        shares: {
                            ...prev.shares,
                            [memberName]: parseFloat(value),
                        },
                    } as Bill;
                }
                return prev;
            });
        }

        setCalculatorOpened(false);
    };

    const resetForm = () => {
        setFormData({
            id: "",
            name: "",
            payer: "",
            amount: 0,
            shares: {},
        } as Bill);
        setFormErrorMessage("");
        setIsEqual(true);
    };

    // Update form data based on input changes
    const updateFormFieldWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith("unequal-share-")) {
            const member = name.replace("unequal-share-", "");
            updateShare(member, parseFloat(value) || 0);
            return;
        }

        if (name.startsWith("equal-share-")) {
            const member = name.replace("equal-share-", "");
            updateShare(member, checked ? 1 : 0);
            return;
        }

        const parsedValue =
            type === "checkbox"
                ? checked
                : type === "number"
                  ? parseFloat(value)
                  : value;

        updateFormField(name as keyof Bill, parsedValue as any);
    };

    const updateShare = (member: string, value: number) => {
        setFormData((prev) => ({
            ...prev,
            shares: {
                ...prev.shares,
                [member]: value,
            },
        }));
    };

    const updateFormField = <K extends keyof Bill>(name: K, value: Bill[K]) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitForm = () => {
        // Basic validation
        const { id, name, payer, amount, shares } = formData;
        if (!payer) {
            setFormErrorMessage("Please select a payer.");
            return;
        }
        if (isEqual && (amount <= 0 || !amount)) {
            setFormErrorMessage("Please enter a valid amount.");
            return;
        }

        let billName = name;
        if (!billName.trim()) {
            billName = `Bill #${Math.floor(Math.random() * 1000)}`;
        }

        const selectedParticipants = Object.keys(shares).filter(
            (member) => shares[member] > 0,
        );
        if (selectedParticipants.length === 0) {
            setFormErrorMessage("Please select at least one participant.");
            return;
        }

        const hasNegativeShare = Object.values(shares).some(
            (value) => value < 0,
        );
        if (hasNegativeShare) {
            setFormErrorMessage("Invalid amount: shares cannot be negative.");
            return;
        }

        if (!isEqual) {
            const totalShares = Object.values(shares).reduce(
                (sum, value) => sum + value,
                0,
            );
            if (totalShares === 0) {
                setFormErrorMessage("Total shares must be greater than zero.");
                return;
            }
        }

        onSubmitBillForm(
            {
                id,
                name: billName,
                payer,
                amount,
                shares,
            },
            isEqual ? "equal" : "unequal",
        );

        resetForm();
    };

    const handleCloseForm = () => {
        resetForm();
        onClose();
    };

    const setSelectedBill = (bill: Bill, type: BillType) => {
        setFormData(bill);
        setIsEqual(type === "equal");
    };

    return {
        formData,
        formErrorMessage,
        selectAll,
        isEqual,
        calculatorOpened,
        setIsEqual,
        updateFormField,
        updateFormFieldWrapper,
        setFormErrorMessage,
        openCalculator,
        saveCalculator,
        closeCalculator: () => setCalculatorOpened(false),
        handleSubmitForm,
        handleCloseForm,
        setSelectedBill,
    };
}
