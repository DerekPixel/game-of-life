var rows = 50;
var cols = 50;

var grid = make2DArray(rows, cols);
var nextGrid = make2DArray(rows, cols);

var timer;
var isPlaying = false;


// console.table(grid);

var mainDiv = document.getElementById('main');

var canvas = document.createElement('canvas');
canvas.id = 'mycanvas';
canvas.width = 500;
canvas.height = 500;
canvas.style.backgroundColor = 'black';
var ctx = canvas.getContext('2d');

var playButton = document.createElement('button');
playButton.textContent = 'play/pause';

var stepButton = document.createElement('button');
stepButton.textContent = 'step';

var clearButton = document.createElement('button');
clearButton.textContent = 'clear';


mainDiv.append(canvas);
mainDiv.append(playButton);
mainDiv.append(stepButton);
mainDiv.append(clearButton);

playButton.addEventListener('click', () => {
  if(isPlaying) {
    clearInterval(timer);
    isPlaying = false;
  } else {
    timer = setInterval(() => {
      updateGridValues();
    }, 100);
    isPlaying = true;
  }
})

stepButton.addEventListener('click', () => {
  if(isPlaying) {
    clearInterval(timer);
    isPlaying = false;
  } else {
    updateGridValues();
  }
})

clearButton.addEventListener('click', () => {
  isPlaying = false;
  clearInterval(timer);
  grid = make2DArray(rows, cols);
})

var xOffset = canvas.width / cols;
var yOffset = canvas.height / rows;


loop();
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for(var i = 0; i < grid.length; i++) {
    for(var j = 0; j < grid[i].length; j++) {
      if(grid[i][j] === 1) {
        ctx.save();
        // ctx.scale(5, 5);
        ctx.translate(j * xOffset, i * yOffset);
        ctx.beginPath();
        ctx.rect(0, 0, xOffset, yOffset)
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.restore();
      }
    }
  }

}

function loop() {
  window.requestAnimationFrame(loop);
  draw();
}

var rowState, colState;

canvas.addEventListener('mousedown', (e) => {
  handlePlaceCell(e);
  canvas.addEventListener('mousemove', handlePlaceCell);
});

canvas.addEventListener('mouseup', () => {
  canvas.removeEventListener('mousemove', handlePlaceCell);
  rowState = undefined;
  colState = undefined;
});

function handlePlaceCell(e) {
  var rect = canvas.getBoundingClientRect();
  var mouseX = e.clientX - rect.left;
  var mouseY = e.clientY - rect.top;

  var col = Math.floor(mouseX / xOffset);
  var row = Math.floor(mouseY / yOffset);

  if(rowState !== row || colState !== col) {
    rowState = row;
    colState = col;
    placeCell(row, col);
  }

}

function placeCell(row, col) {
  
  if(grid[row][col] === 1) {
    grid[row][col] = 0;
  } else if(grid[row][col] === 0) {
    grid[row][col] = 1;
  }
}


function make2DArray(rows, cols) {

  var arr = new Array(rows);
  for(var i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }

  for(var i = 0; i < arr.length; i++) {
    for(var j = 0; j < arr[i].length; j++) {
      // var oneOrZero = Math.random() > 0.8 ? 1 : 0;
      arr[i][j] = 0;
    }
  }

  return arr;

}

function countNeighbors(grid, x, y) {
  var total = 0;
  for(var i = -1; i < 2; i++) {
    var r = i + x;
    if(r === -1) {
      r = rows - 1;
    } else if(r === rows) {
      r = 0;
    }
    for(var j = -1; j < 2; j++) {
      var c = j + y;
      if(c === -1) {
        c = cols - 1;
      } else if(c === cols) {
        c = 0;
      }
      total += grid[r][c];
    }
  }
  total -= grid[x][y];
  return total;
}

function updateGridValues(){

  for(var i = 0; i < nextGrid.length; i++) {
    for(var j = 0; j < nextGrid[i].length; j++) {
      var state = grid[i][j];

      var neighbors = countNeighbors(grid, i, j);

      if(state === 0 && neighbors === 3) {
        nextGrid[i][j] = 1;
      } else if(state === 1 && (neighbors < 2 || neighbors > 3)) {
        nextGrid[i][j] = 0;
      } else {
        nextGrid[i][j] = state;
      }
    }
  }

  [grid, nextGrid] = [nextGrid, grid];

}