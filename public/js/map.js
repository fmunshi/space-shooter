var $g = require('globals');
var $ship = require('ship').Ship;
var gamejs = require('gamejs');


var Star = exports.Star =  function() {
  // call superconstructor
  Star.superConstructor.apply(this, arguments);
  this.size = Math.random()*20;
  this.angle = Math.random()*360;

  if (Math.random() < 0.5) this.speedY = 0;
  else this.speedY = 0;

  this.speedX = -(Math.random()*5 + 5);

  this.image = gamejs.image.load("./images/star.png");
  this.originalImage = gamejs.transform.scale(this.image, [this.size, this.size] );
  this.image = gamejs.transform.rotate(this.originalImage, this.angle);
  
  this.velocity = [this.speedX, this.speedY];
  this.rect = new gamejs.Rect([this.size, this.size]);
  this.pos = [$g.game.screenSize[0], Math.random()*$g.game.screenSize[1]];
  this.rect.center = this.pos;

  return this;
};
gamejs.utils.objects.extend(Star, gamejs.sprite.Sprite);


Star.prototype.update = function (msDuration){
  var velocity = $g.calcVelocity(msDuration, this.velocity);
	this.rect.moveIp(velocity);
};

Star.prototype.checkbounds = function(){
  	var that = this;
    var pos = this.rect.center;
    if ( (pos[0] < - 150) || (pos[0] > $g.game.screenSize[0] + 100) || (pos[1] < -100) || (pos[1] > $g.game.screenSize[1] + 100) )  { 
      this.rect.center = this.pos;
    }
};

var drawStars = exports.drawStars = function (display, msDuration){
	var stars = $g.stars;

	stars.forEach(function(star){
		star.checkbounds();
		star.draw(display);
		star.update(msDuration);
	});

};

var drawHealth = exports.drawHealth = function(display){
    var length = window.innerWidth*2*($g.ship.health/$g.ship.maxHealth)
         gamejs.draw.rect(display, '#00AA00', new gamejs.Rect([$g.xMax * .05, 10], [$g.xMax * .9, 20]), length);
}