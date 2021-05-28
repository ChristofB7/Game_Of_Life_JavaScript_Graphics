let canvas, ctx;

var loading = 0;
var timeout;

var grid;
var cols;
var rows;
var w = 20;

var lifeCycle;
var timeSlider;

document.addEventListener('DOMContentLoaded', init);

//Left to do:
//multiple generations


function make2DArray(m, n){
  let arr = new Array(m); // create an empty array of length n
  for (var i = 0; i < m; i++) {
    arr[i] = new Array(n); // make each element an array
  }
  //console.log(arr); 
  return arr;
}

function resizeCanvas() {
  cols = Math.floor(canvas.width/w);
  rows = Math.floor(canvas.height/w);
  grid = make2DArray(cols,rows);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  for(var i=0;i<cols;i++){
    for(var j=0;j<rows;j++){
      grid[i][j] = new Cell(i*w, j*w, w);
    }
  }
  drawGrid();
}

function drawName(){
  var midX = cols/2;
  var midY = rows/2;
  for(var i=0;i<5;i++){
    for(var j=0;j<3;j++){

    }
  }
}

function init () {
  canvas = document.getElementById('gameBoard');
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();
  randomize();
  dragElement(document.getElementById("mydiv"));
  timeSlider = document.getElementById("speed");
}

function clickOn(event) {
  if(loading>0){

  }
  else{
    var x = event.offsetX;
      var y = event.offsetY;
      //console.log("MOUSE: "+x+" "+y);
      // var coords = "X coords: " + x + ", Y coords: " + y;
      // document.getElementById("demo").innerHTML = coords;
      for(var i=0;i<cols;i++){
        for(var j=0;j<rows;j++){
          var cell = grid[i][j];
          if(cell.contains(x, y)){
            if(cell.filled==true){
              cell.clear(ctx);
            }
            else{
              cell.filled=true;
            }
            //document.getElementById("demo").innerHTML = countNeighbors(i,j);
            drawGrid();
          }
        }
      }
  }
}

function clearButton(){
  if(loading>0){

  }
  else{
    clearGrid();
  }
}

function clearGrid(){
  for(var i=0;i<cols;i++){
    for(var j=0;j<rows;j++){
      grid[i][j].clear(ctx);
    }
  }
  drawGrid();
}

function randomize(){
  if(loading>0){

  }
  else{
    clearGrid();
    for(var i=0;i<cols;i++){
      for(var j=0;j<rows;j++){
        if(Math.random(1)<0.5){
          grid[i][j].filled = true;
        }
        else{
          grid[i][j].filled = false;
        }
      }
    }
    drawGrid();
  }
}

function drawGrid(){
  for(var i=0;i<cols;i++){
      for(var j=0;j<rows;j++){
        grid[i][j].show(ctx);
      }
    }
}

function countNeighbors(posX,posY){
  var neighbors = 0;
 
  for(var i=-1;i<2;i++){
    for(var j=-1;j<2;j++){
      var n = posX+i;
      var m = posY+j;

      if(n<0||m<0||n>=cols||m>=rows){
        continue;
      }
      else if(grid[n][m].filled==true){
        if(i==0&&j==0){
          continue;
        }
        else{
          // console.log("current cell "+posX+" "+posY);
          // console.log("Neighbor "+(posX+i)+ " "+(posY+j));
          neighbors++;
        }
      }
    }
  }
  return neighbors;
}

function neighborArray(){
  var nArray = []
  for(var i=0;i<cols;i++){
    var insideArr=[];
    for(var j=0;j<rows;j++){
      insideArr.push(countNeighbors(i,j));
    }
    nArray.push(insideArr);
  }
  return nArray;
}

function nextGeneration(){
  var neighbors = neighborArray();
  //rules are
  //1. Any live cell with fewer than 2 live neighbors dies
  //2. Any live cell with two or 3 lives on
  //3. any live cell with more than 3 live neighbors dies
  //4. any dead cell with exactly 3 live neighbors becomes a live cell.
  var population = make2DArray(cols,rows);

  for(var i =0;i<cols;i++){
    for(var j=0;j<rows;j++){
      var cell = grid[i][j];
      //rule 2
      if(neighbors[i][j]>1&&neighbors[i][j]<4&&cell.filled==true){
        population[i][j]=1;
      }
      else if(neighbors[i][j]==3&&cell.filled == false){
        population[i][j]=1;
      }
      else{
        population[i][j]=0;
      }
    }
  }

  clearGrid();
  for(var i=0;i<cols;i++){
    for(var j=0;j<rows;j++){
      grid[i][j].filled = population[i][j];
    }
  }
  drawGrid();
}

function abort(){
  clearTimeout(timeout);
  loading = 0;
  clearGrid();
  var gens = document.getElementById("demo").innerHTML = "generations left: ";
}

function getGenerations(){
  if(loading>0){

  }
  else{
    var num = document.getElementById("gen").value;
    drawOutGenerations(num);
  }
}

function drawOutGenerations(generations){
  loading++;
  var gens = document.getElementById("demo").innerHTML = "generations left: " + generations;
  timeout = setTimeout(function (){
    if(generations==0){
      loading=0;
      return;
    }
    gens = generations;
    nextGeneration();
    drawOutGenerations(generations-1);
    console.log(timeSlider.value/100);
  }, 1000*(timeSlider.value/100));

} 


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


