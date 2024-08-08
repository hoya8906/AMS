//  Node의 표준내장모듈(readline) 활용하여 키보드 입력 받기

// readline 표준 내장 모듈은 한 번에 한 줄씩 process.stdin 스트림에서 
// 데이터를 읽기 위한 인터페이스를 만들 수 있는 기능을 제공한다.
const readline = require("readline");

const consoleInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// 이벤트 기반 한줄 입력 받기
process.stdout.write("니 이름이 뭐니? ");
consoleInterface.on("line", (inputLine) => {
    console.log(inputLine);
    if(inputLine === 0){
    consoleInterface.close();
    }
});

// 공백으로 구분된 여러개의 값 받기
let nums = [];
process.stdout.write("공백으로 구분된 여러개의 숫자 입력 : ");
consoleInterface.on("line", (inputLine) => {
    nums = inputLine.split(" ").map((num) => {
        return parseInt(num);
    });
    const sum = nums.reduce((acc, num) => {
        return acc + num;
    }, 0);
    console.log(`합 : ${sum}`);
    consoleInterface.close();
});

consoleInterface.question("이름이 뭐니?", (name) => {
    console.log(name);
    consoleInterface.close();
});