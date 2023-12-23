export class Ship {
  constructor(shipLength) {
    if (shipLength >= 0) {
      this.shipLength = shipLength;
    } else {
      this.shipLength = -1;
    }

    //inside?
    this.hits();
  }

  hits() {
    this.shipLength = this.shipLength - 1;
  }

  isSunk() {
    if (this.shipLength < 0) {
      console.log("Ship destory");
    }
  }
}

const newShip = new Ship(5);

//Outside
newShip.hits();
