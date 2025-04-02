import GameController from "./gamecontroller.js";

export default function createDOMController(gameController) {
  const playerBoardElement = document.getElementById("player-board");
  const computerBoardElement = document.getElementById("computer-board");
  const gameInfo = document.getElementById("game-info");
  const startButton = document.getElementById("start-game");
  const rotateButton = document.getElementById("rotate-ship");

  // Function to render both boards
  function renderBoards() {
    renderBoard(gameController.playerBoard, playerBoardElement, false); // Player's board
    renderBoard(gameController.computerBoard, computerBoardElement, true); // Computer's board
  }

  // Function to render the individual board
  function renderBoard(gameboard, boardElement, isComputer) {
    boardElement.innerHTML = ""; // Clear the board

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = y;
        cell.dataset.col = x;

        const cellData = gameboard.board[y][x];

        // Mark hits and misses
        if (cellData.hit) {
          cell.classList.add(cellData.ship ? "hit" : "miss");
        }

        // Show ships on the player's board
        if (cellData.ship && !isComputer) {
          cell.classList.add("ship");
        }

        // Add event listeners for ship placement
        if (!gameController.isGameStarted && !isComputer) {
          cell.addEventListener("click", () => {
            const placed = gameController.placeShip(x, y);
            if (!placed) alert("Invalid placement! Try again.");
            renderBoards();
          });
        }

        // Add event listeners for attacks
        if (gameController.isGameStarted && isComputer) {
          if (gameController.isPlayerTurn) {
            cell.addEventListener("click", () => {
              if (cellData.hit) {
                alert("You already attacked this cell!");
                return;
              }
              const result = gameController.attackComputer(x, y);
              if (result) {
                renderBoards();
                updateGameInfo();
              }
            });
          } else {
            cell.style.pointerEvents = "none"; // Disable clicks during the computer's turn
          }
        }

        boardElement.appendChild(cell);
      }
    }
  }

  // Listen for board updates and re-render boards dynamically
  document.addEventListener("updateBoards", () => {
    renderBoards();
    updateGameInfo();
  });

  // Event listener to start the game
  startButton.addEventListener("click", () => {
    if (gameController.placedShipsCount < gameController.shipTypes.length) {
      alert("Place all ships before starting the game!");
      return;
    }
    gameController.startGame();
    renderBoards();
    updateGameInfo();

    // Disable buttons after the game starts
    startButton.disabled = true;
    rotateButton.disabled = true;
  });

  // Event listener to restart the game
  document.getElementById("restart-game").addEventListener("click", () => {
    gameController.resetGame();
    renderBoards();
    updateGameInfo();

    // Reset UI elements
    document.getElementById("game-info").textContent =
      "Place your ships or adjust their positions";
    document.getElementById("restart-game").style.display = "none"; // Hide the restart button
    startButton.disabled = false; // Enable the start button
    rotateButton.disabled = false; // Enable the rotate button
  });

  // Function to update game information
  function updateGameInfo() {
    if (!gameController.isGameStarted) return; // Prevent overwriting the game over message
    gameInfo.textContent = gameController.isPlayerTurn
      ? "Your turn! Click on the computer's board."
      : "Computer's turn! Please wait...";
  }

  return { renderBoards, updateGameInfo };
}
