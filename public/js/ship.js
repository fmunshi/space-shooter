var gamejs = require("gamejs");
var $g = require("globals");
var $e = require("gamejs/event");
var $m = require("gamejs/utils/math");
var $rocket = require("bullets/rocket").Rocket;
var $laser = require("bullets/laser").Laser;

var Ship = function(rect) {
  // call superconstructor
  Ship.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/Player/ship.png");
  this.originalImage = gamejs.transform.scale(this.image, rect);
  this.image = gamejs.transform.rotate(this.originalImage, 90);
  
  // [x,y]
  this.pos = [0,0];
  this.velocity = [5,5];
  this.size = rect

  this.spray = false;
  this.invincible = false;

  //Angle in radians
  this.rotation = 0;

  this.stats = {
    fireRate    :   100,
    maxSpeed    :   15,
    weapons     :   ["rocket", "laser"],
    maxHealth   :   1000,
    maxHeat     :   1000,
    damage      :   100,
    defense     :   100,
    luck        :   0.1,
    exp         :   100
  };

  this.level = 1;
  this.exp = 0;

  // Stat related stuff
  this.health = this.stats.maxHealth;       // Health left
  this.heat = 0;            // Heat for lasers
  this.weapon = "rocket";   // Default weapon is rocket
  this.firing = false;      // For shooting lasers
  this.shooting = false;    // For loading rockets
  this.xmove = 0;
  this.ymove = 0;

  // Rect stuff
  this.rect = new gamejs.Rect(rect);
  this.rect.width = this.image.rect.width;
  this.rect.height = this.image.rect.height;
  this.rect.center = this.pos;

  // All dem bullets
  this.bullets = new gamejs.sprite.Group();

  return this;
};
gamejs.utils.objects.extend(Ship, gamejs.sprite.Sprite);


Ship.prototype.update = function(msDuration) {

  if (this.heat > 0) this.heat -= 10;
  if (this.firing) this.shootLasers(msDuration);
  this.move();

  this.bullets.update(msDuration);
  this.collide();
  this.checkbounds();

  this.calculateAngle($g.mouse);

  var velocity = $g.calcVelocity(msDuration, this.velocity);
      this.moveIp(velocity);
      this.decelerate(velocity);
};


Ship.prototype.handle = function(event){

  if (event.type === $e.MOUSE_MOTION) {
      $g.mouse = event.pos;
  }

  else if (event.type === $e.MOUSE_DOWN){
    $g.mouse = event.pos;
    // if (this.weapon === "rocket") this.shootRockets(event);
    this.firing = true;
  }

  else if (event.type === $e.KEY_DOWN) {
    // if (event.key === $e.K_SHIFT) this.switchWeapon();
    if (event.key === $e.K_SPACE) this.shootRockets(event);
    this.changeDirection(event);
  }

  else if (event.type == $e.KEY_UP){
    if (event.key === $e.K_a) {
      if(this.xmove === 1) {
        this.xmove = 0;
      }
    }
    else if (event.key === $e.K_s){
      if(this.ymove === 1) {
        this.ymove = 0;
      }
    } 
    else if (event.key === $e.K_w){
      if(this.ymove === -1) {
        this.ymove = 0;
      }
    }
    else if (event.key === $e.K_d){
      if(this.xmove === -1) {
        this.xmove = 0;
      }
    } 
  }

  else if (event.type === gamejs.event.MOUSE_UP) {
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
    if (Math.abs(this.velocity[1]) < this.stats.maxSpeed){
      that.velocity[1] += that.ymove;
    }
    if (Math.abs(this.velocity[0]) < this.stats.maxSpeed){
      that.velocity[0] -= that.xmove;
    }
};

Ship.prototype.decelerate = function(velocity){
  if (this.velocity[0] < 1 && this.velocity > -1)       this.velocity[0] = 0;
  if (this.velocity[1] < 1 && this.velocity > -1)       this.velocity[1] = 0;
  if (this.velocity[0] > 0)                             this.velocity[0] -= this.velocity[0]/10;
  else if (this.velocity[0] < 0)                        this.velocity[0] -= this.velocity[0]/10;
  if (this.velocity[1] > 0)                             this.velocity[1] -= this.velocity[1]/10;
  else if (this.velocity[1] < 0)                        this.velocity[1] -= this.velocity[1]/10;
  if (this.velocity[0] === 0 && this.velocity[1] === 0) this.image = gamejs.image.load("./images/Player/ship.png");
};

Ship.prototype.checkbounds = function(){
    // Check if user is out of bounds of the screen

    // Left
    if (this.pos[0] < 0)                          this.pos[0] = $g.game.screenSize[0]-100;
    // Right
    if (this.pos[0] > $g.game.screenSize[0]-10)   this.pos[0] = 0; 
    // Bottom
    if (this.pos[1] < 10)                         this.pos[1] = $g.game.screenSize[1]-10;
    // Top
    if (this.pos[1] > $g.game.screenSize[1])      this.pos[1] = 0;
};


Ship.prototype.calculateAngle = function (pos){
  // Calculate the ships rotation and adjust image size based on it

  var mX = pos[0] - 30
    , mY = pos[1] - 30
    , sX = this.pos[0]
    , sY = this.pos[1]
    , dY = mY - sY
    , dX = mX - sX;

  var angle = Math.atan(dY/dX);
      angle = $m.degrees(angle);

  // Quadrant Two
  if ((dX < 0) && (dY < 0))       angle -= 180;
  // Quadrant Three
  else if ((dX < 0) && (dY > 0))  angle += 180;

  this.rotation = $m.radians(angle);
  this.image = gamejs.transform.rotate(this.originalImage, angle+90);

  this.rect.width = this.image.rect.width;
  this.rect.height = this.image.rect.height;

};

Ship.prototype.shootRockets = function (event){
  // Ship shoots rockets, on mouse down, if the user has rockets selected
  var that = this;
  if (!this.shooting) {
      var rocket = new $rocket([20, 50], that);
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
  }, 1000);
};

