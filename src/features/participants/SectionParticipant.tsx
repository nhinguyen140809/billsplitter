import { useState } from "react";
import { Check } from "lucide-react";
import Section from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import NameInput from "./components/NameInput";
import ParticipantList from "./components/ParticipantList";
import { useMembers } from "./hooks/useMembers";
import type { SectionStatus } from "@/types";
import { useParams } from "react-router-dom";

function SectionParticipant({
    onDone,
    status,
}: {
    onDone: () => void;
    status: SectionStatus;
}) {
    const { id: settlementId } = useParams();
    const { members, addMember, removeMember } = useMembers(settlementId);

    const [name, setName] = useState<string>("");
    const [inputNameError, setInputNameError] = useState<string>("");
    const isLocked = status !== "enabled";  

    const handleAddMember = () => {
        try {
            addMember(name);
        } catch (error) {
            setInputNameError((error as Error).message);
            return;
        }
        setInputNameError("");
        setName("");
    };

    const handleRemoveMember = (id: string) => {
        removeMember(id);
    };

    const handleDone = () => {
        if (members.length < 2) {
            setInputNameError("At least two members are required");
            return;
        }
        setInputNameError("");
        onDone();
    };

    return (
        <Section title="Participants">
            {!isLocked && (
                <NameInput
                    name={name}
                    setName={setName}
                    onAdd={handleAddMember}
                    inputError={inputNameError}
                />
            )}

            <ParticipantList
                members={members}
                onRemove={handleRemoveMember}
                isLocked={isLocked}
            />

            {!isLocked && (
                <div className="mt-8 justify-end flex items-center">
                    <Button
                        onClick={handleDone}
                        variant="default"
                        size="default"
                    >
                        <Check size={20} strokeWidth={2.5} />
                        Finish
                    </Button>
                </div>
            )}
        </Section>
    );
}

export { SectionParticipant };
