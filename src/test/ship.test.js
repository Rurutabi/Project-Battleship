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
    expect(myShip.shipLength).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  });

  test("check if the ship is hitted by bullet", () => {
    const myShip = new Ship(5);
    const hitValue = 5;
    myShip.hits(hitValue);
    expect(myShip.shipLength).toEqual([1, 1, 1, 1, 1, 0]);
  });

  test("check if the ship is sunked when all value is 0", () => {
    const myShip = new Ship(2);
    myShip.hits(0);
    myShip.hits(1);
    expect(myShip.shipLength).toEqual("sunken ship");
  });
});
