import Vector from './Vector.js';
import makeNewSlider from './function.js';

//CONTENTS
/*
  a1 - INITIALIZE HTML ELEMENTS AND GLOBAL VARIABLES
    a2.1 - HTML ELEMENTS
    a2.2 - GLOBAL VARIABLES
  
  b1 - APPEND HTML ELEMENTS

  c1 - INITIALIZE EVENT LISTENERS AND INPUTS
    c2.1 - BUTTON LISTENERS
    c2.2 - MOUSE LISTENERS
    c2.3 - SLIDER INPUT

  d1 - DRAW TO THE CANVAS
    d2.1 - DRAW CELLS
    d2.2 - DRAW THE BACKGROUND GRID

  e1 - FUNCTIONS
    e2.1 - make2DArray
    e2.2 - countNeighbors
    e2.3 - updateGridValues
    e2.4 - changeCellState
    e2.5 - handleDragMovement
    e2.6 - handleZoom
    e2.7 - disableScroll
    e2.8 - keepCanvasContentInCanvasLimits
*/



//INITIALIZE HTML ELEMENTS AND GLOBAL VARIABLES - a1

  //HTML ELEMENTS - a2.1
  var mainDiv = document.getElementById('main');

  var canvas = document.createElement('canvas');
  canvas.id = 'mycanvas';
  canvas.height = 9 * 50;
  canvas.width = 16 * 50;
  canvas.oncontextmenu = (e) => {
    e.preventDefault();
  };
  var ctx = canvas.getContext('2d');

  var buttonDiv = document.createElement('div');
  buttonDiv.className = 'button-div'

  var playButton = document.createElement('button');
  playButton.textContent = 'PLAY/PAUSE';

  var stepButton = document.createElement('button');
  stepButton.textContent = 'STEP';

  var clearButton = document.createElement('button');
  clearButton.textContent = 'CLEAR';

  var rowsColsSlider = makeNewSlider('# of rows and cols', 1, 15, 4);
  rowsColsSlider.div.className = 'slider-div';
  rowsColsSlider.slider.className = 'slider';

  //GLOBAL VARIABLES - a2.2
  var rows = 9 * rowsColsSlider.slider.value;
  var cols = 16 * rowsColsSlider.slider.value

  var rowState, colState;

  var xOffset = canvas.width / cols;
  var yOffset = canvas.height / rows;

  var gridWidth = xOffset * cols;
  var gridHeight = yOffset * rows;

  var grid = make2DArray(rows, cols);
  var nextGrid = make2DArray(rows, cols);

  var startDrag = new Vector(0, 0);
  var endDrag = new Vector(0, 0);

  var dragOffset = endDrag.subtract(startDrag);
  var PreviousDragOffset = dragOffset;

  var scale = 1;

  var timer;
  var isPlaying = false;

//APPEND HTML ELEMENTS - b1
  mainDiv.append(canvas);
  buttonDiv.append(playButton);
  buttonDiv.append(stepButton);
  buttonDiv.append(clearButton);
  buttonDiv.append(rowsColsSlider.div);
  mainDiv.append(buttonDiv);

//INITIALIZE EVENT LISTENERS AND INPUTS - c1

  //BUTTON LISTENERS - c2.1
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

  //MOUSE LISTENERS - c2.2
  canvas.addEventListener('mousedown', (e) => {
    if(e.shiftKey && e.button === 0) {
      var rect = canvas.getBoundingClientRect();
      var mouseX = e.clientX - rect.left;
      var mouseY = e.clientY - rect.top;
    
      startDrag = new Vector(mouseX, mouseY);
  
      canvas.addEventListener('mousemove', handleDragMovement);
    } else {
      changeCellState(e);
      canvas.addEventListener('mousemove', changeCellState);
    }
  });

  canvas.addEventListener('mouseup', () => {
    PreviousDragOffset = dragOffset;
    canvas.removeEventListener('mousemove', handleDragMovement);

    canvas.removeEventListener('mousemove', changeCellState);
    rowState = undefined;
    colState = undefined;
  });

  canvas.addEventListener('wheel', disableScroll);

  //SLIDER INPUT - c2.3
  rowsColsSlider.slider.oninput = () => {
    rows = 9 * rowsColsSlider.slider.value;
    cols = 16 * rowsColsSlider.slider.value

    xOffset = canvas.width / cols;
    yOffset = canvas.height / rows;
  
    gridWidth = xOffset * cols;
    gridHeight = yOffset * rows;
  
    grid = make2DArray(rows, cols);
    nextGrid = make2DArray(rows, cols);
  
    startDrag = new Vector(0, 0);
    endDrag = new Vector(0, 0);
  
    dragOffset = endDrag.subtract(startDrag);
    PreviousDragOffset = dragOffset;
  
    scale = 1;
  
    timer;
    isPlaying = false;
    clearInterval(timer);
  }


