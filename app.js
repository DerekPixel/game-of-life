const make2DArray = (rows, cols) => {

  var ones = 0, zeros = 0;

  var arr = new Array(rows);
  for(var i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }

  for(var i = 0; i < arr.length; i++) {
    for(var j = 0; j < arr[i].length; j++) {
      // var oneOrZero = Math.random() > 0.5 ? 1 : 0;
      arr[i][j] = 0;
      // oneOrZero ? ones+=1 : zeros+=1;
    }
  }

  // arr[1][0] = 1;
  arr[1][1] = 1;
  arr[1][2] = 1;
  arr[1][3] = 1;
  arr[1][4] = 1;
  arr[1][5] = 1;
  arr[1][6] = 1;
  arr[1][7] = 1;

  return {arr, ones, zeros};

}

const countNeighbors = (grid, x, y) => {
  var total = 0;
  for(var i = -1; i < 2; i++) {
    var r = i + x;
    if(r === -1) {
      r = 9
    } else if(r === 10) {
      r = 0
    }
    for(var j = -1; j < 2; j++) {
      var c = j + y;
      if(c === -1) {
        c = 9
      } else if(c === 10) {
        c = 0
      }
      total += grid[r][c];
    }
  }
  total -= grid[x][y];
  return total;
}

const updateGridValues = (grid) => {

  var newArr = new Array(10);
  for(var i = 0; i < newArr.length; i++) {
    newArr[i] = new Array(10);
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

  return {arr: newArr};

}

var grid = make2DArray(10, 10);

var timer = setInterval(() => {
  grid = updateGridValues(grid.arr)
}, 500);


console.table(grid.arr);
// console.log(countNeighbors(grid.arr, 5, 0))

// console.log(`The number of ones are: ${grid.ones}`);
// console.log(`The number of zeros are: ${grid.zeros}`);

var mainDiv = document.getElementById('main');

var canvas = document.createElement('canvas');
canvas.id = 'mycanvas';
canvas.width = 400;
canvas.height = 400;
canvas.style.backgroundColor = 'black';
var ctx = canvas.getContext('2d');

mainDiv.append(canvas);

// draw();
loop();
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for(var i = 0; i < grid.arr.length; i++) {
    for(var j = 0; j < grid.arr[i].length; j++) {
      if(grid.arr[i][j] === 1) {
        ctx.save();
        ctx.translate(j * 40, i * 40);
        ctx.beginPath();
        ctx.rect(0, 0, 40, 40)
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