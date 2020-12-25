let phoneNumber = null;
let inputAmount = null;
let sysMessage = null;

let msgLib = {
        greetings: "적립할 금액 확인 =>",
        checkFirst: "적립할 금액을 먼저 확인[V] 해주세요.",
        numberPlease: "적립할 휴대폰 번호를 입력해 주세요.",
        confirmDelete: "지금까지 저장된 마일리지 정보를 완전히 삭제할까요?",
        thanksBeMyVIP: "첫 거래 감사합니다. 단골 고객이 되어주세요 ^^."
    }
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

function mileageToken(m, tag) {
    let token = `<${tag} class="mlgAmount">${toCommaNumber(m.amount)}</${tag}> `;
    token += `<${tag} class="mlgDate">${toMyDateForm(m.date)}</${tag}> `;
    return token;
}

function mileageTokenList(mlist, checkTop = false) {
    let list = "";
    let count = 1;
    let topClass = (checkTop) ? "background-color: lightpink;" : "";
    for (let m of mlist) {
        list += `<div style='${topClass} padding-top: 3px; border-bottom: 1px dotted gray;'>`;
        list += `<div class="mlgNumber">${count++}</div> ` + mileageToken(m, "div") + "<br>";
        list += "</div>";
        topClass = "";
    }
    return list;
}

function phoneToken(mb, tag) {
    let token = `<${tag} class="mlgAmount">${toCommaNumber(mb.mTotal)}</${tag}> `;
    token += `<${tag} class="mlgDate">${mb.phone} (${mb.mBook.length})</${tag}> `;
    return token;
}

function phoneTokenList(checkTop = false) {
    let list = "";
    let count = 1;
    let topClass = (checkTop) ? "background-color: lightpink;" : "";
    for (let mb of MBOOK.mb) {
        list += `<div style='${topClass} padding-top: 3px; border-bottom: 1px dotted gray;'>`;
        list += `<div class="mlgNumber">${count++}</div> ` + phoneToken(mb, "div") + "<br>";
        list += "</div>";
        topClass = "";
    }
    return list;
}

function mBookAddMileage(mb, aMileage) {
    mb.mBook.unshift(aMileage);
    mb.mTotal += aMileage.amount;
}
//---------------------------------------
function totalMBOOK() {
    let sum = 0;
    for (let mb of MBOOK.mb) {
        sum += mb.mTotal;
    }
    return sum;
}
//=======================================
function showPhoneBook() {
    if ($("#amount").val() != msgLib.greetings)
        return;
    let mb = MBOOK.mb;

    $("#phoneCount").html(mb.length);
    $("#phoneTotal").html(toCommaNumber(totalMBOOK()));
    $("#phoneLog").html(phoneTokenList());
    $("#phoneZone").slideDown();
}
//=======================================
function getMileage() {
    let am = new Mileage(inputAmount.value.replace(/,/g, ""));
    return am;
}
//-----------------------------
// findOrNewMBook: MBOOK에서 휴대폰 번호와 일치하는 MBook을 찾는다. 
//  없으면 새 MBook 생성 저장 후 반환
function findOrNewMBook(phone) {
    let mb = searchMBook(phone);
    if (mb == null) {
        mb = new MBook(phone);
        MBOOK.mb.unshift(mb);
    }
    return mb;
}
//-------------------------------------------------------------
// searchMBook(phone)
//  -phone: 휴대폰 번호
// MBOOK에서 phone과 일치하는 MBook을 검색한다.
// 반환값: 검색된 MBoook 또는 null
//-------------------------------------------------------------
function searchMBook(phone) {
    for (let amb of MBOOK.mb) {
        if (amb.phone === phone)
            return amb;
    }
    return null;
}
//-------------------------------------------------------------
// toCommaNumber(n)
//  -n: number 또는 string number
// 반환값: 1000단위마다 ','를 추가한 문자열 
// https://mizzo-dev.tistory.com/65 (1000단위 콤마 삽입)
//   => regular expression으로 변환하는 내용 참조
//-------------------------------------------------------------
function toCommaNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//-------------------------------------------------------------
// putZero(number, digitSize=2)
//  -number: a number to go
//  -digitSize: 완성할 문자열 길이 (default: 2)
// 반환값: number 앞에 0이 채워진 digiitSize 길이의 문자열
//  ~> number의 길이가 digitSize보다 크면 number 길이의 문자열 반환
//-------------------------------------------------------------
function putZero(number, digitSize = 2) {
    let ns = number.toString(); //일단, number를 문자열로 변환
    if (ns.length < digitSize) //digitSize보다 길이가 작으면
        while (ns.length < digitSize) //digitSize 크기가 되도록 앞에 0을 추가
            ns = "0" + ns;
    return ns;
}

