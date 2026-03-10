import { useEffect } from "react";
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
    setCalculationState,
}: {
    status?: SectionStatus;
    settlementId?: string;
    calculationState: Boolean;
    setCalculationState: React.Dispatch<React.SetStateAction<Boolean>>;
}) {
    const {
        sendPayments,
        receivePayments,
        updateSendPayments,
        updateReceivePayments,
    } = usePayments(settlementId);
    const { members, updateMembers } = useMembers(settlementId);
    const { bills } = useBills(settlementId);

    useEffect(() => {
        if (calculationState && status === "enabled") {
            console.log("Calculating settlements...");
            setCalculationState(false); // reset sau khi dùng

            const { membersWithAllBills, sendPayments, receivePayments } =
                calculateSettlement(members, bills);
            updateMembers(membersWithAllBills);
            updateSendPayments(sendPayments);
            updateReceivePayments(receivePayments);
        }
    }, [calculationState]);

    return (
        <Section title="Payments" status={status}>
            <div className="space-y-4 mt-4">
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
