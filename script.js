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

function init () {
  canvas = document.getElementById('gameBoard');
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();
  dragElement(document.getElementById("mydiv"));
  timeSlider = document.getElementById("speed");
  drawName();
  drawGrid();
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
            console.log(i,j);
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
  var gens = document.getElementById("demo").innerHTML = "generations left: ";
}

function getGenerations(){
  if(loading>0){
    abort();
    document.getElementById("playimg").src = "./play.png";
  }
  else{
    var num = document.getElementById("gen").value;
    drawOutGenerations(num);
    document.getElementById("playimg").src = "./pause.png";
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

function drawName(){
  drawC();drawH();drawR();drawI();drawS();drawT();drawO();drawF();
  drawB();drawE1();drawL();drawI2();drawS2();drawL2();drawE2();
}

function drawC(){
  grid[7][6].filled=true;grid[6][6].filled=true;grid[5][6].filled=true;grid[5][7].filled=true;grid[5][8].filled=true;grid[5][9].filled=true;grid[5][10].filled=true;grid[6][10].filled=true;grid[7][10].filled=true;
}
function drawH(){
  grid[9][6].filled=true;grid[9][7].filled=true;grid[9][8].filled=true;grid[9][9].filled=true;grid[9][10].filled=true;grid[10][8].filled=true;grid[11][6].filled=true;grid[11][7].filled=true;grid[11][8].filled=true;grid[11][9].filled=true;grid[11][10].filled=true;
}
function drawR(){
  grid[13][6].filled=true;grid[13][7].filled=true;grid[13][8].filled=true;grid[13][9].filled=true;grid[13][10].filled=true;grid[14][6].filled=true;grid[15][6].filled=true;grid[15][7].filled=true;grid[15][8].filled=true;grid[14][9].filled=true;grid[15][10].filled=true;
}
function drawI(){
  grid[17][6].filled=true;grid[18][6].filled=true;grid[19][6].filled=true;grid[18][7].filled=true;grid[18][8].filled=true;grid[18][9].filled=true;grid[17][10].filled=true;grid[18][10].filled=true;grid[19][10].filled=true;
}
function drawS(){grid[21][10].filled=true;grid[22][10].filled=true;grid[23][10].filled=true;  grid[23][9].filled=true;grid[23][8].filled=true;grid[22][8].filled=true;grid[21][8].filled=true; grid[21][7].filled=true;grid[21][6].filled=true;grid[22][6].filled=true;grid[23][6].filled=true;
}
function drawT(){grid[25][6].filled=true;grid[26][6].filled=true;grid[27][6].filled=true;grid[26][7].filled=true;grid[26][8].filled=true;grid[26][9].filled=true;grid[26][10].filled=true;  
}
function drawO(){grid[30][6].filled=true;grid[31][6].filled=true;grid[31][7].filled=true;grid[31][8].filled=true;grid[31][9].filled=true;grid[31][10].filled=true;grid[30][10].filled=true;grid[29][10].filled=true;grid[29][9].filled=true;grid[29][8].filled=true;grid[29][7].filled=true;grid[29][6].filled=true;grid[30][6].filled=true;
}
function drawF(){grid[33][6].filled=true;grid[34][6].filled=true;grid[35][6].filled=true;grid[33][7].filled=true;grid[33][8].filled=true;grid[33][9].filled=true;grid[33][10].filled=true;grid[34][9].filled=true;
}
function drawB(){grid[5][12].filled=true;grid[6][12].filled=true;
grid[7][12].filled=true;grid[7][13].filled=true;grid[5][13].filled=true;grid[5][14].filled=true;grid[5][15].filled=true;grid[6][14].filled=true;grid[7][15].filled=true;grid[7][16].filled=true;grid[6][16].filled=true;grid[5][16].filled=true;
}
function drawE1(){grid[9][12].filled=true;grid[10][12].filled=true;grid[11][12].filled=true;grid[9][13].filled=true;grid[9][14].filled=true;grid[10][14].filled=true;grid[9][15].filled=true;grid[9][16].filled=true;grid[10][16].filled=true;grid[11][16].filled=true;
}
function drawL(){grid[13][12].filled=true;grid[13][13].filled=true;grid[13][14].filled=true;grid[13][15].filled=true;grid[13][16].filled=true;grid[14][16].filled=true;
}
function drawI2(){grid[16][12].filled=true;grid[17][12].filled=true;grid[18][12].filled=true;grid[17][13].filled=true;grid[17][14].filled=true;grid[17][15].filled=true;grid[16][16].filled=true;grid[17][16].filled=true;grid[18][16].filled=true;
}
function drawS2(){grid[20][12].filled=true;grid[21][12].filled=true;grid[22][12].filled=true;grid[20][13].filled=true;grid[20][14].filled=true;grid[21][14].filled=true;grid[22][14].filled=true;grid[22][15].filled=true;grid[22][16].filled=true;grid[21][16].filled=true;grid[20][16].filled=true;
}
function drawL2(){grid[24][12].filled=true;grid[24][13].filled=true;grid[24][14].filled=true;grid[24][15].filled=true;grid[24][16].filled=true;grid[25][16].filled=true;
}
function drawE2(){grid[27][12].filled=true;grid[28][12].filled=true;grid[29][12].filled=true;grid[27][13].filled=true;grid[27][14].filled=true;grid[28][14].filled=true;grid[27][15].filled=true;grid[27][16].filled=true;grid[28][16].filled=true;grid[29][16].filled=true;
}
