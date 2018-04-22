// ingredients that move across the screen and can be cut
$.Ingredient = function(x, y, type, sprite) {
  this.type = type;
  this.sprite = sprite;
  this.sprite.x = x;
  this.sprite.y = y;
  this.sprite.interactive = true;
  this.sprite.buttonMode = true;
  this.gone = false;
  this.state = "move";
}

$.Ingredient.prototype.move = function(dt) {
  if (this.state === "fall") {
    this.sprite.y += 5 * dt;
  } else {
    this.sprite.x += dt * 3;
  }
}

$.Ingredient.prototype.makeFall = function() {
  this.state = "fall";
}
