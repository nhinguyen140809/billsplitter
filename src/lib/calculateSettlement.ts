import solver from "javascript-lp-solver";
import type { Member, Bill, BillType, PaymentData } from "@/types";
import { formatCurrency } from "./utils";

type DebtParty = {
    name: string;
    amount: number;
};

type LPSolution = {
    feasible: boolean;
    result: number;
    [variable: string]: number | boolean;
};

const shareBillList = ({
    members,
    bills,
    type,
}: {
    members: Member[];
    bills: Bill[];
    type: BillType;
}) => {
    const updatedMembers = members.map((member) => ({ ...member }));

    for (const bill of bills) {
        const { payer, amount, shares } = bill;

        if (type === "equal") {
            const shareAmount = amount / shares.length;
            for (const memberName of Object.keys(shares)) {
                const member = updatedMembers.find(
                    (m) => m.name === memberName,
                );
                if (member && shares[memberName] > 0) {
                    member.spent += shareAmount;
                }
            }
            const memberPaid = updatedMembers.find((m) => m.name === payer);
            if (memberPaid) {
                memberPaid.paid += amount;
            }
        } else if (type === "unequal") {
            for (const memberName of Object.keys(shares)) {
                const member = updatedMembers.find(
                    (m) => m.name === memberName,
                );
                if (member && shares[memberName] > 0) {
                    member.spent += shares[memberName];
                }
            }
            const memberPaid = updatedMembers.find((m) => m.name === payer);
            if (memberPaid) {
                memberPaid.paid += amount;
            }
        }
    }
    return updatedMembers;
};

const createSendersAndReceivers = (members: Member[]) => {
    const senders: DebtParty[] = [];
    const receivers: DebtParty[] = [];

    for (const member of members) {
        const diff = member.paid - member.spent;
        if (diff > 0) {
            receivers.push({ name: member.name, amount: Math.abs(diff) });
        } else if (diff < 0) {
            senders.push({ name: member.name, amount: Math.abs(diff) });
        }
    }

    return { senders, receivers };
};

const getMaxSendAmount = (senders: DebtParty[]) => {
    if (senders.length == 0) return 0;
    return Math.max(...senders.map((s) => s.amount));
};

const createModel = (senders: DebtParty[], receivers: DebtParty[]) => {
    const model: any = {
        optimize: "total_transactions",
        opType: "min",
        constraints: {},
        variables: {
            max_number_of_transactions: {
                total_transactions: 1000,
            },
        },
        ints: {},
    };

    const maxSendAmount = getMaxSendAmount(senders);

    for (const sender of senders) {
        const senderName = sender.name;

        // Amount of money that sender must send
        model.constraints[senderName] = { equal: sender.amount };

        // Number of transaction of sender
        model.constraints[`${senderName}_transactions`] = { max: 0 };

        for (const receiver of receivers) {
            const receiverName = receiver.name;

            // Amount of money that receiver must receive
            model.constraints[receiverName] = model.constraints[
                receiverName
            ] || { equal: receiver.amount };

            // Amount of money in a transaction must be non-negative
            model.constraints[`${senderName}_send_${receiverName}`] = {
                min: 0,
            };

            // Constraint binary (x_ij - M*w_ij <= 0)
            model.constraints[`${senderName}_${receiverName}`] = { max: 0 };

            // x_ij variable, which represents the amount of money that sender i sends to receiver j
            model.variables[`${senderName}_send_${receiverName}`] = {
                [senderName]: 1, // Coefficient of x_ij in sum of money sent by sender i
                [receiverName]: 1, // Coefficient of x_ij in sum of money received by receiver j
                [`${senderName}_${receiverName}`]: 1, // Coefficient of x_ij in binary constraint
            };

            // w_ij variable, which is 1 if sender i sends money to receiver j, and 0 otherwise
            model.variables[`${senderName}_${receiverName}_bin`] = {
                [`${senderName}_${receiverName}`]: -maxSendAmount, // Coefficient of w_ij in binary constraint
                [`${senderName}_total`]: 1, // Coefficient of w_ij in total transactions for sender i
                total_transactions: 1, // Coefficient of w_ij in total transactions
            };
            model.ints[`${senderName}_${receiverName}_bin`] = 1;
        }

        // Constraint total transactions for sender i
        model.variables.max_number_of_transactions[`${senderName}_total`] = -1; // Coefficient of total transactions for sender i in max_number_of_transactions variable
    }

    return model;
};

const solveModel = (model: any) => {
    const results: LPSolution = solver.Solve(model) as LPSolution;
    if (!results.feasible) {
        throw new Error("No feasible solution found");
    }
    console.log("LP Solver Results:", results);
    return results;
};

const createPaymentData = (
    senders: DebtParty[],
    receivers: DebtParty[],
    solverResult: LPSolution,
) => {
    const send: PaymentData = {};
    const receive: PaymentData = {};

    for (let sender of senders) {
        send[sender.name] = {};
    }
    for (let receiver of receivers) {
        receive[receiver.name] = {};
    }

    for (let sender of senders) {
        for (let receiver of receivers) {
            const key = `${sender.name}_send_${receiver.name}`;
            const amount = Number(solverResult[key] || 0);

            if (amount > 0) {
                send[sender.name][receiver.name] = formatCurrency(amount);
                receive[receiver.name][sender.name] = formatCurrency(amount);
            }
        }
    }

    return { sendPayments: send, receivePayments: receive };
};

export const calculateSettlement = (
    members: Member[],
    equalBills: Bill[],
    unequalBills: Bill[],
) => {
    const resetMembers = members.map((member) => ({
        ...member,
        paid: 0,
        spent: 0,
    }));

    const membersWithEqualBills = shareBillList({
        members: resetMembers,
        bills: equalBills,
        type: "equal",
    });

    const membersWithAllBills = shareBillList({
        members: membersWithEqualBills,
        bills: unequalBills,
        type: "unequal",
    });

    const { senders, receivers } =
        createSendersAndReceivers(membersWithAllBills);

    console.log("Senders:", senders);
    console.log("Receivers:", receivers);

    if (senders.length === 0 || receivers.length === 0) {
        return { membersWithAllBills, sendPayments: {}, receivePayments: {} };
    }

    const model = createModel(senders, receivers);
    const results = solveModel(model);

    console.log("Settlement results:", results);

    const { sendPayments, receivePayments } = createPaymentData(
        senders,
        receivers,
        results,
    );

    return { membersWithAllBills, sendPayments, receivePayments };
};
