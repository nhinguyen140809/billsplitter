import Dexie from "dexie";
import type { Table } from "dexie";

export interface Transaction {
  id?: number;
  groupId: string;
  from: string;
  to: string;
  amount: number;
}

export class BillSplitterDB extends Dexie {
  transactions!: Table<Transaction>;

  constructor() {
    super("billSplitterDB");
    this.version(1).stores({
      transactions: "++id, groupId, from, to",
    });
  }
}

export const db = new BillSplitterDB();