import SectionBill from "@/features/bill/SectionBill";
import SectionParticipant from "@/features/participants/SectionParticipant";
import SectionPayments from "@/features/payments/SectionPayments";
import AppHeader from "@/components/shared/AppHeader";
import AppFooter from "@/components/shared/AppFooter";
import { useDraftSettlement } from "@/hooks/useDraftSettlement";
import { Button } from "@/components/ui/button";
import { ChevronRight, RotateCcw, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Section from "@/components/shared/Section";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import type { Settlement } from "@/types";

function SaveSettlementDialog({ onSave }: { onSave: (name: string) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSaveClick = () => {
        if (inputRef.current) {
            const name = inputRef.current.value;
            onSave(name);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Save /> Save
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Save settlement</DialogTitle>
                </DialogHeader>
                <Field>
                    <Input
                        placeholder="Settlement name"
                        ref={inputRef}
                        className="text-sm my-2 font-medium focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0 focus-visible:ring-offset-background"
                    />
                </Field>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className="text-sm">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSaveClick} className="text-sm">
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function HomePage() {
    const { draft, saveDraft, clearDraft, createSettlementFromDraft } =
        useDraftSettlement();

    const [calculationState, setCalculationState] = useState<number>(0);
    const navigate = useNavigate();

    const handleCreatSettlementFromDraft = async (name: string) => {
        const updatedDraft: Settlement = { ...draft, name: name };

        const newSettlementId = await createSettlementFromDraft(updatedDraft);

        navigate("/settlements/" + newSettlementId);
    };

    return (
        <>
            <AppHeader>
                <div className="flex justify-end items-end">
                    <Button
                        variant="ghost"
                        className="pl-6 has-[>svg]:pr-2 hover:gap-3 transition-all duration-200"
                        onClick={() => navigate("/settlements")}
                    >
                        My settlements
                        <ChevronRight className="size-7" />
                    </Button>
                </div>
            </AppHeader>
            <Section className="border-border py-6!">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button variant="secondary" onClick={clearDraft}>
                        <RotateCcw strokeWidth={2.5} /> Clear
                    </Button>
                    <SaveSettlementDialog
                        onSave={handleCreatSettlementFromDraft}
                    />
                </div>
            </Section>

            <SectionParticipant
                onDone={async () => {
                    await saveDraft({ ...draft, status: "bill" } as Settlement);
                }}
                status={draft.status === "member" ? "enabled" : "disabled"}
            />

            <SectionBill
                onDone={async () => {
                    await saveDraft({ ...draft, status: "payment" } as Settlement);
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
