import { Ship } from "./ship";

export class Gameboard {
  // Player Ship
  playerSubmarine = new Ship(2);

  playerDestoryer = new Ship(3);

  playerBattleShip = new Ship(4);

  playerCruiser = new Ship(5);

  playerAircraftCarrier = new Ship(6);

  // Ai Ship
  aiSubmarine = new Ship(2);

  aiDestoryer = new Ship(3);

  aiBattleShip = new Ship(4);

  aiCruiser = new Ship(5);

  aiAircraftCarrier = new Ship(6);

  // Record Ship and Location
  recordPlayerShip = [];

  recordPlayerShipLocation = [];

  recordAiShip = [];

  recordAiShipLocation = [];

  // Ai Attack
  recordfirstAiAttack = [];

  otherAiAttack = [];

  recordAttackedShip = [];

  right = true;

  left = false;

  // CheckWinner
  checkWinner = false;

  // Counting Number of ship
  shipCounting = 5;

  constructor(playerBoard, aiBoard) {
    this.playerBoard = this.createArrayboard(playerBoard);
    this.aiBoard = this.createArrayboard(aiBoard);
    this.createUI();
    this.createShip();
    this.dragShip();
    this.handleTurnClick();
    this.restartGame();
  }

  restartGame() {
    const restartButton = document.querySelector(".restart-button");
    const restartContainer = document.querySelector(".restart-container");
    const overlay = document.querySelector(".overlay");

    const aiCell = document.querySelectorAll(".ai-cell");
    const playerCell = document.querySelectorAll(".player-cell");

    const aiBoard = document.querySelector(".ai-board");

    const shipListContainer = document.querySelector(".shiplist-container");
    const shipContainer = document.querySelectorAll(".ship-container");

    restartButton.addEventListener("click", () => {
      // Remove restart button when press
      shipListContainer.style.display = "flex";
      restartContainer.style.display = "none";
      overlay.classList.add("hide");

      // reset player and ai board to 0
      this.resetBoard(this.playerBoard);
      this.resetBoard(this.aiBoard);

      // reset ui board
      this.resetCell(aiCell);
      this.resetCell(playerCell);

      // reset Ship
      this.playerSubmarine.shipLength = 2;
      this.playerDestoryer.shipLength = 3;
      this.playerBattleShip.shipLength = 4;
      this.playerCruiser.shipLength = 5;
      this.playerAircraftCarrier.shipLength = 6;

      // reset Ai Ship
      this.aiSubmarine.shipLength = 2;
      this.aiDestoryer.shipLength = 3;
      this.aiBattleShip.shipLength = 4;
      this.aiCruiser.shipLength = 5;
      this.aiAircraftCarrier.shipLength = 6;

      // //Record Ship and Location
      this.recordPlayerShipLocation = [];
      this.recordAiShipLocation = [];

      // //Ai Attack
      this.recordfirstAiAttack = [];
      this.otherAiAttack = [];
      this.recordAttackedShip = [];
      this.right = true;
      this.left = false;

      // hide game board
      aiBoard.classList.add("hide");
      this.shipCounting = 5;
      // Show  Ship UI again
      shipContainer.forEach((element) => {
        element.style.display = "grid";
      });

      this.checkWinner = false;
    });
  }

  resetCell = (cell) => {
    cell.forEach((element) => {
      element.classList.remove("red");
      element.classList.remove("aquamarine");
      element.classList.remove("goldenrod");
      element.classList.remove("darkviolet");
      element.classList.remove("midnightblue");
      element.classList.remove("palevioletred");
      element.classList.remove("chartreuse");
      element.classList.remove("placed");
    });
  };

  resetBoard(board) {
    board.forEach((element) => {
      for (let i = 0; i < element.length; i += 1) {
        element[i] = 0;
      }
    });
  }

  createArrayboard(board) {
    return Array.from({ length: board }, () =>
      Array.from({ length: board }, () => 0)
    );
  }

