(()=>{"use strict";class e{constructor(e){this.shipLength=e>=0?e:-1}hits(){this.shipLength=this.shipLength-1,this.isSunk()}isSunk(){0===this.shipLength&&(this.shipLength="sunken ship")}}class t{constructor(e){this.player=e}}new class{subMarine=new e(2);destroyer=new e(3);battleShip=new e(4);cruiser=new e(5);aircraftCarrier=new e(6);draggedShipElement=null;player=new t(!0);ai=new t(!1);recordShipCreate=[];recordShipLocation=[];constructor(e,t){this.playerBoard=this.createArrayboard(e),this.aiBoard=this.createArrayboard(t),this.createBoard(),this.createShip(),this.dragShip(),this.handleTurnClick()}createArrayboard(e){return Array.from({length:e},(()=>Array.from({length:e},(()=>0))))}handleTurnClick(){const e=document.querySelectorAll(".ai-cell"),t=document.querySelectorAll(".player-cell"),a=new Set;e.forEach(((e,i)=>{e.addEventListener("click",(()=>{if(!e.classList.contains("aquamarine")&&!e.classList.contains("red")){let r;this.receiveAttack(i,this.aiBoard),e.classList.add("aquamarine");do{r=Math.floor(100*Math.random())}while(a.has(r)&&a.size<100);a.add(r);const s=this.getRow(r),o=this.getCol(r);0===this.playerBoard[s][o]?t[r].classList.add("aquamarine"):t[r].classList.add("red"),this.receiveAttack(r,this.playerBoard)}}))}))}createBoard(){const e=document.createElement("div");e.classList.add("container"),document.body.appendChild(e);const t=document.createElement("div");t.classList.add("board-container","player-board"),e.appendChild(t);const a=document.createElement("div");a.classList.add("board-container","ai-board"),e.appendChild(a),a.classList.add("hide"),this.populateBoard(t),this.populateBoard(a)}populateBoard(e){for(let t=0;t<10;t++)for(let t=0;t<10;t++){const t=document.createElement("div");t.classList.add("cell"),e.classList.contains("player-board")?t.classList.add("player-cell"):t.classList.add("ai-cell"),e.appendChild(t)}}createShip(){const e=document.querySelector(".container"),t=document.createElement("div");t.classList.add("shiplist-container"),e.appendChild(t),this.populateShip(this.subMarine,t),this.populateShip(this.destroyer,t),this.populateShip(this.aircraftCarrier,t),this.populateShip(this.cruiser,t),this.populateShip(this.battleShip,t)}populateShip(e,t){const a=document.createElement("div");a.classList.add("ship-container"),a.setAttribute("id",`ship${e.shipLength}-container`),a.style.gridTemplateColumns=`repeat(${e.shipLength}, 50px)`,t.appendChild(a),a.draggable=!0;for(let t=0;t<e.shipLength;t++){const t=document.createElement("div");t.classList.add("ship-cell"),this.colorFromLength(e.shipLength,t),t.setAttribute("id",`${e.shipLength}`),a.appendChild(t)}this.recordShipCreate.push(e)}dragShip(){const e=document.querySelectorAll(".player-cell"),t=(document.querySelector(".shiplist-container"),document.querySelectorAll(".ship-container"));document.querySelector(".ai-board"),t.forEach((e=>{e.addEventListener("dragstart",(t=>{t.dataTransfer.setData("text/shipContainerID",e.id),t.dataTransfer.setData("text/shipCellRelativePos",t.offsetX)}))})),e.forEach(((t,a)=>{t.addEventListener("dragover",(e=>{e.preventDefault()})),t.addEventListener("drop",(t=>{const i=t.dataTransfer.getData("text/shipContainerID"),r=document.getElementById(i),s=r.querySelectorAll(".ship-cell"),o=parseInt(t.dataTransfer.getData("text/shipCellRelativePos"),10),l=Math.floor(o/50),n=a-l,h=n+s.length,d=h-n,c=this.getCol(n);if(!0===this.inSameRow(c,d,this.playerBoard)&&this.isCellPlaced(e,n,h)){for(let t=n;t<n+s.length;t++)e[t].classList.add("placed"),this.colorFromLength(d,e[t]),r.remove();for(let e=0;e<this.recordShipCreate.length;e++)this.recordShipCreate[e].shipLength===s.length&&this.placePlayerShip(n,this.recordShipCreate[e],this.playerBoard)}}))}))}placeAiShip(e){const t=new Set;let a;do{a=Math.floor(100*Math.random())}while(t.has(a));t.add(a),lastIndex=a+e}placePlayerShip(e,t,a){if(e<0||null===e)return"Index cant be negative number or null";let i=this.getRow(e),r=this.getCol(e);if(i>a.length)return"Index is larger than the board";if(!0!==this.inSameRow(r,t.shipLength,a))return"out of bound";for(let s=0;s<t.shipLength;s++)a[i][r]=t.shipLength,r<=10?(this.recordShipLocation.push({shipLocation:e,ship:t}),e++,r++):(i++,r=0)}receiveAttack(e,t){let a=this.getRow(e),i=this.getCol(e);if(-1===t[a][i])return"Shot at the same locaiton";for(let t=0;t<this.recordShipLocation.length;t++)e===this.recordShipLocation[t].shipLocation&&this.recordShipLocation[t].ship.hits();t[a][i]=-1}inSameRow(e,t,a){return e+t<=a.length}isCellPlaced(e,t,a){for(let i=t;i<a;i++)if(e[i].classList.contains("placed"))return!1;return!0}getRow(e){return e>=100?Math.floor(e/10)-10:Math.floor(e/10)}getCol(e){return e%10}isWithinBound(e,t){return e>-1&&e<11&&t>-1&&t<11}colorFromLength(e,t){2===e&&t.classList.add("midnightblue"),3===e&&t.classList.add("goldenrod"),4===e&&t.classList.add("darkviolet"),5===e&&t.classList.add("palevioletred"),6===e&&t.classList.add("chartreuse")}}(10,10)})();