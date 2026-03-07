import { Select } from "@/components/ui/select";
import { UserRound } from "lucide-react";
import type { BillFormData } from "../types";
import type { Member } from "@/types";

function BillPayerSelector({
    members,
    formData,
    updateFormDetail,
}: {
    members: Member[];
    formData: BillFormData;
    updateFormDetail: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
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
                onValueChange={updateFormDetail}
                className={`w-full p-2 bg-rich-black text-alice-blue outline-none border-b-2 focus:border-b-columbia-blue mb-2 transition duration-200 border-b-honolulu-blue/80 ${
                    formData.payer === "" ? "text-gray-400" : "text-alice-blue"
                }`}
            >
                <option value="" disabled hidden>
                    Paid by...
                </option>
                {members.map((member) => (
                    <option key={member.id} value={member.name}>
                        {member.name}
                    </option>
                ))}
            </Select>
        </div>
    );
}

export default BillPayerSelector;