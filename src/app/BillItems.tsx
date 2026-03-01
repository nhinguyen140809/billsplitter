import { Pencil, X } from "lucide-react";
function BillItems({
    bills,
    type,
    setEqualBills,
    setUnequalBills,
    setFormData,
    setShowForm,
    setIsEqual,
}) {
    const handleDeleteBill = (bill, type) => {
        if (type === "equal") {
            setEqualBills((prev) => prev.filter((b) => b.id !== bill.id));
        } else {
            setUnequalBills((prev) => prev.filter((b) => b.id !== bill.id));
        }
    };

    const handleEditBill = (bill, type) => {
        if (type === "equal") {
            setShowForm(true); // To avoid useEffect timing issues
            setFormData({
                id: bill.id,
                name: bill.name,
                payer: bill.payer,
                amount: bill.amount,
                shares: bill.participants.reduce((result, participant) => {
                    result[participant] = 1; // hoặc 0 tùy bạn muốn mặc định
                    return result;
                }, {}),
            });
            setIsEqual(true);
        } else {
            setShowForm(true); // To avoid useEffect timing issues
            setFormData({
                id: bill.id,
                name: bill.name,
                payer: bill.payer,
                amount: bill.amount,
                shares: { ...bill.shares },
            });
            setIsEqual(false);
        }
    };
    function BillNameType({ bill, type }) {
        return (
            <div className="flex flex-col lg:flex-row lg:items-center justify-top mb-4 gap-4 lg:gap-12">
                <h3 className="text-xl font-bold text-columbia-blue py-1">
                    {bill.name}
                </h3>
                <p
                    className={`font-bold ${
                        type === "equal"
                            ? "bg-light-orange/30 text-light-orange"
                            : "bg-tea-green/30 text-tea-green"
                    } px-4 py-1 rounded-full w-fit`}
                >
                    {type === "equal" ? "Equal" : "Unequal"}
                </p>
            </div>
        );
    }

    function ModifyBillButtons({ bill, type }) {
        return (
            <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-top mb-4 gap-2 lg:gap-4">
                <button
                    className="text-honolulu-blue hover:font-black font-extrabold transition rounded-full hover:scale-110 cursor-pointer hover:bg-honolulu-blue/40 active:bg-honolulu-blue/50 w-10 h-10 flex items-center justify-center"
                    onClick={() => handleEditBill(bill, type)}
                >
                    <Pencil size={20} />
                </button>
                <button
                    className="text-honolulu-blue hover:font-black font-extrabold transition rounded-full hover:scale-110 cursor-pointer hover:bg-honolulu-blue/40 active:bg-honolulu-blue/50 w-10 h-10 flex items-center justify-center"
                    onClick={() => handleDeleteBill(bill, type)}
                >
                    <X size={20} />
                </button>
            </div>
        );
    }

    function EqualBillAmount({ bill }) {
        return (
            <>
                <div className="flex gap-2 mt-2">
                    <p className="text-alice-blue">Amount:</p>
                    <p className="text-columbia-blue font-medium">
                        {bill.amount}
                    </p>
                </div>
                <div className="flex gap-2 mt-2">
                    <p className="text-alice-blue">Participants:</p>
                    <p className="text-columbia-blue font-medium">
                        {bill.participants.join(", ")}
                    </p>
                </div>
            </>
        );
    }
    function UnequalBillShares({ bill }) {
        return (
            <>
                <div className="flex gap-2 mt-2">
                    <p className="text-alice-blue">Amount:</p>
                    <p className="text-columbia-blue font-medium">
                        {bill.amount}
                    </p>
                </div>
                <div className="mt-2">
                    <p className="text-alice-blue mb-1">Shares:</p>
                    <ul className="list-disc list-inside pl-4">
                        {Object.entries(bill.shares).map(([member, share]) => (
                            <li
                                key={member}
                                className="text-columbia-blue font-medium"
                            >
                                {member}: {share}
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        );
    }

    return bills.map((bill) => (
        <div
            key={`${type}-${bill.id}`}
            className="flex-col border border-columbia-blue rounded-2xl p-4 px-6 justify-between hover:shadow-lg hover:shadow-columbia-blue/40 transition duration-400 hover:scale-102"
        >
            <div className="flex justify-between">
                <BillNameType bill={bill} type={type} />
                <ModifyBillButtons bill={bill} type={type} />
            </div>
            <div className="flex-col flex mt-2">
                <div className="flex gap-2">
                    <p className="text-alice-blue">Payer:</p>
                    <p className="text-columbia-blue font-medium">
                        {bill.payer}
                    </p>
                </div>
                {type === "equal" && <EqualBillAmount bill={bill} />}
                {type === "unequal" && <UnequalBillShares bill={bill} />}
            </div>
        </div>
    ));
}

export default BillItems;
