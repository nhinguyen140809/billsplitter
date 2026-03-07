import { settlementRepo } from "@/repositories/settlementRepo";
import type { Settlement } from "@/types";
import { useLiveQuery } from "dexie-react-hooks";

export function useSettlement(settlementId: string) {
    const settlement = useLiveQuery<Settlement | undefined>(
        () => settlementRepo.getSettlement(settlementId),
        [settlementId],
    );

    const updateSettlement = async (data: Settlement) => {
        await settlementRepo.updateSettlement(settlementId, data);
    };

    const updateSettlementPartial = async (data: Partial<Settlement>) => {
        const currentSettlement = await settlementRepo.getSettlement(settlementId);
        if (currentSettlement) {
            await settlementRepo.updateSettlement(settlementId, {
                ...currentSettlement,
                ...data,
                updatedAt: new Date().toISOString(),
            } as Settlement);
        }
    };

    const deleteSettlement = async () => {
        await settlementRepo.deleteSettlement(settlementId);
    };

    return { settlement, updateSettlement, updateSettlementPartial, deleteSettlement };
}
