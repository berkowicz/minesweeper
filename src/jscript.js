const board = [];
const columns = 10;
const rows = 10;
const minesCount = 10;

let minesLocation = []; // ex. "1-2", "column-rows"
let clockSeconds = 0;
let tilesClicked = 0;
let gameOver = false;

//Places mines randomly
function setMines() {
  let minesLeft = minesCount;
  while (minesLeft > 0) {
    let c = Math.floor(Math.random() * columns);
    let r = Math.floor(Math.random() * rows);
    let id = c.toString() + '-' + r.toString();

    if (!minesLocation.includes(id)) {
      minesLocation.push(id);
      minesLeft -= 1;
    }
  }
}

//Initiate and fills board with tiles
const init = function () {
  document.getElementById('mines-count').textContent = minesCount;
  setMines();

  //Fills board with tiles
  for (let i = 0; i < columns; i++) {
    let columns = [];
    for (let j = 0; j < rows; j++) {
      let tile = document.createElement('div');
      tile.id = i.toString() + '-' + j.toString();
      tile.classList = 'tile';
      tile.addEventListener('contextmenu', rightClickTile);
      tile.addEventListener('click', leftClickTile);
      document.querySelector('.mine-feild').append(tile);
      columns.push(tile);
    }
    board.push(columns);
  }
};

init();

//Right click (flag)
function rightClickTile(mouseevent) {
  if (gameOver || this.classList.contains('tile-clicked')) {
    return;
  }
  let tile = this;
  if (tile.innerText == '🚩') {
    tile.innerText = '';
  } else {
    tile.innerText = '🚩';
  }
}

//Left click
function leftClickTile(mouseevent) {
  if (gameOver || this.classList.contains('tile-clicked')) {
    return;
  }
  let tile = this;
  if (minesLocation.includes(tile.id)) {
    gameOver = true;
    revealMines();
  } else {
    let coords = tile.id.split('-');
    let c = parseInt(coords[0]);
    let r = parseInt(coords[1]);
    checkMine(c, r);
  }
}

//Check neigbouring tiles for mines
function checkMine(c, r) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return;
  }
  if (board[c][r].classList.contains('tile-clicked')) {
    return;
  }
  let tile = board[c][r];
  //Adds tile-clicked style to clicked tile
  board[c][r].classList.add('tile-clicked');
  tilesClicked += 1;

  let minesFound = 0;

  //Checks neigbouring tiles for mine
  //Check top 3
  minesFound += checkTiles(c - 1, r - 1);
  minesFound += checkTiles(c, r - 1);
  minesFound += checkTiles(c + 1, r - 1);

  //Check left and right
  minesFound += checkTiles(c - 1, r);
  minesFound += checkTiles(c + 1, r);

  //Check bottom 3
  minesFound += checkTiles(c - 1, r + 1);
  minesFound += checkTiles(c, r + 1);
  minesFound += checkTiles(c + 1, r + 1);

  //Adds number to tile if neibour have mine
  if (minesFound > 0) {
    board[c][r].innerText = minesFound;
    board[c][r].classList.add('x' + minesFound.toString());
  } else {
    //Neigbours checks their neigbour for mines
    checkMine(c - 1, r - 1); //Top left
    checkMine(c, r - 1); //Top
    checkMine(c + 1, r - 1); //Top right
    checkMine(c - 1, r); //Left
    checkMine(c + 1, r); //Right
    checkMine(c - 1, r + 1); //Bot Left
    checkMine(c, r + 1); //Bot
    checkMine(c + 1, r + 1); //Bot right
  }
  //Win game
  if (tilesClicked == rows * columns - minesCount) {
    document.getElementById('mines-count').innerText = 'Cleared';
    gameOver = true;
  }
}

//Checks for mines
function checkTiles(c, r) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return 0;
  }
  if (minesLocation.includes(c.toString() + '-' + r.toString())) {
    return 1;
  }
  return 0;
}

//When click on mine
function revealMines() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let tile = board[i][j];
      if (minesLocation.includes(tile.id)) {
        tile.innerText = '💣';
        tile.style.backgroundColor = 'red';
      }
    }
  }
}

//Timer
let gameArea = document.querySelector('.mine-feild');
gameArea.addEventListener('click', startTimer);
let timer = document.querySelector('.time');
function startTimer() {
  if (!timer.classList.contains('time-active')) {
    timer.classList.add('time-active');
    interval = setInterval(increment, 1000);
  }
}
function increment() {
  if (timer.classList.contains('time-active') && gameOver == false) {
    clockSeconds++;
    if (clockSeconds < 10)
      timer.innerText = 'Time: 00' + clockSeconds.toString();
    else if (clockSeconds >= 10 && clockSeconds <= 99)
      timer.innerText = 'Time: 0' + clockSeconds.toString();
    else if (clockSeconds >= 100)
      timer.innerText = 'Time: ' + clockSeconds.toString();
  }
}

//New game eventlistner
let newGame = document.querySelector('.new-game');
newGame.addEventListener('click', clickNewGame);

//New game
function clickNewGame() {
  gameOver = false;
  minesLocation = [];
  tilesClicked = 0;
  clockSeconds = 0;
  timer.classList.remove('time-active');
  timer.innerText = 'Time: 000';
  clearInterval(interval);

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let tile = board[i][j];
      if (
        tile.classList.contains('tile-clicked') ||
        tile.innerText == '🚩' ||
        tile.innerText == '💣'
      ) {
        tile.innerText = '';
        tile.style.backgroundColor = 'darkgray';
        tile.classList.remove('tile-clicked');
        tile.classList.remove('x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8');
        tile.classList.add('tile');
      }
    }
  }
  setMines();
}
