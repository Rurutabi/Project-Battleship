import { Ship } from "../code/ship.js";
import { Player } from "../code/player.js";

export class gameboard {
  //Ship each ship will always have different length
  subMarine = new Ship(2);
  destroyer = new Ship(3);
  battleShip = new Ship(4);
  cruiser = new Ship(5);
  aircraftCarrier = new Ship(6);
  draggedShipElement = null;

  //PlayerplaceShip
  player = new Player(true);
  ai = new Player(false);

  recordShipCreate = [];
  recordShipLocation = [];

  constructor(playerBoard, aiBoard) {
    this.playerBoard = this.createArrayboard(playerBoard);
    this.aiBoard = this.createArrayboard(aiBoard);
    this.createBoard();
    this.createShip();
    this.dragShip();
    this.handleTurnClick();
  }

  createArrayboard(playerBoard) {
    return Array.from({ length: playerBoard }, () =>
      Array.from({ length: playerBoard }, () => 0)
    );
  }

  handleTurnClick() {
    const aiCell = document.querySelectorAll(".ai-cell");
    const playerCell = document.querySelectorAll(".player-cell");
    const recordAiShot = new Set();

    aiCell.forEach((value, index) => {
      value.addEventListener("click", () => {
        if (
          !value.classList.contains("aquamarine") &&
          !value.classList.contains("red")
        ) {
          //PLayer Attack

          const playeyRow = this.getRow(index);
          const playerCol = this.getCol(index);

          if (this.aiBoard[playeyRow][playerCol] === 0) {
            value.classList.add("aquamarine");
          } else {
            value.classList.add("red");
          }

          this.receiveAttack(index, this.aiBoard);

          //Ai Attack
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * 100);
          } while (recordAiShot.has(randomIndex) && recordAiShot.size < 100);
          recordAiShot.add(randomIndex);

          const randomRow = this.getRow(randomIndex);
          const randomCol = this.getCol(randomIndex);

          if (this.playerBoard[randomRow][randomCol] === 0) {
            playerCell[randomIndex].classList.add("aquamarine");
          } else {
            playerCell[randomIndex].classList.add("red");
          }

          this.receiveAttack(randomIndex, this.playerBoard);
        }
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
    shipListContainer.classList.add("shiplist-container");
    outerContainer.appendChild(shipListContainer);

    this.populateShip(this.subMarine, shipListContainer);
    this.populateShip(this.destroyer, shipListContainer);
    this.populateShip(this.aircraftCarrier, shipListContainer);
    this.populateShip(this.cruiser, shipListContainer);
    this.populateShip(this.battleShip, shipListContainer);
  }

  populateShip(ship, shipListContainer) {
    const shipContainer = document.createElement("div");
    shipContainer.classList.add("ship-container");
    shipContainer.setAttribute("id", `ship${ship.shipLength}-container`);
    shipContainer.style.gridTemplateColumns = `repeat(${ship.shipLength}, 50px)`;
    shipListContainer.appendChild(shipContainer);

    shipContainer.draggable = true;

    for (let i = 0; i < ship.shipLength; i++) {
      const shipCell = document.createElement("div");
      shipCell.classList.add("ship-cell");
      this.colorFromLength(ship.shipLength, shipCell);
      shipCell.setAttribute("id", `${ship.shipLength}`);
      shipContainer.appendChild(shipCell);
    }

    this.recordShipCreate.push(ship);
  }

  dragShip() {
    const playerCells = document.querySelectorAll(".player-cell");
    const shipContainers = document.querySelectorAll(".ship-container");
    const shipListContainer = document.querySelector(".shiplist-container");
    const aiBoardContainer = document.querySelector(".ai-board");

    shipContainers.forEach((shipContainer) => {
      shipContainer.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/shipContainerID", shipContainer.id);
        event.dataTransfer.setData("text/shipCellRelativePos", event.offsetX);
      });
    });

    playerCells.forEach((cell, index) => {
      cell.addEventListener("dragover", (event) => {
        event.preventDefault();
      });

      cell.addEventListener("drop", (event) => {
        const draggedElementID = event.dataTransfer.getData(
          "text/shipContainerID"
        );
        const draggedShipContainer = document.getElementById(draggedElementID);
        const shipCells = draggedShipContainer.querySelectorAll(".ship-cell");

        const shipCellRelativePos = parseInt(
          event.dataTransfer.getData("text/shipCellRelativePos"),
          10
        );

        const selectedGridIndex = Math.floor(shipCellRelativePos / 50);
        const firstIndex = index - selectedGridIndex;

        const startCol = this.getCol(firstIndex);

        //PLayer
        if (
          //Duplicated?
          //Check if first and last are in the same row
          this.inSameRow(startCol, shipCells.length, this.playerBoard) ===
            true &&
          this.isCellPlaced(firstIndex, shipCells.length, this.playerBoard) ===
            true
        ) {
          for (let i = firstIndex; i < firstIndex + shipCells.length; i++) {
            playerCells[i].classList.add("placed");
            this.colorFromLength(shipCells.length, playerCells[i]);
            draggedShipContainer.remove();
          }

          // Use recordShip and placeShip to place the ship on the actual array
          this.pushShipLengthToArray(firstIndex, shipCells, this.playerBoard);

          let aiFirstIndex;
          let aiCol;

          do {
            aiFirstIndex = Math.floor(Math.random() * 100);
            aiCol = this.getCol(aiFirstIndex);
          } while (
            this.inSameRow(aiCol, shipCells.length, this.aiBoard) === false ||
            this.isCellPlaced(aiFirstIndex, shipCells.length, this.aiBoard) ===
              false
          );

          this.pushShipLengthToArray(aiFirstIndex, shipCells, this.aiBoard);
        }

        //Ai board appear when user move every ships to player boards
        if (shipListContainer.childElementCount === 0) {
          shipListContainer.remove();
          aiBoardContainer.classList.remove("hide");
        }
      });
    });
  }

