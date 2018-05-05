$.INGREDIENT_IMAGES = { "potato": "res/potato.png", "onion": "res/onion.png", "carot": "res/carot.png", "brocoli": "res/brocoli.png" }
$.INGREDIENT_TYPES = ["potato", "onion", "carot", "brocoli"];

const worldWidth = 640;
const worldHeight = 360;

const MONSTER_TIME = 3000;
const CUT_TIME = 300;
const INGREDIENT_SPAWN_TIME = 1000;
// this is a hack to avoid the edge probabilities...
const INGREDIENTS = [{ type: "potato", sprite: "res/potato.png" },
{ type: "onion", sprite: "res/onion.png" },
{ type: "carot", sprite: "res/carot.png" },
{ type: "brocoli", sprite: "res/brocoli.png" },
{ type: "potato", sprite: "res/potato.png" },
{ type: "onion", sprite: "res/onion.png" },
{ type: "carot", sprite: "res/carot.png" },
{ type: "brocoli", sprite: "res/brocoli.png" }];

let bgMusic;
let cutSound;
let blubSound;

let music = true;
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
let scene;
let levelContainer;
let potText;
let monster;
let monsterCounter;

let app = new PIXI.Application({
    width: worldWidth,
    height: worldHeight,
    transparent: true,
    antialias: true
});

// this can only happen once!
app.ticker.add(dt => gameLoop(dt));

// attach the created app to the HTML document - create the canvas element
document.body.appendChild(app.view);

PIXI.loader
    .add(["res/music.png", "res/title.png", "res/potato.png", "res/onion.png", "res/carot.png", "res/brocoli.png", "res/pot.png", "res/cut.png", "res/levelclear.png", "res/bg.png", "res/startbutton.png", "res/gameover.png", "res/win.png", "res/monster.png"])
    .add('bgmusic', 'res/bg.ogg')
    .add("cutSound", "res/cut.ogg")
    .add("blubSound", "res/blub.ogg")
    .load(setup);

PIXI.loader.load(function (loader, resources) {
    bgMusic = resources.bgmusic.sound;
    bgMusic.volume = 0.05;
    bgMusic.loop = true;
    cutSound = resources.cutSound.sound;
    cutSound.volume = 0.05;
    blubSound = resources.blubSound.sound;
    blubSound.volume = 0.05;
});

// ----------------------------------------------------------------------------
// setup game
// ----------------------------------------------------------------------------

function levelClear() {
    for (let c = 0; c < cuts.length; ++c) {
        scene.removeChild(cuts[c].sprite);
    }
    cuts = [];
    gameState = "levelClear";
    let clearScreen = new PIXI.Sprite(PIXI.loader.resources["res/levelclear.png"].texture);
    clearScreen.interactive = true;
    clearScreen.buttonMode = true;
    clearScreen.on("pointerdown", function () {
        scene.removeChild(clearScreen);
        nextLevel();
    });
    scene.addChild(clearScreen);
}

function gameOver() {
    gameState = "gameOver";
    bgMusic.stop();
    let endScreen = new PIXI.Sprite(PIXI.loader.resources["res/gameover.png"].texture);
    endScreen.interactive = true;
    endScreen.buttonMode = true;
    endScreen.on("pointerdown", function () {
        scene.removeChild(endScreen);
        setup();
    });
    scene.addChild(endScreen)
}

function createPotCounterSprite() {
    let potCounterSprite = new PIXI.Sprite(PIXI.loader.resources["res/pot.png"].texture);
    potCounterSprite.x = 570;
    potCounterSprite.y = 320;
    potCounterSprite.scale.x *= 0.3;
    potCounterSprite.scale.y *= 0.3;
    return potCounterSprite;
}

function createMusicToggle() {
    let baseTex = PIXI.loader.resources["res/music.png"].texture.baseTexture;
    var frames = [new PIXI.Rectangle(0, 0, 64, 64), new PIXI.Rectangle(64, 0, 64, 64)];
    var tex = frames.map(function (frame) { return new PIXI.Texture(baseTex, frame); });
    let musicToggle = new PIXI.Sprite(tex[0]);
    musicToggle.interactive = true;
    musicToggle.buttonMode = true;
    musicToggle.x = 120;
    musicToggle.y = 225;
    musicToggle.on("pointerdown", function () {
        music = !music;
        if (music) {
            musicToggle.texture = tex[0];
        } else {
            musicToggle.texture = tex[1];
        }
    });
    return musicToggle;
}

function startGame() {
    gameState = "game";
    levelCounter = -1;
    score = 0;
    scene.addChild(new PIXI.Sprite(PIXI.loader.resources["res/bg.png"].texture));
    potText = new PIXI.Text("0", { fontFamily: 'OpenSans', fontSize: 18, fill: 0x000000, align: 'center' });
    potText.x = 615;
    potText.y = 325;
    scene.addChild(potText);
    nextLevel();
    scoreText = new PIXI.Text(score, { fontFamily: 'OpenSans', fontSize: 18, fill: 0xffffff, align: 'center' });
    scoreText.x = 30;
    scoreText.y = 325;
    scene.addChild(scoreText);
    scene.addChild(createPotCounterSprite());
    if (music) {
        bgMusic.play();
    }
}

