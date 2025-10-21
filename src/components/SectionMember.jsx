import { useState, useRef, useEffect } from "react";
import { X, Plus, Check } from "lucide-react";

function SectionMember({ members, setMembers, onDone }) {
    const [name, setName] = useState("");
    const [inputNameError, setInputNameError] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleAddMember = () => {
        if (name) {
            for (let member of members) {
                if (member.name === name) {
                    setInputNameError("Name already exists");
                    return;
                }
            }
            setInputNameError(false);
            setMembers([
                ...members,
                { id: crypto.randomUUID(), name: name, paid: 0, spent: 0 },
            ]);
            setName("");
        } else {
            setInputNameError("Name cannot be empty");
        }
    };

    const handleRemoveMember = (id) => {
        setMembers((prev) => prev.filter((member) => member.id !== id));
    };

    const handleEnterKeyDown = (e) => {
        if (e.key === "Enter") {
            handleAddMember();
        }
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
        <div className="section-container">
            <h2 className="text-3xl font-extrabold text-columbia-blue mb-4">
                Members
            </h2>
            {!isLocked && (
                <div className="flex sm:flex-row items-center mb-2 pt-2 pb-2">
                    <input
                        type="text"
                        ref={inputRef}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleEnterKeyDown}
                        className="border border-columbia-blue rounded-full p-2 pl-4 mr-2 text-alice-blue flex-grow bg-oxford-blue focus:outline-none focus:ring-1 focus:ring-columbia-blue"
                        placeholder="Enter member name"
                    />
                    <button
                        onClick={handleAddMember}
                        className="tonal-button w-10 h-10 px-0 py-0"
                    >
                        <Plus
                            size={20}
                            strokeWidth={2.5}
                            color={"var(--color-alice-blue)"}
                        />
                    </button>
                </div>
            )}

            {inputNameError && (
                <p className="text-tea-rose pb-2">{inputNameError}</p>
            )}

            <div className="flex flex-wrap gap-4 mt-4 transition-all duration-200">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center bg-columbia-blue text-rich-black font-medium px-4 py-2 gap-3 rounded-full hover:shadow-md shadow-columbia-blue/40 transition hover:scale-105"
                    >
                        <span>{member.name}</span>
                        {!isLocked && (
                            <button
                                onClick={() => handleRemoveMember(member.id)}
                                className="text-honolulu-blue hover:font-black font-extrabold transition rounded-full hover:scale-110 cursor-pointer hover:bg-honolulu-blue/40 w-6 h-6 flex items-center justify-center"
                            >
                                <X
                                    size={20}
                                    strokeWidth={2.5}
                                    color={"var(--color-honolulu-blue)"}
                                />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {!isLocked && (
                <div className="mt-8 justify-end flex items-center">
                    <button
                        onClick={handleDone}
                        className="fill-button shadow-columbia-blue/35 shadow-lg"
                    >
                        <Check
                            size={20}
                            strokeWidth={2.5}
                            color={"var(--color-oxford-blue)"}
                            className="inline mr-2"
                        />
                        Finish
                    </button>
                </div>
            )}
        </div>
    );
}

export default SectionMember;
