var gamejs = require("gamejs");
var $g = require("globals");

//General Powerup class

var Powerup =  function(pos) {
  // call superconstructor
  Powerup.superConstructor.apply(this, arguments);
  var create = false;
  if (Math.random() < $g.ship.stats.luck) create = true;
  // create = true; // hack

  var types = ["health", "invincible", "kill", "spray"];

  this.index = Math.floor(Math.random()*types.length);
  // this.index = 3; // hack
  this.type = types[this.index]
  this.size = [40,40];

  this.image = gamejs.image.load("./images/Powerups/"+this.type+".png");


  this.originalImage = gamejs.transform.scale(this.image, this.size);
  this.image = gamejs.transform.rotate(this.originalImage, Math.random()*360);

  this.rect = new gamejs.Rect(this.size);
  this.pos = pos;
  this.rect.center = pos;

  if (create) {
    var that = this;
    $g.powerups.add(this);
    setTimeout(function(){
      $g.powerups.remove(that);
    }, 3000);

    if ($g.powerups.length() > 5) $g.powerups.shift();

  }
};

gamejs.utils.objects.extend(Powerup, gamejs.sprite.Sprite);

Powerup.prototype.update = function(msDuration){
  this.rect.moveIp([-10,0]);
}


Powerup.prototype.kill = function (){
  switch (this.index) {
    // case 0:
    //   $g.ship.stats.damage *= 2;
    //   setTimeout(function(){
    //     $g.ship.stats.damage *= 0.5;
    //     console.log($g.ship.stats.damage);
    //   }, 10000);
    //   // Damage Double
    //   break;

    case 0:
      $g.ship.health = $g.ship.stats.maxHealth;
      // Health refill
      break;

    case 1:
      $g.ship.invincible = true;
      setTimeout(function(){
        $g.ship.invincible = false;
      }, 10000);
      // invincible
      break;

    case 2:
      // kill
      $g.eShips.forEach(function(ship){
        ship.kill();
        $g.ship.addExp(ship.exp);
      });

      $g.projectiles.forEach(function(proj){
        proj.kill();
        $g.ship.addExp(1)
      });

      break;
    case 3:
    // spray
      $g.ship.spray = true;
      setTimeout(function(){
        $g.ship.spray = false;
      }, 10000);
    break;
  }

  $g.powerups.remove(this);
};

exports.Powerup = Powerup;