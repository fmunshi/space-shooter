var gamejs = require('gamejs');
var $g = require('globals');
var $m = require('gamejs/utils/math');

//General bullet class
var Bullet = function(rect) {

  Bullet.superConstructor.apply(this, arguments);
  // [x,y]
  this.pos = [0,0];
  this.velocity = [0,0];
  this.rect = new gamejs.Rect(rect);

  this.rect.width = 50;
  this.rect.height = 100;

  this.rect.center = this.pos;
  this.ship;

  return this;
};
gamejs.utils.objects.extend(Bullet, gamejs.sprite.Sprite);

Bullet.prototype.update = function(msDuration) {
  this.rect.width = 50;
  this.rect.height = 100;

  this.checkbounds();
  this.rect.moveIp(this.velocity);
  this.collide();
};

Bullet.prototype.checkbounds = function(){
  var that = this;
    this.pos = this.rect.center;
    if ( (this.pos[0] < - 150) || (this.pos[0] > $g.game.screenSize[0] + 100) || (this.pos[1] < -100) || (this.pos[1] > $g.game.screenSize[1] + 100) )  { 
      this.ship.bullets.remove(this);
      this.velocity = [0,0];
    }
};

Bullet.prototype.collide = function (){
  gamejs.sprite.spriteCollide(this, $g.projectiles, true);
}

exports.Bullet = Bullet;