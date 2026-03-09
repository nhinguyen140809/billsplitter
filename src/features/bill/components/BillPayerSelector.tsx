import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { UserRound } from "lucide-react";
import type { Member } from "@/types";
import { useBillFormContext } from "../context/BillFormContext";

function BillPayerSelector({ members }: { members: Member[] }) {
    const { formData, updateFormField } = useBillFormContext();
    const handleSelectChange = (value: string) => {
        updateFormField("payer", value);
    };
    return (
        <div className="flex items-center">
            <div className="flex items-center justify-center h-10 w-10 rounded-full mr-4">
                <UserRound
                    size={22}
                    strokeWidth={2.5}
                    color={"var(--primary)"}
                    className="inline"
                />
            </div>
            <Select
                name="payer"
                value={formData.payer}
                defaultValue="Select payer"
                onValueChange={handleSelectChange}
            >
                <SelectTrigger
                    className={`w-full p-2 rounded-none bg-none text-base text-secondary outline-none border-0 border-b-2 focus:border-b-primary mb-2 transition duration-200 border-b-muted ${
                        formData.payer === ""
                            ? "text-gray-400"
                            : "text-secondary"
                    }`}
                >
                    <SelectValue placeholder="Paid by..." />
                </SelectTrigger>
                <SelectContent
                    side="bottom"
                    position="popper"
                    className="text-base"
                >
                    <option value="" disabled hidden>
                        Paid by...
                    </option>
                    {members.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                            {member.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default BillPayerSelector;
