var gamejs = require('gamejs');
var $m = require('gamejs/utils/math');
var $laser = require('bullets/laser').Laser;
var $g = require('globals')

var Rocket = function(rect, ship, pos) {
  // call superconstructor
  Rocket.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/rocket.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, $m.degrees(ship.rotation)+90);

  var vX = 20*Math.cos(ship.rotation);
  var vY = 20*Math.sin(ship.rotation);
  this.velocity = [vX, vY];

  this.rect.center = ship.pos;
  if (pos) this.rect.center = pos;
  this.ship = ship;

  this.rect.width = this.image.rect.width;
  this.rect.height = this.image.rect.height;

  this.damage = 100*this.ship.stats.damage/100;

  return this;
};
gamejs.utils.objects.extend(Rocket, $laser);


Rocket.prototype.kill = function(){
  var that = this;
  var newRocket = new Rocket([250, 250], that.ship, that.pos);

  var collided = gamejs.sprite.spriteCollide(newRocket, $g.projectiles, true);
  var eCollided = gamejs.sprite.spriteCollide(newRocket, $g.eShips, true);
  collided.forEach(function(proj){
    proj.kill();
  });
  eCollided.forEach(function(eShip){
    eShip.damage(this.damage);
  });

  

  this.ship.bullets.remove(this);
  this.velocity = [0,0];

};

Rocket.prototype.update = function (msDuration){
  this.checkbounds();
  var velocity = $g.calcVelocity(msDuration, this.velocity);
  this.rect.moveIp(velocity);
  this.collide();
  this.rect.width = this.image.rect.width;
  this.rect.height = this.image.rect.height;
};



exports.Rocket = Rocket;