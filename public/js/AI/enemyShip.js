var gamejs = require("gamejs");
var $g = require("globals");
var $e = require("gamejs/event");
var $m = require("gamejs/utils/math");
var $laser = require("AI/enemyLaser").eLaser;
var $ship  = require("ship").Ship;
var $powerup = require("powerups").Powerup

var eShip = function(rect) {
  // call superconstructor
  eShip.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/Enemies/boss.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, 90);
  
  // [x,y]
  this.pos = [$g.game.screenSize[0], Math.random()*$g.game.screenSize[1]];

  this.rect = new gamejs.Rect(rect);
  this.rect.center = this.pos;


  this.stats = {
    maxSpeed    :   15,
    maxHealth   :   200 + $g.level.number*5,
    maxFireRate :   Math.random()*1000 + 500 - $g.level.number*5,
    accuracy    :   0,
    luck        :   0,
    damage      :   10 + $g.level.number*1
  };

  this.exp = 10;

  this.velocity = [-(Math.random()*this.stats.maxSpeed), 0];

  this.health = this.stats.maxHealth;
  this.fireRate = this.stats.maxFireRate;

  this.bullets = new gamejs.sprite.Group();

  //Angle in radians
  this.rotation = 0;
  this.shooting = false;


  this.dead = -1;

  this.dodging = false

  return this;
};
gamejs.utils.objects.extend(eShip, $ship);


eShip.prototype.update = function(msDuration) {

  if (this.dead < 0) {
    this.collide();
    this.checkbounds();
    this.calculateAngle($g.ship);

    if (this.fireRate > 0) this.fireRate -= msDuration;
    else {
      this.fireRate = this.stats.maxFireRate;
      this.shootLasers();
    }
    var velocity = $g.calcVelocity(msDuration, this.velocity);
    this.moveIp(velocity);
  }
  else {
    this.dead -= msDuration;
    if (this.dead < 0) this.setVelocity();
  }
  this.bullets.update(msDuration);
  
};

eShip.prototype.draw = function (display){
  display.blit(this.image, this.rect);
  this.bullets.draw(display);
};

eShip.prototype.handle = function(event){
  if (event.type === $e.MOUSE_DOWN) this.dodging = true;

  else if (event.type === $e.MOUSE_MOTION) {
    if (this.dodging) this.dodge(event);
  }

  else if (event.type === $e.MOUSE_UP) this.dodging = false;
};


eShip.prototype.dodge = function(event){
  var that = this;

  if (Math.abs(event.pos[0]-that.pos[0]) < 100){
    if (Math.abs(event.pos[1]-that.pos[1]) < 100){
      that.velocity = [-(Math.random()*that.stats.maxSpeed),-(Math.random()*that.stats.maxSpeed)];
      setTimeout(function(){
        that.velocity = [-(Math.random()*that.stats.maxSpeed), 0];
      }, 100);
    }
  }
};


eShip.prototype.checkbounds = function(){
    var pos = this.pos;
    // if (this.stats.maxSpeed > 0){
    //   if (this.pos[0] < 100) {
    //     this.stats.maxSpeed *= -1;
    //     this.velocity = [-(Math.random()*this.stats.maxSpeed), 0];
    //   }      
    // }
    // else{ 
    //   if (this.pos[0] > $g.game.screenSize[0]) {
    //     this.stats.maxSpeed*= -1;
    //     this.velocity = [-(Math.random()*this.stats.maxSpeed), 0];
    //   }
    // }

    if ( (pos[0] < - 150) || (pos[0] > $g.game.screenSize[0] + 100) || (pos[1] < -100) || (pos[1] > $g.game.screenSize[1] + 100) )  { 
      this.kill(true);
    }

};

eShip.prototype.kill = function (keepAlive) {
  var powerup = new $powerup(this.pos);

  this.dead = 3000;
  this.pos = [$g.game.screenSize[0]+100, Math.random()*$g.game.screenSize[1]];
  this.rect.center = this.pos;
  if (!keepAlive) this.health = this.stats.maxHealth;
  this.velocity = [0,0];
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
  var angle = $m.degrees(that.rotation);
  if (Math.random() < ((100 - this.stats.luck)/100)) angle -= Math.random()*this.stats.accuracy - this.stats.accuracy/2;
  angle = $m.radians(angle);
  var laser = new $laser([40, 5], that);
  this.bullets.add(laser);
};

eShip.prototype.collide = function (){
  var collide = gamejs.sprite.spriteCollide(this, $g.projectiles, true);
  if (collide.length > 0) this.damage(50);

  var shipCollide = gamejs.sprite.spriteCollide($g.ship, this.bullets, true);
  if (shipCollide.length > 0){
    shipCollide.forEach(function(bullet){
      if (isNaN(bullet.damage))  alert(bullet.damage);
      else {
        $g.ship.damage(bullet.damage);
      }
    });
  } 
}


eShip.prototype.damage = function(amount){
  // Reduce health by "amount" also kill user if health below 0
  this.health -= amount;
  if (this.health < 0) this.kill();
  // console.warn(amount);

}

eShip.prototype.setVelocity = function(){
  this.velocity = [-(Math.random()*this.stats.maxSpeed), 0];
  console.log(this.velocity);
}

exports.eShip = eShip;