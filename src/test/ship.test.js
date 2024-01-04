import { Ship } from "../code/ship.js";

beforeAll(() => console.log("Starting Test"));
afterAll(() => console.log("Ending Test"));

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

  test("check if the ship is hitted by bullet", () => {
    const myShip = new Ship(5);
    myShip.hits();
    expect(myShip.shipLength).toEqual(4);
  });

  test("check if the ship is sunked when all value is 0", () => {
    const myShip = new Ship(2);
    myShip.hits();
    myShip.hits();
    expect(myShip.shipLength).toEqual("sunken ship");
  });
});
