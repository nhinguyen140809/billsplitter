const handleAddBill = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Adding bill...", { formData });
    e.preventDefault();
    const { id, name, payer, amount, shares } = formData;
    if (!payer) {
        setErrorMessage("Please select a payer.");
        return;
    }
    if (isEqual && (!amount || amount < 0)) {
        setErrorMessage("Please fill in all fields correctly.");
        return;
    }
    let billName = name;
    if (!billName.trim()) {
        billName = "Bill #" + Math.floor(Math.random() * 1000);
    }
    const selectedParticipants = Object.keys(shares).filter(
        (memberName) => shares[memberName] > 0, // For both case (unequal and equal)
    );
    const hasNegativeShare = Object.values(shares).some((value) => value < 0);
    if (hasNegativeShare) {
        setErrorMessage("Invalid amount: shares cannot be negative.");
        return;
    }
    if (selectedParticipants.length === 0) {
        setErrorMessage("Please select at least one participant.");
        return;
    }
    if (isEqual) {
        if (id !== "") {
            // Editing existing bill
            setEqualBills((prev) =>
                prev.map((bill) =>
                    bill.id === id
                        ? {
                              ...bill,
                              name: billName,
                              payer: payer,
                              amount: amount,
                              participants: selectedParticipants,
                          }
                        : bill,
                ),
            );
            setUnequalBills((prev) => prev.filter((bill) => bill.id !== id)); // Remove from unequal bills if exists
        } else {
            // Adding new bill
            const newBill = {
                id: crypto.randomUUID(),
                name: billName,
                payer: payer,
                amount: amount,
                participants: selectedParticipants,
            };
            setEqualBills((prev) => [...prev, newBill]);
        }
    } else {
        const totalShares = selectedParticipants.reduce(
            (sum, member) => sum + (shares[member] || 0),
            0,
        );
        if (totalShares === 0) {
            setErrorMessage("Please assign shares to participants.");
            return;
        }
        if (id !== "") {
            // Editing existing bill
            setUnequalBills((prev) =>
                prev.map((bill) =>
                    bill.id === id
                        ? {
                              ...bill,
                              name: billName,
                              payer: payer,
                              amount: totalShares,
                              shares: selectedParticipants.reduce(
                                  (obj, member) => ({
                                      ...obj,
                                      [member]: shares[member] || 0,
                                  }),
                                  {},
                              ),
                          }
                        : bill,
                ),
            );
            setEqualBills((prev) => prev.filter((bill) => bill.id !== id)); // Remove from equal bills if exists
        } else {
            // Adding new bill
            const newBill = {
                id: crypto.randomUUID(),
                name: billName,
                payer: payer,
                amount: totalShares,
                shares: selectedParticipants.reduce(
                    (obj, member) => ({
                        ...obj,
                        [member]: shares[member] || 0,
                    }),
                    {},
                ),
            };
            setUnequalBills((prev) => [...prev, newBill]);
        }
    }
    // After adding or editing, reset form and close popup
    resetForm();
    setShowForm(false);
    setIsEqual(true);
    setSelectedAll(false);
};
