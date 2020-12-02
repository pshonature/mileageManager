let phoneNumber = null;
let inputAmount = null;


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
    $("#start010").attr("disabled", true);
}

function touchStart010() {
    if (phoneNumber.value.length <= 0) {
        phoneNumber.value = this.value + "-";
        this.disabled = true;
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
    if (phoneNumber.value.length <= 0)
        $("#start010").attr("disabled", false);
}

function touchClear() {
    phoneNumber.value = "010-";
    $("#start010").attr("disabled", true);
}

function keyDown() {
    alert(event.keyCode);
}

function touchCheck() {
    let nm = Math.random() * 100;
    nm = Math.floor(nm) * 1000;
    //https://mizzo-dev.tistory.com/65 (1000단위 콤마 삽입)
    inputAmount.value = nm.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    $(this).attr("disabled", true);
    $(".save").attr("disabled", false);
}

function touchInput() {
    alert(this.value.replace(/,/g, ""));
}

function touchSave() {
    $(".amount").attr("disabled", false);
    $("#amount").val("저장되었습니다.");
    $(".btnClear").click();
    $(this).attr("disabled", true);
}
window.onload = function() {
    phoneNumber = document.getElementById("phoneNumber");
    inputAmount = document.getElementById("amount");
    $(phoneNumber).focus(function() { $(phoneNumber).blur() });
    $("input").click(touchNumber);
    $(".btnNumber").click(touchButton);
    $(".btnDelete").click(touchDelete);
    $(".btnClear").click(touchClear);
    $("#start010").click(touchStart010);
    $(".amount").click(touchCheck);
    $("#amount").click(touchInput);
    $("#start010").click();
    $(".save").click(touchSave);

    // $(document).keydown(keyDown);
};