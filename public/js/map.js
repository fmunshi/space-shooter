var $g = require("globals");
var $ship = require("ship").Ship;
var gamejs = require("gamejs");


var Star = exports.Star =  function() {
  // call superconstructor
  Star.superConstructor.apply(this, arguments);
  this.size = Math.random()*20;
  this.angle = Math.random()*360;

  if (Math.random() < 0.5) this.speedY = 0;
  else this.speedY = 0;

  this.speedX = -(Math.random()*5 + 5);

  this.image = gamejs.image.load("./images/Map/star.png");
  this.originalImage = gamejs.transform.scale(this.image, [this.size, this.size] );
  this.image = gamejs.transform.rotate(this.originalImage, this.angle);
  
  this.velocity = [this.speedX, this.speedY];
  this.rect = new gamejs.Rect([this.size, this.size]);
  this.pos = [$g.game.screenSize[0], Math.random()*$g.game.screenSize[1]];
  this.rect.center = this.pos;

  return this;
};
gamejs.utils.objects.extend(Star, gamejs.sprite.Sprite);


Star.prototype.update = function (msDuration){
  var velocity = $g.calcVelocity(msDuration, this.velocity);
	this.rect.moveIp(velocity);
};

Star.prototype.checkbounds = function(){
  	var that = this;
    var pos = this.rect.center;
    if ( (pos[0] < - 150) || (pos[0] > $g.game.screenSize[0] + 100) || (pos[1] < -100) || (pos[1] > $g.game.screenSize[1] + 100) )  { 
      this.rect.center = this.pos;
    }
};

var drawStars = exports.drawStars = function (display, msDuration){

  // DEBUG: FPS
  // var font = new gamejs.font.Font("20px monospace", "#AA0000");
  // display.blit(font.render("FPS" + Math.floor(1000/msDuration)), [10,30]);
  var stars = $g.stars;
  stars.forEach(function(star){
    star.checkbounds();
    star.draw(display);
    star.update(msDuration);
  });

};

var drawHealth = exports.drawHealth = function(display){

  display.blit($g.fonts.small.render("Level: "+$g.level.number, "#999"), [50, $g.game.screenSize[1]-100]);
  display.blit($g.fonts.small.render("Score: "+$g.score, "#999"), [50, $g.game.screenSize[1]-150]);

  if ($g.ship.invincible){
      var bg = new gamejs.Surface($g.game.screenSize);
      bg.fill("#EEE");
      bg.setAlpha(0.8);
      display.blit(bg, [0,0]);
  }
  else if ($g.ship.spray) {
    var bg = new gamejs.Surface($g.game.screenSize);
    bg.fill("#33F");
    bg.setAlpha(0.8);
    display.blit(bg, [0,0]);
  }
  else if ($g.ship.health/$g.ship.stats.maxHealth < 0.1) {
    var bg = new gamejs.Surface($g.game.screenSize);
    bg.fill("#F00000");
    bg.setAlpha(0.8);
    display.blit(bg, [0,0]);
  }
  
  gamejs.draw.rect(display, "#00AA00", new gamejs.Rect([$g.ship.pos[0]-50, $g.ship.pos[1]-50], [$g.ship.health / $g.ship.stats.maxHealth * $g.ship.originalImage.getSize()[0], 2]), 0);
  gamejs.draw.rect(display, "#FF0A00", new gamejs.Rect([$g.ship.pos[0]-50, $g.ship.pos[1]-40], [$g.ship.heat / $g.ship.stats.maxHeat * $g.ship.originalImage.getSize()[0], 2]), 0);

  $g.eShips.forEach(function(eShip){
      gamejs.draw.rect(display, "#00AA00", new gamejs.Rect([eShip.pos[0]-50, eShip.pos[1]-50], [eShip.health / eShip.stats.maxHealth * eShip.originalImage.getSize()[0], 2]), 0);
      gamejs.draw.rect(display, "#FF0A00", new gamejs.Rect([eShip.pos[0]-50, eShip.pos[1]-40], [eShip.heat / eShip.stats.maxHeat * eShip.originalImage.getSize()[0], 2]), 0);
  });

}

var drawScore = exports.drawScore = function(display){

    display.blit($g.fonts.small.render('Score', '#FFFFFF'), [$g.game.screenSize[0] / 2 - 150, $g.game.screenSize[1] / 2 - 36]);
    display.blit($g.fonts.small.render('Level', '#FFFFFF'), [$g.game.screenSize[0] / 2 - 150, $g.game.screenSize[1] / 2]);
    display.blit($g.fonts.small.render('Time', '#FFFFFF'), [$g.game.screenSize[0] / 2 - 150, $g.game.screenSize[1] / 2 + 36]);
    // display.blit($g.fonts.small.render('TOTAL', '#FFFFFF'), [$g.game.screenSize[0] / 2 - 150, $g.game.screenSize[1] / 2 + 108]);

    display.blit($g.fonts.small.render($g.score, '#FFFFFF'), [$g.game.screenSize[0] / 2 + 125, $g.game.screenSize[1] / 2 - 36]);
    display.blit($g.fonts.small.render($g.level.number, '#FFFFFF'), [$g.game.screenSize[0] / 2 + 125, $g.game.screenSize[1] / 2]);
    display.blit($g.fonts.small.render(($g.totalTime / 1000) + 's', '#FFFFFF'), [$g.game.screenSize[0] / 2 + 125, $g.game.screenSize[1] / 2 + 36]);
    // display.blit($g.fonts.small.render(total, '#FFFFFF'), [$g.game.screenSize[0] / 2 + 125, $g.game.screenSize[1] / 2 + 108]);
}