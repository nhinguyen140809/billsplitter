import { Button } from "@/components/ui/button";
import { useBillFormContext } from "../context/BillFormContext";

export default function BillTypeButtons() {
    const { isEqual, setIsEqual } = useBillFormContext();
    return (
        <div className="flex mb-4 gap-4">
            {["Equal", "Unequal"].map((type) => {
                return (
                    <Button
                        key={type}
                        variant={`${isEqual === (type === "Equal") ? "default" : "outline"}`}
                        onClick={() => setIsEqual(type === "Equal")}
                    >
                        {type}
                    </Button>
                );
            })}
        </div>
    );
}