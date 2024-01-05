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
    game.placeShip(index, myShip);
    expect(game.playerBoard[row]).toEqual([0, 0, 4, 4, 4, 4, 0, 0, 0, 0]);
  });

  test("its out of bound", () => {
    const index = 59;
    const myShip = new Ship(2);
    const game = new gameboard(10);
    const returnValue = game.placeShip(index, myShip);
    expect(returnValue).toBe("out of bound");
  });

  test("Ship receive attack", () => {
    const index = 40;
    const myShip = new Ship(4);
    const game = new gameboard(10);
    const row = game.getRow(index);
    game.placeShip(index, myShip);
    game.receiveAttack(42, game.playerBoard);
    expect(myShip.shipLength).toEqual(3);
    expect(game.playerBoard[row]).toEqual([4, 4, -1, 4, 0, 0, 0, 0, 0, 0]);
  });

  test("Sunken Ship?", () => {
    const index = 40;
    const myShip = new Ship(2);
    const game = new gameboard(10);
    game.placeShip(index, myShip);
    game.receiveAttack(40, game.playerBoard);
    game.receiveAttack(41, game.playerBoard);
    expect(myShip.shipLength).toEqual("sunken ship");
  });

  test("Attack missed the ship", () => {
    const index = 40;
    const myShip = new Ship(4);
    const game = new gameboard(10);
    const row = game.getRow(index);
    game.placeShip(index, myShip);
    game.receiveAttack(45, game.playerBoard);
    expect(myShip.shipLength).toEqual(4);
    expect(game.playerBoard[row]).toEqual([4, 4, 4, 4, 0, -1, 0, 0, 0, 0]);
  });

  test("Shot at same location", () => {
    const index = 40;
    const myShip = new Ship(4);
    const game = new gameboard(10);
    game.placeShip(index, myShip);
    game.receiveAttack(45, game.playerBoard);
    const sameLocation = game.receiveAttack(45, game.playerBoard);
    expect(sameLocation).toEqual("Shot at the same locaiton");
  });
});
