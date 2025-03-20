var person_list = [];

//create a person object
class Person {
    name = '';
    paid = 0;
    spent = 0;
    constructor(name, paid, spent) {
        this.name = name;
        this.paid = paid;
        this.spent = spent;
    }
    addSpent(amount) {
        this.spent += amount;
    }

    addPaid(amount) {
        this.paid += amount;
    }
};

function addPerson() {
    const input = document.querySelector('.input-name');

    // Check if the input field is empty
    if (input.value === '') { 
        showAddNameAlert('Please enter a name!');
        return;
    }

    // Check if the name already exists
    for (let i = 0; i < person_list.length; i++) {
        if (person_list[i].name === input.value) { 
            showAddNameAlert('Name already exists!');
            input.value = ''; // Clear the input field
            return;
        }
    }

    // Add the name to the array
    person_list.push(new Person(input.value, 0, 0));                         
    input.value = '';                                           // Clear the input field
    showAddNameAlert('')  // Clear the alert
    renderNameCards();
}

function deletePerson(index) {
    person_list.splice(index, 1);
    renderNameCards();
}


function renderNameCards () {
    const nameList = document.querySelector('.name-card-container');
    nameList.innerHTML = ''; // Clear the name list

    for (let i = 0; i < person_list.length; i++) {
        const nameCard = document.createElement('div');
        nameCard.className = 'name-card';
        nameCard.innerHTML = `
            <div class="name">${person_list[i].name}</div>
            <button class="delete-name-button"
                    onclick = 'deletePerson(${i});'>
                    <img src="icon/close_16dp_000000_FILL0_wght400_GRAD0_opsz20.svg">
            </button>
        `;
        nameList.appendChild(nameCard);
    }
}

function showAddNameAlert(string) {
    document.querySelector('.add-name-alert').innerHTML = string;
}

// Add person when enter is pressed
document.querySelector('.input-name').addEventListener('keydown', (event) =>{
    if (event.key === 'Enter') {
        addPerson();
    }
}); 

// Add person when add name button is clicked
document.querySelector('.input-name-button').addEventListener('click', ()=>{
    addPerson();
});

// Add name button is clicked
document.querySelector('.done-name-button').addEventListener('click', () => {
    if (person_list.length < 2) {
        showAddNameAlert('Please add at least two names!');
        return;
    }
    renderCheckList();
    renderSelectList();
    renderPerPersonList();
    clearBillForm();
    deleteAllBill();
    document.querySelector('.checkbox-all').checked = true;
    checkAll();
    selected_list = person_list.map((person) => person.name);
    document.querySelector('.add-bill-button').style.display = 'inline-flex';
    document.querySelector('.done-bill-button').style.display = 'inline-block';
    // console.log(selected_list);
});