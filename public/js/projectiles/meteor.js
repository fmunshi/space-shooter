var gamejs = require('gamejs');
var $m = require('gamejs/utils/math');
var $projectile = require('projectiles/projectile').Projectile;
var $g = require('globals');

var Meteor = function (rect){

  Meteor.superConstructor.apply(this, arguments);

  this.image = gamejs.image.load("./images/meteor.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, Math.random()*360);

  this.rect = new gamejs.Rect(rect);
  this.pos = [$g.game.screenSize[0], Math.random()*$g.game.screenSize[1]];

  this.rect.center = this.pos;

  return this;
};
gamejs.utils.objects.extend(Meteor, $projectile);

exports.Meteor = Meteor;