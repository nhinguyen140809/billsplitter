import SectionBill from "@/features/bill/SectionBill";
import SectionParticipant from "@/features/participants/SectionParticipant";
import SectionPayments from "@/features/payments/SectionPayments";
import AppHeader from "@/components/shared/AppHeader";
import AppFooter from "@/components/shared/AppFooter";
import { useDraftSettlement } from "@/hooks/useDraftSettlement";
import { Button } from "@/components/ui/button";
import { ChevronRight, RotateCcw, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Section from "@/components/shared/Section";

export default function HomePage() {
    const { draft, saveDraft, clearDraft, createSettlementFromDraft } =
        useDraftSettlement();
    const [calculationState, setCalculationState] = useState<number>(0);
    const navigate = useNavigate();

    const handleSaveDraft = async () => {
        const newSettlementId = await createSettlementFromDraft();
        navigate("/settlements/" + newSettlementId);
    };
    return (
        <>
            <AppHeader />
            <Section className="border-border py-6!">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-4">
                        <Button variant="secondary" onClick={clearDraft}>
                            <RotateCcw strokeWidth={2.5} /> Clear
                        </Button>
                        <Button
                            onClick={handleSaveDraft}
                        >
                            <Save /> Save
                        </Button>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="ghost"
                            className="pl-6 has-[>svg]:pr-2 hover:gap-3 transition-all duration-200"
                            onClick={() => navigate("/settlements")}
                        >
                            My settlements
                            <ChevronRight className="size-6" />
                        </Button>
                    </div>
                </div>
            </Section>

            <SectionParticipant
                onDone={() => saveDraft({ ...draft, status: "bill" })}
                status={draft.status === "member" ? "enabled" : "disabled"}
            />

            <SectionBill
                onDone={() => {
                    saveDraft({ ...draft, status: "payment" });
                    setCalculationState((prev) => prev + 1); // trigger tính toán khi hoàn thành phần bill
                }}
                status={draft.status !== "member" ? "enabled" : "disabled"}
            />

            <SectionPayments
                status={draft.status === "payment" ? "enabled" : "disabled"}
                calculationState={calculationState}
            />

            <AppFooter />
        </>
    );
}
