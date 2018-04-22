// ingredients that move across the screen and can be cut
$.Ingredient = function(x, y, type, sprite, level) {
  this.type = type;
  this.sprite = sprite;
  this.sprite.x = x;
  this.sprite.y = y;
  this.sprite.interactive = true;
  this.sprite.buttonMode = true;
  this.gone = false;
  this.state = "move_top";
  this.speed = level.speed;
  this.bottomLaneEnabled = level.bottomLane;
}

$.Ingredient.prototype.move = function(dt) {
  if (this.state === "fall") {
    this.sprite.y += 5 * dt;
  } else if (this.bottomLaneEnabled && this.state === "move_bottom"){
    this.sprite.x -= dt * this.speed;
  } else {
    this.sprite.x += dt * this.speed;
  }
}

$.Ingredient.prototype.makeFall = function() {
  this.state = "fall";
}

$.Ingredient.prototype.moveToBottom = function() {
  if (this.state !== "move_bottom") {
    this.state = "move_bottom";
    this.sprite.y += 130;
  }
}
