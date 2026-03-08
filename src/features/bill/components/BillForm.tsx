import { useBillForm } from "../hooks/useBillForm";
import type { Bill, BillType, Member } from "@/types";
import BillPayerSelector from "./BillPayerSelector";
import BillFormContext from "../context/BillFormContext";
import BillNameInput from "./BillNameInput";
import BillTypeButtons from "./BillTypeButtons";
import UnequalBillShares from "./UnequalBillForm";
import { EqualBillAmount, EqualBillParticipants } from "./EqualBillForm";
import Calculator from "../../calculator/Calculator";

function BillFormFooterButtons({
    onClose,
    onSave,
}: {
    onClose: () => void;
    onSave: () => void;
}) {
    return (
        <div className="flex justify-end gap-4 mt-4">
            <button onClick={onClose} className="tonal-button">
                Cancel
            </button>
            <button onClick={onSave} className="fill-button">
                Save
            </button>
        </div>
    );
}

export default function BillFormPopup({
    members,
    onSubmitBillForm,
    onClose,
}: {
    members: Member[];
    onSubmitBillForm: (data: Bill, type: BillType) => void;
    onClose: () => void;
}) {
    const billForm = useBillForm(onSubmitBillForm, onClose);

    return (
        <BillFormContext.Provider value={billForm}>
            <div className="fixed top-0 left-0 w-screen h-screen bg-rich-black/70 flex items-center justify-center z-50 px-4 sm:px-0 transition-opacity duration-300 backdrop-blur-xl">
                <div className="section-container popup-container">
                    <h2 className="text-2xl font-extrabold text-columbia-blue mb-4">
                        Bill Details
                    </h2>
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
                </div>
            </div>
            <Calculator
                openCalculator={billForm.calculatorOpened}
                onClose={billForm.closeCalculator}
                onSave={billForm.saveCalculator}
            />
        </BillFormContext.Provider>
    );
}
