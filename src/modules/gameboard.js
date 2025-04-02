export default class Gameboard {
  constructor() {
    this.board = [];
    this.ships = [];
    this.createBoard();
  }

  createBoard() {
    for (let i = 0; i < 10; i++) {
      let row = [];
      for (let j = 0; j < 10; j++) {
        row.push({ ship: null, hit: false });
      }
      this.board.push(row);
    }
  }

  placeShip(ship, x, y, isVertical) {
    const shipLength = ship.length;

    // Check if the ship fits within the board boundaries
    if (isVertical) {
      if (y + shipLength > 10) return false;
      for (let i = 0; i < shipLength; i++) {
        if (this.board[y + i][x].ship) return false; // Prevent overlapping ships
      }
      for (let i = 0; i < shipLength; i++) {
        this.board[y + i][x].ship = ship; // Place the ship vertically
      }
    } else {
      if (x + shipLength > 10) return false;
      for (let i = 0; i < shipLength; i++) {
        if (this.board[y][x + i].ship) return false; // Prevent overlapping ships
      }
      for (let i = 0; i < shipLength; i++) {
        this.board[y][x + i].ship = ship; // Place the ship horizontally
      }
    }

    this.ships.push(ship); // Add the ship to the list of placed ships
    return true;
  }

  receiveAttack(row, col) {
    const cell = this.board[row][col];
    if (cell.hit) return false;

    cell.hit = true;
    if (cell.ship) {
      cell.ship.hit();
      return "hit";
    } else {
      return "miss";
    }
  }

  allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
}
