var gamejs = require('gamejs');
var $ship = require('ship').Ship;

exports.game = {
    screenSize: [window.innerWidth, window.innerHeight],
    xMax: window.innerWidth,
    yMax: window.innerHeight
};

exports.stars = [];

exports.ship;

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

};

exports.time = 0;