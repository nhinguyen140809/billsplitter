var selected_list = [];

function renderCheckList() {
    var list = document.querySelector('.check-list-container');
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

document.querySelector('.add-checklist-button').addEventListener('click', () => {
    renderCheckList();
});


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
    } else {
        selected_list = [];
        document.querySelectorAll('.checkbox-name').forEach((checkbox) => {
            checkbox.checked = false;
        });
    }
    console.log(selected_list);
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
    console.log(selected_list);
}
