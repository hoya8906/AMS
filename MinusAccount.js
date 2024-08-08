// 마이너스 계좌
const Account = require("./Account")

class MinusAccount extends Account {
    constructor(accountNo, accountOwner, password, balance, rentMoney) {
        super(accountNo, accountOwner, password, balance);

        // 대출금액 프로퍼티 추가
        this.rentMoney = rentMoney;
    }

    // getBalance() 재정의
    getBalance() {
        return this.balance - this.rentMoney;
    }

    rePay(money) {
        this.rentMoney -= Number(money);
        return this.rentMoney;
    }
    rent(money){
        this.rentMoney += Number(money);
        return this.rentMoney;
    }
}

module.exports = MinusAccount;