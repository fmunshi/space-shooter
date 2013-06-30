var gamejs = require('gamejs');
var $ship = require('ship').Ship;

exports.game = {
    screenSize: [window.innerWidth, window.innerHeight],
    xMax: window.innerWidth,
    yMax: window.innerHeight
};

exports.stars = [];

exports.ship;

exports.display;

exports.projectiles = new gamejs.sprite.Group();
exports.eShips = new gamejs.sprite.Group();

exports.calcVelocity = function (msDuration, velocity){
  var newVelocity = [];
  var fps = 1000/msDuration;
	newVelocity[0] = velocity[0]*75/fps;
	newVelocity[1] = velocity[1]*75/fps;

  return newVelocity;
}

exports.level = function() {
  this.number = 1;
  this.maxMeteors = 5;
  this.maxEnemies = 5;
  this.time = 60000;
};

exports.time = 0;