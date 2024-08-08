/**
 * 계좌 관리 객체
 * 최규호
 */
class AccountRepository {
    constructor() {
        this.accounts = [];
    }

    set accounts(accounts) {
        this._accounts = accounts;
    }

    get accounts() {
        return this._accounts;
    }

    // 계좌 추가
    addAccount(account) {
        if (this.accounts.indexOf(account) === -1) {
            this.accounts.push(account)
            return true;
        } else {
            return false;
        }
    }

    findByAll() {
        return [...this.accounts];
    }

    // 계좌번호로 찾기
    findByNumber(number) {
        let result = this.accounts.find(account => account.accountNo === number)
        return result;
    }

    // 이름으로 찾기
    findByName(name) {
        return this.accounts.filter(account => account.name === name)
    }

    // 전체 금액 합계
    findTotalMoney() {
        // return this.accounts.reduce((acc, account) => acc + account.balance, 0);
        return this.accounts.reduce((acc, account) => acc + account.getBalance(), 0);
    }

    // 최고 예금액 찾기
    findHighMoney() {
        return this.accounts.reduce((acc, account) => acc > account.balance ? acc : account.balance, 0)
    }

    // 최저 예금액 찾기
    findLowMoney() {
        return this.accounts.reduce((acc, account) => acc < account.balance ? acc : account.balance, this.accounts[0].balance)
    }

    // 특정 범위의 금액 찾기
    findSomeMoney(num1, num2) {
        return this.accounts.filter((account) => num1 <= account.balance && account.balance <= num2);
    }

    // 이름 변경하기
    // updateName(beforeName, afterName) {
    //     let index = this.accounts.findIndex((account) => account.name === beforeName)
    //     if (index > -1) {
    //         this.accounts[index].name = afterName
    //         return true;
    //     }
    //     return false;
    // }

    updateName(updateAccount) {
        let findAccount = this.accounts.find((account) => account.number === updateAccount.number)
        console.log(findAccount);
        if (findAccount) {
            findAccount.name = updateAccount.name;
            return true;
        }
        return false;
    }

    // 계좌 삭제하기
    deleteAccount(number) {
        let index = this.accounts.findIndex((account) => account.accountNo === number)
        if (index != -1) {
            return this.accounts.splice(index, 1);
        }
        return null;

    }
}

module.exports = AccountRepository;