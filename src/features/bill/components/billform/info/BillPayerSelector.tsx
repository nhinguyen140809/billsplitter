import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { UserRound } from "lucide-react";
import { useBillFormContext } from "../../../context/BillFormContext";
import { useMembers } from "../../../../participants/hooks/useMembers";

function BillPayerSelector() {
    const { formData, updateFormField } = useBillFormContext();
    const { members } = useMembers();
    const handleSelectChange = (value: string) => {
        updateFormField("payer", value);
    };
    return (
        <div className="flex items-center">
            <div className="flex items-center justify-center text-primary h-6 w-10 rounded-full mr-4">
                <UserRound
                    size={20}
                />
            </div>
            <Select
                name="payer"
                value={formData.payer}
                defaultValue="Select payer"
                onValueChange={handleSelectChange}
            >
                <SelectTrigger
                    className="w-full p-2 text-secondary outline-none border-0 focus:border-primary mb-2 transition duration-200"
                >
                    <SelectValue placeholder="Paid by..." className="text-muted"/>
                </SelectTrigger>
                <SelectContent
                    side="bottom"
                    position="popper"
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
