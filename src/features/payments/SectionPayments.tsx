import { useEffect, useState } from "react";
import { calculateSettlement } from "@/lib/calculateSettlement";
import { usePayments } from "./hooks/usePayments";
import { useMembers } from "@/features/participants";
import { useBills } from "@/features/bill";
import type { SectionStatus } from "@/types";
import Section from "@/components/shared/Section";
import PaymentItem from "./components/PaymentItem";
import Overlay from "@/components/shared/Overlay";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "react-router-dom";

function SectionPayments({
    status,
    calculationState,
}: {
    status?: SectionStatus;
    calculationState: number;
}) {
    const { id: settlementId } = useParams();
    const { sendPayments, receivePayments, updatePayments } =
        usePayments(settlementId);
    const { members, updateMembers } = useMembers(settlementId);
    const { bills } = useBills(settlementId);

    
    const [calculationError, setCalculationError] = useState<string>("");
    const [isCalculating, setIsCalculating] = useState<Boolean>(false);

    useEffect(() => {
        if (members.length === 0 || bills.length === 0) {
            return;
        }

        const calculate = async () => {
            setIsCalculating(true);
            console.log("Calculating settlements...");

            try {
                const {
                    membersWithAllBills,
                    sendPayments: send,
                    receivePayments: receive,
                } = calculateSettlement(members, bills);

                updateMembers(membersWithAllBills);
                updatePayments(send, receive);
            } catch (error) {
                console.error("Error calculating settlement:", error);
                setCalculationError(
                    "Failed to calculate settlements. Please check the bills and members data.",
                );
                return;
            } finally {
                setIsCalculating(false);
                setCalculationError("");
            }
        };

        calculate();
    }, [calculationState]);

    return (
        <>
            <Section title="Payments" status={status}>
                <div className="space-y-4 mt-4">
                    {calculationError && (
                        <div className="text-destructive text-xs sm:text-sm">
                            {calculationError}
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(sendPayments).map(
                            ([name, transactionMap]) => (
                                <PaymentItem
                                    key={name}
                                    name={name}
                                    transactions={transactionMap}
                                    type="sender"
                                />
                            ),
                        )}
                        {Object.entries(receivePayments).map(
                            ([name, transactionMap]) => (
                                <PaymentItem
                                    key={name}
                                    name={name}
                                    transactions={transactionMap}
                                    type="receiver"
                                />
                            ),
                        )}
                    </div>
                </div>
            </Section>
            {isCalculating && (
                <Overlay className="flex flex-col items-center">
                    <Spinner className="size-10 sm:size-12"/>
                    Processing ...
                </Overlay>
            )}
        </>
    );
}

export { SectionPayments };
