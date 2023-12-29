import { Ship } from "../code/ship.js";
import { Player } from "../code/player.js";

export class gameboard {
  //Ship
  subMarine = new Ship(2);
  destoryer = new Ship(3);
  battleShip = new Ship(4);
  cruiser = new Ship(5);
  aircraftCarrier = new Ship(6);

  //Player
  player = new Player(true);
  ai = new Player(false);

  constructor(playerBoard, aiBoard) {
    this.playerBoard = this.createArrayboard(playerBoard);
    this.aiBoard = this.createArrayboard(aiBoard);
    this.createBoard();
    this.playerTurn();
  }

  createArrayboard(playerBoard) {
    return Array.from({ length: playerBoard }, () =>
      Array.from({ length: playerBoard }, () => 0)
    );
  }

  playerTurn() {
    const aiCell = document.querySelectorAll(".ai-cell");
    const playerCell = document.querySelector(".player-cell");

    //Index before 100 is for player
    //Index after 99 is for ai
    aiCell.forEach((value, index) => {
      value.addEventListener("click", () => {
        const row = this.getRow(index);
        const col = this.getCol(index);

        if (this.player && this.aiBoard[row][col] !== -1) {
          this.receiveAttack(index, _, this.aiBoard);
          // this.player = false;
          // this.ai = true;
          console.log("work");
        }
      });
    });
  }

  aiTurn() {
    const playerCell = document.querySelector(".player-cell");

    playerCell.forEach((value, index) => {
      if (this.ai) {
        this.receiveAttack(index, _, this.playerBoard);
        this.ai = false;
        this.player = true;
      }
    });
  }

  //Create user interface
  createBoard() {
    // Create a div element
    const outerContainer = document.createElement("div");
    outerContainer.classList.add("container");
    document.body.appendChild(outerContainer);

    //Create a player board
    const playerBoardContainer = document.createElement("div");
    playerBoardContainer.classList.add("board-container", "player-board");
    outerContainer.appendChild(playerBoardContainer);

    //Create an ai player
    const aiBoardContainer = document.createElement("div");
    aiBoardContainer.classList.add("board-container", "ai-board");
    outerContainer.appendChild(aiBoardContainer);

    this.populateBoard(playerBoardContainer);
    this.populateBoard(aiBoardContainer);
  }

  populateBoard(boardContainer) {
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

        if (boardContainer.classList.contains("player-board")) {
          grid.classList.add("player-cell");
        } else {
          grid.classList.add("ai-cell");
        }

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

    if (startRow > this.playerBoard.length)
      return "Index is larger than the board";

    if (startCol + ship.shipLength.length <= this.playerBoard.length) {
      //Store ship coordinate
      for (let k = 0; k < ship.shipLength.length; k++) {
        this.playerBoard[startRow][startCol] = ship.shipLength[k];
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

  receiveAttack(hitLocation, ship, board) {
    let hitRow = this.getRow(hitLocation);
    let hitCol = this.getCol(hitLocation);

    console.log(hitRow);
    console.log(hitCol);

    if (board[hitRow][hitCol] !== -1) {
      if (board[hitRow][hitCol] === 2) {
        const index = this.getShipCoordinate(this.subMarine, hitLocation);
        this.subMarine.hits(index);
      }

      if (board[hitRow][hitCol] === 3) {
        const index = this.getShipCoordinate(this.destoryer, hitLocation);
        this.destoryer.hits(index);
      }

      if (board[hitRow][hitCol] === 4) {
        const index = this.getShipCoordinate(this.battleShip, hitLocation);
        this.battleShip.hits(index);
      }

      if (board[hitRow][hitCol] === 5) {
        const index = this.getShipCoordinate(this.cruiser, hitLocation);
        this.cruiser.hits(index);
      }

      if (board[hitRow][hitCol] === 6) {
        const index = this.getShipCoordinate(this.aircraftCarrier, hitLocation);
        this.aircraftCarrier.hits(index);
      }

      //For testing if target is hitted by the bullet

      if (ship !== _) {
        if (board[hitRow][hitCol] === ship.shipLength.length) {
          const index = this.getShipCoordinate(ship, hitLocation);

          //Shiplength = sunken ship when every value inside the array is -1
          ship.hits(index);
        }
      }

      // If a user shoots at this grid location, mark it as -1 to indicate a shot.
      board[hitRow][hitCol] = -1;
    } else {
      return "Shot at the same locaiton";
    }
  }

  //Get indexof
  getShipCoordinate(ship, hitlocation) {
    return ship.shipCoordinate.indexOf(hitlocation);
  }

  //Help method
  getRow(index) {
    if (index >= 100) {
      return Math.floor(index / 10) - 10;
    }

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
