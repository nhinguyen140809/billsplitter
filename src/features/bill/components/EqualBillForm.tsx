import { Banknote, CalculatorIcon } from "lucide-react";
import type { BillShareValue } from "@/types";
import { useRef } from "react";
import { useBillFormContext } from "../context/BillFormContext";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMembers } from "../../participants/hooks/useMembers";

function AmountInput({
    value,
    onChange,
    inputRef,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
}) {
    return (
        <input
            type="string"
            name="amount"
            placeholder="Total amount"
            className="w-4/5 p-2 text-card-foreground outline-none border-b-2 focus:border-b-primary mb-2 transition duration-200 border-b-accent text-sm"
            value={value}
            onChange={onChange}
            min="0"
            ref={inputRef}
        />
    );
}

function EqualBillAmount() {
    const { formData, updateFormFieldWrapper, openCalculator } =
        useBillFormContext();
    let inputRef = useRef<HTMLInputElement | null>(null);

    function BanknoteIcon() {
        return (
            <div className="flex items-center justify-center h-10 text-primary w-10 rounded-full">
                <Banknote size={20} />
            </div>
        );
    }

    function CalculatorButton({ handleClick }: { handleClick: () => void }) {
        return (
            <Button
                className="rounded-full"
                variant="ghost"
                size="icon-lg"
                onClick={handleClick}
            >
                <CalculatorIcon className="size-5" />
            </Button>
        );
    }
    return (
        <div className="flex mb-2 gap-4 justify-between items-center">
            <BanknoteIcon />
            <AmountInput
                value={formData.amount}
                onChange={updateFormFieldWrapper}
                inputRef={inputRef}
            />
            <CalculatorButton
                handleClick={() => openCalculator(inputRef.current)}
            />
        </div>
    );
}

function EqualBillParticipants() {
    const { formData, updateFormField, updateFormFieldWrapper, selectAll } =
        useBillFormContext();

    const { members } = useMembers();

    const toggleAllShares = (checked: boolean) => {
        // For "Select All" checkbox
        if (checked) {
            const newShares: BillShareValue = {};
            members.forEach((member) => {
                newShares[member.name] = checked ? 1 : 0;
            });
            updateFormField("shares", newShares);
        } else {
            const newShares: BillShareValue = {};
            members.forEach((member) => {
                newShares[member.name] = 0;
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
                    className="accent-primary w-4 h-4 cursor-pointer transition-all group-hover:scale-120 focus:ring-0 rounded-lg hidden peer"
                    onChange={onChange}
                    checked={checked}
                />
                <span className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center transition-all duration-200 peer-checked:bg-accent peer-checked:border-accent peer-checked:[&>svg]:opacity-100 peer-checked:[&>svg]:scale-100">
                    <Check
                        size={14}
                        strokeWidth={4}
                        color={"var(--secondary)"}
                        className="opacity-0 scale-75 transition-all duration-200"
                    />
                </span>

                <p className="text-secondary select-none transition-colors duration-200 group-hover:text-primary text-sm">
                    {label}
                </p>
            </label>
        );
    }

    return (
        <div className="mb-2">
            <p className="mb-4 font-bold text-md text-primary">
                Select Participants:
            </p>
            <ScrollArea className="">
                <div className="flex flex-1 flex-col gap-3 max-h-[30vh] min-h-0">
                    <SelectAllCheckbox
                        checked={selectAll}
                        onChange={(e) => toggleAllShares(e.target.checked)}
                    />
                    {members.map((member) => (
                        <CheckboxItem
                            key={member.id}
                            name={`equal-share-${member.name}`}
                            checked={Number(formData.shares[member.name]) > 0}
                            label={member.name}
                            onChange={updateFormFieldWrapper}
                        />
                    ))}
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </div>
    );
}

export { EqualBillAmount, EqualBillParticipants };
