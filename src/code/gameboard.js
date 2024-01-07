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

  //PlayerplacePlayerShip
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
          //Ai board
          this.receiveAttack(index, this.aiBoard);
          value.classList.add("aquamarine");

          //Player board
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * 100);
          } while (recordAiShot.has(randomIndex) && recordAiShot.size < 100);
          recordAiShot.add(randomIndex);

          const playerRow = this.getRow(randomIndex);
          const playerCol = this.getCol(randomIndex);

          if (this.playerBoard[playerRow][playerCol] === 0) {
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
    const shipListContainer = document.querySelector(".shiplist-container");
    const shipContainers = document.querySelectorAll(".ship-container");
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
        const lastIndex = firstIndex + shipCells.length;
        const shipLength = lastIndex - firstIndex;

        const startCol = this.getCol(firstIndex);
        //PLayer
        if (
          //Duplicated?
          //Check if first and last are in the same row
          this.inSameRow(startCol, shipLength, this.playerBoard) === true &&
          this.isCellPlaced(playerCells, firstIndex, lastIndex)
        ) {
          for (let i = firstIndex; i < firstIndex + shipCells.length; i++) {
            playerCells[i].classList.add("placed");
            this.colorFromLength(shipLength, playerCells[i]);
            draggedShipContainer.remove();
          }

          // Use recordShip and placePlayerShip to place the ship on the actual array
          for (let i = 0; i < this.recordShipCreate.length; i++) {
            if (this.recordShipCreate[i].shipLength === shipCells.length) {
              this.placePlayerShip(
                firstIndex,
                this.recordShipCreate[i],
                this.playerBoard
              );
            }
          }
        }

        //Ai
        // if (firstRow)
        //   if (shipListContainer.childElementCount === 0) {
        //     shipListContainer.remove();
        //     aiBoardContainer.classList.remove("hide");
        //   }
      });
    });
  }

  placeAiShip(shipLength) {
    const recordAiShip = new Set();
    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * 100);
    } while (recordAiShip.has(randomIndex));

    recordAiShip.add(randomIndex);

    lastIndex = randomIndex + shipLength;
  }

  placePlayerShip(startLocation, ship, gameboard) {
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

  isCellPlaced(cell, firstIndex, lastIndex) {
    for (let i = firstIndex; i < lastIndex; i++) {
      if (cell[i].classList.contains("placed")) {
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
