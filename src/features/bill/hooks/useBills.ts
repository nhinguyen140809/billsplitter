import { useDraftSettlement } from "@/hooks/useDraftSettlement";
import { useSettlement } from "@/hooks/useSettlement";
import type { Bill } from "@/types";

export const useBills = (settlementId?: string) => {
    const { draft, updateDraft } = useDraftSettlement();
    const { settlement, updateSettlementPartial } = settlementId
        ? useSettlement(settlementId)
        : { settlement: undefined, updateSettlementPartial: () => {}};

    const bills = settlement ? settlement.bills : draft.bills;

    const addBill = (bill: Bill) => {
        const newBill =
            bill.id === "" ? { ...bill, id: crypto.randomUUID() } : bill;
        const newBills = [...bills, newBill];
        if (settlement) {
            updateSettlementPartial({ bills: newBills });
        } else {
            updateDraft({ bills: newBills });
        }
    };

    const removeBill = (billId: string) => {
        const newBills = bills.filter((bill) => bill.id !== billId);
        if (settlement) {
            updateSettlementPartial({ bills: newBills });
        } else {
            updateDraft({ bills: newBills });
        }
    };

    const updateBill = (updatedBill: Bill) => {
        const newBills = bills.map((bill) =>
            bill.id === updatedBill.id ? updatedBill : bill,
        );
        if (settlement) {
            updateSettlementPartial({ bills: newBills });
        } else {
            updateDraft({ bills: newBills });
        }
    };

    const duplicateBill = (billId: string) => {
        const billToDuplicate = bills.find((bill) => bill.id === billId);
        if (billToDuplicate) {
            addBill({
                ...billToDuplicate,
                id: crypto.randomUUID(),
                name: "Copy of " + billToDuplicate.name,
            } as Bill);
        }
    };

    const onSubmitBillForm = (bill: Bill) => {
        const isNewBill = bill.id === "";
        if (isNewBill) {
            addBill(bill);
            return;
        }
        updateBill(bill);
    };

    return {
        bills,
        addBill,
        removeBill,
        updateBill,
        duplicateBill,
        onSubmitBillForm,
    };
};
