var equal_payment_list = [];
var unequal_payment_list = [];

let open_calculator_from = undefined;
let bill_mode = 'equal';
let shareGroup = undefined;
let billIndex = 1;
let billId = 1;

class EqualPayment {
    id = '';
    name = '';
    paid_by = '';
    paid_for = [];
    amount = 0;
    constructor(id, name, paid_by, paid_for, amount) {
        this.id = id;
        this.name = name;
        this.paid_by = paid_by;
        this.paid_for = paid_for;
        this.amount = amount;
    }

    share() {
        for (var i = 0; i < person_list.length; i++) {
            if (person_list[i].name === this.paid_by) {
                person_list[i].paid += this.amount;
            }
        }
        let n = this.paid_for.length;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < person_list.length; j++) {
                if (person_list[j].name === this.paid_for[i]) {
                    person_list[j].spent += this.amount / n;
                }
            }
        }
    }
}

class UnequalPayment {
    name = '';
    paid_by = '';
    paid_for = [];
    amount = [];
    constructor(id, name, paid_by, paid_for, amount) {
        this.id = id;
        this.name = name;
        this.paid_by = paid_by;
        this.paid_for = paid_for;
        this.amount = amount;
    }

    share() {
        for (var i = 0; i < person_list.length; i++) {
            if (person_list[i].name === this.paid_by) {
                person_list[i].paid += this.amount.reduce((a, b) => a + b, 0);
            }
        }
        for (var i = 0; i < this.paid_for.length; i++) {
            for (var j = 0; j < person_list.length; j++) {
                if (person_list[j].name === this.paid_for[i]) {
                    person_list[j].spent += this.amount[i];
                }
            }
        }
    }
}

function saveNewPayment(){
    if (bill_mode === 'equal') {
        const paid_by = parseInt(document.querySelector('.input-bill-person[data-mode="equal"]').value);
        const paid_for = shareGroup || selected_list; //save value of edited checklist or selected list (which is All if checklist not edited)
        const amount = parseFloat(document.querySelector('.input-bill-amount').value);
        // check for valid input
        if (paid_by === 0) {
            addBillAlert('Please add paid person!');
            return -1;
        }
        
        if (isNaN(amount) || amount == 0) {
            addBillAlert('Please add paid amount!');
            return -1;
        }
        
        if (paid_for.length === 0) {
            addBillAlert('Please add shared person!');
            return -1;
        }
        // create new payment object as data are valid
        const bill_name = document.querySelector('.input-bill-name').value || `Bill ${billIndex++}`;
        const new_payment = new EqualPayment(billId++, bill_name, person_list[paid_by-1].name, paid_for, amount);
        console.log(new_payment);
        equal_payment_list.push(new_payment);
        addBillAlert(''); //Clear the alert
    }
    else {
        const paid_by = parseInt(document.querySelector('.input-bill-person[data-mode="unequal"]').value);
        const paid_for = person_list.map((person) => person.name); 
        const amount = [];
        for (let i = 0; i<paid_for.length; i++) {
            amount.push(parseFloat(document.querySelector(`.per-person-amount[data-value="unequal${paid_for[i]}"]`).value));
        }
        // delete invalid amount
        for (let i = 0; i < amount.length; i++) {
            if (isNaN(amount[i]) || amount[i] === 0) {
                paid_for.splice(i, 1);
                amount.splice(i, 1);
                i--;
            }
        }
        
        // check for valid input
        if (paid_by === 0) {
            addBillAlert('Please add paid person!');
            return -1;
        }
        
        if (amount.length === 0) {
            addBillAlert('Please add paid amount!');
            return -1;
        }
        
        // create new payment object as data are valid
        const bill_name = document.querySelector('.input-bill-name').value || `Bill ${billIndex++}`;
        const new_payment = new UnequalPayment(billId++, bill_name, person_list[paid_by-1].name, paid_for, amount);
        console.log(new_payment);
        unequal_payment_list.push(new_payment);
        addBillAlert(''); //Clear the alert
    }
    clearBillForm();
    renderBillList();
}


