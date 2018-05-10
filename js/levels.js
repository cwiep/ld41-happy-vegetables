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
    hint: "The order of vegetables\ndoes not matter",
    loseable: false
  },
  {
    pots: [false, true, false],
    bottomLane: false,
    speed: 0.15,
    targetPots: 3,
    monster: false,
    bg: "res/bg1.png",
    ingredients: ["potato", "carot"],
    hint: "Reach the specified number\nof pots to finish a level",
    loseable: false
  },
  {
    pots: [false, true, false],
    bottomLane: false,
    speed: 0.2,
    targetPots: 3,
    monster: false,
    bg: "res/bg1.png",
    ingredients: ["potato", "carot", "onion"],
    hint: "Don't cut the wrong\nvegetables",
    loseable: true
  },
  // 5
  {
    pots: [true, false, true],
    bottomLane: true,
    speed: 0.2,
    targetPots: 5,
    monster: false,
    bg: "res/bg2.png",
    ingredients: ["potato", "carot", "onion"],
    hint: "Get a second chance for\neach vegetable",
    loseable: true
  },
  // 6
  {
    pots: [true, false, true],
    bottomLane: true,
    speed: 0.2,
    targetPots: 5,
    monster: false,
    bg: "res/bg2.png",
    ingredients: ["potato", "carot", "onion", "brocoli"],
    hint: "Get some broccoli",
    loseable: true
  },
  // 7
  {
    pots: [true, false, true],
    bottomLane: true,
    speed: 0.25,
    targetPots: 10,
    monster: false,
    bg: "res/bg2.png",
    ingredients: ["potato", "carot", "onion", "brocoli"],
    hint: "More soups,\nfaster vegetables",
    loseable: true
  },
  // 8
  {
    pots: [true, true, true],
    bottomLane: true,
    speed: 0.25,
    targetPots: 10,
    monster: false,
    bg: "res/bg2.png",
    ingredients: ["potato", "carot", "onion", "brocoli"],
    hint: "More pots",
    loseable: true
  },
  // 9
  {
    pots: [true, true, true],
    bottomLane: true,
    speed: 0.3,
    targetPots: 10,
    monster: false,
    bg: "res/bg2.png",
    ingredients: ["potato", "carot", "onion", "brocoli"],
    hint: "Even faster",
    loseable: true
  },
  // 10 - monster easy one pot
  {
    pots: [true, true, false],
    bottomLane: true,
    speed: 0.3,
    targetPots: 10,
    monster: true,
    monsterSpeed: 0,
    monsterTimeToEat: 5000,
    monsterStunTime: 3000,
    bg: "res/bg2.png",
    ingredients: ["potato", "carot", "onion", "brocoli"],
    hint: "Beware the troll,\nit is hungry, too",
    loseable: true
  },
  // 11 - monster two pots on the right
  {
    pots: [false, true, true],
    bottomLane: true,
    speed: 0.3,
    targetPots: 10,
    monster: true,
    monsterSpeed: 0,
    monsterTimeToEat: 4000,
    monsterStunTime: 1000,
    bg: "res/bg2.png",
    ingredients: ["potato", "carot", "onion", "brocoli"],
    hint: "The troll wants more",
    loseable: true
  },
  // 12 - monster all pots
  {
    pots: [true, true, true],
    bottomLane: true,
    speed: 0.3,
    targetPots: 10,
    monster: true,
    monsterSpeed: -0.1,
    monsterTimeToEat: 4000,
    monsterStunTime: 1000,
    bg: "res/bg2.png",
    ingredients: ["potato", "carot", "onion", "brocoli"],
    hint: "IT MOVES!",
    loseable: true
  },
  // 13 - monster speed all pots
  {
    pots: [true, true, true],
    bottomLane: true,
    speed: 0.3,
    targetPots: 10,
    monster: true,
    monsterSpeed: -0.2,
    monsterTimeToEat: 3000,
    monsterStunTime: 1000,
    bg: "res/bg2.png",
    ingredients: ["potato", "carot", "onion", "brocoli"],
    hint: "Finale",
    loseable: true
  }  
];
