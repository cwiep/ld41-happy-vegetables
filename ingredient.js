$.Ingredient = function(x, y, type, sprite) {
  this.type = type;
  this.sprite = sprite;
  this.sprite.x = x;
  this.sprite.y = y;
}

$.Ingredient.prototype.move = function(dt) {
  this.sprite.x += dt * 0.5;
}