function clearBillForm() {
    // Reset name field
    document.querySelector('.input-bill-name').value = '';
    // Reset amount field
    document.querySelector('.input-bill-amount').value = '';
    document.querySelectorAll('.per-person-amount').forEach((input) => {
        input.value = '';
    });
    // Reset person field
    document.querySelectorAll('.input-bill-person').forEach((select) => {
        select.value = 0;
    });
    // Reset checklist
    selected_list = person_list.map((person) => person.name);
    checkNameList(selected_list);
    // Reset share group
    shareGroup = undefined;
    // Reset ouput share group
    displayShareBetweenField(selected_list);
}

function setEqualMode () {
    document.querySelector('.equal-bill-mode-button').style.backgroundColor = 'var(--md-sys-color-secondary-container)';
    document.querySelector('.unequal-bill-mode-button').style.backgroundColor = 'transparent';
    document.querySelector('.equal-bill-container').style.display = 'block';
    document.querySelector('.unequal-bill-container').style.display = 'none';
    bill_mode = 'equal';
}

function setUnequalMode () {
    document.querySelector('.unequal-bill-mode-button').style.backgroundColor = 'var(--md-sys-color-secondary-container)';
    document.querySelector('.equal-bill-mode-button').style.backgroundColor = 'transparent';
    document.querySelector('.unequal-bill-container').style.display = 'block';
    document.querySelector('.equal-bill-container').style.display = 'none';
    bill_mode = 'unequal';
}

function addBillAlert(message) {
    document.querySelector('.bill-alert').innerHTML = message;
}

function renderSelectList() {
    document.querySelectorAll('.input-bill-person').forEach((select) => {
        select.innerHTML = `<option value="0"> Who paid this? </option>`;
        for (let i = 0; i < person_list.length; i++) {
            select.innerHTML += `<option value="${i+1}">${person_list[i].name}</option>`;
        }
    });
}

function renderPerPersonList() {
    const per_person_list = document.querySelector('.input-per-person-container');
    per_person_list.innerHTML = '';
    for (let i = 0; i < person_list.length; i++) {
        per_person_list.innerHTML += `
            <div class="input-per-person-amount">
                <div class="per-person-name">${person_list[i].name}</div>
                <input type="number" class="per-person-amount" placeholder="How much?" data-value="unequal${person_list[i].name}"/>
                <button class="calculator-button" data-value = "unequal${person_list[i].name}">
                    <img src="icon/calculate_20dp_000000_FILL0_wght400_GRAD0_opsz20.svg"/>
                </button>
            </div>
        `;
    }
    // add event listener to new calculator button
    document.querySelectorAll('.calculator-button').forEach((button) => {
        button.addEventListener('click', () => {
            openCalculator();
            open_calculator_from = button.getAttribute('data-value');
        });
    });
}

//add popup bill form and set equal mode
document.querySelector('.add-bill-button').addEventListener('click', () => {
    if (person_list.length === 0) {
        addBillAlert('Please add person first!');
        document.querySelector('.popup-bill-form').style.display = 'none';
        return;
    }
    addBillAlert(''); //Clear the alert
    document.querySelector('.popup-bill-form').style.display = 'flex';
    setEqualMode();
});

// close popup bill form
document.querySelector('.close-popup-bill-button').addEventListener('click', () => {
    document.querySelector('.popup-bill-form').style.display = 'none';
    clearBillForm();
});

// turn on equal mode
document.querySelector('.equal-bill-mode-button').addEventListener('click', () => {
    setEqualMode();
});

// turn on unequal mode
document.querySelector('.unequal-bill-mode-button').addEventListener('click', () => {
    setUnequalMode();
});

// open calculator
document.querySelectorAll('.calculator-button').forEach((button) => {
    button.addEventListener('click', () => {
        openCalculator();
        open_calculator_from = button.getAttribute('data-value');
    });
});

// save calculator
document.querySelector('.save-calculator-button').addEventListener('click', () => {
    const amountField = (document.querySelector(`.input-bill-amount[data-value="${open_calculator_from}"]`)
                        || document.querySelector(`.per-person-amount[data-value="${open_calculator_from}"]`));
    amountField.value = saveCalculator();
});

