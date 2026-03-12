import { useBillFormContext } from "../../../context/BillFormContext";

function BillNameInput() {
    const { formData, updateFormFieldWrapper } = useBillFormContext();
    return (
        <input
            type="text"
            name="name"
            placeholder="Bill name"
            className="w-full p-2 font-bold text-xl text-secondary outline-none border-b-2 focus:border-b-primary mb-4 transition duration-200 border-b-accent"
            value={formData.name}
            onChange={updateFormFieldWrapper}
        />
    );
}

export default BillNameInput;
