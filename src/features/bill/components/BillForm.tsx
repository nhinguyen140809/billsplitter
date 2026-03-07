import { useState, useEffect } from "react";
import Calculator from "./Calculator";
import { useRef } from "react";
import BillNameInput from "./BillNameInput";
import BillTypeButtons from "./BillTypeButtons";
import BillPayerSelector from "./BillPayerSelector";
import { EqualBillAmount, EqualBillParticipants } from "./EqualBill";
import type { Member } from "@/types";





function BillFormButtons({ handleAddBill, resetForm, setShowForm }:
    {
        handleAddBill: (e: React.FormEvent<HTMLFormElement>) => void;
        resetForm: () => void;
        setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    }
) {
    return (
        <div className="flex justify-end gap-4 mt-4">
            <button
                onClick={() => {
                    resetForm();
                    setShowForm(false);
                }}
                className="tonal-button"
            >
                Cancel
            </button>
            <button onClick={handleAddBill} className="fill-button">
                Save
            </button>
        </div>
    );
}

function BillFormPopup({
    members,
    showForm,
    setShowForm,
    setEqualBills,
    setUnequalBills,
    formData,
    setFormData,
}) {
    const [formErrorMessage, setFormErrorMessage] = useState<string>("");
    const [selectedAll, setSelectedAll] = useState<boolean>(false);
    const activeInputRef = useRef<HTMLInputElement | null>(null);
    const [openCalculator, setOpenCalculator] = useState<boolean>(false);

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
            amount: "",
            shares: {},
        });
        setFormErrorMessage("");
        // setIsEqual(true);
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
            if (!checked) setSelectedAll(false);
        } else {
            // For other inputs
            setFormData((prev) => ({
                ...prev,
                [name]: type === "number" ? parseFloat(value) : value,
            }));
        }
    };

    const handleAddBill = (e: React.FormEvent<HTMLFormElement>) => {
        console.log("Adding bill...", { formData });
        e.preventDefault();
        const { id, name, payer, amount, shares } = formData;
        if (!payer || (isEqual && (!amount || amount <= 0))) {
            setFormErrorMessage("Please fill in all fields correctly.");
            return;
        }
        let billName = name;
        if (!billName.trim()) {
            billName = "Bill #" + Math.floor(Math.random() * 1000);
        }
        const selectedParticipants = Object.keys(shares).filter(
            (memberName) => shares[memberName] > 0, // For both case (unequal and equal)
        );
        const hasNegativeShare = Object.values(shares).some(
            (value) => value < 0,
        );
        if (hasNegativeShare) {
            setFormErrorMessage("Invalid amount: shares cannot be negative.");
            return;
        }
        if (selectedParticipants.length === 0) {
            setFormErrorMessage("Please select at least one participant.");
            return;
        }
        if (isEqual) {
            if (id !== "") {
                // Editing existing bill
                setEqualBills((prev) =>
                    prev.map((bill) =>
                        bill.id === id
                            ? {
                                  ...bill,
                                  name: billName,
                                  payer: payer,
                                  amount: amount,
                                  participants: selectedParticipants,
                              }
                            : bill,
                    ),
                );
                setUnequalBills((prev) =>
                    prev.filter((bill) => bill.id !== id),
                ); // Remove from unequal bills if exists
            } else {
                // Adding new bill
                const newBill = {
                    id: crypto.randomUUID(),
                    name: billName,
                    payer: payer,
                    amount: amount,
                    participants: selectedParticipants,
                };
                setEqualBills((prev) => [...prev, newBill]);
            }
        } else {
            const totalShares = selectedParticipants.reduce(
                (sum, member) => sum + (shares[member] || 0),
                0,
            );
            if (totalShares === 0) {
                setFormErrorMessage("Please assign shares to participants.");
                return;
            }
            if (id !== "") {
                // Editing existing bill
                setUnequalBills((prev) =>
                    prev.map((bill) =>
                        bill.id === id
                            ? {
                                  ...bill,
                                  name: billName,
                                  payer: payer,
                                  amount: totalShares,
                                  shares: selectedParticipants.reduce(
                                      (obj, member) => ({
                                          ...obj,
                                          [member]: shares[member] || 0,
                                      }),
                                      {},
                                  ),
                              }
                            : bill,
                    ),
                );
                setEqualBills((prev) => prev.filter((bill) => bill.id !== id)); // Remove from equal bills if exists
            } else {
                // Adding new bill
                const newBill = {
                    id: crypto.randomUUID(),
                    name: billName,
                    payer: payer,
                    amount: totalShares,
                    shares: selectedParticipants.reduce(
                        (obj, member) => ({
                            ...obj,
                            [member]: shares[member] || 0,
                        }),
                        {},
                    ),
                };
                setUnequalBills((prev) => [...prev, newBill]);
            }
        }
        // After adding or editing, reset form and close popup
        resetForm();
        setShowForm(false);
        setIsEqual(true);
        setSelectedAll(false);
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-screen h-screen bg-rich-black/70 flex items-center justify-center z-50 px-4 sm:px-0 transition-opacity duration-300 backdrop-blur-xl">
                <div className="section-container popup-container">
                    <h2 className="text-2xl font-extrabold text-columbia-blue mb-4">
                        Bill Details
                    </h2>
                    <BillNameInput
                        formData={formData}
                        updateFormDetail={updateFormDetail}
                    />
                    <BillTypeButtons
                        isEqual={isEqual}
                        setIsEqual={setIsEqual}
                    />
                    <BillPayerSelector
                        members={members}
                        formData={formData}
                        updateFormDetail={updateFormDetail}
                    />
                    {isEqual && (
                        <>
                            <EqualBillAmount
                                formData={formData}
                                updateFormDetail={updateFormDetail}
                                handleOpenCalculator={handleOpenCalculator}
                            />
                            <EqualBillParticipants
                                members={members}
                                formData={formData}
                                setFormData={setFormData}
                                updateFormDetail={updateFormDetail}
                                selectedAll={selectedAll}
                                setSelectedAll={setSelectedAll}
                            />
                        </>
                    )}
                    {!isEqual && (
                        <UnequalBillShares
                            members={members}
                            formData={formData}
                            updateFormDetail={updateFormDetail}
                            handleOpenCalculator={handleOpenCalculator}
                        />
                    )}

                    {formErrorMessage && (
                        <p className="text-tea-rose mb-2">{formErrorMessage}</p>
                    )}
                    <BillFormButtons
                        handleAddBill={handleAddBill}
                        resetForm={resetForm}
                        setShowForm={setShowForm}
                    />
                </div>
            </div>
            <Calculator
                openCalculator={openCalculator}
                onClose={() => setOpenCalculator(false)}
                onSave={handleSaveCalculator}
            />
        </>
    );
}

export default BillFormPopup;
