export class Ship {
  constructor(shipLength) {
    if (shipLength >= 0) {
      this.shipLength = Array.from({ length: shipLength }, () => shipLength);
    } else {
      this.shipLength = -1;
    }
    this.shipCoordinate = [];
  }

  hits(hitValue) {
    this.shipLength[hitValue] = -1;
    this.isSunk();
  }

  isSunk() {
    if (this.shipLength.every((value) => value === -1)) {
      this.shipLength = "sunken ship";
    }
  }
}
