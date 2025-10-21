import { useRef, useState } from "react";
import "./App.css";
import SectionMember from "./components/SectionMember";
import SectionBill from "./components/SectionBill";
import SectionPayments from "./components/SectionPayments";
import { Github } from "lucide-react";

function App() {
    const [currentSection, setCurrentSection] = useState("members");
    const [members, setMembers] = useState([]);
    const [equalBills, setEqualBills] = useState([]);
    const [unequalBills, setUnequalBills] = useState([]);
    const [calculationState, setCalculationState] = useState(false);

    function AppTitle() {
        return (
            <div className="section-container glass">
                <h1 className="text-center text-5xl font-extrabold text-columbia-blue">
                    Bill Splitter
                </h1>
                <div className="flex justify-center items-center space-x-4 mt-6">
                    <a
                        href="https://github.com/nhinguyen140809/billsplitter"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-alice-blue/70 font-medium hover:text-columbia-blue/80 flex items-center active:text-columbia-blue transition"
                    >
                        <Github
                            size={20}
                            strokeWidth={2}
                            className="inline mr-2"
                        />
                        View on GitHub
                    </a>
                </div>
            </div>
        );
    }
    return (
        <div
            className="static overflow-visible min-h-screen
            flex flex-col items-center justify-start
            px-4 sm:px-8 pt-8 pb-8 space-y-8 animated-gradient"
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
