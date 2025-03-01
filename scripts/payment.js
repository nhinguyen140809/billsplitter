var payment_list = [];
var person_list = [];

let open_calculator_from = undefined;
let bill_mode = 'equal';

class EqualPayment {
    name = '';
    paid_by = '';
    paid_for = [];
    amount = 0;
    constructor(paid_by, paid_for, amount) {
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
    constructor(paid_by, paid_for, amount) {
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

function addNewPayment(){
    var paid_by = document.querySelector('.input-bill-person').value;
    var paid_for = [];
    document.querySelectorAll('.checkbox-name').forEach((checkbox) => {
        if (checkbox.checked) {
            paid_for.push(checkbox.getAttribute('data-name'));
        }
    });
    var amount = document.querySelector('.input-bill-amount').value;
    var payment = new Payment(paid_by, paid_for, amount);
    payment_list.push(payment);
    console.log(payment_list);
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

//add popup bill form and set equal mode
document.querySelector('.add-bill-button').addEventListener('click', () => {
    document.querySelector('.popup-bill-form').style.display = 'flex';
    setEqualMode();
});

// close popup bill form
document.querySelector('.close-popup-bill-button').addEventListener('click', () => {
    document.querySelector('.popup-bill-form').style.display = 'none';
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
