const readline = require('readline');
let rl = null;

exports.question = function (question) {

    if (!rl) {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    return new Promise((resolve, reject) => {
        rl.question(question + '\n', (answer) => {
            resolve(answer);
        });
    });
}

exports.close = function () {
    rl.close();
}