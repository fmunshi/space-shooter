var gamejs = require("gamejs");
var $m = require("gamejs/utils/math");
var $laser = require("bullets/laser").Laser;
var $g = require("globals");

var eLaser = function (rect, ship) {
	// call superconstructor
	eLaser.superConstructor.apply(this, arguments);
	this.image = gamejs.image.load("./images/Enemies/laser.png");
	this.originalImage = gamejs.transform.scale(this.image, rect);
	this.image = gamejs.transform.rotate(this.originalImage, $m.degrees(ship.rotation));

  this.ship = ship;

  // [x,y]
  var vX = 20*Math.cos(ship.rotation) + ship.velocity[0]
    , vY = 20*Math.sin(ship.rotation) + ship.velocity[1];

  this.velocity = [vX, vY];
  this.pos = [0,0];
  this.size = rect;
  this.damage = 25*ship.stats.damage/100;

  //  RECT
  this.rect = new gamejs.Rect(rect);
  this.rect.center = [ship.pos[0], ship.pos[1]];
  this.rect.width = this.image.rect.width;
  this.rect.height = this.image.rect.height;
  if (vX < 0) this.rect.center = [ship.rect.right-100,ship.rect.bottom-50];
  else this.rect.center = [ship.rect.right-50,ship.rect.bottom-30];
  //  END RECT

	return this;
};

gamejs.utils.objects.extend(eLaser, $laser);

eLaser.prototype.update = function (msDuration){
	this.checkbounds();
	var velocity = $g.calcVelocity(msDuration, this.velocity);
	this.rect.moveIp(velocity);
	this.collide();

	this.rect.width = this.image.rect.width;
	this.rect.height = this.image.rect.height;

};

eLaser.prototype.collide = function (){
  var collided = gamejs.sprite.spriteCollide(this, $g.projectiles, true);
  if (collided.length > 0) this.kill();
}

exports.eLaser = eLaser;