// CALCULATOR FUNCTIONS

let add = (x, y) => {
    let num = Math.round(((x + y) + Number.EPSILON) * 1000) / 1000;
    // num = fixDigits(num);
    return num;
};

let subtract = (x, y) => {
    let num = Math.round(((x - y) + Number.EPSILON) * 1000) / 1000;
    // num = fixDigits(num);
    return num;
};

let multiply = (x, y) => {
    let num = Math.round(((x * y) + Number.EPSILON) * 1000) / 1000;
    // num = fixDigits(num);
    return num;
};

let divide = (x, y) => {
    let num = Math.round(((x / y) + Number.EPSILON) * 1000) / 1000;
    // num = fixDigits(num);
    return num;
};

let negatize = (x) => {
    x = String(x);
    if (x.charAt(0) == '-') {
        x = x.substring(1);
    } else {
        x = '-' + x;
    }
    // x = Number(x);
    return x;
}

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

    // when tempValue is true, it means we're continuing off a
    // previous calculation.
    if (tempValue) {
        if (!values.operator && ![...operators, '+/-', '='].includes(buttonText)) values.x = null;

        // when pressing +/- after a calculation, want to negatize the number
        if (buttonText == '+/-') {
            text = String(values.x);
            displayText.textContent = text;
            values.x = Number(negatize(values.x));
        } else {
            text = '';

        };
        // displayText.textContent = '';
        tempValue = false;
    };

    // if last part of text was an operator, reset text
    // but if you pressed a new operator, replace the operator and don't reset
    if (operators.includes(text.slice(-1))) {
        if (operators.includes(buttonText)) {
            text = displayText.textContent.slice(0, -1) + buttonText;
            displayText.textContent = text;
        } else if (buttonText == '+/-') {
        } else {
            text = '';
            displayText.textContent = '';
        };
    };

    // adjust the text depending on the button pressed
    // for integer, simply add the integer to the end of the text
    if (parseInt(buttonText) || buttonText == '0') {

        text += String(buttonText);

        // toLocaleString will add commas to the number string when necessary, e.g. thousands
        displayText.textContent = Number(text)

    } else {

        // when not pressing an integer, adjust the display depending on the specific button
        switch (buttonText) {

            case '+/-':
                if (operators.includes(text.slice(-1))) return text;
                if (displayText.textContent == '') return text;
                text = negatize(text);
                displayText.textContent = text;


                return text;

            case '=':
                if (operators.includes(text.slice(-1))) return text;
                text = displayText.textContent;
                return text;

            case 'AC':
                text = '';
                // displayText.textContent = '';
                displayText.textContent = '';
                return;

            case 'CE':
                text = '';
                // displayText.textContent = '';
                displayText.textContent = '';
                return;

            // Use the default for the operators plus period
            default:

                // do nothing if last part of character is equivalent to the button pressed
                if (text.slice(-1) == String(buttonText) || (!text.slice(-1) && !displayText.textContent)) return;

            // text = displayText.textContent + String(buttonText);
            // displayText.textContent = text;

        }

        text = displayText.textContent + String(buttonText);
        displayText.textContent = text;
    };

    // replace any part of the text that isn't a number and return it for the next functions
    text = text.replace(/[^0-9.]/g, '');
    console.log(text);

    return text

};

// When pressing any of the operator buttons, it should store the number
// Pressing operator button additionally while one number is stored should act
// as pseudo equal sign
let storeValue = (text, buttonText) => {

    // console.log(typeof (parseInt(buttonText)));

    // we won't store a value if the button pressed is just extending the current text
    // or clearing the value
    if ((![...operators, '=', 'AC', 'CE'].includes(buttonText)) &&
        (buttonText == '.' || typeof (parseInt(buttonText)) == 'number')) return;

    // if the button pressed is an operator, and we have an x value but no y value
    // don't try to calculate - just change operator
    if (values.x && !values.y && operators.includes(buttonText)) {
        values.operator = buttonText;
        return;
    }

    // if (values.x && buttonText == '+/-' &&)
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

    // check that random '=' presses don't do anything when there's no available operations
    if (buttonText == '=' & !values.y) return;

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