  pushShipLengthToArray(firstIndex, shipCells, board) {
    for (let i = 0; i < this.recordShipCreate.length; i++) {
      if (this.recordShipCreate[i].shipLength === shipCells.length) {
        this.placeShip(firstIndex, this.recordShipCreate[i], board);
      }
    }
  }

  placeShip(startLocation, ship, gameboard) {
    //Input Validation
    if (startLocation < 0 || startLocation === null)
      return "Index cant be negative number or null";

    //Calculate Start Row and Start Column
    let startRow = this.getRow(startLocation);
    let startCol = this.getCol(startLocation);

    //Check if Index is Larger Than the Board:
    if (startRow > gameboard.length) return "Index is larger than the board";

    //Duplicated?
    if (this.inSameRow(startCol, ship.shipLength, gameboard) === true) {
      //Store ship coordinate
      for (let k = 0; k < ship.shipLength; k++) {
        gameboard[startRow][startCol] = ship.shipLength;
        if (startCol <= 10) {
          this.recordShipLocation.push({
            shipLocation: startLocation,
            ship: ship,
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

  receiveAttack(hitLocation, board) {
    let hitRow = this.getRow(hitLocation);
    let hitCol = this.getCol(hitLocation);

    if (board[hitRow][hitCol] !== -1) {
      for (let i = 0; i < this.recordShipLocation.length; i++) {
        if (hitLocation === this.recordShipLocation[i].shipLocation) {
          this.recordShipLocation[i].ship.hits();
        }
      }

      // If a user shoots at this grid location, mark it as -1 to indicate a shot.
      board[hitRow][hitCol] = -1;
    } else {
      return "Shot at the same locaiton";
    }
  }

  /*Helper method*/

  inSameRow(startIndex, shipLength, gameboard) {
    if (startIndex + shipLength <= gameboard.length) {
      return true;
    } else {
      return false;
    }
  }

  isCellPlaced(firstIndex, shipCellslength, gameboard) {
    const row = this.getRow(firstIndex);
    const col = this.getCol(firstIndex);

    for (let i = col; i < col + shipCellslength; i++) {
      if (gameboard[row][i] !== 0) {
        return false;
      }
    }

    return true;
  }

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
      element.classList.add("midnightblue");
    }
    if (theLength === 3) {
      element.classList.add("goldenrod");
    }
    if (theLength === 4) {
      element.classList.add("darkviolet");
    }
    if (theLength === 5) {
      element.classList.add("palevioletred");
    }
    if (theLength === 6) {
      element.classList.add("chartreuse");
    }
  }
}
