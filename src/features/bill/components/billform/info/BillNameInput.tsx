import { useBillFormContext } from "../../../context/BillFormContext";

function BillNameInput() {
    const { formData, updateFormFieldWrapper } = useBillFormContext();
    return (
        <input
            type="text"
            name="name"
            placeholder="Bill name"
            className="w-full pb-1 sm:pb-2 p-2 font-bold text-base sm:text-xl text-card-foreground outline-none border-b-2 focus:border-b-primary mb-3 sm:mb-4 transition duration-200 border-b-accent"
            value={formData.name}
            onChange={updateFormFieldWrapper}
        />
    );
}

export default BillNameInput;
