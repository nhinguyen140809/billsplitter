import { settlementRepo } from "@/repositories/settlementRepo";
import type { Settlement } from "@/types";
import { useLiveQuery } from "dexie-react-hooks";
import { DEFAULT_SETTLEMENT } from "@/constants";
import { useEffect } from "react";

export function useDraftSettlement() {
    const draftQuery = useLiveQuery<Settlement | null>(
        () => settlementRepo.getDraft(),
        [],
    );

    const draft = draftQuery || DEFAULT_SETTLEMENT;

    useEffect(() => {
        if (draftQuery === undefined) {
            // Still loading, do nothing
            return;
        }
        if (draftQuery === null) {
            settlementRepo.saveDraft(DEFAULT_SETTLEMENT);
        }
    }, [draftQuery]);

    const saveDraft = async (data: Settlement) => {
        await settlementRepo.saveDraft(data);
    };

    const updateDraft = async (data: Partial<Settlement>) => {
        await settlementRepo.updateDraft(data);
    };

    const clearDraft = async () => {
        await settlementRepo.clearDraft();
    };

    const createSettlementFromDraft = async () => {
        const newSettlementId =
            await settlementRepo.createSettlement(draft);
        clearDraft();
        return newSettlementId;
    };

    return {
        draft,
        saveDraft,
        updateDraft,
        clearDraft,
        createSettlementFromDraft,
    };
}
