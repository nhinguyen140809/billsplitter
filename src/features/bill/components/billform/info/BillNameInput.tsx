import { useBillFormContext } from '../../../context/BillFormContext'

function BillNameInput() {
  const { formData, updateFormFieldWrapper } = useBillFormContext()
  return (
    <input
      type="text"
      name="name"
      placeholder="Bill name"
      className="text-card-foreground focus:border-b-primary border-b-accent mb-3 w-full border-b-2 p-2 pb-1 text-lg font-bold transition duration-200 outline-none sm:mb-4 sm:pb-2 sm:text-xl"
      value={formData.name}
      onChange={updateFormFieldWrapper}
    />
  )
}

export default BillNameInput
