import { Ship } from "../code/ship.js";

import { gameboard } from "../code/gameboard.js";

test("check if we can place ship", () => {
  const index = 42;
  const myShip = new Ship(5);
  const game = new gameboard(10);
  const row = game.getRow(index);
  game.placeship(index, myShip);

  expect(game.boradLength[row]).toEqual([0, 0, 1, 1, 1, 1, 1, 0, 0, 0]);
});

test("check if its out of bound", () => {
  const index = 59;
  const myShip = new Ship(5);
  const game = new gameboard(10);
  const returnValue = game.placeship(index, myShip);

  expect(returnValue).toBe("out of bound");
});

test("index too large", () => {
  const index = 150;
  const myShip = new Ship(5);
  const game = new gameboard(10);
  const returnValue = game.placeship(index, myShip);

  expect(returnValue).toBe("Index is larger than the board");
});

test("negative index", () => {
  const index = null;
  const myShip = new Ship(5);
  const game = new gameboard(10);
  const returnValue = game.placeship(index, myShip);

  expect(returnValue).toBe("Index cant be negative number or null");
});
