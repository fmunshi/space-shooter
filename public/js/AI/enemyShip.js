var gamejs = require('gamejs');
var $g = require('globals');
var $e = require('gamejs/event');
var $m = require('gamejs/utils/math');
var $laser = require('AI/enemyLaser').Laser;
var $ship = require('ship').Ship;

var eShip = function(rect) {
  // call superconstructor
  eShip.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/eShip.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, 90);
  
  // [x,y]
  this.pos = [0,0];
  this.velocity = [0,0];

  //Angle in radians
  this.rotation = 0;
  this.shooting = false;

  this.rect = new gamejs.Rect(rect);
  this.bullets = new gamejs.sprite.Group();

  this.health = 100;
  this.maxHealth = 100;

  return this;
};
gamejs.utils.objects.extend(eShip, $ship);


eShip.prototype.update = function(msDuration) {
  this.bullets.update(msDuration);
  this.collide();
  this.decelerate();
  this.checkbounds();
  var velocity = $g.calcVelocity(msDuration, this.velocity);
  this.rect.moveIp(velocity);
};

eShip.prototype.handle = function(event){ };

eShip.prototype.draw = function (display){
  display.blit(this.image, this.rect);
  this.bullets.draw(display);

};



//MOVING STUFF
eShip.prototype.move = function(event){
  if (event.key == $e.K_s) this.velocity[1] += 5;
  else if (event.key == $e.K_a) this.velocity[0] -= 5;
  else if (event.key == $e.K_d) this.velocity[0] += 5;
  else if (event.key == $e.K_w) this.velocity[1] -= 5;
};

eShip.prototype.decelerate = function(){
  if (this.velocity[0] > 0) { this.velocity[0] -= this.velocity[0]/30; }
  if (this.velocity[0] < 0) { this.velocity[0] -= this.velocity[0]/30; }
  if (this.velocity[1] > 0) { this.velocity[1] -= this.velocity[1]/30; }
  if (this.velocity[1] < 0) { this.velocity[1] -= this.velocity[1]/30; }
};

eShip.prototype.checkbounds = function(){
  this.pos = this.rect.center;

    // Left
    if (this.pos[0] < 0) { this.velocity[0] = 5; }
    // Right
    if (this.pos[0] > $g.game.screenSize[0]-100) { this.velocity[0] = -5; }
    // Low
    if (this.pos[1] < -50) { this.velocity[1] = 5; }
    // High
    if (this.pos[1] > $g.game.screenSize[1]-100) { this.velocity[1] = -5; }
    this.rect.center = this.pos;
};


//ANGLE STUFF
eShip.prototype.calculateAngle = function (event){
  var mX = event.pos[0] - 30,
      mY = event.pos[1] - 30,
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

// SHOOTING ROCKETS
eShip.prototype.shootRockets = function (event){
  var that = this;
  if (!this.shooting) {
      var rocket = new $rocket([20, 50], that.rotation, that.velocity, that.rect);
      rocket.eShip = this;
      this.bullets.add(rocket);
      this.shooting = true;
      this.loadRocket();
  }
};

eShip.prototype.loadRocket = function (){
  var that = this;
    var loadRocket = setTimeout(function(){ 
        that.shooting = false;
        clearTimeout(loadRocket);
    }, 500);
};

eShip.prototype.shootLasers = function (event){
  var that = this;
  var laser = new $laser([50, 10], that.rotation, that.velocity, that.rect);
  laser.eShip = this;
  this.bullets.add(laser);
};

eShip.prototype.switchWeapon = function(){
  if (this.weapon === 'rocket') this.weapon = 'laser';
  else this.weapon = 'rocket';
};

eShip.prototype.collide = function (){
  var collide = gamejs.sprite.spriteCollide(this, $g.projectiles, true);
  if (collide.length > 0) this.health -= 50;
}

exports.eShip = eShip;