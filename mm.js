let phoneNumber = null;


function touchNumber() {
    currentInput = this;
}

function touchButton() {
    this.blur();
    if (phoneNumber.value.length >= 13)
        return;
    phoneNumber.value += this.value;
    switch (phoneNumber.value.length) {
        case 3:
        case 8:
            phoneNumber.value += "-";
            break;
    }
}

function touchDelete() {
    let length = phoneNumber.value.length;
    switch (length) {
        case 0:
            return;
        case 9:
        case 4:
            phoneNumber.value = phoneNumber.value.slice(0, length - 1);
            break;
    }
    phoneNumber.value = phoneNumber.value.slice(0, phoneNumber.value.length - 1);
}

function touchClear() {
    phoneNumber.value = "";
}

function keyDown() {
    alert(event.keyCode);
}

window.onload = function() {
    phoneNumber = document.getElementById("phoneNumber");
    $(phoneNumber).focus(function() { $(phoneNumber).blur() });
    $("input").click(touchNumber);
    $(".btnNumber").click(touchButton);
    $(".btnDelete").click(touchDelete);
    $(".btnClear").click(touchClear);
    // $(document).keydown(keyDown);
};