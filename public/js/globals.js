var gamejs = require("gamejs");
var $ship = require("ship").Ship;

exports.game = {
    screenSize    :   [window.innerWidth, window.innerHeight],
    xMax          :   window.innerWidth,
    yMax          :   window.innerHeight,
    isPaused      :   false,
    isEnded       :   false
};

exports.score = 0;

exports.level = {
  number        :   1,
  maxMeteors    :   1,
  maxUFOs       :   1,
  maxExplorers  :   1,
  maxRaiders    :   1,
  time          :   10000,
  boss          :   false
};

exports.time = 0;

exports.totalTime = 0;

exports.mouse = [0,0];

exports.stars = new Array();

exports.ship;

exports.display;

exports.projectiles = new gamejs.sprite.Group();

exports.powerups = new gamejs.sprite.Group();

exports.eShips = new gamejs.sprite.Group();

exports.calcVelocity = function (msDuration, velocity){
  var newVelocity = [];
  var fps = 1000/msDuration;
	newVelocity[0] = velocity[0]*75/fps;
	newVelocity[1] = velocity[1]*75/fps;

  return newVelocity;
}










var fonts = exports.fonts = {
    big: new gamejs.font.Font("64px Aller"),
    small: new gamejs.font.Font("24px Aller"),
    mini: new gamejs.font.Font("14px Aller")
};


exports.surfaces = {
  // fullscreen: new gamejs.Surface($g.game.screenSize),
  // levelDuration: new gamejs.Surface([$g.game.screenSize[0] - 20, 12]),
  // lifes: new gamejs.Surface([40 * $g.player.defaultLifes, 27]),
  forkPower: new gamejs.Surface([185, 16]),
  stashing: new gamejs.Surface([100, 71]),
  bossLife: new gamejs.Surface([185, 16])
}

exports.texts = {
  bossLife: fonts.mini.render("Boss Life", "#FFFFFF"),
  forkPower: fonts.mini.render("Fork Power", "#FFFFFF"),
  // powerups
  branching: fonts.small.render("Branch your lasers!", "#FFFFFF"),
  cloning:   fonts.small.render("Clone a new life!", "#FFFFFF"),
  forking:   fonts.small.render("Fork your power!", "#FFFFFF"),
  pulling:   fonts.small.render("Pull new powers!", "#FFFFFF"),
  pushing:   fonts.small.render("Push your enemies!", "#FFFFFF"),
  stashing:  fonts.small.render("Stashing a new Misil!", "#FFFFFF")
};