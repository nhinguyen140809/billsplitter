import type { PaymentItemData, DebtPartyType, TransactionMap } from "@/types";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function PaymentItem({
    name,
    transactions,
    type,
}: PaymentItemData) {
    function PaymentItemHeader({
        name,
        type,
    }: {
        name: string;
        type: DebtPartyType;
    }) {
        return (
            <div className="flex flex-row sm:flex-col gap-4 sm:w-4/9 w-full overflow-visible">
                <div>
                    <p className="text-columbia-blue font-bold text-xl">
                        {name}
                    </p>
                </div>
                <div>
                    <p
                        className={`font-bold ${
                            type === "sender"
                                ? "bg-light-orange/30 text-light-orange"
                                : "bg-tea-green/30 text-tea-green"
                        } px-4 py-1 rounded-full w-fit`}
                    >
                        {type === "sender" ? "Sender" : "Receiver"}
                    </p>
                </div>
            </div>
        );
    }

    function TransactionItem({
        name,
        amount,
        type,
    }: {
        name: string;
        amount: string;
        type: DebtPartyType;
    }) {
        return (
            <div key={name} className="flex flex-wrap gap-2 items-center">
                {type === "sender" ? (
                    <div className="flex items-center w-6 h-6 rounded-full bg-light-orange/20 justify-center">
                        <ArrowUpRight
                            size={20}
                            strokeWidth={2.5}
                            color={"var(--color-light-orange)"}
                        />
                    </div>
                ) : (
                    <div className="flex items-center w-6 h-6 rounded-full bg-tea-green/20 justify-center">
                        <ArrowDownLeft
                            size={20}
                            strokeWidth={2.5}
                            color={"var(--color-tea-green)"}
                        />
                    </div>
                )}
                <p className="text-alice-blue">{name}:</p>
                <p className="text-columbia-blue font-medium">{amount}</p>
            </div>
        );
    }

    function TransactionList({
        transactions,
        type,
    }: {
        transactions: TransactionMap;
        type: DebtPartyType;
    }) {
        return (
            <div className="flex flex-col gap-2">
                {Object.entries(transactions).map(([name, amount]) => (
                    <TransactionItem
                        key={name}
                        name={name}
                        amount={amount}
                        type={type}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-wrap border border-columbia-blue rounded-2xl p-4 px-6 justify-start gap-4 hover:shadow-lg hover:shadow-columbia-blue/40 transition duration-400 hover:scale-102">
            <PaymentItemHeader name={name} type={type} />
            <TransactionList transactions={transactions} type={type} />
        </div>
    );
}
