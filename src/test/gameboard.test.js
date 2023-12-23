import { gameboard } from "../code/gameboard.js";

describe("simple test.", () => {
  test("if length is empty", () => {
    const myGameboard = new gameboard();
    expect(myShip.shipLength).toEqual(-1);
  });

  test("check length of ship", () => {
    const myGameboard = new gameboard(-5);
    expect(myShip.shipLength).toEqual(-1);
  });

  test("check length of ship", () => {
    const myGameboard = new gameboard(10);
    expect(myShip.shipLength).toEqual(10);
  });
});
