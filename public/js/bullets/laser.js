var gamejs = require("gamejs");
var $m = require("gamejs/utils/math");
var $g = require("globals");


var Laser = function (rect, ship) {
	// call superconstructor
	Laser.superConstructor.apply(this, arguments);
	this.image = gamejs.image.load("./images/Player/laser.png");
	this.originalImage = gamejs.transform.scale(this.image, rect);
	this.image = gamejs.transform.rotate(this.originalImage, $m.degrees(ship.rotation));
	this.rotation = ship.rotation;

	var vX = 50*Math.cos(ship.rotation) + ship.velocity[0];
	var vY = 50*Math.sin(ship.rotation) + ship.velocity[1];

	// [x,y]
	this.velocity = [vX, vY];
  this.pos = [0,0];

  this.rect = new gamejs.Rect(rect);
	this.rect.center = [ship.pos[0], ship.pos[1]];
	this.rect.width = this.image.rect.width;
	this.rect.height = this.image.rect.height;

	this.ship = ship;

  this.damage = 25*ship.stats.damage/100;

	this.size = rect;

	return this;
};

gamejs.utils.objects.extend(Laser, gamejs.sprite.Sprite);

Laser.prototype.update = function (msDuration){
	this.checkbounds();
	this.increaseSize();
	var velocity = $g.calcVelocity(msDuration, this.velocity);
	this.rect.moveIp(velocity);
	this.collide();
	this.rect.width = this.image.rect.width;
	this.rect.height = this.image.rect.height;

};

Laser.prototype.increaseSize = function(){
	this.size[0] += 10;

	this.image = gamejs.image.load("./images/Player/laser.png");
 	this.originalImage = gamejs.transform.scale(this.image, this.size);
 	this.image = gamejs.transform.rotate(this.originalImage, $m.degrees(this.rotation));
};



Laser.prototype.checkbounds = function(){
  var that = this;
    this.pos = this.rect.center;
    if ( (this.pos[0] < - 150) || (this.pos[0] > $g.game.screenSize[0] + 100) || (this.pos[1] < -100) || (this.pos[1] > $g.game.screenSize[1] + 100) )  { 
      this.kill();
    }
};

Laser.prototype.collide = function (){
	var that = this;
  var collided = gamejs.sprite.spriteCollide(this, $g.projectiles, true);
  var eCollided = gamejs.sprite.spriteCollide(this, $g.eShips, false);
  if (collided.length > 0) this.kill();
  if (eCollided.length > 0){
    this.kill();
    eCollided.forEach(function(eShip){
      eShip.damage(that.damage);
    });
  }
}

Laser.prototype.kill = function(){
    this.ship.bullets.remove(this);
    this.velocity = [0,0];
}

exports.Laser = Laser;