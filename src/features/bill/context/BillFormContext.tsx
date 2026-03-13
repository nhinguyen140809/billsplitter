import { createContext, useContext } from "react";
import { useBillForm } from "../hooks/useBillForm";


type BillFormContextType = ReturnType<typeof useBillForm>;

const BillFormContext = createContext<BillFormContextType | null>(null);

export const useBillFormContext = () => {
    const ctx = useContext(BillFormContext);
    if (!ctx) {
        throw new Error("useBillFormContext must be used within a BillFormProvider");
    }
    return ctx;
};

export default BillFormContext;