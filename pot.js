$.Pot = function(x, y, ingredients, sprite) {
  this.ingredients = ingredients;
  this.sprite = sprite;
  this.sprite.x = x;
  this.sprite.y = y;
  this.status = new PIXI.Text("", {fontFamily : 'OpenSans', fontSize: 12, fill : 0xff1010, align : 'center'});
  this.status.x = x;
  this.status.y = y + this.sprite.height;
  this.reset();
}

$.Pot.prototype.reset = function() {
  for (let i=0; i<this.ingredients.length; ++i) {
    this.ingredients[i].done = false;
  }
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
  let status = "";
  for (let i=0; i<this.ingredients.length; ++i) {
    if (this.ingredients[i].done) {
      status += "[" + this.ingredients[i].type + "] ";
    } else {
      status += this.ingredients[i].type + " ";
    }
  }
  this.status.text = status;
}

$.Pot.prototype.isDone = function() {
  for (let i=0; i<this.ingredients.length; ++i) {
    if (!this.ingredients[i].done) {
      return false;
    }
  }
  return true;
}
