import { CalculatorIcon } from "lucide-react";
import { useRef } from "react";
import type { Member } from "@/types";
import { useBillFormContext } from "../context/BillFormContext";

function UnequalBillShares({ members }: { members: Member[] }) {
    const { formData, updateFormFieldWrapper, openCalculator } =
        useBillFormContext();

    return (
        <div className="mb-4">
            <p className="mb-4 font-bold text-lg text-columbia-blue">
                Assign shares:
            </p>
            <div className="flex flex-col gap-2">
                {members.map((member) => {
                    let inputRef = useRef(null);
                    return (
                        <div
                            key={member.id}
                            className="flex items-center justify-between gap-2 sm:gap-4"
                        >
                            <p className="text-alice-blue max-w-2/5">
                                {member.name}:
                            </p>
                            <div className="flex items-center gap-2 sm:gap-4 justify-end">
                                <input
                                    type="number"
                                    name={`unequal-share-${member.name}`}
                                    className="ml-2 p-1 bg-rich-black text-alice-blue outline-none border-b-2 focus:border-b-columbia-blue transition duration-200 border-b-honolulu-blue/80 w-4/5"
                                    min="0"
                                    onChange={updateFormFieldWrapper}
                                    value={formData.shares[member.name] || ""}
                                    ref={inputRef}
                                />
                                <button
                                    className="flex items-center justify-center text-sm h-10 w-10 text-honolulu-blue hover:font-black font-extrabold transition rounded-full hover:scale-110 cursor-pointer hover:bg-honolulu-blue/40 active:bg-honolulu-blue/50 hover:text-columbia-blue"
                                    onClick={() =>
                                        openCalculator(inputRef.current)
                                    }
                                >
                                    <CalculatorIcon
                                        size={22}
                                        strokeWidth={2.5}
                                        color={"var(--color-honolulu-blue)"}
                                    />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default UnequalBillShares;
