var gamejs = require('gamejs');
var $m = require('gamejs/utils/math');
var $bullet = require('bullets/bullet').Bullet;
var $g = require('globals');

var Laser = function (rect, rotation, velocity, shipRect) {
	// call superconstructor
	Laser.superConstructor.apply(this, arguments);
	this.image = gamejs.image.load("./images/laser.png");
	this.originalImage = gamejs.transform.scale(this.image, rect);
	this.image = gamejs.transform.rotate(this.originalImage, $m.degrees(rotation));
	this.rotation = rotation;

	var vX = 50*Math.cos(rotation) + velocity[0];
	var vY = 50*Math.sin(rotation) + velocity[1];
	this.velocity = [vX, vY];

	if (vX < 0) this.rect.center = [shipRect.right-100,shipRect.bottom-50];
	else this.rect.center = [shipRect.right-50,shipRect.bottom-30];


  	this.rect.width = this.image.rect.width;
  	this.rect.height = this.image.rect.height;

	this.size = rect;

	return this;
};

gamejs.utils.objects.extend(Laser, $bullet);

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
	this.size[0] += 5;

	this.image = gamejs.image.load("./images/laser.png");
 	this.originalImage = gamejs.transform.scale(this.image, this.size);
 	this.image = gamejs.transform.rotate(this.originalImage, $m.degrees(this.rotation));
};

exports.Laser = Laser;