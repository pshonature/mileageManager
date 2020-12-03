let phoneNumber = null;
let inputAmount = null;
let sysMessage = null;

//=======================================
let MBOOK = { mb: [] };
//=======================================
function Mileage(amount) {
    this.amount = parseInt(amount);
    this.date = new Date();
}
//---------------------------------------
function MBook(phone) {
    this.phone = phone;
    this.mBook = []; // for storing Mileages
    this.mTotal = 0; // Total mileage amount
}

function mBookReport(mb) {
    let msg = `Phone:[${mb.phone}] `;
    msg += `적립 횟수:[${mb.mBook.length}]회 `;
    msg += ` 적립 총액:[${toCommaNumber(mb.mTotal)}]`;
    return msg;
}


function mBookAddMileage(mb, aMileage) {
    mb.mBook.push(aMileage);
    mb.mTotal += aMileage.amount;
}
//---------------------------------------

//=======================================
function getMileage() {
    let am = new Mileage(inputAmount.value.replace(/,/g, ""));
    return am;
}
//-----------------------------
// findMBook: MBOOK에서 휴대폰 번호와 일치하는 MBook을 찾는다. 
//  없으면 새 MBook 생성 저장 후 반환
function findMBook(phone) {
    for (let amb of MBOOK.mb) {
        if (amb.phone === phone)
            return amb;
    }
    let newMB = new MBook(phone);
    MBOOK.mb.push(newMB);
    return newMB;
}
//=========================================
function toCommaNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function touchNumber() {
    currentInput = this;
}

function touchButton() {
    this.blur();
    if (phoneNumber.value.length >= 13) {
        onoff(".save", "on");
        return;
    }
    phoneNumber.value += this.value;
    switch (phoneNumber.value.length) {
        case 3:
        case 8:
            phoneNumber.value += "-";
            break;
    }
    if (phoneNumber.value.length < 13) {
        onoff(".save", "off");
        onoff(".btnNumber", "on");
    } else {
        onoff(".save", "on");
        onoff(".btnNumber", "off");
    }
    onoff("#start010", "off");
}

function touchStart010() {
    if (phoneNumber.value.length <= 0) {
        phoneNumber.value = this.value + "-";
        this.disabled = true;
    }
}

function touchDelete() {
    onoff(".btnNumber", "on");
    onoff(".save", "off");
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
    if (phoneNumber.value.length > 0)
        onoff("#start010", "off");
    else
        onoff("#start010", "on");
}

function touchClear() {
    onoff(".btnNumber", "on");
    onoff(".save, #start010", "off");
    phoneNumber.value = "010-";
}

function keyDown() {
    alert(event.keyCode);
}

function onoff(target, value) {
    value = value.toUpperCase();
    value = (value == "ON") ? false : true;
    $(target).attr("disabled", value);
}

function touchCheck() {
    clearMessage();
    let nm = Math.random() * 100;
    nm = Math.floor(nm) * 1000;
    //https://mizzo-dev.tistory.com/65 (1000단위 콤마 삽입)
    inputAmount.value = toCommaNumber(nm);
    onoff(".btnNumber, .btnDelete, .btnClear, .cancel", "on");
    onoff(".amount, .save, #start010", "off");
    putMessage("적립할 휴대폰 번호를 입력해 주세요.");
}

function touchInput() {
    this.blur();
}

function afterSaving() {
    $("#amount").val("적립할 금액 확인 =>");
    putMessage("적립할 금액을 먼저 확인[Check] 해주세요.");
}

function touchSave() {
    let fmb = findMBook(phoneNumber.value);
    mBookAddMileage(fmb, new Mileage(inputAmount.value.replace(/,/g, "")));
    putMessage(mBookReport(fmb));


    onoff(".amount", "on");
    $(".btnClear").click();
    onoff(".save, .cancel, .btnNumber, .btnDelete, .btnClear", "off");
    $("#amount").val("저장되었습니다.");

    setTimeout(afterSaving, 5000);
}

function touchCancel() {
    putMessage("적립을 취소하였습니다.");
    onoff(".cancel", "off");
    $(phoneNumber).val("");
    setTimeout(function() {
        afterSaving();
        $("#amount").val("적립할 금액 확인 =>");
        putMessage("적립할 금액을 먼저 확인[Check] 해주세요.");
        $("#start010").click();
        onoff(".save, .cancel, .btnNumber, .btnDelete, .btnClear", "off");
        onoff(".amount", "on");
    }, 3000);
}

function putMessage(msg) {
    sysMessage.innerHTML = msg;
}

function clearMessage() {
    sysMessage.innerHTML = " ";
}
window.onload = function() {
    let strMBOOK = localStorage.getItem("MBOOK");
    if (strMBOOK == null) {
        MBOOK = { mb: [] };
    } else {
        MBOOK = JSON.parse(strMBOOK);
    }

    phoneNumber = document.getElementById("phoneNumber");
    inputAmount = document.getElementById("amount");
    sysMessage = document.getElementById("message");

    $(phoneNumber).focus(function() { $(phoneNumber).blur() });
    $(inputAmount).focus(function() { this.blur() });

    $(".btnNumber").click(touchButton);
    $(".btnDelete").click(touchDelete);
    $(".btnClear").click(touchClear);
    $("#start010").click(touchStart010);
    $(".amount").click(touchCheck);
    $("#amount").click(touchInput);
    $(".save").click(touchSave);
    $(".cancel").click(touchCancel);

    $("#start010").click();

    onoff(".save, .cancel, .btnNumber, .btnDelete, .btnClear", "off");
    putMessage("적립할 금액을 먼저 확인[Check] 해주세요.");
    $("#amount").val("적립할 금액 확인 =>");

};
window.onunload = function() {
    let strMBOOK = JSON.stringify(MBOOK);
    localStorage.setItem("MBOOK", strMBOOK);
}