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

exports.fonts = {
    big: new gamejs.font.Font("64px Aller"),
    small: new gamejs.font.Font("24px Aller"),
    mini: new gamejs.font.Font("14px Aller")
};