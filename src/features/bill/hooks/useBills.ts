import { useDraftSettlement } from "@/hooks/useDraftSettlement";
import { useSettlement } from "@/hooks/useSettlement";
import type { Bill, BillType } from "@/types";

export const useBills = (settlementId?: string) => {
    const { draft, updateDraft } = useDraftSettlement();
    const { settlement, updateSettlementPartial } = settlementId
        ? useSettlement(settlementId)
        : { settlement: undefined, updateSettlementPartial: () => {} };

    const unequalBills = settlement
        ? settlement.unequalBills
        : draft.unequalBills;
    const equalBills = settlement ? settlement.equalBills : draft.equalBills;

    const addBill = (bill: Bill, type: BillType) => {
        if (bill.id === "") {
            bill.id = crypto.randomUUID();
        }
        if (type === "equal") {
            const newEqualBills = [...equalBills, bill];
            if (settlement) {
                updateSettlementPartial({ equalBills: newEqualBills });
            } else {
                updateDraft({ equalBills: newEqualBills });
            }
        } else {
            const newUnequalBills = [...unequalBills, bill];
            if (settlement) {
                updateSettlementPartial({ unequalBills: newUnequalBills });
            } else {
                updateDraft({ unequalBills: newUnequalBills });
            }
        }
    };

    const removeBill = (billId: string, type: BillType) => {
        if (type === "equal") {
            const newEqualBills = equalBills.filter(
                (bill) => bill.id !== billId,
            );
            if (settlement) {
                updateSettlementPartial({ equalBills: newEqualBills });
            } else {
                updateDraft({ equalBills: newEqualBills });
            }
        } else {
            const newUnequalBills = unequalBills.filter(
                (bill) => bill.id !== billId,
            );
            if (settlement) {
                updateSettlementPartial({ unequalBills: newUnequalBills });
            } else {
                updateDraft({ unequalBills: newUnequalBills });
            }
        }
    };

    const updateBill = (updatedBill: Bill, type: BillType) => {
        if (type === "equal") {
            const newEqualBills = equalBills.map((bill) =>
                bill.id === updatedBill.id ? updatedBill : bill,
            );
            if (settlement) {
                updateSettlementPartial({ equalBills: newEqualBills });
            } else {
                updateDraft({ equalBills: newEqualBills });
            }
        } else {
            const newUnequalBills = unequalBills.map((bill) =>
                bill.id === updatedBill.id ? updatedBill : bill,
            );
            if (settlement) {
                updateSettlementPartial({ unequalBills: newUnequalBills });
            } else {
                updateDraft({ unequalBills: newUnequalBills });
            }
        }
    };

    const duplicateBill = (billId: string, type: BillType) => {
        const billToDuplicate =
            type === "equal"
                ? equalBills.find((bill) => bill.id === billId)
                : unequalBills.find((bill) => bill.id === billId);
        if (billToDuplicate) {
            addBill({ ...billToDuplicate, id: crypto.randomUUID() }, type);
        }
    };

    const onSubmitBillForm = (bill: Bill, type: BillType) => {
        if (type === "equal") {
            if (bill.id !== "") {
                updateBill(bill, "equal");
                removeBill(bill.id, "unequal");
            } else {
                addBill(bill, "equal");
            }
        } else {
            if (bill.id !== "") {
                updateBill(bill, "unequal");
                removeBill(bill.id, "equal");
            } else {
                addBill(bill, "unequal");
            }
        }
    };

    return {
        equalBills,
        unequalBills,
        addBill,
        removeBill,
        updateBill,
        duplicateBill,
        onSubmitBillForm,
    };
};
