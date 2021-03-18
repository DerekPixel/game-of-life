const make2DArray = (rows, cols) => {

  var ones = 0, zeros = 0;

  var arr = new Array(rows);
  for(var i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }

  for(var i = 0; i < arr.length; i++) {
    for(var j = 0; j < arr[i].length; j++) {
      var oneOrZero = Math.random() > 0.5 ? 1 : 0;
      arr[i][j] = oneOrZero;
      oneOrZero ? ones+=1 : zeros+=1;
    }
  }

  return {arr, ones, zeros};

}
var grid = make2DArray(10, 10);

console.table(grid.arr);

console.log(`The number of ones are: ${grid.ones}`);
console.log(`The number of zeros are: ${grid.zeros}`);

var mainDiv = document.getElementById('main');

var canvas = document.createElement('canvas');
canvas.id = 'mycanvas';
canvas.width = 400;
canvas.height = 400;
canvas.style.backgroundColor = 'black';
var ctx = canvas.getContext('2d');

mainDiv.append(canvas);

draw();
// loop();
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