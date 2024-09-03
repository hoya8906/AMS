// 입출금 계좌
class Account {
    constructor(accountNo, accountOwner, password, balance) {
        this.accountNo = accountNo;
        this.accountOwner = accountOwner;
        this.password = password;
        this.balance = balance;
    }

    set password(password) {
        this._password = password;
    }

    get password() {
        return this._password;
    }

    toString() {
        const accountType = this.rentMoney > 0 ? "마이너스" : "일    반";
        const accountName = this.accountOwner.padEnd(2);
        const ownerTab = this.accountOwner.length > 3 ? "\t" : "\t\t";

        if (this.rentMoney > 0) {
            return `  ${accountType}\t ${this.accountNo}\t ${accountName}${ownerTab} ${this.balance}(${this.rentMoney})`;
        } else {
            return `  ${accountType}\t ${this.accountNo}\t ${accountName}${ownerTab} ${this.balance}`;
        }
    }

    deposit(money) {
        this.balance = parseInt(this.balance);
        this.balance += parseInt(money);
        return this.balance;
    }

    withdraw(money, password) {
        let result = 0;
        // console.log(password, this.password);

        if (Number(password) === Number(this.password)) {
            if (this.balance >= money) {
                this.balance -= money;
                result = 1
            }
            else {
                result = -1;
            }
        } else {
            result = -2
        }
        return result;
    }
    getBalance() {
        return this.balance;
    }
}

module.exports = Account;