$.Monster = function(x, y) {
  let baseTex = PIXI.loader.resources["res/monster.png"].texture.baseTexture;
  let frames = [new PIXI.Rectangle( 0, 0, 64, 64), new PIXI.Rectangle( 64, 0, 64, 64), new PIXI.Rectangle(128, 0, 64, 64)];
  this.tex = frames.map(function(frame) { return new PIXI.Texture(baseTex, frame); });
  this.sprite = new PIXI.Sprite(this.tex[0]);
  this.sprite.interactive = true;
  this.sprite.buttonMode = true;
  this.sprite.x = x;
  this.sprite.y = y;
  this.stunTime = 4000;
  this.stunTimer = 0;
  let me = this;
  this.sprite.on("pointerdown", function() {
    me.stunTimer = me.stunTime;
  });
}

$.Monster.prototype.update = function(dt) {
  if (this.stunTimer <= 0) {
    // move left right
    this.sprite.texture = this.tex[0];
  } else {
    this.stunTimer -= dt;
    this.sprite.texture = this.tex[2];
  }
}
