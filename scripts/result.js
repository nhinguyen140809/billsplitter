var sender_list = [];
var receiver_list = [];

//formant currency
function formatCurrency(num) {
    return num.toFixed(2).toString();
}

function createSenderList (person_list) {
    for (let i = 0; i < person_list.length; i++) {
        if (person_list[i].spent > person_list[i].paid) {
            sender_list.push(
                {
                    name: person_list[i].name,
                    amount: formatCurrency(person_list[i].spent - person_list[i].paid)
                }
            );
        }
    }
}

function createReceiverList (person_list) {
    for (let i = 0; i < person_list.length; i++) {
        if (person_list[i].spent < person_list[i].paid) {
            receiver_list.push(
                {
                    name: person_list[i].name,
                    amount: formatCurrency(person_list[i].paid - person_list[i].spent)
                }
            );
        }
    }
}

function renderResult () {
    const sender_container = document.querySelector('.sender-container');
    const receiver_container = document.querySelector('.receiver-container');
    sender_container.innerHTML = '<p style="font-weight: 550; margin-top: 0;"> Senders </p>';
    receiver_container.innerHTML = '<p style="font-weight: 550; margin-top: 0;"> Receivers </p>';
    for (let i = 0; i < sender_list.length; i++) {
        sender_container.innerHTML += `
            <div class = "sender-card"> 
                ${sender_list[i].name} must send ${sender_list[i].amount} 
            </div>
        `;
    }
    for (let i = 0; i < receiver_list.length; i++) {
        receiver_container.innerHTML += `
            <div class = "receiver-card"> 
                ${receiver_list[i].name} must receive ${receiver_list[i].amount} 
            </div>
        `;
    }
}

