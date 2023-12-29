import { Ship } from "../code/ship.js";
import { gameboard } from "../code/gameboard.js";

beforeAll(() => console.log("Starting Test"));
afterAll(() => console.log("Ending Test"));

describe("Testing game board", () => {
  test("check if we can place ship", () => {
    const index = 42;
    const myShip = new Ship(4);
    const game = new gameboard(10);
    const row = game.getRow(index);
    game.placeship(index, myShip);

    expect(game.playerBoard[row]).toEqual([0, 0, 4, 4, 4, 4, 0, 0, 0, 0]);
  });

  test("its out of bound", () => {
    const index = 59;
    const myShip = new Ship(2);
    const game = new gameboard(10);
    const returnValue = game.placeship(index, myShip);

    expect(returnValue).toBe("out of bound");
  });

  test("Ship receive attack", () => {
    const index = 40;
    const myShip = new Ship(4);
    const game = new gameboard(10);
    const row = game.getRow(index);
    game.placeship(index, myShip);
    game.receiveAttack(42, myShip);
    expect(myShip.shipLength).toEqual([4, 4, -1, 4]);
    expect(game.playerBoard[row]).toEqual([4, 4, -1, 4, 0, 0, 0, 0, 0, 0]);
  });

  test("Sunken Ship?", () => {
    const index = 40;
    const myShip = new Ship(2);
    const game = new gameboard(10);
    game.placeship(index, myShip);
    game.receiveAttack(40, myShip);
    game.receiveAttack(41, myShip);
    expect(myShip.shipLength).toEqual("sunken ship");
  });

  test("Attack missed the ship", () => {
    const index = 40;
    const myShip = new Ship(4);
    const game = new gameboard(10);
    const row = game.getRow(index);
    game.placeship(index, myShip);
    game.receiveAttack(45, myShip);
    expect(myShip.shipLength).toEqual([4, 4, 4, 4]);
    expect(game.playerBoard[row]).toEqual([4, 4, 4, 4, 0, -1, 0, 0, 0, 0]);
  });

  test("Shot at same location", () => {
    const index = 40;
    const myShip = new Ship(4);
    const game = new gameboard(10);
    const row = game.getRow(index);
    game.placeship(index, myShip);
    game.receiveAttack(45, myShip);
    const sameLocation = game.receiveAttack(45, myShip);
    expect(sameLocation).toEqual("Shot at the same locaiton");
  });
});
