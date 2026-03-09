import { useDraftSettlement } from "@/hooks/useDraftSettlement";
import { useSettlement } from "@/hooks/useSettlement";
import type { Member } from "@/types";

export function useMembers(settlementId?: string) {
    const { draft, updateDraft } = useDraftSettlement();
    const { settlement, updateSettlementPartial } = settlementId
        ? useSettlement(settlementId)
        : { settlement: undefined, updateSettlementPartial: () => {} };

    const members = settlement ? settlement.members : draft.members;

    const addMember = (name: string) => {
        if (!name) {
            throw new Error("Name cannot be empty");
        }
        if (members.some((member) => member.name === name)) {
            throw new Error("Name already exists");
        }
        const newMembers = [
            ...members,
            {
                id: crypto.randomUUID(),
                name: name,
                paid: 0,
                spent: 0,
            } as Member,
        ];
        if (settlement) {
            updateSettlementPartial({ members: newMembers });
        } else {
            updateDraft({ members: newMembers });
        }
    };

    const removeMember = (id: string) => {
        const newMembers = members.filter((member) => member.id !== id);
        if (settlement) {
            updateSettlementPartial({ members: newMembers });
        } else {
            updateDraft({ members: newMembers });
        }
    };

    const updateMembers = (newMembers: Member[]) => {
        if (settlement) {
            updateSettlementPartial({ members: newMembers });
        } else {
            updateDraft({ members: newMembers });
        }
    };

    return { members, addMember, removeMember, updateMembers };
}
