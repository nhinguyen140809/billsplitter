import { useState } from "react";
import BillList from "./components/BillIList";
import BillFormPopup from "./components/billform/BillForm";
import { Check, Plus } from "lucide-react";
import Section from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import { useBills } from "./hooks/useBills";
import type { Bill, SectionStatus } from "@/types";

function SectionBill({
    onDone,
    status,
    settlementId,
}: {
    onDone: () => void;
    status?: SectionStatus;
    settlementId?: string;
}) {
    const { bills, onSubmitBillForm, removeBill, duplicateBill } =
        useBills(settlementId);

    const [showForm, setShowForm] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

    const handleEditBillClick = (bill: Bill) => {
        setSelectedBill(bill);
        setShowForm(true);
    };

    const handleDone = () => {
        if (bills.length < 1) {
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
                    <Button
                        variant="outline"
                        onClick={() => {
                            setShowForm(true);
                            setSelectedBill(null);
                        }}
                        disabled={status === "disabled"}
                    >
                        <Plus />
                        Add bill
                    </Button>
                </div>

                <BillList
                    bills={bills}
                    onDelete={removeBill}
                    onEdit={handleEditBillClick}
                    onDuplicate={duplicateBill}
                />

                <div className="mt-8 justify-between flex items-center">
                    <div className="text-destructive">
                        {errorMessage && <p>{errorMessage}</p>}
                    </div>
                    <Button
                        onClick={handleDone}
                        variant="default"
                        disabled={status === "disabled"}
                    >
                        <Check />
                        Finish
                    </Button>
                </div>
            </Section>
            {showForm && (
                <BillFormPopup
                    selectedBill={selectedBill}
                    onSubmitBillForm={onSubmitBillForm}
                    onClose={() => setShowForm(false)}
                />
            )}
        </>
    );
}

export default SectionBill;
