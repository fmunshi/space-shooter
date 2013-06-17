var gamejs = require('gamejs');
var $m = require('gamejs/utils/math');
var $bullet = require('bullets/bullet').Bullet;

var Rocket = function(rect, rotation, velocity, shipRect) {
  // call superconstructor
  Rocket.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/rocket.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, $m.degrees(rotation)+90);

  var vX = 20*Math.cos(rotation);
  var vY = 20*Math.sin(rotation);
  this.velocity = [vX, vY];

  if (vX < 0) this.rect.center = [shipRect.right+20,shipRect.bottom+40];
  else this.rect.center = [shipRect.right+50,shipRect.bottom+30];
  this.rect.center = shipRect;

  
  this.rect.width = this.image.rect.width;
  this.rect.height = this.image.rect.height;
  
  return this;
};
gamejs.utils.objects.extend(Rocket, $bullet);

exports.Rocket = Rocket;