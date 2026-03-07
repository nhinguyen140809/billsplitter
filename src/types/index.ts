export interface Member {
    id: string;
    name: string;
    paid: number;
    spent: number;
}

export interface Bill {
    id: string;
    name: string;
    payer: string;
    amount: number;
    shares: { [memberName: string]: number };
}

export interface Transaction {
    from: string;
    to: string;
    amount: number;
}

export interface Settlement {
    id: string;
    name: string;
    status: SettlementStatus;
    members: Member[];
    equalBills: Bill[];
    unequalBills: Bill[];
    transactions: Transaction[];
    updatedAt: string;
}

export type SettlementInput = Omit<Settlement, "id" | "updatedAt">;

export type SettlementStatus = "member" | "bill" | "payment";

export type BillType = "equal" | "unequal";

export interface DraftSettlement {
    id: "draft";
    data: Settlement;
}