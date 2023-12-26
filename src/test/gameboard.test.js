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

    expect(game.boradLength[row]).toEqual([0, 0, 4, 4, 4, 4, 0, 0, 0, 0]);
  });

  test("check if its out of bound", () => {
    const index = 59;
    const myShip = new Ship(2);
    const game = new gameboard(10);
    const returnValue = game.placeship(index, myShip);

    expect(returnValue).toBe("out of bound");
  });

  //Might delete this test later
  test("index too large", () => {
    const index = 150;
    const myShip = new Ship(4);
    const game = new gameboard(10);
    const returnValue = game.placeship(index, myShip);

    expect(returnValue).toBe("Index is larger than the board");
  });

  //Might delete this test later
  test("negative index", () => {
    const index = null;
    const myShip = new Ship(4);
    const game = new gameboard(10);
    const returnValue = game.placeship(index, myShip);

    expect(returnValue).toBe("Index cant be negative number or null");
  });
});
