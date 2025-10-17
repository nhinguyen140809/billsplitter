import { useState, useEffect } from "react";

function BillNameInput({ formData, updateFormDetail }) {
    return (
        <div className="mb-2">
            <input
                type="text"
                name="name"
                placeholder="Bill name"
                className="w-full p-2 font-bold text-xl bg-rich-black text-alice-blue outline-none border-b-2 focus:border-b-columbia-blue mb-4 transition duration-200 border-b-honolulu-blue/80"
                value={formData.name}
                onChange={updateFormDetail}
            />
        </div>
    );
}

function BillTypeButtons({ isEqual, setIsEqual }) {
    return (
        <div className="flex mb-2 gap-4">
            {["Equal", "Unequal"].map((type) => {
                return (
                    <button
                        key={type}
                        className={`px-8 py-2 rounded-full border border-columbia-blue font-medium ${
                            isEqual === (type === "Equal")
                                ? "bg-columbia-blue text-oxford-blue"
                                : "bg-rich-black text-alice-blue"
                        }`}
                        onClick={() => setIsEqual(type === "Equal")}
                    >
                        {type}
                    </button>
                );
            })}
        </div>
    );
}

function BillPayerSelect({ members, formData, updateFormDetail }) {
    return (
        <div className="mb-2 flex items-center">
            <select
                name="payer"
                value={formData.payer}
                placeholder="Select payer"
                onChange={updateFormDetail}
                className={`w-full p-2 bg-rich-black text-alice-blue outline-none border-b-2 focus:border-b-columbia-blue mb-4 transition duration-200 border-b-honolulu-blue/80 ${
                    formData.payer === "" ? "text-gray-400" : "text-alice-blue"
                }`}
            >
                <option value="" disabled hidden>
                    Paid by...
                </option>
                {members.map((member) => (
                    <option key={member.id} value={member.name}>
                        {member.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

function EqualBillAmount({ formData, updateFormDetail }) {
    return (
        <div className="flex mb-2 gap-4">
            <input
                type="number"
                name="amount"
                placeholder="Total amount"
                className="w-full p-2 bg-rich-black text-alice-blue outline-none border-b-2 focus:border-b-columbia-blue mb-4 transition duration-200 border-b-honolulu-blue/80"
                value={formData.amount}
                onChange={updateFormDetail}
                min="0"
            />
            <button className="text-sm text-honolulu-blue hover:font-black font-extrabold transition rounded-full hover:scale-110 cursor-pointer hover:bg-honolulu-blue/40 px-4 py-1">
                Calculator
            </button>
        </div>
    );
}

function EqualBillParticipants({
    members,
    formData,
    setFormData,
    updateFormDetail,
    selectedAll,
    setSelectedAll,
}) {
    const toggleAllShares = (checked) => {
        // For "Select All" checkbox
        if (checked) {
            const newShares = {};
            members.forEach((member) => {
                newShares[member.name] = checked ? 1 : 0;
            });
            setFormData((prev) => ({ ...prev, shares: newShares }));
        }
        setSelectedAll(checked);
    };

    function checkboxItem(member, isSelectAll) {
        return (
            <div className="flex items-center" key={member.id}>
                <input
                    type="checkbox"
                    name={
                        isSelectAll
                            ? "select-all"
                            : `participant-${member.name}`
                    }
                    className="mr-2"
                    onChange={
                        isSelectAll
                            ? (e) => toggleAllShares(e.target.checked)
                            : updateFormDetail
                    }
                    checked={
                        isSelectAll
                            ? selectedAll
                            : formData.shares[member.name] > 0
                    }
                />
                <label className="text-alice-blue">
                    {isSelectAll ? "All" : member.name}
                </label>
            </div>
        );
    }

    return (
        <div className="mb-2">
            <p className="text-alice-blue mb-1">Select Participants:</p>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                {checkboxItem({ id: "select-all" }, true)}
                {members.map((member) => checkboxItem(member, false))}
            </div>
        </div>
    );
}

function UnequalBillShares({ members, formData, updateFormDetail }) {
    return (
        <div className="mb-2">
            <p className="text-alice-blue mb-1">Assign shares:</p>
            <div className="flex flex-col gap-2">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center justify-between"
                    >
                        <p className="text-alice-blue">{member.name}:</p>
                        <input
                            type="number"
                            name={`share-${member.name}`}
                            className="ml-2 p-1 bg-rich-black text-alice-blue outline-none border-b-2 focus:border-b-columbia-blue transition duration-200 border-b-honolulu-blue/80"
                            min="0"
                            onChange={updateFormDetail}
                            value={formData.shares[member.name] || ""}
                        />
                        <button className="text-sm text-honolulu-blue hover:font-black font-extrabold transition rounded-full hover:scale-110 cursor-pointer hover:bg-honolulu-blue/40 px-4 py-1">
                            Calculator
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BillFormButtons({ handleAddBill, resetForm, setShowForm }) {
    return (
        <div className="flex justify-end gap-4 mt-4">
            <button
                onClick={() => {
                    resetForm();
                    setShowForm(false);
                }}
                className="bg-honolulu-blue/40 text-alice-blue font-medium py-2 px-6 rounded-full hover:scale-105 hover:cursor-pointer active:bg-honolulu-blue/70 transition"
            >
                Cancel
            </button>
            <button
                onClick={handleAddBill}
                className="bg-columbia-blue text-oxford-blue font-medium py-2 px-6 rounded-full hover:scale-105 hover:cursor-pointer active:bg-columbia-blue/80 transition"
            >
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
    isEqual,
    setIsEqual,
}) {
    const [formErrorMessage, setFormErrorMessage] = useState("");
    const [selectedAll, setSelectedAll] = useState(false);
    

    const resetForm = () => {
        setFormData({
            id: "",
            name: "",
            payer: "",
            amount: "",
            shares: {},
        });
        setFormErrorMessage("");
        setIsEqual(true);
    };

    // Update form data based on input changes
    const updateFormDetail = (e) => {
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

    const handleAddBill = (e) => {
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
            (memberName) => shares[memberName] > 0 // For both case (unequal and equal)
        );
        const hasNegativeShare = Object.values(shares).some(
            (value) => value < 0
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
                            : bill
                    )
                );
                setUnequalBills((prev) =>
                    prev.filter((bill) => bill.id !== id)
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
                0
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
                                      {}
                                  ),
                              }
                            : bill
                    )
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
                        {}
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
        <div className="fixed inset-0 bg-rich-black/80 flex items-center justify-center z-50 px-4 sm:px-0">
            <div className="section-container max-w-md sm:max-w-lg">
                <h2 className="text-2xl font-extrabold text-columbia-blue mb-4">
                    Bill Details
                </h2>
                <BillNameInput
                    formData={formData}
                    updateFormDetail={updateFormDetail}
                />
                <BillTypeButtons isEqual={isEqual} setIsEqual={setIsEqual} />
                <BillPayerSelect
                    members={members}
                    formData={formData}
                    updateFormDetail={updateFormDetail}
                />
                {isEqual && (
                    <>
                        <EqualBillAmount
                            formData={formData}
                            updateFormDetail={updateFormDetail}
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
    );
}

export default BillFormPopup;
