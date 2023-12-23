export class gameboard {
  container = document.getElementById("container");

  constructor() {}

  //Create user interface
  createBoard() {
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board-container");
    this.container.appendChild(boardContainer);

    for (let i = 0; i < 11; i++) {
      //row
      for (let j = 0; j < 11; j++) {
        //Col
        const grid = document.createElement("div");

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
        }

        boardContainer.appendChild(grid);
      }
    }
  }

  placeship() {}

  receiveAttack() {}

  missedShot() {}

  reportSunk() {}
}
