import { useEffect, useState } from "react";
import { calculateSettlement } from "@/lib/calculateSettlement";
import { usePayments } from "./hooks/usePayments";
import { useMembers } from "../participants/hooks/useMembers";
import { useBills } from "../bill/hooks/useBills";
import type { SectionStatus } from "@/types";
import { Section } from "@/components/shared/Section";
import PaymentItem from "./components/PaymentItem";

function SectionPayments({
    status,
    settlementId,
    calculationState,
}: {
    status?: SectionStatus;
    settlementId?: string;
    calculationState: number;
}) {
    const {
        sendPayments,
        receivePayments,
        updateSendPayments,
        updateReceivePayments,
    } = usePayments(settlementId);
    const { members, updateMembers } = useMembers(settlementId);
    const { bills } = useBills(settlementId);
    const [calculationError, setCalculationError] = useState<string>("");

    useEffect(() => {
        if (members.length === 0 || bills.length === 0) {
            return;
        }
        
        console.log("Calculating settlements...");

        try {
            const { membersWithAllBills, sendPayments, receivePayments } =
                calculateSettlement(members, bills);

            updateMembers(membersWithAllBills);
            updateSendPayments(sendPayments);
            updateReceivePayments(receivePayments);
        } catch (error) {
            console.error("Error calculating settlement:", error);
            setCalculationError(
                "Failed to calculate settlements. Please check the bills and members data.",
            );
            return;
        }
        setCalculationError("");
    }, [calculationState]);

    return (
        <Section title="Payments" status={status}>
            <div className="space-y-4 mt-4">
                {calculationError && (
                    <div className="text-destructive text-sm">
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
    );
}

export default SectionPayments;
