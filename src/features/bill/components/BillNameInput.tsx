import { useBillFormContext } from "../context/BillFormContext";

function BillNameInput() {
    const { formData, updateFormFieldWrapper } = useBillFormContext();
    return (
        <div className="mb-2">
            <input
                type="text"
                name="name"
                placeholder="Bill name"
                className="w-full p-2 font-bold text-xl bg-rich-black text-alice-blue outline-none border-b-2 focus:border-b-columbia-blue mb-4 transition duration-200 border-b-honolulu-blue/80"
                value={formData.name}
                onChange={updateFormFieldWrapper}
            />
        </div>
    );
}

export default BillNameInput;
