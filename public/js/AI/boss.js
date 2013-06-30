var gamejs = require('gamejs');
var $g = require('globals');
var $e = require('gamejs/event');
var $m = require('gamejs/utils/math');
var $laser = require('AI/enemyLaser').eLaser;
var $eShip  = require('AI/enemyShip').eShip;

var Boss = function(rect) {
  // call superconstructor
  Boss.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/Enemies/boss.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, 90);

  this.stats = {
    maxSpeed    :   5,
    maxHealth   :   2000,
    maxFireRate :   Math.random()*1000 + 500,
    accuracy    :   0,
    luck        :   0,
    damage      :   100
  };

  this.setVelocity();

  return this;
};
gamejs.utils.objects.extend(Boss, $eShip);

exports.Boss = Boss;