function setup() {
    gameState = "menu";
    app.stage.removeChild(scene);
    scene = new PIXI.Container();
    let musicToggle = createMusicToggle();
    let title = new PIXI.Sprite(PIXI.loader.resources["res/title.png"].texture);
    let startButton = new PIXI.Sprite(PIXI.loader.resources["res/startbutton.png"].texture);
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.x = 110;
    startButton.y = 160;
    startButton.on("pointerdown", function () {
        scene.removeChild(title);
        scene.removeChild(musicToggle);
        scene.removeChild(startButton);
        startGame();
    });
    scene.addChild(title);
    scene.addChild(startButton);
    scene.addChild(musicToggle);
    app.stage.addChild(scene);
    app.renderer.interactive = true;
    app.renderer.backgroundColor = 0xFFFFFF;
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
}

// ----------------------------------------------------------------------------
// setup level
// ----------------------------------------------------------------------------

function setupPots() {
    pots = [];
    scene.removeChild(potContainer);
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
    scene.addChild(potContainer);
}

function setupIngredients() {
    ingredients = [];
    scene.removeChild(ingredientContainer);
    ingredientContainer = new PIXI.Container();
    scene.addChild(ingredientContainer);
    cuts = [];
}

function addMonster() {
    if (monster) {
        scene.removeChild(monster.sprite);
    }
    if ($.Levels[levelCounter].monster) {
        monster = new $.Monster(400, 102);
        scene.addChild(monster.sprite);
    }
}

function nextLevel() {
    levelCounter += 1;
    if (levelCounter >= $.Levels.length) {
        // finish game
        gameState = "won";
        scene.addChild(new PIXI.Sprite(PIXI.loader.resources["res/win.png"].texture));
        let winScore = new PIXI.Text(score, { fontFamily: 'OpenSans', fontSize: 36, fill: 0xffffff, align: 'center' });
        winScore.x = 300;
        winScore.y = 200;
        scene.addChild(winScore);
    } else {
        // load normal level
        finishedPots = 0;
        potText.text = $.Levels[levelCounter].targetPots;
        setupIngredients();
        setupPots();
        addMonster();
        gameState = "game";
    }
}

// ----------------------------------------------------------------------------
// methods for active level
// ----------------------------------------------------------------------------

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
    ing.sprite.on("pointerdown", function () {
        ing.makeFall();
        let cut = new PIXI.Sprite(PIXI.loader.resources["res/cut.png"].texture);
        cut.x = ing.sprite.x;
        cut.y = ing.sprite.y;
        if (Math.random() > 0.5) {
            cut.anchor.x = 1;
            cut.scale.x *= -1;
        }
        scene.addChild(cut);
        cuts.push({ t: CUT_TIME, sprite: cut, rem: false });
        cutSound.play();
    });
    ing.sprite.scale.x *= 0.75;
    ing.sprite.scale.y *= 0.75;
    ingredientContainer.addChild(ing.sprite);
    ingredients.push(ing);
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
        } else if (ingredients[i].sprite.x < 0) {
            // remove ingredients when outside of screen
            removeIngredientImage(ingredients[i]);
            remove = true;
        } else if (ingredients[i].sprite.y > worldHeight) {
            // wrong vegetable chosen -> point loss
            removeIngredientImage(ingredients[i]);
            remove = true;
            --score;
            updateScoreDisplay();
        } else {
            // check collision with every pot
            for (let p = 0; p < pots.length; ++p) {
                if (!ingredients[i].gone && collide(ingredients[i].sprite, pots[p].sprite)) {
                    if (pots[p].check(ingredients[i])) {
                        removeIngredientImage(ingredients[i]);
                        remove = true;
                        blubSound.play();
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

function updateScoreDisplay() {
    let text = score;
    if (score < 10) {
        text = " " + text;
    }
    if (score < 100) {
        text = " " + text;
    }
    scoreText.text = text;
}

function updatePots(dt) {
    for (let p = 0; p < pots.length; ++p) {
        pots[p].updateStatus();
        if (pots[p].isDone()) {
            score += 1;
            updateScoreDisplay();
            potContainer.removeChild(pots[p].status)
            ++finishedPots;
            potText.text = $.Levels[levelCounter].targetPots - finishedPots;
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
            scene.removeChild(cuts[c].sprite);
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
    let deltaMs = app.ticker.elapsedMS;
    if (gameState === "game") {
        updateIngredients(deltaMs);
        updatePots(deltaMs);
        updateCuts(deltaMs);
        if (monster) {
            monster.update(deltaMs);
        }
        if (score < 0) {
            gameOver();
        }
    }
}
