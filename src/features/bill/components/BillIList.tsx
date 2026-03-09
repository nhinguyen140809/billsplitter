import { Copy, Pencil, X } from "lucide-react";
import type { Bill, BillType, BillShareValue } from "@/types";
import { Button } from "@/components/ui/button";

function BillItemHeader({ bill, type }: { bill: Bill; type: BillType }) {
    function BillItemName({ name }: { name: string }) {
        return <h3 className="text-xl font-bold text-primary py-1">{name}</h3>;
    }

    function BillItemType({ type }: { type: BillType }) {
        return (
            <p
                className={`font-bold ${
                    type === "equal"
                        ? "bg-chart-1/30 text-chart-1"
                        : "bg-chart-2/30 text-chart-2"
                } px-4 py-1 rounded-full w-fit`}
            >
                {type === "equal" ? "Equal" : "Unequal"}
            </p>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-top mb-4 gap-4 lg:gap-12">
            <BillItemName name={bill.name} />
            <BillItemType type={type} />
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
        <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-top mb-4 gap-2">
            {buttonList.map((button, index) => (
                <Button
                    key={index}
                    variant="ghost"
                    className="rounded-full w-10 h-10"
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
            <p className="text-secondary">Payer:</p>
            <p className="text-primary font-medium">{bill.payer}</p>
        </div>
    );
}

function EqualBillContent({ bill }: { bill: Bill }) {
    function BillAmount({ amount }: { amount: number }) {
        return (
            <div className="flex gap-2 mt-2">
                <p className="text-secondary">Amount:</p>
                <p className="text-primary font-medium">{amount}</p>
            </div>
        );
    }

    function BillParticipants({ shares }: { shares: BillShareValue }) {
        const participants = Object.keys(shares).filter(
            (member) => shares[member] > 0,
        );

        return (
            <div className="flex gap-2 mt-2">
                <p className="text-secondary">Participants:</p>
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
                <p className="text-secondary">Amount:</p>
                <p className="text-primary font-medium">{amount}</p>
            </div>
        );
    }

    function BillShares({ shares }: { shares: BillShareValue }) {
        return (
            <div className="mt-2">
                <p className="text-secondary mb-1">Shares:</p>
                <ul className="list-disc list-inside pl-4">
                    {Object.entries(shares).map(([member, share]) => (
                        <li key={member} className="text-primary font-medium">
                            {member}: {share}
                        </li>
                    ))}
                </ul>
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
        <div className="border border-primary rounded-2xl p-4 px-6 justify-between hover:shadow-lg hover:shadow-primary/40 transition duration-400 hover:scale-102">
            {children}
        </div>
    );
}

function BillItem({
    bill,
    type,
    onEdit,
    onDelete,
    onDuplicate,
}: {
    bill: Bill;
    type: BillType;
    onEdit: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
}) {
    return (
        <BillItemContainer>
            <div className="flex justify-between">
                <BillItemHeader bill={bill} type={type} />
                <BillItemButtons
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                />
            </div>
            <div className="flex-col flex mt-2">
                <BillItemPayer bill={bill}></BillItemPayer>
                {type === "equal" && <EqualBillContent bill={bill} />}
                {type === "unequal" && <UnequalBillContent bill={bill} />}
            </div>
        </BillItemContainer>
    );
}

function BillList({
    bills,
    type,
    onDelete,
    onEdit,
    onDuplicate,
}: {
    bills: Bill[];
    type: BillType;
    onDelete: (billId: string, type: BillType) => void;
    onEdit: (bill: Bill, type: BillType) => void;
    onDuplicate: (billId: string, type: BillType) => void;
}) {
    return bills.map((bill) => (
        <BillItem
            key={bill.id}
            bill={bill}
            type={type}
            onEdit={() => onEdit(bill, type)}
            onDelete={() => onDelete(bill.id, type)}
            onDuplicate={() => onDuplicate(bill.id, type)}
        />
    ));
}

export default BillList;
