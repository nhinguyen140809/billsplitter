const display = document.querySelector('.calculator-display');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const specials_chars = ["+", "-", "*", "/", ")", "="]; // +, -, *, /, ), =

let output = '';

const calculate = (buttonValue) => {
    if (buttonValue === '=') {
        if (output !== '') {
            output = eval(output);
        }
    }
    else if (buttonValue === 'AC') {
        output = '';
    }
    else if (buttonValue === 'DEL') {
        output = output.slice(0, -1);
    }
    else {
        if (output === "" && specials_chars.includes(buttonValue)) {
            return;
        }
        output += buttonValue;
    }
    display.value = output;
}

numbers.forEach((button) => {
    button.addEventListener('click', () => {
        calculate(button.getAttribute('data-value'));
    });
});

operators.forEach((button) => {
    button.addEventListener('click', () => {
        calculate(button.getAttribute('data-value'));
    });
});

function openCalculator() {
    output = '';
    display.value = output;
    document.querySelector('.overlay').classList.add('active');
    document.querySelector('.calculator-container').classList.add('active');
}

function closeCalculator() {
    document.querySelector('.calculator-container').classList.remove('active');
    document.querySelector('.overlay').classList.remove('active');
}

function saveCalculator() {
    closeCalculator();
    return eval(output);
}

document.querySelector('.close-calculator-button').addEventListener('click', () => {
    closeCalculator();
});
