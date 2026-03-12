import { Button } from "@/components/ui/button";
import { useBillFormContext } from "../../../context/BillFormContext";

export default function BillTypeButtons() {
    const { formData, updateFormField } = useBillFormContext();
    const isEqual = (formData.type === "equal");
    return (
        <div className="flex mb-4 gap-4 transition-colors duration-1000">
            {["Equal", "Unequal"].map((type) => {
                return (
                    <Button
                        key={type}
                        variant={`${isEqual === (type === "Equal") ? "default" : "outline"}`}
                        onClick={() => updateFormField("type", type === "Equal" ? "equal" : "unequal")}
                        className="text-sm"
                    >
                        {type}
                    </Button>
                );
            })}
        </div>
    );
}