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
            <div className="flex flex-row @[250px]:flex-col gap-4 overflow-visible">
                <div>
                    <p className="text-primary font-bold text-base sm:text-lg break-all">{name}</p>
                </div>
                <div>
                    <p
                        className={`font-bold text-sm ${
                            type === "sender"
                                ? "bg-chart-3/20 text-chart-3"
                                : "bg-chart-2/20 text-chart-2"
                        } sm:px-4 py-1 px-3 rounded-full w-fit`}
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
            <div key={name} className="flex flex-wrap gap-2 items-center text-sm">
                {type === "sender" ? (
                    <div className="flex items-center sm:size-6 size-5 rounded-full bg-chart-3/20 text-chart-3 justify-center">
                        <ArrowUpRight
                            strokeWidth={2.5}
                            className="size-4 sm:size-5"
                        />
                    </div>
                ) : (
                    <div className="flex items-center sm:size-6 size-5 rounded-full bg-chart-2/20 text-chart-2 justify-center">
                        <ArrowDownLeft
                            strokeWidth={2.5}
                            className="size-4 sm:size-5"
                        />
                    </div>
                )}
                <p className="text-muted-foreground break-all">{name}:</p>
                <p className="text-primary font-medium break-all">{amount}</p>
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
        <div className="@container flex flex-wrap border border-primary rounded-2xl p-4 sm:px-6 justify-start gap-4 hover:shadow-lg hover:shadow-primary/40 transition duration-400 hover:scale-102">
            <PaymentItemHeader name={name} type={type} />
            <TransactionList transactions={transactions} type={type} />
        </div>
    );
}
