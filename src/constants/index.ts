import type { Settlement } from "../types";

export const DEFAULT_SETTLEMENT: Settlement = {
    id: "draft",
    name: "",
    status: "member",
    members: [],
    bills: [],
    sendPayments: {},
    receivePayments: {},
    updatedAt: new Date().toISOString(),
};