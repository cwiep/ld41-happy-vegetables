// ingredients that move across the screen and can be cut
$.Ingredient = function(x, y, type, spriteTex, level) {
  this.type = type;
  let baseTex = spriteTex.baseTexture;
  let frames = [new PIXI.Rectangle( 0, 0, 64, 64), new PIXI.Rectangle( 64, 0, 64, 64)];
  this.tex = frames.map(function(frame) { return new PIXI.Texture(baseTex, frame); });
  this.sprite = new PIXI.Sprite(this.tex[0]);
  this.sprite.x = x;
  this.sprite.y = y;
  this.vely = 0;
  this.sprite.interactive = true;
  this.sprite.buttonMode = true;
  this.gone = false;
  this.state = "move_top";
  this.speed = level.speed;
  this.bottomLaneEnabled = level.bottomLane;
}

$.Ingredient.prototype.move = function(dt) {
  if (this.state === "fall") {
    this.vely += 0.06 * dt;
    this.sprite.y += this.vely;
  } else if (this.bottomLaneEnabled && this.state === "move_bottom"){
    this.sprite.x -= dt * this.speed;
  } else {
    this.sprite.x += dt * this.speed;
  }
}

$.Ingredient.prototype.makeFall = function() {
  this.state = "fall";
  this.vely = -10.0;
  this.sprite.texture = this.tex[1];
}

$.Ingredient.prototype.moveToBottom = function() {
  if (this.state !== "move_bottom") {
    this.state = "move_bottom";
    this.sprite.y += 105;
  }
}
