import Ship from "./ship.js";

export default class Player {
  constructor(name, isAI = false) {
    this.name = name;
    this.isAI = isAI;
    this.attacksMade = new Set();
  }

  attack(opponentBoard, x, y) {
    if (this.attacksMade.has(`${x},${y}`)) return false;

    this.attacksMade.add(`${x},${y}`);
    return opponentBoard.receiveAttack(x, y);
  }

  aiAttack(opponentBoard) {
    let x, y;
    let attempts = 0; // Safeguard to prevent infinite loops
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      attempts++;
      if (attempts > 100) {
        console.error("AI has no valid moves left!");
        return false; // Exit if all cells have been attacked
      }
    } while (this.attacksMade.has(`${x},${y}`));

    this.attacksMade.add(`${x},${y}`);
    return opponentBoard.receiveAttack(x, y);
  }
}
