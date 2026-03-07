import { useState, useRef, useEffect } from "react";
import BillList from "./components/BillIList";
import BillFormPopup from "./components/BillForm";
import { Check, Plus } from "lucide-react";
import type { Member, Bill } from "@/types";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import { useBills } from "./hooks/useBills";

function SectionBill({ members, onDone, currentSection }) {
    const {
        equalBills,
        unequalBills,
        loading,
        addEqualBill,
        addUnequalBill,
        deleteEqualBill,
        deleteUnequalBill,
    } = useBills();



    const [showForm, setShowForm] = useState(false);
    // const [isEqual, setIsEqual] = useState(true);
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
            <Section
                title="Bills"
                status={currentSection !== "members" ? "enabled" : "disabled"}
            >
                <div className="flex justify-end py-2">
                    <Button
                        variant="secondary"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus
                            size={20}
                            strokeWidth={2.5}
                            color={"var(--color-alice-blue)"}
                            className="inline mr-2"
                        />
                        Add bill
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <BillList
                        bills={equalBills}
                        type="equal"
                        setEqualBills={setEqualBills}
                        setUnequalBills={setUnequalBills}
                        setFormData={setFormData}
                        setShowForm={setShowForm}
                        setIsEqual={setIsEqual}
                    />
                    <BillList
                        bills={unequalBills}
                        type="unequal"
                        setEqualBills={setEqualBills}
                        setUnequalBills={setUnequalBills}
                        setFormData={setFormData}
                        setShowForm={setShowForm}
                        setIsEqual={setIsEqual}
                    />
                </div>
                <div className="mt-8 justify-between flex items-center">
                    <div className="text-tea-rose">
                        {errorMessage && <p>{errorMessage}</p>}
                    </div>
                    <Button onClick={handleDone} variant="default">
                        <Check
                            size={20}
                            strokeWidth={2.5}
                            color={"var(--color-oxford-blue)"}
                            className="inline mr-2"
                        />
                        Finish
                    </Button>
                </div>
            </Section>
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
