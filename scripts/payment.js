var equal_payment_list = [];
var unequal_payment_list = [];

let open_calculator_from = undefined;
let bill_mode = 'equal';
let shareGroup = undefined;
let billIndex = 1;

class EqualPayment {
    name = '';
    paid_by = '';
    paid_for = [];
    amount = 0;
    constructor(name, paid_by, paid_for, amount) {
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
        n = this.paid_for.length;
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
    constructor(name, paid_by, paid_for, amount) {
        this.name = name;
        this.paid_by = paid_by;
        this.paid_for = paid_for;
        this.amount = amount;
    }

    share() {
        for (var i = 0; i < person_list.length; i++) {
            if (person_list[i].name === this.paid_by) {
                person_list[i].paid += this.amount.sum();
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
        const new_payment = new EqualPayment(bill_name, person_list[paid_by].name, paid_for, amount);
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
        const new_payment = new UnequalPayment(bill_name, person_list[paid_by].name, paid_for, amount);
        console.log(new_payment);
        unequal_payment_list.push(new_payment);
        addBillAlert(''); //Clear the alert
    }
    clearBillForm();
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
    document.querySelector('.share-group').innerHTML = ' Share between: All';
}

function setEqualMode () {
    document.querySelector('.equal-bill-mode-button').style.backgroundColor = 'rgb(139, 139, 139)';
    document.querySelector('.unequal-bill-mode-button').style.backgroundColor = 'transparent';
    document.querySelector('.equal-bill-container').style.display = 'block';
    document.querySelector('.unequal-bill-container').style.display = 'none';
    bill_mode = 'equal';
}

function setUnequalMode () {
    document.querySelector('.unequal-bill-mode-button').style.backgroundColor = 'rgb(139, 139, 139)';
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
    if (shareGroup.length === person_list.length) {
        document.querySelector('.share-group').innerHTML = ' Share between: All';
    }
    else {
        document.querySelector('.share-group').innerHTML = ` Share between: ${shareGroup}`;
    }
});

// add new payment
document.querySelector('.save-bill-button').addEventListener('click', () => {
    if (saveNewPayment() === -1) { //Error in input
        return;
    }
    document.querySelector('.popup-bill-form').style.display = 'none';
});

