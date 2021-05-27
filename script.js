let canvas, ctx;

var loading = 0;
var timeout;

var grid;
var cols = 20;
var rows = 20;
var w = 20;
//
//3.0 Fix the x and y
//3.5 When you click on a box it populates that box
  //Start by identifying where on the 2d array...
  //then create a live cell there in lifeCycle.
  //then go clear canvas
  //then repopulate
  //make the paused generation grey colored and not black.
//4. fix the canvas to fit the screen better - maybe
//5. add a time buffer

document.addEventListener('DOMContentLoaded', init);

function init () {
  canvas = document.getElementById('gameBoard');
  ctx = canvas.getContext('2d');

  cols = Math.floor(canvas.width/w);
  rows = Math.floor(canvas.height/w);
  grid = make2DArray(cols,rows);

  for(var i=0;i<cols;i++){
    for(var j=0;j<rows;j++){
      grid[i][j] = new Cell(i*w, j*w, w);
    }
  }

  //randomize();
  drawGrid();

  //console.log(grid);

}

function showCoords(event) {
  var x = event.offsetX;
  var y = event.offsetY;
  console.log("MOUSE: "+x+" "+y);
  // var coords = "X coords: " + x + ", Y coords: " + y;
  // document.getElementById("demo").innerHTML = coords;
  for(var i=0;i<cols;i++){
    for(var j=0;j<rows;j++){
      if(grid[i][j].contains(x, y)){
        grid[i][j].filled=true;
        drawGrid();
      }
      else{
      }
    }
  }
}

function randomize(){
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
}

function drawGrid(){
  for(var i=0;i<cols;i++){
      for(var j=0;j<rows;j++){
        grid[i][j].show(ctx);
      }
    }
}

function make2DArray(m, n){
  let arr = new Array(m); // create an empty array of length n
  for (var i = 0; i < m; i++) {
    arr[i] = new Array(n); // make each element an array
  }
  //console.log(arr); 
  return arr;
}

// function drawEmpty(){
//   for(var i=0;i<6;i++){
//       for(var j=0;j<7;j++){
//         var x = i*30;
//         var y=j*30;
//         ctx.strokeRect(x,y,30,30);
//       }
//     }
// }



function countNeighborsWithLoop(posX,posY,lifeCycle){
  var neighbors = 0;
  const dimensions = [lifeCycle.length,lifeCycle[0].length];
 
  for(var i=-1;i<2;i++){
    for(var j=-1;j<2;j++){
      var n = (posX+i+dimensions[0])%dimensions[0];
      var m = (posY+j+dimensions[1])%dimensions[1];
      if(lifeCycle[n][m]==1){
        if(i==0&&j==0){
          continue;
        }
        else{
          neighbors++;
        }
      }
    }
  }
  return neighbors;
}

function neighborArray(lifeCycle){
  var nArray = []
  const dimensions = [lifeCycle.length,lifeCycle[0].length];
  for(var i=0;i<dimensions[0];i++){
    var insideArr=[];
    for(var j=0;j<dimensions[1];j++){
      insideArr.push(countNeighborsWithLoop(i,j,lifeCycle));
    }
    nArray.push(insideArr);
  }
  return nArray;
}

function isLive(x,y,array){
  if(array[x][y]==1){
    return true;
  }
  else{
    return false;
  }
}

function nextGeneration(neighbors,lifeCycle){
  const dimensions = [neighbors.length,neighbors[0].length];
  //rules are
  //1. Any live cell with fewer than 2 live neighbors dies
  //2. Any live cell with two or 3 lives on
  //3. any live cell with more than 3 live neighbors dies
  //4. any dead cell with exactly 3 live neighbors becomes a live cell.
  var population=[];
  for(var i =0;i<dimensions[0];i++){
    var populationRow=[];
    for(var j=0;j<dimensions[1];j++){
      //rule 2
      if(neighbors[i][j]>1&&neighbors[i][j]<4&&isLive(i,j,lifeCycle)){
        populationRow.push(1);
      }
      else if(neighbors[i][j]==3&&isLive(i,j,lifeCycle)==false){
        populationRow.push(1);
      }
      else{
        populationRow.push(0);
      }
    }
    population.push(populationRow);
  }
  return population;
}

// function onClickDraw(){
//   if(loading==0){
//     var gens = Math.round(document.getElementById("gen").value);
//     drawOutGenerations(lifeCycle,gens)
//   }
// }

// function abort(){
//   clearTimeout(timeout);
//   loading = 0;
//   ctx.clearRect(0,0,canvas.width,canvas.height);
//   drawEmpty();
//   var gens = document.getElementById("demo").innerHTML = "generations left: ";
// }

// function drawOutGenerations(population, generations){
//   var gens = document.getElementById("demo").innerHTML = "generations left: " + generations;
//   draw(population);
//   timeout = setTimeout(function (){
//     loading++;
   
//     if(generations==0){
//       loading=0;
//       return;
//     }
//     var neighborsOfPopulation = neighborArray(population);
//     var nextGen = nextGeneration(neighborsOfPopulation,population);
//     ctx.clearRect(0,0,canvas.width,canvas.height);

//     gens = generations;
//     drawOutGenerations(nextGen,generations-1);
//   }, 1000);

// } 