Ship.prototype.shootLasers = function (msDuration){
  // Shoot lasers while mouse is down, stop if heat is maxed out

  var that = this;
  if (this.heat > this.stats.maxHeat)   this.stats.fireRate = 100;
  else if (!this.spray)                 this.heat += 20;

  if (this.stats.fireRate < 0){
      var laser = new $laser([50, 5], that);
      // laser.ship = that;
      this.bullets.add(laser);
      this.stats.fireRate = 75;
  }
  else this.stats.fireRate -= msDuration;

};

Ship.prototype.switchWeapon = function(){
  // Cycle through weapons array when user hits SHIFT

  var i = this.stats.weapons.indexOf(this.weapon);
  if (this.stats.weapons[i+1] === undefined) this.weapon = this.stats.weapons[0];
  else this.weapon = this.stats.weapons[i+1];
};

Ship.prototype.changeDirection = function(event){

    var angle = $m.degrees(this.rotation);

    this.image = gamejs.image.load("./images/Player/ship.png");

    if (event.key === $e.K_a) {
      this.xmove = 1;
      if (Math.abs(angle) > 50) this.image = gamejs.image.load("./images/Player/rightShip.png");
    }
    else if (event.key === $e.K_s){
      this.ymove = 1;
      this.image = gamejs.image.load("./images/Player/rightShip.png");
      if (Math.abs(angle) > 50) this.image = gamejs.image.load("./images/Player/ship.png");
    } 
    else if (event.key === $e.K_w){
      this.ymove = -1;
      this.image = gamejs.image.load("./images/Player/leftShip.png");
      if (Math.abs(angle) > 50) this.image = gamejs.image.load("./images/Player/ship.png");
    }
    else if (event.key === $e.K_d){
      this.xmove = -1;
      if (Math.abs(angle) > 50) this.image = gamejs.image.load("./images/Player/rightShip.png");
    } 

    this.originalImage = gamejs.transform.scale(this.image, this.size);
    this.image = gamejs.transform.rotate(this.originalImage, angle+90);

    this.rect.width = this.image.rect.width;
    this.rect.height = this.image.rect.height;
}

Ship.prototype.collide = function (){

  // Check for collision with projectiles
  var collide = gamejs.sprite.spriteCollide(this, $g.projectiles, true);
  var powerups = gamejs.sprite.spriteCollide(this, $g.powerups, true);
  if (collide.length > 0){
    this.damage(0.5*this.stats.defense);
    this.velocity[0] = this.velocity[0]/10;
    this.velocity[1] = this.velocity[1]/10;
  }
}

Ship.prototype.kill = function(){
    // TODO add more stuff when the user dies
    // alert("You died");
    $g.game.isEnded = true;
    // location.reload();
}

Ship.prototype.damage = function(amount){
  // Reduce health by "amount" also kill user if health below 0
  if (!this.invincible){
    this.health -= amount;
    if (this.health < 0) this.kill();    
  }
}

Ship.prototype.reload = function(){
  this.rotation = 0;
  // [x,y]
  // this.pos = [100,100];
  // this.velocity = [0.1,0.1];
  // this.rect.center = [100,100];

  //Angle in radians
  this.rotation = 0;
  this.moving = false;

  // Stat related stuff
  this.health = this.stats.maxHealth;
  // All dem bullets
  this.bullets = new gamejs.sprite.Group();

}

Ship.prototype.addExp = function(amount){
  this.exp += amount;
  if (this.exp > this.stats.exp){
    this.exp = this.exp - this.stats.exp;
    this.level += 1;
    this.stats.exp += this.level*this.level;

    console.log('LEVELED UP TO: '+this.level);
    
    this.stats.maxHealth += 10;
    this.stats.maxHeat += 20;

    if (this.level%2 === 0)   this.stats.defense += 5;

    if (this.level%3 === 0)   this.stats.damage += 5;

    if (this.level%5 === 0 && this.stats.luck < 0.2)   this.stats.luck += 0.01;

    console.warn(this.stats)
  }
  $g.score += amount;
}

exports.Ship = Ship;