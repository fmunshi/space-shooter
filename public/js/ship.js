var gamejs = require('gamejs');
var $g = require('globals');
var $e = require('gamejs/event');
var $m = require('gamejs/utils/math');
var $rocket = require('bullets/rocket').Rocket;
var $laser = require('bullets/laser').Laser;

var Ship = function(rect) {
  // call superconstructor
  Ship.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/ship.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, 90);
  
  // [x,y]
  this.pos = [0,0];
  this.velocity = [0,0];

  //Angle in radians
  this.rotation = 0;
  this.shooting = false;
  this.weapon = 'rocket';

  this.rect = new gamejs.Rect(rect);
  this.rect.x = 500;
  this.rect.y = 500;

  this.bullets = new gamejs.sprite.Group();

  this.health = 1000;
  this.maxHealth = 1000;

  return this;
};
gamejs.utils.objects.extend(Ship, gamejs.sprite.Sprite);


Ship.prototype.update = function(msDuration) {
  this.bullets.update(msDuration);
  this.collide();
  this.decelerate();
  this.checkbounds();
  this.rect.moveIp(this.velocity);
};

Ship.prototype.handle = function(event){

  if (event.type === $e.MOUSE_MOTION) {
      this.calculateAngle(event);
  }
  if (event.type === $e.MOUSE_DOWN){
    this.calculateAngle(event);
    if (this.weapon === 'rocket') this.shootRockets(event);
    else this.shootLasers(event);
  }
  if (event.type === $e.KEY_DOWN) {
    if (event.key === $e.K_SHIFT){
      this.switchWeapon();
    }
    this.move(event);
  }
};

Ship.prototype.draw = function (display){
  display.blit(this.image, this.rect);
  this.bullets.draw(display);

};



//MOVING STUFF
Ship.prototype.move = function(event){
  if (event.key == $e.K_s) this.velocity[1] += 10;
  else if (event.key == $e.K_a) this.velocity[0] -= 10;
  else if (event.key == $e.K_d) this.velocity[0] += 10;
  else if (event.key == $e.K_w) this.velocity[1] -= 10;
};

Ship.prototype.decelerate = function(){
  if (this.velocity[0] > 0) { this.velocity[0] -= this.velocity[0]/15; }
  if (this.velocity[0] < 0) { this.velocity[0] -= this.velocity[0]/15; }
  if (this.velocity[1] > 0) { this.velocity[1] -= this.velocity[1]/15; }
  if (this.velocity[1] < 0) { this.velocity[1] -= this.velocity[1]/15; }
};

Ship.prototype.checkbounds = function(){
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
Ship.prototype.calculateAngle = function (event){
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

};

// SHOOTING ROCKETS
Ship.prototype.shootRockets = function (event){
  var that = this;
  if (!this.shooting) {
      var rocket = new $rocket([20, 50], that.rotation, that.velocity, that.rect);
      rocket.ship = this;
      this.bullets.add(rocket);
      this.shooting = true;
      this.loadRocket();
  }
};

Ship.prototype.loadRocket = function (){
  var that = this;
    var loadRocket = setTimeout(function(){ 
        that.shooting = false;
        clearTimeout(loadRocket);
    }, 500);
};

Ship.prototype.shootLasers = function (event){
  var that = this;
  var laser = new $laser([50, 10], that.rotation, that.velocity, that.rect);
  laser.ship = this;
  this.bullets.add(laser);
};

Ship.prototype.switchWeapon = function(){
  if (this.weapon === 'rocket') this.weapon = 'laser';
  else this.weapon = 'rocket';
};

Ship.prototype.collide = function (){
  var collide = gamejs.sprite.spriteCollide(this, $g.projectiles, false);
  if (collide.length > 0) this.health -= 20;
}

exports.Ship = Ship;