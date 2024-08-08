// 재미를 위한 실험적 코드입니다
// 구현을 위해 일부분 GPT의 도움을 받았습니다.

const Account = require("./Account");
const readline = require('readline');

class Experiments extends Account {

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateRandomAccountNumber() {
        const length = this.getRandomInt(10, 14);
        const randomNumber = Math.floor(Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1))) + Math.pow(10, length - 1);
        return randomNumber.toString();
    }

    generateRandomName() {
        const lastName = ['김', '이', '박', '최', '정', '강', '조', '윤', '신', '장', '임'];
        const firstName = ['사과', '참다래', '포도', '바나나', '딸기', '토마토', '양파', '복숭아', '감자', '고구마'];

        const surname = lastName[this.getRandomInt(0, lastName.length - 1)];
        const fruitOrVegetable = firstName[this.getRandomInt(0, firstName.length - 1)];

        return surname + fruitOrVegetable;
    }

    generateRandomPassword() {
        const randomNumber = this.getRandomInt(0, 9999);
        return randomNumber.toString().padStart(4, '0');
    }

    generateRandomMoney() {
        const length = this.getRandomInt(4, 5);
        const base = Math.pow(10, length - 1);
        const randomNumber = this.getRandomInt(1, 9) * base; // 100 단위 절사된 4자리에서 5자리 숫자
        return randomNumber.toString();
    }

    genRandomAccount(opt) {
        const accountNumber = this.generateRandomAccountNumber();
        const name = this.generateRandomName();
        const password = this.generateRandomPassword();
        const deposit = this.generateRandomMoney();
        const rent = this.generateRandomMoney();

        if (opt === 1) {
            return [accountNumber, name, password, deposit];
        } else {
            return [accountNumber, name, password, deposit, rent];
        }
    }

    // 헤더 그리기
    drawHeader() {
        const headerLines = [
            `=====================================================================`,
            `---------------     KOSTA 은행 계좌 관리 프로그램     ---------------`,
            `=====================================================================`
        ];

        let currentLine = 0;
        let currentChar = 0;

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                process.stdout.write(headerLines[currentLine][currentChar]);

                currentChar++;
                if (currentChar === headerLines[currentLine].length) {
                    console.log(); // 줄 바꿈
                    currentChar = 0;
                    currentLine++;

                    if (currentLine === headerLines.length) {
                        clearInterval(interval);
                        resolve(); // 헤더 출력 완료
                    }
                }
            }, 1); // 출력 속도 조절
        });
    }

    // 로딩 바 출력
    loadingBar() {
        for (let i = 0; i < 67; i++) {
            setTimeout(() => {
                process.stdout.write(".")
            }, 10 * Math.random() * i);
        };
        setTimeout(() => {
            readline.cursorTo(process.stdout, 0); // 커서를 처음으로 이동
            readline.clearLine(process.stdout, 0); // 현재 줄을 지움
            process.stdout.write("> ");
        }, 1000);
    }
}

module.exports = Experiments;