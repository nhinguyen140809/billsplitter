import SectionBill from "@/features/bill/SectionBill";
import SectionParticipant from "@/features/participants/SectionParticipant";
import SectionPayments from "@/features/payments/SectionPayments";
import type { Member } from "@/types";
import { useState } from "react";
import AppHeader from "@/components/shared/AppHeader";
import { useDraftSettlement } from "@/hooks/useDraftSettlement";

export default function HomePage() {
    const { draft, saveDraft, updateDraft, clearDraft } = useDraftSettlement();
    const [calculationState, setCalculationState] = useState(false);
    return (
        <>
            <AppHeader />
            <SectionParticipant
                members={draft.members}
                updateMembers={(members: Member[]) =>
                    saveDraft({ ...draft, members })
                }
                onDone={() =>
                    saveDraft({ ...draft, status: "bill" })
                }
            />
            {/* <SectionBill 
                members={draftSettlement.members}
                equalBills={draftSettlement.equalBills}
                unequalBills={draftSettlement.unequalBills}
                setUnequalBills={(unequalBills) => setDraftSettlement({ ...draftSettlement, unequalBills })}
                currentSection={draftSettlement.status}
                onDone={() => setDraftSettlement({ ...draftSettlement, status: "payment" })}
            />*/}
            {/* <SectionPayments /> */}
        </>
    );
}
