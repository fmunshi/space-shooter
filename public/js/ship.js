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
  this.pos = [50,50];
  this.velocity = [0,0];

  this.maxSpeed = 10;

  //Angle in radians
  this.rotation = 0;

  this.shooting = false;
  this.firing = false;
  this.fireRate = 100;

  this.weapon = 'rocket';
  this.weapons = ['rocket', 'laser'];

  this.rect = new gamejs.Rect(rect);
  this.rect.center = this.pos;

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

  if (this.moving) this.move();
  var velocity = $g.calcVelocity(msDuration, this.velocity);
  this.moveIp(velocity);
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

    if (event.key === $e.K_a) this.moving = 'a';
    else if (event.key === $e.K_s) this.moving = 's';
    else if (event.key === $e.K_w) this.moving = 'w';
    else if (event.key === $e.K_d) this.moving = 'd';

  }
  if (event.type == $e.KEY_UP){
    if (event.key === $e.K_a || event.key === $e.K_s || event.key === $e.K_w || event.key === $e.K_d) this.moving = false;
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
Ship.prototype.moveIp = function(velocity){
  this.pos[0] += velocity[0];
  this.pos[1] += velocity[1];
  this.rect.center = this.pos;
}

Ship.prototype.move = function(){
  var that = this;

    if (Math.abs(this.velocity[1]) < this.maxSpeed){
      if (that.moving === 's') that.velocity[1] += 1;
      else if (that.moving === 'w') that.velocity[1] -= 1;
    }
    if (Math.abs(this.velocity[0]) < this.maxSpeed){
      if (that.moving === 'a') that.velocity[0] -= 1;
      else if (that.moving === 'd') that.velocity[0] += 1;
    }
};

Ship.prototype.decelerate = function(velocity){
  if (this.velocity[0] < 1 && this.velocity > -1) this.velocity[0] = 0;
  if (this.velocity[1] < 1 && this.velocity > -1) this.velocity[1] = 0;
  if (this.velocity[0] > 0) { this.velocity[0] -= this.velocity[0]/10; }
  if (this.velocity[0] < 0) { this.velocity[0] -= this.velocity[0]/10; }
  if (this.velocity[1] > 0) { this.velocity[1] -= this.velocity[1]/10; }
  if (this.velocity[1] < 0) { this.velocity[1] -= this.velocity[1]/10; }
};

Ship.prototype.checkbounds = function(){
    // Check if user is out of bounds of the screen
    
    // Left
    if (this.pos[0] < 0) { this.pos[0] = $g.game.screenSize[0]-100; }
    // Right
    if (this.pos[0] > $g.game.screenSize[0]-10) { this.pos[0] = 0; }
    // Bottom
    if (this.pos[1] < 10) { this.pos[1] = $g.game.screenSize[1]-10; }
    // Top
    if (this.pos[1] > $g.game.screenSize[1]) { this.pos[1] = 0; }
};


Ship.prototype.calculateAngle = function (event){
  // Calculate the ships rotation and adjust image size based on it

  var mX = event.pos[0] - 30
    , mY = event.pos[1] - 30
    , sX = this.pos[0]
    , sY = this.pos[1]
    , dY = mY - sY
    , dX = mX - sX;

  var angle = Math.atan(dY/dX);
      angle = $m.degrees(angle);

  // Quadrant Two
  if ((dX < 0) && (dY < 0)) angle -= 180;
  // Quadrant Three
  else if ((dX < 0) && (dY > 0)) angle += 180;

  this.rotation = $m.radians(angle);
  this.image = gamejs.transform.rotate(this.originalImage, angle+90);

  this.rect.width = this.image.rect.width;
  this.rect.height = this.image.rect.height;

};

Ship.prototype.shootRockets = function (event){
  // Ship shoots rockets, on mouse down, if the user has rockets selected
  var that = this;
  if (!this.shooting) {
      var rocket = new $rocket([20, 50], that.rotation, that.velocity, that.pos);
      rocket.ship = this;
      this.bullets.add(rocket);
      this.shooting = true;
      this.loadRocket();
  }
};

Ship.prototype.loadRocket = function (){
  // TimeOut after rocket shot, to prevent spamming rockets
  var that = this;
  var loadRocket = setTimeout(function(){ 
      that.shooting = false;  
      clearTimeout(loadRocket);
  }, 500);
};

Ship.prototype.shootLasers = function (msDuration){
  // Shoot lasers while mouse is down, stop if heat is maxed out

  var that = this;
  if (this.heat > this.maxHeat) this.fireRate = 100;
  else this.heat += 20;

  if (this.fireRate < 0){
      var laser = new $laser([50, 5], that.rotation, that.velocity, that.pos);
      laser.ship = this;
      this.bullets.add(laser);
      this.fireRate = 75;
  }
  else this.fireRate -= msDuration;

};

Ship.prototype.switchWeapon = function(){
  // Cycle through weapons array when user hits SHIFT

  var i = this.weapons.indexOf(this.weapon);
  if (this.weapons[i+1] === undefined) this.weapon = this.weapons[0];
  else this.weapon = this.weapons[i+1];
};

Ship.prototype.collide = function (){

  // Check for collision with projectiles
  var collide = gamejs.sprite.spriteCollide(this, $g.projectiles, true);
  if (collide.length > 0){
    this.damage(50);
    this.velocity[0] = this.velocity[0]/10;
    this.velocity[1] = this.velocity[1]/10;
  }
}

Ship.prototype.kill = function(){
    // TODO add more stuff when the user dies
    alert('You died');
    location.reload();
}

Ship.prototype.damage = function(amount){
  // Reduce health by 'amount' also kill user if health below 0
  this.health -= amount;
  if (this.health < 0) this.kill();
}

exports.Ship = Ship;