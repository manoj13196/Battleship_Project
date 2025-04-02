import Ship from "../src/modules/ship";

describe("Ship", () => {
  test("Ship initializes with correct length and hits", () => {
    const ship = Ship(3);
    expect(ship.length).toBe(3);
    expect(ship.hits).toBe(0);
  });

  test("Ship registers hits correctly", () => {
    const ship = Ship(3);
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  test("Ship sinks when hits equal length", () => {
    const ship = Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test("Ship does not sink if hits are less than length", () => {
    const ship = Ship(3);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });
});
