let canvas, ctx;

var loading = 0;
var timeout;

//3.0 Fix the x and y
//3.5 When you click on a box it populates that box
  //Start by identifying where on the 2d array...
  //then create a live cell there in lifeCycle.
  //then go clear canvas
  //then repopulate
  //make the paused generation grey colored and not black.
//4. fix the canvas to fit the screen better - maybe
//5. add a time buffer

function init () {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');

  lifeCycle=
  [[0,0,0,0,0,0,0],
  [0,0,0,1,0,0,0],
  [0,0,0,1,0,0,0],
  [0,0,0,1,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0]];

  drawOutGenerations(lifeCycle,2);


}

function drawEmpty(){
  for(var i=0;i<6;i++){
      for(var j=0;j<7;j++){
        var x = i*30;
        var y=j*30;
        ctx.strokeRect(x,y,30,30);
      }
    }
}

function draw(population){
  for(var i=0;i<population.length;i++){
    for(var j=0;j<population[0].length;j++){
      var x = i*30;
      var y=j*30;
      if(population[i][j]==1){
        ctx.fillRect(x,y,30,30);
      }
      else{
        ctx.strokeRect(x,y,30,30);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', init);

var lifeCycle = [];

function populate10x10(lifeCycle) {
  for(i = 0;i<3;i++){
    lifeCycle.push([0,0,1,0,0])
  }
}

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

function onClickDraw(){
  if(loading==0){
    var gens = Math.round(document.getElementById("gen").value);
    drawOutGenerations(lifeCycle,gens)
  }
}

function abort(){
  clearTimeout(timeout);
  loading = 0;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawEmpty();
  var gens = document.getElementById("demo").innerHTML = "generations left: ";
}

function drawOutGenerations(population, generations){
  var gens = document.getElementById("demo").innerHTML = "generations left: " + generations;
  draw(population);
  timeout = setTimeout(function (){
    loading++;
   
    if(generations==0){
      loading=0;
      return;
    }
    var neighborsOfPopulation = neighborArray(population);
    var nextGen = nextGeneration(neighborsOfPopulation,population);
    ctx.clearRect(0,0,canvas.width,canvas.height);

    gens = generations;
    drawOutGenerations(nextGen,generations-1);
  }, 1000);

} 



