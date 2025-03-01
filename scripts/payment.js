var payment_list = [];

class Payment {
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

//add popup for group selection