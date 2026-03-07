import { Banknote, CalculatorIcon } from "lucide-react";
import type { BillFormData } from "../types";
import { useRef } from "react";


function EqualBillAmount({ formData, updateFormDetail, handleOpenCalculator }: {
    formData: BillFormData;
    updateFormDetail: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleOpenCalculator: (inputRef: HTMLInputElement | null) => void;
}) {
    let inputRef = useRef(null);
    return (
        <div className="flex mb-4 gap-4 justify-between items-center">
            <div className="flex items-center justify-center h-10 w-10 rounded-full">
                <Banknote
                    size={24}
                    strokeWidth={2.5}
                    color={"var(--color-columbia-blue)"}
                    className="inline"
                />
            </div>
            <input
                type="number"
                name="amount"
                placeholder="Total amount"
                className="w-4/5 p-2 bg-rich-black text-alice-blue outline-none border-b-2 focus:border-b-columbia-blue mb-2 transition duration-200 border-b-honolulu-blue/80"
                value={formData.amount}
                onChange={updateFormDetail}
                min="0"
                ref={inputRef}
            />
            <button
                className="flex items-center justify-center h-10 w-10 text-honolulu-blue hover:font-black transition rounded-full hover:scale-110 cursor-pointer hover:bg-honolulu-blue/40 active:bg-honolulu-blue/50 hover:text-columbia-blue"
                onClick={() => handleOpenCalculator(inputRef.current)}
            >
                <CalculatorIcon
                    size={22}
                    strokeWidth={2.5}
                    color={"var(--color-honolulu-blue)"}
                />
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
}: {
    members: Member[];
    formData: BillFormData;
    setFormData: React.Dispatch<React.SetStateAction<BillFormData>>;
    updateFormDetail: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedAll: boolean;
    setSelectedAll: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const toggleAllShares = (checked: boolean) => {
        // For "Select All" checkbox
        if (checked) {
            const newShares: Record<string, number> = {};
            members.forEach((member) => {
                newShares[member.name] = checked ? 1 : 0;
            });
            setFormData((prev) => ({ ...prev, shares: newShares }));
        }
        setSelectedAll(checked);
    };

    function checkboxItem(member: Member, isSelectAll: boolean) {
        return (
            <label
                className="relative group flex items-center gap-3 px-4 transition-all cursor-pointer"
                key={member.id}
            >
                <input
                    type="checkbox"
                    name={
                        isSelectAll
                            ? "select-all"
                            : `participant-${member.name}`
                    }
                    className="accent-honolulu-blue w-4 h-4 cursor-pointer transition-all group-hover:scale-120 focus:ring-0 rounded-lg hidden peer"
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
                <span className="w-5 h-5 rounded-full border-2 border-honolulu-blue flex items-center justify-center transition-all duration-200 peer-checked:bg-honolulu-blue peer-checked:border-honolulu-blue peer-checked:[&>svg]:opacity-100 peer-checked:[&>svg]:scale-100">
                    <Check
                        size={14}
                        strokeWidth={4}
                        color={"var(--color-alice-blue)"}
                        className="opacity-0 scale-75 transition-all duration-200"
                    />
                </span>

                <p className="text-alice-blue font-medium select-none transition-colors duration-200 group-hover:text-columbia-blue">
                    {isSelectAll ? "All" : member.name}
                </p>
            </label>
        );
    }

    return (
        <div className="mb-4">
            <p className="mb-4 font-bold text-lg text-columbia-blue">
                Select Participants:
            </p>
            <div className="flex flex-col gap-2">
                {checkboxItem({ id: "select-all", name: "Select All", paid: 0, spent: 0}, true)}
                {members.map((member) => checkboxItem(member, false))}
            </div>
        </div>
    );
}

export { EqualBillAmount, EqualBillParticipants };