// open checklist
document.querySelector('.edit-share-button').addEventListener('click', () => {
    openChecklist();
});

// close checklist
document.querySelector('.close-checklist-button').addEventListener('click', () => {
    closeChecklist();
});

// save checklist
document.querySelector('.save-checklist-button').addEventListener('click', () => {
    shareGroup = saveChecklist();
    // console.log(shareGroup);
    displayShareBetweenField(shareGroup);
});

// add new payment
document.querySelector('.save-bill-button').addEventListener('click', () => {
    if (saveNewPayment() === -1) { //Error in input
        return;
    }
    document.querySelector('.popup-bill-form').style.display = 'none';
});

// render bill list
function renderBillList() {
    const bill_list = document.querySelector('.bill-card-container');
    bill_list.innerHTML = '';
    for (let i = 0; i < equal_payment_list.length; i++) {
        shareBetweenField = '';
        if (equal_payment_list[i].paid_for.length === person_list.length) {
            shareBetweenField = 'All';
        }
        else {
            for (let j = 0; j < equal_payment_list[i].paid_for.length; j++) {
                shareBetweenField += equal_payment_list[i].paid_for[j];
                if (j !== equal_payment_list[i].paid_for.length - 1) {
                    shareBetweenField += ', ';
                }
            }
        }
        bill_list.innerHTML += `
            <div class="bill-card" data-name="equal${equal_payment_list[i].id}">
            <div class = "bill-info">
                <div class="bill-name">${equal_payment_list[i].name}</div>
                <div class="bill-amount-person-container">
                    <div class="bill-amount">Amount: ${equal_payment_list[i].amount}</div>
                    <div class="bill-person">Paid by: ${equal_payment_list[i].paid_by}</div>
                </div>
                <div class="bill-share">Share between: ${shareBetweenField} </div>
            </div>
            <div class = "bill-button-container">
                <button class="delete-bill-button" data-name="equal${equal_payment_list[i].id}">
                    <img src="icon/close_16dp_000000_FILL0_wght400_GRAD0_opsz20.svg"/>
                </button>
                <button class="edit-bill-button" data-name="equal${equal_payment_list[i].id}">
                    <img src="icon/edit_20dp_000000_FILL0_wght400_GRAD0_opsz20.svg"/>
                </button>
            </div>
        </div>
        `;
    }
    for (let i = 0; i < unequal_payment_list.length; i++) {
        shareBetweenField = '';
        for (let j = 0; j < unequal_payment_list[i].paid_for.length; j++) {
            shareBetweenField += unequal_payment_list[i].paid_for[j];
            shareBetweenField += ` (${unequal_payment_list[i].amount[j]})`;
            if (j !== unequal_payment_list[i].paid_for.length - 1) {
                shareBetweenField += ', ';
            }
        }
        bill_list.innerHTML += `
            <div class="bill-card" data-name="unequal${unequal_payment_list[i].id}">
                <div class = "bill-info">
                    <div class="bill-name">${unequal_payment_list[i].name}</div>
                    <div class="bill-amount-person-container">
                        <div class="bill-person">Paid by: ${unequal_payment_list[i].paid_by}</div>
                    </div>
                    <div class="bill-share">Share between: ${shareBetweenField} </div>
                </div>
                <div class = "bill-button-container">
                    <button class="delete-bill-button" data-name="unequal${unequal_payment_list[i].id}">
                        <img src="icon/close_16dp_000000_FILL0_wght400_GRAD0_opsz20.svg"/>
                    </button>
                    <button class="edit-bill-button" data-name="unequal${unequal_payment_list[i].id}">
                        <img src="icon/edit_20dp_000000_FILL0_wght400_GRAD0_opsz20.svg"/>
                    </button>
                </div>
            </div>
        `;
    }

    // add event listener to delete bill button
    document.querySelectorAll('.delete-bill-button').forEach((button) => {
        button.addEventListener('click', (event) => {
            deleteBill(event.currentTarget.getAttribute('data-name'));
        });
    });

    // add event listener to edit bill button
    document.querySelectorAll('.edit-bill-button').forEach((button) => {
        button.addEventListener('click', (event) => {
            editBill(event.currentTarget.getAttribute('data-name'));
        });
    });
}

