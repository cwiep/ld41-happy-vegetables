$.INGREDIENT_IMAGES = {"potato": "res/potato.png", "onion": "res/onion.png", "carot": "res/carot.png", "brocoli": "res/brocoli.png"}
$.INGREDIENT_TYPES = ["potato", "onion", "carot", "brocoli"];

const worldWidth = 640;
const worldHeight = 360;

let app = new PIXI.Application({
    width: worldWidth,
    height: worldHeight,
    transparent: true,
    antialias: true
});

PIXI.loader
  .add(["res/potato.png", "res/onion.png", "res/carot.png", "res/brocoli.png","res/pot.png", "res/cut.png"])
  .load(setup);

const CUT_TIME = 7;
const INGREDIENT_SPAWN_TIME = 50;
const INGREDIENTS = [{type: "potato", sprite: "res/potato.png"},
{type: "onion", sprite: "res/onion.png"},
{type: "carot", sprite: "res/carot.png"},
{type: "brocoli", sprite: "res/brocoli.png"}];

let score = 0;
let scoreText;
let potImage;
let pots = [];
let potContainer = new PIXI.Container();
let ingredients = [];
let ingredientContainer = new PIXI.Container();
let ingredientSpawnTime = INGREDIENT_SPAWN_TIME;
let cuts = [];

function addPot() {
  let numPots = 1;
  let potWidth = 122;
  let area = {x: 100, y: 220, width: 540, height: 140};
  let widthPerPot = area.width / numPots;
  let xOffset = (widthPerPot - potWidth) / 2;
  for (let p = 0; p < numPots; ++p) {
    pots.push(new $.Pot(150, 220, new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture)));
  }
}

function setup() {
  pots.push(new $.Pot(150, 220, new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture)));
  pots.push(new $.Pot(310, 220, new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture)));
  pots.push(new $.Pot(470, 220, new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture)));
  for (let p = 0; p < pots.length; ++p) {
    potContainer.addChild(pots[p].sprite);
    potContainer.addChild(pots[p].status);
  }
  app.stage.addChild(ingredientContainer);
  app.stage.addChild(potContainer);
  scoreText = new PIXI.Text("Score: " + score, {fontFamily : 'OpenSans', fontSize: 12, fill : 0x000000, align : 'center'});
  scoreText.x = 10;
  scoreText.y = 330;
  app.stage.addChild(scoreText);
  app.ticker.add(dt => gameLoop(dt));
  app.renderer.interactive = true;
  app.renderer.backgroundColor = 0xFFFFFF;
  app.renderer.view.style.position = "absolute";
  app.renderer.view.style.display = "block";
}

function buildRandomIngredient() {
  let ing = getRandom(INGREDIENTS);
  return new $.Ingredient(10, 10, ing.type, new PIXI.Sprite(PIXI.loader.resources[ing.sprite].texture));
}

function removeIngredientImage(ing) {
  ing.gone = true;
  ingredientContainer.removeChild(ing.sprite);
}

function spawnIngredient() {
  let ing = buildRandomIngredient();
  ing.sprite.on("pointerdown", function() {
    ing.makeFall();
    let cut = new PIXI.Sprite(PIXI.loader.resources["res/cut.png"].texture);
    cut.x = ing.sprite.x;
    cut.y = ing.sprite.y;
    app.stage.addChild(cut);
    cuts.push({t: CUT_TIME, sprite: cut, rem: false});
  });
  ing.sprite.scale.x *= 0.75;
  ing.sprite.scale.y *= 0.75;
  ingredientContainer.addChild(ing.sprite);
  ingredients.push(ing);
}

function collide(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.height + rect1.y > rect2.y;
}

function updateIngredients(dt) {
  let remove = false;
  for (let i = 0; i < ingredients.length; ++i) {
    ingredients[i].move(dt);
    if (ingredients[i].sprite.x > worldWidth) {
      ingredients[i].moveToBottom();
    } else if (ingredients[i].sprite.y > worldHeight-50 || ingredients[i].sprite.x < 0) {
      // remove ingredients when outside of screen
      removeIngredientImage(ingredients[i]);
      remove = true;
    } else {
      // check collision with every pot
      for (let p = 0; p < pots.length; ++p) {
        if (!ingredients[i].gone && collide(ingredients[i].sprite, pots[p].sprite)) {
          removeIngredientImage(ingredients[i]);
          remove = true;
          let needed = pots[p].check(ingredients[i]);
          var soundURL = jsfxr([0,,0.1812,,0.1349,0.4524,,0.2365,,,,,,0.0819,,,,,1,,,,,0.5]);
          var player = new Audio();
          player.src = soundURL;
          player.play();
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
}

function updatePots(dt) {
  for (let p = 0; p < pots.length; ++p) {
    pots[p].updateStatus();
    if (pots[p].isDone()) {
      score += 1;
      scoreText.text = "Score: " + score;
      app.stage.removeChild(pots[p].status);
      pots[p].reset();
      app.stage.addChild(pots[p].status);
    }
  }
}

function updateCuts(dt) {
  let remove = false;
  for (let c = 0; c < cuts.length; ++c) {
    cuts[c].t -= dt;
    if (cuts[c].t <= 0) {
      cuts[c].rem = true;
      remove = true;
      app.stage.removeChild(cuts[c].sprite);
    }
  }
  if (remove) {
    var f = function (c) {
      return !c.rem;
    };
    cuts = cuts.filter(f);
  }
}

function gameLoop(dt) {
  updateIngredients(dt);
  updatePots(dt);
  updateCuts(dt);
}

// attach the created app to the HTML document - create the canvas element
document.body.appendChild(app.view);
