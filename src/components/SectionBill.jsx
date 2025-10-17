import { useState, useRef, useEffect } from "react";
import BillItems from "./BillItems";
import BillFormPopup from "./BillForm";
import { use } from "react";

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
        <div className="section-container">
            <h2 className="text-3xl font-extrabold text-columbia-blue mb-4">
                Bills
            </h2>
            {currentSection !== "members" && (
                <div className="flex justify-end py-2">
                    <button
                        className="bg-columbia-blue/40 text-alice-blue font-semibold py-2 px-8 rounded-full hover:scale-105 hover:cursor-pointer active:bg-columbia-blue/70 transition"
                        onClick={() => setShowForm(true)}
                    >
                        Add bill
                    </button>
                </div>
            )}
            <div className="space-y-4 mt-4">
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
            {currentSection !== "members" && (
                <div className="mt-8 justify-between flex items-center">
                    <div className="text-tea-rose">
                        {errorMessage && <p>{errorMessage}</p>}
                    </div>
                    <button
                        onClick={handleDone}
                        className="bg-columbia-blue text-oxford-blue font-medium rounded-full px-10 py-2 active:bg-columbia-blue/80 transition hover:scale-105 hover:cursor-pointer"
                    >
                        Finish
                    </button>
                </div>
            )}
        </div>
    );
}

export default SectionBill;
