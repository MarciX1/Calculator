const FinalResult = document.querySelector(".h1");
const Result = document.querySelector(".h3");
const historyBtn = document.querySelector(".historyBtn");
const backspaceBtn = document.querySelector(".backspaceBtn");
const clearBtn = document.querySelector(".clearBtn");
const Buttons = document.querySelectorAll(".btn");
const equalBtn = document.querySelector(".equalBtn");
const historyDiv = document.querySelector(".history-div");
const deleteHistory = document.querySelector(".deleteHistory");
const historyContainer = document.querySelector(".historyContainer");
const plusAndMinus = document.querySelector(".plusAndMinus");

let chars = 0;
let operatorCount = 0;
let plusMinusCount = 0;
backspaceBtn.classList.add("backspaceBtnDisabled");
historyBtn.classList.add("historyBtnDisabled");

// Displaying clicked buttons
Buttons.forEach(btns => btns.addEventListener("click", (e) => {

    if (chars < 16) {

        let value = e.target.getAttribute("data-num");

        if (chars === 0 && (value === "*" || value === "/" || value === "." || value === "+" || value === "-")) {
        }   else if (value === "+" || value === "-" || value === "*" || value === "/" || value === ".") {
                if (operatorCount < 1) {
                    FinalResult.innerHTML += value;
                    operatorCount++;
                }
        }   else {
                FinalResult.innerHTML += value;
                chars++;
                operatorCount = 0;
                evalResults();
                charsCounter();
        }

    }   else if (chars === 16) {
        alert("Max Chars is 16");
    }

    decChar();
    
}));

// Clear results
clearBtn.addEventListener("click", () => {
    FinalResult.innerHTML = "";
    Result.innerHTML = FinalResult.innerHTML;
    chars = 0;
    operatorCounter();
    operatorCount = 0;
    charsCounter();
    plusMinusCount = 0;
    decChar();
});

// Eval results div
equalBtn.addEventListener("click", () => {
    equalHistory();
    evalResultsFinal();
    decChar();
    saveData();
});

// Put plus before the number and you can change to minus if the counter increased
plusAndMinus.addEventListener("click", plusAndMinusClick);

function plusAndMinusClick() {

    plusMinusCount++;
    if (plusMinusCount === 1) { 
        FinalResult.innerHTML = "-" + FinalResult.innerHTML;
    } else if (plusMinusCount === 2) {
        if (FinalResult.innerHTML.startsWith("-")) {
            FinalResult.innerHTML = FinalResult.innerHTML.replace("-", "+");
        } else {
            FinalResult.innerHTML = FinalResult.innerHTML.replace("+", "-");
        }
        plusMinusCount = 1;
    }
    evalResults();

}

// Eval finalresult div
function evalResultsFinal() {
    let evalResult = eval(FinalResult.textContent);
    let evalResultStr = String(evalResult);
    let evalResultStrFloat = String(evalResult.toFixed(2));

    FinalResult.classList.add("finalActive");
    Result.classList.add("resultActive");
    const timeoutFinal = setTimeout(function() {
        FinalResult.classList.remove("finalActive");
    }, 500)
    const timeoutResult = setTimeout(function() {
        Result.classList.remove("resultActive");
    }, 1000)

    if (Number.isInteger(evalResult)) {
        Result.innerHTML = evalResult;
        timeoutResult;
        timeoutFinal;
        FinalResult.innerHTML = evalResult;
        chars = evalResultStr.replace(/[+\-*/.]/g, '').length;
    } else {
        Result.innerHTML = evalResult.toFixed(2);
        timeoutResult;
        timeoutFinal;
        FinalResult.innerHTML = evalResult.toFixed(2);
        chars = evalResultStrFloat.replace(/[+\-*/.]/g, '').length;
    }
    
}

// Eval FinalResult div and put to Result div. Then count the characters
function evalResults() {
    let evalResult = eval(FinalResult.textContent);

    if (Number.isInteger(evalResult)) {
        Result.innerHTML = evalResult;
        chars = FinalResult.textContent.replace(/[+\-*/.]/g, '').length;
    } else {
        Result.innerHTML = evalResult.toFixed(2);
        chars = FinalResult.textContent.replace(/[+\-*/.]/g, '').length;
    }
}

