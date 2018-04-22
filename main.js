const worldWidth = 640;
const worldHeight = 360;

let app = new PIXI.Application({
    width: worldWidth,
    height: worldHeight,
    transparent: true,
    antialias: true
});

PIXI.loader
  .add(["res/potato.png", "res/onion.png", "res/carot.png", "res/brocoli.png","res/pot.png"])
  .load(setup);

const INGREDIENT_SPAWN_TIME = 50;
const INGREDIENTS = [{type: "potato", sprite: "res/potato.png"},
{type: "onion", sprite: "res/onion.png"},
{type: "carot", sprite: "res/carot.png"},
{type: "brocoli", sprite: "res/brocoli.png"}];

let potImage;
let pots = [];
let potContainer = new PIXI.Container();
let ingredients = [];
let ingredientContainer = new PIXI.Container();
let ingredientSpawnTime = INGREDIENT_SPAWN_TIME;

function getRandomIngredients() {
   return [{type: "potato", done: false}, {type: "onion", done: false}, {type: "potato", done: false}];
}

function setup() {
  pots.push(new $.Pot(150, 240, getRandomIngredients(), new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture)));
  pots.push(new $.Pot(310, 240, getRandomIngredients(), new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture)));
  pots.push(new $.Pot(470, 240, getRandomIngredients(), new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture)));
  for (let p = 0; p < pots.length; ++p) {
    potContainer.addChild(pots[p].sprite);
    potContainer.addChild(pots[p].status);
  }
  app.stage.addChild(ingredientContainer);
  app.stage.addChild(potContainer);
  app.ticker.add(dt => gameLoop(dt));
  app.renderer.interactive = true;
  app.renderer.backgroundColor = 0xFFFFFF;
  app.renderer.view.style.position = "absolute";
  app.renderer.view.style.display = "block";
}

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function buildRandomIngredient() {
  let ing = getRandom(INGREDIENTS);
  return new $.Ingredient(10, 10, ing.type, new PIXI.Sprite(PIXI.loader.resources[ing.sprite].texture));
}

function removeIngredient(ing) {
  ing.gone = true;
  ingredientContainer.removeChild(ing.sprite);
}

function spawnIngredient() {
  let ing = buildRandomIngredient();
  ing.sprite.on("pointerdown", function() {
    ing.makeFall();
  });
  ingredientContainer.addChild(ing.sprite);
  ingredients.push(ing);
}

function collide(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.height + rect1.y > rect2.y;
}

function gameLoop(dt) {
  let remove = false;
  for (let i = 0; i < ingredients.length; ++i) {
    ingredients[i].move(dt);
    if (ingredients[i].sprite.x > worldWidth-50 || ingredients[i].sprite.y > worldHeight-50) {
      // remove ingredients when outside of screen
      removeIngredient(ingredients[i]);
      remove = true;
    } else {
      // check collision with every pot
      for (let p = 0; p < pots.length; ++p) {
        if (collide(ingredients[i].sprite, pots[p].sprite)) {
          removeIngredient(ingredients[i]);
          remove = true;
          pots[p].check(ingredients[i])
        }
      }
    }
  }
  if (remove) {
    var f = function (ing) {
      return !ing.gone;
    };
    ingredients = ingredients.filter(f);
  }
  ingredientSpawnTime -= dt;
  if (ingredientSpawnTime <= 0) {
    ingredientSpawnTime = INGREDIENT_SPAWN_TIME;
    spawnIngredient();
  }
  for (let p = 0; p < pots.length; ++p) {
    pots[p].updateStatus();
    if (pots[p].isDone()) {
      console.log(pots[p] +"is done");
    }
  }
}

// attach the created app to the HTML document - create the canvas element
document.body.appendChild(app.view);
