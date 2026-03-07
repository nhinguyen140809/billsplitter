export interface Bill {
    id: string;
    name: string;
    amount: number;
    paidBy: string;
    splitBetween: string[];
}