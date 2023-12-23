import { Ship } from "../code/ship.js";

describe("Ship tests.", () => {
  test("if length is empty", () => {
    const myShip = new Ship();
    expect(myShip.shipLength).toEqual(-1);
  });

  test("check length of ship with negative value", () => {
    const myShip = new Ship(-5);
    expect(myShip.shipLength).toEqual(-1);
  });

  test("check length of ship with positive value", () => {
    const myShip = new Ship(10);
    expect(myShip.shipLength).toEqual(10);
  });
});
