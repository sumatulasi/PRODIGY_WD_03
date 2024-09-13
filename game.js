const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const nextRoundButton = document.getElementById('next-round');
const restartButton = document.getElementById('restart');
const player1NameElement = document.getElementById('player1-name');
const player2NameElement = document.getElementById('player2-name');
const player1PointsElement = document.getElementById('player1-points');
const player2PointsElement = document.getElementById('player2-points');

let gameState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let player1Points = 0;
let player2Points = 0;
let round = 1;

const player1 = localStorage.getItem('player1') || 'Player 1';
const player2 = localStorage.getItem('player2') || 'Player 2';
const gameMode = localStorage.getItem('gameMode');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

document.getElementById('game-title').textContent = `${player1} vs ${player2}`;
player1NameElement.textContent = player1;
player2NameElement.textContent = player2;
statusDisplay.textContent = `It's ${player1}'s turn`;

const handleCellPlayed = (clickedCell, clickedCellIndex) => {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
};

const handlePlayerChange = () => {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `It's ${currentPlayer === 'X' ? player1 : player2}'s turn`;
    if (gameMode === 'single' && currentPlayer === 'O' && gameActive) {
        aiPlay();
    }
};

const handleResultValidation = () => {
    let roundWon = false;
    let winningCombination = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningCombination = winCondition;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `${currentPlayer === 'X' ? player1 : player2} WINS!`;
        gameActive = false;
        highlightWinningCells(winningCombination);
        updateScore(currentPlayer);
        nextRoundButton.textContent = `Round ${round + 1}`;
        nextRoundButton.style.display = 'inline-block';
        return;
    }

    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        statusDisplay.textContent = 'Game ended in a draw!';
        gameActive = false;
        nextRoundButton.textContent = `Round ${round + 1}`;
        nextRoundButton.style.display = 'inline-block';
        return;
    }

    handlePlayerChange();
};

const highlightWinningCells = (winningCombination) => {
    winningCombination.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
};

const updateScore = (winner) => {
    if (winner === 'X') {
        player1Points++;
        player1PointsElement.textContent = player1Points;
    } else {
        player2Points++;
        player2PointsElement.textContent = player2Points;
    }
};

const handleCellClick = (clickedCellEvent) => {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
};

const handleNextRound = () => {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    round++;
    statusDisplay.textContent = `It's ${player1}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
    nextRoundButton.style.display = 'none';
};

const handleRestartGame = () => {
    localStorage.removeItem('player1');
    localStorage.removeItem('player2');
    localStorage.removeItem('gameMode');
    window.location.href = 'players.html';
};

const aiPlay = () => {
    if (!gameActive) return;

    let bestMove = getBestMove(gameState, 'O').index;

    if (bestMove !== undefined) {
        handleCellPlayed(cells[bestMove], bestMove);
        handleResultValidation();
    }
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
nextRoundButton.addEventListener('click', handleNextRound);
restartButton.addEventListener('click', handleRestartGame);

statusDisplay.textContent = `It's ${player1}'s turn`;
nextRoundButton.style.display = 'none';
