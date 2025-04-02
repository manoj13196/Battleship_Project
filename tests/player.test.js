import Player from "../src/modules/player";
import Gameboard from "../src/modules/gameboard";

describe("Player", () => {
  let player, opponentBoard;

  beforeEach(() => {
    player = new Player("Player");
    opponentBoard = new Gameboard();
  });

  test("Player can attack opponent's board", () => {
    const result = player.attack(opponentBoard, 0, 0);
    expect(result).toBe("miss");
    expect(opponentBoard.board[0][0].hit).toBe(true);
  });

  test("Player cannot attack the same cell twice", () => {
    player.attack(opponentBoard, 0, 0);
    const result = player.attack(opponentBoard, 0, 0);
    expect(result).toBe(false);
  });

  test("AI player attacks random cells", () => {
    const aiPlayer = new Player("AI", true);
    const result = aiPlayer.aiAttack(opponentBoard);
    expect(result).toBe("miss");
  });

  test("AI player does not attack the same cell twice", () => {
    const aiPlayer = new Player("AI", true);
    aiPlayer.aiAttack(opponentBoard);
    const result = aiPlayer.aiAttack(opponentBoard);
    expect(aiPlayer.attacksMade.size).toBe(2);
  });
});
