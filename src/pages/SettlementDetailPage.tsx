import SectionBill from "@/features/bill/SectionBill";
import SectionParticipant from "@/features/participants/SectionParticipant";
import SectionPayments from "@/features/payments/SectionPayments";
import AppHeader from "@/components/shared/AppHeader";
import AppFooter from "@/components/shared/AppFooter";
import { useSettlement } from "@/hooks/useSettlement";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Copy,
    Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import Section from "@/components/shared/Section";
import { Field, FieldLabel } from "@/components/ui/field";
import Overlay from "@/components/shared/Overlay";
import { Spinner } from "@/components/ui/spinner";

function NameSection({
    onDelete,
    onClear,
    onDuplicate,
}: {
    onDelete: () => void;
    onClear: () => void;
    onDuplicate: () => void;
}) {
    const buttonList: {
        icon: React.ReactNode;
        label: string;
        onClick: () => void;
        variant: "outline" | "ghost" | "destructive";
    }[] = [
        {
            icon: <RotateCcw />,
            label: "Clear",
            onClick: onClear,
            variant: "outline",
        },
        {
            icon: <Copy />,
            label: "Duplicate",
            onClick: onDuplicate,
            variant: "outline",
        },
        {
            icon: <Trash />,
            label: "Delete",
            onClick: onDelete,
            variant: "destructive",
        },
    ];

    const { id: settlementId } = useParams();
    const { settlement, updateSettlementPartial } = settlementId
        ? useSettlement(settlementId)
        : { settlement: undefined, updateSettlementPartial: () => {} };

    return (
        <Section>
            <div className="flex justify-between items-center gap-8">
                <Field>
                    <FieldLabel htmlFor="input-settlement-name">
                        Settlement name
                    </FieldLabel>
                    <input
                        type="text"
                        placeholder="Untitled settlement"
                        id="input-settlement-name"
                        value={settlement?.name || ""}
                        onChange={(e) =>
                            updateSettlementPartial({ name: e.target.value })
                        }
                        className="w-full p-2 font-bold text-xl text-secondary outline-none border-b-2 focus:border-b-primary transition duration-200 border-b-accent"
                    />
                </Field>
                <div className="flex gap-4">
                    {buttonList.map((button, index) => (
                        <Button
                            key={index}
                            variant={button.variant}
                            className="pl-2 has-[>svg]:pr-6"
                            onClick={button.onClick}
                        >
                            {button.icon}
                            {button.label}
                        </Button>
                    ))}
                </div>
            </div>
        </Section>
    );
}

export default function SettlementDetailPage() {
    const navigate = useNavigate();
    const { id: settlementId } = useParams();

    console.log("URL id:", settlementId);

    const {
        settlement,
        updateSettlementPartial,
        deleteSettlement,
        duplicateSettlement,
        clearSettlement,
    } = settlementId
        ? useSettlement(settlementId)
        : {
              settlement: undefined,
              updateSettlementPartial: () => {},
              deleteSettlement: () => {},
              duplicateSettlement: () => {},
              clearSettlement: () => {},
          };

    console.log("Settlement from hook:", settlement);

    const [calculationState, setCalculationState] = useState<number>(0);

    const handleDuplication = async () => {
        const newSettlementId = await duplicateSettlement();
        navigate(`/settlements/${newSettlementId}`);
    };

    const [isLoading, setIsLoading] = useState(settlement === undefined);

    useEffect(() => {
        if (settlement || settlement === null) {
            setIsLoading(false);
        }
    }, [settlement]);

    return (
        <>
            <AppHeader>
                <div className="flex justify-between items-start">
                    <Button
                        variant="ghost"
                        className="pr-6 has-[>svg]:pl-2 hover:gap-3 transition-all duration-200"
                        onClick={() => navigate("/")}
                    >
                        <ChevronLeft className="size-7"/>
                        Back to Home
                    </Button>
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
            {settlement && (
                <>
                    <NameSection
                        onDelete={async () => {
                            await deleteSettlement();
                            navigate("/");
                        }}
                        onClear={clearSettlement}
                        onDuplicate={handleDuplication}
                    />

                    <SectionParticipant
                        onDone={async () =>
                            await updateSettlementPartial({ status: "bill" })
                        }
                        status={
                            settlement.status === "member"
                                ? "enabled"
                                : "disabled"
                        }
                    />

                    <SectionBill
                        onDone={async () => {
                            await updateSettlementPartial({ status: "payment" });
                            setCalculationState((prev) => prev + 1);
                        }}
                        status={
                            settlement.status !== "member"
                                ? "enabled"
                                : "disabled"
                        }
                    />

                    <SectionPayments
                        status={
                            settlement.status === "payment"
                                ? "enabled"
                                : "disabled"
                        }
                        calculationState={calculationState}
                    />
                </>
            )}

            {isLoading && (
                <Overlay className="flex-col gap-4">
                    <Spinner className="size-12" />
                    Loading ...
                </Overlay>
            )}

            {settlement === null && (
                <Section className="border-border py-6! text-center">
                    <p className="text-md text-muted-foreground">
                        Settlement not found
                    </p>
                </Section>
            )}

            <AppFooter />
        </>
    );
}
