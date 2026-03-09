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
    shares: BillShareValue;
}

export type BillShareValue = Record<string, number>;

export type TransactionMap = Record<string, string>;

export type PaymentData = Record<string, TransactionMap>;

export type PaymentItemData = {
    name: string;
    transactions: TransactionMap;
    type: DebtPartyType;
};

export interface Settlement {
    id: string;
    name: string;
    status: SettlementStatus;
    members: Member[];
    equalBills: Bill[];
    unequalBills: Bill[];
    sendPayments: PaymentData;
    receivePayments: PaymentData;
    updatedAt: string;
}

export type BillFormData = {
    id: string;
    name: string;
    payer: string;
    amount: string;
    shares: Record<string, string>;
};

export type SettlementInput = Omit<Settlement, "id" | "updatedAt">;

export type SettlementStatus = "member" | "bill" | "payment";

export type BillType = "equal" | "unequal";

export type SectionStatus = "enabled" | "disabled";

export type DebtPartyType = "sender" | "receiver";

export interface DraftSettlement {
    id: "draft";
    data: Settlement;
}