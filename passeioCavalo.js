const createChessboard = () => {
    var chessboard = document.getElementById('chessboard');
    for (var i = 0; i < 8; i++) {
        var row = document.createElement('tr');
        row.className = 'chessboard';
        for (var j = 0; j < 8; j++) {
            var cell = document.createElement('td');
            cell.className = 'chessboard';
            row.appendChild(cell);
        }
        chessboard.appendChild(row);
    }
}

const horseWorker = () => {
    onmessage = (message) => {
        const BOARD_SIZE = 8;
        const NUM_SQUARES = BOARD_SIZE * BOARD_SIZE;

        let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));

        const [x, y] = message.data;

        let moves = [
            [2, 1],
            [1, 2],
            [-1, 2],
            [-2, 1],
            [-2, -1],
            [-1, -2],
            [1, -2],
            [2, -1]
        ];

        const isSafe = (x, y) => x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[x][y] == 0;

        const fillable = (x, y, move) => {
            if (!isSafe(x, y)) {
                return false;
            }

            board[x][y] = move;
            postMessage([false, false, x, y, move]); // comment this line to fasten the process

            if (move == NUM_SQUARES) {
                return true;
            }

            for (let [offsetX, offsetY] of moves) {
                if (fillable(x + offsetX, y + offsetY, move + 1)) {
                    return true;
                }
            }

            board[x][y] = 0;
            return false;
        }
        //postMessage([board, fillable(x, y, 1)]); // to fasten the process
        postMessage([true, fillable(x, y, 1)]);
    }
}

(() => {
    createChessboard();
    let cells = document.getElementsByTagName("td");

    const horse = new Worker("horseWorker.js"); // when running on a server
    //const horse = new Worker(URL.createObjectURL(new Blob(["(" + horseWorker.toString() + ")()"], { type: 'text/javascript' })));

    horse.onmessage = (e) => {
        //to fasten the process
        // let [board, filled] = e.data;
        // alert(filled ? "Solução encontrada!" : "Não há solução para a posição inicial informada.");
        // if (filled) {
        //     clearTimeout(running);
        //     for (let i = 0; i < 8; i++) {
        //         for (let j = 0; j < 8; j++) {
        //             cells[i * 8 + j].innerText = board[i][j];
        //         }
        //     }
        // }

        let [finish, filled, x, y, move] = e.data;
        if (finish) {
            alert(filled ? "Solução encontrada!" : "Não há solução para a posição inicial informada.");
        } else {
            let i = x * 8 + y;
            cells[i].innerText = move;
        }
    }

    horse.postMessage(prompt('Digite a entrada no formato x,y.\nEx: 0,0').split(',').map(Number));

    const running = setTimeout(() => {
        document.getElementsByClassName("running")[0].style.display = 'block';
    }, 5000);
})();
