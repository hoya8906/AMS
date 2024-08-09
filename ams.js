/*
작성자 : 최규호
*/

// 모듈 로드 및 전역 변수 생성
// const readline = require('readline');
const { createInterface } = require("readline");
const fs = require("fs");
const Account = require("./Account")
const MinusAccount = require("./MinusAccount")
const AccountRepository = require("./AccountRepository")
const Experiments = require("./Experiments")
const filePath = "./accounts.json"; // 계좌 정보 저장 파일

// 변수와 메소드 초기화
const regexpMoney = /^[1-9]\d*$/; // Money 입력값 정규표현식
let accounts = [];
let menu = "";
let tempArray, inputNo, inputMoney, inputKey;

const accountRepository = new AccountRepository;
const experiments = new Experiments();

// 헤더 출력
const printHeader = function () {
    console.log("-------------------------------------------------------------------");
    console.log("  계좌구분 \t 계좌번호 \t 예금주 \t 잔고(대출금)");
    console.log("-------------------------------------------------------------------");
}

// 메뉴 출력
function showMenu(text) {
    menu = text;
    console.log(`\n[${text} 메뉴]`);
}

// 목록 간편 출력
function printList() {
    console.clear();
    printHeader();
    const sortedAccounts = [...accountRepository.accounts].sort((a, b) => (a instanceof MinusAccount) - (b instanceof MinusAccount) || a.balance - b.balance);
    sortedAccounts.forEach(account => console.log(account.toString()));
}

// 파일 초기화
function checkFileExists(filePath) {
    try {
        // 파일이 있으면 불러오기
        accounts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log("기존 계좌 정보를 파일에서 불러왔습니다.");

    } catch (err) {
        // 파일이 없으면 생성하기
        fs.writeFileSync(filePath, JSON.stringify(accounts), error => error ? "" : console.log(error));
        console.log(`기존 계좌가 없어 ${filePath} 파일을 새로 생성했습니다.`);
    }
}

// 계좌 정보를 파일에 저장
function saveAccountsToFile() {
    try {
        const data = JSON.stringify(accountRepository.accounts, null, 2);
        fs.writeFileSync(filePath, data);
    } catch (err) {
        console.error("파일 저장 중 오류가 발생했습니다:", err);
    }
}

// 값 오류 메세지
function inputError() {
    console.log("올바른 값을 입력해주세요.")
}

// 입력값 유효성 검증
async function validate(text, regexp, option) {
    while (true) {
        let inputNum = await readLine(text);
        if (inputNum === 0) break;
        if (!regexp.test(inputNum)) {
            inputError();
            continue;
        }

        if (option === 1) {
            // 계좌가 있을 때 전용
            if (accountRepository.findByNumber(inputNum)) {
                return inputNum;
            } else {
                console.log("입력하신 계좌는 없는 계좌입니다.");
            }
        } else if (option === 2) {
            // 계좌가 없을 때 전용
            if (!accountRepository.findByNumber(inputNum)) {
                return inputNum;
            } else {
                console.log("입력하신 계좌는 이미 등록된 계좌입니다.");
            }
        } else {
            // 계좌 외 입력값 검증결과 반환
            return inputNum;
        }
    }
}

checkFileExists(filePath);

// 불러온 계좌 정보 데이터화
accounts.forEach(account => {
    if (account.rentMoney !== undefined) {
        accountRepository.addAccount(new MinusAccount(
            account.accountNo, account.accountOwner, parseInt(account._password), parseInt(account.balance), parseInt(account.rentMoney)
        ))
    } else {
        accountRepository.addAccount(new Account(
            account.accountNo, account.accountOwner, parseInt(account._password), parseInt(account.balance)
        ))
    }
})

// 키보드 입력을 위한 인터페이스 생성
const consoleInterface = createInterface({
    input: process.stdin,
    output: process.stdout,
});

// 키보드 입력 받기
const readLine = function (message) {
    return new Promise((resolve) => {
        consoleInterface.question(message, (userInput) => {
            resolve(userInput);
        });
    });
}

// 메뉴 출력
const printMenu = function () {
    console.log("---------------------------------------------------------------------");
    console.log("1.등록 | 2.조회 | 3.입금 | 4.출금 | 5.대출 | 6.상환 | 7.삭제 | 0.종료");
    console.log("---------------------------------------------------------------------");
}

