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

const INGREDIENT_SPAWN_TIME = 100;
const INGREDIENTS = [{type: "potato", sprite: "res/potato.png"},
{type: "onion", sprite: "res/onion.png"},
{type: "carot", sprite: "res/carot.png"},
{type: "brocoli", sprite: "res/brocoli.png"}];

let potImage;
let ingredients = [];
let pots = [];
let ingredientSpawnTime = INGREDIENT_SPAWN_TIME;

function getRandomIngredients() {
   return [{type: "potato", done: false}, {type: "onion", done: false}, {type: "potato", done: false}];
}

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function buildRandomIngredient() {
  let ing = getRandom(INGREDIENTS);
  return new $.Ingredient(10, 10, ing.type, new PIXI.Sprite(PIXI.loader.resources[ing.sprite].texture));
}

function setup() {
  pots.push(new $.Pot(80, 240, getRandomIngredients(), new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture)));
  pots.push(new $.Pot(240, 240, getRandomIngredients(), new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture)));
  pots.push(new $.Pot(400, 240, getRandomIngredients(), new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture)));
  ingredients.push(buildRandomIngredient());
  for (let p = 0; p < pots.length; ++p) {
    app.stage.addChild(pots[p].sprite);
    app.stage.addChild(pots[p].status);
  }
  for (let i = 0; i < ingredients.length; ++i) {
    app.stage.addChild(ingredients[i].sprite);
  }
  app.ticker.add(dt => gameLoop(dt));
  app.renderer.interactive = true;
  app.renderer.backgroundColor = 0xFFFFFF;
  app.renderer.view.style.position = "absolute";
  app.renderer.view.style.display = "block";
}

function gameLoop(dt) {
  for (let p = 0; p < pots.length; ++p) {
    pots[p].updateStatus();
  }
  let remove = false;
  for (let i = 0; i < ingredients.length; ++i) {
    ingredients[i].move(dt);
    if (ingredients[i].sprite.x > worldWidth-50) {
      ingredients[i].gone = true;
      remove = true;
      app.stage.removeChild(ingredients[i].sprite);
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
    let ing = buildRandomIngredient();
    app.stage.addChild(ing.sprite);
    ingredients.push(ing);
  }
}

let font = {fontFamily : 'OpenSans', fontSize: 12, fill : 0xff1010, align : 'center'};
let text = new PIXI.Text(app.renderer.width, font);

app.stage.addChild(text);


// attach the created app to the HTML document - create the canvas element
document.body.appendChild(app.view);
