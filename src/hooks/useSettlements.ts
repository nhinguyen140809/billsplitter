import { useLiveQuery } from "dexie-react-hooks";
import { settlementRepo } from "@/repositories/settlementRepo";
import type { Settlement } from "@/types";
import { useEffect } from "react";

export function useSettlements() {
    const settlementsQuery = useLiveQuery<Settlement[]>(
        () => settlementRepo.getAllSettlements(),
        [],
    );

    const settlementList = settlementsQuery || [];

    useEffect(() => {
        if (settlementsQuery === undefined) {
            // Still loading, do nothing
            return;
        }
        if (settlementsQuery === null) {
        }
    }, [settlementsQuery]);

    const deleteSettlement = async (settlementId: string) => {
        await settlementRepo.deleteSettlement(settlementId);
    };

    const duplicateSettlement = async (settlementId: string) => {
        const newSettlementId =
            await settlementRepo.duplicateSettlement(settlementId);
        return newSettlementId;
    };

    return { settlementList, deleteSettlement, duplicateSettlement };
}