// Equal on click put FinalResult Div to the historyDiv
function equalHistory() {
    const operators = ['+', '-', '*', '/', '.'];
    const includeOperators = operators.some(function(operator) {
        return FinalResult.innerHTML.includes(operator);
    });

    if (includeOperators) {

        // Check duplicate buttons
        const historyButtonContent = FinalResult.innerHTML;

        const duplicateButton = Array.from(historyDiv.getElementsByClassName("historyButton")).find(function(button) {
            return button.innerHTML === historyButtonContent;
        });

        if (duplicateButton) {
            return;
        }

        const historyDivs = document.createElement("div");
        historyDivs.classList.add("historyDivs");
    
        const historyButton = document.createElement("button");
        historyButton.classList.add("historyButton");
        historyButton.innerHTML = FinalResult.innerHTML;
    
        historyButton.addEventListener("click", loadHistory);

        historyDivs.appendChild(historyButton);
        historyDiv.appendChild(historyDivs);
        historyBtn.classList.remove("historyBtnDisabled");   
    } 

}

// Paste historyButton texcontent into finalresult.innerhtml
function loadHistory() {
    FinalResult.innerHTML = this.textContent;
    Result.innerHTML = FinalResult.innerHTML;
    chars = FinalResult.textContent.replace(/[+\-*/.]/g, '').length;
    const lastChars = FinalResult.innerHTML.slice(-1);
    const operators = ['+', '-', '*', '/', '.'];
    const includeOperators = operators.some(function(operator) {
        return FinalResult.innerHTML.includes(operator);
    });

    charsCounter();
    decChar();
    if (typeof lastChars === "number") {
      operatorCount = 1;
      operatorCounter();
    } else if (lastChars === includeOperators) {
      operatorCount = 0;
      operatorCounter();
    }
    plusMinusCount = 1;
}

// If not contains history button class then can toggle
historyBtn.addEventListener("click", () => {
    if (!(historyBtn.classList.contains("historyBtnDisabled"))) {
        historyContainer.classList.toggle("historyOpen");
    } 
});

// Delete history div
deleteHistory.addEventListener("click", () => {
    historyDiv.innerHTML = "";
    historyBtn.classList.add("historyBtnDisabled");
    historyContainer.classList.remove("historyOpen");
    saveData();
});  

// Backspace -1
backspaceBtn.addEventListener("click", () => {

    operatorCount++;

    if (chars > 0) {

        const lastChar = FinalResult.innerHTML.slice(-1);
        const isOperator = ['+', '-', '*', '/', "."].includes(lastChar);

        if (isOperator) {
            operatorCount--;
            operatorCounter();
        } else {
            chars--;
        }

        FinalResult.innerHTML = FinalResult.innerHTML.slice(0, -1);
        charsCounter();

    } 
    Result.innerHTML = FinalResult.innerHTML;
    decChar();
    
});

// If operatorCount 0 then increase if 1 then decrease
function operatorCounter() {
    if (operatorCount === 0) {
        operatorCount++;
    } else if (operatorCount === 1) {
        operatorCount--;
    }
}

// If chars 0 then add a class, else remove it
function charsCounter() {
    if (chars === 0) {
        backspaceBtn.classList.add("backspaceBtnDisabled");
    } else {
        backspaceBtn.classList.remove("backspaceBtnDisabled");
    }
}

function decChar() {
    const fontSizeLength = FinalResult.textContent.length;
    if (fontSizeLength >= 24) {
        FinalResult.style.fontSize = "1.3em";
        Result.style.fontSize = "0.76em";
    }   else if (fontSizeLength >= 16) {
        FinalResult.style.fontSize = "1.65em";
        Result.style.fontSize = "0.96em";
    }   else {
        FinalResult.style.fontSize = "2em";
        Result.style.fontSize = "1.17em";
    }
}

// HAVE TO UPDATE SAVEDATA AND SHOWTASK!!!!
function saveData() {
    const historyContent = historyDiv.innerHTML;
    localStorage.setItem("historyContent", historyContent);
}

// When the user go back after that load back historydivs innerhtml
function showTask() {
    const historyContent = localStorage.getItem("historyContent");
    if (historyContent) {
        historyDiv.innerHTML = historyContent;
        historyBtn.classList.remove("historyBtnDisabled");
    }

    const historyButtons = historyDiv.querySelectorAll(".historyButton");
    historyButtons.forEach((button) => {
        button.addEventListener("click", loadHistory);
    });
}
showTask();