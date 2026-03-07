import { useLiveQuery } from "dexie-react-hooks";
import { settlementRepo } from "@/repositories/settlementRepo";
import type { Settlement } from "@/types";

export function useSettlements() {
    const settlementList = useLiveQuery<Settlement[]>(
        () => settlementRepo.getAllSettlements(),
        [],
    );

    return settlementList;
}
