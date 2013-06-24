var gamejs = require('gamejs');
var $g = require('globals');
var $e = require('gamejs/event');
var $m = require('gamejs/utils/math');
var $laser = require('AI/enemyLaser').eLaser;
var $ship  = require('ship').Ship;

var eShip = function(rect) {
  // call superconstructor
  eShip.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/eShip.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, 90);
  
  // [x,y]
  this.pos = [$g.game.screenSize[0], Math.random()*$g.game.screenSize[1]];
  this.velocity = [-(Math.random()*10) + 1, 0];

  this.rect = new gamejs.Rect(rect);
  this.rect.center = this.pos;

  this.bullets = new gamejs.sprite.Group();

  //Angle in radians
  this.rotation = 0;
  this.shooting = false;

  this.health = 100;
  this.maxHealth = 100;

  this.maxAimRate = 1000;
  this.aimRate = this.maxAimRate;

  this.maxFireRate = Math.random()*1000 + 500;
  this.fireRate = this.maxFireRate;

  return this;
};
gamejs.utils.objects.extend(eShip, $ship);


eShip.prototype.update = function(msDuration) {
  this.bullets.update(msDuration);
  this.collide();
  this.decelerate();
  this.checkbounds();
  if (this.aimRate < 0) this.aimRate = this.maxAimRate;
  else {
    this.aimRate -= msDuration;
    this.calculateAngle($g.ship);
  }

  if (this.fireRate > 0) this.fireRate -= msDuration;
  else {
    this.fireRate = this.maxFireRate;
    this.shootLasers();
  }

  var velocity = $g.calcVelocity(msDuration, this.velocity);
  this.rect.moveIp(velocity);
};

eShip.prototype.draw = function (display){
  display.blit(this.image, this.rect);
  this.bullets.draw(display);
};


eShip.prototype.checkbounds = function(){
    var pos = this.rect.center;
    if ( (pos[0] < - 150) || (pos[0] > $g.game.screenSize[0] + 100) || (pos[1] < -100) || (pos[1] > $g.game.screenSize[1] + 100) )  { 
      this.kill();
    }
};

eShip.prototype.kill = function () {
  this.velocity = [-(Math.random()*5 + 2), 0];
  this.rect.center = this.pos = [$g.game.screenSize[0], Math.random()*$g.game.screenSize[1]];
}

//ANGLE STUFF
eShip.prototype.calculateAngle = function (ship){
  var mX = ship.pos[0],
      mY = ship.pos[1],
      sX = this.pos[0],
      sY = this.pos[1],
      dY = mY - sY,
      dX = mX - sX;

  var angle = Math.atan(dY/dX);
      angle = $m.degrees(angle);

  // QUAD THREE
  if ((dX < 0) && (dY > 0)) angle += 180;
  // QUAD TWO
  else if ((dX < 0) && (dY < 0)) angle -= 180;

  this.rotation = $m.radians(angle);
  this.image = gamejs.transform.rotate(this.originalImage, angle+90);

  this.rect.width = this.image.rect.width;
  this.rect.height = this.image.rect.height;

};


eShip.prototype.shootLasers = function (){
  var that = this;
  var laser = new $laser([50, 10], that.rotation, that.velocity, that.rect);
  laser.ship = this;
  this.bullets.add(laser);
};

eShip.prototype.collide = function (){
  var collide = gamejs.sprite.spriteCollide(this, $g.projectiles, true);
  if (collide.length > 0) this.kill();

  var shipCollide = gamejs.sprite.spriteCollide($g.ship, this.bullets, true);
  if (shipCollide.length > 0) $g.ship.damage(50);
}

exports.eShip = eShip;