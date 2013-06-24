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
  this.firing = false;
  this.fireRate = 200;
  this.weapon = 'rocket';
  this.weapons = ['rocket', 'laser'];

  this.rect = new gamejs.Rect(rect);
  this.bullets = new gamejs.sprite.Group();

  this.health = 1000;
  this.maxHealth = 1000;

  this.heat = 0;
  this.maxHeat = 1000;

  return this;
};
gamejs.utils.objects.extend(Ship, gamejs.sprite.Sprite);


Ship.prototype.update = function(msDuration) {
  if (this.heat > 0) this.heat -= 10;
  if (this.firing) this.shootLasers(msDuration);
  this.bullets.update(msDuration);
  this.collide();
  this.checkbounds();

  var velocity = $g.calcVelocity(msDuration, this.velocity);
  this.rect.moveIp(velocity);
  this.decelerate(velocity);
};

Ship.prototype.handle = function(event){

  if (event.type === $e.MOUSE_MOTION) {
      this.calculateAngle(event);
  }
  if (event.type === $e.MOUSE_DOWN){
    this.calculateAngle(event);
    if (this.weapon === 'rocket') this.shootRockets(event);
    else this.firing = true;
  }
  if (event.type === $e.KEY_DOWN) {
    if (event.key === $e.K_SHIFT){
      this.switchWeapon();
    }
    this.move(event);
  }
  if (event.type === gamejs.event.MOUSE_UP) {
      this.firing = false;
  }

};

Ship.prototype.draw = function (display){
  display.blit(this.image, this.rect);
  this.bullets.draw(display);

};



//MOVING STUFF
Ship.prototype.move = function(event){
  if (event.key == $e.K_s) this.velocity[1] += 5;
  else if (event.key == $e.K_a) this.velocity[0] -= 5;
  else if (event.key == $e.K_d) this.velocity[0] += 5;
  else if (event.key == $e.K_w) this.velocity[1] -= 5;
};

Ship.prototype.decelerate = function(velocity){
  if (this.velocity[0] > 0) { this.velocity[0] -= this.velocity[0]/100; }
  if (this.velocity[0] < 0) { this.velocity[0] -= this.velocity[0]/100; }
  if (this.velocity[1] > 0) { this.velocity[1] -= this.velocity[1]/100; }
  if (this.velocity[1] < 0) { this.velocity[1] -= this.velocity[1]/100; }
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

  this.rect.width = this.image.rect.width;
  this.rect.height = this.image.rect.height;

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

Ship.prototype.shootLasers = function (msDuration){
  var that = this;
  
  if (this.heat > this.maxHeat) this.fireRate = 100;
  else this.heat += 20;

  if (this.fireRate < 0){
      var laser = new $laser([50, 5], that.rotation, that.velocity, that.rect);
      laser.ship = this;
      this.bullets.add(laser);
      this.fireRate = 75;
  }
  else this.fireRate -= msDuration;

};

Ship.prototype.switchWeapon = function(){
  var i = this.weapons.indexOf(this.weapon);
  if (this.weapons[i+1] === undefined) this.weapon = this.weapons[0];
  else this.weapon = this.weapons[i+1];
};

Ship.prototype.collide = function (){
  var collide = gamejs.sprite.spriteCollide(this, $g.projectiles, true);
  if (collide.length > 0){
    this.damage(50);
    this.velocity[0] = this.velocity[0]/10;
    this.velocity[1] = this.velocity[1]/10;
  } 
}

Ship.prototype.kill = function(){
    alert('You died');
      setTimeout(function(){
        location.reload();
    }, 500);
}

Ship.prototype.damage = function(amount){
  this.health -= amount;
  if (this.health < 0) this.kill();
}

exports.Ship = Ship;