// delete bill with data-name field of button
function deleteBill (id) { 
    if (id.startsWith('equal')) {
        for (let i = 0; i < equal_payment_list.length; i++) {
            if (equal_payment_list[i].id == id.slice(5)) {
                equal_payment_list.splice(i, 1);
                break;
            }
        }
    }
    else {
        for (let i = 0; i < unequal_payment_list.length; i++) {
            if (unequal_payment_list[i].id == id.slice(7)) {
                unequal_payment_list.splice(i, 1);
                break;
            }
        }
    }
    renderBillList();
}

// edit bill with data-name field of button
function editBill (id) {
    if (id.startsWith('equal')) {
        for (let i = 0; i < equal_payment_list.length; i++) {
            if (equal_payment_list[i].id == id.slice(5)) {
                // show popup bill form
                document.querySelector('.popup-bill-form').style.display = 'flex';
                setEqualMode();
                // fill in the bill name
                document.querySelector('.input-bill-name').value = equal_payment_list[i].name;
                // fill in the bill amount
                document.querySelector('.input-bill-amount').value = equal_payment_list[i].amount;
                // fill in the paid person
                document.querySelector('.input-bill-person[data-mode="equal"]').value = person_list.findIndex((person) => person.name === equal_payment_list[i].paid_by) + 1;

                // fill in the current check list
                selected_list = equal_payment_list[i].paid_for;
                checkNameList(selected_list);
                shareGroup = equal_payment_list[i].paid_for; //what for?

                // edit the output display of share group
                displayShareBetweenField(shareGroup);

                // remove the bill from the list
                equal_payment_list.splice(i, 1);
                // render the bill list
                renderBillList();
                return;
            }
        }
    }
    else {
        for (let i = 0; i < unequal_payment_list.length; i++) {
            if (unequal_payment_list[i].id == id.slice(7)) {
                // show popup bill form
                document.querySelector('.popup-bill-form').style.display = 'flex';
                setUnequalMode();
                // fill in the bill name
                document.querySelector('.input-bill-name').value = unequal_payment_list[i].name;
                // fill in the paid person
                document.querySelector('.input-bill-person[data-mode="unequal"]').value = person_list.findIndex((person) => person.name === unequal_payment_list[i].paid_by) + 1;
                // fill in the paid amount for each person
                for (let j = 0; j < unequal_payment_list[i].paid_for.length; j++) {
                    document.querySelector(`.per-person-amount[data-value="unequal${unequal_payment_list[i].paid_for[j]}"]`).value = unequal_payment_list[i].amount[j];
                }
                // remove the bill from the list
                unequal_payment_list.splice(i, 1);
                // render the bill list
                renderBillList();
                return;
            }
        }
    }
}

// delete all bill
function deleteAllBill() {
    equal_payment_list = [];
    unequal_payment_list = [];
    renderBillList();
}

function displayShareBetweenField (list) {
    if (list.length === person_list.length) {
        document.querySelector('.share-group').innerHTML = ' Share between: All';
        return;
    }
    else {
        shareBetweenField = '';
        for (let i = 0; i < list.length; i++) {
            shareBetweenField += list[i];
            if (i !== list.length - 1) {
                shareBetweenField += ', ';
            }
        }
        document.querySelector('.share-group').innerHTML = ` Share between: ${shareBetweenField}`;
        return;
    }
}

function resetSharing () {
    for (let i = 0; i < person_list.length; i++) {
        person_list[i].paid = 0;
        person_list[i].spent = 0;
    }
}

document.querySelector('.done-bill-button').addEventListener('click', () => {
    if (equal_payment_list.length === 0 && unequal_payment_list.length === 0) {
        addBillAlert('Please add bill first!');
        return;
    }
    document.querySelector('.popup-bill-form').style.display = 'none';
    clearBillForm();
    resetSharing(); //make sure spent and paid are 0
    for (let i = 0; i < equal_payment_list.length; i++) {
        equal_payment_list[i].share();
    }
    for (let i = 0; i < unequal_payment_list.length; i++) {
        unequal_payment_list[i].share();
    }
    getTransactionResults();
});