  handleTurnClick() {
    const aiCell = document.querySelectorAll(".ai-cell");
    const playerCell = document.querySelectorAll(".player-cell");
    const restartContainer = document.querySelector(".restart-container");
    const overlay = document.querySelector(".overlay");
    const winnerText = document.querySelector(".winner-text");
    const recordAiShot = new Set();

    aiCell.forEach((value, index) => {
      value.addEventListener("click", () => {
        if (this.checkWinner === false) {
          if (
            !value.classList.contains("aquamarine") &&
            !value.classList.contains("red")
          ) {
            // PLayer Attack
            const playeyRow = this.getRow(index);
            const playerCol = this.getCol(index);

            if (this.aiBoard[playeyRow][playerCol] === 0) {
              value.classList.add("aquamarine");
            } else {
              value.classList.add("red");
            }

            this.receiveAttack(index, this.aiBoard, this.recordAiShipLocation);

            // Ai Attack
            let randomIndex;

            if (this.recordAttackedShip.length === 0) {
              do {
                randomIndex = Math.floor(Math.random() * 100);
              } while (
                recordAiShot.has(randomIndex) &&
                recordAiShot.size < 100
              );
            } else if (
              this.recordAttackedShip[0].shipLength !== "sunken ship"
            ) {
              // Attack Right side first
              if (this.right === true) {
                randomIndex = this.otherAiAttack.pop();
                randomIndex += 1;

                // Checking if the right side is hit
                if (recordAiShot.has(randomIndex)) {
                  this.right = false;
                  this.left = true;
                  randomIndex = this.recordfirstAiAttack.pop();
                  randomIndex -= 1;
                }

                if (
                  this.playerBoard[this.getRow(randomIndex)][
                    this.getCol(randomIndex)
                  ] === 0
                ) {
                  this.right = false;
                  this.left = true;
                }
                // Attack left
              } else if (this.left === true) {
                randomIndex = this.recordfirstAiAttack.pop();
                randomIndex -= 1;
              }
            } else {
              // Go back to random number
              this.recordAttackedShip.length = 0;
              this.otherAiAttack.length = 0;
              this.recordfirstAiAttack.length = 0;
              this.right = true;
              this.left = false;
              do {
                randomIndex = Math.floor(Math.random() * 100);
              } while (
                recordAiShot.has(randomIndex) &&
                recordAiShot.size < 100
              );
            }

            this.aiAimming(randomIndex, this.playerBoard);

            // Start attacking left side if the right is in different column
            if (
              this.getCol(randomIndex) >= 9 &&
              this.recordAttackedShip.length !== 0
            ) {
              this.right = false;
              this.left = true;
            }

            recordAiShot.add(randomIndex);

            const randomRow = this.getRow(randomIndex);
            const randomCol = this.getCol(randomIndex);

            if (this.playerBoard[randomRow][randomCol] === 0) {
              playerCell[randomIndex].classList.add("aquamarine");
            } else {
              playerCell[randomIndex].classList.add("red");
            }

            this.receiveAttack(
              randomIndex,
              this.playerBoard,
              this.recordPlayerShipLocation
            );

            if (this.playerWinCondition() === true) {
              // Clear Ai record
              recordAiShot.clear();
              restartContainer.classList.remove("hide");
              overlay.classList.remove("hide");
              restartContainer.style.display = "flex";
              winnerText.textContent = "Player Win";
              this.checkWinner = true;
            } else if (this.aiWinCondition() === true) {
              // Clear Ai record
              recordAiShot.clear();
              restartContainer.classList.remove("hide");
              overlay.classList.remove("hide");
              restartContainer.style.display = "flex";
              winnerText.textContent = "Ai Win";
              this.checkWinner = true;
            }
          }
        }
      });
    });
  }

  aiAimming(firstIndex, playerBoard) {
    if (firstIndex === undefined) return;
    const row = this.getRow(firstIndex);
    const col = this.getCol(firstIndex);

    if (playerBoard[row][col] !== 0 && playerBoard[row][col] !== -1) {
      // this attack will increase and decrease
      if (this.otherAiAttack.length < 1) {
        this.otherAiAttack.push(firstIndex);
      }

      // Record first hit
      if (this.recordfirstAiAttack.length < 1) {
        this.recordfirstAiAttack.push(firstIndex);
      }

      // ship that got hit
      if (this.recordAttackedShip.length < 1) {
        for (let i = 0; i < this.recordPlayerShip.length; i += 1) {
          if (
            this.playerBoard[row][col] === this.recordPlayerShip[i].shipLength
          ) {
            this.recordAttackedShip.push(this.recordPlayerShip[i]);
          }
        }
      }
    }
  }

