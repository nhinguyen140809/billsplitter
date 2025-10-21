import solver from "javascript-lp-solver";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

// Function to share bills among members
const shareBillList = ({ members, bills, type }) => {
    const updatedMembers = members.map((m) => ({ ...m })); // clone trước

    for (let bill of bills) {
        const payer = bill.payer;
        const amount = parseFloat(bill.amount) || 0;

        if (type === "equal") {
            const share = amount / bill.participants.length;
            for (let name of bill.participants) {
                const member = updatedMembers.find((m) => m.name === name);
                if (member) member.spent += share;
            }
            const payerMember = updatedMembers.find((m) => m.name === payer);
            if (payerMember) payerMember.paid += amount;
        } else if (type === "unequal") {
            const payerMember = updatedMembers.find((m) => m.name === payer);
            if (payerMember) payerMember.paid += amount;
            for (const [name, share] of Object.entries(bill.shares)) {
                const member = updatedMembers.find((m) => m.name === name);
                if (member) member.spent += parseFloat(share) || 0;
            }
        }
    }

    return updatedMembers.map((m) => ({
        ...m,
        paid: Math.abs(m.paid),
        spent: Math.abs(m.spent),
    }));
};

// Function to create senders and receivers lists
const createSendersAndReceivers = ({ members }) => {
    const newSenders = [];
    const newReceivers = [];

    for (let i = 0; i < members.length; i++) {
        const person = members[i];
        const diff = person.spent - person.paid;

        if (diff > 0) {
            // Spent > Paid → Sender
            newSenders.push({
                name: person.name,
                amount: diff, // hoặc formatCurrency(diff) nếu bạn muốn hiển thị tiền tệ
            });
        } else if (diff < 0) {
            // Paid > Spent → Receiver
            newReceivers.push({
                name: person.name,
                amount: Math.abs(diff),
            });
        }
    }

    return { senderList: newSenders, receiverList: newReceivers };
};

const getMaxAmount = ({ senders }) => {
    if (!senders.length) return 0;
    return Math.max(...senders.map((s) => s.amount));
};

