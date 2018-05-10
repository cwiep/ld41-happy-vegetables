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
    this.velx = -0.1;
    this.canEatTimer = 5000;
    this.canEat = false;
    this.eatingTimer = 0;
    this.sprite.on("pointerdown", function() {
        if (me.eatingTimer == 0) {
            me.stunTimer = me.stunTime;
        }
    });
}

$.Monster.prototype.update = function(dt) {
    if (this.eatingTimer > 0) {
        // eating animation was started
        this.sprite.texture = this.tex[1];
        this.eatingTimer -= dt;
        // we need 0 to be the special case of the timer not being active! this feels so dirty...
        if (this.eatingTimer == 0) {
            this.eatingTimer = -1;
        }
    } else if (this.eatingTimer < 0) {
        // eating animation has finished
        this.eatingTimer = 0;
        this.sprite.texture = this.tex[0];
        this.eatTimer = 5000;
    } else {
        if (this.stunTimer <= 0) {
            // monster is not stunned

            this.canEatTimer -= dt;
            if (this.canEatTimer < 0) {
                this.canEat = true;
            }

            // move left right
            this.sprite.texture = this.tex[0];
            this.sprite.x += this.velx * dt;
            if (this.sprite.x < 0 || this.sprite.x  > 640-64) {
                this.velx = -this.velx;
            }
            
        } else {
            // monster is stunned
            this.stunTimer -= dt;
            this.sprite.texture = this.tex[2];
        }
    }
}

$.Monster.prototype.eat = function(ingredientType) {
    console.log("eating " + ingredientType);
    this.canEat = false;
    this.eatingTimer = 250;
}
