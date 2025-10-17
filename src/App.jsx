import { useRef, useState } from "react";
import "./App.css";
import SectionMember from "./components/SectionMember";
import SectionBill from "./components/SectionBill";
import SectionPayments from "./components/SectionPayments";

function App() {
    const [currentSection, setCurrentSection] = useState("members");
    const [members, setMembers] = useState([]);
    const [equalBills, setEqualBills] = useState([]);
    const [unequalBills, setUnequalBills] = useState([]);
    const [calculationState, setCalculationState] = useState(false);

    function AppTitle() {
        return (
            <div className="section-container">
                <h1 className="text-center text-5xl font-extrabold text-columbia-blue">
                    Bill Splitter
                </h1>
                <p className="text-center text-alice-blue mt-4">
                    This is a sample application using Tailwind CSS with a
                    custom color palette.
                </p>
            </div>
        );
    }
    return (
        <div
            className="min-h-screen bg-rich-black 
            flex flex-col items-center justify-start
            px-4 sm:px-8 pt-8 pb-8 space-y-8"
        >
            <AppTitle />
            <SectionMember
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
                onDone={() => {
                    setCurrentSection("payments");
                    setCalculationState(true);
                }}
                currentSection={currentSection}
            />
            <SectionPayments
                members={members}
                setMembers={setMembers}
                equalBills={equalBills}
                unequalBills={unequalBills}
                currentSection={currentSection}
                calculationState={calculationState}
                setCalculationState={setCalculationState}
            />
        </div>
    );
}

export default App;