  // Create user interface
  createUI() {
    const outerContainer = document.createElement("div");
    outerContainer.classList.add("container");
    document.body.appendChild(outerContainer);

    const headerContainer = document.createElement("div");
    headerContainer.classList.add("header-container");
    outerContainer.appendChild(headerContainer);

    const title = document.createElement("h1");
    title.classList.add("title");
    title.textContent = "BattleShip";
    headerContainer.appendChild(title);

    const bodyContainer = document.createElement("div");
    bodyContainer.classList.add("body-container");
    outerContainer.appendChild(bodyContainer);
    // Create a player board
    const playerBoardContainer = document.createElement("div");
    playerBoardContainer.classList.add("board-container", "player-board");
    bodyContainer.appendChild(playerBoardContainer);

    // Create an ai player
    const aiBoardContainer = document.createElement("div");
    aiBoardContainer.classList.add("board-container", "ai-board");
    bodyContainer.appendChild(aiBoardContainer);

    aiBoardContainer.classList.add("hide");

    const footer = document.createElement("footer");
    const footerText = document.createElement("p");
    footerText.textContent = "Create by Siraphop Sompamit";
    outerContainer.appendChild(footer);

    // Create overlay and restart button
    const restartContainer = document.createElement("div");
    restartContainer.classList.add("restart-container");
    restartContainer.classList.add("delay");

    document.body.appendChild(restartContainer);

    const restartButton = document.createElement("button");
    restartButton.classList.add("restart-button");

    restartButton.textContent = "Restart";
    restartContainer.appendChild(restartButton);

    const winnerText = document.createElement("div");
    winnerText.classList.add("winner-text");
    winnerText.classList.add("delay");

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.classList.add("hide");
    document.body.appendChild(overlay);

    restartContainer.appendChild(winnerText);

    footer.appendChild(footerText);
    this.populateBoard(playerBoardContainer);
    this.populateBoard(aiBoardContainer);
  }

