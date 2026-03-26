import { Banknote, CalculatorIcon } from "lucide-react";
import type { BillShareValue } from "@/types";
import { useRef } from "react";
import { useBillFormContext } from "../../../context/BillFormContext";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMembers } from "@/features/participants";
import { useParams } from "react-router-dom";

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
            className="flex-1 p-1 text-card-foreground outline-none border-b-2 focus:border-b-primary mb-2 transition duration-200 border-b-accent text-sm sm:text-base mr-4"
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
            <div className="flex items-center justify-center text-primary h-7 w-6 sm:w-10 rounded-full mr-3.5">
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
        <div className="flex mb-2 w-full justify-between items-center">
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
    const { id: settlementId } = useParams();
    const { members } = useMembers(settlementId);

    const participantCount = members.filter(
        (m) => (parseFloat(formData.shares[m.name]) || 0) > 0,
    ).length;

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
                    className="accent-primary size-3.5 sm:w-4 sm:h-4 cursor-pointer transition-all group-hover:scale-120 focus:ring-0 rounded-lg hidden peer"
                    onChange={onChange}
                    checked={checked}
                />
                <span className="size-4 sm:size-5 rounded-full border-2 border-accent flex items-center justify-center transition-all duration-200 peer-checked:bg-accent peer-checked:border-accent peer-checked:[&>svg]:opacity-100 peer-checked:[&>svg]:scale-100 text-card-foreground">
                    <Check
                        strokeWidth={3.5}
                        className="opacity-0 scale-75 transition-all duration-200 size-3 sm:size-3.5"
                    />
                </span>

                <p className="text-card-foreground select-none transition-colors duration-200 group-hover:text-primary text-sm break-all">
                    {label}
                </p>
            </label>
        );
    }

    return (
        <div className="mb-2">
            <div className="flex justify-between items-center mb-2 sm:mb-4">
                <p className="font-bold text-sm sm:text-base text-primary">
                    Select Participants:
                </p>
                <p className="text-muted-foreground text-xs">
                    {participantCount} / {members.length} selected
                </p>
            </div>
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
