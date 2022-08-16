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

    if (y == 0) {
        errorCheck = true;
        return "ERROR"
    };
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

// CLICK FUNCTIONS


// This function is used for making adjustments to the text and display text
// when continuining off a previous calculation, otherwise do nothing
let tempValueAdjustments = (text, buttonText, displayText) => {
    // when tempValue is true, it means we're continuing off a
    // previous calculation
    if (tempValue) {

        // If we don't have an operator (meaning we didn't use an operator as a psuedo '=' sign),
        // and the button pressed is not another operator or +/- or '=' then we remove the stored
        // output
        if (!values.operator && ![...operators, '+/-', '='].includes(buttonText)) values.x = null;

        // when pressing +/- after a calculation, want to negatize the number
        if (buttonText == '+/-') {
            text = String(values.x);
            displayText.textContent = text;
            values.x = Number(negatize(values.x));

            // when pressing '=' or operators after a calculation, make adjustments to the text
            // to continue calculations
        } else if (buttonText == '=' || operators.includes(buttonText)) {
            // if an operator is already being shown, and we press an operator
            // or =, null the previous operator
            if (operators.includes(text.slice(-1))) {
                values.operator = null;
            };

            // if we pressed an operator, add the operator to the text
            // if it was just an equal sign, set it to the screen
            if (operators.includes(buttonText)) {
                text = String(values.x) + buttonText;
            } else {
                text = String(values.x);
            };

            displayText.textContent = text;

            // return text now so tempValue stays true
            // we do this since pressing = or another operator
            // isn't actually starting a new number
            return text;

        } else {
            text = '';
            displayText.textContent = '';

        };
        tempValue = false;
    };

    return text;
};


// Adjusts the text that will appear on the display
// text parameter refers to the text content of display text
// where the string is stripped of commas or converted to blank.
// buttonText parameter refers to the text of the button pressed.
// displayText parameter should be the selected html element 
// that contains the text that appears on the display of the 
// calculator.
let adjustText = (text, buttonText, displayText) => {

    text = tempValueAdjustments(text, buttonText, displayText);

    // if last part of text was an operator, reset text
    // but if you pressed a new operator, replace the operator and don't reset
    if (operators.includes(text.slice(-1))) {
        if (operators.includes(buttonText)) {
            // text = displayText.textContent.slice(0, -1) + buttonText;
            text = displayText.textContent.slice(0, -1);

            displayText.textContent = text;
        } else if (buttonText == '+/-') {
        } else {
            text = '';
            displayText.textContent = '';
        };
    };

    // when not pressing an integer, adjust the display depending on the specific button
    switch (buttonText) {

        case '+/-':
            if (operators.includes(text.slice(-1))) return text;
            if (displayText.textContent == '') return text;
            text = negatize(text);
            displayText.textContent = text;
            break;

        case '=':
            if (operators.includes(text.slice(-1))) return text;
            text = displayText.textContent;
            break;

        case 'AC':
            text = '';
            displayText.textContent = text;
            break;

        case 'CE':
            text = '';
            displayText.textContent = text;
            break;

        case '.':
            if (text.includes('.')) return text;
            text = displayText.textContent + String(buttonText);
            displayText.textContent = text;
            break;

        // Use the default for the operators and numbers
        default:

            // do nothing if last part of character is equivalent to the button pressed,
            // when not a number
            if (text.slice(-1) == String(buttonText) && !(typeof (parseInt(buttonText)) == 'number')) return;

            text = displayText.textContent + String(buttonText);
            displayText.textContent = text;

    };

    // replace any part of the text that isn't a number and return it for the next functions
    text = text.replace(/[^0-9.-]/g, '');
    // console.log(text);

    return text

};

// When pressing any of the operator buttons, it should store the number
// Pressing operator button additionally while one number is stored should act
// as pseudo equal sign
let storeValue = (text, buttonText) => {

    // we won't store a value if the button pressed is just extending the current text
    // or clearing the value
    if ((![...operators, '=', 'AC', 'CE'].includes(buttonText)) &&
        (buttonText == '.' || typeof (parseInt(buttonText)) == 'number')) return;

    // check that random '=' presses don't do anything when there's no available operations
    if (buttonText == '=' && values.y === null && values.x === null) return;

    // first store the x value (first value)
    // if the x is already stored, we can store y assuming an operator
    // is alrady stored. If an operator is not stored, we don't store y yet
    // This helps solves the issue when we are chaining calculations after
    // a calculation using '='.
    if (values.x === null) values.x = Number(text)
    else {

        // if the button pressed is an operator, and we don't have values yet
        // don't try to calculate - just change operator

        // if (operators.includes(buttonText)) {
        //     values.operator = buttonText;
        // return;
        // }
        if (values.operator) values.y = Number(text)
    };
    // console.log(values);

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

        // with CE, clear the most recent input
    } else if (buttonText == 'CE') {
        // console.log(values.operator);
        if (!values.operator) values.x = null;
        values.y = null;
    }

    console.log(values);

}

// Performs calculation given object of values
let operate = (object, buttonText, displayText) => {

    // if any part of the values object is null we don't operate
    if (Object.values(values).some(value => value == null ? true : false)) return;

    else {

        let foo = '';

        // select operating function based on button
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

        // adjust object storage based on whether an operator sign or 
        // equal sign was used to calculate
        let output = foo(object.x, object.y);
        // displayText.textContent = output;
        if (operators.includes(buttonText)) {
            displayText.textContent = output + buttonText;
        } else {
            displayText.textContent = output;
        };

        if (errorCheck) {
            values = {
                x: null,
                y: null,
                operator: null,
            };
            errorCheck = false;
            tempValue = true;
            return;
        }

        if (buttonText == '=') {
            values = {
                x: output,
                y: null,
                operator: null,
            }
        } else {
            values = {
                x: output,
                y: null,
                operator: buttonText,
            }
        };

        // set tempValue true to alter functionality on next button press
        tempValue = true;
    }
}

let adjustDisplay = (e) => {

    // separate displayText vs text
    // displayText will be whatever is on display, e.g. numbers plus any operators
    // text will carry the raw float value of the number on the display
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

// Boolean for divide by zero error
let errorCheck = false;

// Define the variables that will be used for storing and operations
let values = {
    x: null,
    y: null,
    operator: null,
};

let buttons = document.querySelectorAll('button');

buttons.forEach(button => button.addEventListener('click', adjustDisplay));