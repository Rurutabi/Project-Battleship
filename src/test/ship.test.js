import { Ship } from "../code/ship.js";

describe("simple test.", () => {
  test("if length is empty", () => {
    const myShip = new Ship();
    expect(myShip.shipLength).toEqual();
  });

  test("check length of ship", () => {
    const myShip = new Ship(5);
    expect(myShip.shipLength).toEqual(5);
  });
});
