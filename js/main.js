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
  .add(["res/title.png", "res/potato.png", "res/onion.png", "res/carot.png", "res/brocoli.png","res/pot.png", "res/cut.png", "res/levelclear.png", "res/bg.png"])
  .load(setup);

const CUT_TIME = 7;
const INGREDIENT_SPAWN_TIME = 50;
const INGREDIENTS = [{type: "potato", sprite: "res/potato.png"},
{type: "onion", sprite: "res/onion.png"},
{type: "carot", sprite: "res/carot.png"},
{type: "brocoli", sprite: "res/brocoli.png"}];

let gameState = "menu";
let levelCounter = -1;
let score = 0;
let scoreText;
let potImage;
let pots = [];
let finishedPots = 0;
let potContainer = new PIXI.Container();
let ingredients = [];
let ingredientContainer = new PIXI.Container();
let ingredientSpawnTime = INGREDIENT_SPAWN_TIME;
let cuts = [];

function setupPots() {
  pots = [];
  app.stage.removeChild(potContainer);
  potContainer = new PIXI.Container();
  if ($.Levels[levelCounter].pots[0]) {
    pots.push(new $.Pot(100, 220, new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture)));
  }
  if ($.Levels[levelCounter].pots[1]) {
    pots.push(new $.Pot(260, 220, new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture)));
  }
  if ($.Levels[levelCounter].pots[2]) {
    pots.push(new $.Pot(410, 220, new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture)));
  }
  for (let p = 0; p < pots.length; ++p) {
    potContainer.addChild(pots[p].sprite);
    potContainer.addChild(pots[p].status);
  }
  app.stage.addChild(potContainer);
}

function setupIngredients() {
  ingredients = [];
  app.stage.removeChild(ingredientContainer);
  ingredientContainer = new PIXI.Container();
  app.stage.addChild(ingredientContainer);
  cuts = [];
}

function nextLevel() {
  levelCounter += 1;
  finishedPots = 0;
  setupIngredients();
  setupPots();
  gameState = "game";
}

function levelClear() {
  gameState = "levelClear";
  let clearScreen = new PIXI.Sprite(PIXI.loader.resources["res/levelclear.png"].texture);
  clearScreen.interactive = true;
  clearScreen.buttonMode = true;
  clearScreen.on("pointerdown", function() {
    app.stage.removeChild(clearScreen);
    nextLevel();
  });
  app.stage.addChild(clearScreen)
}

function startGame() {
  gameState = "game";
  app.stage.addChild(new PIXI.Sprite(PIXI.loader.resources["res/bg.png"].texture))
  nextLevel();
  scoreText = new PIXI.Text(score, {fontFamily : 'OpenSans', fontSize: 14, fill : 0xffffff, align : 'center'});
  scoreText.x = 37;
  scoreText.y = 333;
  app.stage.addChild(scoreText);
  app.ticker.add(dt => gameLoop(dt));
}

function setup() {
  let title = new PIXI.Sprite(PIXI.loader.resources["res/title.png"].texture)
  title.interactive = true;
  title.buttonMode = true;
  title.on("pointerdown", function() {
    app.stage.removeChild(title);
    startGame();
  });
  app.stage.addChild(title);
  app.renderer.interactive = true;
  app.renderer.backgroundColor = 0xFFFFFF;
  app.renderer.view.style.position = "absolute";
  app.renderer.view.style.display = "block";
}

function buildRandomIngredient() {
  let ing = getRandom(INGREDIENTS);
  return new $.Ingredient(10, 20, ing.type, new PIXI.Sprite(PIXI.loader.resources[ing.sprite].texture), $.Levels[levelCounter]);
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
    if (Math.random() > 0.5) {
      cut.anchor.x = 1;
      cut.scale.x *= -1;
    }
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
      if ($.Levels[levelCounter].bottomLane) {
        ingredients[i].moveToBottom();
      } else {
        removeIngredientImage(ingredients[i]);
        remove = true;
      }
    } else if (ingredients[i].sprite.y > worldHeight-50 || ingredients[i].sprite.x < 0) {
      // remove ingredients when outside of screen
      removeIngredientImage(ingredients[i]);
      remove = true;
    } else {
      // check collision with every pot
      for (let p = 0; p < pots.length; ++p) {
        if (!ingredients[i].gone && collide(ingredients[i].sprite, pots[p].sprite)) {
          if (pots[p].check(ingredients[i])) {
            removeIngredientImage(ingredients[i]);
            remove = true;
            //var soundURL = jsfxr([0,,0.1812,,0.1349,0.4524,,0.2365,,,,,,0.0819,,,,,1,,,,,0.5]);
            //var player = new Audio();
            //player.src = soundURL;
            //player.play();
          }
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
      let text = score;
      if (score < 10) {
        text = " " + text;
      }
      if (score < 100) {
        text = " " + text;
      }

      scoreText.text = score;
      potContainer.removeChild(pots[p].status)
      ++finishedPots;
      pots[p].reset();
      potContainer.addChild(pots[p].status)
      if (finishedPots >= $.Levels[levelCounter].targetPots) {
        levelClear();
        break;
      }
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
  if (gameState === "game") {
    updateIngredients(dt);
    updatePots(dt);
    updateCuts(dt);
  }
}

// attach the created app to the HTML document - create the canvas element
document.body.appendChild(app.view);
