import { Copy, Pencil, X } from "lucide-react";
import type { Bill, BillType, BillShareValue } from "@/types";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

function BillItemHeader({ bill }: { bill: Bill }) {
    function BillItemName({ name }: { name: string }) {
        return <h3 className="text-lg font-bold text-primary py-1">{name}</h3>;
    }

    function BillItemType({ type }: { type: BillType }) {
        return (
            <p
                className={`font-bold text-sm ${
                    type === "equal"
                        ? "bg-chart-2/20 text-chart-2"
                        : "bg-chart-3/20 text-chart-3"
                } px-4 py-1 rounded-full w-fit`}
            >
                {type === "equal" ? "Equal" : "Unequal"}
            </p>
        );
    }

    return (
        <div className="flex flex-col items-start justify-top mb-2 gap-2">
            <BillItemName name={bill.name} />
            <BillItemType type={bill.type} />
        </div>
    );
}

function BillItemButtons({
    onEdit,
    onDelete,
    onDuplicate,
}: {
    onEdit: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
}) {
    const buttonList: { icon: React.ReactNode; onClick: () => void }[] = [
        { icon: <Pencil />, onClick: onEdit },
        { icon: <Copy />, onClick: onDuplicate },
        { icon: <X />, onClick: onDelete },
    ];

    return (
        <div className="flex flex-row items-center justify-top mb-4 gap-1">
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

function BillItemPayer({ bill }: { bill: Bill }) {
    return (
        <div className="flex gap-2">
            <p className="text-muted-foreground">Payer:</p>
            <p className="text-primary font-medium">{bill.payer}</p>
        </div>
    );
}

function EqualBillContent({ bill }: { bill: Bill }) {
    function BillAmount({ amount }: { amount: number }) {
        return (
            <div className="flex gap-2 mt-2">
                <p className="text-muted-foreground">Amount:</p>
                <p className="text-primary font-medium">{formatCurrency(amount)}</p>
            </div>
        );
    }

    function BillParticipants({ shares }: { shares: BillShareValue }) {
        const participants = Object.keys(shares).filter(
            (member) => shares[member] > 0,
        );

        return (
            <div className="flex gap-2 mt-2">
                <p className="text-muted-foreground">Participants:</p>
                <p className="text-primary font-medium">
                    {participants.join(", ")}
                </p>
            </div>
        );
    }

    return (
        <>
            <BillAmount amount={bill.amount} />
            <BillParticipants shares={bill.shares} />
        </>
    );
}

function UnequalBillContent({ bill }: { bill: Bill }) {
    function BillAmount({ amount }: { amount: number }) {
        return (
            <div className="flex gap-2 mt-2">
                <p className="text-muted-foreground">Amount:</p>
                <p className="text-primary font-medium">{formatCurrency(amount)}</p>
            </div>
        );
    }

    function BillShares({ shares }: { shares: BillShareValue }) {
        return (
            <div className="mt-2">
                <p className="text-muted-foreground mb-1">Shares:</p>
                <div className="grid grid-cols-[max-content_max-content] gap-x-5 pl-4">
                    {Object.entries(shares).map(([member, share]) => (
                        <>
                            <span
                                className="text-primary font-medium"
                                key={member}
                            >
                                {member}
                            </span>
                            <span
                                className="text-primary font-medium text-right"
                                key={`${member}_${share}"`}
                            >
                                {formatCurrency(share)}
                            </span>
                        </>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <BillAmount amount={bill.amount} />
            <BillShares shares={bill.shares} />
        </>
    );
}

function BillItemContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="border border-primary rounded-2xl p-4 pl-6 hover:shadow-lg hover:shadow-primary/40 transition duration-400 hover:scale-102 h-full flex flex-col">
            {children}
        </div>
    );
}

function BillItem({
    bill,
    onEdit,
    onDelete,
    onDuplicate,
}: {
    bill: Bill;
    onEdit: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
}) {
    return (
        <BillItemContainer>
            <div className="flex justify-between items-start">
                <BillItemHeader bill={bill} />
                <BillItemButtons
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                />
            </div>
            <div className="flex-col flex mt-2 text-sm">
                <BillItemPayer bill={bill}></BillItemPayer>
                {bill.type === "equal" && <EqualBillContent bill={bill} />}
                {bill.type === "unequal" && <UnequalBillContent bill={bill} />}
            </div>
        </BillItemContainer>
    );
}

function BillList({
    bills,
    onDelete,
    onEdit,
    onDuplicate,
}: {
    bills: Bill[];
    onDelete: (billId: string) => void;
    onEdit: (bill: Bill) => void;
    onDuplicate: (billId: string) => void;
}) {
    return (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-stretch">
            {bills.map((bill) => (
                <motion.div
                    key={bill.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col"
                >
                    <BillItem
                        key={bill.id}
                        bill={bill}
                        onEdit={() => onEdit(bill)}
                        onDelete={() => onDelete(bill.id)}
                        onDuplicate={() => onDuplicate(bill.id)}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}

export default BillList;
