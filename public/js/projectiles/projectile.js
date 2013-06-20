var gamejs = require('gamejs');
var $g = require('globals');
var $m = require('gamejs/utils/math');

//General Projectile class
var Projectile =  function() {
  // call superconstructor
  Projectile.superConstructor.apply(this, arguments);
  this.size = Math.random()*30;
  this.angle = Math.random()*360;

  this.velocity = [-(Math.random()*10), 0];
  this.rect = new gamejs.Rect([this.size, this.size]);
  this.pos = [$g.game.screenSize[0], Math.random()*$g.game.screenSize[1]];
  this.rect.center = this.pos;

  return this;
};
gamejs.utils.objects.extend(Projectile, gamejs.sprite.Sprite);

Projectile.prototype.update = function (msDuration){
  var velocity = $g.calcVelocity(msDuration, this.velocity);
  this.rect.moveIp(velocity);
  this.checkbounds();
  this.rect.width = this.size+30;
  this.rect.height = this.size+30;

};

Projectile.prototype.checkbounds = function(){
    var pos = this.rect.center;
    if ( (pos[0] < - 150) || (pos[0] > $g.game.screenSize[0] + 100) || (pos[1] < -100) || (pos[1] > $g.game.screenSize[1] + 100) )  { 
      this.kill();
    }
};

Projectile.prototype.kill = function (){
  this.velocity = [-(Math.random()*5 + 2), 0];
  this.rect.center = this.pos = [$g.game.screenSize[0], Math.random()*$g.game.screenSize[1]];
}
exports.Projectile = Projectile;