// 주 동작
const app = async function () {
    await experiments.drawHeader();
    let running = true;
    while (running) {
        printMenu();
        experiments.loadingBar();
        let header = "";
        let menuNum = parseInt(await readLine("> "));
        switch (menuNum) {
            case 1:
                console.clear();
                printList();
                showMenu("계좌 등록")
                header =
                    "-------------------------------\n" +
                    "1. 일반 계좌 | 2. 마이너스 계좌\n" +
                    "-------------------------------";
                console.log(header);
                let no = parseInt(await readLine("> "));
                let accountNum = await validate("- 계좌번호(숫자 10~14자리) : ", /^\d{10,14}$/, 2)
                let accountOwner = await validate("- 예금주명(한글 또는 영어 대문자 2~6자리) : ", /^[가-힣A-Z]{2,6}$/)
                let password = await validate("- 비밀번호(숫자 4자리) : ", /^\d{4}$/)
                let initMoney = await validate("- 입금액 : ", regexpMoney)
                let rentMoney = 0;

                if (no === 1) {
                    printHeader();
                    accountRepository.addAccount(new Account(accountNum, accountOwner, password, initMoney));
                    console.clear();
                    console.log(`[일반 ${menu} 완료]`);
                    console.log(`계좌 : ${accountNum} | 입금액 : ${initMoney}원`);
                } else {
                    rentMoney = await validate("- 대출금액 : ", regexpMoney)
                    printHeader();
                    accountRepository.addAccount(new MinusAccount(accountNum, accountOwner, password, initMoney, rentMoney));
                    console.clear();
                    console.log(`[마이너스 ${menu} 완료]`);
                    console.log(`계좌 : ${accountNum} | 입금액 : ${initMoney}원 | 대출액 : ${rentMoney}원`);
                }
                tempArray = accountRepository.findByNumber(accountNum)

                saveAccountsToFile();
                break;

            case 2: // 전체계좌 조회
                printList();
                showMenu("전체 조회")
                
                break;

            case 3: // 입금
                printList();
                showMenu("입금")

                inputNo = await validate("- 계좌번호 : ", /^\d{10,14}$/, 1)
                inputMoney = await validate("- 입금액 : ", regexpMoney)

                tempArray = accountRepository.findByNumber(inputNo)
                tempArray.deposit(Number(inputMoney));

                saveAccountsToFile();
                console.clear();
                console.log(`계좌 : ${inputNo} | ${menu}액 : ${inputMoney}원 | 잔액 : ${tempArray.balance}원`);
                break;

            case 4: // 출금
                printList();
                showMenu("출금");

                let outputNo = await validate("- 계좌번호 : ", /^\d{10,14}$/, 1);
                let pw = await validate("- 비밀번호 : ", /^\d{4}$/);
                let outputMoney = await validate("- 출금액 : ", regexpMoney);

                tempArray = accountRepository.findByNumber(outputNo)

                if (tempArray) {
                    switch (tempArray.withdraw(outputMoney, pw)) {
                        case -2:
                            console.log("비밀번호를 다시 확인해주세요.");
                            break;
                        case -1:
                            console.log("출금 요청하신 계좌의 잔액이 부족합니다.");
                            break;
                        case 1:
                            saveAccountsToFile();
                            console.clear();
                            console.log(`계좌 : ${outputNo} | ${menu}액 : ${outputMoney}원 | 잔액 : ${tempArray.balance}원`);
                            break;
                        default:
                            break;
                    }

                } else {
                    console.log("계좌가 없습니다");
                }
                break;

            case 5: // 대출
                printList();
                showMenu("대출");

                inputNo = await validate("- 계좌번호 : ", /^\d{10,14}$/, 1)
                inputMoney = await validate("- 대출액 : ", regexpMoney)

                tempArray = accountRepository.findByNumber(inputNo)
                if (tempArray.rentMoney > 0) {
                    tempArray.rent(inputMoney);
                    saveAccountsToFile();
                    console.clear();
                    console.log(`계좌 : ${tempArray.accountNo} | ${menu}액 : ${inputMoney}원 | 대출잔액 : ${tempArray.rentMoney}원`);
                } else {
                    console.clear();
                    console.log("신규 대출이 발생하여 마이너스 계좌로 전환합니다.");
                    console.log(`계좌 : ${tempArray.accountNo} | ${menu}액 : ${inputMoney}원 | 대출잔액 : ${inputMoney}원`);
                    accountRepository.deleteAccount(inputNo);
                    accountRepository.addAccount(new MinusAccount(tempArray.accountNo, tempArray.accountOwner, tempArray._password, tempArray.balance, inputMoney));
                    saveAccountsToFile();
                }
                break;

            case 6: // 상환
                printList();
                showMenu("상환");

                inputNo = await validate("- 계좌번호 : ", /^\d{10,14}$/, 1)
                inputMoney = await validate("- 상환액 : ", regexpMoney)

                tempArray = accountRepository.findByNumber(inputNo)
                if (tempArray.rentMoney > 0) {
                    if (tempArray.rentMoney < inputMoney) {
                        console.error("대출금액보다 큰 금액은 상환할 수 없습니다.");
                    } else {
                        tempArray.rePay(Number(inputMoney));
                        if (tempArray.rentMoney > 0) {
                            saveAccountsToFile();
                            console.clear();
                            console.log(`계좌 : ${tempArray.accountNo} | ${menu}액 : ${inputMoney}원 | 대출잔액 : ${tempArray.rentMoney}원`);
                        } else {
                            console.clear();
                            console.log(`계좌 : ${tempArray.accountNo} | ${menu}액 : ${inputMoney}원 | 대출잔액 : ${tempArray.rentMoney}원`);
                            console.log("대출금액이 전액 상환되어 일반 계좌로 전환합니다.");
                            accountRepository.deleteAccount(inputNo);
                            accountRepository.addAccount(new Account(tempArray.accountNo, tempArray.accountOwner, tempArray._password, tempArray.balance));
                            saveAccountsToFile();
                        }
                    }
                } else {
                    console.log("입력하신 계좌는 대출 중인 금액이 없습니다.")
                }
                break;

            case 7: // 계좌 삭제
                printList();
                showMenu("삭제");
                console.error("주의 : 한 번 삭제된 계좌는 복구할 수 없습니다!!");

                let deleteNum = await validate("- 계좌번호 : ", /^\d{10,14}$/);
                let inputPW = await validate("- 비밀번호 : ", /^\d{4}$/);

                tempArray = accountRepository.findByNumber(deleteNum)
                if (tempArray) {
                    if (Number(tempArray._password) === Number(inputPW)) {
                        printHeader();
                        console.log(tempArray.toString());
                        accountRepository.deleteAccount(deleteNum);
                        saveAccountsToFile();
                        console.log("삭제 완료");
                    } else console.log("비밀번호가 틀립니다.");
                } else {
                    console.log("입력하신 계좌는 없는 계좌입니다.");
                }
                break;

            case 0: // 종료
                console.clear();
                console.log(">>> 프로그램을 종료합니다.");
                consoleInterface.close();
                running = false;
                break;

            case 77:

                break;

            case 99: // 관리자 기능
                console.clear();
                showMenu("관리자");
                console.error("관리자 기능이므로 신중히 사용하세요!!");
                header =
                    "------------------------------------------\n" +
                    "1. 계좌 생성 | 2. 계좌 삭제 | 0. 이전 메뉴\n" +
                    "------------------------------------------";
                console.log(header);
                inputKey = Number(await validate("> ", /^[012]$/));
                if (inputKey === 0) {
                    console.clear();
                    break;
                } else if (inputKey === 1) {
                    console.clear();
                    showMenu("임의 계좌 생성");
                    header =
                        "--------------------------------\n" +
                        "1. 입출금계좌 | 2. 마이너스 계좌\n" +
                        "--------------------------------";
                    console.log(header);
                    inputKey = Number(await validate("> ", /^[12]$/));
                    tempArray = experiments.genRandomAccount(inputKey);

                    if (inputKey === 1) accountRepository.addAccount(new Account(tempArray[0], tempArray[1], tempArray[2], tempArray[3]))
                    else accountRepository.addAccount(new MinusAccount(tempArray[0], tempArray[1], tempArray[2], tempArray[3], tempArray[4]))

                    console.clear();
                    printHeader();
                    tempArray = accountRepository.findByNumber(tempArray[0]);
                    saveAccountsToFile();
                    console.log(tempArray.toString());
                    console.log(`[${menu} 완료]`);
                    break;
                } else {
                    console.clear();
                    console.table(accountRepository.accounts)
                    showMenu("계좌 삭제");

                    let delNum = await validate("삭제할 인덱스 : ", /^\d{1,99}$/);
                    if (delNum != -1 && delNum <= accountRepository.accounts.length) {
                        accountRepository.accounts.splice(delNum, 1);
                        saveAccountsToFile();
                        console.clear();
                        console.log(`[${menu} 완료]`);
                    } else {
                        console.clear();
                        console.log("인덱스 값이 잘못되었습니다.");
                    }
                    break;
                }
            default: console.log("잘못 선택하셨습니다.");
        }
    }
}

app();