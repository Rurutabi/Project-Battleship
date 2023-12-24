import { Ship } from "./ship.js";

export class gameboard {
  container = document.getElementById("container");
  subMarine = new Ship(2);
  destoryer = new Ship(4);

  //Array board
  arrayBoard = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => "")
  );
  constructor() {
    this.createBoard();
    console.log(this.arrayBoard);
  }

  //Create user interface
  createBoard() {
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board-container");
    this.container.appendChild(boardContainer);

    for (let i = 0; i < 10; i++) {
      //row
      for (let j = 0; j < 10; j++) {
        //col
        const grid = document.createElement("div");

        /*If you want to include number
        if (i !== 0 && j !== 0) {
          grid.classList.add("cell");
        } else if (j === 0 && i !== 0) {
          grid.classList.add("no-cell");
          //Delete this later when you are done
          grid.textContent = i;
        } else if (j !== 0) {
          grid.classList.add("no-cell");
          //Delete this later when you are done
          grid.textContent = j;
        }*/

        grid.classList.add("cell");

        boardContainer.appendChild(grid);
      }
    }
  }

  placeship() {
    this.arrayBoard.forEach((value, index) => {});
  }

  receiveAttack() {}

  missedShot() {}

  reportSunk() {}

  //Help method
  getRow(index) {
    return Math.floor(index / numColumns);
  }

  getCol(index) {
    return index % numColumns;
  }
}
