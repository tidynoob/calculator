// CALCULATOR FUNCTIONS

let add = (x, y) => { return Math.round(((x + y) + Number.EPSILON) * 100000000) / 100000000 };

let subtract = (x, y) => { return Math.round(((x - y) + Number.EPSILON) * 100000000) / 100000000 };

let multiply = (x, y) => { return Math.round(((x * y) + Number.EPSILON) * 100000000) / 100000000 };

let divide = (x, y) => { return Math.round(((x / y) + Number.EPSILON) * 100000000) / 100000000 };

// let operate = (x, y, foo) => {
//     return foo(x, y)
// }

// CLICK FUNCTIONS

// Adjusts the text that will appear on the display
// text parameter refers to the text content of display text
// where the string is stripped of commas or converted to blank.
// buttonText parameter refers to the text of the button pressed.
// displayText parameter should be the selected html element 
// that contains the text that appears on the display of the 
// calculator.
let adjustText = (text, buttonText, displayText) => {

    if (tempValue) {
        text = '';
        displayText.textContent = '';
        tempValue = false;
    }


    // reset text if last part of text was an operator
    if (operators.includes(text.slice(-1))) {
        text = '';
        displayText.textContent = '';
    }

    // adjust the text depending on the button pressed
    // for integer, simply add the integer to the end of the text
    if (parseInt(buttonText)) {
        text += String(buttonText);

        // toLocaleString will add commas to the number string when necessary, e.g. thousands
        displayText.textContent = Number(text).toLocaleString('en-US');

    } else {

        // when not pressing an integer, adjust the display depending on the specific button
        switch (buttonText) {

            case '+/-':
                if (operators.includes(text.slice(-1))) return;
                if (text == '') return;
                if (text.charAt(0) == '-') {
                    text = text.substring(1);
                    displayText.textContent = Number(text).toLocaleString('en-US');
                } else {
                    text = '-' + text;
                    displayText.textContent = Number(text).toLocaleString('en-US');
                }
                break;

            case '=':

                break;

            case 'AC':
                displayText.textContent = '';
                break;

            case 'CE':
                displayText.textContent = '';
                break;

            // Use the default for the operators plus period
            default:

                // do nothing if last part of character is equivalent to the button pressed
                if (text.slice(-1) == String(buttonText) || !text.slice(-1)) return;

                // if the last character is an operator, replace the operator with the new button pressed
                if (operators.includes(text.slice(-1))) {
                    text = displayText.textContent.slice(0, -1) + buttonText;
                    displayText.textContent = text;

                    values.operator = buttonText;
                    return;
                }

                text = displayText.textContent + String(buttonText);
                displayText.textContent = text;
        };
    };

    // replace any part of the text that isn't a number and return it for the next functions
    text = text.replace(/[^0-9.]/g, '');
    console.log(text);

    return text

}

// When pressing any of the operator buttons, it should store the number
// Pressing operator button additionally while one number is stored should act
// as pseudo equal sign
let storeValue = (text, buttonText) => {

    // we won't store a value if the button pressed is just extending the current text
    // or clearing the value
    if ((![...operators, '=', 'AC', 'CE'].includes(buttonText)) &&
        (buttonText == '.' || typeof (parseInt(buttonText)) == 'number')) return;

    // console.log('thru');

    // first store the x value (first value)
    // if the x is already stored, we can store y assuming an operator
    // is alrady stored. If an operator is not stored, we don't store y yet
    // This helps solves the issue when we are chaining calculations after
    // a calculation using '='.
    if (!values.x) values.x = Number(text)
    else {
        if (values.operator) values.y = Number(text)
    };
    console.table(values);

    // set an operator if we don't have one already
    if (operators.includes(buttonText)) {
        if (!values.operator) values.operator = buttonText;

    // clear everything with AC
    } else if (buttonText == 'AC') {
        values = {
            x: null,
            y: null,
            operator: null,
        };
        tempValue = false;
    
    // with CE, clear the most recent inputs
    } else if (buttonText == 'CE') {
        if (values.y) values.y = null;
        values.operator = null;
    }
}

// Performs calculation given object of values
let operate = (object, buttonText, displayText) => {
    if (Object.values(values).some(value => value == null ? true : false)) return

    else {

        let foo = '';

        switch (object.operator) {
            case '+':
                foo = add;
                break;
            case '−':
                foo = subtract;
                break;
            case '×':
                foo = multiply;
                break;
            case '÷':
                foo = divide;
                break;

        }

        let output = foo(object.x, object.y);
        displayText.textContent = output;
        if (buttonText == '=') {
            values = {
                x: output,
                y: null,
                // adjust depending on whether it was equal sign or not?
                operator: null,
            }
        } else {
            values = {
                x: output,
                y: null,
                // adjust depending on whether it was equal sign or not?
                operator: buttonText,
            }
        };
        tempValue = true;
    }
}

let adjustDisplay = (e) => {

    let displayText = document.querySelector('.displayText');
    let text = (displayText.textContent.replaceAll(',', '') || "");
    let buttonText = (e.target.textContent || e.target.innerText);

    text = adjustText(text, buttonText, displayText);
    storeValue(text, buttonText);
    operate(values, buttonText, displayText);
}

let operators = ['+', '−', '×', '÷'];

// define a boolean that gets used when a calculated number would be used in the next operation
let tempValue = false;

// Define the variables that will be used for storing and operations
let values = {
    x: null,
    y: null,
    operator: null,
};

let buttons = document.querySelectorAll('button');

buttons.forEach(button => button.addEventListener('click', adjustDisplay));