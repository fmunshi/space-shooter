var gamejs = require('gamejs');
var $g = require('globals');
var $e = require('gamejs/event');
var $v = require('gamejs/utils/vectors');
var $m = require('gamejs/utils/math');
var $rocket = require('rocket').Rocket;

var Ship = function(rect) {
  // call superconstructor
  Ship.superConstructor.apply(this, arguments);
  this.image = gamejs.image.load("./images/ship.png");
  this.originalImage = gamejs.transform.scale(this.image, [80, 80] );
  this.image = gamejs.transform.rotate(this.originalImage, 90);
  
  // [x,y]
  this.pos = [0,0];
  this.velocity = [0,0];

  //Angle in radians
  this.rotation = 0;
  this.shooting = false;

  this.rect = new gamejs.Rect(rect);
  this.rect.x = 500;
  this.rect.y = 500;

  this.rockets = new gamejs.sprite.Group();

  return this;
};
gamejs.utils.objects.extend(Ship, gamejs.sprite.Sprite);




Ship.prototype.update = function(msDuration) {
  this.rockets.update(msDuration);
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
    this.shootRockets(event);
  }
  if (event.type === $e.KEY_DOWN) {
    this.move(event);
  }
};

Ship.prototype.draw = function (display){
  display.blit(this.image, this.rect);
  this.rockets.draw(display);

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
  if (this.shooting){
    console.log('Loading bullet');
  }
  else {
      var rocket = new $rocket([25, 60], $m.degrees(this.rotation)+90);
      var vX = 10*Math.cos(this.rotation);
      var vY = 10*Math.sin(this.rotation);
      rocket.velocity = [vX, vY];
      if (vX < 0) var position = [this.rect.right+20,this.rect.bottom+40];
      else var position = [this.rect.right+50,this.rect.bottom+30];
      rocket.rect.center = position;
      this.rockets.add(rocket);
      this.shooting = true;
      var loadRocket = setTimeout(function(){ 
        that.shooting = false;
        clearTimeout(loadRocket);
      }, 500);
  }
};

exports.Ship = Ship;