function toMyDateForm(date) {
    let dstr = date.getFullYear() + "-" + putZero(date.getMonth() + 1) + "-";
    dstr += putZero(date.getDate()) + " ";
    dstr += putZero(date.getHours()) + ":";
    dstr += putZero(date.getMinutes());
    return dstr;
}

function precheckCurrentPhone(checkTop = false) {
    let mb = searchMBook(phoneNumber.value);
    if (mb) { //적립 이력이 있는 번호
        putMessage(mBookReport(mb));
        $("#mLogCount").html(mb.mBook.length);
        $("#mLogTotal").html(toCommaNumber(mb.mTotal));
        $("#mileageLog").html(mileageTokenList(mb.mBook, checkTop));
        $("#mileageLog").slideDown();
    } else {
        putMessage(msgLib.thanksBeMyVIP);
        mlgLogClear();
    }
}

function btnNumberDown() {
    $(this).addClass("btnNumberDown")
}

function btnNumberUp() {
    $(this).removeClass("btnNumberDown")
}

function touchButton() {
    this.blur();
    if (phoneNumber.value.length >= 13) {
        // onoff(".save", "on");
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
        putMessage(msgLib.numberPlease);
    } else {
        precheckCurrentPhone();
        onoffFade(".save", "on");
        onoffFade(".btnNumber", "off");
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
    mlgLogClear();
    $("#mileageLog").slideUp();
    putMessage(msgLib.numberPlease);
    $("#mileageLog").html("");
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

function mlgLogClear() {
    $("#mileageLog").html("");
    $("#mLogCount").html("-");
    $("#mLogTotal").html("-");
}

function touchClear() {
    mlgLogClear();
    onoff(".btnNumber", "on");
    onoff(".save, #start010", "off");
    phoneNumber.value = "010-";
    putMessage(msgLib.numberPlease);
}

function onoffBakup(target, value) {
    value = value.toUpperCase();
    value = (value == "ON") ? false : true;
    $(target).attr("disabled", value);
}

function onoff(target, value) {
    value = value.toUpperCase();
    value = (value == "ON") ? false : true;
    if (value) {
        $(target).hide();
    } else {
        $(target).show();
    }
}

function onoffFade(target, value) {
    value = value.toUpperCase();
    value = (value == "ON") ? false : true;
    if (value) {
        $(target).fadeOut(1000);
    } else {
        $(target).fadeIn(1000);
    }
}

function touchCheck() {
    clearMessage();
    let nm = 0;
    do {
        nm = Math.random() * 100;
        nm = Math.floor(nm) * 1000;
    } while (nm <= 0);
    inputAmount.value = toCommaNumber(nm);
    onoff(".btnNumber, .btnDelete, .btnClear, .cancel", "on");
    onoff(".amount, .save, #start010", "off");
    putMessage(msgLib.numberPlease);
    // $(".btnClear").click();
    phoneNumber.value = "010-";
    $("#mlogzone").slideDown();
    $("#phoneZone").hide();
}

function touchInput() {
    this.blur();
}

function afterSaving() {
    $("#amount").val(msgLib.greetings);
    putMessage(msgLib.checkFirst);
    onoff(".amount", "on");
    onoff(".btnNumber, .btnDelete, .btnClear", "off");
    onoffFade(".save, .cancel", "off");
    phoneNumber.value = "";
    mlgLogClear();
}

function touchSave() {
    let fmb = findOrNewMBook(phoneNumber.value);
    mBookAddMileage(fmb, new Mileage(inputAmount.value.replace(/,/g, "")));
    putMessage(mBookReport(fmb));
    precheckCurrentPhone(true);


    // $(".btnClear").click();
    onoffFade(".save, .cancel", "off");
    onoff(".amount, .btnNumber, .btnDelete, .btnClear", "off");


    $("#mileageLog").slideUp(2500);
    $("#mlogzone").slideUp(2500);
    sweepInputTarget(phoneNumber);
    sweepInputTarget(inputAmount);
    setTimeout(function() { $("#amount").val("저장되었습니다."); }, 2500);
    setTimeout(afterSaving, 3000);
}

function sweepInputTarget(target) {
    let killLast = function() {
        target.value = target.value.slice(1);
    }
    let length = target.value.length;
    let interval = 2500 / length;
    for (i = 1; i <= length; i++)
        setTimeout(killLast, interval * i);
}

function touchCancel() {
    putMessage("적립을 취소하였습니다.");
    sweepInputTarget(inputAmount);
    sweepInputTarget(phoneNumber);
    onoff(".cancel", "off");
    // $(phoneNumber).val("");
    onoff(".save, .cancel, .btnNumber, .btnDelete, .btnClear", "off");
    $("#mileageLog").slideUp(2500);
    $("#mlogzone").slideUp(2500);

    mlgLogClear();

    setTimeout(function() {
        afterSaving();
        $("#amount").val(msgLib.greetings);
        putMessage(msgLib.checkFirst);
        phoneNumber.value = "010-";
        onoff(".amount", "on");
    }, 3000);
}

function putMessage(msg) {
    sysMessage.innerHTML = msg;
}

function clearMessage() {
    sysMessage.innerHTML = "";
}

function initMBOOK() {
    MBOOK = { mb: [] };
    saveMBOOK();
}

function refreshMBOOK() {
    for (let mb of MBOOK.mb) {
        mb.mTotal *= 1;
        for (let m of mb.mBook) {
            m.amount *= 1;
            m.date = new Date(m.date);
        }
    }
}

function initMBOOKByFooterClick() {
    let ans = confirm(msgLib.confirmDelete);
    if (ans) {
        initMBOOK();
        location.reload();
    }
}

function readMBOOK() {
    let strMBOOK = localStorage.getItem("MBOOK");
    if (strMBOOK == null) {
        initMBOOK();
    } else {
        MBOOK = JSON.parse(strMBOOK);
        refreshMBOOK();
    }
}

function saveMBOOK() {
    let strMBOOK = JSON.stringify(MBOOK);
    localStorage.setItem("MBOOK", strMBOOK);
}

window.onload = function() {
    readMBOOK();

    phoneNumber = document.getElementById("phoneNumber");
    inputAmount = document.getElementById("amount");
    sysMessage = document.getElementById("message");

    $(phoneNumber).focus(function() { $(phoneNumber).blur() });
    $(inputAmount).focus(function() { this.blur() });

    $(".btnNumber").click(touchButton);
    // $(".btnNumber").mousedown(btnNumberDown).mouseup(btnNumberUp);
    $(".btnDelete").click(touchDelete);
    $(".btnClear").click(touchClear);
    $("#start010").click(touchStart010);
    $(".amount").click(touchCheck);
    $("#amount").click(touchInput);
    $(".save").click(touchSave);
    $(".cancel").click(touchCancel);
    $(".footer").click(initMBOOKByFooterClick);
    $("h1").click(showPhoneBook);
    $("#phoneZone").click(function() { $(this).slideUp(); });

    $("#start010").click();

    onoff(".save, .cancel, .btnNumber, .btnDelete, .btnClear", "off");
    putMessage(msgLib.checkFirst);
    $("#amount").val(msgLib.greetings);
    mlgLogClear();
    $("#mlogzone").hide();
    $("#phoneZone").hide();

};
window.onunload = saveMBOOK;