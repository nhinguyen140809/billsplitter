import { useState } from "react";
import "./App.css";
import SectionMember from "./components/SectionMember";
import SectionBill from "./components/SectionBill";

function App() {
    const [currentSection, setCurrentSection] = useState("members");
    const [members, setMembers] = useState([]);
    const [equalBills, setEqualBills] = useState([
        {
            id: crypto.randomUUID(),
            name: "Sample Bill",
            payer: "Name",
            amount: 200,
            participants: ["Name", "Name2", "Name4", "Name3", "Name5", "Name6"],
        },
    ]);
    const [unequalBills, setUnequalBills] = useState([
        {
            id: crypto.randomUUID(),
            name: "Sample Bill",
            payer: "Name",
            amount: 0,
            shares: { name: 0, name2: 0 },
        },
    ]);

    function AppTitle() {
        return (
            <div
                className="section-container"
            >
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
            <SectionMember members={members} setMembers={setMembers} onDone={() => setCurrentSection("bills")} />
            <SectionBill members={members} equalBills={equalBills} setEqualBills={setEqualBills} unequalBills={unequalBills} setUnequalBills={setUnequalBills} onDone={() => setCurrentSection("payments")} />
        </div>
    );
}

export default App;
