let currentInput = null;

function goFocus(target = currentInput) {
    if (target == null) {
        target = document.getElementById("numFirst");
    }
    currentInput = target;
    target.focus();
}

function touchNumber() {
    currentInput = this;
}

function touchButton() {
    goFocus();
    currentInput.value += this.value;
    switch (currentInput.id) {
        case "numFirst":
            if (currentInput.value.length >= 3) {
                goFocus(document.getElementById("numSecond"));
            }
            break;
        case "numSecond":
            if (currentInput.value.length >= 4) {
                goFocus(document.getElementById("numThird"));
            }
            break;
        case "numThird":
            if (currentInput.value.length >= 4) {
                goFocus(document.getElementById("numFirst"));
            }
            break;
    } //end of switch
    goFocus();
}

window.onload = function() {
    $("input").click(touchNumber);
    $("button").click(touchButton);
};