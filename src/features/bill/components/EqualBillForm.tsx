import { Banknote, CalculatorIcon } from "lucide-react";
import type { Member } from "@/types";
import { useRef } from "react";
import { useBillFormContext } from "../context/BillFormContext";
import { Check } from "lucide-react";

function EqualBillAmount() {
    const { formData, updateFormFieldWrapper, openCalculator } = useBillFormContext();
    let inputRef = useRef(null);

    function BanknoteIcon() {
        return (
            <div className="flex items-center justify-center h-10 w-10 rounded-full">
                <Banknote
                    size={24}
                    strokeWidth={2.5}
                    color={"var(--color-columbia-blue)"}
                    className="inline"
                />
            </div>
        );
    }

    function AmountInput({
        value,
        onChange,
    }: {
        value: number;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) {
        return (
            <input
                type="number"
                name="amount"
                placeholder="Total amount"
                className="w-4/5 p-2 bg-rich-black text-alice-blue outline-none border-b-2 focus:border-b-columbia-blue mb-2 transition duration-200 border-b-honolulu-blue/80"
                value={value}
                onChange={onChange}
                min="0"
                ref={inputRef}
            />
        );
    }

    function CalculatorButton({ handleClick }: { handleClick: () => void }) {
        return (
            <button
                className="flex items-center justify-center h-10 w-10 text-honolulu-blue hover:font-black transition rounded-full hover:scale-110 cursor-pointer hover:bg-honolulu-blue/40 active:bg-honolulu-blue/50 hover:text-columbia-blue"
                onClick={handleClick}
            >
                <CalculatorIcon
                    size={22}
                    strokeWidth={2.5}
                    color={"var(--color-honolulu-blue)"}
                />
            </button>
        );
    }
    return (
        <div className="flex mb-4 gap-4 justify-between items-center">
            <BanknoteIcon />
            <AmountInput value={formData.amount} onChange={updateFormFieldWrapper} />
            <CalculatorButton
                handleClick={() => openCalculator(inputRef.current)}
            />
        </div>
    );
}

function EqualBillParticipants({ members }: { members: Member[] }) {
    const { formData, updateFormField, updateFormFieldWrapper, selectAll } =
        useBillFormContext();

    const toggleAllShares = (checked: boolean) => {
        // For "Select All" checkbox
        if (checked) {
            const newShares: Record<string, number> = {};
            members.forEach((member) => {
                newShares[member.name] = checked ? 1 : 0;
            });
            updateFormField("shares", newShares);
        }
    };

    function SelectAllCheckbox({
        checked,
        onChange,
    }: {
        checked: boolean;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) {
        return (
            <CheckboxItem
                key="select-all"
                name="select-all"
                checked={checked}
                label="All"
                onChange={onChange}
            />
        );
    }

    function CheckboxItem({
        label,
        name,
        checked,
        onChange,
    }: {
        label: string;
        name: string;
        checked: boolean;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) {
        return (
            <label className="relative group flex items-center gap-3 px-4 transition-all cursor-pointer">
                <input
                    type="checkbox"
                    name={name}
                    className="accent-honolulu-blue w-4 h-4 cursor-pointer transition-all group-hover:scale-120 focus:ring-0 rounded-lg hidden peer"
                    onChange={onChange}
                    checked={checked}
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
                    {label}
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
                <SelectAllCheckbox
                    checked={selectAll}
                    onChange={(e) => toggleAllShares(e.target.checked)}
                />
                {members.map((member) => (
                    <CheckboxItem
                        key={member.id}
                        name={`equal-share-${member.name}`}
                        checked={formData.shares[member.name] > 0}
                        label={member.name}
                        onChange={updateFormFieldWrapper}
                    />
                ))}
            </div>
        </div>
    );
}

export { EqualBillAmount, EqualBillParticipants };
