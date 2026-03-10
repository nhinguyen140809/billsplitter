import { useBillForm } from "../hooks/useBillForm";
import BillPayerSelector from "./BillPayerSelector";
import BillFormContext from "../context/BillFormContext";
import BillNameInput from "./BillNameInput";
import BillTypeButtons from "./BillTypeButtons";
import UnequalBillShares from "./UnequalBillForm";
import { EqualBillAmount, EqualBillParticipants } from "./EqualBillForm";
import Calculator from "../../calculator/Calculator";
import { Button } from "@/components/ui/button";
import Overlay from "@/components/shared/Overlay";
import Popup from "@/components/shared/Popup";
import { useMembers } from "@/features/participants/hooks/useMembers";
import type { Bill } from "@/types";
import { useEffect } from "react";

function BillFormFooterButtons({
    onClose,
    onSave,
}: {
    onClose: () => void;
    onSave: () => void;
}) {
    return (
        <div className="flex justify-end gap-4 mt-2">
            <Button onClick={onClose} variant="outline" className="text-sm">
                Cancel
            </Button>
            <Button onClick={onSave} variant="default" className="text-sm">
                Save
            </Button>
        </div>
    );
}

export default function BillFormPopup({
    selectedBill,
    onSubmitBillForm,
    onClose,
}: {
    selectedBill: Bill | null;
    onSubmitBillForm: (bill: Bill) => void;
    onClose: () => void;
}) {
    const { members } = useMembers();
    const billForm = useBillForm(members, onSubmitBillForm, onClose);

    useEffect(() => {
        if (selectedBill) {
            billForm.setSelectedBillForm(selectedBill);
        } else {
            billForm.setSelectedBillForm(null);
        }
    }, [selectedBill]);

    return (
        <BillFormContext.Provider value={billForm}>
            <Overlay>
                <Popup title="Bill Details">
                    <BillNameInput />
                    <BillTypeButtons />
                    <BillPayerSelector />
                    {billForm.formData.type === "equal" && (
                        <>
                            <EqualBillAmount />
                            <EqualBillParticipants />
                        </>
                    )}
                    {billForm.formData.type === "unequal" && (
                        <UnequalBillShares />
                    )}
                    {billForm.formErrorMessage && (
                        <p className="text-destructive font-medium text-sm">
                            {billForm.formErrorMessage}
                        </p>
                    )}
                    <BillFormFooterButtons
                        onClose={billForm.handleCloseForm}
                        onSave={billForm.handleSubmitForm}
                    />
                </Popup>
            </Overlay>
            <Calculator
                openCalculator={billForm.calculatorOpened}
                onClose={billForm.closeCalculator}
                onSave={billForm.saveCalculator}
            />
        </BillFormContext.Provider>
    );
}
