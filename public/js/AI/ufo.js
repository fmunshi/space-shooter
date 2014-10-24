var gamejs = require("gamejs");
var $g = require("globals");
var $e = require("gamejs/event");
var $m = require("gamejs/utils/math");
var $laser = require("AI/enemyLaser").eLaser;
var $eShip  = require("AI/enemyShip").eShip;

var ufo = function(rect) {
  // call superconstructor
  ufo.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/Enemies/ufo.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, 90);

  this.stats = {
    maxSpeed    :   3,
    maxHealth   :   10 + $g.level.number*10,
    maxFireRate :   Math.abs(Math.random()*1000 + 500 - $g.level.number*100),
    accuracy    :   0,
    luck        :   0,
    damage      :   100 + $g.level.number*10
  };

  this.exp = 5;

  this.health = this.stats.maxHealth;
  this.setVelocity();

  return this;
};
gamejs.utils.objects.extend(ufo, $eShip);

exports.ufo = ufo;