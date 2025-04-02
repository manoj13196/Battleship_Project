import GameController from "../src/modules/gamecontroller";

describe("GameController", () => {
  let gameController;

  beforeEach(() => {
    gameController = new GameController();
  });

  test("GameController initializes correctly", () => {
    expect(gameController.isGameStarted).toBe(false);
    expect(gameController.isPlayerTurn).toBe(true);
  });

  test("GameController starts the game after all ships are placed", () => {
    gameController.placedShipsCount = gameController.shipTypes.length;
    gameController.startGame();
    expect(gameController.isGameStarted).toBe(true);
  });

  test("GameController prevents starting the game before all ships are placed", () => {
    gameController.placedShipsCount = gameController.shipTypes.length - 1;
    gameController.startGame();
    expect(gameController.isGameStarted).toBe(false);
  });

  test("GameController handles player attacks correctly", () => {
    const result = gameController.attackComputer(0, 0);
    expect(result).toBe("miss");
    expect(gameController.isPlayerTurn).toBe(false);
  });

  test("GameController handles computer attacks correctly", () => {
    gameController.isPlayerTurn = false;
    gameController.computerTurn();
    expect(gameController.isPlayerTurn).toBe(true);
  });

  test("GameController detects when the player wins", () => {
    gameController.computerBoard.allShipsSunk = jest.fn(() => true);
    gameController.checkForWinner();
    expect(gameController.isGameStarted).toBe(false);
  });

  test("GameController detects when the computer wins", () => {
    gameController.playerBoard.allShipsSunk = jest.fn(() => true);
    gameController.checkForWinner();
    expect(gameController.isGameStarted).toBe(false);
  });
});
