import { Ship } from "../code/ship.js";

export class gameboard {
  // container = document.getElementById("container");
  subMarine = new Ship(2);
  destoryer = new Ship(3);
  battleShip = new Ship(4);
  cruiser = new Ship(5);
  aircraftCarrier = new Ship(6);

  constructor(boradLength) {
    this.boradLength = this.createArrayboard(boradLength);
  }

  createArrayboard(boradLength) {
    return Array.from({ length: boradLength }, () =>
      Array.from({ length: boradLength }, () => 0)
    );
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

  //only work horizontally for now
  placeship(startLocation, ship) {
    if (startLocation < 0 || startLocation === null)
      return "Index cant be negative number or null";

    let startRow = this.getRow(startLocation);
    let startCol = this.getCol(startLocation);

    if (startRow > this.boradLength.length)
      return "Index is larger than the board";

    if (startCol + ship.shipLength.length <= this.boradLength.length) {
      //Store ship coordinate
      for (let k = 0; k < ship.shipLength.length; k++) {
        this.boradLength[startRow][startCol] = ship.shipLength[k];
        if (startCol <= 10) {
          ship.shipCoordinate.push(startLocation);
          startLocation++;
          startCol++;
        } else {
          startRow++;
          startCol = 0;
        }
      }
    } else {
      return "out of bound";
    }
  }

  receiveAttack(hitLocation) {
    let hitRow = this.getRow(hitLocation);
    let hitCol = this.getCol(hitLocation);

    if (this.boradLength[hitRow][hitCol] === 2) {
      const index = this.getShipCoordinate(this.subMarine, hitLocation);
      this.subMarine.hits(index);
    }

    if (this.boradLength[hitRow][hitCol] === 3) {
      const index = this.getShipCoordinate(this.destoryer, hitLocation);
      this.destoryer.hits(index);
    }

    if (this.boradLength[hitRow][hitCol] === 4) {
      const index = this.getShipCoordinate(this.battleShip, hitLocation);
      this.battleShip.hits(index);
    }

    if (this.boradLength[hitRow][hitCol] === 5) {
      const index = this.getShipCoordinate(this.cruiser, hitLocation);
      this.cruiser.hits(index);
    }

    if (this.boradLength[hitRow][hitCol] === 6) {
      const index = this.getShipCoordinate(this.aircraftCarrier, hitLocation);
      this.aircraftCarrier.hits(index);
    }

    this.boradLength[hitRow][hitCol] = -1;
  }

  missedShot() {}

  reportSunk() {}

  //Get indexof
  getShipCoordinate(ship, hitlocation) {
    return ship.shipCoordinate.indexOf(hitlocation);
  }

  //Help method
  getRow(index) {
    return Math.floor(index / 10);
  }

  getCol(index) {
    return index % 10;
  }

  isWithinBound(row, col) {
    if (row > -1 && row < 11 && col > -1 && col < 11) {
      return true;
    } else {
      return false;
    }
  }
}
