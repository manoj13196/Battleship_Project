import Gameboard from "../modules/gameboard.js";
import Player from "../modules/player.js";
import Ship from "../modules/ship.js"; // Import the Ship module

export default class GameController {
  constructor() {
    this.isGameStarted = false; // Game is initially not started
    this.isPlayerTurn = true; // Player starts first

    // Initialize the game boards for both player and computer
    this.playerBoard = new Gameboard();
    this.computerBoard = new Gameboard();

    this.player = new Player(this.playerBoard);
    this.computer = new Player(this.computerBoard);

    // Define ship types available for placement
    this.shipTypes = [
      "Carrier",
      "Battleship",
      "Cruiser",
      "Submarine",
      "Destroyer",
    ];

    // Define ship lengths for each type
    this.shipLengths = {
      Carrier: 5,
      Battleship: 4,
      Cruiser: 3,
      Submarine: 3,
      Destroyer: 2,
    };

    // This will hold the current ship type to be placed
    this.currentShipType = this.shipTypes[0];
    this.isVertical = true; // Default ship orientation
    this.placedShipsCount = 0; // Track placed ships
    this.computerTargetQueue = []; // Queue for adjacent cells to target
  }

  // Get the length of a ship based on its type
  getShipLength(shipType) {
    return this.shipLengths[shipType];
  }

  // Start the game by placing ships for the computer automatically
  startGame() {
    if (this.placedShipsCount < this.shipTypes.length) {
      console.log("Place all ships before starting the game!");
      return;
    }
    this.isGameStarted = true;
    this.isPlayerTurn = true;
    this.placeComputerShips(); // Place computer ships randomly
    console.log("Game started!");
  }

  placeComputerShips() {
    this.shipTypes.forEach((shipType) => {
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const isVertical = Math.random() < 0.5;
        const ship = new Ship(this.getShipLength(shipType));
        placed = this.computerBoard.placeShip(ship, x, y, isVertical);
      }
    });
  }

  // Place the current ship on the board at the given row and column
  placeShip(x, y) {
    const shipLength = this.getShipLength(this.currentShipType);
    const ship = new Ship(shipLength);
    const placed = this.playerBoard.placeShip(ship, x, y, this.isVertical);
    if (placed) {
      console.log(`Placed ${this.currentShipType} at (${x}, ${y})`);
      this.placedShipsCount++;
      this.moveToNextShip();
    } else {
      console.log(`Failed to place ${this.currentShipType} at (${x}, ${y})`);
    }
    return placed;
  }

  // Logic to move a ship on the player's board
  moveShip(x, y) {
    // Ensure the move is valid and update the board
  }

  // Handle ship rotation (rotate the current ship between horizontal and vertical)
  rotateShip() {
    this.isVertical = !this.isVertical; // Toggle orientation
  }

  // Move to the next ship type after one is placed
  moveToNextShip() {
    const currentIndex = this.shipTypes.indexOf(this.currentShipType);
    if (currentIndex < this.shipTypes.length - 1) {
      // Set the next ship type in the list
      this.currentShipType = this.shipTypes[currentIndex + 1];
    } else if (this.placedShipsCount === this.shipTypes.length) {
      console.log("All ships placed. Ready to start the game.");
    }
  }

  // Function to handle the player's turn logic, attacking the computer's board
  attackComputer(x, y) {
    if (!this.isPlayerTurn || !this.isGameStarted) return false; // Prevent attacking out of turn
    const cellData = this.computerBoard.board[y][x];
    if (cellData.hit) {
      console.log("You already attacked this cell!");
      return false; // Prevent repeated attacks
    }

    const result = this.computerBoard.receiveAttack(y, x);
    if (result === "hit") {
      console.log("You hit a ship!");
      this.checkForWinner();
      return result; // Allow the player to take another turn
    } else if (result === "miss") {
      console.log("You missed!");
      this.isPlayerTurn = false; // End player's turn
      this.checkForWinner();
      if (this.isGameStarted) {
        setTimeout(() => this.computerTurn(), 500); // Delay for computer's turn
      }
    }
    return result;
  }

  computerTurn() {
    if (this.isPlayerTurn || !this.isGameStarted) return; // Prevent computer from playing out of turn

    let x, y, result;

    // If there are cells in the target queue, prioritize them
    while (this.computerTargetQueue.length > 0) {
      [x, y] = this.computerTargetQueue.shift();
      if (!this.playerBoard.board[y][x].hit) {
        result = this.playerBoard.receiveAttack(y, x);
        break;
      }
    }

    // If no valid adjacent cells are left, pick a random cell
    if (!result) {
      let attempts = 0; // Add a safeguard to prevent infinite loops
      do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        attempts++;
        if (attempts > 100) {
          console.error("Computer has no valid moves left!");
          return; // Exit if all cells have been attacked
        }
      } while (this.playerBoard.board[y][x].hit); // Ensure the cell hasn't already been attacked
      result = this.playerBoard.receiveAttack(y, x);
    }

    if (result === "hit") {
      console.log(`Computer hit your ship at (${x}, ${y})!`);
      this.addAdjacentCellsToQueue(x, y); // Add adjacent cells to the target queue
      this.checkForWinner();
      setTimeout(() => this.computerTurn(), 500); // Allow the computer to take another turn
    } else if (result === "miss") {
      console.log(`Computer missed at (${x}, ${y}).`);
      this.isPlayerTurn = true; // End computer's turn
      this.checkForWinner();
    }

    // Trigger board rendering after the computer's turn
    document.dispatchEvent(new Event("updateBoards"));
  }

  addAdjacentCellsToQueue(x, y) {
    const directions = [
      [0, 1], // Right
      [1, 0], // Down
      [0, -1], // Left
      [-1, 0], // Up
    ];

    directions.forEach(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;

      // Ensure the cell is within bounds and hasn't already been attacked
      if (
        newX >= 0 &&
        newX < 10 &&
        newY >= 0 &&
        newY < 10 &&
        !this.playerBoard.board[newY][newX].hit &&
        !this.computerTargetQueue.some(([qx, qy]) => qx === newX && qy === newY) // Avoid duplicates
      ) {
        this.computerTargetQueue.push([newX, newY]);
      }
    });
  }

  // Function to check if either player has won the game
  checkForWinner() {
    if (this.computerBoard.allShipsSunk()) {
      console.log("Player wins!");
      this.endGame("Player");
    } else if (this.playerBoard.allShipsSunk()) {
      console.log("Computer wins!");
      this.endGame("Computer");
    }
  }

  endGame(winner) {
    this.isGameStarted = false;
    const gameInfo = document.getElementById("game-info");
    gameInfo.textContent = `Game Over! ${winner} wins!`; // Display the winner's name
    const restartButton = document.getElementById("restart-game");
    restartButton.style.display = "inline-block"; // Show the restart button
  }

  // Reset the game after a win
  resetGame() {
    this.isGameStarted = false;
    this.isPlayerTurn = true;
    this.playerBoard = new Gameboard(); // Reset the player's board
    this.computerBoard = new Gameboard(); // Reset the computer's board
    this.player = new Player(this.playerBoard); // Reinitialize the player
    this.computer = new Player(this.computerBoard); // Reinitialize the computer

    // Reset ship placement
    this.currentShipType = this.shipTypes[0];
    this.placedShipsCount = 0;

    console.log("Game has been reset.");
  }
}