  populateBoard = (boardContainer) => {
    for (let i = 0; i < 10; i += 1) {
      // row
      for (let j = 0; j < 10; j += 1) {
        // col
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
  };

  createShip() {
    const outerContainer = document.querySelector(".body-container");
    const shipListContainer = document.createElement("div");
    shipListContainer.classList.add("shiplist-container");
    outerContainer.appendChild(shipListContainer);

    this.populateShip(this.playerSubmarine, shipListContainer);
    this.populateShip(this.playerDestoryer, shipListContainer);
    this.populateShip(this.playerAircraftCarrier, shipListContainer);
    this.populateShip(this.playerCruiser, shipListContainer);
    this.populateShip(this.playerBattleShip, shipListContainer);

    this.recordAiShip.push(this.aiAircraftCarrier);
    this.recordAiShip.push(this.aiBattleShip);
    this.recordAiShip.push(this.aiCruiser);
    this.recordAiShip.push(this.aiDestoryer);
    this.recordAiShip.push(this.aiSubmarine);
  }

  populateShip(ship, shipListContainer) {
    const shipContainer = document.createElement("div");
    shipContainer.classList.add("ship-container");
    shipContainer.setAttribute("id", `ship${ship.shipLength}-container`);
    shipContainer.style.gridTemplateColumns = `repeat(${ship.shipLength}, 50px)`;
    shipListContainer.appendChild(shipContainer);

    shipContainer.draggable = true;

    for (let i = 0; i < ship.shipLength; i += 1) {
      const shipCell = document.createElement("div");
      shipCell.classList.add("ship-cell");
      this.colorFromLength(ship.shipLength, shipCell);
      shipCell.setAttribute("id", `${ship.shipLength}`);
      shipContainer.appendChild(shipCell);
    }

    this.recordPlayerShip.push(ship);
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

        // PLayer
        if (
          // Duplicated?
          // Check if first and last are in the same row
          this.inSameRow(startCol, shipCells.length, this.playerBoard) ===
            true &&
          this.isCellPlaced(firstIndex, shipCells.length, this.playerBoard) ===
            true
        ) {
          for (let i = firstIndex; i < firstIndex + shipCells.length; i += 1) {
            playerCells[i].classList.add("placed");
            this.colorFromLength(shipCells.length, playerCells[i]);
            draggedShipContainer.style.display = "none";
          }
          this.shipCounting -= 1;

          // Use recordShip and placeShip to place the ship on the actual array
          this.pushShipLengthToArray(
            firstIndex,
            shipCells,
            this.playerBoard,
            this.recordPlayerShip,
            this.recordPlayerShipLocation
          );

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

          this.pushShipLengthToArray(
            aiFirstIndex,
            shipCells,
            this.aiBoard,
            this.recordAiShip,
            this.recordAiShipLocation
          );
        }

        // Ai board appear when user move every ships to player boards
        if (this.shipCounting === 0) {
          shipListContainer.style.display = "none";
          aiBoardContainer.classList.remove("hide");
        }
      });
    });
  }

  pushShipLengthToArray(
    firstIndex,
    shipCells,
    board,
    recordShip,
    recordLocation
  ) {
    for (let i = 0; i < recordShip.length; i += 1) {
      if (recordShip[i].shipLength === shipCells.length) {
        this.placeShip(firstIndex, recordShip[i], board, recordLocation);
      }
    }
  }

  placeShip(startLocation, ship, gameboard, recordLocation) {
    // Input Validation
    if (startLocation < 0 || startLocation === null)
      return "Index cant be negative number or null";

    // Calculate Start Row and Start Column
    let startRow = this.getRow(startLocation);
    let startCol = this.getCol(startLocation);

    // Check if Index is Larger Than the Board:
    if (startRow > gameboard.length) return "Index is larger than the board";

    // Duplicated?
    if (this.inSameRow(startCol, ship.shipLength, gameboard) === true) {
      // Store ship coordinate
      for (let k = 0; k < ship.shipLength; k += 1) {
        gameboard[startRow][startCol] = ship.shipLength;
        if (startCol <= 10) {
          // Fix recordPlayerShipLocation
          recordLocation.push({
            shipLocation: startLocation,
            ship,
          });

          startLocation += 1;
          startCol += 1;
        } else {
          startRow += 1;
          startCol = 0;
        }
      }
    } else {
      return "out of bound";
    }
  }

  receiveAttack(hitLocation, board, recordLocation) {
    const hitRow = this.getRow(hitLocation);
    const hitCol = this.getCol(hitLocation);

    if (board[hitRow][hitCol] === 0) board[hitRow][hitCol] = -1;

    if (board[hitRow][hitCol] !== 0 && board[hitRow][hitCol] !== -1) {
      for (let i = 0; i < recordLocation.length; i += 1) {
        if (hitLocation === recordLocation[i].shipLocation) {
          recordLocation[i].ship.hits();
        }
      }

      // If a user shoots at this grid location, mark it as -1 to indicate a shot.
      board[hitRow][hitCol] = -1;
    } else {
      return "Shot at the same locaiton";
    }
  }

  isAllShipsSunk(ships) {
    return ships.every((ship) => ship.shipLength === "sunken ship");
  }

  playerWinCondition() {
    return this.isAllShipsSunk(this.recordAiShip);
  }

  aiWinCondition() {
    return this.isAllShipsSunk(this.recordPlayerShip);
  }

  inSameRow(startIndex, shipLength, gameboard) {
    if (startIndex + shipLength <= gameboard.length) {
      return true;
    }
    return false;
  }

  isCellPlaced(firstIndex, shipCellslength, gameboard) {
    const row = this.getRow(firstIndex);
    const col = this.getCol(firstIndex);

    for (let i = col; i < col + shipCellslength; i += 1) {
      if (gameboard[row][i] !== 0) {
        return false;
      }
    }
    return true;
  }

  /* Helper method */
  getRow(index) {
    if (index >= 100) {
      return Math.floor(index / 10) - 10;
    }

    return Math.floor(index / 10);
  }

  getCol(index) {
    return index % 10;
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
