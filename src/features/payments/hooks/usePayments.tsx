import { useSettlement } from "@/hooks/useSettlement";
import { useDraftSettlement } from "@/hooks/useDraftSettlement";
import type { PaymentData } from "@/types";

export function usePayments(settlementId?: string) {
    const { settlement, updateSettlementPartial } = settlementId
        ? useSettlement(settlementId)
        : { settlement: undefined, updateSettlementPartial: () => {} };
    const { draft, updateDraft } = useDraftSettlement();
    const sendPayments = settlement
        ? settlement.sendPayments
        : draft.sendPayments;
    const receivePayments = settlement
        ? settlement.receivePayments
        : draft.receivePayments;

    const updatePayments = (newSendPayments: PaymentData, newReceivePayments: PaymentData) => {
        if (settlement) {
            updateSettlementPartial({ sendPayments: newSendPayments, receivePayments: newReceivePayments });
        } else {
            updateDraft({ sendPayments: newSendPayments, receivePayments: newReceivePayments });
        }
    };

    return {
        sendPayments,
        receivePayments,
        updatePayments,
    };
}
