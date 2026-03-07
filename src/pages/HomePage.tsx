import SectionBill from "@/features/bill/SectionBill";
import SectionParticipant from "@/features/participants/SectionParticipant";
import SectionPayments from "@/features/payments/SectionPayments";
import type { Member } from "@/types";
import { useState } from "react";
import AppHeader from "@/components/shared/AppHeader";

export default function HomePage() {
    const [currentSection, setCurrentSection] = useState("members");
    const [members, setMembers] = useState<Member[]>([]);
    const [equalBills, setEqualBills] = useState([]);
    const [unequalBills, setUnequalBills] = useState([]);
    const [calculationState, setCalculationState] = useState(false);
    return (
        <>
            <AppHeader />
            <SectionParticipant
                members={members}
                setMembers={setMembers}
                onDone={() => setCurrentSection("bills")}
            />
            <SectionBill 
                members={members}
                equalBills={equalBills}
                setEqualBills={setEqualBills}
                unequalBills={unequalBills}
                setUnequalBills={setUnequalBills}
                currentSection={currentSection}
                onDone={() => setCurrentSection("payments")}
            />
            {/* <SectionPayments /> */}
        </>
    );
}
