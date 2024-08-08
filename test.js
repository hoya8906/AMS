function drawHeader() {
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
        }, 1); // 50ms 간격으로 한 글자씩 출력
    });
}

drawHeader()