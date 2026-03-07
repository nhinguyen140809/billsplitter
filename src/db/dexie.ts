import Dexie from "dexie";
import type { Table } from "dexie";
import type { DraftSettlement, Settlement } from "@/types";

export class BillSplitterDB extends Dexie {
    settlements!: Table<Settlement>;
    draftSettlement!: Table<DraftSettlement>;

    constructor() {
        super("billSplitterDB");
        this.version(1).stores({
            settlements: "id, updatedAt",
			draftSettlement: "id",
        });
    }
}

export const db = new BillSplitterDB();
