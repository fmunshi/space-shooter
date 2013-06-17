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

	var vX = 20*Math.cos(rotation) + velocity[0];
	var vY = 20*Math.sin(rotation) + velocity[1];
	this.velocity = [vX, vY];

	if (vX < 0) this.rect.center = [shipRect.right+20,shipRect.bottom+40];
	else this.rect.center = [shipRect.right+50,shipRect.bottom+30];

	this.size = rect;

	this.rect.width = 50;
	this.rect.height = 100;


	return this;
};

gamejs.utils.objects.extend(Laser, $bullet);

Laser.prototype.update = function (msDuration){
	this.checkbounds();
	this.increaseSize();
	this.rect.moveIp(this.velocity);
	this.rect.width = 50;
	this.rect.height = 100;
	this.collide();

};

Laser.prototype.increaseSize = function(){
	this.size[0] += 5;
	this.size[1] += 0.3;

	this.image = gamejs.image.load("./images/laser.png");
 	this.originalImage = gamejs.transform.scale(this.image, this.size);
 	this.image = gamejs.transform.rotate(this.originalImage, $m.degrees(this.rotation));
};

exports.Laser = Laser;