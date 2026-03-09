import { useBillForm } from "../hooks/useBillForm";
import type { Bill, BillType, Member } from "@/types";
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
import { useMembers } from "../../participants/hooks/useMembers";

function BillFormFooterButtons({
    onClose,
    onSave,
}: {
    onClose: () => void;
    onSave: () => void;
}) {
    return (
        <div className="flex justify-end gap-4 mt-2">
            <Button onClick={onClose} variant="outline">
                Cancel
            </Button>
            <Button onClick={onSave} variant="default">
                Save
            </Button>
        </div>
    );
}


export default function BillFormPopup({
    onSubmitBillForm,
    onClose,
}: {
    onSubmitBillForm: (data: Bill, type: BillType) => void;
    onClose: () => void;
}) {
    const { members } = useMembers();
    const billForm = useBillForm(members, onSubmitBillForm, onClose);

    return (
        <BillFormContext.Provider value={billForm}>
            <Overlay>
                <Popup title="Bill Details">
                    <BillNameInput />
                    <BillTypeButtons />
                    <BillPayerSelector members={members} />
                    {billForm.isEqual && (
                        <>
                            <EqualBillAmount />
                            <EqualBillParticipants members={members} />
                        </>
                    )}
                    {!billForm.isEqual && (
                        <UnequalBillShares members={members} />
                    )}
                    {billForm.formErrorMessage && (
                        <p className="text-tea-rose mb-2">
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
