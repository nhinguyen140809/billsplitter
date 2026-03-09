import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Member } from "@/types";

function ParticipantItem({
    member,
    onRemove,
    isLocked,
}: {
    member: Member;
    onRemove: (id: string) => void;
    isLocked: boolean;
}) {
    return (
        <div className="flex items-center bg-primary text-primary-foreground font-medium px-4 has-[button]:pr-2 has-[button]:pl-4 [&>svg]:size-4 py-2 gap-1 rounded-full hover:shadow-md shadow-primary/40 transition hover:scale-105">
            <span>{member.name}</span>
            {!isLocked && (
                <Button
                    onClick={() => onRemove(member.id)}
                    variant="ghost"
                    size="icon-xs"
                    className="rounded-full"
                >
                    <X/>
                </Button>
            )}
        </div>
    );
}

export default function ParticipantList({
    members,
    onRemove,
    isLocked,
}: {
    members: Member[];
    onRemove: (id: string) => void;
    isLocked: boolean;
}) {
    return (
        <div className="flex flex-wrap gap-4 mt-4 transition-all duration-200">
            {members.map((member) => (
                <ParticipantItem
                    key={member.id}
                    member={member}
                    onRemove={onRemove}
                    isLocked={isLocked}
                />
            ))}
        </div>
    );
}
