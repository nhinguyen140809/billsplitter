import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { UserRound } from "lucide-react";
import { useBillFormContext } from "../../../context/BillFormContext";
import { useMembers } from "@/features/participants";
import { useParams } from "react-router-dom";

function BillPayerSelector() {
    const { formData, updateFormField } = useBillFormContext();
    const { id: settlementId } = useParams();
    const { members } = useMembers(settlementId);
    const handleSelectChange = (value: string) => {
        updateFormField("payer", value);
    };
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center justify-center text-primary h-7 w-6 sm:w-10 rounded-full mr-4">
                <UserRound className="size-5"/>
            </div>
            <Select
                name="payer"
                value={formData.payer}
                defaultValue="Select payer"
                onValueChange={handleSelectChange}
            >
                <SelectTrigger
                    className="w-full p-2 text-card-foreground outline-none border-0 focus:border-primary mb-1 transition duration-200 text-sm sm:text-base"
                >
                    <SelectValue placeholder="Paid by..." className="text-muted"/>
                </SelectTrigger>
                <SelectContent
                    side="bottom"
                    position="popper"
                    className="w-[var(--radix-select-trigger-width)]"
                >
                    <option value="" disabled hidden>
                        Paid by...
                    </option>
                    {members.map((member) => (
                        <SelectItem className="break-all" key={member.id} value={member.name}>
                            <span> {member.name} </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default BillPayerSelector;
