import React from "react";
import type { BillFormData } from "../types";

function BillNameInput({
    formData,
    updateFormDetail,
}: {
    formData: BillFormData;
    updateFormDetail: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="mb-2">
            <input
                type="text"
                name="name"
                placeholder="Bill name"
                className="w-full p-2 font-bold text-xl bg-rich-black text-alice-blue outline-none border-b-2 focus:border-b-columbia-blue mb-4 transition duration-200 border-b-honolulu-blue/80"
                value={formData.name}
                onChange={updateFormDetail}
            />
        </div>
    );
}

export default BillNameInput;
