import { Ship } from "../code/ship.js";
import { Player } from "../code/player.js";

export class gameboard {
  //Ship
  subMarine = new Ship(2);
  destroyer = new Ship(3);
  battleShip = new Ship(4);
  cruiser = new Ship(5);
  aircraftCarrier = new Ship(6);
  draggedShipElement = null;

  //PlayerplaceShip
  player = new Player(true);
  ai = new Player(false);

  recordShipLocation = [];

  constructor(playerBoard, aiBoard) {
    this.playerBoard = this.createArrayboard(playerBoard);
    this.aiBoard = this.createArrayboard(aiBoard);
    this.createBoard();
    this.createShip();
    this.dragShip();
    this.playerTurn();

    const index = 40;
    const myShip = new Ship(4);

    this.placeShip(index, myShip);
    this.placeShip(58, this.subMarine);

    console.log(this.recordShipLocation);
    this.receiveAttack(45, this.playerBoard, myShip);
  }

  createArrayboard(playerBoard) {
    return Array.from({ length: playerBoard }, () =>
      Array.from({ length: playerBoard }, () => 0)
    );
  }

  playerTurn() {
    const aiCell = document.querySelectorAll(".ai-cell");
    const playerCell = document.querySelectorAll(".player-cell");
    const recordAiShot = new Set();
    //Index before 100 is for player
    //Index after 99 is for ai
    aiCell.forEach((value, index) => {
      value.addEventListener("click", () => {
        if (!value.classList.contains("red")) {
          this.receiveAttack(index, this.aiBoard);
          value.classList.add("red");

          let randomIndex;

          do {
            randomIndex = Math.floor(Math.random() * 100);
          } while (recordAiShot.has(randomIndex) && recordAiShot.size < 100);
          recordAiShot.add(randomIndex);

          this.receiveAttack(randomIndex, this.playerBoard);
          playerCell[randomIndex].classList.add("red");
        }

        // console.log(this.playerBoard);
        // console.log("-------------------------------");
        // console.log(this.aiBoard);
      });
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

    aiBoardContainer.classList.add("hide");

    this.populateBoard(playerBoardContainer);
    this.populateBoard(aiBoardContainer);
  }

  populateBoard(boardContainer) {
    for (let i = 0; i < 10; i++) {
      //row
      for (let j = 0; j < 10; j++) {
        //col
        const grid = document.createElement("div");

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

  createShip() {
    const outerContainer = document.querySelector(".container");

    const shipListContainer = document.createElement("div");
    shipListContainer.classList.add("other-container");
    outerContainer.appendChild(shipListContainer);

    this.populateShip(this.subMarine.shipLength.length, shipListContainer);
    this.populateShip(this.destroyer.shipLength.length, shipListContainer);
    this.populateShip(
      this.aircraftCarrier.shipLength.length,
      shipListContainer
    );
    this.populateShip(this.cruiser.shipLength.length, shipListContainer);
    this.populateShip(this.battleShip.shipLength.length, shipListContainer);
  }

  populateShip(shipLength, shipListContainer) {
    const shipContainer = document.createElement("div");
    shipContainer.classList.add("ship-container");
    shipContainer.setAttribute("id", `ship${shipLength}-container`);
    shipContainer.style.gridTemplateColumns = `repeat(${shipLength}, 50px)`;
    shipListContainer.appendChild(shipContainer);

    shipContainer.draggable = true;

    for (let i = 0; i < shipLength; i++) {
      const shipCell = document.createElement("div");
      shipCell.classList.add("ship-cell");
      this.colorFromLength(shipLength, shipCell);
      shipCell.setAttribute("id", `${shipLength}`);
      shipContainer.appendChild(shipCell);
    }
  }

  dragShip() {
    const playerCell = document.querySelectorAll(".player-cell");
    const shipContainer = document.querySelectorAll(".ship-container");

    shipContainer.forEach((element) => {
      element.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/shipContainerID", element.id);
        e.dataTransfer.setData("text/shipCellRelativePos", e.offsetX);
      });
    });

    playerCell.forEach((value, index) => {
      value.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      value.addEventListener("drop", (e) => {
        const draggedElementID = e.dataTransfer.getData("text/shipContainerID");
        const shipContainer = document.getElementById(draggedElementID);
        const shipCell = shipContainer.querySelectorAll(".ship-cell");

        const shipCellRelativePos = parseInt(
          e.dataTransfer.getData("text/shipCellRelativePos"),
          10
        );

        const selectedIndex = Math.floor(shipCellRelativePos / 50);

        const firstIndex = index - selectedIndex;
        const lastIndex = firstIndex + shipCell.length;
        const shipLength = lastIndex - firstIndex;

        //Row
        const firstRow = this.getRow(firstIndex);
        const lastRow =
          lastIndex % 10 === 0
            ? this.getRow(lastIndex - 1)
            : this.getRow(lastIndex);

        if (
          firstRow === lastRow &&
          this.isCellPlaced(playerCell, firstIndex, lastIndex) === true
        ) {
          for (let i = firstIndex; i < firstIndex + shipCell.length; i++) {
            playerCell[i].classList.add("placed");
            this.colorFromLength(shipLength, playerCell[i]);
            shipContainer.remove();
          }
          // this.placeShip(firstIndex)
        }
      });
    });
  }

  isCellPlaced(playerCell, firstIndex, lastIndex) {
    for (let i = firstIndex; i < lastIndex; i++) {
      if (playerCell[i].classList.contains("placed")) {
        return false;
      }
    }
    return true;
  }

  //only work horizontally for now
  placeShip(startLocation, ship) {
    if (startLocation < 0 || startLocation === null)
      return "Index cant be negative number or null";

    let startRow = this.getRow(startLocation);
    let startCol = this.getCol(startLocation);

    if (startRow > this.playerBoard.length)
      return "Index is larger than the board";

    if (startCol + ship.shipLength <= this.playerBoard.length) {
      //Store ship coordinate
      for (let k = 0; k < ship.shipLength; k++) {
        this.playerBoard[startRow][startCol] = ship.shipLength;
        if (startCol <= 10) {
          this.recordShipLocation.push({
            shipLocation: startLocation,
            shipLength: ship.shipLength,
          });
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

  receiveAttack(hitLocation, board, ship) {
    let hitRow = this.getRow(hitLocation);
    let hitCol = this.getCol(hitLocation);

    // if (board[hitRow][hitCol] !== -1) {
    //   if (board[hitRow][hitCol] === 2) {
    //     this.subMarine.hits();
    //   }

    //   if (board[hitRow][hitCol] === 3) {
    //     this.destroyer.hits();
    //   }

    //   if (board[hitRow][hitCol] === 4) {
    //     this.battleShip.hits();
    //   }

    //   if (board[hitRow][hitCol] === 5) {
    //     this.cruiser.hits();
    //   }

    //   if (board[hitRow][hitCol] === 6) {
    //     this.aircraftCarrier.hits();
    //   }

    //   //For testing if target is hitted by the bullet

    //   if (ship !== undefined) {
    //     console.log("test");
    //     const recordLength = ship.shipLength;
    //     if (board[hitRow][hitCol] === recordLength) {
    //       ship.hits();
    //     }
    //   }

    for (let i = 0; i < this.recordShipLocation.length; i++) {
      if (hitLocation === this.recordShipLocation[i].shipLocation) {
      }
    }

    // If a user shoots at this grid location, mark it as -1 to indicate a shot.
    board[hitRow][hitCol] = -1;
    // } else {
    //   return "Shot at the same locaiton";
    // }
  }

  /*Helper method*/
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

  colorFromLength(theLength, element) {
    if (theLength === 2) {
      element.classList.add("Midnightblue");
    }
    if (theLength === 3) {
      element.classList.add("Brown");
    }
    if (theLength === 4) {
      element.classList.add("Cadetblue");
    }
    if (theLength === 5) {
      element.classList.add("Palevioletred");
    }
    if (theLength === 6) {
      element.classList.add("Crimson");
    }
  }

  //Get indexof
  getShipCoordinate(ship, hitlocation) {
    return ship.shipCoordinate.indexOf(hitlocation);
  }
}
