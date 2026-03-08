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

function BillPayerSelector({
    members,
}: {
    members: Member[];
}) {
    const { formData, updateFormField } = useBillFormContext();
    const handleSelectChange = (value: string) => {
        updateFormField("payer", value);
    };
    return (
        <div className="mb-4 flex items-center">
            <div className="flex items-center justify-center h-10 w-10 rounded-full mr-4">
                <UserRound
                    size={22}
                    strokeWidth={2.5}
                    color={"var(--color-columbia-blue)"}
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
                    className={`w-full p-2 bg-rich-black text-alice-blue outline-none border-b-2 focus:border-b-columbia-blue mb-2 transition duration-200 border-b-honolulu-blue/80 ${
                        formData.payer === ""
                            ? "text-gray-400"
                            : "text-alice-blue"
                    }`}
                >
                    <SelectValue placeholder="Paid by..." />
                </SelectTrigger>
                <SelectContent>
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
