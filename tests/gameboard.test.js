import Gameboard from "../src/modules/gameboard.js";
import Ship from "../src/modules/ship.js";

describe("Gameboard", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test("Gameboard initializes with a 10x10 grid", () => {
    expect(gameboard.board.length).toBe(10);
    expect(gameboard.board[0].length).toBe(10);
  });

  test("Gameboard places ships correctly (horizontal)", () => {
    const ship = Ship(3);
    const placed = gameboard.placeShip(ship, 0, 0, false);
    expect(placed).toBe(true);
    expect(gameboard.board[0][0].ship).toBe(ship);
    expect(gameboard.board[0][1].ship).toBe(ship);
    expect(gameboard.board[0][2].ship).toBe(ship);
  });

  test("Gameboard places ships correctly (vertical)", () => {
    const ship = Ship(3);
    const placed = gameboard.placeShip(ship, 0, 0, true);
    expect(placed).toBe(true);
    expect(gameboard.board[0][0].ship).toBe(ship);
    expect(gameboard.board[1][0].ship).toBe(ship);
    expect(gameboard.board[2][0].ship).toBe(ship);
  });

  test("Gameboard prevents overlapping ships", () => {
    const ship1 = Ship(3);
    const ship2 = Ship(2);
    gameboard.placeShip(ship1, 0, 0, false);
    const placed = gameboard.placeShip(ship2, 0, 1, false);
    expect(placed).toBe(false);
  });

  test("Gameboard registers hits correctly", () => {
    const ship = Ship(2);
    gameboard.placeShip(ship, 0, 0, false);
    const result = gameboard.receiveAttack(0, 0);
    expect(result).toBe("hit");
    expect(ship.hits).toBe(1);
  });

  test("Gameboard registers misses correctly", () => {
    const result = gameboard.receiveAttack(0, 0);
    expect(result).toBe("miss");
    expect(gameboard.board[0][0].hit).toBe(true);
  });

  test("Gameboard detects when all ships are sunk", () => {
    const ship = Ship(1);
    gameboard.placeShip(ship, 0, 0, false);
    gameboard.receiveAttack(0, 0);
    expect(gameboard.allShipsSunk()).toBe(true);
  });

  test("Gameboard detects when not all ships are sunk", () => {
    const ship = Ship(2);
    gameboard.placeShip(ship, 0, 0, false);
    gameboard.receiveAttack(0, 0);
    expect(gameboard.allShipsSunk()).toBe(false);
  });
});
