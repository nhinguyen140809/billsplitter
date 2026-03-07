export interface BillFormData {
    id: string;
    name: string;
    payer: string;
    amount: number;
    shares: { [memberName: string]: number };
}