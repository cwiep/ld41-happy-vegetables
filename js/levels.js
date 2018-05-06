$.Levels = [
  {
    pots: [false, true, false],
    bottomLane: false,
    speed: 0.15,
    targetPots: 1,
    monster: false,
    bg: "res/bg1.png",
    ingredients: ["potato"],
    hint: "Click potatos to cut them",
    loseable: false
  },
  {
    pots: [false, true, false],
    bottomLane: false,
    speed: 0.15,
    targetPots: 1,
    monster: false,
    bg: "res/bg1.png",
    ingredients: ["potato", "carot"],
    hint: "Order of vegetables does not matter",
    loseable: false
  },
  {
    pots: [false, true, false],
    bottomLane: false,
    speed: 0.15,
    targetPots: 1,
    monster: false,
    bg: "res/bg1.png",
    ingredients: ["potato", "carot", "onion"],
    hint: "Don't waste vegetables",
    loseable: true
  },
  {
    pots: [false, true, false],
    bottomLane: false,
    speed: 0.2,
    targetPots: 3,
    monster: false,
    bg: "res/bg1.png",
    ingredients: ["potato", "carot", "onion", "brocoli"],
    hint: "Reach the specified number of pots to finish a level",
    loseable: true
  },
  {
    pots: [true, false, true],
    bottomLane: true,
    speed: 0.2,
    targetPots: 5,
    monster: false,
    bg: "res/bg2.png",
    ingredients: ["potato", "carot", "onion", "brocoli"],
    hint: "Get a second chance for each vegetable",
    loseable: true
  }
];
