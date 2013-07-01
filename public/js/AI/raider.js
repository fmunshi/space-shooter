var gamejs = require("gamejs");
var $g = require("globals");
var $e = require("gamejs/event");
var $m = require("gamejs/utils/math");
var $laser = require("AI/enemyLaser").eLaser;
var $eShip  = require("AI/enemyShip").eShip;

var Raider = function(rect) {
  // call superconstructor
  Raider.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/Enemies/raider.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, 90);

  this.stats = {
    maxSpeed    :   15,
    maxHealth   :   300,
    maxFireRate :   Math.random()*1000 + 500,
    accuracy    :   0,
    luck        :   0,
    damage      :   100
  };
  this.health = this.stats.maxHealth;
  return this;
};
gamejs.utils.objects.extend(Raider, $eShip);

exports.Raider = Raider;