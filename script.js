// CALCULATOR FUNCTIONS

let add = (x, y) => { return x + y };

let subtract = (x, y) => { return x - y };

let multiply = (x, y) => { return x * y };

let divide = (x, y) => { return x / y };

let operate = (x, y, foo) => {
    return foo(x, y)
}

// CLICK FUNCTIONS

let adjustText = (text, buttonText, displayText) => {
    if (parseInt(buttonText)) {
        text += String(buttonText);
        displayText.textContent = Number(text).toLocaleString('en-US');

    } else {
        switch (buttonText) {
            // case '.':
            //     if (text.slice(-1) == '.') return;
            //     text += String(buttonText);
            //     displayText.textContent = text;
            //     break;

            case '+/-':
                if (text == '') return;
                if (text.charAt(0) == '-') {
                    text = text.substring(1);
                    displayText.textContent = Number(text).toLocaleString('en-US');
                } else {
                    text = '-' + text;
                    displayText.textContent = Number(text).toLocaleString('en-US');
                }
                break;

            case 'AC':
                displayText.textContent = '';
                break;

            case 'CE':
                displayText.textContent = '';
                break;        
                
            default:
                if (!parseInt(text.slice(-1))) return;
                text = displayText.textContent + String(buttonText);
                displayText.textContent = text;
        }
    }

}

let adjustDisplay = (e) => {

    let displayText = document.querySelector('.displayText');
    let text = (displayText.textContent.replaceAll(',', '') || "");
    // console.log(text);

    let buttonText = (e.target.textContent || e.target.innerText);
    // console.log(buttonText);

    adjustText(text, buttonText, displayText);
}

let buttons = document.querySelectorAll('button');
// console.log(buttons);

buttons.forEach(button => button.addEventListener('click', adjustDisplay));