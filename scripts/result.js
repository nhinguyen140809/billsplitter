var sender_list = [];
var receiver_list = [];

var model = {
    optimize: "total_transactions",
    opType: "min",
    constraints: {},
    variables: {
        "max_number_of_transactions": {
            "total_transactions": 1000 //For minimizing the max number of transactions per person
        }
    },
    ints: {}
};

//format currency to 2 decimal places
function formatCurrency(num) {
    return parseFloat(num.toFixed(2));
}

//Create sender list and receiver list from person list
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
//Get the maximum amount from the sender list
function getMaxAmount (sender_list) {
    let max = 0;
    for (let i = 0; i < sender_list.length; i++) {
        if (sender_list[i].amount > max) {
            max = sender_list[i].amount;
        }
    }
    return max;
}

//Create the model for the solver
function createModel () {
    // senders and receivers lists are already created
    let max_send = getMaxAmount(sender_list);
    for (let i = 0; i < sender_list.length; i++) {
        let sender_name = sender_list[i].name;
        //Sender sends all the amount to the receivers
        model.constraints[`${sender_name}`] = { "equal": sender_list[i].amount };
        //Total number of transactions per sender is less than the max number of transactions
        model.constraints[`${sender_name}_total`] = { "max": 0 };
        for (let j = 0; j < receiver_list.length; j++) {
            let receiver_name = receiver_list[j].name;
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
        console.log("Total transactions:", results.result - results.max_number_of_transactions*1000);
    } else {
        console.log("No feasible solution found.");
    }
    return results;
}

// Create model, solve and render the results
function getTransactionResults() {
    createSenderList(person_list);
    createReceiverList(person_list);
    createModel();
    let result = solveModel();
    let send = {};
    let receive = {};
    for (let i = 0; i < sender_list.length; i++) {
        send[sender_list[i].name] = {};
    }
    for (let i = 0; i < receiver_list.length; i++) {
        receive[receiver_list[i].name] = {};
    }
    for (let i = 0; i < sender_list.length; i++) {
        for (let j = 0; j < receiver_list.length; j++) {
            let sender_name = sender_list[i].name;
            let receiver_name = receiver_list[j].name;
            let amount = result[`${sender_name}_send_${receiver_name}`];
            if (amount > 0) {
                send[sender_name][receiver_name] = formatCurrency(amount);
                receive[receiver_name][sender_name] = formatCurrency(amount);
            }
        }
    }
    renderResult(send, receive);
}


function renderResult (send, receive) {
    const sender_container = document.querySelector('.sender-container');
    const receiver_container = document.querySelector('.receiver-container');
    sender_container.innerHTML = '<p style="font-weight: 550; margin-top: 0;"> Senders </p>';
    receiver_container.innerHTML = '<p style="font-weight: 550; margin-top: 0;"> Receivers </p>';

    Object.keys(send).forEach(sender => {
        Object.entries(send[sender]).forEach(([receiver, amount]) => {
            sender_container.innerHTML += ` 
                <div class = "sender-card"> 
                    ${sender} sends ${amount} to ${receiver} 
                </div>
            `;
        });
    });

    Object.keys(receive).forEach(receiver => {
        Object.entries(receive[receiver]).forEach(([sender, amount]) => {
            receiver_container.innerHTML += ` 
                <div class = "receiver-card">
                    ${receiver} receives ${amount} from ${sender}
                </div>
            `;
        });
    });
}

