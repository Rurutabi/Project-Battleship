export class Ship {
  constructor(shipLength) {
    if (shipLength >= 0) {
      this.shipLength = shipLength;
    } else {
      this.shipLength = -1;
    }
  }

  hits() {
    this.shipLength -= 1;
    this.isSunk();
  }

  isSunk() {
    if (this.shipLength === 0) {
      this.shipLength = "sunken ship";
    }
  }
}
