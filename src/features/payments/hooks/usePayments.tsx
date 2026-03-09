import { useSettlement } from "@/hooks/useSettlement";
import { useDraftSettlement } from "@/hooks/useDraftSettlement";
import type { PaymentData } from "@/types";
import { useState } from "react";

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

    const [calculationState, setCalculationState] = useState<Boolean>(false);

    const updateSendPayments = (newSendPayments: PaymentData) => {
        if (settlement) {
            updateSettlementPartial({ sendPayments: newSendPayments });
        } else {
            updateDraft({ sendPayments: newSendPayments });
        }
    };

    const updateReceivePayments = (newReceivePayments: PaymentData) => {
        if (settlement) {
            updateSettlementPartial({ receivePayments: newReceivePayments });
        } else {
            updateDraft({ receivePayments: newReceivePayments });
        }
    };

    return {
        sendPayments,
        receivePayments,
        calculationState,
        updateSendPayments,
        updateReceivePayments,
        setCalculationState,
    };
}
