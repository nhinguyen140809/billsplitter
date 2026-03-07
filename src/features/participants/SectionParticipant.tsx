import { useState } from "react";
import { Check } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import type { Member } from "@/types";
import NameInput from "./components/NameInput";
import ParticipantList from "./components/ParticipantList";
import { useMembers } from "./hooks/useMembers";

function SectionParticipant({
    onDone,
}: {
    members: Member[];
    setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
    onDone: () => void;
}) {
    const { members, addMember, removeMember } = useMembers();

    const [name, setName] = useState<string>("");
    const [inputNameError, setInputNameError] = useState<string | false>(false);
    const [isLocked, setIsLocked] = useState<boolean>(false);

    const handleAddMember = () => {
        try {
            addMember(name);
        } catch (error) {
            setInputNameError((error as Error).message);
            return;
        }
        setInputNameError(false);
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
        setInputNameError(false);
        setIsLocked(true);
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

export default SectionParticipant;