//DRAW TO THE CANVAS - d1
  loop();
  function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //DRAW CELLS - d2.1
    for(var i = 0; i < grid.length; i++) {
      for(var j = 0; j < grid[i].length; j++) {
        if(grid[i][j] === 1) {
          ctx.save();
          ctx.translate(((j * xOffset) * scale) + dragOffset.x, ((i * yOffset) * scale) + dragOffset.y);
          ctx.scale(scale, scale);
          ctx.beginPath();
          ctx.rect(0, 0, xOffset, yOffset)
          ctx.fillStyle = 'white';
          ctx.fill();
          ctx.restore();
        }
      }
    }

    //DRAW THE BACKGROUND GRID - d2.2

    ctx.beginPath();
    ctx.lineWidth = 1;
    for(var i = 0; i < grid.length; i++) {
      ctx.moveTo(0 + dragOffset.x, (i * xOffset * scale) + dragOffset.y);
      ctx.lineTo(canvas.width - dragOffset.x, (i * xOffset * scale) + dragOffset.y);
      for(var j = 0; j < grid[i].length; j++) {
        ctx.moveTo((j * yOffset * scale) + dragOffset.x, 0 + dragOffset.y);
        ctx.lineTo((j * yOffset * scale) + dragOffset.x, canvas.height - dragOffset.y);
      }
    }
    ctx.strokeStyle = 'rgb(25, 25, 25)';
    ctx.stroke();
  }

  function loop() {
    window.requestAnimationFrame(loop);
    draw();
  }

//FUNCTIONS - e1

  //e2.1
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

  //e2.2
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

  //e2.3
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

  //e2.4
  function changeCellState(e) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;

    //this is to counteract the border width
    mouseX -= 10;
    mouseY -= 10;

    mouseX -= dragOffset.x;
    mouseY -= dragOffset.y;
    
    var col = Math.floor((mouseX / (xOffset)) / scale);
    var row = Math.floor((mouseY / (yOffset)) / scale);

    if(rowState !== row || colState !== col) {
      rowState = row;
      colState = col;

      if(e.buttons === 1) {
        grid[row][col] = 1;
      } else if(e.buttons === 2) {
        grid[row][col] = 0;
      }
    }
  }

  //e2.5
  function handleDragMovement(e) {
    if(e.shiftKey && e.button === 0) {
      var rect = canvas.getBoundingClientRect();
      var mouseX = e.clientX - rect.left;
      var mouseY = e.clientY - rect.top;
    
      endDrag = new Vector(mouseX, mouseY);
    
      var startAndEndDragDifference = endDrag.subtract(startDrag);
    
      var newDragOffset = PreviousDragOffset.add(startAndEndDragDifference)
    
      dragOffset = newDragOffset;
  
      keepCanvasContentInCanvasLimits();
    }
  }
  
  //e2.6
  function handleZoom(e) {
  
    if(Math.sign(e.deltaY) === -1) {
      scale += 0.1;
    } else if(Math.sign(e.deltaY) === 1) {
      if(scale > 1) {
        scale -= 0.1;
    } else {
        scale = 1;
      }
    }
  
    keepCanvasContentInCanvasLimits();
  }
  
  //e2.7
  function disableScroll(e) {
    handleZoom(e)
    return e.preventDefault();
  }

  //e2.8
  function keepCanvasContentInCanvasLimits() {
    if(dragOffset.x >= 0) {
      dragOffset.x = 0;
    }
  
    if(dragOffset.x + (gridWidth * scale)  <= canvas.width) {
      dragOffset.x = canvas.width - (gridWidth * scale);
    }
  
    if(dragOffset.y >= 0) {
      dragOffset.y = 0;
    }
  
    if(dragOffset.y + (gridHeight * scale) <= canvas.height) {
      dragOffset.y = canvas.height - (gridHeight * scale);
    }
  }