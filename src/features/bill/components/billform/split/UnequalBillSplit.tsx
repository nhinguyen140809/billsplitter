import { CalculatorIcon } from "lucide-react";
import { useRef } from "react";
import { useBillFormContext } from "../../../context/BillFormContext";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useMembers } from "../../../../participants/hooks/useMembers";
import type { Member } from "@/types";
import { useParams } from "react-router-dom";

function UnequalShareInput({
    member,
    value,
    onChange,
}: {
    member: Member;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    let inputRef = useRef(null);
    const { openCalculator } = useBillFormContext();
    return (
        <div
            key={member.id}
            className="flex items-end justify-between gap-2 sm:gap-4 pr-3 mt-1"
        >
            <p className="text-card-foreground w-1/2 break-all mb-2">{member.name}:</p>
            <div className="flex items-center gap-2 sm:gap-4 justify-end">
                <input
                    type="number"
                    name={`unequal-share-${member.name}`}
                    className="w-full ml-2 p-1 text-card-foreground outline-none border-b-2 focus:border-b-primary transition duration-200 border-b-accent"
                    min="0"
                    onChange={onChange}
                    value={value}
                    ref={inputRef}
                />
                <Button
                    tabIndex={-1}
                    className="rounded-full"
                    variant="ghost"
                    size="icon-lg"
                    onClick={() => openCalculator(inputRef.current)}
                >
                    <CalculatorIcon className="size-5" />
                </Button>
            </div>
        </div>
    );
}

function UnequalBillShares() {
    const { id: settlementId } = useParams();
    const { formData, updateFormFieldWrapper } = useBillFormContext();

    const { members } = useMembers(settlementId);

    const participantCount = members.filter(
        (m) => (parseFloat(formData.shares[m.name]) || 0) > 0,
    ).length;

    return (
        <div className="mb-2 mt-2">
            <div className="flex justify-between items-center mb-2 sm:mb-4">
                <p className="font-bold text-sm sm:text-base text-primary">Assign shares:</p>
                <p className="text-xs text-muted-foreground">
                    {participantCount} / {members.length} selected
                </p>
            </div>
            <ScrollArea className="flex flex-1 flex-col text-sm max-h-[38vh] min-h-0">
                {members.map((member) => (
                    <UnequalShareInput
                        key={member.id}
                        member={member}
                        value={formData.shares[member.name] || ""}
                        onChange={updateFormFieldWrapper}
                    />
                ))}
                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </div>
    );
}

export default UnequalBillShares;
