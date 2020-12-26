/*
    Project: Mileage Manager
    for: 2020-2학기 웹개발기초II 기말과제 주제
    동의과학대학교 컴퓨터정보과
*/

// Global Variables, HTML 객체 접근용, window.onload에서 연결 초기화
let phoneNumber = null;
let inputAmount = null;
let sysMessage = null;
//=======================================
// Mileage 정보를 모두 모아두기 위한 객체, localStorage에는 이 객체만 저장함.
let MBOOK = { mb: [] };
//=======================================

// 출력할 메시지들을 모아서 관리하기 위한 객체
let msgLib = {
    greetings: "적립할 금액 확인 =>",
    checkFirst: "적립할 금액을 먼저 확인[V] 해주세요.",
    numberPlease: "적립할 휴대폰 번호를 입력해 주세요.",
    confirmDelete: "지금까지 저장된 마일리지 정보를 완전히 삭제할까요?",
    thanksBeMyVIP: "첫 거래 감사합니다. 단골 고객이 되어주세요 ^^."
}

// 단위 마일리지 정보 객체 생성자 함수
// amount: 구입 금액
// date:  구입 시간
function Mileage(amount) {
    this.amount = parseInt(amount);
    this.date = new Date();
}
//---------------------------------------
// 휴대폰 번호별 마일리지 정보 관리를 위한 객체 생성자 함수
// 폰번호, 마일리지 정보 저장할 배열, 합계금액(매번 합계 계산을 피하기 위한 속성)
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
// 반환값: number 앞에 0이 채워진 digitSize 길이의 문자열
//  ~> number의 길이가 digitSize보다 크면 number 길이의 문자열 반환
//-------------------------------------------------------------
function putZero(number, digitSize = 2) {
    let ns = number.toString(); //일단, number를 문자열로 변환
    if (ns.length < digitSize) //digitSize보다 길이가 작으면
        while (ns.length < digitSize) //digitSize 크기가 되도록 
            ns = "0" + ns; //앞에 0을 추가
    return ns;
}

//-------------------------------------------------------------
// toMyDateForm(date) : 
//  -date: date 객체
// 반환값: "YYYY-MM-DD HH:MM" 형식으로 날짜 값 반환
//-------------------------------------------------------------
function toMyDateForm(date) {
    let dstr = date.getFullYear() + "-" + putZero(date.getMonth() + 1) + "-";
    dstr += putZero(date.getDate()) + " ";
    dstr += putZero(date.getHours()) + ":";
    dstr += putZero(date.getMinutes());
    return dstr;
}

function precheckCurrentPhone(checkTop = false) {
    let mb = searchMBook(phoneNumber.value); //입력된 폰번호를 MBOOK에서 검색
    if (mb) { //적립 이력이 있는 번호가 발견되었으면
        putMessage(mBookReport(mb)); //해당 번호의 기본 적립 현황을 먼저 메시지로 출력
        $("#mLogCount").html(mb.mBook.length); //적립 세부 정보를 차례로 출력
        $("#mLogTotal").html(toCommaNumber(mb.mTotal));
        $("#mileageLog").html(mileageTokenList(mb.mBook, checkTop));
        $("#mileageLog").slideDown();
    } else {
        putMessage(msgLib.thanksBeMyVIP);
        mlgLogClear();
    }
}
//---v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v-v
// 버튼 누름 효과 표현을 위한 클래스 추가/삭제 이벤트 핸들러
function btnNumberDown() {
    $(this).addClass("btnNumberDown")
}

function btnNumberUp() {
    $(this).removeClass("btnNumberDown")
}
//---^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^-^

//-------------------------------------------------------------
// touchButton() 
// 숫자 버튼(0-9) 이벤트 핸들러
//-------------------------------------------------------------
function touchButton() {
    this.blur(); //버튼 클릭하였을 때, 표시되는 선택 효과(테두리 강조 표시) 무효 처리
    if (phoneNumber.value.length >= 13) { //이미 폰번호 입력이 완성(13자리 입력) 되었으면
        return; //더 이상 다른 처리를 하지 않고 리턴 (무반응 처리)
    }
    phoneNumber.value += this.value; //현재까지 입력된 값에 클릭한 버튼의 값 추가
    switch (phoneNumber.value.length) { //버튼 값 추가한 뒤에 후처리
        case 3:
        case 8:
            phoneNumber.value += "-"; //3자리, 8자리 입력된 직후라면 '-' 추가
            break;
    }
    if (phoneNumber.value.length < 13) { //폰번호 입력 완료 이전이면
        onoff(".save", "off"); //[저장] 버튼 감추기
        onoff(".btnNumber", "on"); //숫자 버튼을 계속 표시하기
        putMessage(msgLib.numberPlease); //폰번호 입력 요청 메시지 출력
    } else { //폰번호 입력 완료 되었으면
        precheckCurrentPhone(); //입력된 번호를 MBOOK에서 검색한 결과 출력
        onoffFade(".save", "on"); //[저장] 버튼 표시하기
        onoff(".btnNumber", "off"); //숫자 버튼 감추기
    }
    onoff("#start010", "off"); //숫자 버튼을 클릭한 상황이면 이미 [010]버튼은 필요 없으므로 감춘다.
}
//-------------------------------------------------------------
// touchStart010() 
// [010] 버튼 이벤트 핸들러
//-------------------------------------------------------------
function touchStart010() {
    if (phoneNumber.value.length <= 0) { //폰번호 입력란이 완전히 비어 있으면
        phoneNumber.value = this.value + "-"; // "010-" 문자열을 입력하고
        // this.disabled = true; //[010] 버튼 동작 중지 처리.
        onoff("#start010", "off");
    }
}

//-------------------------------------------------------------
// touchDelete() 
// [BACK] 버튼 이벤트 핸들러
//-------------------------------------------------------------
function touchDelete() {
    let length = phoneNumber.value.length;
    if (length <= 0)
        return;
    switch (length) { //폰번호 구분 문자 '-' 연동 삭제 처리
        case 4:
        case 9:
            phoneNumber.value = phoneNumber.value.slice(0, length - 1);
            break;
        case 13:
            mlgLogClear(); //폰번호를 1개라도 지웠으면 폰번호 미완성이므로 폰관련 마일리지 기록은 무조건 삭제
            $("#mileageLog").slideUp(); //마일리지 정보 영역 닫기
            putMessage(msgLib.numberPlease); //폰번호 입력 요청 메시지 출력
            $("#mileageLog").html(""); //마일리지 정보 출력(되었을 수 있는) 영역 삭제
            onoff(".btnNumber", "on"); //숫자 버튼 표시 (폰번호 입력을 계속 할 수 있도록)
            onoff(".save", "off"); //[저장] 버튼 감추기 (폰번호 미완성 상태이므로)
            break;
    }
    phoneNumber.value = phoneNumber.value.slice(0, phoneNumber.value.length - 1);
    //폰번호 삭제 처리 후, 폰번호 입력 영역에 남은 내용이 없으면 [010] 표시, 아니면 삭제.
    if (phoneNumber.value.length <= 0)
        onoff("#start010", "on");
    else
        onoff("#start010", "off");
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

function onoffBackup(target, value) {
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