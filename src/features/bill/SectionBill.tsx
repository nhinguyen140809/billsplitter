import { useState } from "react";
import BillList from "./components/BillIList";
import BillFormPopup from "./components/BillForm";
import { Check, Plus } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import { useBills } from "./hooks/useBills";
import { useBillForm } from "./hooks/useBillForm";
import { useMembers } from "../participants/hooks/useMembers";
import type { Bill, BillType, SectionStatus } from "@/types";

function AddBillButton({
    onClick,
    disabled,
}: {
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <Button variant="secondary" onClick={onClick} disabled={disabled}>
            <Plus
                size={20}
                strokeWidth={2.5}
                color={"var(--color-alice-blue)"}
                className="inline mr-2"
            />
            Add bill
        </Button>
    );
}

function SectionBill({
    onDone,
    status,
}: {
    onDone: () => void;
    status?: SectionStatus;
}) {
    const { members } = useMembers();
    const { equalBills, unequalBills, onSubmitBillForm, removeBill } =
        useBills();

    const { setSelectedBill } = useBillForm(onSubmitBillForm, () =>
        setShowForm(false),
    );

    const [showForm, setShowForm] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleEditBillClick = (bill: Bill, type: BillType) => {
        setSelectedBill(bill, type);
        setShowForm(true);
    };

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
            <Section title="Bills" status={status}>
                <div className="flex justify-end py-2">
                    <AddBillButton
                        onClick={() => setShowForm(true)}
                        disabled={status === "disabled"}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <BillList
                        bills={equalBills}
                        type="equal"
                        onDelete={removeBill}
                        onEdit={handleEditBillClick}
                    />
                    <BillList
                        bills={unequalBills}
                        type="unequal"
                        onDelete={removeBill}
                        onEdit={handleEditBillClick}
                    />
                </div>

                <div className="mt-8 justify-between flex items-center">
                    <div className="text-tea-rose">
                        {errorMessage && <p>{errorMessage}</p>}
                    </div>
                    <Button
                        onClick={handleDone}
                        variant="default"
                        disabled={status === "disabled"}
                    >
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
                    onSubmitBillForm={onSubmitBillForm}
                    onClose={() => setShowForm(false)}
                />
            )}
        </>
    );
}

export default SectionBill;
