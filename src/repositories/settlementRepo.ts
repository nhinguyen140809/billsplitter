import { db } from "@/db/dexie";
import type { Settlement } from "@/types";

export const settlementRepo = {
    async getDraft() {
        const draft = await db.draftSettlement.get("draft");
        return draft?.data || null;
    },

    async saveDraft(settlement: Settlement) {
        await db.draftSettlement.put({ id: "draft", data: settlement });
    },

    async clearDraft() {
        await db.draftSettlement.delete("draft");
    },

    async updateDraft(settlement: Partial<Settlement>) {
        const currentDraft = await db.draftSettlement.get("draft");

        await db.draftSettlement.update("draft", {
            data: {
                ...currentDraft?.data,
                ...settlement,
                updatedAt: new Date().toISOString(),
            } as Settlement,
        });
    },

    async createSettlement(settlement: Settlement) {
        const id = crypto.randomUUID();
        await db.settlements.add({
            ...settlement,
            id,
            updatedAt: new Date().toISOString(),
        });
        return id;
    },

    async updateSettlement(id: string, settlement: Settlement) {
        await db.settlements.update(id, {
            ...settlement,
            updatedAt: new Date().toISOString(),
        });
    },

    async getSettlement(id: string) {
        return await db.settlements.get(id);
    },

    async getAllSettlements() {
        return await db.settlements.orderBy("updatedAt").reverse().toArray();
    },

    async deleteSettlement(id: string) {
        await db.settlements.delete(id);
    },

    async duplicateSettlement(id: string) {
        const settlementToDuplicate = await db.settlements.get(id);
        if (!settlementToDuplicate) {
            throw new Error("Settlement not found");
        }
        const newSettlement = {
            ...settlementToDuplicate,
            id: crypto.randomUUID(),
            name: "Copy of " + settlementToDuplicate.name,
            updatedAt: new Date().toISOString(),
        };
        await db.settlements.add(newSettlement);
        return newSettlement.id;
    },
};
