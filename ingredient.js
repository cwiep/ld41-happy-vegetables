$.Ingredient = function(x, y, type, sprite) {
  this.type = type;
  this.sprite = sprite;
  this.sprite.x = x;
  this.sprite.y = y;
  this.sprite.interactive = true;
  this.sprite.buttonMode = true;
  let me = this;
  this.sprite.on("pointerdown", function() {
    console.log("clicked: " + me.type);
  });
  this.gone = false;
}

$.Ingredient.prototype.move = function(dt) {
  this.sprite.x += dt * 1;
}