const createModel = ({ senders, receivers }) => {
    const model = {
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

    const maxSend = getMaxAmount({ senders });

    for (let sender of senders) {
        const senderName = sender.name;

        // Tổng tiền sender phải gửi
        model.constraints[senderName] = { equal: sender.amount };
        // Tổng số giao dịch của sender
        model.constraints[`${senderName}_total`] = { max: 0 };

        for (let receiver of receivers) {
            const receiverName = receiver.name;

            // Ràng buộc tổng tiền receiver nhận
            model.constraints[receiverName] = model.constraints[
                receiverName
            ] || { equal: receiver.amount };
            // Ràng buộc không âm
            model.constraints[`${senderName}_send_${receiverName}`] = {
                min: 0,
            };
            // Ràng buộc binary (x_ij - M*w_ij <= 0)
            model.constraints[`${senderName}_${receiverName}`] = { max: 0 };

            // Biến x_ij
            model.variables[`${senderName}_send_${receiverName}`] = {
                [senderName]: 1,
                [receiverName]: 1,
                [`${senderName}_${receiverName}`]: 1,
            };

            // Biến w_ij (binary)
            model.variables[`${senderName}_${receiverName}_bin`] = {
                [`${senderName}_${receiverName}`]: -maxSend,
                [`${senderName}_total`]: 1,
                total_transactions: 1,
            };
            model.ints[`${senderName}_${receiverName}_bin`] = 1;
        }

        // Giới hạn max giao dịch mỗi người
        model.variables.max_number_of_transactions[`${senderName}_total`] = -1;
    }

    return model;
};

const solveModel = ({ model }) => {
    const result = solver.Solve(model);

    if (!result.feasible) {
        console.warn("No feasible solution found.");
        return null;
    }

    console.log("Solver result:", result);
    return result;
};

const createPaymentLists = ({
    senders,
    receivers,
    solverResult,
    setSendPayments,
    setReceivePayments,
}) => {
    if (!solverResult) return;

    const send = {};
    const receive = {};

    for (let sender of senders) {
        send[sender.name] = {};
    }
    for (let receiver of receivers) {
        receive[receiver.name] = {};
    }

    for (let sender of senders) {
        for (let receiver of receivers) {
            const key = `${sender.name}_send_${receiver.name}`;
            const amount = solverResult[key] || 0;

            if (amount > 0) {
                send[sender.name][receiver.name] = amount.toFixed(2);
                receive[receiver.name][sender.name] = amount.toFixed(2);
            }
        }
    }

    setSendPayments([send]);
    setReceivePayments([receive]);
};

const calculateSettlements = ({
    members,
    setMembers,
    equalBills,
    unequalBills,
    setSendPayments,
    setReceivePayments,
}) => {
    // Reset paid and spent amounts
    let updatedMembers = members.map((m) => ({ ...m, paid: 0, spent: 0 }));

    // Share the bills again to update paid/spent
    updatedMembers = shareBillList({
        members: updatedMembers,
        bills: equalBills,
        type: "equal",
    });
    updatedMembers = shareBillList({
        members: updatedMembers,
        bills: unequalBills,
        type: "unequal",
    });
    setMembers(updatedMembers);

    const { senderList, receiverList } = createSendersAndReceivers({
        members: updatedMembers,
    });

    console.log("Senders:", senderList);
    console.log("Receivers:", receiverList);

    if (!senderList.length || !receiverList.length) return;

    // B2: tạo model & giải
    const model = createModel({ senders: senderList, receivers: receiverList });
    const result = solveModel({ model });

    console.log("Settlement result:", result);

    // B3: tạo danh sách thanh toán
    createPaymentLists({
        senders: senderList,
        receivers: receiverList,
        solverResult: result,
        setSendPayments,
        setReceivePayments,
    });
};

function PaymentItem({ paymentList, type }) {
    //sender and receiver are just names. This function can be used for both types
    return (
        <>
            {Object.entries(paymentList).map(([senderName, receivers]) => (
                <div
                    key={senderName}
                    className="flex flex-wrap border border-columbia-blue rounded-2xl p-4 px-6 justify-start gap-4 hover:shadow-lg hover:shadow-columbia-blue/40 transition duration-400 hover:scale-102"
                >
                    {/* Sender name + type */}
                    <div className="flex flex-row sm:flex-col gap-4 sm:w-4/9 w-full overflow-visible">
                        <div>
                            <p className="text-columbia-blue font-bold text-xl">
                                {senderName}
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

                    {/* Receiver list */}
                    <div className="flex flex-col gap-2">
                        {Object.entries(receivers).map(
                            ([receiverName, amount]) => (
                                <div
                                    key={receiverName}
                                    className="flex flex-wrap gap-2 items-center"
                                >
                                    {type === "sender" ? (
                                        <div className="flex items-center w-6 h-6 rounded-full bg-light-orange/20 justify-center">
                                            <ArrowUpRight
                                                size={20}
                                                strokeWidth={2.5}
                                                color={
                                                    "var(--color-light-orange)"
                                                }
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
                                    <p className="text-alice-blue">
                                        {receiverName}:
                                    </p>
                                    <p className="text-columbia-blue font-medium">
                                        {amount}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}

function SectionPayments({
    members,
    setMembers,
    equalBills,
    unequalBills,
    currentSection,
    calculationState,
    setCalculationState,
}) {
    const [sendPayments, setSendPayments] = useState([]);
    const [receivePayments, setReceivePayments] = useState([]);

    useEffect(() => {
        if (calculationState && currentSection === "payments") {
            console.log("Calculating settlements...");
            setCalculationState(false); // reset sau khi dùng

            calculateSettlements({
                members,
                setMembers,
                equalBills,
                unequalBills,
                setSendPayments,
                setReceivePayments,
            });
        }
    }, [calculationState]);

    return (
        <div className="section-container">
            <h2 className="text-3xl font-extrabold text-columbia-blue mb-4">
                Payments
            </h2>
            <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sendPayments.map((paymentList, index) => (
                        <PaymentItem
                            key={index}
                            paymentList={paymentList}
                            type="sender"
                        />
                    ))}
                    {receivePayments.map((paymentList, index) => (
                        <PaymentItem
                            key={index}
                            paymentList={paymentList}
                            type="receiver"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SectionPayments;
