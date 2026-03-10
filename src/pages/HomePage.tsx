import SectionBill from "@/features/bill/SectionBill";
import SectionParticipant from "@/features/participants/SectionParticipant";
import SectionPayments from "@/features/payments/SectionPayments";
import AppHeader from "@/components/shared/AppHeader";
import { useDraftSettlement } from "@/hooks/useDraftSettlement";
import { Button } from "@/components/ui/button";
import { ChevronRight, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function HomePage() {
    const { draft, saveDraft, clearDraft } = useDraftSettlement();
    const [ calculationState, setCalculationState] = useState<Boolean>(false);
    const navigate = useNavigate();
    return (
        <>
            <AppHeader>
                <Button variant="secondary" onClick={clearDraft}>
                    <RotateCcw /> Clear
                </Button>
                <Button
                    variant="ghost"
                    className="pl-6 has-[>svg]:pr-2"
                    onClick={() => navigate("/settlements")}
                >
                    View saved settlements
                    <ChevronRight />
                </Button>
            </AppHeader>


            <SectionParticipant
                onDone={() => saveDraft({ ...draft, status: "bill" })}
                status={draft.status === "member" ? "enabled" : "disabled"}
            />
            

            <SectionBill
                onDone={() => {
                    saveDraft({ ...draft, status: "payment" });
                    setCalculationState(true); // trigger tính toán khi hoàn thành phần bill
                }}
                status={draft.status !== "member" ? "enabled" : "disabled"}
            />
            
            
            <SectionPayments
                status={draft.status === "payment" ? "enabled" : "disabled"}
                calculationState={calculationState}
                setCalculationState={setCalculationState}
            />
        </>
    );
}
