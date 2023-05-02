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