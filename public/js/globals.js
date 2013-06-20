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

exports.calcVelocity = function (msDuration, velocity){
  var newVelocity = [];
  newVelocity[0] = velocity[0]*msDuration/20;
  newVelocity[1] = velocity[1]*msDuration/20;
  return newVelocity;
}