import { settlementRepo } from "@/repositories/settlementRepo";
import type { Settlement } from "@/types";
import { useLiveQuery } from "dexie-react-hooks";

export function useDraftSettlement() {
    const draftQuery = useLiveQuery<Settlement | undefined>(
        () => settlementRepo.getDraft(),
        [],
    );

    const draft =
        draftQuery ||
        ({
            id: "draft",
            name: "",
            status: "member",
            members: [],
            equalBills: [],
            unequalBills: [],
            sendPayments: {},
            receivePayments: {},
            updatedAt: new Date().toISOString(),
        } as Settlement);

    const saveDraft = async (data: Settlement) => {
        await settlementRepo.saveDraft(data);
    };

    const updateDraft = async (data: Partial<Settlement>) => {
        saveDraft({
            ...draft,
            ...data,
            updatedAt: new Date().toISOString(),
        } as Settlement);
    };

    const clearDraft = async () => {
        await settlementRepo.clearDraft();
    };

    const createSettlementFromDraft = async () => {
        const { id, ...settlementData } = draft;
        const newSettlementId =
            await settlementRepo.createSettlement(settlementData);
        await clearDraft();
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
