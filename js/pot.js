$.Pot = function(x, y, sprite) {
  this.ingredients = [];
  this.sprite = sprite;
  this.sprite.x = x;
  this.sprite.y = y;
  this.status = new PIXI.Container();
  this.reset();
}

$.Pot.prototype.initIngredients = function() {
  this.ingredients = [];
  this.status = new PIXI.Container();
  for (let i = 0; i < 3; ++i) {
    let randType = getRandom($.INGREDIENT_TYPES);
    let sprite = new PIXI.Sprite(PIXI.loader.resources[$.INGREDIENT_IMAGES[randType]].texture)
    sprite.x = this.sprite.x + 10 + i * 30;
    sprite.y = this.sprite.y + this.sprite.height;
    sprite.scale.x *= 0.5;
    sprite.scale.y *= 0.5;
    this.ingredients.push({type: randType, done: false, sprite: sprite})
    this.status.addChild(sprite);
  }
}

$.Pot.prototype.reset = function() {
  this.initIngredients();
  this.updateStatus();
}

// ingredient format = [{type: "potato", done: false}]
// checks whether ingredient is needed and marks appropriate one as done
// returns true, if ingredient was needed, false otherwise
$.Pot.prototype.check = function(ingredient) {
  for (let i=0; i<this.ingredients.length; ++i) {
    if (!this.ingredients[i].done && this.ingredients[i].type === ingredient.type) {
      this.ingredients[i].done = true;
      return true;
    }
  }
  return false;
}

$.Pot.prototype.updateStatus = function() {
  for (let i = 0; i < this.ingredients.length; ++i) {
    let ing = this.ingredients[i];
    if (ing.done) {
      this.status.removeChild(ing.sprite);
    }
  }
}

$.Pot.prototype.isDone = function() {
  for (let i=0; i<this.ingredients.length; ++i) {
    if (!this.ingredients[i].done) {
      return false;
    }
  }
  return true;
}
