//https://www.youtube.com/watch?v=LFU5ZlrR21E inspired

function Cell(x, y, w){
  this.x=x;
  this.y=y;
  this.w=w;
  this.filled = false;
}

Cell.prototype.show = function(ctx){
  if(this.filled == true){
    ctx.fillRect(this.x, this.y, this.w, this.w);
  }
  else{
    ctx.strokeRect(this.x, this.y, this.w, this.w);
  }
}

Cell.prototype.contains = function(x,y){
  return (x>this.x && x<this.x + this.w && 
          y>this.y && y<this.y + this.w);
}