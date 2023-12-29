(()=>{"use strict";class t{constructor(t){this.shipLength=t>=0?Array.from({length:t},(()=>t)):-1,this.shipCoordinate=[]}hits(t){this.shipLength[t]=-1,this.isSunk()}isSunk(){this.shipLength.every((t=>-1===t))&&(this.shipLength="sunken ship")}}class e{constructor(t){this.player=t}}new class{subMarine=new t(2);destoryer=new t(3);battleShip=new t(4);cruiser=new t(5);aircraftCarrier=new t(6);player=new e(!0);ai=new e(!1);constructor(t,e){this.playerBoard=this.createArrayboard(t),this.aiBoard=this.createArrayboard(e),this.createBoard(),this.playerTurn()}createArrayboard(t){return Array.from({length:t},(()=>Array.from({length:t},(()=>0))))}playerTurn(){const t=document.querySelectorAll(".ai-cell");document.querySelector(".player-cell"),t.forEach(((t,e)=>{t.addEventListener("click",(()=>{const t=this.getRow(e),r=this.getCol(e);this.player&&-1!==this.aiBoard[t][r]&&(this.receiveAttack(e,_,this.aiBoard),console.log("work"))}))}))}aiTurn(){document.querySelector(".player-cell").forEach(((t,e)=>{this.ai&&(this.receiveAttack(e,_,this.playerBoard),this.ai=!1,this.player=!0)}))}createBoard(){const t=document.createElement("div");t.classList.add("container"),document.body.appendChild(t);const e=document.createElement("div");e.classList.add("board-container","player-board"),t.appendChild(e);const r=document.createElement("div");r.classList.add("board-container","ai-board"),t.appendChild(r),this.populateBoard(e),this.populateBoard(r)}populateBoard(t){for(let e=0;e<10;e++)for(let e=0;e<10;e++){const e=document.createElement("div");e.classList.add("cell"),t.classList.contains("player-board")?e.classList.add("player-cell"):e.classList.add("ai-cell"),t.appendChild(e)}}placeship(t,e){if(t<0||null===t)return"Index cant be negative number or null";let r=this.getRow(t),i=this.getCol(t);if(r>this.playerBoard.length)return"Index is larger than the board";if(!(i+e.shipLength.length<=this.playerBoard.length))return"out of bound";for(let s=0;s<e.shipLength.length;s++)this.playerBoard[r][i]=e.shipLength[s],i<=10?(e.shipCoordinate.push(t),t++,i++):(r++,i=0)}receiveAttack(t,e,r){let i=this.getRow(t),s=this.getCol(t);if(console.log(i),console.log(s),-1===r[i][s])return"Shot at the same locaiton";if(2===r[i][s]){const e=this.getShipCoordinate(this.subMarine,t);this.subMarine.hits(e)}if(3===r[i][s]){const e=this.getShipCoordinate(this.destoryer,t);this.destoryer.hits(e)}if(4===r[i][s]){const e=this.getShipCoordinate(this.battleShip,t);this.battleShip.hits(e)}if(5===r[i][s]){const e=this.getShipCoordinate(this.cruiser,t);this.cruiser.hits(e)}if(6===r[i][s]){const e=this.getShipCoordinate(this.aircraftCarrier,t);this.aircraftCarrier.hits(e)}if(e!==_&&r[i][s]===e.shipLength.length){const r=this.getShipCoordinate(e,t);e.hits(r)}r[i][s]=-1}getShipCoordinate(t,e){return t.shipCoordinate.indexOf(e)}getRow(t){return t>=100?Math.floor(t/10)-10:Math.floor(t/10)}getCol(t){return t%10}isWithinBound(t,e){return t>-1&&t<11&&e>-1&&e<11}}(10,10)})();