import { Button } from "@/components/ui/button";

export default function BillTypeButtons({
    isEqual,
    setIsEqual,
}: {
    isEqual: boolean;
    setIsEqual: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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