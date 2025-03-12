const board = document.getElementById("board");
const statusText = document.getElementById("status");
const toggleAIButton = document.getElementById("toggleAI");
let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let isAI = false;
let gameActive = true;

gameBoard.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", index);
    cell.addEventListener("click", handleMove);
    board.appendChild(cell);
});

toggleAIButton.addEventListener("click", () => {
    isAI = !isAI;
    resetGame();
    toggleAIButton.textContent = isAI ? "Play with Player" : "Play with AI";
    statusText.textContent = isAI ? "You vs AI" : "Player X's turn";
    statusText.classList.toggle("ai-mode", isAI);
});

function handleMove(event) {
    if (!gameActive) return;

    const index = event.target.getAttribute("data-index");
    if (gameBoard[index] === "" && !checkWinner()) {
        gameBoard[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add("played");

        if (checkWinner()) {
            statusText.textContent = `Player ${currentPlayer} Wins!`;
            gameActive = false;
            return;
        }

        if (!gameBoard.includes("")) {
            statusText.textContent = "It's a Draw!";
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s turn`;

        if (isAI && currentPlayer === "O") {
            setTimeout(aiMove, 500);
        }
    }
}

function aiMove() {
    if (!gameActive) return;

    let available = gameBoard.map((val, idx) => (val === "" ? idx : null)).filter(val => val !== null);
    if (available.length > 0) {
        let randomIndex = available[Math.floor(Math.random() * available.length)];
        gameBoard[randomIndex] = "O";
        document.querySelector(`[data-index='${randomIndex}']`).textContent = "O";

        if (checkWinner()) {
            statusText.textContent = "AI Wins!";
            gameActive = false;
            return;
        }

        if (!gameBoard.includes("")) {
            statusText.textContent = "It's a Draw!";
            gameActive = false;
            return;
        }

        currentPlayer = "X";
        statusText.textContent = "Player X's turn";
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("played");
    });
    currentPlayer = "X";
    statusText.textContent = isAI ? "You vs AI" : "Player X's turn";
    statusText.classList.toggle("ai-mode", isAI);
}
