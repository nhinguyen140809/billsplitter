import { useSettlements } from "@/hooks/useSettlements";
import { useNavigate } from "react-router-dom";
import type { Settlement } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy, Pencil, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import AppHeader from "@/components/shared/AppHeader";
import AppFooter from "@/components/shared/AppFooter";
import Section from "@/components/shared/Section";
import { ChevronLeft } from "lucide-react";

function SettlementItem({
    settlement,
    onEdit,
    onDelete,
    onDuplicate,
}: {
    settlement: Settlement;
    onEdit: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
}) {
    function SettlementItemHeader({ settlement }: { settlement: Settlement }) {
        return (
            <h3 className="text-lg font-bold text-primary py-1 break-all hyphens-auto">
                {settlement.name || "Untitled Settlement"}
            </h3>
        );
    }

    function SettlementItemButtons({
        onEdit,
        onDelete,
        onDuplicate,
    }: {
        onEdit: () => void;
        onDelete: () => void;
        onDuplicate: () => void;
    }) {
        const buttonList: { icon: React.ReactNode; onClick: () => void }[] = [
            { icon: <X />, onClick: onDelete },
            { icon: <Copy />, onClick: onDuplicate },
            { icon: <Pencil />, onClick: onEdit },
        ];
        return (
            <div className="flex flex-col items-center justify-top mb-4 gap-1">
                {buttonList.map((button, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        className="rounded-full size-10"
                        onClick={button.onClick}
                    >
                        {button.icon}
                    </Button>
                ))}
            </div>
        );
    }

    function SettlementItemContent({ settlement }: { settlement: Settlement }) {
        return (
            <div className="flex flex-col items-start justify-top mb-2 gap-2">
                <p className="font-medium text-sm text-muted-foreground">
                    Updated at: {formatDate(settlement.updatedAt)}
                </p>
            </div>
        );
    }

    return (
        <div className="border border-primary rounded-2xl p-4 pl-6 hover:shadow-lg hover:shadow-primary/40 transition duration-400 hover:scale-102 h-full flex flex-row">
            <div className="flex-1 w-auto">
                <SettlementItemHeader settlement={settlement} />
                <SettlementItemContent settlement={settlement} />
            </div>
            <SettlementItemButtons
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
            />
        </div>
    );
}

export default function SettlementsPage() {
    const { settlementList, deleteSettlement, duplicateSettlement } =
        useSettlements();
    const navigate = useNavigate();

    return (
        <>
            <AppHeader>
                <div className="flex flex-col sm:flex-row justify-start items-start gap-4">
                    <Button
                        variant="ghost"
                        className="pr-6 has-[>svg]:pl-2 hover:gap-3 transition-all duration-200"
                        onClick={() => navigate("/")}
                    >
                        <ChevronLeft className="size-7" />
                        Back to Home
                    </Button>
                </div>
            </AppHeader>

            <Section title="My Settlements">
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {settlementList.length === 0 && (
                        <p className="text-muted-foreground text-center mt-4 col-span-full">
                            No settlements found. Create a new one from the home
                            page!
                        </p>
                    )}
                    {settlementList.map((settlement) => (
                        <motion.div
                            key={settlement.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-full flex flex-col"
                        >
                            <SettlementItem
                                key={settlement.id}
                                settlement={settlement}
                                onEdit={() =>
                                    navigate(`/settlements/${settlement.id}`)
                                }
                                onDelete={() => deleteSettlement(settlement.id)}
                                onDuplicate={() =>
                                    duplicateSettlement(settlement.id)
                                }
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </Section>
            <AppFooter />
        </>
    );
}
