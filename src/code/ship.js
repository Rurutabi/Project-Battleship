export class Ship {
  constructor(shipLength) {
    if (shipLength >= 0) {
      this.shipLength = Array.from({ length: shipLength }, () => 1);
    } else {
      this.shipLength = -1;
    }
  }

  hits(hitValue) {
    this.shipLength[hitValue] = 0;
    this.isSunk();
  }

  isSunk() {
    if (this.shipLength.every((value) => value === 0)) {
      this.shipLength = "sunken ship";
    }
  }
}
