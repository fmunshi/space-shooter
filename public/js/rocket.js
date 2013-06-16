var gamejs = require('gamejs');
var $g = require('globals');
var $e = require('gamejs/event');
var $v = require('gamejs/utils/vectors');
var $m = require('gamejs/utils/math');
var $rocket = require('rocket').rocket;

var Rocket = function(rect, angle) {
  // call superconstructor
  Rocket.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/rocket.png");
  this.originalImage = gamejs.transform.scale(this.image, [25, 60] );

  this.image = gamejs.transform.rotate(this.originalImage, angle);
  
  // [x,y]
  this.pos = [0,0];
  this.velocity = [0,0];

  this.rect = new gamejs.Rect(rect);
  this.rect.center = this.pos;

  return this;
};
gamejs.utils.objects.extend(Rocket, gamejs.sprite.Sprite);

Rocket.prototype.update = function(msDuration) {
  this.checkbounds();
  this.rect.moveIp(this.velocity);
};

Rocket.prototype.checkbounds = function(){
  var that = this;
    this.pos = this.rect.center;
    if ( (this.pos[0] < - 150) || (this.pos[0] > $g.game.screenSize[0] + 100) || (this.pos[1] < -100) || (this.pos[1] > $g.game.screenSize[1] + 100) )  { 
      this.velocity = [0,0];
    }
};

exports.Rocket = Rocket;