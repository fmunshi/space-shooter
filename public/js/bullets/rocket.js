var gamejs = require('gamejs');
var $m = require('gamejs/utils/math');
var $bullet = require('bullets/bullet').Bullet;
var $g = require('globals')

var Rocket = function(rect, rotation, velocity, pos) {
  // call superconstructor
  Rocket.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/rocket.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, $m.degrees(rotation)+90);

  var vX = 20*Math.cos(rotation);
  var vY = 20*Math.sin(rotation);
  this.velocity = [vX, vY];

  this.rect.center = pos;
  this.ship;

  this.rect.width = this.image.rect.width;
  this.rect.height = this.image.rect.height;

  return this;
};
gamejs.utils.objects.extend(Rocket, $bullet);


Rocket.prototype.collide = function (){
  var collided = gamejs.sprite.spriteCollide(this, $g.projectiles, true);
  var eCollided = gamejs.sprite.spriteCollide(this, $g.eShips, true);
  if (collided.length > 0) this.kill();
  if (eCollided.length > 0) this.kill();
};

Rocket.prototype.kill = function(){
  var that = this;
  var newRocket = new Rocket([500, 500], that.rotation, [0,0], that.rect);
  var collided = gamejs.sprite.spriteCollide(newRocket, $g.projectiles, true);
  var eCollided = gamejs.sprite.spriteCollide(newRocket, $g.eShips, true);

  this.ship.bullets.remove(this);
  this.velocity = [0,0];

};



exports.Rocket = Rocket;