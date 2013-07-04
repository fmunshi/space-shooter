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

exports.powerup = false;

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

exports.fonts = {
    big: new gamejs.font.Font("64px Aller"),
    small: new gamejs.font.Font("24px Aller"),
    mini: new gamejs.font.Font("14px Aller")
};


exports.images = [

    "./images/Player/ship.png",
    "./images/Player/rightShip.png",
    "./images/Player/leftShip.png",

    "./images/Player/rocket.png",
    "./images/Player/laser.png",

    "./images/Map/star.png",
    "./images/Map/meteor.png",
    "./images/Map/meteorSmall.png",

    "./images/Enemies/laser.png",

    "./images/Enemies/boss.png",
    "./images/Enemies/ufo.png",
    "./images/Enemies/explorer.png",
    "./images/Enemies/darkExplorer.png",
    "./images/Enemies/heavyRaider.png",
    "./images/Enemies/raider.png",

    "./images/Powerups/damage.png",
    "./images/Powerups/health.png",
    "./images/Powerups/invincible.png",
    "./images/Powerups/kill.png",
    "./images/Powerups/spray.png"
];