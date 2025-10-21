import { useState, useRef, useEffect } from "react";
import BillItems from "./BillItems";
import BillFormPopup from "./BillForm";
import { Check, Plus } from "lucide-react";

function SectionBill({
    members,
    equalBills,
    setEqualBills,
    unequalBills,
    setUnequalBills,
    onDone,
    currentSection,
}) {
    const [showForm, setShowForm] = useState(false);
    const [isEqual, setIsEqual] = useState(true);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        payer: "",
        amount: "",
        shares: {},
    });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (formData.id !== "") {
            console.log("Editing bill:", formData);
        }
    }, [formData]);

    const handleDone = () => {
        if (equalBills.length + unequalBills.length < 1) {
            setErrorMessage("Please add at least one bill.");
            return;
        }
        setErrorMessage("");
        onDone();
    };

    return (
        <>
            <div className="section-container">
                <h2 className="text-3xl font-extrabold text-columbia-blue mb-4">
                    Bills
                </h2>
                {currentSection !== "members" && (
                    <div className="flex justify-end py-2">
                        <button
                            className="tonal-button"
                            onClick={() => setShowForm(true)}
                        >
                            <Plus
                                size={20}
                                strokeWidth={2.5}
                                color={"var(--color-alice-blue)"}
                                className="inline mr-2"
                            />
                            Add bill
                        </button>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <BillItems
                        bills={equalBills}
                        type="equal"
                        setEqualBills={setEqualBills}
                        setUnequalBills={setUnequalBills}
                        setFormData={setFormData}
                        setShowForm={setShowForm}
                        setIsEqual={setIsEqual}
                    />
                    <BillItems
                        bills={unequalBills}
                        type="unequal"
                        setEqualBills={setEqualBills}
                        setUnequalBills={setUnequalBills}
                        setFormData={setFormData}
                        setShowForm={setShowForm}
                        setIsEqual={setIsEqual}
                    />
                </div>
                {currentSection !== "members" && (
                    <div className="mt-8 justify-between flex items-center">
                        <div className="text-tea-rose">
                            {errorMessage && <p>{errorMessage}</p>}
                        </div>
                        <button
                            onClick={handleDone}
                            className="fill-button shadow-columbia-blue/35 shadow-lg"
                        >
                            <Check
                                size={20}
                                strokeWidth={2.5}
                                color={"var(--color-oxford-blue)"}
                                className="inline mr-2"
                            />
                            Finish
                        </button>
                    </div>
                )}
            </div>
            {showForm && (
                <BillFormPopup
                    members={members}
                    setEqualBills={setEqualBills}
                    setUnequalBills={setUnequalBills}
                    setShowForm={setShowForm}
                    isEqual={isEqual}
                    formData={formData}
                    setFormData={setFormData}
                    setIsEqual={setIsEqual}
                />
            )}
        </>
    );
}

export default SectionBill;
