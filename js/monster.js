$.Monster = function(x, y, speed, stunTime, timeToEat) {
    let baseTex = PIXI.loader.resources["res/monster.png"].texture.baseTexture;
    let frames = [new PIXI.Rectangle( 0, 0, 64, 64), new PIXI.Rectangle( 64, 0, 64, 64), new PIXI.Rectangle(128, 0, 64, 64)];
    this.tex = frames.map(function(frame) { return new PIXI.Texture(baseTex, frame); });
    this.sprite = new PIXI.Sprite(this.tex[0]);
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.x = x;
    this.sprite.y = y;
    let me = this;
    this.velx = speed; // -0.1 is quite good
    this.state = "move";
    this.timeToEat = timeToEat;
    this.stateTimer = this.timeToEat;
    this.sprite.on("pointerdown", function() {
        if (me.state === "move" || me.state === "waitEat") {
            me.state = "stun";
            me.stateTimer = stunTime;
        }
    });
}

$.Monster.prototype.update = function(dt) {
    this.stateTimer -= dt;
    if (this.state === "move") {
        // move left right
        this.sprite.texture = this.tex[0];
        this.move(dt);
        // count down until ready to eat
        if (this.stateTimer < 0) {
            this.stateTimer = 0;
            this.state = "waitEat";
        }
    } else if (this.state === "stun") {
        this.sprite.texture = this.tex[2];
        if (this.stateTimer < 0) {
            this.state = "move";
            this.stateTimer = this.timeToEat;
        }
    } else if (this.state === "waitEat") {
        this.sprite.texture = this.tex[0];
        this.move(dt);
    } else if (this.state === "eat") {
        this.sprite.texture = this.tex[1];
        if (this.stateTimer < 0) {
            this.state = "move";
            this.stateTimer = this.timeToEat;
        }
    }
}

$.Monster.prototype.move = function(dt) {
    // move left right
    this.sprite.x += this.velx * dt;
    if (this.sprite.x < 0 || this.sprite.x  > 640-64) {
        this.velx = -this.velx;
    }
}

$.Monster.prototype.eat = function(ingredientType) {
    console.log("eating " + ingredientType);
    this.state = "eat";
    this.stateTimer = 250;
}
