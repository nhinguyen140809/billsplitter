const display = document.querySelector('.calculator-display');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const specials_chars = ["+", "-", "*", "/", ")", "="]; // +, -, *, /, ), =

let output = '';

const calculate = (buttonValue) => {
    console.log(buttonValue);
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
