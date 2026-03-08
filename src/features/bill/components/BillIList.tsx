import { Pencil, X } from "lucide-react";
import type { Bill, BillType } from "@/types";

function BillItemHeader({ bill, type }: { bill: Bill; type: BillType }) {
    function BillItemName({ name }: { name: string }) {
        return (
            <h3 className="text-xl font-bold text-columbia-blue py-1">
                {name}
            </h3>
        );
    }

    function BillItemType({ type }: { type: BillType }) {
        return (
            <p
                className={`font-bold ${
                    type === "equal"
                        ? "bg-light-orange/30 text-light-orange"
                        : "bg-tea-green/30 text-tea-green"
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
    bill,
    type,
    onEdit,
    onDelete,
}: {
    bill: Bill;
    type: BillType;
    onEdit: (bill: Bill, type: BillType) => void;
    onDelete: (billId: string, type: BillType) => void;
}) {
    function EditBillButton({
        bill,
        type,
        onEdit,
    }: {
        bill: Bill;
        type: BillType;
        onEdit: (bill: Bill, type: BillType) => void;
    }) {
        return (
            <button
                className="text-honolulu-blue hover:font-black font-extrabold transition rounded-full hover:scale-110 cursor-pointer hover:bg-honolulu-blue/40 active:bg-honolulu-blue/50 w-10 h-10 flex items-center justify-center"
                onClick={() => onEdit(bill, type)}
            >
                <Pencil size={20} />
            </button>
        );
    }

    function DeleteBillButton({
        bill,
        type,
        onDelete,
    }: {
        bill: Bill;
        type: BillType;
        onDelete: (billId: string, type: BillType) => void;
    }) {
        return (
            <button
                className="text-honolulu-blue hover:font-black font-extrabold transition rounded-full hover:scale-110 cursor-pointer hover:bg-honolulu-blue/40 active:bg-honolulu-blue/50 w-10 h-10 flex items-center justify-center"
                onClick={() => onDelete(bill.id, type)}
            >
                <X size={20} />
            </button>
        );
    }

    return (
        <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-top mb-4 gap-2 lg:gap-4">
            <EditBillButton bill={bill} type={type} onEdit={onEdit} />
            <DeleteBillButton bill={bill} type={type} onDelete={onDelete} />
        </div>
    );
}

function BillItemPayer({ bill }: { bill: Bill }) {
    return (
        <div className="flex gap-2">
            <p className="text-alice-blue">Payer:</p>
            <p className="text-columbia-blue font-medium">{bill.payer}</p>
        </div>
    );
}

function EqualBillContent({ bill }: { bill: Bill }) {
    function BillAmount({ amount }: { amount: number }) {
        return (
            <div className="flex gap-2 mt-2">
                <p className="text-alice-blue">Amount:</p>
                <p className="text-columbia-blue font-medium">{amount}</p>
            </div>
        );
    }

    function BillParticipants({ shares }: { shares: Record<string, number> }) {
        const participants = Object.keys(shares).filter(
            (member) => shares[member] > 0,
        );

        return (
            <div className="flex gap-2 mt-2">
                <p className="text-alice-blue">Participants:</p>
                <p className="text-columbia-blue font-medium">
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
                <p className="text-alice-blue">Amount:</p>
                <p className="text-columbia-blue font-medium">{amount}</p>
            </div>
        );
    }

    function BillShares({ shares }: { shares: Record<string, number> }) {
        return (
            <div className="mt-2">
                <p className="text-alice-blue mb-1">Shares:</p>
                <ul className="list-disc list-inside pl-4">
                    {Object.entries(shares).map(([member, share]) => (
                        <li
                            key={member}
                            className="text-columbia-blue font-medium"
                        >
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

function BillItem({
    bill,
    type,
    onEdit,
    onDelete,
}: {
    bill: Bill;
    type: BillType;
    onEdit: (bill: Bill, type: BillType) => void;
    onDelete: (billId: string, type: BillType) => void;
}) {
    return (
        <div className="flex-col border border-columbia-blue rounded-2xl p-4 px-6 justify-between hover:shadow-lg hover:shadow-columbia-blue/40 transition duration-400 hover:scale-102">
            <div className="flex justify-between">
                <BillItemHeader bill={bill} type={type} />
                <BillItemButtons
                    bill={bill}
                    type={type}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
            <div className="flex-col flex mt-2">
                <BillItemPayer bill={bill}></BillItemPayer>
                {type === "equal" && <EqualBillContent bill={bill} />}
                {type === "unequal" && <UnequalBillContent bill={bill} />}
            </div>
        </div>
    );
}

function BillList({
    bills,
    type,
    onDelete,
    onEdit,
}: {
    bills: Bill[];
    type: BillType;
    onDelete: (billId: string, type: BillType) => void;
    onEdit: (bill: Bill, type: BillType) => void;
}) {
    return bills.map((bill) => (
        <BillItem
            key={bill.id}
            bill={bill}
            type={type}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    ));
}

export default BillList;
