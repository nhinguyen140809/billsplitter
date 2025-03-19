var sender_list = [];
var receiver_list = [];

let model = {
    optimize: "total_transactions",
    opType: "min",
    constraints: {},
    variables: {
        "max_number_of_transactions": {}
    },
    ints: {}
};

//format currency
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

function getMaxAmount (sender_list) {
    let max = 0;
    for (let i = 0; i < sender_list.length; i++) {
        if (sender_list[i].amount > max) {
            max = sender_list[i].amount;
        }
    }
    return max;
}

function createModel () {
    // senders and receivers lists are already created
    let max_send = getMaxAmount(sender_list);
    for (let i = 0; i < sender_list.length; i++) {
        sender_name = sender_list[i].name;
        //Sender sends all the amount to the receivers
        model.constraints[`${sender_name}`] = { "equal": sender_list[i].amount };
        //Total number of transactions per sender is less than the max number of transactions
        model.constraints[`${sender_name}_total`] = { "max": 0 };
        for (let j = 0; j < receiver_list.length; j++) {
            receiver_name = receiver_list[j].name;
            //Receivers constraint
            model.constraints[`${receiver_name}`] = { "equal": receiver_list[j].amount };
            //x_ij >= 0 constraint
            model.constraints[`${sender_name}_send_${receiver_name}`] = { "min": 0 };
            //w_ij binary constraint
            model.constraints[`${sender_name}_${receiver_name}_bin`] = { "max": 1 };
            model.ints[`${sender_name}_${receiver_name}_bin`] = 1;
            //x_ij - M * w_ij <= 0 constraint
            model.constraints[`${sender_name}_${receiver_name}`] = { "max": 0 };

            //x_ij variable
            model.variables[`${sender_name}_send_${receiver_name}`] = { 
                [sender_name]: 1,                                       //Sum of sent amount by sender
                [receiver_name]: 1,                                     //Sum of received amount by receiver
                [`${sender_name}_${receiver_name}`]: 1                  //x_ij - M * w_ij <= 0
            }; 
            //w_ij variable
            model.variables[`${sender_name}_${receiver_name}_bin`] = { 
                [`${sender_name}_${receiver_name}`]: -max_send,                 //x_ij - M * w_ij <= 0
                [`${sender_name}_total`]: 1,                                    //Total number of transactions per sender   
                ["total_transactions"]: 1   
            };

        }
        //Max number of transactions per person constraint
        model.variables["max_number_of_transactions"][`${sender_name}_total`] = -1; 
    }
}

function solveModel() {
    let results = solver.Solve(model);
    // For debugging purposes
    if (results.feasible) {
        console.log("Minimum maximum transactions (W):", results.max_number_of_transactions);
        console.log("Total transactions:", results.result);
    } else {
        console.log("No feasible solution found.");
    }
    return results;
}

function getTransactionResults() {
    //Sender list and receiver list are already created
    createModel();
    let result = solveModel();
    renderResult();
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

