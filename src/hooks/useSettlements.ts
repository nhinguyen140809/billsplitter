import { useLiveQuery } from "dexie-react-hooks";
import { settlementRepo } from "@/repositories/settlementRepo";
import type { Settlement } from "@/types";

export function useSettlements() {
    const settlementList = useLiveQuery<Settlement[]>(
        () => settlementRepo.getAllSettlements(),
        [],
    );

    const deleteSettlement = async (settlementId: string) => {
        await settlementRepo.deleteSettlement(settlementId);
    };

    const duplicateSettlement = async (settlementId: string) => {
        const newSettlementId = await settlementRepo.duplicateSettlement(settlementId);
        return newSettlementId;
    };
    
    return { settlementList, deleteSettlement, duplicateSettlement };
}
