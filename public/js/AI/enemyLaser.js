var gamejs = require('gamejs');
var $m = require('gamejs/utils/math');
var $bullet = require('bullets/bullet').Bullet;
var $g = require('globals');

var eLaser = function (rect, rotation, velocity, shipRect) {
	// call superconstructor
	eLaser.superConstructor.apply(this, arguments);
	this.image = gamejs.image.load("./images/eLaser.png");
	this.originalImage = gamejs.transform.scale(this.image, rect);
	this.image = gamejs.transform.rotate(this.originalImage, $m.degrees(rotation));
	this.rotation = rotation;

	var vX = 20*Math.cos(rotation) + velocity[0];
	var vY = 20*Math.sin(rotation) + velocity[1];
	this.velocity = [vX, vY];

	if (vX < 0) this.rect.center = [shipRect.right-100,shipRect.bottom-50];
	else this.rect.center = [shipRect.right-50,shipRect.bottom-30];



  	this.rect.width = this.image.rect.width;
  	this.rect.height = this.image.rect.height;

	this.size = rect;

	return this;
};

gamejs.utils.objects.extend(eLaser, $bullet);

eLaser.prototype.update = function (msDuration){
	this.checkbounds();
	this.increaseSize();
	this.rect.moveIp(this.velocity);
	this.collide();


  	this.rect.width = this.image.rect.width;
  	this.rect.height = this.image.rect.height;

};

eLaser.prototype.increaseSize = function(){
	this.size[0] += 5;
	this.size[1] += 0.3;

	this.image = gamejs.image.load("./images/eLaser.png");
 	this.originalImage = gamejs.transform.scale(this.image, this.size);
 	this.image = gamejs.transform.rotate(this.originalImage, $m.degrees(this.rotation));
};

exports.eLaser = eLaser;