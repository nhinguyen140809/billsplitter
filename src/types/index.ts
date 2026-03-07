export interface Member {
    id: string;
    name: string;
    paid: number;
    spent: number;
}

export interface Transaction {
    from: string;
    to: string;
    amount: number;
}

export interface Settlement {
    id: string;
    members: Member[];
    transactions: Transaction[];
}