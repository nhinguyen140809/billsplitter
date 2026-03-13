import { useBillForm } from "../../hooks/useBillForm";
import BillPayerSelector from "./info/BillPayerSelector";
import BillFormContext from "../../context/BillFormContext";
import BillNameInput from "./info/BillNameInput";
import BillTypeButtons from "./info/BillTypeButtons";
import UnequalBillShares from "./split/UnequalBillSplit";
import { EqualBillAmount, EqualBillParticipants } from "./split/EqualBillSplit";
import Calculator from "../../../calculator/Calculator";
import { Button } from "@/components/ui/button";
import Overlay from "@/components/shared/Overlay";
import Popup from "@/components/shared/Popup";
import { useMembers } from "@/features/participants/hooks/useMembers";
import type { Bill, BillType } from "@/types";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";

function BillFormFooterButtons({
    onClose,
    onSave,
}: {
    onClose: () => void;
    onSave: () => void;
}) {
    return (
        <div className="flex justify-end gap-4 mt-2">
            <Button onClick={onClose} variant="outline" size="sm">
                Cancel
            </Button>
            <Button onClick={onSave} variant="default" size="sm">
                Save
            </Button>
        </div>
    );
}

function BillSplit({ type }: { type: BillType }) {
    return (
        <div className="grid w-full">
            <div
                className={cn(
                    "col-start-1 row-start-1 min-w-0 transition-opacity duration-300",
                    type === "equal"
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none",
                )}
            >
                <EqualBillAmount />
                <EqualBillParticipants />
            </div>

            <div
                className={cn(
                    "col-start-1 row-start-1 min-w-0 transition-opacity duration-300",
                    type === "unequal"
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none",
                )}
            >
                <UnequalBillShares />
            </div>
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
    const { id: settlementId } = useParams();
    const { members } = useMembers(settlementId);
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
                    <BillSplit type={billForm.formData.type} />
                    {billForm.formErrorMessage && (
                        <p className="text-destructive font-medium text-xs sm:text-sm">
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
