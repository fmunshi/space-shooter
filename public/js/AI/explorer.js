var gamejs = require("gamejs");
var $g = require("globals");
var $e = require("gamejs/event");
var $m = require("gamejs/utils/math");
var $laser = require("AI/enemyLaser").eLaser;
var $eShip  = require("AI/enemyShip").eShip;

var Explorer = function(rect) {
  // call superconstructor
  Explorer.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/Enemies/explorer.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, 90);

  this.stats = {
    maxSpeed    :   1,
    maxHealth   :   200,
    maxFireRate :   Math.random()*3000 + 500,
    accuracy    :   0,
    luck        :   0,
    damage      :   100
  };

  this.health = this.stats.maxHealth;
  
  return this;
};
gamejs.utils.objects.extend(Explorer, $eShip);

exports.Explorer = Explorer;