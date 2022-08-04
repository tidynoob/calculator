// CALCULATOR FUNCTIONS

let add = (x, y) => { return x + y };

let subtract = (x, y) => { return x - y };

let multiply = (x, y) => { return x * y };

let divide = (x, y) => { return x / y };

let operate = (x, y, foo) => {
    return foo(x, y)
}

// CLICK FUNCTIONS

let adjustDisplay = (e) => {

    let displayText = document.querySelector('.displayText');
    let text = (displayText.textContent.replaceAll(',', '') || "");
    // console.log(text);


    let buttonText = (e.target.textContent || e.target.innerText);
    // console.log(buttonText);

    if (parseInt(buttonText)) {
        text += String(buttonText);
        displayText.textContent = Number(text).toLocaleString('en-US');

    } else if (buttonText == '.') {
        if (text.slice(-1) == '.') return;
        text += String(buttonText);
        displayText.textContent = text;
    }
}

let buttons = document.querySelectorAll('button');
// console.log(buttons);

buttons.forEach(button => button.addEventListener('click', adjustDisplay));