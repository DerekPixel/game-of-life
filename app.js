var rows = 90;
var cols = 160;

var grid = make2DArray(rows, cols);

var timer = setInterval(() => {
  grid = updateGridValues(grid)
}, 100);


// console.table(grid);

var mainDiv = document.getElementById('main');

var canvas = document.createElement('canvas');
canvas.id = 'mycanvas';
canvas.width = 16 * 75;
canvas.height = 9 * 75;
canvas.style.backgroundColor = 'black';
var ctx = canvas.getContext('2d');

mainDiv.append(canvas);

var xOffset = canvas.width / cols;
var yOffset = canvas.height / rows;


loop();
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for(var i = 0; i < grid.length; i++) {
    for(var j = 0; j < grid[i].length; j++) {
      if(grid[i][j] === 1) {
        ctx.save();
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




function make2DArray(rows, cols) {

  var ones = 0, zeros = 0;

  var arr = new Array(rows);
  for(var i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }

  for(var i = 0; i < arr.length; i++) {
    for(var j = 0; j < arr[i].length; j++) {
      var oneOrZero = Math.random() > 0.8 ? 1 : 0;
      arr[i][j] = oneOrZero;
      oneOrZero ? ones+=1 : zeros+=1;
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

function updateGridValues(grid){

  var newArr = new Array(rows);
  for(var i = 0; i < newArr.length; i++) {
    newArr[i] = new Array(cols);
  }

  for(var i = 0; i < newArr.length; i++) {
    for(var j = 0; j < newArr[i].length; j++) {
      var state = grid[i][j];

      var neighbors = countNeighbors(grid, i, j);

      if(state === 0 && neighbors === 3) {
        newArr[i][j] = 1;
      } else if(state === 1 && (neighbors < 2 || neighbors > 3)) {
        newArr[i][j] = 0;
      } else {
        newArr[i][j] = state;
      }

    }
  }

  return newArr;
}