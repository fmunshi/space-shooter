var gamejs = require("gamejs");
var $g = require("globals");
var $m = require("gamejs/utils/math");
var $powerup = require("powerups").Powerup;

//General Projectile class

var Projectile =  function(rect) {
  // call superconstructor
  Projectile.superConstructor.apply(this, arguments);


  this.image = gamejs.image.load("./images/Map/meteor.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, Math.random()*360);

  this.size = rect[0];
  this.angle = Math.random()*360;

  this.velocity = [-(Math.random()*10), 0];
  this.rect = new gamejs.Rect(rect);
  this.pos = [$g.game.screenSize[0], Math.random()*$g.game.screenSize[1]];
  this.rect.center = this.pos;
  this.maxHealth = 100 + $g.level.number*20;
  this.health = this.maxHealth;

  return this;
};
gamejs.utils.objects.extend(Projectile, gamejs.sprite.Sprite);

Projectile.prototype.update = function (msDuration){

  var velocity = $g.calcVelocity(msDuration, this.velocity);
  this.rect.moveIp(velocity);
  this.checkbounds();
  this.rect.width = this.size+30;
  this.rect.height = this.size+30;
  this.collide();

};

Projectile.prototype.checkbounds = function(){
    var pos = this.rect.center;
    if ( (pos[0] < - 150) || (pos[0] > $g.game.screenSize[0] + 100) || (pos[1] < -100) || (pos[1] > $g.game.screenSize[1] + 100) )  { 
      this.kill();
    }
};

Projectile.prototype.kill = function (){
  this.health = this.maxHealth;
  var powerup = new $powerup(this.rect.center);
  this.velocity = [-(Math.random()*5 + 2), 0];
  this.rect.center = this.pos = [$g.game.screenSize[0]+100, Math.random()*$g.game.screenSize[1]];
}

Projectile.prototype.collide = function(){
  var that = this;
  var collide = gamejs.sprite.spriteCollide(this, $g.projectiles, false);
  collide.forEach(function(collision){
    if (that.size < collision.size) that.kill();
  });
}

Projectile.prototype.damage = function(damage){
  this.health -= Math.abs(damage);
  
  if (this.health <= 0) this.kill();
  else if (this.health > this.maxHealth/2) this.image.setAlpha(1-this.health/this.maxHealth);
}
exports.Projectile = Projectile;