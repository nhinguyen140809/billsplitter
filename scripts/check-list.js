var selected_list = [];
let temp_list = [];

function renderCheckList() {
    var list = document.querySelector('.checklist-item-container');
    list.innerHTML = '';
    item = document.createElement('div');
    item.className = 'check-name-card';
    item.innerHTML = `
        <input type = "checkbox" class = "checkbox-all">
        <div class = "name-checklist"> All </div>
    `;
    list.appendChild(item);
    for (var i = 0; i < person_list.length; i++) {
        var item = document.createElement('div');
        item.className = 'check-name-card';
        item.innerHTML = `
            <input type = "checkbox" class = "checkbox-name" data-name = "${person_list[i].name}">
            <div class = "name-checklist"> ${person_list[i].name} </div>
        `;
        list.appendChild(item);
    }

    document.querySelector('.checkbox-all').addEventListener('click', () => {
        checkAll();
    });
    
    document.querySelectorAll('.checkbox-name').forEach((checkbox) => {
        checkbox.addEventListener('click', (event) => {checkName(event.target);});
    });
}




function checkAll() {
    const checkbox_all = document.querySelector('.checkbox-all');
    if (checkbox_all.checked) {
        selected_list = [];
        for (var i = 0; i < person_list.length; i++) {
            selected_list.push(person_list[i].name);
        }
        document.querySelectorAll('.checkbox-name').forEach((checkbox) => {
            checkbox.checked = true;
        });
    }
    // console.log(selected_list);
}

function checkName(checkbox) {
    if (checkbox.checked) {
        let person = checkbox.getAttribute('data-name');
        selected_list.push(person);
    } else {
        let person = checkbox.getAttribute('data-name');
        selected_list = selected_list.filter((name) => name != person);
        document.querySelector('.checkbox-all').checked = false;
    }
    // console.log(selected_list);
}

function checkNameList (list) {
    document.querySelectorAll('.checkbox-name').forEach((checkbox) => {
        if (list.includes(checkbox.getAttribute('data-name'))) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });

    if (list.length === person_list.length) {
        document.querySelector('.checkbox-all').checked = true;
    } else {
        document.querySelector('.checkbox-all').checked = false;
    }
}

function openChecklist() {
    document.querySelector('.overlay').classList.add('active');
    document.querySelector('.checklist-container').classList.add('active');
    checkAll();

    // Save data to temp_list
    temp_list = selected_list;
    console.log(temp_list);
}

function closeChecklist() {
    document.querySelector('.checklist-container').classList.remove('active');
    document.querySelector('.overlay').classList.remove('active');
    // Reset selected_list
    selected_list = temp_list;
    checkNameList(selected_list);
}

function saveChecklist() {
    document.querySelector('.checklist-container').classList.remove('active');
    document.querySelector('.overlay').classList.remove('active');
    return selected_list;
}